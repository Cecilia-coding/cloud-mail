import { describe, expect, it } from 'vitest';

function base64UrlEncode(buffer) {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
	let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
	while (b64.length % 4) b64 += '=';
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) {
		bytes[i] = bin.charCodeAt(i);
	}
	return bytes;
}

function concat(...arrays) {
	const total = arrays.reduce((acc, a) => acc + a.length, 0);
	const res = new Uint8Array(total);
	let offset = 0;
	for (const a of arrays) {
		res.set(a, offset);
		offset += a.length;
	}
	return res;
}

async function encryptWebPush(payloadStr, clientP256dhBase64, clientAuthBase64) {
	const clientP256dh = base64UrlDecode(clientP256dhBase64);
	const clientAuth = base64UrlDecode(clientAuthBase64);

	const ephemeral = await crypto.subtle.generateKey(
		{ name: 'ECDH', namedCurve: 'P-256' },
		true,
		['deriveBits']
	);

	const clientPubKey = await crypto.subtle.importKey(
		'raw',
		clientP256dh,
		{ name: 'ECDH', namedCurve: 'P-256' },
		true,
		[]
	);

	const ecdhSecret = await crypto.subtle.deriveBits(
		{ name: 'ECDH', public: clientPubKey },
		ephemeral.privateKey,
		256
	);

	const serverPubKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', ephemeral.publicKey));

	const keyInfo = concat(
		new TextEncoder().encode('WebPush: info\0'),
		clientP256dh,
		serverPubKeyRaw
	);

	const ecdhKey = await crypto.subtle.importKey(
		'raw',
		ecdhSecret,
		'HKDF',
		false,
		['deriveBits']
	);

	const ikm = await crypto.subtle.deriveBits(
		{
			name: 'HKDF',
			hash: 'SHA-256',
			salt: clientAuth,
			info: keyInfo
		},
		ecdhKey,
		256
	);

	const salt = crypto.getRandomValues(new Uint8Array(16));

	const ikmKey = await crypto.subtle.importKey(
		'raw',
		ikm,
		'HKDF',
		false,
		['deriveBits', 'deriveKey']
	);

	const cek = await crypto.subtle.deriveKey(
		{
			name: 'HKDF',
			hash: 'SHA-256',
			salt: salt,
			info: new TextEncoder().encode('Content-Encoding: aes128gcm\0')
		},
		ikmKey,
		{ name: 'AES-GCM', length: 128 },
		false,
		['encrypt']
	);

	const nonceBits = await crypto.subtle.deriveBits(
		{
			name: 'HKDF',
			hash: 'SHA-256',
			salt: salt,
			info: new TextEncoder().encode('Content-Encoding: nonce\0')
		},
		ikmKey,
		96
	);
	const nonce = new Uint8Array(nonceBits);

	const payloadBytes = new TextEncoder().encode(payloadStr);
	const padded = new Uint8Array(payloadBytes.length + 1);
	padded.set(payloadBytes, 0);
	padded[payloadBytes.length] = 0x02;

	const ciphertext = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: nonce,
			tagLength: 128
		},
		cek,
		padded
	);

	const body = new Uint8Array(86 + ciphertext.byteLength);
	body.set(salt, 0);
	body[16] = 0; body[17] = 0; body[18] = 0x10; body[19] = 0;
	body[20] = 65;
	body.set(serverPubKeyRaw, 21);
	body.set(new Uint8Array(ciphertext), 86);

	return body;
}

