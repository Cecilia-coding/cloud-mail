# Cloud Mail · Optional Egress Relay

这是反向回馈系统的可拔插出口桥。邮件 Worker 继续负责拦截、延迟与人格选择；本服务只接收经过 HMAC 签名的单次任务，并通过 Webshare HTTP 代理池执行一个 `GET`。

## Netlify 部署

1. 在 Netlify 中导入仓库，将 Base directory 设为 `egress-relay`。`netlify.toml` 会运行测试并部署函数。
2. 配置两个加密环境变量：
   - `RELAY_SHARED_SECRET`：随机长字符串，同时写入 Cloudflare Worker secret `EGRESS_RELAY_SECRET`。
   - `WEBSHARE_PROXY_POOL`：代理数组 JSON，格式见 `.env.example`。
3. 部署后，把函数地址（`https://<project>.netlify.app/api/probe`）写入 Cloudflare Worker secret `EGRESS_RELAY_URL`。

十枚代理可分别附带 `country`、`city` 与 `label`。这些描述会进入 90 天摘要档案；代理地址、用户名和密码不会回传给邮件 Worker。

没有配置这两个 Worker secrets 时，Cloud Mail 仍按原来的 Cloudflare 出口运行，设置页会将外接出口标为“等待挂载”。

