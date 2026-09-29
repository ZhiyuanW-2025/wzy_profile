export type PlaceholderAsset = {
  label: string;
  note: string;
  ratio?: "wide" | "portrait" | "square";
  accent?: "orange" | "ink" | "lime" | "blue";
};

export const studioContent = {
  hero: {
    kicker: "薯格工作室 / SUGAR STUDIO",
    title: "把城市变成一场\n可以玩的游戏",
    description:
      "从复旦大学城市定向社发展而来的城市游戏品牌。我们把任务、解谜、互动与城市空间结合，让玩家真正走进街区探索城市，并逐步形成 C 端 IP 产品与 B 端定制业务。",
    stats: [
      { value: "近 20,000", label: "累计参与人次" },
      { value: "50%", label: "复购率" },
      { value: "60万+", label: "C 端累计收入" },
      { value: "6", label: "B 端项目" },
      { value: "36万+", label: "已落地 B 端合同金额" },
    ],
  },
  polis: {
    description:
      "PolisSH 是一场发生在真实街区里的多人城市游戏。玩家领取任务册，用地图与小程序寻找线索，在行走、观察和协作中重新认识一座熟悉的城市。",
    facts: [
      ["约 10 期", "持续产品迭代"],
      ["900 → 3,500", "正式季参与规模"],
      ["近 2 万", "累计参与人次"],
      ["约 50%", "复购率"],
    ],
    assets: [
      { label: "季度主视觉 / SEASON PHOTO", note: "替换：主视觉 / 玩家集体照", ratio: "wide", accent: "orange" },
      { label: "城市地图 / CITY MAP", note: "替换：真实城市游戏地图", ratio: "square", accent: "ink" },
      { label: "任务册 / MISSION BOOKLET", note: "替换：任务册内页与封面", ratio: "portrait", accent: "orange" },
      { label: "小程序界面 / MINI PROGRAM", note: "替换：小程序任务界面", ratio: "portrait", accent: "blue" },
      { label: "活动现场 / EVENT PHOTO", note: "替换：玩家现场照片", ratio: "wide", accent: "ink" },
      { label: "小程序二维码 / QR CODE", note: "替换：PolisSH 小程序二维码", ratio: "square", accent: "orange" },
    ] satisfies PlaceholderAsset[],
  },
  // Real chapter names, dates, routes and attendance live in polis-chapters.ts.
  hilton: {
    quote: "“我们想为住客做一个 City Play。”",
    steps: [
      { title: "模糊需求", body: "City Play 是一次活动、一个导览，还是一套可持续运营的产品？先明确问题，而不是立刻做方案。" },
      { title: "多轮客户沟通", body: "对齐酒店品牌、客群、空间、预算与运营约束，找到真正的业务目标。" },
      { title: "用户调研", body: "理解住客的碎片时间、出行半径、城市兴趣与参与门槛。" },
      { title: "案例研究", body: "拆解城市漫游、酒店体验与文化活动案例，识别可借鉴的体验结构。" },
      { title: "多轮方案迭代", body: "从路线导览到任务机制，再到实体与数字触点，持续压缩复杂度。" },
      { title: "产品概念收敛", body: "城市手账 + 实景解谜 + 手作互动，最终让住客完成一场个人城市艺术展。" },
    ],
    assets: [
      { label: "希尔顿城市手账 / HANDBOOK", note: "替换：城市手账成品", ratio: "portrait", accent: "orange" },
      { label: "住客探索地图 / CITY MAP", note: "替换：住客探索路线", ratio: "square", accent: "ink" },
      { label: "实景解谜任务 / MISSION", note: "替换：实景解谜任务", ratio: "wide", accent: "blue" },
      { label: "希尔顿小程序 / MINI PROGRAM", note: "替换：小程序页面", ratio: "portrait", accent: "orange" },
      { label: "手作与线下物料 / MATERIALS", note: "替换：手作与线下物料", ratio: "square", accent: "ink" },
      { label: "住客参与现场 / ON-SITE", note: "替换：住客参与现场", ratio: "wide", accent: "orange" },
    ] satisfies PlaceholderAsset[],
  },
  lightFestival: {
    description:
      "将光影节展陈、街区空间和城市文化内容转化为可以玩的城市任务，让观众在“边走、边玩、边看”的过程中主动了解城市。",
    assets: [
      { label: "光影节任务路线 / ROUTE", note: "替换：任务路线与点位", ratio: "wide", accent: "blue" },
      { label: "光影节任务 / MISSION", note: "替换：现场任务界面", ratio: "square", accent: "orange" },
      { label: "光影节现场 / ON-SITE", note: "替换：活动现场照片", ratio: "wide", accent: "ink" },
      { label: "最终成品物料 / PRODUCT", note: "替换：最终成品物料", ratio: "square", accent: "orange" },
    ] satisfies PlaceholderAsset[],
  },
};

