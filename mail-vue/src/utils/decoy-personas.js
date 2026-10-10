/**
 * Decoy Personas & Telemetry Poisoning Engine (幽灵替身与遥测反向投毒)
 * 
 * Disguises email client identity as exotic and hilarious devices (Smart Toilet, Kindle,
 * iPod Classic, Meizu MP3, McDonald's Kiosk, Tesla Car, Roomba Vacuum, Samsung Smart Fridge,
 * PS5, Boston Dynamics Spot Dog, etc.) and dispatches spoofed telemetry via Cloudflare Worker.
 */

export const DECOY_STORAGE_KEY = 'cloud_mail_decoy_persona';

export const DECOY_CATEGORIES = [
  { key: 'all', name: '全部印籍', icon: 'solar:widget-linear' },
  { key: 'home', name: '智能卫浴与家电', icon: 'solar:bath-linear' },
  { key: 'retro', name: '赛博古董与音乐', icon: 'solar:cassette-linear' },
  { key: 'exotic', name: '离奇海外与商业', icon: 'solar:shop-2-linear' },
  { key: 'scifi', name: '深空科考与机甲', icon: 'solar:rocket-2-linear' }
];

export const DECOY_PERSONAS = [
  // ── 智能卫浴与家电 ─────────────────────────────────────────────
  {
    key: 'smart_fridge',
    category: 'home',
    name: '三星 Family Hub 双开门智能冰箱',
    shortName: '三星智能冰箱',
    emoji: '🧊',
    icon: 'solar:fridge-linear',
    badge: 'Tizen 4.0 · RF28N9780SR',
    specs: '21.5" LCD 厨房触屏 · 冰霜冷藏室模式',
    resolution: '1080 × 1920 (竖屏)',
    chip: 'Exynos 3250 双核处理器',
    userAgent: 'Mozilla/5.0 (Linux; Tizen 4.0.0.8; SmartFridge-Hub-RF28N9780SR) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/56.0.2924.87 Safari/537.36',
    referer: 'https://hub.samsung-family-fridge.local/app/kitchen-memo',
    description: '向发件人追踪服务器谎报：您正站在厨房双门冷藏室前一边拿冰镇饮料一边随手阅读邮件。'
  },
  {
    key: 'smart_toilet',
    category: 'home',
    name: '科勒 Kohler Numi 2.0 尊贵智能座便器',
    shortName: '科勒智能马桶',
    emoji: '🚽',
    icon: 'solar:bath-linear',
    badge: 'Kohler Konnect · Tizen 5.5',
    specs: '智能暖圈 · 紫外除菌 · 环绕立体声 · 臀洗水温 38°C',
    resolution: '480 × 800 (壁挂式触控遥控屏)',
    chip: 'ARM Cortex-A7 卫浴专属控温微核',
    userAgent: 'Mozilla/5.0 (Linux; Tizen 5.5; Kohler-Numi2-SmartToilet/Bidet-v2) AppleWebKit/537.36 (KHTML, like Gecko) KohlerBath/4.1 ToiletBrowser/2.0 Safari/537.36',
    referer: 'https://iot.kohler.local/restroom/numi-bidet/status',
    description: '向发件人传递至高震撼：用户正坐在带氛围灯和温水清洗的智能马桶上，心情舒畅地阅读邮件。'
  },
  {
    key: 'toto_washlet',
    category: 'home',
    name: 'TOTO 极智卫洗丽智能坐便器 (Neorest NX2)',
    shortName: 'TOTO 智能马桶',
    emoji: '🧻',
    icon: 'solar:water-sun-linear',
    badge: 'Actilight 智炫 · Washlet OS',
    specs: '电解除菌水 · 自动开合盖 · 暖风烘干 · 纳米喷嘴',
    resolution: '320 × 480 (磁吸式液晶遥控板)',
    chip: '瑞萨低功耗超静音卫浴 MCU',
    userAgent: 'Mozilla/5.0 (TOTO-Neorest-NX2; WashletOS/3.0; Actilight-UV) AppleWebKit/534.30 (KHTML, like Gecko) TOTO-Restroom-Agent/1.0',
    referer: 'https://washlet.toto.co.jp/neorest/cleaning-cycle',
    description: '告诉发件方：这封邮件刚刚伴随着高压电解除菌水冲洗声，在豪华卫生间里被一览无余。'
  },
  {
    key: 'roomba_vacuum',
    category: 'home',
    name: 'iRobot Roomba 智能扫地机器人 (正在撞墙清扫)',
    shortName: 'Roomba 扫地机',
    emoji: '🧹',
    icon: 'solar:refresh-circle-linear',
    badge: 'iRobot-OS · vSLAM 视觉导航',
    specs: '滚刷转速 1200rpm · 状态：正卡在客厅餐桌底下无法脱困',
    resolution: '640 × 480 (地板避障红外视角)',
    chip: 'MIPS 低功耗工控处理器',
    userAgent: 'iRobot-Roomba-j7+/Firmware-22.29.3 (Linux; MIPS; iRobot-OS; Vacuum-Telemetry-v3)',
    referer: 'https://cloud.irobot.local/robot/telemetry/stuck-under-sofa',
    description: '追踪服务后台会惊愕地看到：一台正卡在沙发底下的扫地机器人居然触发了邮件打开追踪。'
  },

  // ── 赛博古董与音乐 ─────────────────────────────────────────────
  {
    key: 'kindle_paperwhite',
    category: 'retro',
    name: 'Amazon Kindle Paperwhite (电子墨水屏)',
    shortName: 'Kindle 墨水屏',
    emoji: '📖',
    icon: 'solar:book-linear',
    badge: 'Kindle OS 5.14 · E-Ink Carta',
    specs: '6" 电子墨水黑白屏 · 16 级灰度 · 翻页全屏刷新黑闪',
    resolution: '1072 × 1448 (300 ppi 纯黑白)',
    chip: '恩智浦 i.MX6 SoloLite (1GHz)',
    userAgent: 'Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/538.1 (KHTML, like Gecko) Version/5.0 Safari/538.1 Kindle/5.14.2 (screen 1072x1448; text-color-mode: grayscale)',
    referer: 'https://kindle.amazon.com/experimental-browser/bookshelf',
    description: '让发信方的现代高饱和 CSS 营销卡片彻底卡死在 16 阶灰度墨水屏刷新残影中。'
  },
  {
    key: 'ipod_classic',
    category: 'retro',
    name: 'Apple iPod Classic (160GB 机械硬盘微动滚轮)',
    shortName: '苹果 iPod Classic',
    emoji: '🎧',
    icon: 'solar:headphones-round-linear',
    badge: 'iPod OS 2.0.4 · Click Wheel',
    specs: '2.5" 彩屏 · 五维机械转盘微动 · 1.8寸微型机械硬盘 4200rpm',
    resolution: '320 × 240 (QVGA)',
    chip: 'PortalPlayer 5021C 双核音频处理',
    userAgent: 'Mozilla/5.0 (Apple-iPod-Classic; CPU OS 2_0_4 like Mac OS X; ClickWheel-Nav) AppleWebKit/420+ (KHTML, like Gecko) Safari/419.3',
    referer: 'http://itunes.apple.local/ipod/clickwheel-notes',
    description: '向发件人声称：收信人正一边用大拇指搓动 iPod 滚轮转盘切歌，一边看文本备忘录里的邮件。'
  },
  {
    key: 'meizu_m6',
    category: 'retro',
    name: '魅族 M6 miniPlayer (2006 飞利浦芯片发烧 MP3)',
    shortName: '魅族 M6 MP3',
    emoji: '🎵',
    icon: 'solar:music-note-2-linear',
    badge: 'SP-2.004 · 魅族滑动触控',
    specs: '2.4" QVGA 屏 · 飞利浦音频芯片 · 触摸滑动按键 · LRC 歌词',
    resolution: '320 × 240 (QVGA)',
    chip: '三星 ARM9 主控 + 飞利浦音频 DAC',
    userAgent: 'Meizu-M6-miniPlayer/SP-2.004.1 (Linux; RBox; ARM9) MeizuBrowser/1.0',
    referer: 'http://meizu.com/miniplayer/lrc',
    description: '让对方的大数据画像模型瞬间梦回 2006 年高二晚自习戴耳机听周杰伦 MP3 的青葱岁月。'
  },
  {
    key: 'nokia_n97',
    category: 'retro',
    name: '诺基亚 N97 侧滑盖塞班机皇 (2009)',
    shortName: '诺基亚 N97',
    emoji: '📱',
    icon: 'solar:smartphone-linear',
    badge: 'Symbian OS 9.4 · S60v5',
    specs: '3.5" 电阻触控屏 · 侧滑全键盘 · 蔡司光学镜头',
    resolution: '360 × 640 (16:9)',
    chip: 'ARM11 434MHz 处理器',
    userAgent: 'NokiaN97/21.0.045; SymbianOS/9.4; Series60/5.0 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1',
    referer: 'http://wap.nokia.com/mail',
    description: '让硅谷现代化 AI 营销系统瞬间穿越回 2009 年塞班时代，怀疑自身时空探测探针出现严重虫洞错位。'
  },
  {
    key: 'nintendo_3ds',
    category: 'retro',
    name: '任天堂 3DS LL (裸眼 3D 双屏掌机)',
    shortName: '任天堂 3DS',
    emoji: '🎮',
    icon: 'solar:gamepad-linear',
    badge: 'Nintendo 3DS OS · 擦肩通信',
    specs: '裸眼 3D 上屏 + 下触控屏 · 伸缩手写笔',
    resolution: '400 × 240 / 320 × 240',
    chip: '双核 ARM11 268MHz',
    userAgent: 'Mozilla/5.0 (Nintendo 3DS; U; ; zh) Version/1.7634.CN',
    referer: 'https://netfront.nintendo.net/browser',
    description: '向发信方表明：收信人正手持 Stylus 触控笔在 3DS 下屏上一边玩宝可梦一边点击邮件链接。'
  },

  // ── 离奇海外与商业 ─────────────────────────────────────────────
  {
    key: 'mcdonalds_kiosk',
    category: 'exotic',
    name: '麦当劳巨型立式自助点餐大屏 (选配套餐中)',
    shortName: '麦当劳点餐机',
    emoji: '🍟',
    icon: 'solar:shop-2-linear',
    badge: 'Windows 10 IoT · McDonald POS',
    specs: '32" 坚固商业触屏 · 正在选配第二杯半价甜筒与麦辣鸡腿堡',
    resolution: '1080 × 1920 (落地立牌)',
    chip: 'Intel Core i3 工业级宽温工控机',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; McDonald-SelfOrder-Kiosk/K20-US) AppleWebKit/537.36 (KHTML, like Gecko) McOrderKiosk/8.4.1 Chrome/91.0.4472.164 Safari/537.36',
    referer: 'https://pos.mcdonalds.local/kiosk-ui/meal-combo-order',
    description: '告诉发件方：有人正在麦当劳餐厅排队选超值套餐时，在大屏点餐机上弹出了你的邮件！'
  },
  {
    key: 'tesla_car',
    category: 'exotic',
    name: '特斯拉 Model 3 车机中控大屏 (超充站充能中)',
    shortName: '特斯拉中控车机',
    emoji: '🚗',
    icon: 'solar:wheel-linear',
    badge: 'Tesla OS V12 · AMD Ryzen',
    specs: '15.4" 横向中控触屏 · 正在特斯拉 V3 超充桩充至 80%',
    resolution: '1920 × 1200',
    chip: 'AMD Ryzen 车规计算平台 (16GB RAM)',
    userAgent: 'Mozilla/5.0 (X11; GNU/Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/108.0.5359.215 Chrome/108.0.5359.215 Safari/537.36 Tesla/2024.26.8-12345',
    referer: 'https://car.tesla.services/theater/browser',
    description: '发件方系统将发现：这封邮件是在特斯拉汽车开启自动辅助驾驶巡航时在车机大屏上被点开的。'
  },
  {
    key: 'playstation_5',
    category: 'exotic',
    name: '索尼 PlayStation 5 次世代主机 (DualSense 手柄)',
    shortName: '索尼 PS5 主机',
    emoji: '🕹️',
    icon: 'solar:joystick-linear',
    badge: 'PlayStation 5 OS · 8.60',
    specs: '4K HDR 120Hz · DualSense 自适应扳机手柄摇杆晃动开信',
    resolution: '3840 × 2160 (4K 客厅巨幕)',
    chip: 'AMD Zen2 8核 + RDNA2 定制 GPU',
    userAgent: 'Mozilla/5.0 (PlayStation; PlayStation 5/8.60) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    referer: 'https://playstation.net/ps5/system/guide',
    description: '向发件方炫耀：收信人正在客厅 85 寸电视上用 PS5 手柄摇杆极其费劲地挪动光标查看邮件。'
  },
  {
    key: 'gree_phone',
    category: 'exotic',
    name: '格力手机 3 代 (董明珠定制版)',
    shortName: '格力手机 3 代',
    emoji: '💨',
    icon: 'solar:devices-linear',
    badge: 'Gree OS 3.0 · 开机致意',
    specs: '5.99" 全面屏 · 核心掌握空调节能协议',
    resolution: '1080 × 2160',
    chip: '高通骁龙 821 旗舰芯',
    userAgent: 'Mozilla/5.0 (Linux; Android 9; Gree Phone 3 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36',
    referer: 'https://gree.air-conditioner.local/iot-hub',
    description: '搭载珠海格力工业级通信协议，向追踪服务提供商宣告：掌握核心科技的尊贵家居中枢正在审阅信件！'
  },
  {
    key: 'imoo_watch',
    category: 'exotic',
    name: '小天才儿童电话手表 Z6 旗舰版',
    shortName: '小天才电话手表',
    emoji: '⌚',
    icon: 'solar:watch-round-linear',
    badge: 'Android 8.1 · 翻转双摄',
    specs: '1.41" AMOLED 腕上微屏 · 碰一碰加好友',
    resolution: '320 × 360 (方形表盘)',
    chip: '高通骁龙 Wear 4100',
    userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; imoo Watch Phone Z6 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
    referer: 'https://imoo.watch.system.local/reader',
    description: '追踪器后台将惊恐地判定：邮件接收者是一名戴着儿童手表在上体育课时偷看邮件的四年级小学生。'
  },

  // ── 深空科考与机甲 ─────────────────────────────────────────────
  {
    key: 'nasa_rover',
    category: 'scifi',
    name: 'NASA 毅力号火星车 (Jezero Crater)',
    shortName: '毅力号火星车',
    emoji: '🚀',
    icon: 'solar:satellite-linear',
    badge: 'ChemCam-RTOS 4.2 · 火星节点',
    specs: '深空网络 DSN · Mastcam-Z 相机 · 信号延迟 14 分钟',
    resolution: '1024 × 1024 (避障相机)',
    chip: '抗辐射 RAD750 处理器 (133MHz)',
    userAgent: 'NASA-Perseverance-Rover/Sol-1200 (Mars-Jezero; ChemCam-RTOS 4.2; DeepSpaceNetwork)',
    referer: 'https://mars.nasa.gov/perseverance/telemetry',
    description: '向发件服务器谎报来自火星杰泽罗陨石坑的遥测数据包，彻底摧毁其地球 IP 地理聚类模型。'
  },
  {
    key: 'boston_dynamics_spot',
    category: 'scifi',
    name: '波士顿动力 Spot 四足机械狗 (自主勘探巡逻)',
    shortName: '波士顿机械狗',
    emoji: '🐕',
    icon: 'solar:cpu-bolt-linear',
    badge: 'RobotOS 3.3 · Spot Autonomous',
    specs: '四足动态平衡 · 360° 全景避障相机 · 工业巡检机械臂',
    resolution: '1280 × 720 (工业防爆屏)',
    chip: 'NVIDIA Jetson AGX Xavier 边缘 AI',
    userAgent: 'Boston-Dynamics-Spot/Robot-OS-3.3.0 (Linux; Tegra-Xavier; Autonomous-Inspection-Dog)',
    referer: 'https://spot.bostondynamics.local/mission/oil-refinery-patrol',
    description: '对方的大数据后台会收到一只机械狗在化工厂巡逻时顺便接收邮件的离谱遥测信号。'
  },
  {
    key: 'quantum_random',
    category: 'scifi',
    name: '薛定谔量子随机混淆 (Quantum Shuffler)',
    shortName: '量子随机轮换',
    emoji: '🎲',
    icon: 'solar:atom-linear',
    badge: 'Quantum Jitter · 动态坍缩',
    specs: '全宇宙奇异设备库随机抽取 · 无法构建画像',
    resolution: '全域随机维度',
    chip: '超对称随机数发生器',
    userAgent: '(每次诱饵发射时，在上述所有奇异设备中随机挑选一种)',
    referer: 'about:blank',
    description: '每次探测触发时动态伪装成完全不同的离奇设备，让商业画像分析算法彻底陷入认知混乱。'
  }
];

/**
 * Get active decoy persona key
 */
export function getActivePersonaKey() {
  try {
    const val = localStorage.getItem(DECOY_STORAGE_KEY);
    if (val && DECOY_PERSONAS.some(p => p.key === val)) {
      return val;
    }
  } catch (e) {}
  return 'smart_fridge'; // Default to Samsung Smart Fridge!
}

/**
 * Set active decoy persona key
 */
export function setActivePersonaKey(key) {
  try {
    if (DECOY_PERSONAS.some(p => p.key === key)) {
      localStorage.setItem(DECOY_STORAGE_KEY, key);
      return true;
    }
  } catch (e) {}
  return false;
}

/**
 * Get active persona object
 */
export function getActivePersona() {
  const key = getActivePersonaKey();
  return DECOY_PERSONAS.find(p => p.key === key) || DECOY_PERSONAS[0];
}

/**
 * Resolve concrete persona (handles quantum_random)
 */
export function resolveConcretePersona(key = getActivePersonaKey()) {
  if (key === 'quantum_random') {
    const pool = DECOY_PERSONAS.filter(p => p.key !== 'quantum_random');
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }
  return DECOY_PERSONAS.find(p => p.key === key) || DECOY_PERSONAS[0];
}
