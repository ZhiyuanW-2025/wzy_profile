import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";
import "./city-terminal.css";
import "./reference-city.css";
import "./city-visitor.css";
import "./character-profile.css";
import "./studio-archive.css";
import "./client-projects.css";
import "./polis-chapters.css";
import "./agent-system.css";
import "./contact-terminal.css";

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
      default: "吴致远 — 个人主页",
      template: "%s — 吴致远",
    },
    description:
      "吴致远的个人地图：城市定向社、PolisSH、薯格工作室、真实客户项目，以及为团队打造的 Sugar Agent。",
    keywords: ["吴致远", "个人主页", "Sugar Agent", "PolisSH", "城市游戏", "产品"],
    authors: [{ name: "Zhiyuan Wu" }],
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title: "吴致远 — 一张关于城市、产品与真实工作的个人地图",
      description: "在一张可探索的个人城市地图中，查看 PolisSH、薯格工作室、客户项目与 Sugar Agent。",
    },
    twitter: {
      card: "summary_large_image",
      title: "吴致远 — 个人主页",
      description: "一张关于城市游戏、真实产品和团队工具的个人地图。",
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
