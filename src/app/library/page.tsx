import type { Metadata } from "next";
import IndexPage from "@/components/IndexPage";

export const metadata: Metadata = {
  title: "Inspiration — OranAI",
  description: "Inspiration library: video, voice, and model assets.",
};

export default function LibraryRoutePage() {
  return <IndexPage />;
}
