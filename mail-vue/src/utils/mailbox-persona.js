export function normalizeMailboxAddress(value) {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  const angleAddress = trimmed.match(/<([^<>]+)>/);
  return (angleAddress?.[1] || trimmed).trim().toLowerCase();
}

export function getRecipientMailboxes(recipient) {
  if (!recipient) return [];

  let value = recipient;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      value = JSON.parse(trimmed);
    } catch {
      value = trimmed;
    }
  }

  const entries = Array.isArray(value) ? value : [value];
  const addresses = entries
    .map((entry) => {
      if (typeof entry === 'string') return normalizeMailboxAddress(entry);
      return normalizeMailboxAddress(entry?.address || entry?.email || '');
    })
    .filter(Boolean);

  return [...new Set(addresses)];
}

export function resolveMessageMailbox(recipient, currentAccountEmail = '') {
  const recipients = getRecipientMailboxes(recipient);
  const currentAccount = normalizeMailboxAddress(currentAccountEmail);

  if (currentAccount && recipients.includes(currentAccount)) {
    return currentAccount;
  }

  return recipients[0] || currentAccount;
}
