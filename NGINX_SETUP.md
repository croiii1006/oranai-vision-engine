# Nginx 配置说明

## 概述

此配置文件用于在宝塔面板中配置 Nginx 反向代理，解决前端应用（`home.photog.art`）访问后端 API 时的跨域问题。

## 配置说明

### 1. API 代理路径

- **Models API**: `/api/models` → `https://models.photog.art`
- **Library API**: `/api/library` → `https://photog.art`

### 2. 工作原理

前端在生产环境使用相对路径：
- Models API: `/api/models/api/pricing`
- Library API: `/api/library/api/app/material-square/page`

Nginx 会：
1. 匹配 `/api/models` 或 `/api/library` 路径
2. 移除前缀（`/api/models` 或 `/api/library`）
3. 将剩余路径转发到对应的后端服务器

### 3. 部署步骤

1. **备份现有配置**
   ```bash
   cp /www/server/panel/vhost/nginx/home.photog.art.conf /www/server/panel/vhost/nginx/home.photog.art.conf.backup
   ```

2. **替换配置文件**
   - 将 `nginx.conf` 的内容复制到宝塔面板的网站配置中
   - 或者直接替换 `/www/server/panel/vhost/nginx/home.photog.art.conf`

3. **测试配置**
   ```bash
   nginx -t
   ```

4. **重载 Nginx**
   ```bash
   nginx -s reload
   # 或者在宝塔面板中点击"重载配置"
   ```

### 4. 前端配置

前端代码已自动配置：
- **生产环境**：使用相对路径 `/api/models` 和 `/api/library`
- **开发环境**：使用完整 URL `https://models.photog.art` 和 `https://photog.art`

### 5. CORS 配置

配置文件已包含完整的 CORS 设置：
- 允许所有来源（`Access-Control-Allow-Origin: *`）
- 支持所有常用 HTTP 方法
- 处理 OPTIONS 预检请求
- 支持凭证传递

### 6. 注意事项

1. **SSL 验证**：当前配置关闭了 SSL 验证（`proxy_ssl_verify off`），如果后端使用自签名证书，这是必需的。如果使用有效证书，可以改为 `on`。

2. **超时设置**：默认超时时间为 30 秒，可根据实际情况调整。

3. **缓存**：静态资源（图片、JS、CSS）已配置缓存策略。

4. **SPA 路由**：配置了 `try_files` 以支持单页应用的路由。

### 7. 故障排查

如果遇到问题，检查：

1. **Nginx 错误日志**
   ```bash
   tail -f /www/wwwlogs/home.photog.art.error.log
   ```

2. **访问日志**
   ```bash
   tail -f /www/wwwlogs/home.photog.art.log
   ```

3. **测试代理**
   ```bash
   curl -I https://home.photog.art/api/models/api/pricing
   ```

4. **检查后端服务**
   - 确认 `https://models.photog.art` 可访问
   - 确认 `https://photog.art` 可访问

### 8. 安全建议

1. 如果需要限制访问来源，可以将 `Access-Control-Allow-Origin *` 改为具体域名：
   ```nginx
   add_header Access-Control-Allow-Origin https://home.photog.art always;
   ```

2. 如果后端需要认证，确保代理传递了正确的认证头。

3. 考虑添加速率限制以防止滥用。

