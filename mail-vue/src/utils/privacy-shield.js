/**
 * Privacy Shield & Anti-Tracker Engine for Cloud Mail.
 *
 * Remote content is inert by default. A sender can otherwise bypass an <img>
 * filter with CSS, srcset, SVG references, media posters, or legacy background
 * attributes and learn the reader's IP address and open time.
 */

const KNOWN_TRACKER_PATTERNS = [
  /mailfoogae\.appspot\.com/i,
  /sendgrid\.net\/wf\/open/i,
  /mandrillapp\.com\/track\/open/i,
  /list-manage\.com\/track\/open/i,
  /hs-analytics\.net/i,
  /hubspot\.com\/[a-z0-9/_-]*track/i,
  /mailtrack\.io\/trace/i,
  /mixmax\.com\/api\/track/i,
  /yesware\.com\/trk/i,
  /streak\.com\/api\/[a-z0-9/_-]*pixel/i,
  /banana-tag\.com/i,
  /emltrk\.com/i,
  /superhuman\.com\/api\/[a-z0-9/_-]*track/i,
  /click\.anthropic\.com/i,
  /email\.anthropic\.com/i,
  /delivery\.anthropic\.com/i,
  /customer\.io/i,
  /cio\.com/i,
  /c-io\.net/i,
  /track\.customeriomail\.com/i,
  /e\.customeriomail\.com/i,
  /\/open\?(?:[a-z0-9_=&-]+)?/i,
  /\/wf\/open\?(?:[a-z0-9_=&-]+)?/i,
  /\/track(?:ing)?\/(?:open|pixel)/i,
  /\/pixel(?:\.gif|\.png|\.jpg|\/open)/i,
  /\/beacon(?:\.gif|\.png|\/)/i,
];

const TRUSTED_SENDERS_KEY = 'cloud_mail_trusted_senders';
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40"><rect width="100" height="40" rx="4" fill="%23eee" fill-opacity="0.3"/><text x="50" y="24" font-family="sans-serif" font-size="11" fill="%23888" text-anchor="middle">🛡️ 隔离图像</text></svg>';

const DANGEROUS_TAGS = [
  'script', 'iframe', 'frame', 'frameset', 'object', 'embed', 'form',
  'applet', 'base', 'meta', 'link'
];

const REMOTE_ATTRIBUTE_RULES = [
  { selector: 'source[src]', attribute: 'src' },
  { selector: 'source[srcset]', attribute: 'srcset' },
  { selector: 'video[src]', attribute: 'src' },
  { selector: 'video[poster]', attribute: 'poster' },
  { selector: 'audio[src]', attribute: 'src' },
  { selector: 'track[src]', attribute: 'src' },
  { selector: 'input[type="image"][src]', attribute: 'src' },
  { selector: '[background]', attribute: 'background' },
  { selector: 'image[href], use[href], feImage[href]', attribute: 'href' },
  { selector: 'image[xlink\\:href], use[xlink\\:href], feImage[xlink\\:href]', attribute: 'xlink:href' },
];

function decodeCssEscapes(value) {
  return String(value || '').replace(/\\([0-9a-f]{1,6})(?:\r\n|[\t\n\f\r ])?|\\([^\r\n\f])/gi, (_match, hex, escaped) => {
    if (hex) {
      const codePoint = Number.parseInt(hex, 16);
      if (!Number.isFinite(codePoint) || codePoint === 0 || codePoint > 0x10ffff) return '\uFFFD';
      return String.fromCodePoint(codePoint);
    }
    return escaped || '';
  });
}

function stripCssComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '');
}

