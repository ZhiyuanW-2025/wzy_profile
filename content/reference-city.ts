export type PlaceId = "about-card" | "experience-card" | "polis-card" | "client-card" | "agent-card" | "contact";
export type CityPoint = readonly [number, number];
export type CityPath = { id: string; points: readonly CityPoint[]; speed: number; count: number; offset?: number };
export type CityEntrance = { id: PlaceId; label: string; district: string; color: string; box: [number, number, number, number]; polygon: string };

// Core coordinates correspond exactly to the supplied 1672px reference, cropped
// at y=70. World margins are atmospheric; all content stays in the original core.
export const referenceCity = {
  width: 1672, height: 812,
  world: { width: 2392, height: 1292, coreX: 360, coreY: 240 },
  environment: "/city-v3/island-core-v3.webp",
  outskirts: "/city-v3/island-world-v3.webp",
  campusSign: "关于我的工作室",
  // Pixel-framed UI sign covers only the old raster sign; the world art stays intact.
  studioEntrySign: { x: 251, y: 459, width: 239, height: 42 },
  landmarkSigns: [
    { id: "traveler-plaza", text: "Traveler Plaza", x: 361, y: 391, width: 181, height: 31, color: "#8de8ff", place: "experience-card" as PlaceId },
  ],
  arrival: { cloud: "/city-v3/arrival-cloud.webp" },
  ferry: "/city-v3/shanghai-ferry.png",
  sprites: "/city-v2/actors.png",
  player: {
    name: "吴致远", romanized: "ZHIYUAN WU",
    identity: "产品构建者 / 城市游戏设计者",
    city: "上海", status: "自由探索",
    objective: "把有意思的想法做成真实产品",
  },
  entrances: [
    { id: "about-card", label: "关于我", district: "个人终端", color: "#58edff", box: [102, 54, 290, 235], polygon: "17% 0, 55% 0, 87% 27%, 100% 57%, 89% 91%, 28% 100%, 0 62%, 0 36%" },
    { id: "experience-card", label: "关于我的工作室", district: "Traveler Plaza", color: "#8de8ff", box: [235, 306, 322, 229], polygon: "48% 0, 91% 0, 100% 67%, 91% 100%, 0 100%, 0 48%, 43% 45%" },
    { id: "polis-card", label: "PolisSH 系列", district: "城市游戏街区", color: "#ff61d9", box: [596, 204, 285, 253], polygon: "0 0, 95% 0, 95% 13%, 78% 13%, 88% 56%, 100% 93%, 10% 100%, 7% 45%, 27% 15%, 0 15%" },
    { id: "client-card", label: "B 端客户与项目", district: "商业合作区", color: "#ffcf85", box: [914, 204, 266, 288], polygon: "0 0, 97% 0, 100% 100%, 0 100%" },
    { id: "agent-card", label: "AI Agent 工作台", district: "数字实验室", color: "#68e2ff", box: [1202, 213, 308, 293], polygon: "0 0, 94% 0, 94% 17%, 64% 17%, 100% 60%, 91% 100%, 7% 94%, 0 44%" },
    { id: "contact", label: "联系我", district: "通讯塔", color: "#a397ff", box: [1240, 516, 332, 262], polygon: "20% 19%, 43% 0, 56% 13%, 56% 37%, 100% 67%, 98% 92%, 41% 100%, 0 75%, 0 45%" },
  ] satisfies CityEntrance[],
  lighting: {
    signs: [
      { points: [[175,98],[302,98],[302,132],[175,132]], color: "#60efff", phase: 0 },
      { points: [[638,310],[798,310],[798,348],[638,348]], color: "#ff58d9", phase: 2.3 },
      { points: [[1300,397],[1411,397],[1411,419],[1300,419]], color: "#58dfff", phase: 4.8 },
    ],
    windows: [[432,351,4,5],[481,366,4,5],[1005,322,4,5],[1021,339,4,5],[1055,315,4,5],[1093,334,4,5],[837,294,4,5],[827,315,4,5]],
    signals: [[562,459],[872,463],[1149,489],[1226,501]],
  },
  traffic: [
    { id: "main-avenue", points: [[498,480],[688,481],[912,484],[1174,499],[1463,495]], speed: 17, count: 7, offset: 5 },
    { id: "center-road", points: [[912,171],[918,253],[889,363],[871,432],[912,484]], speed: 15, count: 3, offset: 5 },
    { id: "island-bridge", points: [[261,215],[353,325],[409,352]], speed: 12, count: 2, offset: 3 },
    { id: "terminal-bridge", points: [[1144,509],[1198,558],[1267,623]], speed: 12, count: 2, offset: 3 },
  ] satisfies CityPath[],
  walks: [
    { id: "welcome", points: [[157,174],[203,196],[258,208],[294,239]], speed: 4, count: 3 },
    { id: "campus", points: [[277,448],[372,458],[461,464],[495,444]], speed: 4, count: 4 },
    { id: "polis", points: [[648,431],[725,445],[811,442]], speed: 4, count: 5 },
    { id: "partners", points: [[939,452],[1019,468],[1098,467]], speed: 4, count: 4 },
    { id: "lab", points: [[1230,474],[1329,474],[1430,471]], speed: 4, count: 4 },
    { id: "terminal", points: [[1291,698],[1395,731],[1480,715]], speed: 3, count: 3 },
  ] satisfies CityPath[],
  boats: [
    { id: "south-ferry", points: [[-75,501],[114,555],[305,642],[559,717],[830,734],[1071,746]], speed: 12, count: 1 },
    { id: "east-ferry", points: [[1720,489],[1539,550],[1468,593]], speed: 10, count: 1 },
    { id: "south-shuttle", points: [[385,762],[673,776],[973,773],[1168,729]], speed: 14, count: 1 },
  ] satisfies CityPath[],
  occluders: [
    [[112,98],[161,53],[296,53],[338,145],[311,190],[147,183]],
    [[405,314],[495,312],[511,432],[402,438]],
    [[634,269],[774,253],[835,319],[838,416],[618,413]],
    [[943,278],[988,253],[1096,261],[1164,333],[1164,433],[937,433]],
    [[1259,309],[1326,278],[1427,274],[1470,402],[1431,457],[1250,450]],
  ] as readonly (readonly CityPoint[])[],
  // Subtractive mask: the first polygon is the sea canvas; the union of all
  // remaining polygons protects skyline, islands and bridges from refraction.
  waterPolygons: [
    [[0,0],[1672,0],[1672,812],[0,812]],
    [[0,0],[1672,0],[1672,255],[1540,227],[1403,199],[1273,180],[1115,153],[931,129],[741,145],[617,100],[0,73]],
    [[46,112],[96,55],[168,22],[279,24],[365,76],[413,159],[406,216],[362,255],[213,297],[58,284],[22,220]],
    [[255,205],[283,214],[389,339],[366,351]],
    [[181,378],[274,329],[367,309],[447,232],[534,205],[665,157],[819,115],[935,130],[966,207],[1152,236],[1220,243],[1425,270],[1570,332],[1625,418],[1600,486],[1450,550],[1251,549],[1140,581],[1105,624],[1009,660],[944,665],[836,643],[705,625],[559,597],[447,586],[353,586],[222,550],[210,469],[166,436]],
    [[1124,486],[1146,481],[1288,628],[1265,653]],
    [[1268,582],[1310,548],[1420,563],[1510,608],[1625,673],[1631,713],[1550,765],[1415,798],[1311,774],[1195,708],[1220,629]],
  ] as readonly (readonly CityPoint[])[],
};
