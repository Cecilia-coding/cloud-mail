/**
 * Decoy Personas & Telemetry Poisoning Engine (幽灵替身与遥测反向投毒)
 * 
 * Disguises email client identity as exotic and hilarious devices:
 * - 赛博古董与已死系统: Nokia N97, BlackBerry Bold, Palm Treo, Lumia 1020, Imoo Z6, Gree Phone 3, Motorola Pager, Tamagotchi, iPod, Meizu, 3DS, Kindle
 * - 私密情趣与成人玩具: Lelo F1s, Satisfyer Pro 2+, We-Vibe Chorus
 * - 智能卫浴与离奇厨电: Kohler Numi Toilet, TOTO Washlet, Samsung Fridge, Smart Toaster, Roomba Vacuum
 * - 离奇海外与商用机台: McDonald's Kiosk, KTV VOD, Vegas Slots, Boeing 777 IFE, Tesla Car, Porsche Taycan, PS5
 * - 深空科考与重工重器: JWST Telescope, CERN LHC, Virginia Nuclear Submarine, NASA Rover, Spot Robot Dog
 * - 极简廉价穷鬼硬件: Walmart $15 Stick, ESP8266 Board, Casio Calc, IKEA Desk, Quantum Random
 */

export const DECOY_STORAGE_KEY = 'cloud_mail_decoy_persona';
export const DECOY_TUNING_STORAGE_KEY = 'cloud_mail_decoy_tuning';

export const DECOY_CATEGORIES = [
  { key: 'all', name: '全部印籍', icon: 'solar:widget-linear' },
  { key: 'mainstream_daily', name: '现代常规与日常真机', icon: 'solar:laptop-minimalistic-linear' },
  { key: 'retro_ancient', name: '赛博古董与已死系统', icon: 'solar:cassette-linear' },
  { key: 'intimate', name: '私密情趣与成人玩具', icon: 'solar:heart-linear' },
  { key: 'home_bath', name: '智能卫浴与离奇厨电', icon: 'solar:bath-linear' },
  { key: 'foreign_iot', name: '海外真实联网设备', icon: 'solar:global-linear' },
  { key: 'exotic_public', name: '离奇海外与商用机台', icon: 'solar:shop-2-linear' },
  { key: 'scifi_defense', name: '深空科考与重工重器', icon: 'solar:rocket-2-linear' },
  { key: 'dirt_cheap', name: '极简廉价穷鬼硬件', icon: 'solar:tag-price-linear' }
];

