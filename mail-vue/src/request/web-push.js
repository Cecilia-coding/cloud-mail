import http from '@/axios/index.js';

export function getVapidPublicKey() {
	return http.get('/push/vapid-public-key', { noMsg: true });
}

export function subscribeWebPush(subscription, accountEmail) {
	return http.post('/push/subscribe', {
		subscription,
		accountEmail
	}, { noMsg: true });
}

export function unsubscribeWebPush(endpoint) {
	return http.post('/push/unsubscribe', {
		endpoint
	}, { noMsg: true });
}

export function sendTestPush() {
	return http.post('/push/test', {}, { noMsg: true });
}
