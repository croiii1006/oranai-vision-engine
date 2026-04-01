import type { Metadata } from "next";
import { CheckoutSuccessContent } from "./CheckoutSuccessContent";

export const metadata: Metadata = {
  title: "Checkout success — OranAI",
  description: "Payment confirmation and order status after billing checkout.",
};

function parseOrderId(raw: string | string[] | undefined): string {
  if (typeof raw === "string") return raw.trim();
  if (Array.isArray(raw) && raw[0]) return String(raw[0]).trim();
  return "";
}

type PageProps = {
  searchParams: Promise<{ order_id?: string | string[] }>;
};

export default async function BillingCheckoutSuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialOrderId = parseOrderId(sp.order_id);
  return <CheckoutSuccessContent initialOrderId={initialOrderId} />;
}
