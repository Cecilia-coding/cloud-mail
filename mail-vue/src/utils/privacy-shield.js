/**
 * Privacy Shield & Anti-Tracker Engine for Cloud Mail
 * 
 * 1. Detects and neutralizes invisible 0x0 / 1x1 tracking pixels (Web Beacons)
 * 2. Neutralizes known marketing tracking services (SendGrid, Mailchimp, HubSpot, Mailtrack, etc.)
 * 3. Sanitizes dangerous execution tags (<script>, <iframe>, <object>, <form>, inline on* handlers)
 * 4. Sandboxes remote external images by default to prevent IP / reading-time telemetry
 * 5. Provides trusted senders whitelist stored in localStorage
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
  /\/open\?(?:[a-z0-9_=&-]+)?/i,
  /\/wf\/open\?(?:[a-z0-9_=&-]+)?/i,
  /\/track(?:ing)?\/(?:open|pixel)/i,
  /\/pixel(?:\.gif|\.png|\.jpg|\/open)/i,
  /\/beacon(?:\.gif|\.png|\/)/i,
];

const TRUSTED_SENDERS_KEY = 'cloud_mail_trusted_senders';

/**
 * Get list of trusted senders
 */
export function getTrustedSenders() {
  try {
    const raw = localStorage.getItem(TRUSTED_SENDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Check if a sender email is trusted
 */
export function isSenderTrusted(email) {
  if (!email) return false;
  const list = getTrustedSenders();
  const normalized = email.trim().toLowerCase();
  return list.some(item => item.toLowerCase() === normalized);
}

/**
 * Add a sender to the trusted list
 */
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

/**
 * Remove a sender from the trusted list
 */
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
 * Analyzes and sanitizes email HTML with the Privacy Shield engine
 * 
 * @param {string} rawHtml - The raw HTML of the email
 * @param {object} options
 * @param {boolean} options.allowExternalImages - Whether remote images should be loaded
 * @param {string} options.senderEmail - Email of the sender to check auto-trust
 * @returns {object} { safeHtml, beaconsCount, blockedImagesCount, isClean, detectedTrackers }
 */
export function inspectAndSanitizeHtml(rawHtml, options = {}) {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return {
      safeHtml: '',
      beaconsCount: 0,
      blockedImagesCount: 0,
      isClean: true,
      detectedTrackers: []
    };
  }

  const {
    allowExternalImages = false,
    senderEmail = ''
  } = options;

  const shouldAllowImages = allowExternalImages || (senderEmail && isSenderTrusted(senderEmail));

  // Parse HTML using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  let beaconsCount = 0;
  let blockedImagesCount = 0;
  const detectedTrackers = [];

  // 1. Strip completely dangerous tags
  const DANGEROUS_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'applet', 'base', 'meta'];
  DANGEROUS_TAGS.forEach(tag => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // 2. Clean dangerous inline event handlers from all elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    const attributes = Array.from(el.attributes);
    attributes.forEach(attr => {
      const name = attr.name.toLowerCase();
      // Remove onclick, onload, onerror, onmouseover, etc.
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Remove javascript: or vbscript: or data:text/html URLs in links
      if (name === 'href' || name === 'src' || name === 'action') {
        const val = attr.value.trim().toLowerCase();
        if (val.startsWith('javascript:') || val.startsWith('vbscript:') || val.startsWith('data:text/html')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    // Harden links
    if (el.tagName.toLowerCase() === 'a') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });

  // 3. Inspect and filter <img> elements for tracking beacons and remote asset sandboxing
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    const src = (img.getAttribute('src') || '').trim();
    if (!src) return;

    const widthAttr = img.getAttribute('width');
    const heightAttr = img.getAttribute('height');
    const style = (img.getAttribute('style') || '').toLowerCase();

    // Check if image is an invisible tracking beacon:
    // (a) explicitly 0x0 or 1x1 width/height
    const isZeroOrOneDim = (widthAttr === '0' || widthAttr === '1' || heightAttr === '0' || heightAttr === '1');
    // (b) CSS hides it
    const isHiddenByStyle = (
      style.includes('display:none') ||
      style.includes('display: none') ||
      style.includes('visibility:hidden') ||
      style.includes('visibility: hidden') ||
      style.includes('opacity:0') ||
      style.includes('opacity: 0') ||
      style.includes('width:1px') ||
      style.includes('width: 1px') ||
      style.includes('width:0') ||
      style.includes('width: 0') ||
      style.includes('height:1px') ||
      style.includes('height: 1px') ||
      style.includes('height:0') ||
      style.includes('height: 0')
    );
    // (c) Matches known tracking patterns
    const matchesTrackerDomain = KNOWN_TRACKER_PATTERNS.some(regex => regex.test(src));

    if (isZeroOrOneDim || isHiddenByStyle || matchesTrackerDomain) {
      beaconsCount++;
      detectedTrackers.push(src);
      // Neutralize beacon: convert to an inert comment or remove
      img.remove();
      return;
    }

    // Check if this is an external remote image (http/https and not inline data:image)
    const isRemoteImage = /^https?:\/\//i.test(src);

    if (isRemoteImage) {
      if (!shouldAllowImages) {
        blockedImagesCount++;
        // Sandbox image: move src to data-shield-src and set a placeholder
        img.setAttribute('data-shield-src', src);
        img.setAttribute('data-shield-blocked', 'true');
        img.setAttribute('src', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40"><rect width="100" height="40" rx="4" fill="%23eee" fill-opacity="0.3"/><text x="50" y="24" font-family="sans-serif" font-size="11" fill="%23888" text-anchor="middle">🛡️ 隔离图像</text></svg>');
        img.style.maxWidth = '180px';
        img.style.display = 'inline-block';
        img.style.border = '1px dashed rgba(160, 160, 160, 0.4)';
        img.style.borderRadius = '4px';
        img.style.padding = '2px';
      }
    }
  });

  return {
    safeHtml: doc.body ? doc.body.innerHTML : '',
    beaconsCount,
    blockedImagesCount,
    isClean: beaconsCount === 0 && blockedImagesCount === 0,
    detectedTrackers
  };
}
