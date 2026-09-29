export type ClientOutput = {
  id: string;
  label: string;
  placeholder: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  row: number;
  format: "phone" | "map" | "poster" | "scene" | "booklet" | "props" | "installation";
  fit?: "cover" | "contain";
};

/** Only use approved public assets here; leave src empty until an asset is ready. */
export const clientProjects = {
  headline: "把客户的目标，做成可以被真实体验的城市游戏产品。",
  metrics: [
    { value: "6", label: "个 B 端项目" },
    { value: "4", label: "个已落地" },
    { value: "2", label: "个推进中" },
  ],
  clients: ["希尔顿", "上海国际光影节", "B站", "华为", "东方明珠", "OPPO"],
  missions: [
    {
      id: "space",
      title: "城市空间体验升级",
      description: "通过城市探索、互动任务、剧情导览等方式，把酒店、景区、街区或大型活动空间转化为更有参与感、记忆点和内容深度的体验产品。",
    },
    {
      id: "team",
      title: "团队共创与团建体验",
      description: "根据团队规模、组织文化和活动目标定制城市游戏，让成员在协作、探索和共同完成任务的过程中建立更自然的互动与共同记忆。",
    },
    {
      id: "brand",
      title: "品牌场景化营销体验",
      description: "将品牌产品、功能和传播诉求嵌入真实城市生活场景，通过可参与、可体验的活动，让用户在实际使用中理解和感知品牌价值。",
    },
  ],
  galleryTitle: "可公开素材展示",
  // Source files 1–6 supplied by the owner. Rows follow image proportions;
  // screenshots, print text and people remain fully visible, without cropping.
  gallery: [
    { id: "hilton-mini-program", label: "希尔顿 · 小程序", placeholder: "希尔顿小程序截图", src: "/images/clients/1.png", alt: "希尔顿城市探索项目的小程序首页", width: 538, height: 1104, row: 1, format: "phone", fit: "contain" },
    { id: "light-materials-01", label: "光影节 · 任务册", placeholder: "光影节任务册", src: "/images/clients/2.jpg", alt: "光影节任务册与城市街区现场", width: 1706, height: 1279, row: 1, format: "booklet", fit: "contain" },
    { id: "light-materials-02", label: "光影节 · 任务物料", placeholder: "光影节任务物料", src: "/images/clients/3.jpg", alt: "光影节项目的实体任务物料展示", width: 3072, height: 4096, row: 1, format: "props", fit: "contain" },
    { id: "light-players-01", label: "光影节 · 玩家现场", placeholder: "光影节玩家照片", src: "/images/clients/4.jpg", alt: "光影节玩家在现场使用互动材料", width: 3072, height: 4096, row: 2, format: "scene", fit: "contain" },
    { id: "light-players-02", label: "光影节 · 协作体验", placeholder: "光影节玩家照片", src: "/images/clients/5.png", alt: "光影节玩家一起完成现场互动任务", width: 1086, height: 1448, row: 2, format: "scene", fit: "contain" },
    { id: "light-flyer", label: "光影节 · 活动传单", placeholder: "光影节活动传单", src: "/images/clients/6.png", alt: "上海国际光影节徐汇分会场城市游戏活动传单", width: 734, height: 1042, row: 2, format: "poster", fit: "contain" },
  ] satisfies ClientOutput[],
  delivery: ["客户目标", "用户与场景研究", "概念提案", "产品设计", "小程序 / 物料 / 视觉设计落地", "上线执行"],
};
