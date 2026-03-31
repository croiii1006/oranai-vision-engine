import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const fontVariables = `${inter.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.oran.cn"),
  title: "OranAI — AI for Integrated Marketing Intelligence",
  description:
    "OranAI — From brand insight to global execution, powered by multimodal AI. Enterprise-grade AI solutions for integrated marketing intelligence.",
  keywords: [
    "AI",
    "marketing intelligence",
    "multimodal AI",
    "brand analytics",
    "OranAI",
    "enterprise AI",
  ],
  authors: [{ name: "OranAI" }],
  openGraph: {
    title: "OranAI — AI for Integrated Marketing Intelligence",
    description: "From brand insight to global execution, powered by multimodal AI",
    type: "website",
    images: ["/tg-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OranAI",
    images: ["/tg-banner.png"],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`dark ${fontVariables}`} suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `@font-face { font-family: 'Century Gothic'; src: local('Century Gothic'), local('CenturyGothic'); font-weight: normal; font-style: normal; }`,
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