export const agentContent = {
  hero: {
    kicker: "Sugar Agent / 演示工作区",
    title: "AI 聊天很好用，\n但它并不知道团队正在做什么。",
    description:
      "Sugar Agent 是一个面向真实团队工作的多成员、多智能体 AI 工作平台。它让专业 Agent 共享项目事实、衔接任务，并进入团队已经习惯的工具。",
  },
  problems: ["多个项目同时推进", "多名成员协作", "AI 对话上下文断裂", "重复解释项目背景", "知识散落在飞书、微信与文件中", "不同 AI 缺乏明确专业分工"],
  agents: [
    { id: "strategy", name: "策划 Agent", short: "STR", role: "把模糊目标转化为受约束、可执行的活动方案。", handsTo: "视觉 / 客户沟通" },
    { id: "code", name: "代码 Agent", short: "DEV", role: "理解需求、生成代码并在安全环境中验证交付。", handsTo: "视觉 / 策划" },
    { id: "visual", name: "视觉 Agent", short: "VIS", role: "基于品牌与场景产出视觉方向和可用素材。", handsTo: "代码 / 营销" },
    { id: "client", name: "客户沟通 Agent", short: "CRM", role: "整理沟通事实、识别分歧并形成下一步共识。", handsTo: "策划 / 采购" },
    { id: "purchase", name: "采购 Agent", short: "BUY", role: "拆解采购清单、询价比选并追踪交付风险。", handsTo: "客户沟通 / 策划" },
    { id: "marketing", name: "营销 Agent", short: "MKT", role: "将产品价值转化为渠道内容与发布节奏。", handsTo: "视觉 / 策划" },
  ],
  workflows: [
    {
      id: "event",
      label: "帮我策划一个上海周末城市活动",
      steps: [
        { actor: "用户", title: "提出任务", body: "目标：年轻人周末活动；区域：上海；预算与人数待确认。" },
        { actor: "策划", title: "分析约束", body: "读取项目背景，识别客群、天气、动线与运营边界。" },
        { actor: "策划", title: "生成初版", body: "输出 3 小时街区探索方案、任务结构与关键里程碑。" },
        { actor: "用户", title: "确认方向", body: "选择“城市声音采集”主题，并补充 80 人规模。" },
        { actor: "客户沟通", title: "接棒补全", body: "将方案整理为客户确认清单与下一轮沟通议程。" },
        { actor: "飞书", title: "更新工具", body: "Mock：把已确认方案写入 Demo Workspace 项目知识。" },
        { actor: "完成", title: "完成交付", body: "活动概念、用户旅程、执行清单与客户沟通材料已就绪。" },
      ],
    },
    {
      id: "page",
      label: "帮我开发一个活动页面",
      steps: [
        { actor: "用户", title: "提出任务", body: "为 PolisSH 新一季制作移动端活动页面。" },
        { actor: "代码", title: "分析需求", body: "读取品牌规范、报名流程与历史页面复盘。" },
        { actor: "代码", title: "搭建原型", body: "建立内容结构、报名转化路径和响应式页面框架。" },
        { actor: "用户", title: "确认结构", body: "保留短路径报名，将世界观作为滚动叙事。" },
        { actor: "视觉", title: "接棒补全", body: "基于本季主题生成主视觉方向与素材规格。" },
        { actor: "Codex", title: "执行工具", body: "Mock：运行构建、检查错误并输出预览链接。" },
        { actor: "完成", title: "完成交付", body: "可访问页面、素材清单与上线检查项已就绪。" },
      ],
    },
    {
      id: "purchase",
      label: "帮我采购一批活动物料",
      steps: [
        { actor: "用户", title: "提出任务", body: "为 500 人活动采购任务册、贴纸与帆布袋。" },
        { actor: "采购", title: "拆解清单", body: "匹配数量、材质、打样、包装、交期与备用比例。" },
        { actor: "采购", title: "形成询价", body: "生成结构化 RFQ 与三档供应方案。" },
        { actor: "用户", title: "确认偏好", body: "优先稳定交付，帆布袋材质升级。" },
        { actor: "客户沟通", title: "同步边界", body: "整理预算变化与需要客户确认的替代方案。" },
        { actor: "1688", title: "调用工具", body: "Mock：检索供应商并汇总报价、起订量与交期。" },
        { actor: "完成", title: "完成交付", body: "比价表、样品计划、下单节点与风险预案已就绪。" },
      ],
    },
  ],
  contextLayers: [
    { id: "global", index: "01", title: "全局 Agent 设定", subtitle: "角色统一 · GLOBAL PROMPT", description: "Agent 长期稳定的职责、能力边界、工作方法与安全规则。切换项目时保持不变。" },
    { id: "project", index: "02", title: "项目知识", subtitle: "项目隔离 · PROJECT KNOWLEDGE", description: "项目文件、进度、已确认事实与团队长期知识。随项目切换而变化。" },
    { id: "personal", index: "03", title: "个人会话", subtitle: "个人上下文 · CONVERSATION", description: "每位成员自己的会话、偏好与当下任务，只对相关成员的体验负责。" },
  ],
  projects: {
    Hilton: ["住客 City Play", "已确认：城市手账方向", "下一步：测试任务难度"],
    OPPO: ["品牌城市体验", "已确认：Demo Workspace", "下一步：补充客户反馈"],
    PolisSH: ["第十季筹备", "已确认：开放地图机制", "下一步：内测核心路线"],
  },
  tools: [
    { id: "lark-wiki", name: "飞书知识库", detail: "读取 / 更新项目知识" },
    { id: "lark-drive", name: "飞书云盘", detail: "检索项目文件与版本" },
    { id: "wechat", name: "企业微信", detail: "消息及客户沟通" },
    { id: "1688", name: "1688", detail: "采购询价" },
    { id: "codex", name: "Codex", detail: "代码执行" },
    { id: "image", name: "图片生成", detail: "视觉产出" },
  ],
  usage: {
    description: "Sugar Agent 已在团队的真实工作中持续使用。以下仅展示公开口径与待替换截图，不包含私有 Prompt、客户文件或内部数据。",
    metrics: [
      ["8", "名团队成员"],
      ["6", "个真实在行项目"],
      ["6", "类专业 Agent"],
    ],
    assets: [
      { label: "Sugar Agent 工作台", note: "替换：脱敏后的项目工作台截图", ratio: "wide", accent: "lime" },
      { label: "Agent 协作对话", note: "替换：脱敏后的真实协作对话", ratio: "wide", accent: "ink" },
    ] satisfies PlaceholderAsset[],
  },
};

