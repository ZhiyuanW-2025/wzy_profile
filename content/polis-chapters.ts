export type ChapterKind = "main" | "side" | "anniversary" | "lite" | "collaboration";
export type PolisMedia = { id: string; label: string; src: string; alt: string; width: number; height: number; zoom: number };
export type PolisChapter = {
  id: string;
  name: string;
  shortName: string;
  code: string;
  season: number | null;
  kind: ChapterKind;
  theme: string;
  /** ISO year-month; displayed as YYYY.MM without changing the date. */
  date: string;
  districts: readonly string[];
  players: number;
  media: { hero: PolisMedia };
};

function mediaFor(id: string, name: string, file: string, width: number, height: number, zoom = 1): PolisChapter["media"] {
  // Original files stay unchanged. Optional in-frame zoom hides scan borders.
  return {
    hero: { id: `${id}-hero`, label: `${name} · 主视觉`, src: `/images/polis/${file}.png`, alt: `${name}主视觉`, width, height, zoom },
  };
}

/** User-supplied chapter facts. Do not estimate or round individual player counts. */
export const polisChapters: readonly PolisChapter[] = [
  {
    id: "s1", name: "「PolisSH」第一季", shortName: "第一季", code: "S1", season: 1, kind: "main",
    theme: "一场所有人都能玩的游戏", date: "2024-03", players: 950,
    districts: ["徐汇滨江", "四川北路", "衡山路", "江湾体育场", "世纪公园"],
    media: mediaFor("s1", "第一季", "psh1", 249, 352, 1.015),
  },
  {
    id: "s2", name: "「PolisSH」第二季", shortName: "第二季", code: "S2", season: 2, kind: "main",
    theme: "重逢之言，旧时之约", date: "2024-09", players: 1150,
    districts: ["南京西路", "老西门", "江宁路", "八万人体育场", "中华艺术宫"],
    media: mediaFor("s2", "第二季", "psh2", 273, 352, 1.015),
  },
  {
    id: "s2-side", name: "「PolisSH」第二季外传篇", shortName: "第二季外传篇", code: "外传", season: 2, kind: "side",
    theme: "初代的故事，远没有结束", date: "2025-03", players: 100,
    districts: ["徐家汇", "外白渡桥", "中山公园", "世博会博物馆"],
    media: mediaFor("s2-side", "第二季外传篇", "psh2w", 588, 838),
  },
  {
    id: "s3", name: "「PolisSH」第三季", shortName: "第三季", code: "S3", season: 3, kind: "main",
    theme: "浩瀚星河，何以为家", date: "2025-03", players: 1300,
    districts: ["陆家嘴", "鲁迅公园", "大世界", "龙华", "东方体育中心"],
    media: mediaFor("s3", "第三季", "psh3", 249, 352, 1.015),
  },
  {
    id: "fudan-120", name: "「PolisSH」复旦120周年特别篇", shortName: "复旦120周年特别篇", code: "120", season: null, kind: "anniversary",
    theme: "甲子轮回，我心如昨", date: "2025-06", players: 800,
    districts: ["新天地", "常熟路", "金沙江路", "漕河泾开发区"],
    media: mediaFor("fudan-120", "复旦120周年特别篇", "psh120", 249, 352, 1.015),
  },
  {
    id: "s4", name: "「PolisSH」第四季", shortName: "第四季", code: "S4", season: 4, kind: "main",
    theme: "鱼书已达，遥途未周", date: "2025-09", players: 1800,
    districts: ["天潼路", "交通大学", "龙耀路", "向城路"],
    media: mediaFor("s4", "第四季", "psh4", 257, 363, 1.015),
  },
  {
    id: "lite", name: "「PolisSH」Lite篇", shortName: "轻量Lite篇", code: "Lite", season: null, kind: "lite",
    theme: "#Answer from 2010", date: "2025-11", players: 900,
    districts: ["吴江路", "江苏路", "长风公园", "临平路"],
    media: mediaFor("lite", "Lite篇", "pshlite", 532, 756),
  },
  {
    id: "s5", name: "「PolisSH」第五季", shortName: "第五季", code: "S5", season: 5, kind: "main",
    theme: "重踏故土，循迹明光", date: "2026-03", players: 2200,
    districts: ["静安寺", "世博大道", "海伦路", "小南门", "世纪大道"],
    media: mediaFor("s5", "第五季", "psh5", 257, 363, 1.015),
  },
  {
    id: "s6-pku", name: "「PolisSH」第六季北大合作篇", shortName: "第六季北大合作篇", code: "S6", season: 6, kind: "collaboration",
    theme: "黑白之界，弈局相融", date: "2026-05", players: 1600,
    districts: ["自然博物馆", "上海图书馆", "马当路", "中山公园", "桂林路"],
    media: mediaFor("s6-pku", "第六季北大合作篇", "psh6", 257, 363, 1.015),
  },
  {
    id: "s7", name: "「PolisSH」第七季", shortName: "第七季", code: "S7", season: 7, kind: "main",
    theme: "量子生死，重构真相", date: "2026-09", players: 3500,
    districts: ["延安西路", "陕西南路", "浦东南路", "花木路", "龙耀路"],
    media: mediaFor("s7", "第七季", "psh7", 826, 1194),
  },
];

type IntroPart = { text: string; emphasis?: boolean };
export const polisContent = {
  title: "PolisSH",
  subtitle: "城市游戏系列",
  defaultChapter: "s7",
  intro: [
    [
      { text: "在「PolisSH」系列城市游戏中，玩家在起点领取" },
      { text: "游戏物料包", emphasis: true },
      { text: "，根据其中的任务册、剧情册、游戏道具，以及游戏小程序或网页，在" },
      { text: "真实城市街区", emphasis: true },
      { text: "完成观察、解谜、推理和协作的任务。玩家们将" },
      { text: "扮演一个角色，走入一段故事，完成使命，揭开真相", emphasis: true },
      { text: "，有时是从邪恶科学家手里救出朋友，有时自己却成了面临抉择的科学怪人。" },
    ],
    [
      { text: "游玩过程中，玩家渐渐拨开推理和剧情上的迷雾，享受" },
      { text: "“尤里卡（希腊语：终于找到了！）”时刻", emphasis: true },
      { text: "的快感；也能与身旁伙伴一起漫步城市，享受" },
      { text: "真实的场景、人和关系", emphasis: true },
      { text: "，带来的愉悦。" },
    ],
  ] satisfies IntroPart[][],
  // Existing overall business figures; do not calculate these from chapter attendance.
  metrics: [
    { value: "10", label: "产品篇章" },
    { value: "20,000+", label: "累计参与人次" },
    { value: "50%", label: "复购率" },
    { value: "60万+", label: "C端累计收入" },
  ],
  kindLabels: { main: "正式季", side: "外传篇", anniversary: "120周年特别篇", lite: "Lite篇", collaboration: "北大合作篇" } satisfies Record<ChapterKind, string>,
};

/** Tab keyboard navigation stays inside the chapter selector, never the map. */
export function chapterIndexForKey(key: string, current: number, count: number): number | null {
  if (count < 1) return null;
  if (key === "ArrowRight") return (current + 1) % count;
  if (key === "ArrowLeft") return (current - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
