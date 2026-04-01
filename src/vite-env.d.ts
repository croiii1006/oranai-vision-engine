/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 与 Vite MODE 对应：development | staging | production */
  readonly NEXT_PUBLIC_APP_MODE?: string;
  /** 工具箱站点根 URL */
  readonly NEXT_PUBLIC_TOOLBOX_BASE_URL?: string;
  readonly NEXT_PUBLIC_API_BASE_URL?: string;
  readonly NEXT_PUBLIC_API_TIMEOUT?: string;
  readonly NEXT_PUBLIC_MODELS_API_BASE_URL?: string;
  readonly NEXT_PUBLIC_LIBRARY_API_BASE_URL?: string;
  readonly NEXT_PUBLIC_AUTH_API_BASE_URL?: string;
  /** 计费 API 根 URL；不填则复用 AUTH，或开发环境下相对 /billing */
  readonly NEXT_PUBLIC_BILLING_API_BASE_URL?: string;
  readonly NEXT_PUBLIC_IMAGE_GEN_URL?: string;
  readonly NEXT_PUBLIC_VIDEO_GEN_URL?: string;
  readonly NEXT_PUBLIC_APP_NAME?: string;
  readonly NEXT_PUBLIC_APP_VERSION?: string;
  readonly NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
  readonly NEXT_PUBLIC_ENABLE_ERROR_REPORTING?: string;
  readonly NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING?: string;
  readonly NEXT_PUBLIC_SENTRY_DSN?: string;
  readonly NEXT_PUBLIC_SENTRY_ENABLED?: string;
  readonly NEXT_PUBLIC_ANALYTICS_ID?: string;
  readonly NEXT_PUBLIC_ANALYTICS_ENABLED?: string;
  /** 站点绝对 URL，用于 OG 等解析 */
  readonly NEXT_PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
