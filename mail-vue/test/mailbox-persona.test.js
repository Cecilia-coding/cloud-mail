import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRecipientMailboxes,
  normalizeMailboxAddress,
  resolveMessageMailbox
} from '../src/utils/mailbox-persona.js';

test('normalizes plain and display-name mailbox addresses', () => {
  assert.equal(normalizeMailboxAddress('  Me@Example.COM  '), 'me@example.com');
  assert.equal(normalizeMailboxAddress('Cecilia <Me@Example.COM>'), 'me@example.com');
});

test('extracts recipient mailboxes from API JSON', () => {
  assert.deepEqual(
    getRecipientMailboxes('[{"name":"Me","address":"Me@Example.COM"},{"email":"other@example.com"}]'),
    ['me@example.com', 'other@example.com']
  );
});

test('prefers the message recipient when the selected account is stale', () => {
  assert.equal(
    resolveMessageMailbox('[{"address":"me@example.com"}]', 'admin@example.com'),
    'me@example.com'
  );
});

test('uses the selected account when it is one of multiple recipients', () => {
  const recipients = [
    { address: 'me@example.com' },
    { address: 'admin@example.com' }
  ];

  assert.equal(resolveMessageMailbox(recipients, 'admin@example.com'), 'admin@example.com');
});

test('falls back to the selected account when message recipient data is absent', () => {
  assert.equal(resolveMessageMailbox('', 'admin@example.com'), 'admin@example.com');
});
