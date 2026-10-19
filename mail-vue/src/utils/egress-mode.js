export const EGRESS_STORAGE_KEY = 'cloud_mail_decoy_egress_mode';

export const EGRESS_MODES = Object.freeze([
  {
    key: 'off',
    name: '仅拦截',
    subtitle: '不产生任何回访流量'
  },
  {
    key: 'cloudflare',
    name: 'Cloudflare 边缘',
    subtitle: '使用当前 Worker 数据中心出口'
  }
]);

const VALID_EGRESS_MODES = new Set(EGRESS_MODES.map(mode => mode.key));

export function getActiveEgressMode() {
  try {
    const stored = localStorage.getItem(EGRESS_STORAGE_KEY);
    if (VALID_EGRESS_MODES.has(stored)) return stored;
  } catch (error) {}
  return 'cloudflare';
}

export function setActiveEgressMode(mode) {
  if (!VALID_EGRESS_MODES.has(mode)) return false;
  try {
    localStorage.setItem(EGRESS_STORAGE_KEY, mode);
    return true;
  } catch (error) {
    return false;
  }
}

