import type { Metadata } from "next";
import IndexPage from "@/components/IndexPage";

export const metadata: Metadata = {
  title: "Products — OranAI",
  description: "OranAI product matrix and tools.",
};

export default function ProductsRoutePage() {
  return <IndexPage />;
}
