import type { Metadata } from "next";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `@font-face { font-family: 'Century Gothic'; src: local('Century Gothic'), local('CenturyGothic'); font-weight: normal; font-style: normal; }`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