function normalizeResourceValue(value) {
  return decodeCssEscapes(String(value || '').trim())
    .replace(/^(["'])([\s\S]*)\1$/, '$2')
    .trim();
}

/**
 * Returns true when an attribute/CSS value can cause a network request.
 * Relative URLs are included because Shadow DOM resolves them against the app.
 */
export function isNetworkResourceUrl(value) {
  const normalized = normalizeResourceValue(value);
  if (!normalized) return false;
  if (/^(?:data:|blob:|cid:|#)/i.test(normalized)) return false;
  return true;
}

/**
 * Extract network-capable references from CSS without attaching it to the page.
 * The decoded form catches escaped url tokens such as u\\72l(...).
 */
export function getUnsafeCssResourceUrls(cssText) {
  const css = stripCssComments(decodeCssEscapes(cssText));
  const resources = [];
  const add = value => {
    const normalized = normalizeResourceValue(value);
    if (isNetworkResourceUrl(normalized) && !resources.includes(normalized)) {
      resources.push(normalized);
    }
  };

  const urlPattern = /url\s*\(\s*(?:(["'])([\s\S]*?)\1|([^)]*?))\s*\)/gi;
  let match;
  while ((match = urlPattern.exec(css)) !== null) {
    add(match[2] ?? match[3]);
  }

  const importPattern = /@import\s+(?!url\s*\()(?:(["'])([\s\S]*?)\1|([^;\s]+))/gi;
  while ((match = importPattern.exec(css)) !== null) {
    add(match[2] ?? match[3]);
  }

  // image-set() also accepts bare quoted strings instead of url(). Removing the
  // containing declaration is safer than trying to reproduce the CSS grammar.
  const imageSetPattern = /(?:-webkit-)?image-set\s*\(([\s\S]*?)\)/gi;
  while ((match = imageSetPattern.exec(css)) !== null) {
    const body = match[1];
    const quotedPattern = /(["'])([\s\S]*?)\1/g;
    let quoted;
    let foundCandidate = false;
    while ((quoted = quotedPattern.exec(body)) !== null) {
      foundCandidate = true;
      add(quoted[2]);
    }
    if (!foundCandidate) add('[CSS image-set 外部资源]');
  }

  // Fail closed for malformed fetch syntax that the browser may still recover.
  const hasFetchSyntax = /@import\b|url\s*\(|(?:-webkit-)?image-set\s*\(/i.test(css);
  if (hasFetchSyntax && resources.length === 0) {
    const urlMatches = Array.from(css.matchAll(new RegExp(urlPattern.source, 'gi')));
    const onlyEmbeddedUrls = urlMatches.length > 0 && urlMatches.every(item => {
      const value = item[2] ?? item[3];
      return value && !isNetworkResourceUrl(value);
    });
    if (!onlyEmbeddedUrls || /@import\b|(?:-webkit-)?image-set\s*\(/i.test(css)) {
      resources.push('[CSS 外部资源]');
    }
  }

  return resources;
}

function isKnownTracker(value) {
  return KNOWN_TRACKER_PATTERNS.some(regex => regex.test(value));
}

function isBeaconImage(img, src) {
  const widthAttr = img.getAttribute('width');
  const heightAttr = img.getAttribute('height');
  const style = (img.getAttribute('style') || '').toLowerCase();
  const isZeroOrOneDim = widthAttr === '0' || widthAttr === '1' || heightAttr === '0' || heightAttr === '1';
  const isHiddenByStyle = (
    /(?:^|;)\s*display\s*:\s*none(?:\s*!important)?\s*(?:;|$)/.test(style) ||
    /(?:^|;)\s*visibility\s*:\s*hidden(?:\s*!important)?\s*(?:;|$)/.test(style) ||
    /(?:^|;)\s*opacity\s*:\s*0(?:\.0+)?(?:\s*!important)?\s*(?:;|$)/.test(style) ||
    /(?:^|;)\s*(?:width|height)\s*:\s*(?:0|1)(?:px)?(?:\s*!important)?\s*(?:;|$)/.test(style)
  );
  const matchesTrackerDomain = isKnownTracker(src);
  return { isZeroOrOneDim, isHiddenByStyle, matchesTrackerDomain };
}

function createTrackerRecord(url, flags) {
  const type = flags.isZeroOrOneDim
    ? '1x1 隐形像素 (Spy Pixel)'
    : (flags.isHiddenByStyle ? 'CSS 隐藏信标 (Hidden Beacon)' : '营销指纹追踪器 (Tracker Probe)');
  return {
    url,
    type,
    reason: flags.matchesTrackerDomain
      ? '匹配已知追踪指纹 (Anthropic / SendGrid / Customer.io)'
      : (flags.isHiddenByStyle ? '元素由内联 CSS 隐藏' : '尺寸为 0x0 或 1x1 隐形探测点'),
    status: '已就地拔除 · 阻止泄露真实 IP 与开信时间'
  };
}

function getEmptyAudit() {
  return {
    safeHtml: '',
    beaconsCount: 0,
    blockedImagesCount: 0,
    blockedResourcesCount: 0,
    isClean: true,
    detectedTrackers: [],
    blockedImages: [],
    blockedResources: []
  };
}

export function getTrustedSenders() {
  try {
    const raw = localStorage.getItem(TRUSTED_SENDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isSenderTrusted(email) {
  if (!email) return false;
  const list = getTrustedSenders();
  const normalized = email.trim().toLowerCase();
  return list.some(item => item.toLowerCase() === normalized);
}

export function addTrustedSender(email) {
  if (!email) return;
  const list = getTrustedSenders();
  const normalized = email.trim().toLowerCase();
  if (!list.includes(normalized)) {
    list.push(normalized);
    try {
      localStorage.setItem(TRUSTED_SENDERS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save trusted senders', e);
    }
  }
}

export function removeTrustedSender(email) {
  if (!email) return;
  const list = getTrustedSenders();
  const normalized = email.trim().toLowerCase();
  const updated = list.filter(item => item !== normalized);
  try {
    localStorage.setItem(TRUSTED_SENDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to remove trusted sender', e);
  }
}

/**
 * Analyzes and sanitizes email HTML before it reaches the live Shadow DOM.
 */
export function inspectAndSanitizeHtml(rawHtml, options = {}) {
  if (!rawHtml || typeof rawHtml !== 'string') return getEmptyAudit();

  const { allowExternalImages = false, senderEmail = '' } = options;
  const shouldAllowRemoteResources = allowExternalImages || (senderEmail && isSenderTrusted(senderEmail));
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  let beaconsCount = 0;
  const detectedTrackers = [];
  const blockedResources = [];
  const blockedResourceSet = new Set();

  const recordBlocked = value => {
    const normalized = normalizeResourceValue(value) || '[外部资源]';
    if (!blockedResourceSet.has(normalized)) {
      blockedResourceSet.add(normalized);
      blockedResources.push(normalized);
    }
  };

  // External stylesheets are never needed inside a mail body. Record them in
  // default-block mode before removing every dangerous element.
  doc.querySelectorAll('link[href]').forEach(link => {
    if (!shouldAllowRemoteResources && isNetworkResourceUrl(link.getAttribute('href'))) {
      recordBlocked(link.getAttribute('href'));
    }
  });
  DANGEROUS_TAGS.forEach(tag => doc.querySelectorAll(tag).forEach(el => el.remove()));

  doc.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if (['href', 'src', 'action', 'formaction', 'poster', 'background', 'xlink:href'].includes(name)) {
        const value = attr.value.trim().toLowerCase();
        if (value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:text/html')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    if (el.tagName.toLowerCase() === 'a') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer nofollow');
      const href = el.getAttribute('href');
      if (href && /^https?:\/\//i.test(href)) {
        try {
          const url = new URL(href);
          const telemetryParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'mc_cid', 'mc_eid', '_hsenc', '_hsmi', 'vero_id', 'recipient_id',
            'spMailingID', 'spUserID', 'spJobID', 'spReportId'
          ];
          let changed = false;
          telemetryParams.forEach(param => {
            if (url.searchParams.has(param)) {
              url.searchParams.delete(param);
              changed = true;
            }
          });
          if (changed) el.setAttribute('href', url.toString());
        } catch (e) {}
      }
    }
  });

  // Remove tracking images permanently. Other external images receive a local
  // placeholder until the reader explicitly allows remote content.
  doc.querySelectorAll('img').forEach(img => {
    const src = (img.getAttribute('src') || '').trim();
    const srcset = (img.getAttribute('srcset') || '').trim();
    const trackerCandidate = src || srcset;
    const flags = isBeaconImage(img, trackerCandidate);

    if (trackerCandidate && (flags.isZeroOrOneDim || flags.isHiddenByStyle || flags.matchesTrackerDomain)) {
      beaconsCount++;
      detectedTrackers.push(createTrackerRecord(trackerCandidate, flags));
      img.remove();
      return;
    }

    if (!shouldAllowRemoteResources) {
      if (src && isNetworkResourceUrl(src)) {
        recordBlocked(src);
        img.setAttribute('data-shield-src', src);
        img.setAttribute('data-shield-blocked', 'true');
        img.setAttribute('src', PLACEHOLDER_IMAGE);
        img.style.maxWidth = '180px';
        img.style.display = 'inline-block';
        img.style.border = '1px dashed rgba(160, 160, 160, 0.4)';
        img.style.borderRadius = '4px';
        img.style.padding = '2px';
      }
      if (srcset) {
        recordBlocked(srcset);
        img.setAttribute('data-shield-srcset', srcset);
        img.removeAttribute('srcset');
      }
    }
  });

  // Neutralize every other fetch-capable HTML/SVG attribute.
  if (!shouldAllowRemoteResources) {
    REMOTE_ATTRIBUTE_RULES.forEach(({ selector, attribute }) => {
      let elements = [];
      try {
        elements = doc.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      elements.forEach(el => {
        const value = (el.getAttribute(attribute) || '').trim();
        if (!value || !isNetworkResourceUrl(value)) return;
        recordBlocked(value);
        el.setAttribute(`data-shield-${attribute.replace(':', '-')}`, value);
        el.removeAttribute(attribute);
      });
    });

    // CSS is parsed only after the HTML is detached. If a style block contains
    // any network-capable construct, remove that block as one atomic unit.
    doc.querySelectorAll('style').forEach(styleEl => {
      const resources = getUnsafeCssResourceUrls(styleEl.textContent || '');
      if (!resources.length) return;
      resources.forEach(recordBlocked);
      styleEl.remove();
    });

    doc.querySelectorAll('[style]').forEach(el => {
      const resources = getUnsafeCssResourceUrls(el.getAttribute('style') || '');
      if (!resources.length) return;
      resources.forEach(recordBlocked);
      el.removeAttribute('style');
    });
  }

  const blockedResourcesCount = blockedResources.length;
  if (beaconsCount > 0 || blockedResourcesCount > 0) {
    try {
      console.groupCollapsed(
        `%c[🛡️ 密匣隐私护盾] 拦截 ${beaconsCount} 枚追踪信标，隔离 ${blockedResourcesCount} 项外部资源`,
        'color: #8a486b; font-weight: bold; background: rgba(138, 72, 107, 0.08); padding: 3px 6px; border-radius: 4px;'
      );
      if (detectedTrackers.length > 0) {
        console.log('%c已拦截信标列表 (网络请求未发出):', 'color: #b84a5b; font-weight: bold;');
        console.table(detectedTrackers);
      }
      if (blockedResources.length > 0) {
        console.log('%c已沙箱隔离的外部资源:', 'color: #8d6220; font-weight: bold;', blockedResources);
      }
      console.groupEnd();
    } catch (e) {}
  }

  return {
    safeHtml: doc.body ? doc.body.innerHTML : '',
    beaconsCount,
    blockedImagesCount: blockedResourcesCount,
    blockedResourcesCount,
    isClean: beaconsCount === 0 && blockedResourcesCount === 0,
    detectedTrackers,
    blockedImages: blockedResources,
    blockedResources
  };
}
