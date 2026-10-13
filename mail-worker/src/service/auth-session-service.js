import KvConst from '../const/kv-const';
import constant from '../const/constant';

function sessionPrefix(userId) {
	return `${KvConst.AUTH_SESSION}${userId}:`;
}

function sessionKey(userId, token) {
	return `${sessionPrefix(userId)}${token}`;
}

const authSessionService = {
	async create(c, userId, token) {
		if (!token) return;
		await c.env.kv.put(sessionKey(userId, token), '1', {
			expirationTtl: constant.TOKEN_EXPIRE
		});
	},

	async exists(c, userId, token) {
		if (!token) return false;
		return (await c.env.kv.get(sessionKey(userId, token))) !== null;
	},

	async remove(c, userId, token) {
		if (!token) return;
		await c.env.kv.delete(sessionKey(userId, token));
	},

	async migrateLegacy(c, userId, tokens = []) {
		const uniqueTokens = [...new Set(tokens.filter(token => typeof token === 'string' && token))];
		await Promise.all(uniqueTokens.map(token => this.create(c, userId, token)));
	},

	async revokeAll(c, userId) {
		await c.env.kv.delete(KvConst.AUTH_INFO + userId);

		let cursor;
		do {
			const page = await c.env.kv.list({
				prefix: sessionPrefix(userId),
				...(cursor ? { cursor } : {})
			});
			await Promise.all(page.keys.map(item => c.env.kv.delete(item.name)));
			cursor = page.list_complete ? undefined : page.cursor;
		} while (cursor);
	}
};

export default authSessionService;
