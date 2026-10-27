import { describe, expect, it, vi } from 'vitest';
import webPushService from '../src/service/web-push-service';
import webPushCrypto from '../src/utils/web-push-crypto';

function createMockKv() {
	const map = new Map();
	return {
		get: vi.fn(async (key, opt) => {
			const val = map.get(key);
			if (val === undefined) return null;
			if (opt && opt.type === 'json') {
				try {
					return JSON.parse(val);
				} catch (e) {
					return val;
				}
			}
			return val;
		}),
		put: vi.fn(async (key, val) => {
			map.set(key, typeof val === 'string' ? val : JSON.stringify(val));
		}),
		delete: vi.fn(async (key) => {
			map.delete(key);
		}),
		list: vi.fn(async ({ prefix }) => {
			const keys = [];
			for (const k of map.keys()) {
				if (k.startsWith(prefix)) {
					keys.push({ name: k });
				}
			}
			return { keys };
		}),
		_dump: () => map
	};
}

describe('Web Push Service Suite', () => {
	it('generates and stores VAPID keys into KV on demand', async () => {
		const kv = createMockKv();
		const mockContext = { env: { kv } };

		const key1 = await webPushService.getVapidPublicKey(mockContext);
		expect(typeof key1).toBe('string');
		expect(key1.length).toBeGreaterThan(20);

		// Second call should reuse stored keys
		const key2 = await webPushService.getVapidPublicKey(mockContext);
		expect(key2).toBe(key1);
		expect(kv.put).toHaveBeenCalledTimes(1);
	});

	it('subscribes and unsubscribes client subscriptions properly', async () => {
		const kv = createMockKv();
		const mockContext = { env: { kv } };

		const sub = {
			endpoint: 'https://web.push.apple.com/test-token-12345',
			keys: {
				p256dh: 'test-p256dh-key',
				auth: 'test-auth-key'
			}
		};

		const res = await webPushService.subscribe(mockContext, 42, sub, {
			accountEmail: 'su@codex.internal'
		});
		expect(res.success).toBe(true);
		expect(res.subHash).toBeDefined();

		const listRes = await kv.list({ prefix: 'push_sub:42:' });
		expect(listRes.keys.length).toBe(1);

		const unres = await webPushService.unsubscribe(mockContext, 42, sub.endpoint);
		expect(unres.success).toBe(true);

		const listAfter = await kv.list({ prefix: 'push_sub:42:' });
		expect(listAfter.keys.length).toBe(0);
	});

	it('dispatches encrypted payload and purges expired 410 subscriptions', async () => {
		const kv = createMockKv();
		const mockContext = {
			env: {
				kv,
				admin: 'admin@codex.internal'
			}
		};

		const clientKeyPair = await crypto.subtle.generateKey(
			{ name: 'ECDH', namedCurve: 'P-256' },
			true,
			['deriveBits']
		);
		const clientPubKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', clientKeyPair.publicKey));
		const clientP256dh = webPushCrypto.base64UrlEncode(clientPubKeyRaw);
		const clientAuth = webPushCrypto.base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));

		const sub = {
			endpoint: 'https://web.push.apple.com/endpoint-expired',
			keys: {
				p256dh: clientP256dh,
				auth: clientAuth
			}
		};

		await webPushService.subscribe(mockContext, 99, sub);

		// Mock global fetch returning 410 Gone (Apple APNs device unregistered)
		const originalFetch = globalThis.fetch;
		globalThis.fetch = vi.fn().mockResolvedValue({
			status: 410,
			statusText: 'Gone'
		});

		try {
			const payload = { title: '测试标题', body: '测试内容' };
			const res = await webPushService.sendNotificationToUser(mockContext, 99, payload);
			expect(res.count).toBe(1);
			expect(res.sent).toBe(0);

			// Should have called APNs endpoint
			expect(globalThis.fetch).toHaveBeenCalledTimes(1);
			const fetchCall = globalThis.fetch.mock.calls[0];
			expect(fetchCall[0]).toBe(sub.endpoint);
			expect(fetchCall[1].headers['Content-Encoding']).toBe('aes128gcm');
			expect(fetchCall[1].headers.Authorization).toContain('vapid t=');

			// Should have deleted expired record
			const listAfter = await kv.list({ prefix: 'push_sub:99:' });
			expect(listAfter.keys.length).toBe(0);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
