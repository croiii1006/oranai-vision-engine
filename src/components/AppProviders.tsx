import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { IPDetectionProvider } from "@/contexts/IPDetectionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import { makeQueryClient } from "@/lib/query-client";
import { getToken, clearAuth, saveUserInfo } from "@/lib/utils/auth-storage";
import { getUserInfo } from "@/lib/api/auth";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
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
