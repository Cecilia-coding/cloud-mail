import app from '../hono/hono';
import result from '../model/result';

const PERSONA_UA_MAP = {
  // ── 现代常规与日常真机 (含绝对静默与真实原生) ───────────────────
  silent_block: {
    ua: '[BLOCKED] 绝对静默拦截 · 零请求出站',
    referer: '',
    name: '🛡️ 绝对静默拦截 (彻底禁发探针 · 零出站网络请求)',
    role: '物理沙箱级黑洞拦截 · 0 网络出站'
  },
  native_real: {
    ua: '',
    referer: '',
    name: '真实本机直出 (原生指纹 · 不做伪装)',
    role: '原生客户端透传 · 本机真实环境'
  },
  iphone_16_pro: {
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
    referer: 'https://mail.apple.com/inbox',
    name: 'Apple iPhone 16 Pro Max (主流 iOS 旗舰)',
    role: 'iOS 18.1 · Mobile Safari'
  },
  macbook_pro_m3: {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
    referer: 'https://mail.apple.com/macos-inbox',
    name: 'Apple MacBook Pro 16" (M3 Max / macOS)',
    role: 'macOS 14.7 · Safari 17.6'
  },
  windows11_pc: {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    referer: 'https://outlook.live.com/mail',
    name: 'Windows 11 旗舰台式工作站 (Chrome 130)',
    role: 'Win11 24H2 · Google Chrome 130'
  },
  pixel_9_pro: {
    ua: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
    referer: 'https://mail.google.com/mail/mu/mp',
    name: 'Google Pixel 9 Pro XL (原生 Android 15)',
    role: 'Android 15 · Chrome 130 Mobile'
  },
  ipad_pro_m4: {
    ua: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    referer: 'https://mail.apple.com/ipad-inbox',
    name: 'Apple iPad Pro 13" (M4 芯片 · iPadOS)',
    role: 'iPadOS 18.0 · Mobile Safari'
  },
  thinkpad_edge: {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    referer: 'https://outlook.office365.com/mail',
    name: 'ThinkPad X1 Carbon Gen 12 (商务轻薄本)',
    role: 'Win11 专业版 · Microsoft Edge 130'
  },
  ubuntu_linux: {
    ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
    referer: 'https://mail.google.com/mail/u/0',
    name: 'Ubuntu Linux 24.04 LTS (开发者工作站)',
    role: 'Linux x86_64 · Firefox 131'
  },

  // ── 赛博古董与已死系统 ─────────────────────────────────────────
  nokia_n97: {
    ua: 'NokiaN97/21.0.045; SymbianOS/9.4; Series60/5.0 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1',
    referer: 'http://wap.nokia.com/mail',
    name: '诺基亚 N97 侧滑盖塞班机皇 (2009)',
    role: 'Symbian OS 9.4 · QWERTY 侧滑键盘'
  },
  blackberry_bold: {
    ua: 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.342 Mobile Safari/534.11+',
    referer: 'http://bis.na.blackberry.com/client/push-mail',
    name: '黑莓 BlackBerry Bold 9900 (全键盘商务机)',
    role: 'BlackBerry OS 7.1 · 华尔街 BES 邮件推送'
  },
  palm_treo: {
    ua: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; PalmSource/hspr-H102; Blazer/4.0) 16;320x320',
    referer: 'http://palm.com/blazer-browser/memo-sync',
    name: '掌上电脑 Palm Treo 650 (手写笔电阻屏)',
    role: 'Palm OS 5.4 · 手写笔电阻屏戳击开信'
  },
  nokia_lumia: {
    ua: 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 1020) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    referer: 'https://live.com/outlook-mobile/tile-sync',
    name: '诺基亚 Lumia 1020 (已绝版 Windows Phone 8.1)',
    role: 'Windows Phone 8.1 · 4100万奥利奥磁贴'
  },
  motorola_pager: {
    ua: 'Motorola-Bravo-Pager/POCSAG-1200 (Numeric-Alphanumeric; Beeper-Alert; MsgID-9999)',
    referer: 'pager://127.0.0.1/radio-call-station/message-inbox',
    name: '摩托罗拉 Bravo 汉字寻呼机 (BB机单行绿光屏)',
    role: 'POCSAG 寻呼网 · 哔哔哔蜂鸣单行绿光'
  },
  tamagotchi_pet: {
    ua: 'Bandai-Tamagotchi/Gen1-1996 (4bit-MCU; 32x16-Pixel; PoopAlert-True; PetHunger-Level3)',
    referer: 'tamagotchi://virtual-pet/clean-poop-action',
    name: '万代电子宠物拓麻歌子 (1996 黑白像素蛋)',
    role: 'Tamagotchi OS · 32x16像素正在铲屎'
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
  nintendo_3ds: {
    ua: 'Mozilla/5.0 (Nintendo 3DS; U; ; zh) Version/1.7634.CN',
    referer: 'https://netfront.nintendo.net/browser',
    name: '任天堂 3DS LL (裸眼 3D 双屏掌机)',
    role: 'Nintendo OS · 双屏裸眼 3D 手写笔'
  },
  kindle_paperwhite: {
    ua: 'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/538.1 (KHTML, like Gecko) Version/5.0 Safari/538.1 Kindle/5.14.2 (screen 1072x1448; text-color-mode: grayscale)',
    referer: 'https://kindle.amazon.com/experimental-browser/bookshelf',
    name: 'Amazon Kindle Paperwhite (电子墨水屏)',
    role: 'Kindle OS 5.14 · 16阶灰度Carta水墨屏'
  },

  // ── 私密情趣与成人玩具 (官方真实硬件参数) ─────────────────────
  lelo_smart_vibe: {
    ua: 'LELO-F1s-V2/1.4.0 (BLE-5.0; Motor-60Hz-90Hz; Insertable-110.7mm; Weight-285g; App-Sync)',
    referer: 'https://lelo.com/f1s-v2/app-telemetry',
    name: '瑞典 LELO F1S V2 极智飞机杯 (官方真实规格)',
    role: 'LELO 官方规格 · 60Hz/90Hz 双驱 · 110.7mm'
  },
  satisfyer_pro: {
    ua: 'Satisfyer-Connect/4.12.0 (iOS; Pro2-Gen3; Length-164mm; AirPulse-PulseWave; BLE-WhisperQuiet)',
    referer: 'https://satisfyer.com/connect/session-control',
    name: '德国 Satisfyer Pro 2 Generation 3 (第三代脉冲器)',
    role: 'Air Pulse 空气波 · 16.4cm / 203g'
  },
  kiiroo_keon_1: {
    ua: 'FeelConnect/3.8.1 (Kiiroo-Keon-1; Stroke-75mm; MaxSpeed-230spm; Weight-1.1kg; WiFi-BLE)',
    referer: 'https://kiiroo.com/feelconnect/interactive-session',
    name: 'Kiiroo Keon 1 工业级往复活塞机 (重型机械设备)',
    role: 'FeelConnect · 75mm 冲程 / 1.1kg / 230spm'
  },
  kiiroo_keon_2: {
    ua: 'FeelConnect/4.2.0 (Kiiroo-Keon-2; Stroke-95mm; Velocity-684mms; Weight-996g; DualBand-WiFi)',
    referer: 'https://kiiroo.com/feelconnect/device-sync',
    name: 'Kiiroo Keon 2 次世代高速活塞驱动器 (超高线速度)',
    role: 'FeelConnect · 95mm 冲程 / 速度 684 mm/s'
  },
  kiiroo_sleeve: {
    ua: 'FeelConnect/Sleeve-Telemetry (Kiiroo-Keon-Accessory; Length-190.5mm; Diameter-47mm; Weight-193g)',
    referer: 'https://kiiroo.com/accessories/sleeve-telemetry',
    name: 'Kiiroo Keon 工业级官方配件 (Stroker Sleeve 套件)',
    role: 'FeelConnect · 长 190.5mm · Ø47mm · 193g'
  },
  wevibe_chorus: {
    ua: 'We-Connect/5.8 (Android; WeVibe-Chorus-BLE; SqueezeSensor-Active; SqueezeForce-85pct)',
    referer: 'https://we-vibe.com/we-connect/dual-vibe-telemetry',
    name: '加拿大 We-Vibe Chorus 智能双人共振感应器',
    role: 'We-Connect · Squeeze握力挤压85%实时共振'
  },

  // ── 智能卫浴与离奇厨电 ─────────────────────────────────────────
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
  smart_fridge: {
    ua: 'Mozilla/5.0 (Linux; Tizen 4.0.0.8; SmartFridge-Hub-RF28N9780SR) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/56.0.2924.87 Safari/537.36',
    referer: 'https://hub.samsung-family-fridge.local/app/kitchen-memo',
    name: '三星 Family Hub 双开门智能冰箱',
    role: 'Tizen 4.0 · 21.5寸冷藏室厨房大屏'
  },
  smart_toaster: {
    ua: 'Mozilla/5.0 (Linux; Android 7.1; SmartToaster-InstaGLO-R180) AppleWebKit/537.36 (KHTML, like Gecko) ToasterBrowser/1.0 BagelMode/Level-4 Safari/537.36',
    referer: 'https://revolutioncooking.local/toaster/browning-cycle',
    name: 'Revolution InstaGLO 触屏智能烤面包机',
    role: 'Android 7.1 · 正在烘烤酥脆全麦贝果'
  },
  roomba_vacuum: {
    ua: 'iRobot-Roomba-j7+/Firmware-22.29.3 (Linux; MIPS; iRobot-OS; Vacuum-Telemetry-v3)',
    referer: 'https://cloud.irobot.local/robot/telemetry/stuck-under-sofa',
    name: 'iRobot Roomba 智能扫地机 (正在撞墙清扫)',
    role: 'iRobot OS · 卡在客厅餐桌底下'
  },

  // ── 离奇海外与商用机台 ─────────────────────────────────────────
  mcdonalds_kiosk: {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; McDonald-SelfOrder-Kiosk/K20-US) AppleWebKit/537.36 (KHTML, like Gecko) McOrderKiosk/8.4.1 Chrome/91.0.4472.164 Safari/537.36',
    referer: 'https://pos.mcdonalds.local/kiosk-ui/meal-combo-order',
    name: '麦当劳巨型立式自助点餐大屏 (选配套餐中)',
    role: 'Windows 10 IoT · 32寸触屏选配甜筒'
  },
  ktv_kiosk: {
    ua: 'Mozilla/5.0 (Windows NT 6.1; WOW64; KTV-VOD-Player/Thunder-v9) AppleWebKit/537.36 (KHTML, like Gecko) KTVBrowser/3.0 Safari/537.36',
    referer: 'http://ktv-local-vod.lan/box-888/karaoke-playlist',
    name: 'KTV 巨型霓虹点歌机台 (切歌重唱中)',
    role: 'Windows Embedded · 伴奏青藏高原高潮破音'
  },
  vegas_slots: {
    ua: 'Mozilla/5.0 (Windows NT 10.0; IGT-SlotMachine/Advantage-Bonusing) AppleWebKit/537.36 (KHTML, like Gecko) CasinoKiosk/4.2 Safari/537.36',
    referer: 'https://casino-floor.bellagio.vegas/slot/jackpot-spin',
    name: '拉斯维加斯 777 赌场巨型老虎机台',
    role: 'IGT Advantage · 百乐宫赌场疯狂吐币'
  },
  boeing_ife: {
    ua: 'Mozilla/5.0 (Linux; Tizen 2.4; InFlight-Entertainment-Panasonic-eX3) AppleWebKit/538.1 (KHTML, like Gecko) AeroBrowser/2.1 SatelliteNet/GEO-Ka',
    referer: 'https://in-flight.wifi.aero/portal/flight-map',
    name: '波音 777-300ER 经济舱后背娱乐屏 (巡航中)',
    role: 'Panasonic eX3 · 万米巡航北极圈卫通'
  },
  tesla_car: {
    ua: 'Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/108.0.5359.215 Chrome/108.0.5359.215 Safari/537.36 Tesla/2024.26.8-12345',
    referer: 'https://car.tesla.services/theater/browser',
    name: '特斯拉 Model 3 车机中控大屏 (超充站充能中)',
    role: 'Tesla OS V12 · AMD Ryzen 车机中控大屏'
  },
  porsche_taycan: {
    ua: 'Mozilla/5.0 (X11; Porsche-PCM/6.0; Taycan-Passenger-Screen) AppleWebKit/537.36 (KHTML, like Gecko) PorscheBrowser/3.0 Safari/537.36',
    referer: 'https://porsche-connect.de/taycan/cockpit/track-mode',
    name: '保时捷 Taycan Turbo S 副驾独立屏幕',
    role: 'Porsche PCM · 纽北赛道 260km/h 极速'
  },
  playstation_5: {
    ua: 'Mozilla/5.0 (PlayStation; PlayStation 5/8.60) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    referer: 'https://playstation.net/ps5/system/guide',
    name: '索尼 PlayStation 5 次世代主机 (DualSense 手柄)',
    role: 'PlayStation OS · 4K 客厅电视与手柄晃动'
  },

  // ── 深空科考与重工重器 ─────────────────────────────────────────
  jwst_telescope: {
    ua: 'NASA-ESA-CSA-JWST/Ops-Cycle-3 (Lagrange-L2; NIRCam-CryoOS 5.1; DeepSpaceNetwork-70m)',
    referer: 'https://webbtelescope.org/telemetry/nirspec-spectroscopy',
    name: '詹姆斯·韦伯空间望远镜 (JWST · L2 节点)',
    role: 'NASA/ESA · 日地L2点150万公里红外遥测'
  },
  cern_lhc: {
    ua: 'CERN-LHC-ATLAS/Trigger-DAQ-v8 (ScientificLinux-7; RootAnalysis-6.28; 13.6TeV-Collision)',
    referer: 'https://atlas.cern/telemetry/higgs-boson-candidate',
    name: '欧洲核子中心 CERN 强子对撞机 ATLAS 节点',
    role: 'CERN ATLAS · 瑞士地下100米13.6TeV对撞'
  },
  nuclear_submarine: {
    ua: 'US-Navy-Submarine/SSN-774 (Submerged-Silent-Running; SonarCombat-RTOS 6.1; ELF-Burst-Link)',
    referer: 'http://cic.uss-virginia.navy.mil/sonar-hydrophone',
    name: '美国弗吉尼亚级核动力潜艇水下声呐终端',
    role: 'US Navy SSN · 深海200米加密长波声呐'
  },
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
  },

  // ── 极简廉价穷鬼硬件 ─────────────────────────────────────────
  walmart_onn: {
    ua: 'Mozilla/5.0 (Linux; Android 12; onn. 4K Streaming Box Build/STT2.220920.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36',
    referer: 'https://tv.walmart.com/streaming/home',
    name: '沃尔玛 Onn. 超廉价电视棒 ($14.88 塑料棒)',
    role: 'Android TV 12 · 14美元塑料超烫手电视棒'
  },
  esp8266_board: {
    ua: 'ESP8266-HTTPClient/1.2 (FreeRTOS 8.2; Xtensa-LX106; RAM-32KB-Free; Sensor-Node)',
    referer: 'http://192.168.4.1/sensor-dht11',
    name: '乐鑫 ESP8266 极简 Wi-Fi 单片机 ($1.8 裸板)',
    role: 'FreeRTOS · 面包板插着杜邦线飞线发热'
  },
  casio_calc: {
    ua: 'Casio-ClassWiz/FX-991 (Math-OS 3.0; SolarPower-Cell; CalcBrowser/0.9; MathJax-Off)',
    referer: 'calc://matrix-determinant/solve',
    name: '卡西欧 Casio 科学函数计算器 (FX-991CNX)',
    role: 'ClassWiz · 太阳能微型电池板矩阵点阵屏'
  },
  ikea_desk: {
    ua: 'IKEA-Idasen-Desk/Linak-BLE-v1.4 (Embedded-RTOS; MotorHeight-105cm; HealthTracker)',
    referer: 'ble://ikea-home-smart/desk/standing-timer',
    name: '宜家 IDÅSEN 智能电动升降桌手控板',
    role: 'Linak BLE · 电机嗡嗡升至105cm站立高度'
  }
};

