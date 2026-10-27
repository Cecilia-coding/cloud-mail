self.addEventListener('push', event => {
	if (Boolean(event.data) === false) {
		return;
	}

	let payload = {};
	try {
		payload = event.data.json();
	} catch (err) {
		payload = {
			title: '密匣新信',
			body: event.data.text()
		};
	}

	const title = payload.title || '密匣新信到达';
	const options = {
		body: payload.body || '收到一封新的加密邮件',
		icon: '/mail-pwa.png',
		badge: '/mail-pwa.png',
		data: {
			url: payload.url || '/#/index'
		},
		tag: payload.tag || 'codex-mail-alert',
		renotify: true
	};

	const showTask = self.registration.showNotification(title, options).catch(() => {
		return self.registration.showNotification(title, {
			body: options.body,
			data: options.data
		});
	});

	const broadcastTask = clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
		for (const client of clientList) {
			client.postMessage({
				type: 'PUSH_NOTIFICATION_ARRIVED',
				payload
			});
		}
	}).catch(() => {});

	event.waitUntil(Promise.all([showTask, broadcastTask]));
});

self.addEventListener('notificationclick', event => {
	event.notification.close();
	const targetUrl = (event.notification.data && event.notification.data.url) || '/#/index';

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
			for (const client of clientList) {
				if (client.url.includes('/#/') && 'focus' in client) {
					client.navigate(targetUrl);
					return client.focus();
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(targetUrl);
			}
		})
	);
});
