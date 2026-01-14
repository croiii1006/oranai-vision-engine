# Nginx 代理缓冲区配置修复

## 问题描述

错误信息：
```
nginx: [emerg] "proxy_busy_buffers_size" must be less than the size of all "proxy_buffers" minus one buffer in /www/server/nginx/conf/nginx.conf:97
```

## 原因分析

Nginx 要求 `proxy_busy_buffers_size` 必须小于 `proxy_buffers` 的总大小减去一个缓冲区的大小。

计算公式：
- `proxy_buffers 8 4k` = 8 个缓冲区 × 4k = 32k 总大小
- `proxy_busy_buffers_size` 必须 < 32k - 4k = 28k

## 解决方案

### 方案 1：使用当前配置（已修复）

网站配置文件 (`nginx.conf`) 中已添加：
```nginx
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;  # 8k < 28k ✓
```

### 方案 2：如果主配置文件有问题

如果错误仍然存在，可能是主配置文件 (`/www/server/nginx/conf/nginx.conf`) 中有全局设置。

检查主配置文件第 97 行附近：
```bash
grep -n "proxy_busy_buffers_size\|proxy_buffers" /www/server/nginx/conf/nginx.conf
```

如果主配置文件中有问题，可以：

1. **修改主配置文件**（不推荐，可能影响其他网站）
2. **在网站配置中显式覆盖**（推荐）

在网站配置的 `server` 块开头添加：
```nginx
server {
    # 覆盖主配置的全局设置
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    
    # ... 其他配置
}
```

### 方案 3：使用更保守的配置

如果仍有问题，可以使用更大的缓冲区：
```nginx
proxy_buffer_size 8k;
proxy_buffers 4 8k;           # 总共 32k
proxy_busy_buffers_size 16k;  # 16k < 24k (32k - 8k) ✓
```

或者：
```nginx
proxy_buffer_size 4k;
proxy_buffers 16 4k;          # 总共 64k
proxy_busy_buffers_size 32k;  # 32k < 60k (64k - 4k) ✓
```

## 验证配置

测试配置：
```bash
nginx -t
```

如果测试通过，重载配置：
```bash
nginx -s reload
# 或者在宝塔面板中点击"重载配置"
```

## 推荐配置值

对于大多数 API 代理场景，推荐使用：
```nginx
proxy_buffer_size 4k;
proxy_buffers 8 4k;           # 总共 32k，适合大多数响应
proxy_busy_buffers_size 8k;   # 安全值，小于限制
```

对于大文件或流式响应，可以增加：
```nginx
proxy_buffer_size 8k;
proxy_buffers 8 8k;           # 总共 64k
proxy_busy_buffers_size 16k;  # 安全值
```

