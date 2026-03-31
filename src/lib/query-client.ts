import { QueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

/**
 * 每次在客户端 Provider 内用 useState 创建实例，避免服务端多请求共享同一 QueryClient 缓存。
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          logger.error("Mutation failed", error as Error);
        },
      },
    },
  });
}
