import http from '@/axios/index.js';

/**
 * Dispatches a decoy probe from Cloudflare Worker edge proxy to poison target tracker URL
 * @param {string} url - Target tracker beacon URL
 * @param {string} personaKey - Decoy persona key (e.g. smart_fridge, imoo_watch, nokia_n97)
 */
export function fireDecoyProbe(url, personaKey) {
  return http.post('/privacy/poison', { url, personaKey }, { noMsg: true });
}
