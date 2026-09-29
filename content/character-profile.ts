import type { PlaceId } from "./reference-city";

/** Personal profile copy, art, attributes and destination mapping. */
export const characterProfile = {
  id: "001",
  name: "吴致远",
  romanized: "ZHIYUAN WU",
  level: 24,
  portrait: "/images/profile/zhiyuan-pixel-v2.png",
  portraitAlt: "吴致远的像素角色：黑发、黑框眼镜，穿白色连帽卫衣和深色长裤，手拿城市地图。",
  tags: [
    { icon: "balance", text: "心态超好的天秤座" },
    { icon: "star", text: "想改变世界的ENFJ" },
    { icon: "flame", text: "爱折腾的格兰芬多" },
  ],
  creed: "在汹涌的海面上驾驶大船，在热爱的事物里创造价值，这永远令人心潮澎湃。",
  attributes: [
    // `axis` is clockwise from the top. Keep the two over-capacity axes apart.
    { label: "好奇心", value: 100, axis: 0 },
    { label: "创造力", value: 100, axis: 2 },
    { label: "团队协作", value: 100, axis: 5 },
    { label: "续航", value: 84, axis: 3 },
    { label: "饭量", value: 130, axis: 1 },
    { label: "夜猫指数", value: 164, axis: 4 },
  ],
  quest: {
    title: "薯格工作室",
    description: "一家做游戏开发与内容策划的工作室，致力于把线上和室内的游戏，搬到城市里去玩。",
    invitation: "想了解更多，请前往",
    places: [
      { id: "experience-card", label: "Traveler Plaza", note: "热爱的开端", color: "#b6abff" },
      { id: "polis-card", label: "PolisSH Tower", note: "城市游戏", color: "#ff98d6" },
      { id: "client-card", label: "Partner House", note: "客户与合作", color: "#f0cf8a" },
      { id: "agent-card", label: "Agent Studio", note: "AI 工作台", color: "#86e9f3" },
    ] satisfies { id: PlaceId; label: string; note: string; color: string }[],
  },
  contactDestination: "contact" as PlaceId,
};
