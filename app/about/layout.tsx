import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 / 简历",
  description: "吴致远，AI Product Manager。University of Pennsylvania、复旦大学、阿里巴巴与 Sugar Studio 经历。",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
