/**
 * 主导航 tab 与 URL 路径对应（SPA 路由）
 */

export type SiteNavTab =
  | "home"
  | "hero"
  | "solution"
  | "models"
  | "products"
  | "library"
  | "pricing";

const TAB_TO_PATH: Record<string, string> = {
  home: "/",
  hero: "/",
  solution: "/solution",
  models: "/models",
  products: "/products",
  library: "/library",
  pricing: "/pricing",
};

export function normalizeSitePath(pathname: string | null): string {
  if (!pathname) return "/";
  const pathOnly = pathname.split("?")[0] ?? "/";
  if (pathOnly === "") return "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly;
}

/** 将导航 tab 转为 pathname（不含 basePath） */
export function pathFromTab(tab: string): string {
  return TAB_TO_PATH[tab] ?? "/";
}

/** 从 pathname 解析当前主导航 tab（用于 Header 高亮与内容切换） */
export function tabFromPathname(pathname: string): SiteNavTab {
  const p = normalizeSitePath(pathname);
  if (p === "/") return "home";
  const seg = p.slice(1).split("/")[0];
  switch (seg) {
    case "models":
      return "models";
    case "products":
      return "products";
    case "library":
      return "library";
    case "solution":
      return "solution";
    case "pricing":
      return "pricing";
    default:
      return "home";
  }
}

const DEFAULT_TITLE = "OranAI — AI for Integrated Marketing Intelligence";

/** 浏览器 document.title（替代 Next metadata） */
export function documentTitleForPath(pathname: string): string {
  const tab = tabFromPathname(normalizeSitePath(pathname));
  switch (tab) {
    case "models":
      return "Platform — OranAI";
    case "products":
      return "Products — OranAI";
    case "pricing":
      return "Pricing — OranAI";
    case "library":
      return "Inspiration — OranAI";
    case "solution":
      return "Solution — OranAI";
    default:
      return DEFAULT_TITLE;
  }
}
