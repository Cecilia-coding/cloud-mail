import { dispatchThroughPool, parseProxyPool, verifyRelaySignature } from '../lib/relay.js';

function sendJson(response, status, data) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(data));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false, error: 'Method Not Allowed' });
  }

  const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  const authorized = verifyRelaySignature({
    secret: process.env.RELAY_SHARED_SECRET,
    timestamp: request.headers['x-cloud-mail-timestamp'],
    signature: request.headers['x-cloud-mail-signature'],
    rawBody
  });
  if (!authorized) return sendJson(response, 401, { ok: false, error: '签名无效或任务已过期' });

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const pool = parseProxyPool(process.env.WEBSHARE_PROXY_POOL);
    const result = await dispatchThroughPool({
      targetUrl: body?.targetUrl,
      headers: body?.headers || {},
      requestId: body?.requestId,
      pool
    });
    return sendJson(response, 200, { ok: true, ...result });
  } catch (error) {
    return sendJson(response, 502, { ok: false, error: error?.message || '出口桥执行失败' });
  }
}

