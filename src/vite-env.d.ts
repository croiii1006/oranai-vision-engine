/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 工具箱站点根 URL，如 https://test.toolbox.oran.cn/ 或 http://localhost:8081/ */
  readonly VITE_TOOLBOX_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
