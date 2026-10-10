import { describe, expect, it, vi } from 'vitest';
import { runPrivacyProbe } from '../src/api/privacy-api';

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
      'X-Decoy-Persona': 'smart_fridge',
      'User-Agent': expect.stringContaining('SmartFridge-Hub')
    });
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
