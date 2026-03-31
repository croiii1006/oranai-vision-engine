import type { Metadata } from "next";
import IndexPage from "@/components/IndexPage";

export const metadata: Metadata = {
  title: "Platform — OranAI",
  description: "Explore model capabilities and platform features.",
};

export default function ModelsRoutePage() {
  return <IndexPage />;
}
