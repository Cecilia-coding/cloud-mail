import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  assertPublicTarget,
  parseProxyPool,
  selectProxyStartIndex,
  verifyRelaySignature
} from '../lib/relay.js';

test('parses a labelled proxy pool without exposing a connection URL', () => {
  const pool = parseProxyPool(JSON.stringify([{
    host: '198.51.100.8',
    port: 8080,
    username: 'user',
    password: 'pass',
    country: 'DE',
    city: 'Frankfurt'
  }]));
  assert.equal(pool[0].label, 'Frankfurt, DE');
  assert.equal(pool[0].password, 'pass');
});

test('selects a stable pool slot for a task id', () => {
  assert.equal(selectProxyStartIndex('same-task', 10), selectProxyStartIndex('same-task', 10));
});

test('verifies signed tasks and rejects modified bodies', () => {
  const secret = 'test-secret';
  const timestamp = String(Date.now());
  const rawBody = '{"targetUrl":"https://example.com/pixel"}';
  const signature = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  assert.equal(verifyRelaySignature({ secret, timestamp, signature, rawBody }), true);
  assert.equal(verifyRelaySignature({ secret, timestamp, signature, rawBody: `${rawBody} ` }), false);
});

test('blocks local destinations before opening a proxy connection', async () => {
  await assert.rejects(() => assertPublicTarget('http://127.0.0.1/private'), /不可访问/);
  await assert.rejects(() => assertPublicTarget('http://metadata.google.internal/'), /不可访问/);
});

