"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { IPDetectionProvider } from "@/contexts/IPDetectionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import { useEffect, useRef } from "react";
import { getToken, clearAuth, saveUserInfo } from "@/lib/utils/auth-storage";
import { getUserInfo } from "@/lib/api/auth";

const queryClient = new QueryClient({
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

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const initializeAuth = async () => {
      const token = getToken();

      if (token) {
        try {
          const userInfoResponse = await getUserInfo();
          saveUserInfo(userInfoResponse.data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("401") || errorMessage.includes("登录已过期")) {
            logger.warn("Token expired (401), auth data already cleared", {
              message: errorMessage,
            });
          } else {
            logger.warn("Failed to get user info, clearing token", {
              message: errorMessage,
            });
            clearAuth();
          }
        }
      } else {
        clearAuth();
      }
    };

    initializeAuth();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <IPDetectionProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </IPDetectionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
