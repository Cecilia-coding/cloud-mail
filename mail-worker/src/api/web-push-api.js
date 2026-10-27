import app from '../hono/hono';
import result from '../model/result';
import webPushService from '../service/web-push-service';

app.get('/push/vapid-public-key', async (c) => {
	try {
		const publicKey = await webPushService.getVapidPublicKey(c);
		return c.json(result.ok({ publicKey }));
	} catch (err) {
		return c.json(result.fail(err.message || '获取推送凭据失败', 500));
	}
});

app.post('/push/subscribe', async (c) => {
	try {
		const body = await c.req.json();
		const user = c.user || c.get('user') || {};
		const userId = user.userId || 0;

		if (Number(userId) <= 0) {
			return c.json(result.fail('用户未登录', 401));
		}

		const subscription = body.subscription;
		const metadata = {
			accountEmail: body.accountEmail || user.email || '',
			userAgent: c.req.header('user-agent') || ''
		};

		const res = await webPushService.subscribe(c, userId, subscription, metadata);
		if (res.success === false) {
			return c.json(result.fail(res.message || '注册推送失败', 400));
		}

		return c.json(result.ok(res));
	} catch (err) {
		return c.json(result.fail(err.message || '订阅保存异常', 500));
	}
});

app.post('/push/unsubscribe', async (c) => {
	try {
		const body = await c.req.json();
		const user = c.user || c.get('user') || {};
		const userId = user.userId || 0;

		if (Number(userId) <= 0) {
			return c.json(result.fail('用户未登录', 401));
		}

		const endpoint = body.endpoint || '';
		const res = await webPushService.unsubscribe(c, userId, endpoint);
		return c.json(result.ok(res));
	} catch (err) {
		return c.json(result.fail(err.message || '注销订阅异常', 500));
	}
});

app.post('/push/test', async (c) => {
	try {
		const user = c.user || c.get('user') || {};
		const userId = user.userId || 0;

		if (Number(userId) <= 0) {
			return c.json(result.fail('用户未登录', 401));
		}

		const payload = {
			title: '密匣测试 · 链路通畅',
			body: 'Web Push 握手与 APNs 调度验证通过\n时间: ' + new Date().toLocaleTimeString(),
			url: '/#/index',
			tag: 'test-ping-' + Date.now(),
			timestamp: Date.now()
		};

		const dispatchRes = await webPushService.sendNotificationToUser(c, userId, payload);
		return c.json(result.ok({
			sent: dispatchRes.sent,
			count: dispatchRes.count,
			message: '测试通知已调度下发'
		}));
	} catch (err) {
		return c.json(result.fail(err.message || '测试推送下发异常', 500));
	}
});
