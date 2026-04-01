"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  billingCheckoutRedirectMarkerKey,
  getBillingOrder,
  getBillingOrderCheckoutPayUrl,
  orderShouldResumeGatewayCheckout,
  type BillingOrderDetail,
} from "@/lib/api/billing";
import { getToken } from "@/lib/utils/auth-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const POLL_MS = 2000;
const MAX_POLLS = 45;

function orderIsSuccess(o: BillingOrderDetail): boolean {
  return o.status === "PAID" || o.paymentStatus === "SUCCEEDED";
}

function orderIsFailed(o: BillingOrderDetail): boolean {
  return (
    o.status === "FAILED" ||
    o.status === "CANCELED" ||
    o.paymentStatus === "FAILED"
  );
}

/** 已拉到订单，但计费侧尚未进入终态（文档 5.2 / 5.3） */
function orderIsAwaitingPayment(o: BillingOrderDetail): boolean {
  return (
    o.paymentStatus === "PENDING" ||
    o.status === "CHECKOUT_CREATED" ||
    o.status === "CREATED"
  );
}

type UiStatus =
  | "loading"
  | "paid"
  | "failed"
  | "timeout"
  | "missing"
  | "needLogin"
  | "error";

export function CheckoutSuccessContent({
  initialOrderId,
}: {
  initialOrderId: string;
}) {
  const { t } = useLanguage();
  const orderId = initialOrderId;

  const [status, setStatus] = useState<UiStatus>("loading");
  const [order, setOrder] = useState<BillingOrderDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checkoutContinueUrl, setCheckoutContinueUrl] = useState<string | null>(null);

  const pollCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** 从渠道支付页返回本页时置位，避免 webhook 尚未落库时再次自动跳出 */
  const suppressCheckoutRedirectRef = useRef(false);

  useEffect(() => {
    if (!orderId || typeof window === "undefined") return;
    const key = billingCheckoutRedirectMarkerKey(orderId);
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      suppressCheckoutRedirectRef.current = true;
    } else {
      suppressCheckoutRedirectRef.current = false;
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      setStatus("missing");
      setOrder(null);
      setErrorMessage(null);
      return;
    }

    if (!getToken()) {
      setStatus("needLogin");
      setOrder(null);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;

    const stopPoll = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const tick = async (): Promise<boolean> => {
      if (cancelled) return true;
      try {
        const o = await getBillingOrder(orderId);
        if (cancelled) return true;
        setOrder(o);
        setErrorMessage(null);
        if (orderIsSuccess(o)) {
          setStatus("paid");
          return true;
        }
        if (orderIsFailed(o)) {
          setStatus("failed");
          return true;
        }
        if (orderShouldResumeGatewayCheckout(o)) {
          const payUrl = getBillingOrderCheckoutPayUrl(o);
          if (payUrl) {
            if (!suppressCheckoutRedirectRef.current) {
              try {
                sessionStorage.setItem(billingCheckoutRedirectMarkerKey(orderId), "1");
              } catch {
                /* ignore quota / private mode */
              }
              stopPoll();
              window.location.assign(payUrl);
              return true;
            }
            setCheckoutContinueUrl(payUrl);
          }
        }
        pollCountRef.current += 1;
        if (pollCountRef.current >= MAX_POLLS) {
          setStatus("timeout");
          return true;
        }
        return false;
      } catch (e) {
        if (cancelled) return true;
        const msg = e instanceof Error ? e.message : String(e);
        if (
          msg.includes("登录") ||
          msg.includes("401") ||
          /unauthorized/i.test(msg)
        ) {
          setStatus("needLogin");
          return true;
        }
        if (
          msg.includes("不存在") ||
          /not\s*found/i.test(msg) ||
          msg.includes("404")
        ) {
          setStatus("error");
          setErrorMessage(msg);
          return true;
        }
        pollCountRef.current += 1;
        if (pollCountRef.current >= MAX_POLLS) {
          setStatus("timeout");
          setErrorMessage(msg);
          return true;
        }
        return false;
      }
    };

    pollCountRef.current = 0;
    setStatus("loading");
    setOrder(null);
    setErrorMessage(null);
    setCheckoutContinueUrl(null);
    stopPoll();

    void (async () => {
      const done = await tick();
      if (cancelled || done) return;
      timerRef.current = setInterval(() => {
        void (async () => {
          const finished = await tick();
          if (finished) stopPoll();
        })();
      }, POLL_MS);
    })();

    return () => {
      cancelled = true;
      stopPoll();
    };
  }, [orderId, refreshKey]);

  const idLabel = String(order?.id ?? orderId);

  const showRefresh =
    Boolean(orderId) &&
    status !== "paid" &&
    status !== "missing" &&
    status !== "needLogin";

  const loadingDescription = checkoutContinueUrl
    ? t("billing.checkout.success.awaitingAfterReturn")
    : order && orderIsAwaitingPayment(order) && !orderIsFailed(order)
      ? t("billing.checkout.success.awaitingGateway")
      : t("billing.checkout.success.loading");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{t("billing.checkout.success.title")}</CardTitle>
          {status === "loading" && (
            <CardDescription className="flex items-start gap-2">
              <Loader2 className="h-4 w-4 animate-spin shrink-0 mt-0.5" />
              <span className="text-pretty">{loadingDescription}</span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "missing" && (
            <p className="text-sm text-muted-foreground">
              {t("billing.checkout.success.missingOrderId")}
            </p>
          )}
          {status === "needLogin" && (
            <p className="text-sm text-muted-foreground">
              {t("billing.checkout.success.needLogin")}
            </p>
          )}
          {status === "paid" && (
            <div className="flex gap-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {t("billing.checkout.success.paidTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("billing.checkout.success.paidDesc")}
                </p>
              </div>
            </div>
          )}
          {status === "failed" && (
            <div className="flex gap-3">
              <XCircle className="h-10 w-10 text-destructive shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {t("billing.checkout.success.failedTitle")}
                </p>
                {order && (
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {t("billing.checkout.success.orderNo")}: {order.orderNo}
                  </p>
                )}
              </div>
            </div>
          )}
          {(status === "timeout" || status === "error") && (
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                {status === "timeout"
                  ? t("billing.checkout.success.pendingTitle")
                  : t("billing.checkout.success.failedTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {status === "timeout"
                  ? t("billing.checkout.success.pendingDesc")
                  : errorMessage ?? ""}
              </p>
            </div>
          )}
          {order && status !== "missing" && status !== "needLogin" && (
            <dl className="text-xs text-muted-foreground space-y-1 border-t border-border/30 pt-4">
              <div className="flex justify-between gap-4">
                <dt>{t("billing.checkout.success.orderId")}</dt>
                <dd className="font-mono text-right break-all">{idLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>{t("billing.checkout.success.orderNo")}</dt>
                <dd className="font-mono text-right break-all">{order.orderNo}</dd>
              </div>
            </dl>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {checkoutContinueUrl && (
            <Button
              variant="default"
              type="button"
              onClick={() => window.location.assign(checkoutContinueUrl)}
            >
              {t("billing.checkout.success.continuePay")}
            </Button>
          )}
          <Button variant={checkoutContinueUrl ? "outline" : "default"} asChild>
            <Link href="/pricing">{t("billing.checkout.success.goPricing")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{t("billing.checkout.success.goHome")}</Link>
          </Button>
          {showRefresh && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              {t("billing.checkout.success.refresh")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
