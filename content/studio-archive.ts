import type { PlaceId } from "./reference-city";

export type StudioArchiveMedia = {
  id: string;
  label: string;
  note: string;
  /** Set a local /images/... path when the real photo is ready. */
  src: string;
  alt: string;
  format: "wide" | "panorama" | "portrait";
  width?: number;
  height?: number;
};

type IntroPart = { text: string; destination?: PlaceId };
export type StudioRecord = {
  id: string;
  date: string;
  title: string;
  description: string;
  kind: "note" | "milestone";
  accent?: "cyan" | "pink" | "gold";
  badge?: string;
  highlight?: { value: string; label: string };
  media?: StudioArchiveMedia[];
};

export const studioArchive = {
  identity: {
    title: "薯格工作室",
    subtitle: "城市游戏开发 × 内容策划",
    since: "公司成立于 2025.12",
    status: "持续创作中",
    intro: [
      [{ text: "2025年12月，我成立了一家公司，我们习惯叫它「薯格工作室」。" }],
      [
        { text: "这是一家做城市游戏开发与内容策划的工作室，有" },
        { text: "C端的产品", destination: "polis-card" },
        { text: "，也有" },
        { text: "B端的客户", destination: "client-card" },
        { text: "。" },
      ],
      [
        { text: "工作室积极拥抱AI，日常工作在一套专属的" },
        { text: "多成员多Agent工作平台", destination: "agent-card" },
        { text: "推进。" },
      ],
    ] satisfies IntroPart[][],
  },
  statistics: {
    title: "点亮成就",
    asOf: "截至 2026.09",
    // Cumulative IP / community results include the years before incorporation.
    scope: "社团 · 工作室的累计成果",
    players: { value: "20,000+", label: "累计玩家" },
    figures: [
      { value: "70+", label: "高校院所" },
      { value: "50%", label: "复购率" },
      { value: "60万+", label: "C端收入" },
    ],
    partners: {
      title: "品牌合作",
      names: ["上海城中希尔顿", "上海国际光影节", "东方明珠", "B站", "华为", "OPPO"],
      linkLabel: "查看客户与项目",
      destination: "client-card" as PlaceId,
    },
  },
  journal: {
    title: "一路走来",
    subtitle: "虽成立不久，但故事早已起航。从两个人的冒险到20000+人玩过的系列游戏，从默默无闻的学生社团到与大品牌合作的工作室，我和团队伙伴们正在把我们喜欢和认可的事物，做给越来越多的人、越来越尽情地享用。",
    range: "2021 — 至今",
    records: [
      {
        id: "random-shanghai", date: "2021.08", kind: "note",
        title: "抽到哪，就去哪",
        description: "玩腻了桌游、剧本杀、KTV，我和一位朋友决定来一次随机上海游，抽到哪就去哪，结果出乎意料地好玩。之后，我们邀请老师、同学作为每期的飞行嘉宾，一起随机游。",
      },
      {
        id: "first-orienteering", date: "2022.10", kind: "note",
        title: "第一次，把路线交给玩家",
        description: "第一次办传统城市定向，只有20人参加，反响却很好。有了把这件事做成社团的想法。",
      },
      {
        id: "fudan-club", date: "2023.05", kind: "note",
        title: "复旦大学城市定向社，成立",
        description: "创建「复旦大学城市定向社」，最开始全靠亲朋好友们的支持，有了一个200多人的“原住民”群。",
      },
      {
        id: "polis-first-season", date: "2024.03", kind: "milestone", accent: "pink",
        title: "PolisSH 第一季：某个周末，上海街头来了1000位侦探。", badge: "首个产品里程碑",
        description: "在快一年的不温不火后，迎来「PolisSH」系列城市定向第一季。来自复旦、同济、上交等30多所学校的近1000位玩家，走进了这场城市游戏。",
        highlight: { value: "近1000", label: "第一季玩家" },
        media: [
          { id: "polis-s1", label: "PolisSH 第一季 · 工作人员返程图记", note: "", src: "/images/studio/1.jpg", alt: "PolisSH 第一季结束后，工作人员一起走在返程的路上", format: "wide", width: 4943, height: 3089 },
        ],
      },
      {
        id: "first-client", date: "2024.11", kind: "note",
        title: "第一份来自客户的委托",
        description: "接到第一次B端项目，为复旦MBA班级策划团建活动。看到了更大群体、更多项目形式的可能性。",
      },
      {
        id: "five-star-club", date: "2025.04", kind: "milestone", accent: "gold",
        title: "不到两年，成为五星社团", badge: "五星社团",
        description: "获得复旦大学五星社团荣誉。成立不到两年，成为复旦最年轻的五星社团。",
        highlight: { value: "★★★★★", label: "复旦大学五星社团" },
        media: [
          { id: "club-award", label: "五星社团 · 荣誉证书", note: "", src: "/images/studio/2.png", alt: "复旦大学城市定向社的五星级社团荣誉证书", format: "portrait", width: 966, height: 1152 },
        ],
      },
      {
        id: "studio-founded", date: "2025.12", kind: "milestone", accent: "cyan",
        title: "薯格工作室，正式出发", badge: "工作室成立",
        description: "社团繁荣发展，但上限也逐渐可见；渴望更大的突破与全新的挑战，于是成立工作室，开启商业化运营。C端继续围绕「PolisSH」宇宙展开，B端尝试与大品牌合作，积极破圈，让更多人加入城市游戏。",
        media: [
          { id: "studio-team", label: "薯格工作室 · 团队合照", note: "", src: "/images/studio/3.jpg", alt: "薯格工作室伙伴们的团队合照", format: "wide", width: 1707, height: 1280 },
        ],
      },
      {
        id: "client-launches", date: "2026.09", kind: "milestone", accent: "gold",
        title: "从方案，到真正发生的体验", badge: "双项目落地",
        description: "上海国际光影节合作项目「寻光奇遇记」、上海城中希尔顿合作项目「梧桐无同」，完成签约、落地、上线。城市游戏走进了文化活动与酒店住客体验。",
        media: [
          { id: "hilton-launch", label: "梧桐无同 · 手账本内页", note: "", src: "/images/studio/4.jpg", alt: "梧桐无同手账本内页，展示静安寺的日夜城市图景", format: "wide", width: 1239, height: 1270 },
          { id: "light-launch", label: "寻光奇遇记 · 光影节传单", note: "", src: "/images/studio/5.png", alt: "上海国际光影节徐汇分会场寻光奇遇记活动传单", format: "portrait", width: 734, height: 1042 },
        ],
      },
      {
        id: "polis-seventh-season", date: "2026.09", kind: "milestone", accent: "pink",
        title: "PolisSH 第七季：一座更大的游乐场", badge: "规模新纪录",
        description: "「PolisSH」系列正式季第七季，单场玩家人数突破3500。越来越多人，因为一场游戏走进城市。",
        highlight: { value: "3500+", label: "第七季单场玩家" },
        media: [
          { id: "polis-s7", label: "城市定向社 · 社团成员合照", note: "", src: "/images/studio/6.jpg", alt: "城市定向社成员在上海滨江夜景前的合照", format: "wide", width: 5207, height: 3471 },
        ],
      },
    ] satisfies StudioRecord[],
  },
  now: {
    title: "未完待续……",
    description: "继续更新PolisSH，拓展新的品牌合作，也用AI把工作室的协作做得更好。这份主线记录，还在写下去。",
    threads: ["新的城市游戏", "更多合作与玩家", "更好的团队工具"],
    status: "工作室持续更新中",
    destinations: [
      { label: "PolisSH 产品", destination: "polis-card" },
      { label: "客户与项目", destination: "client-card" },
      { label: "AI 工作台", destination: "agent-card" },
    ] satisfies { label: string; destination: PlaceId }[],
  },
};
