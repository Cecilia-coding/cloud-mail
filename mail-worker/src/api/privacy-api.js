import app from '../hono/hono';
import result from '../model/result';

const PERSONA_UA_MAP = {
  // 智能卫浴与家电
  smart_fridge: {
    ua: 'Mozilla/5.0 (Linux; Tizen 4.0.0.8; SmartFridge-Hub-RF28N9780SR) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/56.0.2924.87 Safari/537.36',
    referer: 'https://hub.samsung-family-fridge.local/app/kitchen-memo',
    name: '三星 Family Hub 双开门智能冰箱',
    role: 'Tizen 4.0 · 21.5寸冷藏室厨房大屏'
  },
  smart_toilet: {
    ua: 'Mozilla/5.0 (Linux; Tizen 5.5; Kohler-Numi2-SmartToilet/Bidet-v2) AppleWebKit/537.36 (KHTML, like Gecko) KohlerBath/4.1 ToiletBrowser/2.0 Safari/537.36',
    referer: 'https://iot.kohler.local/restroom/numi-bidet/status',
    name: '科勒 Kohler Numi 2.0 尊贵智能座便器',
    role: 'Tizen 5.5 · 智能暖圈紫外除菌与烘干'
  },
  toto_washlet: {
    ua: 'Mozilla/5.0 (TOTO-Neorest-NX2; WashletOS/3.0; Actilight-UV) AppleWebKit/534.30 (KHTML, like Gecko) TOTO-Restroom-Agent/1.0',
    referer: 'https://washlet.toto.co.jp/neorest/cleaning-cycle',
    name: 'TOTO 极智卫洗丽智能坐便器 (Neorest NX2)',
    role: 'Washlet OS · 电解除菌水冲洗循环'
  },
  roomba_vacuum: {
    ua: 'iRobot-Roomba-j7+/Firmware-22.29.3 (Linux; MIPS; iRobot-OS; Vacuum-Telemetry-v3)',
    referer: 'https://cloud.irobot.local/robot/telemetry/stuck-under-sofa',
    name: 'iRobot Roomba 智能扫地机 (正在撞墙清扫)',
    role: 'iRobot OS · 卡在客厅餐桌底下'
  },

  // 赛博古董与音乐
  kindle_paperwhite: {
    ua: 'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/538.1 (KHTML, like Gecko) Version/5.0 Safari/538.1 Kindle/5.14.2 (screen 1072x1448; text-color-mode: grayscale)',
    referer: 'https://kindle.amazon.com/experimental-browser/bookshelf',
    name: 'Amazon Kindle Paperwhite (电子墨水屏)',
    role: 'Kindle OS 5.14 · 16阶灰度Carta水墨屏'
  },
  ipod_classic: {
    ua: 'Mozilla/5.0 (Apple-iPod-Classic; CPU OS 2_0_4 like Mac OS X; ClickWheel-Nav) AppleWebKit/420+ (KHTML, like Gecko) Safari/419.3',
    referer: 'http://itunes.apple.local/ipod/clickwheel-notes',
    name: 'Apple iPod Classic (160GB 机械硬盘滚轮)',
    role: 'iPod OS 2.0 · 五维机械转盘与微硬盘'
  },
  meizu_m6: {
    ua: 'Meizu-M6-miniPlayer/SP-2.004.1 (Linux; RBox; ARM9) MeizuBrowser/1.0',
    referer: 'http://meizu.com/miniplayer/lrc',
    name: '魅族 M6 miniPlayer (2006 飞利浦芯 MP3)',
    role: 'SP-2.004 · 魅族滑动触摸条与歌词显示'
  },
  nokia_n97: {
    ua: 'NokiaN97/21.0.045; SymbianOS/9.4; Series60/5.0 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1',
    referer: 'http://wap.nokia.com/mail',
    name: '诺基亚 N97 侧滑盖塞班机皇 (2009)',
    role: 'Symbian OS 9.4 · QWERTY 侧滑键盘'
  },
  nintendo_3ds: {
    ua: 'Mozilla/5.0 (Nintendo 3DS; U; ; zh) Version/1.7634.CN',
    referer: 'https://netfront.nintendo.net/browser',
    name: '任天堂 3DS LL (裸眼 3D 双屏掌机)',
    role: 'Nintendo OS · 双屏裸眼 3D 手写笔'
  },

  // 离奇海外与商业
  mcdonalds_kiosk: {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; McDonald-SelfOrder-Kiosk/K20-US) AppleWebKit/537.36 (KHTML, like Gecko) McOrderKiosk/8.4.1 Chrome/91.0.4472.164 Safari/537.36',
    referer: 'https://pos.mcdonalds.local/kiosk-ui/meal-combo-order',
    name: '麦当劳巨型立式自助点餐大屏 (选配套餐中)',
    role: 'Windows 10 IoT · 32寸触屏选配甜筒'
  },
  tesla_car: {
    ua: 'Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/108.0.5359.215 Chrome/108.0.5359.215 Safari/537.36 Tesla/2024.26.8-12345',
    referer: 'https://car.tesla.services/theater/browser',
    name: '特斯拉 Model 3 车机中控大屏 (超充站充能中)',
    role: 'Tesla OS V12 · AMD Ryzen 车机中控大屏'
  },
  playstation_5: {
    ua: 'Mozilla/5.0 (PlayStation; PlayStation 5/8.60) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    referer: 'https://playstation.net/ps5/system/guide',
    name: '索尼 PlayStation 5 次世代主机 (DualSense 手柄)',
    role: 'PlayStation OS · 4K 客厅电视与手柄晃动'
  },
  gree_phone: {
    ua: 'Mozilla/5.0 (Linux; Android 9; Gree Phone 3 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36',
    referer: 'https://gree.air-conditioner.local/iot-hub',
    name: '格力手机 3 代 (董明珠定制版)',
    role: 'Gree OS · 核心掌握空调节能协议'
  },
  imoo_watch: {
    ua: 'Mozilla/5.0 (Linux; Android 8.1.0; imoo Watch Phone Z6 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
    referer: 'https://imoo.watch.system.local/reader',
    name: '小天才儿童电话手表 Z6 旗舰版',
    role: 'Android 8.1 · 腕上翻转微屏'
  },

  // 深空科考与机甲
  nasa_rover: {
    ua: 'NASA-Perseverance-Rover/Sol-1200 (Mars-Jezero; ChemCam-RTOS 4.2; DeepSpaceNetwork)',
    referer: 'https://mars.nasa.gov/perseverance/telemetry',
    name: 'NASA 毅力号火星车 (Jezero Crater)',
    role: 'ChemCam-RTOS 4.2 · 火星深空网络'
  },
  boston_dynamics_spot: {
    ua: 'Boston-Dynamics-Spot/Robot-OS-3.3.0 (Linux; Tegra-Xavier; Autonomous-Inspection-Dog)',
    referer: 'https://spot.bostondynamics.local/mission/oil-refinery-patrol',
    name: '波士顿动力 Spot 四足机械狗 (自主勘探巡逻)',
    role: 'RobotOS 3.3 · 工业巡检四足动态平衡'
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
