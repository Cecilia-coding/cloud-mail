/**
 * Decoy Personas & Telemetry Poisoning Engine (幽灵替身与遥测反向投毒)
 * 
 * When emails contain tracking pixels (e.g. Anthropic/Claude, SendGrid, Customer.io),
 * this module allows the user to disguise their identity as exotic devices (Samsung Smart Fridge,
 * imoo Watch, Nokia N97, Gree Phone, Nintendo 3DS, NASA Rover) and dispatch fake telemetry
 * via Cloudflare Worker edge proxy.
 */

export const DECOY_STORAGE_KEY = 'cloud_mail_decoy_persona';

export const DECOY_PERSONAS = [
  {
    key: 'smart_fridge',
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
    key: 'imoo_watch',
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
  {
    key: 'nokia_n97',
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
    key: 'gree_phone',
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
    key: 'nintendo_3ds',
    name: '任天堂 3DS LL (裸眼 3D 掌机)',
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
  {
    key: 'nasa_rover',
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
    key: 'quantum_random',
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
