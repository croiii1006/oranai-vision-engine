"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginWithGoogleCallback, getUserInfo } from "@/lib/api/auth";
import { saveToken, saveUserInfo } from "@/lib/utils/auth-storage";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";

function OAuthCallbackGoogleInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      setStatus("error");
      setErrorMsg("Missing code or state from Google callback.");
      return;
    }

    executedRef.current = true;

    const run = async () => {
      try {
        const res = await loginWithGoogleCallback({
          clientId: "portal-a",
          authType: "SOCIAL",
          source: "google",
          code,
          state,
        });

        if (!res.success || !res.data?.token) {
          setStatus("error");
          setErrorMsg("Login response invalid.");
          return;
        }

        saveToken(res.data.token);
        const userRes = await getUserInfo();
        if (userRes?.data) {
          saveUserInfo(userRes.data);
        }
        setStatus("success");
        const loginRedirect = sessionStorage.getItem("loginRedirect");
        sessionStorage.removeItem("loginRedirect");
        if (loginRedirect === "toolbox") {
          window.location.href = config.toolbox.baseUrl;
          return;
        }
        if (loginRedirect === "back") {
          window.history.back();
          return;
        }
        router.replace("/");
      } catch (err) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(msg || "Google login failed. Please try again.");
      }
    };

    run();
  }, [searchParams, router]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-xl font-semibold text-destructive">Google 登录失败</h1>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <Button onClick={() => router.replace("/")}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">正在完成 Google 登录...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackGooglePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <div className="text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">正在完成 Google 登录...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackGoogleInner />
    </Suspense>
  );
}
