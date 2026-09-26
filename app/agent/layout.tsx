import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugar Agent",
  description: "面向真实团队工作的多成员、多智能体 AI 工作平台：专业分工、上下文、长期记忆与工具接入。",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
