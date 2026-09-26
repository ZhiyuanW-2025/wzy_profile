import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "薯格工作室 / Sugar Studio",
  description: "PolisSH 城市游戏与 B 端城市体验产品：从产品定义、玩法迭代到商业化落地。",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
