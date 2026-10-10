import app from '../hono/hono';
import result from '../model/result';

const PERSONA_UA_MAP = {
  smart_fridge: {
    ua: 'Mozilla/5.0 (Linux; Tizen 4.0.0.8; SmartFridge-Hub-RF28N9780SR) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/56.0.2924.87 Safari/537.36',
    referer: 'https://hub.samsung-family-fridge.local/app/kitchen-memo',
    name: '三星 Family Hub 双开门智能冰箱',
    role: 'Tizen 4.0 · 21.5寸冷藏室厨房大屏'
  },
  imoo_watch: {
    ua: 'Mozilla/5.0 (Linux; Android 8.1.0; imoo Watch Phone Z6 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
    referer: 'https://imoo.watch.system.local/reader',
    name: '小天才儿童电话手表 Z6 旗舰版',
    role: 'Android 8.1 · 腕上翻转微屏'
  },
  nokia_n97: {
    ua: 'NokiaN97/21.0.045; SymbianOS/9.4; Series60/5.0 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1',
    referer: 'http://wap.nokia.com/mail',
    name: '诺基亚 N97 侧滑盖塞班机皇 (2009)',
    role: 'Symbian OS 9.4 · QWERTY 侧滑键盘'
  },
  gree_phone: {
    ua: 'Mozilla/5.0 (Linux; Android 9; Gree Phone 3 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36',
    referer: 'https://gree.air-conditioner.local/iot-hub',
    name: '格力手机 3 代 (董明珠定制版)',
    role: 'Gree OS · 核心掌握空调节能协议'
  },
  nintendo_3ds: {
    ua: 'Mozilla/5.0 (Nintendo 3DS; U; ; zh) Version/1.7634.CN',
    referer: 'https://netfront.nintendo.net/browser',
    name: '任天堂 3DS LL (裸眼 3D 掌机)',
    role: 'Nintendo OS · 双屏裸眼 3D 手写笔'
  },
  nasa_rover: {
    ua: 'NASA-Perseverance-Rover/Sol-1200 (Mars-Jezero; ChemCam-RTOS 4.2; DeepSpaceNetwork)',
    referer: 'https://mars.nasa.gov/perseverance/telemetry',
    name: 'NASA 毅力号火星车 (Jezero Crater)',
    role: 'ChemCam-RTOS 4.2 · 火星深空网络'
  }
};

app.post('/privacy/poison', async (c) => {
  try {
    const body = await c.req.json();
    const { url, personaKey = 'smart_fridge' } = body || {};
    
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return c.json(result.error('无效的目标 URL'));
    }

    let selectedKey = personaKey;
    const concreteKeys = Object.keys(PERSONA_UA_MAP);
    if (selectedKey === 'quantum_random' || !PERSONA_UA_MAP[selectedKey]) {
      selectedKey = concreteKeys[Math.floor(Math.random() * concreteKeys.length)];
    }
    const persona = PERSONA_UA_MAP[selectedKey] || PERSONA_UA_MAP.smart_fridge;

    let statusCode = 200;
    let statusText = 'OK';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': persona.ua,
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': persona.referer,
          'Cache-Control': 'no-cache',
          'X-Forwarded-For': '198.51.100.' + (Math.floor(Math.random() * 200) + 1),
          'X-Decoy-Persona': selectedKey
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      statusCode = resp.status;
      statusText = resp.statusText;
    } catch (fetchErr) {
      statusText = fetchErr.message || 'Probe Dispatched';
    }

    return c.json(result.ok({
      targetUrl: url,
      statusCode,
      statusText,
      personaKey: selectedKey,
      personaName: persona.name,
      personaRole: persona.role,
      userAgent: persona.ua,
      referer: persona.referer,
      node: 'Cloudflare Edge Worker (Datacenter IP)'
    }));
  } catch (err) {
    return c.json(result.error(err.message || '诱饵投毒执行失败'));
  }
});
