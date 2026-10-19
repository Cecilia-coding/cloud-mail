import { describe, expect, it, vi } from 'vitest';
import { resolvePersonaKey, runPrivacyProbe } from '../src/api/privacy-api';

describe('privacy probe', () => {
  it('blocks silent mode without making an outbound request', async () => {
    const fetchImpl = vi.fn();

    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/pixel.gif', personaKey: 'silent_block' },
      { fetchImpl }
    );

    expect(response.code).toBe(200);
    expect(response.data).toMatchObject({
      personaKey: 'silent_block',
      isSilent: true,
      statusText: 'Blocked by Silent Mode'
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('keeps interception active while the optional egress mount is switched off', async () => {
    const fetchImpl = vi.fn();
    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/pixel.gif', personaKey: 'smart_fridge', egressMode: 'off' },
      { fetchImpl }
    );

    expect(response.data).toMatchObject({
      isSilent: true,
      egressMode: 'off',
      egressLabel: '仅拦截',
      statusText: 'Blocked by Egress Switch'
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('dispatches a signed task through the optional Webshare relay', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        statusCode: 204,
        statusText: 'No Content',
        node: 'Webshare · Frankfurt #1',
        egress: { label: 'Frankfurt #1', country: 'DE', city: 'Frankfurt' }
      })
    });
    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/open', personaKey: 'smart_fridge', egressMode: 'webshare' },
      {
        fetchImpl,
        env: {
          EGRESS_RELAY_URL: 'https://relay.example/api/probe',
          EGRESS_RELAY_SECRET: 'shared-secret'
        }
      }
    );

    expect(response.data).toMatchObject({
      statusCode: 204,
      egressMode: 'webshare',
      egressLabel: 'Frankfurt #1',
      egressCountry: 'DE',
      egressCity: 'Frankfurt'
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][0]).toBe('https://relay.example/api/probe');
    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Cloud-Mail-Timestamp': expect.any(String),
      'X-Cloud-Mail-Signature': expect.stringMatching(/^[a-f0-9]{64}$/)
    });
  });

  it('sends the selected persona headers and returns the real target status', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 204, statusText: 'No Content' });

    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/open', personaKey: 'smart_fridge' },
      { fetchImpl, random: () => 0.25 }
    );

    expect(response.code).toBe(200);
    expect(response.data).toMatchObject({
      personaKey: 'smart_fridge',
      statusCode: 204,
      statusText: 'No Content'
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({
      'User-Agent': expect.stringContaining('SmartFridge-Hub')
    });
    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty('X-Decoy-Persona');
    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty('X-Forwarded-For');
  });

  it('keeps an overseas persona locale aligned with its device identity', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 200, statusText: 'OK' });

    await runPrivacyProbe(
      { url: 'https://tracker.example/lush', personaKey: 'lovense_lush_3' },
      { fetchImpl }
    );

    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({
      'User-Agent': expect.stringContaining('Lovense-Remote'),
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.lovense.com/remote/my-toys/lush-3'
    });
  });

  it.each([
    ['imoo_watch', 'XTC-Z6', 'Android 7.1.1'],
    ['gree_phone', 'G0335D', 'HALO OS 2.0']
  ])('dispatches the restored %s persona instead of falling back', async (personaKey, uaFragment, identityFragment) => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 200, statusText: 'OK' });

    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/restored-persona', personaKey },
      { fetchImpl }
    );

    expect(response.data).toMatchObject({ personaKey });
    expect(response.data.personaName).toContain(personaKey === 'imoo_watch' ? '小天才' : '格力');
    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({
      'User-Agent': expect.stringContaining(uaFragment),
      'Accept-Language': 'zh-CN,zh;q=0.9'
    });
    expect(JSON.stringify(response.data)).toContain(identityFragment);
  });

  it('selects a concrete persona close to the adaptive tuning target', () => {
    expect(resolvePersonaKey('adaptive_mix', { plausibility: 91, absurdity: 32 }, () => 0))
      .toBe('clover_station_duo');
  });

  it('passes through the supplied browser user agent in native mode', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 200, statusText: 'OK' });

    const response = await runPrivacyProbe(
      {
        url: 'https://tracker.example/native',
        personaKey: 'native_real',
        nativeUa: 'Browser Under Test/1.0'
      },
      { fetchImpl }
    );

    expect(response.data.userAgent).toBe('Browser Under Test/1.0');
    expect(fetchImpl.mock.calls[0][1].headers['User-Agent']).toBe('Browser Under Test/1.0');
  });

  it('rejects invalid targets before fetch', async () => {
    const fetchImpl = vi.fn();
    const response = await runPrivacyProbe({ url: 'file:///secret', personaKey: 'smart_fridge' }, { fetchImpl });

    expect(response).toEqual({ code: 400, message: '无效的目标 URL' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports outbound failures instead of claiming a successful probe', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('connection refused'));
    const response = await runPrivacyProbe(
      { url: 'https://tracker.example/fail', personaKey: 'smart_fridge' },
      { fetchImpl }
    );

    expect(response).toEqual({ code: 502, message: '诱饵投毒失败: connection refused' });
  });
});
