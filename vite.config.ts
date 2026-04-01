import path from "path";
import type { IncomingMessage } from "http";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** 与原 next.config rewrites 一致，本地开发同源转发 */
const oranTarget = "http://119.13.125.102:29273";

/**
 * Vite 代理 bypass：返回 `false` 会由 Vite 直接响应 404（见 node_modules/vite proxy 中间件）。
 * SPA 需返回 `"/index.html"`，改写 req.url 后 next()，才能交给前端路由。
 */
function spaBypassForPath(req: IncomingMessage, pathPrefixes: string[]): string | undefined {
  const raw = req.url?.split("?")[0] ?? "";
  const pathname = raw.startsWith("/") ? raw : `/${raw}`;
  for (const prefix of pathPrefixes) {
    const p = prefix.startsWith("/") ? prefix : `/${prefix}`;
    if (pathname === p || pathname.startsWith(`${p}/`)) {
      return "/index.html";
    }
  }
  return undefined;
}

/**
 * 只把相对独立的大依赖拆出去；react / react-dom 交给 Rollup 默认分块，
 * 避免与 vendor 之间出现 circular chunk 告警。
 */
function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) return;
  if (id.includes("framer-motion") || id.includes("motion-dom")) return "motion";
  if (id.includes("recharts")) return "recharts";
  if (id.includes("@radix-ui")) return "radix-ui";
  if (id.includes("lucide-react")) return "lucide";
  if (id.includes("@tanstack")) return "tanstack";
  if (id.includes("react-router")) return "react-router";
  return;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  /** 保留现有 .env 中 NEXT_PUBLIC_* 前缀 */
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  server: {
    port: 8080,
    proxy: {
      "/api/pricing": {
        target: "https://models.photog.art",
        changeOrigin: true,
      },
      "/api/models": {
        target: "https://models.photog.art",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/models/, ""),
      },
      "/api/app": { target: oranTarget, changeOrigin: true },
      "/auth": { target: oranTarget, changeOrigin: true },
      "/api/auth": { target: oranTarget, changeOrigin: true },
      "/billing": {
        target: oranTarget,
        changeOrigin: true,
        bypass: (req) => spaBypassForPath(req, ["/billing/checkout/success"]),
      },
      "/oauth2": { target: oranTarget, changeOrigin: true },
      "/api/captcha": { target: oranTarget, changeOrigin: true },
      "/api/register": { target: oranTarget, changeOrigin: true },
      "/oauth": {
        target: oranTarget,
        changeOrigin: true,
        bypass: (req) => spaBypassForPath(req, ["/oauth/callback"]),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: { manualChunks },
    },
  },
});
