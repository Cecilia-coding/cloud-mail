<div align="center">
  <p align="center">
    <img src="doc/demo/logo.png" width="76" alt="Cloud Mail Logo" />
  </p>
  <h1 align="center">✦ 雲端密匣 · Cloud Mail Codex ✦</h1>
  <p align="center">基于 Cloudflare Workers 架构的古典手抄本美学邮箱 · 深度隐私隔离 · 边缘反侦察诱饵剧场</p>
  <p align="center">
    <a href="./README.md">简体中文</a> | <a href="./README-en.md">English</a>
  </p>
</div>

---

### ✦ 卷首题记

> “既然商业数据平台的采集管道已经铺设完毕，空手而归未免有失礼节。”

本分支在原有 Cloud Mail 架构之上，进行了视觉层、安全沙箱层与反侦察交互层的全面重构。
不仅赋予其低饱和羊皮纸手抄本、黑曜潜行与冷玉青墨三套典籍质感，更为每一封来信筑起坚实的安全防线，并在发件方试图刺探阅读回执与指纹时，反向喂给其荒谬可信的边缘伪装数据。

---

## ✦ 核心特色

### 1. 沉浸式手抄本美学与全端交互 (Aesthetics & Codex Architecture)
- **多套高定主题自适应**：
  - **羊皮手抄本 (Muted Codex)**：柔雾灰紫羊皮浅底、暮紫曜墨、古铜暗流金与烟粉灰玫瑰红细双线。
  - **黑曜潜行 (Obsidian Stealth)**：现代主义暗夜黑曜、哑光微磨砂玻璃卡片与冷钛灰金。
  - **冷玉青墨 (Celadon Emerald)**：幽淡青碧与温润玉色。
- **开屏星象浑天仪 (Astrolabe Celestial Star Loader)**：纯矢量内联 SVG 动画，外层星盘点阵刻度缓旋、中层天体双轨交错自转、内核八芒密典星印呼吸脉冲，搭配 2px 极细流金刻度条。
- **移动端专属「密匣印籍大厅 (Accounts Hub)」**：
  - 手机端冷启动直达多邮箱卡片矩阵，彻底告别写死 admin 霸屏与深层翻找的困扰。
  - 置顶「✦ 全域联合信匣 (All Inboxes)」入口，一键总览名下所有小号的聚合邮件流水。
  - 常用小号与别名居中排布，主管理号（admin）自动沉底系统底匣并标注暗色微标。
  - 收件箱等子页面左上角常驻「‹ 印籍」胶囊按键，随时一触退回大厅挑号。
  - 全流程本地状态记忆（`cloud_mail_last_account_id`），切后台或刷新保持当前信匣上下文。
- **古典排印与阻尼动效**：汇文明朝体与 Cormorant Garamond 衬线斜体混排，星芒与十字菱标（✦ / ❖ / ✧），物理阻尼微动效。

### 2. 隐私防线与安全沙箱 (Security & Privacy Shield)
- **多端独立并发会话 (Independent Concurrent Device Sessions)**：多设备多浏览器同时在线，各自持有独立令牌与生命周期，互不挤占下线。
- **DOM 深度脱敏净化 (DOM Sanitizer)**：严格阻断正文中的 `<script>`、`<iframe>`、`<object>`、`<embed>` 与内联监听事件。
- **远程恶意 CSS 阻断 (Remote CSS Blocking)**：严防利用 `@import`、外部字体及混杂资源刺探阅读者 IP 与客户端指纹。
- **信标雷达与外链解构**：
  - 精准识别并拦截 1x1 隐形追踪像素、隐藏零像素信标（Web Beacon）。
  - 自动剥离邮件超链接中附带的 UTM、telemetry 等各类营销追踪参数。
  - 中和混杂 `srcset` 探测，隔离本地与外部附件。
- **内置隐私审计与遥测日志**：可视化实时审计面板，直观呈现每封邮件被封印的探针数量与拦截记录。

### 3. 伪装回馈与诱饵剧场 (Decoy Personas & Adaptive Telemetry Poisoning)
- **绝非单纯拦截，而是战术反制**：当追踪探针发起刺探时，提供三种防御模式：
  - **绝对静默拦截 (`silent_block`)**：物理阻断，零外发出站网络请求。
  - **真实本机直出**：原生指纹直传，不使用任何替身。
  - **伪装浓度调音台与边缘投毒 (`edge telemetry poisoning`)**：由 Cloudflare Worker 边缘节点发起反向欺骗请求，喂给追踪服务器真实有效但荒谬绝伦的客户端画像。
