/**
 * 应用配置管理
 * 客户端可读变量使用 NEXT_PUBLIC_ 前缀（Vite envPrefix 与既有 .env 兼容）
 */

/**
 * 应用环境类型
 */
export type AppEnvironment = "development" | "staging" | "production";

/**
 * 获取当前环境
 */
export const getEnvironment = (): AppEnvironment => {
  const mode = import.meta.env.NEXT_PUBLIC_APP_MODE?.trim();
  if (mode === "production" || mode === "staging" || mode === "development") {
    return mode;
  }
  return import.meta.env.PROD ? "production" : "development";
};

/**
 * 工具箱站点根地址（末尾带 /），用于登录后跳转、外链等。
 * 优先级：NEXT_PUBLIC_TOOLBOX_BASE_URL > 按 MODE 默认（dev→localhost:8081，staging→test.toolbox，production→toolbox.oran.cn）
 */
function resolveToolboxBaseUrl(): string {
  const fromEnv = import.meta.env.NEXT_PUBLIC_TOOLBOX_BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  if (import.meta.env.NEXT_PUBLIC_APP_MODE === "staging") {
    return "https://test.toolbox.oran.cn/";
  }
  if (import.meta.env.PROD) {
    return "https://toolbox.oran.cn/";
  }
  return "http://localhost:8081/";
}

const toolboxBaseUrl = resolveToolboxBaseUrl();
const toolboxOrigin = toolboxBaseUrl.replace(/\/$/, "");

/**
 * 应用配置
 */
export const config = {
  // 环境信息
  env: getEnvironment(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,

  // 工具箱（独立站点）：本地 npm run dev 与测试/生产构建见各 .env.* 中的 NEXT_PUBLIC_TOOLBOX_BASE_URL
  toolbox: {
    baseUrl: toolboxBaseUrl,
    origin: toolboxOrigin,
  },

  // API 配置
  api: {
    baseUrl: import.meta.env.NEXT_PUBLIC_API_BASE_URL || "",
    timeout: Number(import.meta.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    modelsBaseUrl: import.meta.env.NEXT_PUBLIC_MODELS_API_BASE_URL || "",
    libraryBaseUrl: import.meta.env.NEXT_PUBLIC_LIBRARY_API_BASE_URL || "",
    authBaseUrl: import.meta.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "",
    /** 计费网关；未配置时与 auth 同源，仍为空则走站点相对路径 /billing（依赖反向代理） */
    billingBaseUrl:
      (
        import.meta.env.NEXT_PUBLIC_BILLING_API_BASE_URL ||
        import.meta.env.NEXT_PUBLIC_AUTH_API_BASE_URL ||
        ""
      ).replace(/\/$/, ""),
    imageGenUrl:
      import.meta.env.NEXT_PUBLIC_IMAGE_GEN_URL ||
      `${toolboxBaseUrl}ai-toolbox/text-to-image`,
    videoGenUrl:
      import.meta.env.NEXT_PUBLIC_VIDEO_GEN_URL ||
      `${toolboxBaseUrl}ai-toolbox/text-to-video`,
  },

  // 应用信息
  app: {
    name: import.meta.env.NEXT_PUBLIC_APP_NAME || "OranAI Vision Engine",
    version: import.meta.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  },

  // 功能开关
  features: {
    enableAnalytics: import.meta.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableErrorReporting: import.meta.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING !== "false",
    enablePerformanceMonitoring:
      import.meta.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
  },

  // 第三方服务配置
  services: {
    sentry: {
      dsn: import.meta.env.NEXT_PUBLIC_SENTRY_DSN || "",
      enabled: import.meta.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",
    },
    analytics: {
      id: import.meta.env.NEXT_PUBLIC_ANALYTICS_ID || "",
      enabled: import.meta.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    },
  },
} as const;

/**
 * 验证必需的配置项
 */
export const validateConfig = (): void => {
  const requiredEnvVars: string[] = [];

  if (config.isProd) {
    // 生产环境必需的配置
  }

  if (requiredEnvVars.length > 0) {
    const env = import.meta.env as Record<string, string | boolean | undefined>;
    const missing = requiredEnvVars.filter((key) => !env[key]);
    if (missing.length > 0) {
      console.warn(
        `缺少以下环境变量: ${missing.join(", ")}. 应用可能无法正常工作.`,
      );
    }
  }
};

if (typeof window !== "undefined") {
  validateConfig();
}