const RAW_DECOY_PERSONAS = [
  // ── 现代常规与日常真机 (含绝对静默与真实原生) ───────────────────
  {
    key: 'silent_block',
    category: 'mainstream_daily',
    name: '🛡️ 绝对静默拦截 (彻底禁发探针 · 零出站网络请求)',
    shortName: '绝对静默 (禁发探针)',
    emoji: '🛡️',
    icon: 'solar:shield-cross-bold-duotone',
    badge: '✦ 物理阻断 · 0 外发',
    specs: '零出站 HTTP 请求 · 100% 杜绝探针响应',
    resolution: '完全阻断 (无网络交互)',
    chip: '物理沙箱级黑洞拦截',
    userAgent: '[NONE] 彻底封禁外发请求，目标端点收不到任何流量',
    referer: '',
    description: '最高等级安全防御。完全不向追踪器发送任何请求（无论是真实探针还是替身诱饵）。100% 杜绝反向流量，物理层面保证 0 IP 暴露、0 留痕。'
  },
  {
    key: 'native_real',
    category: 'mainstream_daily',
    name: '真实本机直出 (原生指纹 · 不做伪装)',
    shortName: '真实本机直出',
    emoji: '⚡',
    icon: 'solar:shield-check-linear',
    badge: '✦ 真实原生 (无替身)',
    specs: '当前真实浏览器 · 100% 原生系统指纹透传',
    resolution: '自适应本机屏幕分辨率',
    chip: '本机真实硬件与操作系统',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    referer: '',
    description: '完全不使用任何虚拟替身。保留你当前真实系统的 User-Agent 与特征进行透传，如同在普通邮件客户端直接打开。'
  },
  {
    key: 'adaptive_mix',
    category: 'mainstream_daily',
    name: '伪装浓度调音台 (按可信度 × 荒谬度自适应选角)',
    shortName: '自适应伪装调音台',
    emoji: '🎚️',
    icon: 'solar:settings-minimalistic-linear',
    badge: 'Adaptive Persona · 动态选角',
    specs: '每次从最接近双滑杆刻度的真实设备中挑选替身',
    resolution: '由落选设备决定',
    chip: '可信度/荒谬度双轴匹配器',
    userAgent: '(由 Worker 根据双滑杆参数选择一个具体替身)',
    referer: 'about:blank',
    description: '不再手翻整本设备图鉴。Worker 会在保持硬件与请求头自洽的前提下，按你设定的可信程度与荒谬浓度挑一只最合适的替身。',
    plausibility: 75,
    absurdity: 45
  },
  {
    key: 'iphone_16_pro',
    category: 'mainstream_daily',
    name: 'Apple iPhone 16 Pro Max (主流 iOS 旗舰)',
    shortName: 'iPhone 16 Pro Max',
    emoji: '📱',
    icon: 'solar:smartphone-linear',
    badge: 'iOS 18.1 · Mobile Safari',
    specs: '6.9" Super Retina XDR OLED · 460 ppi',
    resolution: '2868 × 1320',
    chip: 'Apple A18 Pro (3nm) 仿生芯片',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
    referer: 'https://mail.apple.com/inbox',
    description: '全球保有量极大的苹果主力机型。发信方追踪后台将记录为标准 iPhone 邮件客户端在移动网络下阅信。'
  },
  {
    key: 'macbook_pro_m3',
    category: 'mainstream_daily',
    name: 'Apple MacBook Pro 16" (M3 Max / macOS)',
    shortName: 'MacBook Pro M3',
    emoji: '💻',
    icon: 'solar:laptop-minimalistic-linear',
    badge: 'macOS 14.7 · Safari 17.6',
    specs: '16.2" Mini-LED 120Hz ProMotion 视网膜 XDR 屏',
    resolution: '3456 × 2234',
    chip: 'Apple M3 Max (16核 CPU / 40核 GPU)',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
    referer: 'https://mail.apple.com/macos-inbox',
    description: '设计师与全栈工程师常见的主力生产力工具。追踪后台将识别为北美/亚太典型的 macOS 高分辨率桌面用户。'
  },
  {
    key: 'windows11_pc',
    category: 'mainstream_daily',
    name: 'Windows 11 旗舰台式工作站 (Chrome 130)',
    shortName: 'Windows 11 PC',
    emoji: '🖥️',
    icon: 'solar:monitor-linear',
    badge: 'Win11 24H2 · Google Chrome 130',
    specs: '32" 4K UHD 144Hz 专业广色域显示器',
    resolution: '3840 × 2160',
    chip: 'Intel Core i9-14900K · RTX 4090',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    referer: 'https://outlook.live.com/mail',
    description: '全球市场份额最高的主流桌面 PC 平台。毫无任何异常特征，完美隐匿融入数十亿桌面用户大盘。'
  },
  {
    key: 'pixel_9_pro',
    category: 'mainstream_daily',
    name: 'Google Pixel 9 Pro XL (原生 Android 15)',
    shortName: 'Pixel 9 Pro XL',
    emoji: '📱',
    icon: 'solar:smartphone-linear',
    badge: 'Android 15 · Chrome 130',
    specs: '6.8" LTPO Super Actua OLED · 120Hz 高刷',
    resolution: '2992 × 1344',
    chip: 'Google Tensor G4 + Titan M2 安全协处理器',
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
    referer: 'https://mail.google.com/mail/mu/mp',
    description: '谷歌官方亲儿子原生旗舰机，呈现最标准规范的 Google 原生生态移动端指纹。'
  },
  {
    key: 'ipad_pro_m4',
    category: 'mainstream_daily',
    name: 'Apple iPad Pro 13" (M4 芯片 · iPadOS)',
    shortName: 'iPad Pro 13" M4',
    emoji: '📱',
    icon: 'solar:tablet-linear',
    badge: 'iPadOS 18.0 · Mobile Safari',
    specs: '13" Ultra Retina XDR 双层串联 OLED 触控屏',
    resolution: '2752 × 2064',
    chip: 'Apple M4 芯片 (双层串联 OLED 架构)',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    referer: 'https://mail.apple.com/ipad-inbox',
    description: '主流大屏平板电脑标杆，呈现典型的大屏平板阅读与 Apple Pencil 触控生态特征。'
  },
  {
    key: 'thinkpad_edge',
    category: 'mainstream_daily',
    name: 'ThinkPad X1 Carbon Gen 12 (商务轻薄本)',
    shortName: 'ThinkPad X1',
    emoji: '💼',
    icon: 'solar:laptop-linear',
    badge: 'Win11 专业版 · Edge 130',
    specs: '14" 2.8K 120Hz OLED 商务防窥屏',
    resolution: '2880 × 1800',
    chip: 'Intel Core Ultra 7 155H (NPU AI 加速)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    referer: 'https://outlook.office365.com/mail',
    description: '跨国 500 强外企精英最常用的商务办公本，携带标准的微软办公生态与 Edge 浏览器特征。'
  },
  {
    key: 'ubuntu_linux',
    category: 'mainstream_daily',
    name: 'Ubuntu Linux 24.04 LTS (开发者工作站)',
    shortName: 'Ubuntu 24.04',
    emoji: '🐧',
    icon: 'solar:server-linear',
    badge: 'Linux x86_64 · Firefox 131',
    specs: 'GNOME 46 桌面环境 · Wayland 显示协议',
    resolution: '2560 × 1440',
    chip: 'AMD Ryzen 9 7950X (16核 32线程)',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
    referer: 'https://mail.google.com/mail/u/0',
    description: '程序员与开源极客最常用的 Linux 生产力环境，纯正的开源 Firefox 浏览器指纹。'
  },

  // ── 赛博古董与已死系统 ─────────────────────────────────────────
  {
    key: 'imoo_watch',
    category: 'retro_ancient',
    name: '小天才电话手表 Z6 (翻转双摄 · 上课禁用)',
    shortName: '小天才电话手表 Z6',
    emoji: '⌚',
    icon: 'solar:watch-round-linear',
    badge: 'Android 7.1.1 · 4G 全网通',
    specs: '1.41" AMOLED · 512MB RAM + 8GB · 前 500 万 + 后 800 万翻转双摄 · 20 米防水',
    resolution: '320 × 360',
    chip: '官方未公开 SoC · 512MB RAM / 8GB Flash',
    userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; XTC-Z6 Build/NMF26X; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 Mobile Safari/537.36',
    referer: 'https://guardian.imoo.local/class-mode/inbox',
    acceptLanguage: 'zh-CN,zh;q=0.9',
    description: '硬件参数取自小天才官方资料；追踪后台则会认真记录：一块 320×360 的儿童手表在上课禁用模式里偷偷打开了营销邮件。',
    plausibility: 78,
    absurdity: 67
  },
  {
    key: 'gree_phone',
    category: 'retro_ancient',
    name: '格力手机 3 代 (G0335D · 掌握核心科技)',
    shortName: '格力手机 3 代',
    emoji: '💨',
    icon: 'solar:smartphone-linear',
    badge: 'Android 7.1.2 · HALO OS 2.0',
    specs: '5.99" 18:9 TFT · 4GB + 64GB · 3160mAh · 后置 1200 万 + 500 万双摄',
    resolution: '1080 × 2160',
    chip: 'Qualcomm Snapdragon 821 (MSM8996SG)',
    userAgent: 'Mozilla/5.0 (Linux; Android 7.1.2; G0335D Build/N2G47H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.98 Mobile Safari/537.36',
    referer: 'https://gree.air-conditioner.local/core-technology/mail',
    acceptLanguage: 'zh-CN,zh;q=0.9',
    description: '真实配置来自那台售价 3600 元、在 2019 年搭载骁龙 821 登场的格力手机；虚构部分是它正以“掌握核心科技”的姿态替你审阅邮件。',
    plausibility: 83,
    absurdity: 76
  },
  {
    key: 'nokia_n97',
    category: 'retro_ancient',
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
    key: 'blackberry_bold',
    category: 'retro_ancient',
    name: '黑莓 BlackBerry Bold 9900 (全键盘商务机)',
    shortName: '黑莓 Bold 9900',
    emoji: '📟',
    icon: 'solar:devices-linear',
    badge: 'BlackBerry OS 7.1 · BIS/BES',
    specs: '经典 QWERTY 水晶全键盘 · 机械光学触控板 · 企业 BES 推送',
    resolution: '640 × 480 (VGA 2.8")',
    chip: '高通 Snapdragon MSM8655 (1.2GHz)',
    userAgent: 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.342 Mobile Safari/534.11+',
    referer: 'http://bis.na.blackberry.com/client/push-mail',
    description: '让发信方的大数据营销分析误以为：华尔街投行精英正用经典的黑莓全键盘在 2011 年飞速回信。'
  },
  {
    key: 'palm_treo',
    category: 'retro_ancient',
    name: '掌上电脑 Palm Treo 650 (手写笔触碰电阻屏)',
    shortName: 'Palm 掌上电脑',
    emoji: '🖊️',
    icon: 'solar:pen-linear',
    badge: 'Palm OS 5.4 Garnet · 电阻屏',
    specs: '手写笔触碰校准 · 涂鸦手写识别 Graffiti · 天线凸起小胡子',
    resolution: '320 × 320 (正方形电阻屏)',
    chip: 'Intel PXA270 312MHz 芯片',
    userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; PalmSource/hspr-H102; Blazer/4.0) 16;320x320',
    referer: 'http://palm.com/blazer-browser/memo-sync',
    description: '向追踪器表明：收件人正手持金属手写笔，在 2005 年的电阻屏上用力戳击屏幕以打开邮件。'
  },
  {
    key: 'nokia_lumia',
    category: 'retro_ancient',
    name: '诺基亚 Lumia 1020 (已绝版 Windows Phone 8.1)',
    shortName: 'Lumia 1020 奥利奥',
    emoji: '🟨',
    icon: 'solar:camera-linear',
    badge: 'Windows Phone 8.1 · PureView',
    specs: '4100 万像素巨型奥利奥镜头 · 动态磁贴 · 微软彻底放弃的移动系统',
    resolution: '768 × 1280 (AMOLED)',
    chip: '高通骁龙 S4 双核 (1.5GHz)',
    userAgent: 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 1020) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    referer: 'https://live.com/outlook-mobile/tile-sync',
    description: '让发信方的客户端探测陷入沉思：这款搭载 4100 万像素巨型镜头且微软已经停更十年的亡灵手机从何而来？'
  },
  {
    key: 'motorola_pager',
    category: 'retro_ancient',
    name: '摩托罗拉 Bravo 汉字寻呼机 (BB机单行绿光屏)',
    shortName: '摩托罗拉寻呼机',
    emoji: '📟',
    icon: 'solar:bell-bing-linear',
    badge: 'POCSAG 协议 · 150MHz 寻呼网',
    specs: '单行绿色背光点阵液晶 · 哔哔哔高分贝蜂鸣 · 腰间塑料卡扣夹',
    resolution: '单行 12 个汉字 (点阵字符)',
    chip: '摩托罗拉 8 位超微型寻呼微控',
    userAgent: 'Motorola-Bravo-Pager/POCSAG-1200 (Numeric-Alphanumeric; Beeper-Alert; MsgID-9999)',
    referer: 'pager://127.0.0.1/radio-call-station/message-inbox',
    description: '追踪器服务器收到来自 90 年代寻呼台的无线电报文：【江川雪速回电，邮件已收到，哔哔哔】。'
  },
  {
    key: 'tamagotchi_pet',
    category: 'retro_ancient',
    name: '万代电子宠物拓麻歌子 (1996 黑白像素蛋)',
    shortName: '拓麻歌子电子宠物',
    emoji: '🥚',
    icon: 'solar:cat-linear',
    badge: 'Tamagotchi OS · 3 颗实体按键',
    specs: '32 × 16 粗糙黑白像素屏 · 饥饿度满格 · 状态：宠物正在屏幕上拉大便需铲屎',
    resolution: '32 × 16 (单色黑白像素矩阵)',
    chip: '4 位低频微处理器 (1.5V 纽扣电池)',
    userAgent: 'Bandai-Tamagotchi/Gen1-1996 (4bit-MCU; 32x16-Pixel; PoopAlert-True; PetHunger-Level3)',
    referer: 'tamagotchi://virtual-pet/clean-poop-action',
    description: '向发件方广播离奇警报：用户在给电子鸡喂汉堡和铲大便的间隙，无意触发了追踪探针。'
  },
  {
    key: 'ipod_classic',
    category: 'retro_ancient',
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
    category: 'retro_ancient',
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
    key: 'nintendo_3ds',
    category: 'retro_ancient',
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
  {
    key: 'kindle_paperwhite',
    category: 'retro_ancient',
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
    key: 'iphone_3gs',
    category: 'retro_ancient',
    name: 'Apple iPhone 3GS 8GB (2009 · 最后一版 iOS 6.1.6)',
    shortName: 'iPhone 3GS 8GB',
    emoji: '📱',
    icon: 'solar:smartphone-linear',
    badge: 'iOS 6.1.6 · 30 针接口',
    specs: '3.5" 多点触控屏 · 8GB 闪存 · 135g · 3G HSDPA',
    resolution: '480 × 320 (163 ppi)',
    chip: 'Samsung S5PC100 ARM Cortex-A8 · 256MB RAM',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_6 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B500 Safari/8536.25',
    referer: 'https://mail.me.com/iphone/inbox',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '像一台从抽屉深处充回电的 8GB iPhone 3GS：邮件刚加载完，30 针数据线已经开始接触不良。',
    plausibility: 66,
    absurdity: 48
  },
  {
    key: 'samsung_galaxy_y',
    category: 'retro_ancient',
    name: 'Samsung Galaxy Y GT-S5360 (2011 廉价安卓小方块)',
    shortName: 'Galaxy Y GT-S5360',
    emoji: '📲',
    icon: 'solar:smartphone-linear',
    badge: 'Android 2.3.6 Gingerbread · TouchWiz',
    specs: '3.0" TFT · 290MB RAM · microSD · 后盖仍可徒手拆开',
    resolution: '240 × 320 (QVGA)',
    chip: 'Broadcom BCM21553 · 832MHz 单核',
    userAgent: 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-gb; GT-S5360 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
    referer: 'https://m.google.com/mail/android-gingerbread',
    acceptLanguage: 'en-GB,en;q=0.9',
    description: '一台还在运行 Gingerbread 的入门 Galaxy，小屏幕努力把现代 HTML 邮件压成一条滚不完的长面条。',
    plausibility: 61,
    absurdity: 55
  },
  {
    key: 'sony_ericsson_w810i',
    category: 'retro_ancient',
    name: 'Sony Ericsson W810i Walkman 音乐手机 (2006)',
    shortName: '索爱 W810i Walkman',
    emoji: '🎵',
    icon: 'solar:music-note-2-linear',
    badge: 'NetFront 3.3 · EDGE · 橙色 Walkman 键',
    specs: '2.0" TFT · 记忆棒 Memory Stick PRO Duo · 200 万像素相机',
    resolution: '176 × 220',
    chip: 'ARM9 功能机平台 · Java MIDP 2.0',
    userAgent: 'SonyEricssonW810i/R4EA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1',
    referer: 'http://wap.sonyericsson.com/walkman/inbox',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '橙色 Walkman 键一亮，2006 年的 NetFront 浏览器开始用 EDGE 网速下载一枚追踪像素。',
    plausibility: 42,
    absurdity: 68
  },

  // ── 私密情趣与成人玩具 (官方真实硬件参数) ─────────────────────
  {
    key: 'lelo_smart_vibe',
    category: 'intimate',
    name: '瑞典 LELO F1S V2 极智飞机杯 (官方真实规格)',
    shortName: 'LELO F1S V2',
    emoji: '🪶',
    icon: 'solar:heart-linear',
    badge: 'LELO 官方规格 · 60Hz/90Hz 双驱',
    specs: '143 × Ø71 mm · 插深 110.7 mm · 重量 285g · 官方蓝牙 5.0',
    resolution: '无显示屏 (LED 呼吸指示光环)',
    chip: '双电机驱动: 60Hz 吸力电机 + 90Hz 振动电机',
    userAgent: 'LELO-F1s-V2/1.4.0 (BLE-5.0; Motor-60Hz-90Hz; Insertable-110.7mm; Weight-285g; App-Sync)',
    referer: 'https://lelo.com/f1s-v2/app-telemetry',
    description: '瑞典官方真实男用飞机杯开发者硬件。官方规格长14.3cm、插深11.1cm、重285g，吸力60Hz、振动90Hz双电机。给发信方展现毫厘不差的真实硬件。'
  },
  {
    key: 'satisfyer_pro',
    category: 'intimate',
    name: '德国 Satisfyer Pro 2 Generation 3 (第三代脉冲器)',
    shortName: 'Satisfyer Pro 2 Gen3',
    emoji: '🫧',
    icon: 'solar:magic-stick-linear',
    badge: 'Air-Pulse 空气波 · 16.4cm / 203g',
    specs: '164 × 65 × 46 mm (长 16.4 cm) · 203g · 液态硅胶',
    resolution: 'Satisfyer Connect 手机触控交互',
    chip: 'Air Pulse 空气波技术 + 振动双驱 (12档气流 + 11档振动)',
    userAgent: 'Satisfyer-Connect/4.12.0 (iOS; Pro2-Gen3; Length-164mm; AirPulse-PulseWave; BLE-WhisperQuiet)',
    referer: 'https://satisfyer.com/connect/session-control',
    description: '德国官方第三代空气波脉冲吸吮器。长16.4cm、重203g、液态硅胶机身，支持 Satisfyer Connect App 异地情侣跨洋遥控。'
  },
  {
    key: 'kiiroo_keon_1',
    category: 'intimate',
    name: 'Kiiroo Keon 1 工业级往复活塞机 (重型机械设备)',
    shortName: 'Kiiroo Keon 1',
    emoji: '⚙️',
    icon: 'solar:settings-linear',
    badge: 'FeelConnect · 75mm 冲程 / 1.1kg',
    specs: '220 × 130 × 146 mm · 重 1.1kg · 冲程 75mm · 230 strokes/min',
    resolution: '工业活塞机械行程',
    chip: '高扭矩活塞步进电机 · Wi-Fi 802.11 + BLE 4.2',
    userAgent: 'FeelConnect/3.8.1 (Kiiroo-Keon-1; Stroke-75mm; MaxSpeed-230spm; Weight-1.1kg; WiFi-BLE)',
    referer: 'https://kiiroo.com/feelconnect/interactive-session',
    description: '荷兰重型工业活塞设备。自重1.1公斤、冲程75毫米、每分钟230次极限往复，搭载Wi-Fi与蓝牙。让发信方误以为工业重机正在猛烈冲程中点开邮件。'
  },
  {
    key: 'kiiroo_keon_2',
    category: 'intimate',
    name: 'Kiiroo Keon 2 次世代高速活塞驱动器 (超高线速度)',
    shortName: 'Kiiroo Keon 2',
    emoji: '⚡',
    icon: 'solar:bolt-linear',
    badge: '95mm 冲程 · 速度 684 mm/s',
    specs: '146 × 124 × 218 mm · 重 996g · 冲程 95mm · 速度 684 mm/s',
    resolution: '高速直线往复驱动',
    chip: '次世代轻量化活塞驱动 · 双频 Wi-Fi 5 + BLE 5.0',
    userAgent: 'FeelConnect/4.2.0 (Kiiroo-Keon-2; Stroke-95mm; Velocity-684mms; Weight-996g; DualBand-WiFi)',
    referer: 'https://kiiroo.com/feelconnect/device-sync',
    description: '次世代轻量化活塞机。冲程暴增至95毫米，极限线速度高达684毫米/秒！追踪后台直接被超音速般的物理位移震惊。'
  },
  {
    key: 'kiiroo_sleeve',
    category: 'intimate',
    name: 'Kiiroo Keon 工业级官方配件 (Stroker Sleeve 套件)',
    shortName: 'Kiiroo 工业配件',
    emoji: '🔩',
    icon: 'solar:widget-2-linear',
    badge: '长 190.5 mm · Ø47 mm · 193g',
    specs: '长 190.5 mm (~19.1 cm) · 直径 47 mm · 重量 193 g',
    resolution: '高弹性医用硅胶腔体',
    chip: '医用级人体工学柔性体 · 官方机械卡扣',
    userAgent: 'FeelConnect/Sleeve-Telemetry (Kiiroo-Keon-Accessory; Length-190.5mm; Diameter-47mm; Weight-193g)',
    referer: 'https://kiiroo.com/accessories/sleeve-telemetry',
    description: '官方兼容工业套件。精确到190.5毫米长度与47毫米直径的真实医用硅胶配件，为追踪画像提供毫厘不差的物理打击。'
  },
  {
    key: 'wevibe_chorus',
    category: 'intimate',
    name: '加拿大 We-Vibe Chorus 智能双人共振感应器',
    shortName: 'We-Vibe 共振仪',
    emoji: '💜',
    icon: 'solar:star-fall-linear',
    badge: 'We-Connect 5.8 · Touch-sense',
    specs: 'Squeeze 智能手握压力感应器 · 越用力握越强 · 伴侣双向实时力反馈',
    resolution: '无屏幕 (力敏电阻压力传感)',
    chip: 'Dialog SmartBond 超微型生物电容传感器',
    userAgent: 'We-Connect/5.8 (Android; WeVibe-Chorus-BLE; SqueezeSensor-Active; SqueezeForce-85pct)',
    referer: 'https://we-vibe.com/we-connect/dual-vibe-telemetry',
    description: '追踪服务算法陷入深度沉默：终端传感器反馈正处于激烈握力挤压（压力 85%）与双人互动状态。'
  },
  {
    key: 'lovense_lush_3',
    category: 'intimate',
    name: 'Lovense Lush 3 蓝牙遥控跳蛋 (App 长距离会话)',
    shortName: 'Lovense Lush 3',
    emoji: '🥚',
    icon: 'solar:heart-pulse-linear',
    badge: 'Lovense Remote · Bluetooth · IPX7',
    specs: '100% 硅胶 · 可编程振动模式 · 手机与桌面端远程控制',
    resolution: '无屏幕 · 粉色状态 LED',
    chip: '低功耗蓝牙控制器 · App pattern engine',
    userAgent: 'Lovense-Remote/7.35.2 (Lush-3; Bluetooth-LE; IPX7; Pattern-Program; LongDistance-Session)',
    referer: 'https://www.lovense.com/remote/my-toys/lush-3',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '正经的 Lovense 蓝牙遥控设备，却在长距离会话里抽空点开了一封营销邮件；后台会认真记录这次极其私密的“活跃设备”。',
    plausibility: 76,
    absurdity: 91
  },
  {
    key: 'the_handy_2',
    category: 'intimate',
    name: '挪威 The Handy 2 无线自动往复器 (Handyverse 在线模式)',
    shortName: 'The Handy 2',
    emoji: '🦾',
    icon: 'solar:bolt-circle-linear',
    badge: 'Bluetooth + Wi-Fi · 125mm 行程',
    specs: '125 mm 往复行程 · USB-C 快充 · ClickOn 套筒系统 · 内置电池',
    resolution: '无显示屏 · 三色 LED 模式指示',
    chip: '次世代高扭矩直线电机 · Handyverse 同步控制器',
    userAgent: 'Handyverse/2.6.0 (Handy-2; Stroke-125mm; WiFi; Bluetooth; OnlineMode; ClickOn)',
    referer: 'https://www.handyfeeling.com/handyverse/session',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '它会把开信动作伪装成 Handyverse 在线会话里一次正常同步；125 毫米行程的机械设备突然成为邮件客户端，十分端庄。',
    plausibility: 72,
    absurdity: 96
  },
  {
    key: 'wevibe_moxie_plus',
    category: 'intimate',
    name: 'We-Vibe Moxie+ 磁吸穿戴遥控器 (外出模式)',
    shortName: 'We-Vibe Moxie+',
    emoji: '🧲',
    icon: 'solar:magnet-wave-linear',
    badge: 'We-Vibe App · IPX7 · 10 种模式',
    specs: '85 × 23 × 27 mm · 磁吸固定 · 无线遥控 · 最长约 2 小时',
    resolution: '无屏幕 · 低亮度状态灯',
    chip: 'BLE 穿戴控制器 · 远距离 App 会话',
    userAgent: 'We-Vibe/6.3.1 (Moxie-Plus; BLE; IPX7; Wearable; MagneticClip; Mode-Discreet)',
    referer: 'https://app.we-vibe.com/devices/moxie-plus',
    acceptLanguage: 'en-GB,en;q=0.9',
    description: '磁吸在衣物上的穿戴设备以“外出静音模式”打开邮件，整条请求像真的 App 遥测，内容却足以令画像师停顿三秒。',
    plausibility: 82,
    absurdity: 89
  },
  {
    key: 'lovense_max_2',
    category: 'intimate',
    name: 'Lovense Max 2 蓝牙气囊互动杯 (Air Pump Sync)',
    shortName: 'Lovense Max 2',
    emoji: '🫙',
    icon: 'solar:airbuds-case-charge-linear',
    badge: 'Lovense Remote · Air Pump · BLE',
    specs: '空气泵收缩腔体 · 振动马达 · App 双向同步 · 长距离遥控',
    resolution: '无屏幕 · 环形连接指示灯',
    chip: '气压泵控制器 + 振动电机 + Bluetooth LE',
    userAgent: 'Lovense-Remote/7.35.2 (Max-2; AirPump; Vibration; Bluetooth-LE; SyncSession)',
    referer: 'https://www.lovense.com/remote/my-toys/max-2',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '让营销系统误以为开信动作来自 Max 2 的气囊泵同步事件；硬件字段自洽，场面则完全不自洽。',
    plausibility: 74,
    absurdity: 93
  },

  // ── 智能卫浴与离奇厨电 ─────────────────────────────────────────
  {
    key: 'smart_toilet',
    category: 'home_bath',
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
    category: 'home_bath',
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
    key: 'smart_fridge',
    category: 'home_bath',
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
    key: 'smart_toaster',
    category: 'home_bath',
    name: 'Revolution InstaGLO 触屏智能烤面包机',
    shortName: '智能烤面包机',
    emoji: '🍞',
    icon: 'solar:cup-linear',
    badge: 'Android 7.1 · InstaGLO R180',
    specs: '全彩触控液晶屏 · 正在将全麦贝果烘烤至金黄酥脆焦香',
    resolution: '480 × 854 (横向面包仓)',
    chip: '联发科 MT8167 嵌入式低功耗芯片',
    userAgent: 'Mozilla/5.0 (Linux; Android 7.1; SmartToaster-InstaGLO-R180) AppleWebKit/537.36 (KHTML, like Gecko) ToasterBrowser/1.0 BagelMode/Level-4 Safari/537.36',
    referer: 'https://revolutioncooking.local/toaster/browning-cycle',
    description: '硅谷历史上最经典的极客梗成真：发件人后台确信他们的邮件正在一台发热丝通红的面包机上被打开！'
  },
  {
    key: 'roomba_vacuum',
    category: 'home_bath',
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

  // ── 离奇海外与商用机台 ─────────────────────────────────────────
  {
    key: 'mcdonalds_kiosk',
    category: 'exotic_public',
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
    key: 'ktv_kiosk',
    category: 'exotic_public',
    name: 'KTV 巨型霓虹点歌机台 (切歌重唱中)',
    shortName: 'KTV 自助点歌机',
    emoji: '🎤',
    icon: 'solar:microphone-2-linear',
    badge: 'Windows Embedded POS · 视易VOD',
    specs: '21.5" 油渍耐磨触屏 · 正有人在包厢破音鬼嚎《青藏高原》',
    resolution: '1920 × 1080 (斜置点歌台)',
    chip: 'Intel Celeron 赛扬双核工控主板',
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; KTV-VOD-Player/Thunder-v9) AppleWebKit/537.36 (KHTML, like Gecko) KTVBrowser/3.0 Safari/537.36',
    referer: 'http://ktv-local-vod.lan/box-888/karaoke-playlist',
    description: '向追踪器传达包厢喧嚣：正在伴奏《死了都要爱》的高潮爆音中通过点歌台切歌并查看邮件。'
  },
  {
    key: 'vegas_slots',
    category: 'exotic_public',
    name: '拉斯维加斯 777 赌场巨型老虎机台',
    shortName: '拉斯维加斯老虎机',
    emoji: '🎰',
    icon: 'solar:dollar-minimalistic-linear',
    badge: 'IGT Advantage · 百乐宫娱乐场',
    specs: '27" 弧形双屏 · 投币口金属叮当响 · 正在转动 777 终极大奖',
    resolution: '1080 × 1920 (曲面屏)',
    chip: 'AMD 嵌入式定制工控显卡主板',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; IGT-SlotMachine/Advantage-Bonusing) AppleWebKit/537.36 (KHTML, like Gecko) CasinoKiosk/4.2 Safari/537.36',
    referer: 'https://casino-floor.bellagio.vegas/slot/jackpot-spin',
    description: '追踪器将监测到：邮件是在拉斯维加斯百乐宫赌场老虎机疯狂吐硬币的叮当声中被触发的。'
  },
  {
    key: 'boeing_ife',
    category: 'exotic_public',
    name: '波音 777-300ER 经济舱后背娱乐屏 (巡航中)',
    shortName: '波音经济舱座椅屏',
    emoji: '✈️',
    icon: 'solar:plain-2-linear',
    badge: 'Panasonic eX3 · 卫星机载Wi-Fi',
    specs: '11.6" 触摸小屏 · 正在万米高空飞越北极圈气流颠簸 · 延迟 800ms',
    resolution: '1366 × 768',
    chip: '飞思卡尔 i.MX6 四核航空机载系统',
    userAgent: 'Mozilla/5.0 (Linux; Tizen 2.4; InFlight-Entertainment-Panasonic-eX3) AppleWebKit/538.1 (KHTML, like Gecko) AeroBrowser/2.1 SatelliteNet/GEO-Ka',
    referer: 'https://in-flight.wifi.aero/portal/flight-map',
    description: '向发件服务器表明：邮件是在万米高空飞越北极颠簸气流中，用经济舱座椅前的小触屏点开的。'
  },
  {
    key: 'tesla_car',
    category: 'exotic_public',
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
    key: 'porsche_taycan',
    category: 'exotic_public',
    name: '保时捷 Taycan Turbo S 副驾独立屏幕',
    shortName: '保时捷副驾屏',
    emoji: '🏎️',
    icon: 'solar:speedometer-linear',
    badge: 'Porsche PCM 6.0 · 纽北赛道',
    specs: '10.9" 高清防窥屏 · 正在德国纽北赛道极速冲刺 · 800V 架构',
    resolution: '1920 × 720 (修长横屏)',
    chip: '高通骁龙 820A 车载数字座舱芯片',
    userAgent: 'Mozilla/5.0 (X11; Porsche-PCM/6.0; Taycan-Passenger-Screen) AppleWebKit/537.36 (KHTML, like Gecko) PorscheBrowser/3.0 Safari/537.36',
    referer: 'https://porsche-connect.de/taycan/cockpit/track-mode',
    description: '发件方系统会敬畏地发现：用户正系着赛车四点安全带以 260km/h 极速冲刺时瞥了一眼邮件。'
  },
  {
    key: 'playstation_5',
    category: 'exotic_public',
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

  // ── 深空科考与重工重器 ─────────────────────────────────────────
  {
    key: 'jwst_telescope',
    category: 'scifi_defense',
    name: '詹姆斯·韦伯空间望远镜 (JWST · L2 节点)',
    shortName: '詹姆斯韦伯望远镜',
    emoji: '🔭',
    icon: 'solar:telescope-linear',
    badge: 'NASA / ESA / CSA · 拉格朗日L2点',
    specs: '距地球 150 万公里 · 293K 极寒深空 · 镀金铍反射镜红外遥测',
    resolution: '4096 × 4096 (近红外相机 NIRCam)',
    chip: '抗辐射 RAD750 处理器 (118K 极寒温控)',
    userAgent: 'NASA-ESA-CSA-JWST/Ops-Cycle-3 (Lagrange-L2; NIRCam-CryoOS 5.1; DeepSpaceNetwork-70m)',
    referer: 'https://webbtelescope.org/telemetry/nirspec-spectroscopy',
    description: '发件方画像系统收到来自日地拉格朗日 L2 点的红外天文遥测，延迟 5 秒，背景辐射 40 开尔文。'
  },
  {
    key: 'cern_lhc',
    category: 'scifi_defense',
    name: '欧洲核子中心 CERN 强子对撞机 ATLAS 节点',
    shortName: 'CERN 强子对撞机',
    emoji: '⚛️',
    icon: 'solar:atom-linear',
    badge: 'CERN ATLAS · 13.6 TeV',
    specs: '瑞士地下 100 米 · 质子-质子超高能对撞 · 探测希格斯玻色子',
    resolution: '无显示器 (纯粒子物理触发阵列)',
    chip: '100,000 核超导磁体网格计算集群',
    userAgent: 'CERN-LHC-ATLAS/Trigger-DAQ-v8 (ScientificLinux-7; RootAnalysis-6.28; 13.6TeV-Collision)',
    referer: 'https://atlas.cern/telemetry/higgs-boson-candidate',
    description: '发件方系统会抓狂地发现：信标触发地点位于瑞士日内瓦地下 100 米超导强子对撞机核心腔室！'
  },
  {
    key: 'nuclear_submarine',
    category: 'scifi_defense',
    name: '美国弗吉尼亚级核动力潜艇水下声呐终端',
    shortName: '核动力潜艇声呐',
    emoji: '⚓',
    icon: 'solar:shield-check-linear',
    badge: 'US Navy SSN-774 · 深海静默',
    specs: 'VLF 超长波天线 · 水下 200 米深潜 · 战术战情中心 CIC',
    resolution: '1600 × 1200 (军规抗震三防绿磷光屏)',
    chip: '军规强化 PowerPC 抗电磁脉冲芯片',
    userAgent: 'US-Navy-Submarine/SSN-774 (Submerged-Silent-Running; SonarCombat-RTOS 6.1; ELF-Burst-Link)',
    referer: 'http://cic.uss-virginia.navy.mil/sonar-hydrophone',
    description: '追踪器将收到来自大西洋海底 200 米深处的加密声呐遥测，IP 地址显示在百慕大三角深海。'
  },
  {
    key: 'nasa_rover',
    category: 'scifi_defense',
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
    category: 'scifi_defense',
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

  // ── 极简廉价穷鬼硬件 ─────────────────────────────────────────
  {
    key: 'walmart_onn',
    category: 'dirt_cheap',
    name: '沃尔玛 Onn. 超廉价电视棒 ($14.88 塑料棒)',
    shortName: '沃尔玛廉价电视棒',
    emoji: '📟',
    icon: 'solar:tv-linear',
    badge: 'Android TV 12 · Walmart Onn',
    specs: '售价 $14.88 纯塑料超烫手 · 正在开机播放 30 秒无法跳过的广告',
    resolution: '1920 × 1080 (插在二手电视后)',
    chip: '晶晨 Amlogic S905Y4 廉价低端芯片',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; onn. 4K Streaming Box Build/STT2.220920.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36',
    referer: 'https://tv.walmart.com/streaming/home',
    description: '让硅谷高级营销人员确信：他们的精致邮件正显示在北美廉价出租屋一台 14 刀的塑料电视棒上。'
  },
  {
    key: 'esp8266_board',
    category: 'dirt_cheap',
    name: '乐鑫 ESP8266 极简 Wi-Fi 单片机 ($1.8 裸板)',
    shortName: 'ESP8266 裸板单片机',
    emoji: '🪛',
    icon: 'solar:code-linear',
    badge: 'FreeRTOS · Xtensa 80MHz',
    specs: '仅 32KB 可用剩余内存 · 正在面包板上插着杜邦线飞线裸奔发热',
    resolution: '无屏幕 (纯串口波特率 115200)',
    chip: 'Xtensa 32位 LX106 单核处理器',
    userAgent: 'ESP8266-HTTPClient/1.2 (FreeRTOS 8.2; Xtensa-LX106; RAM-32KB-Free; Sensor-Node)',
    referer: 'http://192.168.4.1/sensor-dht11',
    description: '对方后台将看到：收件终端仅有 32KB 剩余内存，插着飞线在面包板上极其脆弱地苟延残喘。'
  },
  {
    key: 'casio_calc',
    category: 'dirt_cheap',
    name: '卡西欧 Casio 科学函数计算器 (FX-991CNX)',
    shortName: '卡西欧计算器',
    emoji: '🔢',
    icon: 'solar:calculator-minimalistic-linear',
    badge: 'ClassWiz Math-OS · 太阳能供电',
    specs: '黑白点阵液晶屏 · 双电源自动切换 · 正在计算二重定积分',
    resolution: '192 × 63 (粗糙点阵液晶)',
    chip: '卡西欧 4 位超低功耗专用算力微控',
    userAgent: 'Casio-ClassWiz/FX-991 (Math-OS 3.0; SolarPower-Cell; CalcBrowser/0.9; MathJax-Off)',
    referer: 'calc://matrix-determinant/solve',
    description: '向追踪器汇报：收件终端由微型太阳能电池板供电，屏幕除了数字和希腊字母无法显示任何图片。'
  },
  {
    key: 'ikea_desk',
    category: 'dirt_cheap',
    name: '宜家 IDÅSEN 智能电动升降桌手控板',
    shortName: '宜家升降桌控板',
    emoji: '🪑',
    icon: 'solar:tuning-linear',
    badge: 'Linak BLE · 升降高度 105cm',
    specs: '双电机静音驱动 · 状态：正在嗡嗡升至 105cm 站立办公高度',
    resolution: '单行 3 位数 7 段数码管 (显示 105)',
    chip: '力纳克 Linak 蓝牙微控制器 (0.1W)',
    userAgent: 'IKEA-Idasen-Desk/Linak-BLE-v1.4 (Embedded-RTOS; MotorHeight-105cm; HealthTracker)',
    referer: 'ble://ikea-home-smart/desk/standing-timer',
    description: '向发件方声称：这封信是由一张正在电动马达嗡嗡升起、提醒站立办公的办公桌主控板自动解析的。'
  },
  {
    key: 'raspberry_pi_zero_2w',
    category: 'dirt_cheap',
    name: 'Raspberry Pi Zero 2 W 裸板电脑 ($15)',
    shortName: 'Pi Zero 2 W 裸板',
    emoji: '🥧',
    icon: 'solar:cpu-bolt-linear',
    badge: '$15 裸板 · 512MB RAM · 2.4GHz Wi-Fi',
    specs: '65 × 30 mm · 512MB LPDDR2 · microSD 系统盘 · 排针仍未焊',
    resolution: '无固定屏幕 · mini HDMI 可选',
    chip: 'RP3A0 · 四核 Cortex-A53 1GHz',
    userAgent: 'Mozilla/5.0 (X11; Linux armv7l; Raspberry-Pi-Zero-2-W) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/109.0.5414.119 Safari/537.36',
    referer: 'http://raspberrypi.local/mail/pixel-worker',
    acceptLanguage: 'en-GB,en;q=0.9',
    description: '一块十五美元、连排针都舍不得焊的英国小电脑，靠 microSD 卡顽强运行 Chromium 并替你读取昂贵品牌的营销邮件。',
    plausibility: 86,
    absurdity: 61
  },
  {
    key: 'alcatel_1_2021',
    category: 'dirt_cheap',
    name: 'Alcatel 1 (2021) Android Go 入门机 (1GB RAM)',
    shortName: 'Alcatel 1 · 1GB RAM',
    emoji: '📱',
    icon: 'solar:smartphone-linear',
    badge: 'Android 11 Go · 1GB RAM / 8GB ROM',
    specs: '5" FWVGA+ · 1GB RAM · 8GB ROM · 2000mAh · Micro-USB',
    resolution: '480 × 960',
    chip: 'MediaTek MT6739 四核 1.28GHz',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; 5033FR Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36',
    referer: 'https://mail.google.com/mail/mu/mp/5033fr',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '一台只有 1GB 内存和 8GB 存储的 Android Go 手机，刚清完后台才勉强腾出空间加载这一像素。',
    plausibility: 95,
    absurdity: 37
  },
  {
    key: 'nokia_105_4g',
    category: 'dirt_cheap',
    name: 'Nokia 105 4G 按键功能机 (48MB RAM)',
    shortName: 'Nokia 105 4G',
    emoji: '🔦',
    icon: 'solar:phone-calling-linear',
    badge: 'Series 30+ · 48MB RAM · 4G VoLTE',
    specs: '1.8" QQVGA · 128MB 存储 · 48MB RAM · 手电筒 · FM 收音机',
    resolution: '120 × 160 (QQVGA)',
    chip: 'Unisoc T107 · 可拆卸 1020mAh 电池',
    userAgent: 'Nokia105-4G/10.02.17 (Series30+; Unisoc-T107; 48MB-RAM; LTE; FeaturePhone)',
    referer: 'http://m.hmd.com/nokia-105/internet',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '只有 48MB 内存的按键机，配着手电筒和 FM 收音机，用 4G 网络郑重打开一枚 1×1 像素。',
    plausibility: 54,
    absurdity: 75
  },
  {
    key: 'amazon_fire_7_2015',
    category: 'dirt_cheap',
    name: 'Amazon Fire 7 第五代 ($49.99 塑料平板 · 2015)',
    shortName: 'Fire 7 第五代',
    emoji: '🔥',
    icon: 'solar:tablet-linear',
    badge: 'Fire OS 5 · 7 英寸 · 广告锁屏版',
    specs: '7" IPS · 8GB 存储 · microSD · 单声道扬声器 · Micro-USB',
    resolution: '1024 × 600 (171 ppi)',
    chip: 'MediaTek MT8127 四核 1.3GHz · 1GB RAM',
    userAgent: 'Mozilla/5.0 (Linux; U; en-US; KFFOWI Build/LVY48F) AppleWebKit/537.36 (KHTML, like Gecko) Silk/48.2.1 like Chrome/48.0.2564.106 Safari/537.36',
    referer: 'https://www.amazon.com/gp/silk/home',
    acceptLanguage: 'en-US,en;q=0.9',
    description: '2015 年那块五十美元的广告锁屏平板还活着；Silk 浏览器一边推特价洗衣液，一边替你制造开信记录。',
    plausibility: 79,
    absurdity: 59
  },
  // ── 海外真实联网设备：型号与能力取自厂商，开信行为属于替身剧本 ────
  {
    key: 'amazon_hub_locker',
    category: 'foreign_iot',
    name: 'Amazon Hub Locker 包裹自提柜 (柜门 42 待取)',
    shortName: 'Amazon Hub Locker',
    emoji: '📦',
    icon: 'solar:box-linear',
    badge: 'LockerOS · LTE/Wi-Fi 远程柜控',
    specs: '触控取件终端 · 柜门 42 · 包裹已滞留 2 天',
    resolution: '1920 × 1080 自助终端屏',
    chip: 'Android AOSP 工业主板 · 远程柜控模组',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; Amazon-Hub-Locker Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) LockerOS/4.18 Chrome/109.0.0.0 Safari/537.36',
    referer: 'https://hub.amazon.com/locker/pickup/session',
    description: '追踪后台会看见一台真正像自助终端的 Android 柜机；笑点只藏在“包裹自提柜半夜读了邮件”这件事里。',
    plausibility: 78,
    absurdity: 56
  },
  {
    key: 'garmin_bounce_2',
    category: 'foreign_iot',
    name: 'Garmin Bounce 2 儿童 LTE 智能手表 (上课模式)',
    shortName: 'Garmin Bounce 2',
    emoji: '⌚',
    icon: 'solar:watch-round-linear',
    badge: 'Garmin OS · LTE · School Mode',
    specs: '双向通话与短信 · 实时定位 · 当前处于上课禁用模式',
    resolution: '圆形高亮彩屏',
    chip: 'Garmin 低功耗穿戴平台 · LTE 模组',
    userAgent: 'Garmin-Bounce2/3.10 (GarminOS; LTE; SchoolMode-Active; AmazonMusic; Battery-64pct)',
    referer: 'https://connect.garmin.com/junior/messages/inbox',
    description: 'Garmin 的真实 LTE 儿童手表被伪装成邮件客户端，足够像设备遥测，又会让画像系统认真思考一个小学生为何订阅营销邮件。',
    plausibility: 72,
    absurdity: 60
  },
  {
    key: 'zojirushi_nw_jec10',
    category: 'foreign_iot',
    name: 'Zojirushi NW-JEC10 压力 IH 电饭煲 (My Rice AI)',
    shortName: '象印 My Rice 电饭煲',
    emoji: '🍚',
    icon: 'solar:chef-hat-linear',
    badge: 'Pressure IH · My Rice AI',
    specs: '5.5 杯 · AI 炊饭 · 当前状态：Extended Keep Warm',
    resolution: '高对比度橙色菜单液晶',
    chip: '压力/IH 加热控制器 · My Rice 学习逻辑',
    userAgent: 'Zojirushi-NW-JEC10/MyRice-AI-2.7.4 (Pressure-IH; Capacity-5.5cup; KeepWarm-Extended)',
    referer: 'https://www.zojirushi.com/app/my-rice/history',
    description: '型号、容量与 My Rice 学习功能都是真的；唯一虚构的是它在保温米饭时顺便替你打开了邮件。',
    plausibility: 64,
    absurdity: 72
  },
  {
    key: 'petlibro_granary',
    category: 'foreign_iot',
    name: 'PETLIBRO Granary 5L Wi-Fi 智能喂食器',
    shortName: 'PETLIBRO Granary',
    emoji: '🐈',
    icon: 'solar:cat-linear',
    badge: '5 GHz Wi-Fi · App Feeding Log',
    specs: '5L 密封粮仓 · 每日最多 10 餐 · 第 6 餐已投喂',
    resolution: '无屏幕 · App 远程日志',
    chip: '低功耗 Wi-Fi 控制器 · 定量出粮电机',
    userAgent: 'PETLIBRO-Granary/3.4.2 (WiFi-5G; Hopper-5L; MealsPerDay-10; FeedingLog-Sync)',
    referer: 'https://app.petlibro.com/granary/feeding-log',
    description: '一台海外真实销售的联网喂食器，状态字段也像正经 IoT 遥测；追踪器只会困惑猫为什么准时看广告。',
    plausibility: 76,
    absurdity: 64
  },
  {
    key: 'chargepoint_home_flex',
    category: 'foreign_iot',
    name: 'ChargePoint Home Flex 二级家用充电桩 (48A 会话中)',
    shortName: 'ChargePoint Home Flex',
    emoji: '🔌',
    icon: 'solar:bolt-circle-linear',
    badge: 'Level 2 EVSE · 最高 50A',
    specs: 'NACS/J1772 · 智能充电 · 当前输出 48A',
    resolution: '环形 LED 状态灯 · 无浏览屏',
    chip: '联网 EVSE 控制器 · OCPP 会话栈',
    userAgent: 'ChargePoint-HomeFlex/7.16.1 (EVSE; OCPP-1.6J; Connector-NACS; Current-48A; WiFi)',
    referer: 'https://home.chargepoint.com/charging/session',
    description: '真实的联网家用二级充电设备，参数保持合理；它读邮件时看起来更像后台服务误打了一条遥测。',
    plausibility: 84,
    absurdity: 45
  },
  {
    key: 'clover_station_duo',
    category: 'foreign_iot',
    name: 'Clover Station Duo 双屏收银终端 (等待小费确认)',
    shortName: 'Clover Station Duo',
    emoji: '💳',
    icon: 'solar:card-transfer-linear',
    badge: 'Android AOSP · 双屏 POS',
    specs: '14 英寸商户屏 + 8 英寸顾客屏 · Wi-Fi/以太网/4G',
    resolution: '1920 × 1080 + 1280 × 800',
    chip: 'Qualcomm Snapdragon 660 · 2GB RAM',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; Clover Station Duo Build/QKQ1) AppleWebKit/537.36 (KHTML, like Gecko) CloverBrowser/6.4 Chrome/110.0.0.0 Safari/537.36',
    referer: 'https://www.clover.com/dashboard/orders/receipt',
    description: '官方确有 Android AOSP 双屏收银终端；请求头像普通 Chromium，只有设备名会把画像带去一家不存在的三明治店。',
    plausibility: 91,
    absurdity: 32
  },
  {
    key: 'withings_body_scan',
    category: 'foreign_iot',
    name: 'Withings Body Scan 智能体脂秤 (访客模式称重)',
    shortName: 'Withings Body Scan',
    emoji: '⚖️',
    icon: 'solar:scale-linear',
    badge: 'Wi-Fi Sync · Segmental Body Scan',
    specs: '身体成分与心率同步 · 当前记录：访客模式',
    resolution: '高分辨率彩色屏',
    chip: '多频生物电阻抗传感阵列 · Wi-Fi 同步',
    userAgent: 'Withings-BodyScan/6.2.1 (WiFi; Segmental-BIA; HeartRate; GuestMode; Sync-Pending)',
    referer: 'https://healthmate.withings.com/body-scan/timeline',
    description: '医疗感很强但仍是消费级海外真产品；访客模式让它既像真实同步，又不必编造固定身体数据。',
    plausibility: 80,
    absurdity: 58
  },
  {
    key: 'quantum_random',
    category: 'dirt_cheap',
    name: '薛定谔量子随机混淆 (Quantum Shuffler)',
    shortName: '量子随机轮换',
    emoji: '🎲',
    icon: 'solar:atom-linear',
    badge: 'Quantum Jitter · 动态坍缩',
    specs: '全库离奇设备随机坍缩 · 无法构建稳定画像',
    resolution: '全域随机维度',
    chip: '超对称随机数发生器',
    userAgent: '(每次诱饵发射时，在上述所有奇异设备中随机挑选一种)',
    referer: 'about:blank',
    description: '每次探测触发时动态伪装成完全不同的离奇设备，让商业画像分析算法彻底陷入认知混乱。'
  }
];