async function decryptWebPush(bodyBytes, clientPrivateKey, clientPubKeyRaw, clientAuthBase64) {
	const salt = bodyBytes.slice(0, 16);
	const serverPubKeyRaw = bodyBytes.slice(21, 86);
	const ciphertext = bodyBytes.slice(86);
	const clientAuth = base64UrlDecode(clientAuthBase64);

	const serverPubKey = await crypto.subtle.importKey(
		'raw',
		serverPubKeyRaw,
		{ name: 'ECDH', namedCurve: 'P-256' },
		true,
		[]
	);

	const ecdhSecret = await crypto.subtle.deriveBits(
		{ name: 'ECDH', public: serverPubKey },
		clientPrivateKey,
		256
	);

	const keyInfo = concat(
		new TextEncoder().encode('WebPush: info\0'),
		clientPubKeyRaw,
		serverPubKeyRaw
	);

	const ecdhKey = await crypto.subtle.importKey('raw', ecdhSecret, 'HKDF', false, ['deriveBits']);
	const ikm = await crypto.subtle.deriveBits(
		{ name: 'HKDF', hash: 'SHA-256', salt: clientAuth, info: keyInfo },
		ecdhKey,
		256
	);

	const ikmKey = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits', 'deriveKey']);
	const cek = await crypto.subtle.deriveKey(
		{ name: 'HKDF', hash: 'SHA-256', salt: salt, info: new TextEncoder().encode('Content-Encoding: aes128gcm\0') },
		ikmKey,
		{ name: 'AES-GCM', length: 128 },
		false,
		['decrypt']
	);

	const nonceBits = await crypto.subtle.deriveBits(
		{ name: 'HKDF', hash: 'SHA-256', salt: salt, info: new TextEncoder().encode('Content-Encoding: nonce\0') },
		ikmKey,
		96
	);

	const decryptedPadded = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: new Uint8Array(nonceBits), tagLength: 128 },
		cek,
		ciphertext
	);

	const decryptedBytes = new Uint8Array(decryptedPadded);
	let end = decryptedBytes.length - 1;
	while (end >= 0 && decryptedBytes[end] === 0) end--;
	if (end >= 0 && decryptedBytes[end] === 0x02) end--;
	return new TextDecoder().decode(decryptedBytes.slice(0, end + 1));
}

async function createVapidToken({ origin, subject, privateKeyJwk }) {
	const header = { alg: 'ES256', typ: 'JWT' };
	const now = Math.floor(Date.now() / 1000);
	const claims = {
		aud: origin,
		exp: now + 12 * 3600,
		sub: subject
	};

	const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
	const encodedClaims = base64UrlEncode(new TextEncoder().encode(JSON.stringify(claims)));
	const unsignedToken = `${encodedHeader}.${encodedClaims}`;

	const privateKey = await crypto.subtle.importKey(
		'jwk',
		privateKeyJwk,
		{ name: 'ECDSA', namedCurve: 'P-256' },
		false,
		['sign']
	);

	const signatureBytes = await crypto.subtle.sign(
		{ name: 'ECDSA', hash: 'SHA-256' },
		privateKey,
		new TextEncoder().encode(unsignedToken)
	);

	return `${unsignedToken}.${base64UrlEncode(signatureBytes)}`;
}

describe('RFC 8291 Web Push Encryption Roundtrip', () => {
	it('encrypts and decrypts payload correctly with P-256 ECDH and HKDF', async () => {
		const clientKeyPair = await crypto.subtle.generateKey(
			{ name: 'ECDH', namedCurve: 'P-256' },
			true,
			['deriveBits']
		);
		const clientPubKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', clientKeyPair.publicKey));
		const clientP256dh = base64UrlEncode(clientPubKeyRaw);
		const clientAuth = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));

		const message = JSON.stringify({
			title: '新邮件到达',
			body: '发件人: test@domain.me\n主题: 密匣新信件',
			url: '/#/index?emailId=1001'
		});

		const encryptedBody = await encryptWebPush(message, clientP256dh, clientAuth);
		expect(encryptedBody.byteLength).toBeGreaterThan(86);

		const decrypted = await decryptWebPush(encryptedBody, clientKeyPair.privateKey, clientPubKeyRaw, clientAuth);
		expect(decrypted).toBe(message);
	});

	it('creates and verifies RFC 8292 VAPID tokens with P-256 ECDSA', async () => {
		const vapidKeyPair = await crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['sign', 'verify']
		);
		const privateKeyJwk = await crypto.subtle.exportKey('jwk', vapidKeyPair.privateKey);
		const token = await createVapidToken({
			origin: 'https://web.push.apple.com',
			subject: 'mailto:admin@domain.me',
			privateKeyJwk
		});

		const parts = token.split('.');
		expect(parts.length).toBe(3);

		const unsigned = `${parts[0]}.${parts[1]}`;
		const sig = base64UrlDecode(parts[2]);

		const isValid = await crypto.subtle.verify(
			{ name: 'ECDSA', hash: 'SHA-256' },
			vapidKeyPair.publicKey,
			sig,
			new TextEncoder().encode(unsigned)
		);
		expect(isValid).toBe(true);
	});
});
