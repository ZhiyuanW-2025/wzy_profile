export type SystemScreenshot = { id: string; title: string; code: string; src: string; alt: string; group: "conversation" | "records" | "management" };

export const agentSystem = {
  title: "Sugar Agent",
  subtitle: "工作室专属 · 多成员多 Agent 工作平台",
  why: "当8人团队同时推进多个项目时，普通AI聊天工具会出现项目上下文断裂、成员信息不共享、专业分工不稳定等问题，因此从0到1开发工作室专属工作平台「Sugar Agent」。",
  problems: ["项目上下文断裂", "成员信息不共享", "专业分工不稳定"],
  metrics: [{ value: "6", label: "类 Agent" }, { value: "8", label: "名成员" }, { value: "6", label: "个推进项目" }],
  agents: [{ icon: "◇", name: "策划" }, { icon: "⌘", name: "代码" }, { icon: "▧", name: "视觉" }, { icon: "≋", name: "客户沟通" }, { icon: "▤", name: "采购" }, { icon: "↗", name: "营销" }],
  flow: [
    { id: "members", title: "团队成员", detail: "8 名成员 · 各自会话" },
    { id: "project", title: "当前项目", detail: "选择项目 · 明确任务" },
    { id: "agents", title: "专业 Agent", detail: "按任务分工" },
    { id: "resources", title: "能力与知识", detail: "工具 / Skill / 项目知识库 / Agent知识库" },
    { id: "conversation", title: "用户对话", detail: "沟通 · 反馈 · 确认" },
    { id: "delivery", title: "成果交付与沉淀", detail: "交付成果 · 沉淀共识" },
  ],
  resources: ["工具", "Skill", "项目知识库", "Agent知识库"],
  tools: [
    { name: "飞书知识库 / 云盘", role: "项目知识与文件", pending: false },
    { name: "1688工作台", role: "采购协作", pending: false },
    { name: "Codex", role: "开发与代码", pending: false },
    { name: "图片生成", role: "视觉产出", pending: false },
    { name: "企业微信", role: "消息与沟通", pending: true },
  ],
  designs: [
    { id: "handoff", title: "多 Agent 协作", code: "CONTEXT HANDOFF", summary: "分工明确，交接不丢上下文。", description: "不同任务交给不同专业 Agent，而不是让一个 Agent 包办所有工作。用户确认阶段性结果后，任务可带着完整上下文继续交接给下一个 Agent，减少重复说明，也让策划、视觉、代码、采购等环节形成连续工作流。" },
    { id: "context", title: "分层上下文", code: "LAYERED CONTEXT", summary: "角色统一，项目隔离，个人会话独立。", description: "将信息拆成全局 Agent Prompt、项目知识库、个人会话三层：全局层保证角色能力和行为稳定，项目层沉淀文件、进度与长期共识，个人层保留成员自己的沟通历史与偏好。在共享项目记忆的同时，避免不同项目和成员之间的信息混杂。" },
    { id: "workflow", title: "进入原有工作流", code: "WORKFLOW INTEGRATION", summary: "让 AI 进入工作，而不是让工作迁就 AI。", description: "不要求团队为了使用 AI 迁移到一套全新的工具，而是让 Sugar Agent 接入原本就在使用的飞书知识库、云盘、企业微信、1688 等平台，并调用 Codex、图片生成等专业能力，让 AI 直接进入已有的协作、开发、采购和内容生产流程。" },
  ],
  handoff: ["专业 Agent", "用户确认", "下一位 Agent"],
  handoffPayload: "任务 + 项目知识 + 已确认结果",
  context: [
    { title: "全局 Agent Prompt", note: "职责 · 能力 · 行为边界", scope: "角色统一" },
    { title: "项目知识库", note: "文件 · 进度 · 长期共识", scope: "项目隔离" },
    { title: "个人会话", note: "沟通历史 · 个人偏好", scope: "成员独立" },
  ],
  screenshots: [
    { id: "planning", title: "策划 Agent", code: "Planning", src: "/images/agent/1.png", alt: "策划 Agent 制作人小花的项目对话界面", group: "conversation" },
    { id: "coding", title: "代码 Agent", code: "Coding", src: "/images/agent/2.png", alt: "代码 Agent 工程师牛牛的 Codex 对话与代码改动界面", group: "conversation" },
    { id: "purchasing", title: "采购 Agent", code: "Procurement", src: "/images/agent/3.png", alt: "采购 Agent 金牌买手拉夫的 1688 商家询价确认界面", group: "conversation" },
    { id: "visual", title: "生图 Agent", code: "Image Generation", src: "/images/agent/4.png", alt: "生图 Agent 艺术家小熊的对话与图片生成界面", group: "conversation" },
    { id: "marketing", title: "营销 Agent", code: "Marketing", src: "/images/agent/5.png", alt: "营销 Agent 宣传委员豆豆的对话与宣传作品草稿界面", group: "conversation" },
    { id: "records", title: "项目进度记录与个人工作日志", code: "Project & Personal Logs", src: "/images/agent/6.png", alt: "同一页面展开项目进度记录与我的工作日志，分别呈现项目共享进展与个人工作记录", group: "records" },
    { id: "testing", title: "营销 Agent · 对比测试", code: "Agent Testing", src: "/images/agent/7.png", alt: "营销 Agent 对比测试页面，展示版本 A 与版本 B 的测试配置", group: "management" },
    { id: "skills", title: "营销 Agent · Skill 管理", code: "Agent Skills", src: "/images/agent/8.png", alt: "营销 Agent 的 Skill 管理页面，展示可复用工作方法与适用边界", group: "management" },
  ] satisfies SystemScreenshot[],
  walkthroughGroups: [
    { id: "conversation", title: "专业分工，在同一个工作台协作", note: "切换查看五类 Agent 的真实工作界面。" },
    { id: "records", title: "共享项目进度，保留个人工作记录", note: "同一页面的两个展开区域：项目进度记录与我的工作日志。" },
    { id: "management", title: "从日常使用，到测试与能力维护", note: "以营销 Agent 为例，展示对比测试与 Skill 管理。" },
  ],
  outcome: "已投入工作室日常使用，覆盖全部8名成员、6个在行项目",
  privacy: "出于客户资料、内部知识库和API成本考虑，公开版本不连接生产数据；代码与产品结构可在GitHub查看。",
  // Set this to the user-provided repository URL. No invented link or live demo.
  githubUrl: "",
};
