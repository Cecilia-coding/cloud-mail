import webPushCrypto from '../utils/web-push-crypto';

const KV_VAPID_KEY = 'web_push_vapid_keys';
const SUB_PREFIX = 'push_sub:';

async function sha256Hex(str) {
	const data = new TextEncoder().encode(str);
	const digest = await crypto.subtle.digest('SHA-256', data);
	const bytes = new Uint8Array(digest);
	let hex = '';
	for (let i = 0; i < 16; i++) {
		hex += bytes[i].toString(16).padStart(2, '0');
	}
	return hex;
}

export async function getVapidKeys(c) {
	const envPub = c.env.VAPID_PUBLIC_KEY;
	const envPri = c.env.VAPID_PRIVATE_KEY;

	if (Boolean(envPub) && Boolean(envPri)) {
		let privateKeyJwk = envPri;
		if (typeof envPri === 'string') {
			try {
				privateKeyJwk = JSON.parse(envPri);
			} catch (e) {
				privateKeyJwk = envPri;
			}
		}
		return {
			publicKey: envPub,
			privateKeyJwk
		};
	}

	let inMemoryKeys = null;

	if (Boolean(c?.env?.kv)) {
		const stored = await c.env.kv.get(KV_VAPID_KEY, { type: 'json' });
		if (Boolean(stored) && Boolean(stored.publicKey) && Boolean(stored.privateKeyJwk)) {
			return stored;
		}

		const generated = await webPushCrypto.generateVapidKeyPair();
		await c.env.kv.put(KV_VAPID_KEY, JSON.stringify(generated));
		return generated;
	}

	const generated = await webPushCrypto.generateVapidKeyPair();
	return generated;
}

export async function getVapidPublicKey(c) {
	const keys = await getVapidKeys(c);
	return keys.publicKey;
}

export async function subscribe(c, userId, subscription, metadata = {}) {
	if (Boolean(subscription) === false || Boolean(subscription.endpoint) === false) {
		return { success: false, message: '无效的订阅参数' };
	}

	const keys = subscription.keys || {};
	if (Boolean(keys.p256dh) === false || Boolean(keys.auth) === false) {
		return { success: false, message: '缺失加密公钥凭据' };
	}

	const subHash = await sha256Hex(subscription.endpoint);
	const keyName = SUB_PREFIX + userId + ':' + subHash;

	const record = {
		userId,
		endpoint: subscription.endpoint,
		keys: {
			p256dh: keys.p256dh,
			auth: keys.auth
		},
		accountEmail: metadata.accountEmail || '',
		userAgent: metadata.userAgent || '',
		updatedAt: Date.now()
	};

	await c.env.kv.put(keyName, JSON.stringify(record), {
		expirationTtl: 86400 * 90
	});

	return {
		success: true,
		subHash
	};
}

export async function unsubscribe(c, userId, endpoint) {
	if (Boolean(endpoint) === false) {
		return { success: false };
	}
	const subHash = await sha256Hex(endpoint);
	const keyName = SUB_PREFIX + userId + ':' + subHash;
	await c.env.kv.delete(keyName);
	return { success: true };
}

async function dispatchNotification(c, sub, payload, keyName) {
	try {
		const endpointUrl = new URL(sub.endpoint);
		const origin = endpointUrl.origin;
		const vapidKeys = await getVapidKeys(c);
		const subject = 'mailto:' + (c.env.admin || 'admin@codex.internal');

		const vapidToken = await webPushCrypto.createVapidToken({
			origin,
			subject,
			privateKeyJwk: vapidKeys.privateKeyJwk
		});

		const encryptedBody = await webPushCrypto.encryptWebPush(
			JSON.stringify(payload),
			sub.keys.p256dh,
			sub.keys.auth
		);

		const response = await fetch(sub.endpoint, {
			method: 'POST',
			headers: {
				'Content-Encoding': 'aes128gcm',
				'Content-Type': 'application/octet-stream',
				'TTL': '86400',
				'Authorization': 'vapid t=' + vapidToken + ', k=' + vapidKeys.publicKey
			},
			body: encryptedBody
		});

		if (response.status === 410 || response.status === 404) {
			await c.env.kv.delete(keyName);
			return { success: false, expired: true };
		}

		if (response.status >= 200 && response.status < 300) {
			return { success: true, status: response.status };
		}

		return { success: false, status: response.status };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

export async function sendNotificationToUser(c, userId, payload) {
	if (Boolean(userId) === false || Number(userId) <= 0) {
		return { count: 0, sent: 0 };
	}

	const listPrefix = SUB_PREFIX + userId + ':';
	const listResult = await c.env.kv.list({ prefix: listPrefix });
	const keys = listResult.keys || [];

	if (keys.length === 0) {
		return { count: 0, sent: 0 };
	}

	let sentCount = 0;
	const tasks = keys.map(async keyItem => {
		const raw = await c.env.kv.get(keyItem.name, { type: 'json' });
		if (Boolean(raw) && Boolean(raw.endpoint) && Boolean(raw.keys)) {
			const res = await dispatchNotification(c, raw, payload, keyItem.name);
			if (res.success === true) {
				sentCount += 1;
			}
		}
	});

	await Promise.all(tasks);
	return { count: keys.length, sent: sentCount };
}

export async function sendEmailNotification({ env, ctx }, emailRow, account) {
	if (Boolean(emailRow) === false) {
		return;
	}

	const targetUserId = (account && account.userId) || emailRow.userId || 0;
	if (Number(targetUserId) <= 0) {
		return;
	}

	const sender = emailRow.name || emailRow.sendEmail || '未知信使';
	const subject = emailRow.subject || '(无主题)';
	const recipient = emailRow.toEmail || '';

	const payload = {
		title: '密匣新信 · ' + sender,
		body: '主题: ' + subject + '\n收件: ' + recipient,
		url: '/#/index?emailId=' + emailRow.emailId,
		tag: 'email-' + emailRow.emailId,
		timestamp: Date.now()
	};

	await sendNotificationToUser({ env }, targetUserId, payload);
}

export default {
	getVapidKeys,
	getVapidPublicKey,
	subscribe,
	unsubscribe,
	sendNotificationToUser,
	sendEmailNotification
};
