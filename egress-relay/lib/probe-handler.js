import { dispatchThroughPool, parseProxyPool, verifyRelaySignature } from './relay.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

function readHeader(headers, name) {
  if (typeof headers?.get === 'function') return headers.get(name);
  return headers?.[name] ?? headers?.[name.toLowerCase()];
}

function jsonResult(status, data, extraHeaders = {}) {
  return {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
    body: JSON.stringify(data)
  };
}

export async function processProbeRequest({
  method,
  headers,
  rawBody,
  env = process.env,
  dispatchImpl = dispatchThroughPool
}) {
  if (method !== 'POST') {
    return jsonResult(405, { ok: false, error: 'Method Not Allowed' }, { Allow: 'POST' });
  }

  const authorized = verifyRelaySignature({
    secret: env.RELAY_SHARED_SECRET,
    timestamp: readHeader(headers, 'x-cloud-mail-timestamp'),
    signature: readHeader(headers, 'x-cloud-mail-signature'),
    rawBody
  });
  if (!authorized) return jsonResult(401, { ok: false, error: '签名无效或任务已过期' });

  try {
    const payload = JSON.parse(rawBody || '{}');
    const pool = parseProxyPool(env.WEBSHARE_PROXY_POOL);
    const result = await dispatchImpl({
      targetUrl: payload?.targetUrl,
      headers: payload?.headers || {},
      requestId: payload?.requestId,
      pool
    });
    return jsonResult(200, { ok: true, ...result });
  } catch (error) {
    return jsonResult(502, { ok: false, error: error?.message || '出口桥执行失败' });
  }
}
