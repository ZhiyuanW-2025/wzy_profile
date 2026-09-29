/** The only optional city interaction. All positions use the core's 1672×812 coordinates. */
export const cityVisitor = {
  invitation: "在这里留言，成为城市旅客",
  title: "成为城市旅客",
  introduction: "哦对，你会跳伞的，对吧？",
  nameLabel: "你的名字",
  namePlaceholder: "名字或昵称都可以",
  moodLabel: "你现在心情如何？",
  messageLabel: "来都来了，打个招呼再走吧！",
  privacy: "此处信息将私密发送给我，不会公开展示。提交即表示同意发送，请勿填写敏感信息哦！",
  maxNameLength: 32,
  maxLength: 280,
  emojis: [
    { value: "🙂", label: "微笑" }, { value: "😎", label: "酷酷" },
    { value: "🤩", label: "惊喜" }, { value: "🥳", label: "庆祝" },
    { value: "🥰", label: "喜欢" }, { value: "🤔", label: "思考" },
    { value: "🐱", label: "小猫" }, { value: "🐶", label: "小狗" },
    { value: "👾", label: "像素怪" }, { value: "🤖", label: "机器人" },
    { value: "🧑‍🚀", label: "宇航员" }, { value: "👻", label: "小幽灵" },
    { value: "😄", label: "开心" }, { value: "😌", label: "放松" },
    { value: "🥹", label: "感动" }, { value: "😴", label: "困困" },
    { value: "😵‍💫", label: "晕乎乎" }, { value: "😭", label: "哭哭" },
  ],
  dropDuration: 6.8, landingDuration: 1.2,
  dock: [474, 577] as const,
  // Dock ramp → sidewalk → City Play → Partners → the lab. Never walk on water.
  walk: [[474,577],[488,549],[507,512],[520,479],[688,472],[912,474],[1167,490],[1450,482]] as const,
  walkSpeed: 17,
};

export type CityVisitorActor = {
  id: string; emoji: string; startedAt: number;
  origin: { x: number; y: number }; reduced: boolean;
};
