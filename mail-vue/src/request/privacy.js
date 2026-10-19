import http from '@/axios/index.js';
import { getActiveEgressMode } from '@/utils/egress-mode.js';

/**
 * Dispatches a decoy probe from Cloudflare Worker edge proxy to poison target tracker URL
 * @param {string} url - Target tracker beacon URL
 * @param {string} personaKey - Decoy persona key (e.g. native_real, iphone_16_pro, smart_fridge)
 */
export function fireDecoyProbe(url, personaKey, options = {}) {
  const nativeUa = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return http.post('/privacy/poison', {
    url,
    personaKey,
    nativeUa,
    egressMode: options.egressMode || getActiveEgressMode(),
    tuning: options.tuning,
    delaySeconds: options.delaySeconds,
    delayMinSeconds: options.delayMinSeconds,
    delayMaxSeconds: options.delayMaxSeconds
  }, { noMsg: true });
}

export function getEgressStatus() {
  return http.get('/privacy/egress', { noMsg: true });
}

export function getDecoyArchive(limit = 40) {
  return http.get('/privacy/archive', { params: { limit }, noMsg: true });
}

export function cancelDecoyProbe(probeId) {
  return http.delete(`/privacy/archive/${probeId}`, { noMsg: true });
}
