import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { IPDetectionProvider } from "@/contexts/IPDetectionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * 配置 QueryClient
 * 优化缓存策略和错误处理
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 缓存时间：5分钟
      staleTime: 5 * 60 * 1000,
      // 垃圾回收时间：10分钟
      gcTime: 10 * 60 * 1000,
      // 失败重试次数
      retry: 3,
      // 重试延迟：指数退避
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口聚焦时重新获取
      refetchOnWindowFocus: false,
      // 网络重连时重新获取
      refetchOnReconnect: true,
    },
    mutations: {
      // 失败重试次数
      retry: 1,
      // 错误处理
      onError: (error) => {
        logger.error("Mutation failed", error as Error);
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <IPDetectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </IPDetectionProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
