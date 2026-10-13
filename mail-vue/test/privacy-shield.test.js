import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTrackerReason,
  getUnsafeCssResourceUrls,
  isInternalAttachmentUrl,
  isNetworkResourceUrl,
  shouldBlockResourceUrl
} from '../src/utils/privacy-shield.js';

test('classifies fetch-capable resource URLs and keeps embedded references local', () => {
  assert.equal(isNetworkResourceUrl('https://tracker.example/open'), true);
  assert.equal(isNetworkResourceUrl('//tracker.example/open'), true);
  assert.equal(isNetworkResourceUrl('/relative/open'), true);
  assert.equal(isNetworkResourceUrl('pixel.gif'), true);
  assert.equal(isNetworkResourceUrl('data:image/png;base64,AA=='), false);
  assert.equal(isNetworkResourceUrl('cid:logo@example.test'), false);
  assert.equal(isNetworkResourceUrl('#inline-symbol'), false);
});

test('keeps Cloud Mail attachment URLs local without trusting arbitrary relative routes', () => {
  assert.equal(isInternalAttachmentUrl('/attachments/a1b2c3.png'), true);
  assert.equal(isInternalAttachmentUrl('attachments/folder/message.eml?download=1'), true);
  assert.equal(isInternalAttachmentUrl('/attachments/../api/logout'), false);
  assert.equal(isInternalAttachmentUrl('/attachments/%2e%2e/api/logout'), false);
  assert.equal(isInternalAttachmentUrl('https://tracker.example/attachments/pixel.png'), false);
  assert.equal(shouldBlockResourceUrl('/attachments/a1b2c3.png'), false);
  assert.equal(shouldBlockResourceUrl('/api/email/latest'), true);
  assert.equal(shouldBlockResourceUrl('https://tracker.example/open'), true);
});

test('reports the strongest concrete tracker reason', () => {
  assert.equal(getTrackerReason({
    matchesTrackerDomain: false,
    isExplicitlyHiddenByStyle: false,
    isZeroOrOneDim: true,
    isHiddenByStyle: true
  }), '尺寸为 0x0 或 1x1 隐形探测点');

  assert.equal(getTrackerReason({
    matchesTrackerDomain: false,
    isExplicitlyHiddenByStyle: true,
    isZeroOrOneDim: true,
    isHiddenByStyle: true
  }), '元素由内联 CSS 隐藏');
});

test('detects remote CSS url references', () => {
  assert.deepEqual(
    getUnsafeCssResourceUrls('background-image: url("https://tracker.example/css")'),
    ['https://tracker.example/css']
  );
});

test('detects escaped url tokens and strips CSS comments', () => {
  assert.deepEqual(
    getUnsafeCssResourceUrls('background: u\\72l(/* probe */ https://tracker.example/escaped)'),
    ['https://tracker.example/escaped']
  );
});

test('detects imports and image-set string sources', () => {
  assert.deepEqual(
    getUnsafeCssResourceUrls('@import "https://tracker.example/mail.css";'),
    ['https://tracker.example/mail.css']
  );
  assert.deepEqual(
    getUnsafeCssResourceUrls('background: image-set("https://tracker.example/1x" 1x, "https://tracker.example/2x" 2x)'),
    ['https://tracker.example/1x', 'https://tracker.example/2x']
  );
});

test('keeps embedded data and fragment CSS references', () => {
  assert.deepEqual(
    getUnsafeCssResourceUrls('background:url(data:image/png;base64,AA==); filter:url(#local-filter)'),
    []
  );
});
