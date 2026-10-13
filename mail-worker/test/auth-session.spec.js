import { describe, expect, it } from 'vitest';
import authSessionService from '../src/service/auth-session-service';
import loginService from '../src/service/login-service';
import KvConst from '../src/const/kv-const';
import JwtUtils from '../src/utils/jwt-utils';

function createContext() {
	const values = new Map();
	return {
		values,
		context: {
			env: {
				jwt_secret: 'test-secret',
				kv: {
					async put(key, value) { values.set(key, value); },
					async get(key, options) {
						if (!values.has(key)) return null;
						const value = values.get(key);
						return options?.type === 'json' ? JSON.parse(value) : value;
					},
					async delete(key) { values.delete(key); },
					async list({ prefix }) {
						return {
							keys: [...values.keys()].filter(key => key.startsWith(prefix)).map(name => ({ name })),
							list_complete: true
						};
					}
				}
			}
		}
	};
}

describe('auth session storage', () => {
	it('keeps independent phone and desktop sessions', async () => {
		const { context } = createContext();
		await authSessionService.create(context, 7, 'desktop-token');
		await authSessionService.create(context, 7, 'phone-token');

		expect(await authSessionService.exists(context, 7, 'desktop-token')).toBe(true);
		expect(await authSessionService.exists(context, 7, 'phone-token')).toBe(true);

		await authSessionService.remove(context, 7, 'phone-token');
		expect(await authSessionService.exists(context, 7, 'desktop-token')).toBe(true);
		expect(await authSessionService.exists(context, 7, 'phone-token')).toBe(false);
	});

	it('migrates legacy tokens and revokes every session for a user', async () => {
		const { context, values } = createContext();
		values.set(KvConst.AUTH_INFO + 9, '{"tokens":[]}');
		await authSessionService.migrateLegacy(context, 9, ['old-a', 'old-b', 'old-a']);

		expect(await authSessionService.exists(context, 9, 'old-a')).toBe(true);
		expect(await authSessionService.exists(context, 9, 'old-b')).toBe(true);

		await authSessionService.revokeAll(context, 9);
		expect(values.has(KvConst.AUTH_INFO + 9)).toBe(false);
		expect(await authSessionService.exists(context, 9, 'old-a')).toBe(false);
		expect(await authSessionService.exists(context, 9, 'old-b')).toBe(false);
	});

	it('logs out only the token carried by the current request', async () => {
		const { context, values } = createContext();
		const userId = 11;
		const desktopToken = 'desktop-token';
		const phoneToken = 'phone-token';
		values.set(KvConst.AUTH_INFO + userId, JSON.stringify({
			tokens: [desktopToken, phoneToken],
			user: { userId, email: 'admin@example.com' }
		}));
		await authSessionService.create(context, userId, desktopToken);
		await authSessionService.create(context, userId, phoneToken);

		const jwt = await JwtUtils.generateToken(context, { userId, token: phoneToken });
		context.req = { header: () => jwt };
		await loginService.logout(context, userId);

		const authInfo = JSON.parse(values.get(KvConst.AUTH_INFO + userId));
		expect(authInfo.tokens).toEqual([desktopToken]);
		expect(await authSessionService.exists(context, userId, desktopToken)).toBe(true);
		expect(await authSessionService.exists(context, userId, phoneToken)).toBe(false);
	});
});
