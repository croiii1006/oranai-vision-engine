import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 与 vite.config.ts 中 dev 代理一致，便于本地开发时同源请求转发 */
const oranTarget = "http://119.13.125.102:29273";

const nextConfig: NextConfig = {
  /** 避免父目录存在其他 package-lock 时误判 monorepo 根目录 */
  outputFileTracingRoot: __dirname,
  /** 按需解析子路径，减小 lucide 等包体积 */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/pricing/:path*",
          destination: "https://models.photog.art/api/pricing/:path*",
        },
        {
          source: "/api/models/:path*",
          destination: "https://models.photog.art/:path*",
        },
        {
          source: "/api/app/:path*",
          destination: `${oranTarget}/api/app/:path*`,
        },
        { source: "/auth/:path*", destination: `${oranTarget}/auth/:path*` },
        { source: "/billing/:path*", destination: `${oranTarget}/billing/:path*` },
        { source: "/oauth2/:path*", destination: `${oranTarget}/oauth2/:path*` },
        {
          source: "/api/captcha/:path*",
          destination: `${oranTarget}/api/captcha/:path*`,
        },
        {
          source: "/api/register/:path*",
          destination: `${oranTarget}/api/register/:path*`,
        },
      ],
      /** 与 Vite bypass 一致：先有前端路由 /oauth/callback/google，其余 /oauth/* 再走后端 */
      fallback: [
        {
          source: "/oauth/:path*",
          destination: `${oranTarget}/oauth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
