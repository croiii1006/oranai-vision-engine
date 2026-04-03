import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import IndexPage from "@/components/IndexPage";

const OAuthCallbackGooglePage = lazy(() => import("@/pages/OAuthCallbackGooglePage"));
const BillingCheckoutSuccessPage = lazy(() => import("@/pages/BillingCheckoutSuccessPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/solution" element={<IndexPage />} />
        <Route path="/models" element={<IndexPage />} />
        <Route path="/products" element={<IndexPage />} />
        <Route path="/library" element={<IndexPage />} />
        <Route path="/pricing" element={<IndexPage />} />
        <Route path="/api/oauth/callback/google" element={<OAuthCallbackGooglePage />} />
        <Route path="/billing/checkout/success" element={<BillingCheckoutSuccessPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