export const aboutContent = {
  title: "联系我",
  links: [
    { label: "个人简历", href: "#resume-placeholder", note: "PDF 待替换" },
    { label: "电子邮箱", href: "mailto:your-email@example.com", note: "邮箱待替换" },
    { label: "联系方式", href: "#contact-placeholder", note: "微信等信息待替换" },
    { label: "其他个人主页", href: "#profile-placeholder", note: "链接待替换" },
  ],
};

export const mapContent = {
  index: [
    { id: "about", label: "关于我" },
    { id: "polis", label: "PolisSH" },
    { id: "studio", label: "工作室" },
    { id: "clients", label: "客户项目" },
    { id: "agent", label: "AI 工作台" },
    { id: "contact", label: "联系我" },
  ],
  intro: {
    name: "吴致远",
    romanized: "ZHIYUAN WU",
    statement: "做城市游戏、产品，也做一些解决真实问题的工具。",
    note: "喜欢把一些有意思的想法，真正做出来。",
    credentials: ["复旦大学", "宾夕法尼亚大学", "薯格文化创始人", "曾在淘宝闪购做 AI 产品"],
    image: "/images/home/jingansi.webp",
  },
  mapCards: [
    {
      id: "about-card",
      number: "01",
      title: "关于我",
      subtitle: "吴致远 / ZHIYUAN WU",
      words: "城市 · 产品 · 真实工作",
      description: "做城市游戏、产品，也做一些解决真实问题的工具。喜欢把有意思的想法真正做出来。",
      metrics: ["复旦大学", "宾夕法尼亚大学", "薯格文化创始人"],
      accent: "paper",
    },
    {
      id: "experience-card",
      number: "02",
      title: "核心经历",
      subtitle: "从社团到工作室",
      words: "校园 · 产品 · 创业 · 落地",
      description: "从复旦城市定向社出发，持续经营城市游戏产品，并发展为薯格文化。",
      metrics: ["2023 创建社团", "两年五星社团", "2025 公司化"],
      accent: "green",
    },
    {
      id: "polis-card",
      number: "03",
      title: "PolisSH 系列",
      subtitle: "C 端城市游戏产品",
      words: "地图 · 谜题 · 小程序 · 现场",
      description: "把真实街区变成游戏地图，用实体任务物料和小程序连接线上流程与线下探索。",
      metrics: ["近 20,000 人次", "约 50% 复购率", "C 端收入 60万+"],
      accent: "red",
    },
    {
      id: "client-card",
      number: "04",
      title: "B 端客户与项目",
      subtitle: "B 端城市体验",
      words: "需求 · 协作 · 落地 · 价值",
      description: "服务酒店、城市文化活动、景区与品牌客户，把模糊需求定义成可以落地的产品。",
      metrics: ["6 个 B 端项目", "4 个已落地", "2 个推进中"],
      accent: "blue",
    },
    {
      id: "agent-card",
      number: "05",
      title: "AI Agent 工作台",
      subtitle: "Sugar Agent",
      words: "工具 · 方法 · 效率 · 可能性",
      description: "为解决工作室多成员、多项目协作问题，开发的一套多智能体 AI 工作平台。",
      metrics: ["6 类 Agent", "8 名成员", "6 个实际项目"],
      accent: "ink",
    },
  ],
  club: {
    title: "复旦大学城市定向社",
    description: "从校园里开始的一次产品实验。围绕真实城市空间，持续组织城市探索、解谜和多人互动活动。",
    facts: [
      ["2023", "创建"],
      ["五星社团", "两年内获评"],
      ["1,000+", "社员"],
    ],
    assets: [
      { label: "城市定向社早期照片", note: "替换：社团创立与早期活动照片", ratio: "wide", accent: "blue" },
      { label: "社团活动现场", note: "替换：社员参与和团队合照", ratio: "wide", accent: "orange" },
    ] satisfies PlaceholderAsset[],
  },
  polis: {
    title: "PolisSH 城市游戏系列",
    description: "玩家领取实体任务物料，在真实城市街区完成观察、互动和解谜，并通过小程序连接线上流程与线下探索。",
    metrics: [
      ["20,000", "累计参与人次"],
      ["50%", "复购率"],
      ["10 期", "持续产品迭代"],
      ["60万+", "C 端累计收入"],
      ["900 → 3,500", "正式季参与规模"],
    ],
  },
  studio: {
    title: "薯格工作室",
    legalName: "薯格文化（上海）有限公司",
    description: "C 端 IP 产品 + B 端城市体验定制解决方案",
    since: "2025.12 公司化运营",
    metrics: [
      ["6", "个 B 端项目累计推进"],
      ["4", "个签约并全部落地"],
      ["2", "个仍在持续推进"],
      ["36万+", "已落地合同金额"],
    ],
  },
  clients: {
    names: ["上海城中希尔顿", "上海国际光影节", "BILIBILI", "HUAWEI", "东方明珠", "OPPO"],
    categories: ["企业团建", "酒店住客体验", "城市文化活动", "景区导览", "品牌营销"],
    hilton: {
      title: "上海城中希尔顿",
      description: "从客户“希望为住客做一个 City Play”的模糊需求出发，经过客户沟通、用户调研和多轮方案迭代，最终完成一套融合城市探索、实景解谜、手账与手作的住客体验产品。",
      concept: "城市手账 + 实景解谜 + 手作互动 → 个人城市艺术展",
    },
    lightFestival: {
      title: "上海国际光影节 · 徐汇分会场",
      description: "将光影装置、街区空间与城市文化内容转化为可以玩的城市任务，让观众在边走、边玩、边看的过程中主动了解城市。",
      contract: "合同金额 12万+",
    },
    others: [
      { name: "B站 / 华为", type: "企业定制团建城市游戏", asset: { label: "B站 / 华为项目", note: "替换：Logo 与一张代表图片", ratio: "wide", accent: "blue" } },
      { name: "东方明珠", type: "塔内导览与剧情解谜体验", asset: { label: "东方明珠项目", note: "替换：Logo 与一张代表图片", ratio: "wide", accent: "orange" } },
      { name: "OPPO", type: "结合手机拍照、运动手环与城市生活方式的品牌营销方案", asset: { label: "OPPO 项目", note: "替换：Logo 与一张代表图片", ratio: "wide", accent: "lime" } },
    ] satisfies { name: string; type: string; asset: PlaceholderAsset }[],
  },
  agent: {
    title: "Sugar Agent",
    description: "随着团队同时推进越来越多项目，我给工作室做了一套自己的多成员、多智能体 AI 工作平台。",
    metrics: [["6 类", "专业 Agent"], ["8 名", "团队成员"], ["6 个", "实际项目"]],
  },
  contact: {
    title: "联系我",
    description: "如果你想聊聊城市、产品、AI，或者一些还没被做出来的东西。",
  },
};
