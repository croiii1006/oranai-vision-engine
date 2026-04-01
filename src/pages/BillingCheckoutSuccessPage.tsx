import { Suspense, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckoutSuccessContent } from "@/components/CheckoutSuccessContent";

function BillingCheckoutSuccessInner() {
  const [searchParams] = useSearchParams();

  useLayoutEffect(() => {
    document.title = "Checkout success — OranAI";
  }, []);
  const raw = searchParams.get("order_id");
  const initialOrderId = typeof raw === "string" ? raw.trim() : "";
  return <CheckoutSuccessContent initialOrderId={initialOrderId} />;
}

export default function BillingCheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BillingCheckoutSuccessInner />
    </Suspense>
  );
}
