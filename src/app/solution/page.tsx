import type { Metadata } from "next";
import IndexPage from "@/components/IndexPage";

export const metadata: Metadata = {
  title: "Solution — OranAI",
  description: "Integrated marketing intelligence solutions.",
};

export default function SolutionRoutePage() {
  return <IndexPage />;
}
