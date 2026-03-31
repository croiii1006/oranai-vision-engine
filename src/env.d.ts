/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** 与 Vite MODE 对应：development | staging | production */
    NEXT_PUBLIC_APP_MODE?: string;
    /** 工具箱站点根 URL */
    NEXT_PUBLIC_TOOLBOX_BASE_URL?: string;
    NEXT_PUBLIC_API_BASE_URL?: string;
    NEXT_PUBLIC_API_TIMEOUT?: string;
    NEXT_PUBLIC_MODELS_API_BASE_URL?: string;
    NEXT_PUBLIC_LIBRARY_API_BASE_URL?: string;
    NEXT_PUBLIC_AUTH_API_BASE_URL?: string;
    /** 计费 API 根 URL；不填则复用 AUTH，或开发环境下相对 /billing */
    NEXT_PUBLIC_BILLING_API_BASE_URL?: string;
    NEXT_PUBLIC_IMAGE_GEN_URL?: string;
    NEXT_PUBLIC_VIDEO_GEN_URL?: string;
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_VERSION?: string;
    NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
    NEXT_PUBLIC_ENABLE_ERROR_REPORTING?: string;
    NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_SENTRY_ENABLED?: string;
    NEXT_PUBLIC_ANALYTICS_ID?: string;
    NEXT_PUBLIC_ANALYTICS_ENABLED?: string;
    /** 站点绝对 URL，用于 metadata 中 OG 图片等解析 */
    NEXT_PUBLIC_SITE_URL?: string;
  }
}
