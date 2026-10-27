import {
	getVapidPublicKey,
	subscribeWebPush,
	unsubscribeWebPush,
	sendTestPush
} from '@/request/web-push.js';

export function isIOS() {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false;
	}
	const ua = navigator.userAgent || '';
	const isAppleDevice = /iPad|iPhone|iPod/.test(ua);
	const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	return isAppleDevice || isIpadOs;
}

export function isStandalone() {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false;
	}
	const isSafariStandalone = Boolean(navigator.standalone);
	const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
	return isSafariStandalone || isDisplayStandalone;
}

export function checkPushSupported() {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false;
	}
	const hasSw = 'serviceWorker' in navigator;
	const hasPush = 'PushManager' in window;
	const hasNotification = 'Notification' in window;
	return hasSw && hasPush && hasNotification;
}

function urlB64ToUint8Array(base64String) {
	const remainder = base64String.length % 4;
	const paddingLength = remainder === 0 ? 0 : 4 - remainder;
	const padding = '='.repeat(paddingLength);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; i++) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function getPushStatus() {
	const supported = checkPushSupported();
	const ios = isIOS();
	const standalone = isStandalone();
	const permission = typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
	let subscribed = false;
	let endpoint = '';

	if (supported && 'serviceWorker' in navigator) {
		try {
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.getSubscription();
			if (Boolean(sub)) {
				subscribed = true;
				endpoint = sub.endpoint;
			}
		} catch (err) {}
	}

	return {
		supported,
		ios,
		standalone,
		permission,
		subscribed,
		endpoint
	};
}

export async function subscribe(accountEmail = '') {
	const supported = checkPushSupported();
	if (supported === false) {
		return {
			success: false,
			reason: 'unsupported',
			message: '当前浏览器或运行环境不支持 Web Push'
		};
	}

	const ios = isIOS();
	const standalone = isStandalone();
	if (ios && standalone === false) {
		return {
			success: false,
			reason: 'ios_not_standalone',
			message: 'iOS 需要先添加到主屏幕才能接收通知'
		};
	}

	let currentPermission = Notification.permission;
	if (currentPermission === 'default') {
		currentPermission = await Notification.requestPermission();
	}

	if (currentPermission === 'denied' || currentPermission === 'default') {
		return {
			success: false,
			reason: 'permission_denied',
			message: '通知权限未获授权'
		};
	}

	let keyRes;
	try {
		keyRes = await getVapidPublicKey();
	} catch (err) {
		const detail = err?.message || err?.data?.message || err?.statusText || '请确认后端服务已更新并重新部署';
		return {
			success: false,
			reason: 'fetch_key_failed',
			message: '获取推送公钥失败: ' + detail
		};
	}

	const vapidPublicKey =
		(typeof keyRes === 'string' ? keyRes : null) ||
		keyRes?.publicKey ||
		keyRes?.data?.publicKey ||
		keyRes?.data?.data?.publicKey ||
		'';

	if (Boolean(vapidPublicKey) === false) {
		return {
			success: false,
			reason: 'key_missing',
			message: '获取推送服务端公钥失败: 凭据响应格式不符'
		};
	}

	const registration = await navigator.serviceWorker.ready;
	const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);

	let subscription = await registration.pushManager.getSubscription();
	if (Boolean(subscription) === false) {
		subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey
		});
	}

	const subJson = subscription.toJSON();
	const subRes = await subscribeWebPush(subJson, accountEmail);

	return {
		success: true,
		subscription: subJson,
		serverResult: subRes
	};
}

export async function unsubscribe() {
	if (typeof navigator === 'undefined' || 'serviceWorker' in navigator === false) {
		return { success: false };
	}

	try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (Boolean(subscription)) {
			const endpoint = subscription.endpoint;
			await subscription.unsubscribe();
			await unsubscribeWebPush(endpoint);
		}
		return { success: true };
	} catch (err) {
		return { success: false, error: err.message };
	}
}

export async function sendTest() {
	return await sendTestPush();
}

export default {
	isIOS,
	isStandalone,
	checkPushSupported,
	getPushStatus,
	subscribe,
	unsubscribe,
	sendTest
};
