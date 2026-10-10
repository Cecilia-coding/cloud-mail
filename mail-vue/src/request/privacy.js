import http from '@/axios/index.js';

/**
 * Dispatches a decoy probe from Cloudflare Worker edge proxy to poison target tracker URL
 * @param {string} url - Target tracker beacon URL
 * @param {string} personaKey - Decoy persona key (e.g. native_real, iphone_16_pro, smart_fridge)
 */
export function fireDecoyProbe(url, personaKey) {
  const nativeUa = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return http.post('/privacy/poison', { url, personaKey, nativeUa }, { noMsg: true });
}
