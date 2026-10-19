import crypto from 'node:crypto';
import net from 'node:net';
import dns from 'node:dns/promises';
import { fetch, ProxyAgent } from 'undici';

const SIGNATURE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.aws.internal'
]);

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyRelaySignature({ secret, timestamp, signature, rawBody, now = Date.now() }) {
  const parsedTimestamp = Number(timestamp);
  if (!secret || !Number.isFinite(parsedTimestamp) || Math.abs(now - parsedTimestamp) > SIGNATURE_TTL_MS) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');
  return safeEqual(expected, signature);
}

export function parseProxyPool(rawValue) {
  let parsed;
  try {
    parsed = JSON.parse(rawValue || '[]');
  } catch (error) {
    throw new Error('WEBSHARE_PROXY_POOL 不是有效 JSON');
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('WEBSHARE_PROXY_POOL 尚未配置');
  }

  return parsed.map((proxy, index) => {
    const port = Number(proxy?.port);
    if (!proxy?.host || !proxy?.username || !proxy?.password || !Number.isInteger(port)) {
      throw new Error(`出口池第 ${index + 1} 项缺少 host / port / username / password`);
    }
    return {
      host: String(proxy.host),
      port,
      username: String(proxy.username),
      password: String(proxy.password),
      country: String(proxy.country || ''),
      city: String(proxy.city || ''),
      label: String(proxy.label || [proxy.city, proxy.country].filter(Boolean).join(', ') || `Proxy #${index + 1}`)
    };
  });
}

export function selectProxyStartIndex(requestId, poolLength) {
  const digest = crypto.createHash('sha256').update(String(requestId || crypto.randomUUID())).digest();
  return digest.readUInt32BE(0) % poolLength;
}

function isPrivateIpv4(address) {
  const octets = address.split('.').map(Number);
  if (octets.length !== 4 || octets.some(octet => !Number.isInteger(octet))) return false;
  return octets[0] === 10
    || octets[0] === 127
    || (octets[0] === 169 && octets[1] === 254)
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168)
    || octets[0] === 0;
}

function isPrivateIpv6(address) {
  const normalized = address.toLowerCase();
  return normalized === '::1'
    || normalized === '::'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || normalized.startsWith('fe8')
    || normalized.startsWith('fe9')
    || normalized.startsWith('fea')
    || normalized.startsWith('feb');
}

export async function assertPublicTarget(targetUrl, lookup = dns.lookup) {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (error) {
    throw new Error('目标 URL 无效');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('目标仅允许 HTTP / HTTPS');

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('目标地址不可访问');
  }

  const addresses = net.isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => (
    net.isIPv4(address) ? isPrivateIpv4(address) : isPrivateIpv6(address)
  ))) {
    throw new Error('目标地址不可访问');
  }
  return parsed;
}

function proxyUrl(proxy) {
  const username = encodeURIComponent(proxy.username);
  const password = encodeURIComponent(proxy.password);
  return `http://${username}:${password}@${proxy.host}:${proxy.port}`;
}

export async function dispatchThroughPool({ targetUrl, headers, requestId, pool, fetchImpl = fetch }) {
  await assertPublicTarget(targetUrl);
  const start = selectProxyStartIndex(requestId, pool.length);
  const attempts = Math.min(MAX_ATTEMPTS, pool.length);
  let lastError;

  for (let offset = 0; offset < attempts; offset += 1) {
    const proxy = pool[(start + offset) % pool.length];
    const dispatcher = new ProxyAgent(proxyUrl(proxy));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);
    try {
      const response = await fetchImpl(targetUrl, {
        method: 'GET',
        headers,
        dispatcher,
        redirect: 'manual',
        signal: controller.signal
      });
      await response.body?.cancel?.();
      return {
        statusCode: response.status,
        statusText: response.statusText,
        node: `Webshare · ${proxy.label}`,
        egress: {
          label: proxy.label,
          country: proxy.country,
          city: proxy.city
        }
      };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
      await dispatcher.close();
    }
  }

  throw new Error(lastError?.name === 'AbortError' ? '外接出口响应超时' : '候选出口均连接失败');
}

