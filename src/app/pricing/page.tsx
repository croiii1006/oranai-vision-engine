import type { Metadata } from "next";
import IndexPage from "@/components/IndexPage";

export const metadata: Metadata = {
  title: "Pricing — OranAI",
  description: "Plans and pricing for OranAI.",
};

export default function PricingRoutePage() {
  return <IndexPage />;
}
