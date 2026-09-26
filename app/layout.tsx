import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: {
      default: "吴致远 — AI 产品经理",
      template: "%s — 吴致远",
    },
    description:
      "AI 产品经理吴致远的产品作品集：城市游戏产品与商业化实践，以及多成员、多智能体 AI 工作平台 Sugar Agent。",
    keywords: ["AI Product Manager", "AI 产品经理", "Product Portfolio", "Sugar Agent", "PolisSH", "城市游戏"],
    authors: [{ name: "Zhiyuan Wu" }],
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title: "吴致远 — AI 产品经理",
      description: "Two products to experience: play a city, then enter an AI workspace.",
      images: [{ url: "/og.png", width: 1672, height: 940, alt: "吴致远 AI 产品经理作品集" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "吴致远 — AI 产品经理",
      description: "Two products to experience: play a city, then enter an AI workspace.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