export async function runPrivacyProbe(
  body,
  { requestUserAgent = '', fetchImpl = fetch, random = Math.random } = {}
) {
  const { url, personaKey = 'smart_fridge' } = body || {};

  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    return result.fail('无效的目标 URL', 400);
  }

  let selectedKey = personaKey;
  const concreteKeys = Object.keys(PERSONA_UA_MAP).filter(k => k !== 'native_real' && k !== 'silent_block');
  if (selectedKey === 'quantum_random' || !PERSONA_UA_MAP[selectedKey]) {
    selectedKey = concreteKeys[Math.floor(random() * concreteKeys.length)];
  }

  if (selectedKey === 'silent_block') {
    return result.ok({
      targetUrl: url,
      statusCode: 200,
      statusText: 'Blocked by Silent Mode',
      personaKey: 'silent_block',
      personaName: '绝对静默拦截 (彻底禁发探针 · 零网络出站)',
      personaRole: '物理沙箱级黑洞拦截 · 0 网络出站',
      userAgent: '[BLOCKED] 彻底封禁外发请求，目标端点未接收到任何流量',
      referer: '',
      node: 'Cloudflare Edge (Local Safe Block)',
      isSilent: true,
      message: '已启用绝对静默模式：已在边缘节点拦截外发请求，未向追踪器发送任何探针（0 IP 泄露，0 追踪响应）。'
    });
  }

  const persona = PERSONA_UA_MAP[selectedKey] || PERSONA_UA_MAP.smart_fridge;

  let targetUa = persona.ua;
  let targetReferer = persona.referer || '';
  if (selectedKey === 'native_real') {
    targetUa = body.nativeUa || requestUserAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
    targetReferer = '';
  }

  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        'User-Agent': targetUa,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        ...(targetReferer ? { 'Referer': targetReferer } : {}),
        'Cache-Control': 'no-cache',
        'X-Forwarded-For': '198.51.100.' + (Math.floor(random() * 200) + 1),
        'X-Decoy-Persona': selectedKey
      },
      signal: controller.signal
    });
  } catch (fetchErr) {
    return result.fail(`诱饵投毒失败: ${fetchErr.message || '网络错误'}`, 502);
  } finally {
    clearTimeout(timeout);
  }

  return result.ok({
    targetUrl: url,
    statusCode: response.status,
    statusText: response.statusText,
    personaKey: selectedKey,
    personaName: selectedKey === 'native_real' ? '真实本机直出 (未做伪装)' : persona.name,
    personaRole: selectedKey === 'native_real' ? '原生客户端透传 · 本机真实环境' : persona.role,
    userAgent: targetUa,
    referer: targetReferer,
    node: 'Cloudflare Edge Worker (Datacenter IP)'
  });
}

app.post('/privacy/poison', async (c) => {
  try {
    const response = await runPrivacyProbe(await c.req.json(), {
      requestUserAgent: c.req.header('user-agent') || ''
    });
    return c.json(response);
  } catch (err) {
    return c.json(result.fail(err.message || '诱饵投毒执行失败'));
  }
});
