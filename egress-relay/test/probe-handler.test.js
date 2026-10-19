import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { processProbeRequest } from '../lib/probe-handler.js';

const env = {
  RELAY_SHARED_SECRET: 'test-secret',
  WEBSHARE_PROXY_POOL: JSON.stringify([{
    host: '198.51.100.8',
    port: 8080,
    username: 'user',
    password: 'pass',
    country: 'DE',
    city: 'Frankfurt'
  }])
};

test('rejects methods other than POST', async () => {
  const result = await processProbeRequest({ method: 'GET', headers: {}, rawBody: '', env });
  assert.equal(result.status, 405);
  assert.equal(result.headers.Allow, 'POST');
});

test('accepts a signed Netlify-style request without exposing proxy credentials', async () => {
  const timestamp = String(Date.now());
  const rawBody = JSON.stringify({
    targetUrl: 'https://example.com/pixel',
    headers: { 'User-Agent': 'Excavator/1.0' },
    requestId: 'task-1'
  });
  const signature = crypto
    .createHmac('sha256', env.RELAY_SHARED_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const result = await processProbeRequest({
    method: 'POST',
    headers: new Headers({
      'x-cloud-mail-timestamp': timestamp,
      'x-cloud-mail-signature': signature
    }),
    rawBody,
    env,
    dispatchImpl: async ({ pool }) => ({
      statusCode: 204,
      statusText: 'No Content',
      node: `Webshare · ${pool[0].label}`,
      egress: { label: pool[0].label, country: pool[0].country, city: pool[0].city }
    })
  });

  assert.equal(result.status, 200);
  assert.deepEqual(JSON.parse(result.body), {
    ok: true,
    statusCode: 204,
    statusText: 'No Content',
    node: 'Webshare · Frankfurt, DE',
    egress: { label: 'Frankfurt, DE', country: 'DE', city: 'Frankfurt' }
  });
  assert.equal(result.body.includes('198.51.100.8'), false);
  assert.equal(result.body.includes('pass'), false);
});
