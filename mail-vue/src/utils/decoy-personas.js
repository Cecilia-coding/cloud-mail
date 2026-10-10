/**
 * Decoy Personas & Telemetry Poisoning Engine (幽灵替身与遥测反向投毒)
 * 
 * Disguises email client identity as exotic and hilarious devices (JWST Space Telescope,
 * KTV VOD Kiosk, Smart Toilet, Kindle, iPod Classic, Smart Toaster, Boeing 777 In-Flight Screen,
 * Vegas Slot Machine, Porsche Taycan, Nuclear Submarine, CERN LHC, Walmart $15 Stick, ESP8266, etc.)
 * and dispatches spoofed telemetry via Cloudflare Worker edge proxy.
 */

export const DECOY_STORAGE_KEY = 'cloud_mail_decoy_persona';

export const DECOY_CATEGORIES = [
  { key: 'all', name: '全部印籍', icon: 'solar:widget-linear' },
  { key: 'home', name: '智能卫浴与厨电', icon: 'solar:bath-linear' },
  { key: 'retro', name: '赛博古董与乐器', icon: 'solar:cassette-linear' },
  { key: 'exotic', name: '离奇海外与商用', icon: 'solar:shop-2-linear' },
  { key: 'scifi', name: '深空科考与重器', icon: 'solar:rocket-2-linear' },
  { key: 'cheap', name: '离谱廉价穷鬼机', icon: 'solar:tag-price-linear' }
];

export const DECOY_PERSONAS = [
  // ── 智能卫浴与厨电 ─────────────────────────────────────────────
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
    key: 'smart_toaster',
    category: 'home',
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

  // ── 赛博古董与乐器 ─────────────────────────────────────────────
  {
    key: 'ktv_kiosk',
    category: 'retro',
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

  // ── 离奇海外与商用 ─────────────────────────────────────────────
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
    key: 'porsche_taycan',
    category: 'exotic',
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
    key: 'boeing_ife',
    category: 'exotic',
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
    key: 'vegas_slots',
    category: 'exotic',
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

  // ── 深空科考与重器 ─────────────────────────────────────────────
  {
    key: 'jwst_telescope',
    category: 'scifi',
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
    category: 'scifi',
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
    category: 'scifi',
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

  // ── 离谱廉价穷鬼机 ─────────────────────────────────────────────
  {
    key: 'walmart_onn',
    category: 'cheap',
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
    category: 'cheap',
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
    category: 'cheap',
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
    category: 'cheap',
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
    key: 'quantum_random',
    category: 'cheap',
    name: '薛定谔量子随机混淆 (Quantum Shuffler)',
    shortName: '量子随机轮换',
    emoji: '🎲',
    icon: 'solar:atom-linear',
    badge: 'Quantum Jitter · 动态坍缩',
    specs: '全宇宙 26 种离奇奇异设备库随机坍缩 · 无法构建画像',
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
