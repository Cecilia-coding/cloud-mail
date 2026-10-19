import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveEgressMode, setActiveEgressMode } from '../src/utils/egress-mode.js';

function withStorage(run) {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value))
  };
  try {
    run();
  } finally {
    delete globalThis.localStorage;
  }
}

test('defaults to the native Cloudflare exit', () => withStorage(() => {
  assert.equal(getActiveEgressMode(), 'cloudflare');
}));

test('persists supported optional egress mounts only', () => withStorage(() => {
  assert.equal(setActiveEgressMode('webshare'), true);
  assert.equal(getActiveEgressMode(), 'webshare');
  assert.equal(setActiveEgressMode('mystery-tunnel'), false);
  assert.equal(getActiveEgressMode(), 'webshare');
}));