const CATEGORY_METRICS = {
  mainstream_daily: { plausibility: 94, absurdity: 8 },
  retro_ancient: { plausibility: 48, absurdity: 52 },
  intimate: { plausibility: 58, absurdity: 88 },
  home_bath: { plausibility: 72, absurdity: 68 },
  foreign_iot: { plausibility: 80, absurdity: 55 },
  exotic_public: { plausibility: 64, absurdity: 70 },
  scifi_defense: { plausibility: 12, absurdity: 100 },
  dirt_cheap: { plausibility: 58, absurdity: 62 }
};

export const DECOY_PERSONAS = RAW_DECOY_PERSONAS.map(persona => ({
  ...CATEGORY_METRICS[persona.category],
  ...persona
}));

export function getDecoyTuning() {
  const fallback = { plausibility: 78, absurdity: 48 };
  try {
    const stored = JSON.parse(localStorage.getItem(DECOY_TUNING_STORAGE_KEY) || 'null');
    return {
      plausibility: Math.max(0, Math.min(100, Number(stored?.plausibility ?? fallback.plausibility))),
      absurdity: Math.max(0, Math.min(100, Number(stored?.absurdity ?? fallback.absurdity)))
    };
  } catch (e) {
    return fallback;
  }
}

export function setDecoyTuning(tuning) {
  const normalized = {
    plausibility: Math.max(0, Math.min(100, Number(tuning?.plausibility ?? 78))),
    absurdity: Math.max(0, Math.min(100, Number(tuning?.absurdity ?? 48)))
  };
  try {
    localStorage.setItem(DECOY_TUNING_STORAGE_KEY, JSON.stringify(normalized));
  } catch (e) {}
  return normalized;
}

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
    const pool = DECOY_PERSONAS.filter(p => p.key !== 'quantum_random' && p.key !== 'native_real' && p.key !== 'silent_block');
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }
  return DECOY_PERSONAS.find(p => p.key === key) || DECOY_PERSONAS[0];
}