- **58+ 款诱饵设备画像矩阵**：
  - **智能卫浴与离奇厨电**：科勒智能马桶（Kohler Numi 2.0）、特斯拉中控（Tesla Model S Plaid）、智能烤面包机等。
  - **离奇海外与商用机台**：麦当劳自助点餐机、拉斯维加斯老虎机、KTV 点歌台、波音 787 机载娱乐系统（IFE）等。
  - **深空科学与重工重器**：韦伯太空望远镜（JWST）、俄亥俄级核潜艇声呐终端、CERN 粒子对撞机控制台等。
  - **赛博古董与已死系统**：诺基亚 N97、索尼 PSP-1000、iPod Classic、魅族 M6、Palm Pre 等。
  - **私密情趣与成人玩具**：LELO F1S V2、Satisfyer Pro 2 Gen3、Kiiroo Keon 1/2 等。
  - **现代常规与日常真机**：iPhone 16 Pro Max、MacBook Pro M4、Pixel 9 Pro XL、iPad Pro M4、ThinkPad X1 Carbon 等。
- **邮箱级专属画像绑定**：支持名下每一个小号独立选派诱饵替身，量体裁衣。
- **自适应延迟剧场 (Adaptive Decoy Theater)**：动态模拟人类阅读时间阻尼，在延迟随机区间后再行触发边缘反馈，彻底粉碎追踪大数据的算法画像模型。

### 4. 基础全功能邮箱底座 (Core Mailbox Engine)
- **低成本 Serverless**：纯依托 Cloudflare 免费/低成本生态（Workers、D1、KV、R2）。
- **完整邮件收发**：集成 Resend 邮件外发，支持群发、内嵌图片与大附件存取。
- **智能验证码捕获**：依托 Workers AI 自动提取邮件验证码。
- **全域收信 (Catch-all)**：支持单信箱独占全域域名流量，多域名自由绑定。
- **细粒度 RBAC 权限管理**：完善的角色权限、邀请码注册、发送限额与安全防御监控。

---

## ✦ 实机展演

<div align="center">
  <p><strong>密匣印籍大厅 (Accounts Hub · 掌中信匣矩阵与全域收信)</strong></p>
  <img src="doc/demo/demo_accounts_hub.png" width="92%" alt="密匣印籍大厅实机截图" />
  <br><br>
  <p><strong>伪装回馈与诱饵剧场 (Decoy Personas · 全局备用花话与反侦察矩阵)</strong></p>
  <img src="doc/demo/demo_decoy_personas.png" width="92%" alt="诱饵伪装剧场实机截图" />
</div>

---

## ✦ 技术栈架构

- **边缘计算运行环境**：[Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **后端 Web 框架**：[Hono](https://hono.dev/)
- **关系型数据库与 ORM**：[Cloudflare D1](https://developers.cloudflare.com/d1/) + [Drizzle ORM](https://orm.drizzle.team/)
- **高频状态与缓存**：[Cloudflare KV](https://developers.cloudflare.com/kv/)
- **海量对象存储**：[Cloudflare R2](https://developers.cloudflare.com/r2/)
- **前端核心引擎**：[Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) + [Pinia](https://pinia.vuejs.org/) + [Vue Router](https://router.vuejs.org/)
- **UI 组件库与图标**：[Element Plus](https://element-plus.org/) + [Iconify](https://iconify.design/)
- **自动化构建部署**：GitHub Actions + Cloudflare Wrangler

---

## ✦ 快速部署

本项目使用 GitHub Actions 自动化部署流程，推送到 `main` 分支时将自动执行前端打包与 Worker 发布。

### 1. 配置仓库密钥 (Repository Secrets / Variables)
在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions` 中配置以下环境变量：
- `CLOUDFLARE_API_TOKEN`：具备 Workers、D1、KV、R2 管理权限的 API 令牌
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID
- `DOMAIN`：邮件域名 JSON 数组，如 `["example.com"]`
- `ADMIN`：管理员邮箱地址，如 `admin@example.com`
- `JWT_SECRET`：系统安全鉴权签名密钥
- `CUSTOM_DOMAIN`（可选）：绑定 Worker 的自定义访问域名

### 2. 触发部署
配置完成后，将代码推送到 `main` 分支，或在 Actions 页面手动运行 `Deploy cloud-mail to Cloudflare Workers` 即可全自动构建部署完毕。

---

## ✦ 许可证

本项目遵循 [MIT](LICENSE) 开源协议。