// ── 分邮箱独立绑定花活矩阵 (Per-Email Persona Binding Matrix) ───────────────
export const DECOY_ACCOUNT_MAP_KEY = 'cloud_mail_account_persona_map';

/**
 * Get map of per-email persona bindings: { [email]: personaKey }
 */
export function getAccountPersonaMap() {
  try {
    const raw = localStorage.getItem(DECOY_ACCOUNT_MAP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {}
  return {};
}

/**
 * Set custom persona binding for a specific email address
 */
export function setAccountPersona(email, personaKey) {
  if (!email) return false;
  try {
    const map = getAccountPersonaMap();
    const cleanEmail = email.toLowerCase().trim();
    if (!personaKey || personaKey === 'inherit_global') {
      delete map[cleanEmail];
    } else if (DECOY_PERSONAS.some(p => p.key === personaKey)) {
      map[cleanEmail] = personaKey;
    }
    localStorage.setItem(DECOY_ACCOUNT_MAP_KEY, JSON.stringify(map));
    return true;
  } catch (e) {}
  return false;
}

/**
 * Remove custom persona binding for an email address (reverts to global default)
 */
export function removeAccountPersona(email) {
  return setAccountPersona(email, null);
}

/**
 * Get effective persona key for a specific email address
 */
export function getPersonaKeyForAccount(email) {
  if (email) {
    try {
      const map = getAccountPersonaMap();
      const cleanEmail = email.toLowerCase().trim();
      if (map[cleanEmail] && DECOY_PERSONAS.some(p => p.key === map[cleanEmail])) {
        return map[cleanEmail];
      }
    } catch (e) {}
  }
  return getActivePersonaKey();
}

/**
 * Get effective persona object for a specific email address, including custom flag
 */
export function getEffectivePersona(email) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const isCustom = !!(cleanEmail && getAccountPersonaMap()[cleanEmail]);
  const key = getPersonaKeyForAccount(cleanEmail);
  const persona = DECOY_PERSONAS.find(p => p.key === key) || DECOY_PERSONAS[0];
  return {
    persona,
    personaKey: key,
    isCustom
  };
}

