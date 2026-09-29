import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalTS } from "./load-local-ts.mjs";

const { polisChapters: chapters, polisContent, chapterIndexForKey } = await loadLocalTS("content/polis-chapters.ts");
const { PolisChapters, ChapterArchive } = await loadLocalTS("components/reference-city/PolisChapters.tsx");
const render = () => renderToStaticMarkup(createElement(PolisChapters));

test("all ten chapter facts exactly match the provided names, themes, dates, streets and attendance", () => {
  const expected = [
    ["「PolisSH」第一季", "一场所有人都能玩的游戏", "2024-03", ["徐汇滨江", "四川北路", "衡山路", "江湾体育场", "世纪公园"], 950],
    ["「PolisSH」第二季", "重逢之言，旧时之约", "2024-09", ["南京西路", "老西门", "江宁路", "八万人体育场", "中华艺术宫"], 1150],
    ["「PolisSH」第二季外传篇", "初代的故事，远没有结束", "2025-03", ["徐家汇", "外白渡桥", "中山公园", "世博会博物馆"], 100],
    ["「PolisSH」第三季", "浩瀚星河，何以为家", "2025-03", ["陆家嘴", "鲁迅公园", "大世界", "龙华", "东方体育中心"], 1300],
    ["「PolisSH」复旦120周年特别篇", "甲子轮回，我心如昨", "2025-06", ["新天地", "常熟路", "金沙江路", "漕河泾开发区"], 800],
    ["「PolisSH」第四季", "鱼书已达，遥途未周", "2025-09", ["天潼路", "交通大学", "龙耀路", "向城路"], 1800],
    ["「PolisSH」Lite篇", "#Answer from 2010", "2025-11", ["吴江路", "江苏路", "长风公园", "临平路"], 900],
    ["「PolisSH」第五季", "重踏故土，循迹明光", "2026-03", ["静安寺", "世博大道", "海伦路", "小南门", "世纪大道"], 2200],
    ["「PolisSH」第六季北大合作篇", "黑白之界，弈局相融", "2026-05", ["自然博物馆", "上海图书馆", "马当路", "中山公园", "桂林路"], 1600],
    ["「PolisSH」第七季", "量子生死，重构真相", "2026-09", ["延安西路", "陕西南路", "浦东南路", "花木路", "龙耀路"], 3500],
  ];
  assert.deepEqual(chapters.map(c => [c.name, c.theme, c.date, c.districts, c.players]), expected);
  assert.equal(new Set(chapters.map(c => c.id)).size, 10);
});

test("intro preserves both supplied paragraphs and highlights meaningful phrases", () => {
  const expected = [
    "在「PolisSH」系列城市游戏中，玩家在起点领取游戏物料包，根据其中的任务册、剧情册、游戏道具，以及游戏小程序或网页，在真实城市街区完成观察、解谜、推理和协作的任务。玩家们将扮演一个角色，走入一段故事，完成使命，揭开真相，有时是从邪恶科学家手里救出朋友，有时自己却成了面临抉择的科学怪人。",
    "游玩过程中，玩家渐渐拨开推理和剧情上的迷雾，享受“尤里卡（希腊语：终于找到了！）”时刻的快感；也能与身旁伙伴一起漫步城市，享受真实的场景、人和关系，带来的愉悦。",
  ];
  assert.deepEqual(polisContent.intro.map(p => p.map(part => part.text).join("")), expected);
  const html = render();
  assert.match(html, /<strong>真实城市街区<\/strong>/);
  assert.match(html, /<strong>真实的场景、人和关系<\/strong>/);
  assert.ok(html.indexOf('class="pc-intro"') < html.indexOf('class="pc-selector"'));
  assert.ok(html.indexOf('class="pc-selector"') < html.indexOf('id="polis-chapter-panel"'));
});

test("ten tabs control exactly one in-place archive, defaulting to the latest season", () => {
  const html = render();
  assert.equal((html.match(/role="tab"/g) ?? []).length, 10);
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-controls="polis-chapter-panel"/g) ?? []).length, 10);
  assert.match(html, /data-chapter="s7"/);
  assert.match(html, /aria-labelledby="pc-tab-s7"/);
  assert.match(html, /SEASON 07/);
  assert.match(html, /<strong>3,500<\/strong>/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /<a\b|初次出发|沿街寻迹|城市折叠|S10/);
});

test("main, side, Lite, collaboration and anniversary nodes have distinct configured roles", () => {
  assert.deepEqual(chapters.map(c => c.kind), ["main", "main", "side", "main", "anniversary", "main", "lite", "main", "collaboration", "main"]);
  const html = render();
  assert.equal((html.match(/data-kind="main"/g) ?? []).length, 6);
  for (const kind of ["side", "anniversary", "lite", "collaboration"]) assert.equal((html.match(new RegExp(`data-kind="${kind}"`, "g")) ?? []).length, 1);
});

test("chapter rail omits dates while the season archive keeps its date", () => {
  const html = render();
  const selector = html.slice(html.indexOf('class="pc-selector"'), html.indexOf('id="polis-chapter-panel"'));
  assert.doesNotMatch(selector, /<time|202[456]\.\d{2}/);
  assert.match(html, /<time dateTime="2026-09">2026\.09<\/time>/);
});

test("only the seven bordered posters receive a small in-frame zoom", () => {
  const bordered = new Set(["s1", "s2", "s3", "s4", "s5", "s6-pku", "fudan-120"]);
  for (const [index, chapter] of chapters.entries()) {
    assert.equal(chapter.media.hero.zoom, bordered.has(chapter.id) ? 1.015 : 1);
    const html = renderToStaticMarkup(createElement(ChapterArchive, { chapter, index }));
    assert.ok(html.includes(`--pc-poster-zoom:${chapter.media.hero.zoom}`));
  }
});

test("each archive uses its own exact data, one portrait key visual and individual route tags", () => {
  for (const [index, chapter] of chapters.entries()) {
    const html = renderToStaticMarkup(createElement(ChapterArchive, { chapter, index }));
    assert.ok(html.includes(chapter.name) && html.includes(chapter.theme));
    assert.ok(html.includes(`dateTime="${chapter.date}"`));
    assert.ok(html.includes(`<strong>${chapter.players.toLocaleString("en-US")}</strong>`));
    for (const district of chapter.districts) assert.ok(html.includes(`${district}</span>`));
    assert.equal((html.match(/<li>/g) ?? []).length, chapter.districts.length);
    assert.equal((html.match(/class="pc-media"/g) ?? []).length, 1);
    assert.equal((html.match(/<img /g) ?? []).length, 1);
    assert.ok(html.includes(`src="${chapter.media.hero.src}"`));
    assert.ok(html.includes(`width="${chapter.media.hero.width}" height="${chapter.media.hero.height}"`));
    assert.doesNotMatch(html, /pc-media-placeholder|团队合照|pc-detail-pair|data-variant/);
    assert.doesNotMatch(html, /https?:\/\//);
  }
});

test("the single key visual stays data-replaceable and lazy-loaded", () => {
  const chapter = structuredClone(chapters[0]);
  chapter.media.hero.src = "/images/polis/s1-cover.webp";
  const html = renderToStaticMarkup(createElement(ChapterArchive, { chapter, index: 0 }));
  assert.match(html, /src="\/images\/polis\/s1-cover.webp"/);
  assert.match(html, /loading="lazy"/);
  assert.ok(html.includes(`alt="${chapter.media.hero.alt}"`));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert.doesNotMatch(html, /pc-media-placeholder|figcaption/);
});

test("all ten chapter posters match the supplied originals and have correct portrait dimensions", async () => {
  const filenames = ["psh1", "psh2", "psh2w", "psh3", "psh120", "psh4", "pshlite", "psh5", "psh6", "psh7"];
  for (const [index, chapter] of chapters.entries()) {
    const media = chapter.media.hero;
    assert.equal(media.src, `/images/polis/${filenames[index]}.png`);
    const png = await readFile(new URL(`../public${media.src}`, import.meta.url));
    assert.equal(png.readUInt32BE(16), media.width);
    assert.equal(png.readUInt32BE(20), media.height);
    assert.ok(media.height > media.width);
  }
});

test("chapter keyboard selection wraps and supports Home/End without handling map keys", () => {
  assert.equal(chapterIndexForKey("ArrowLeft", 0, 10), 9);
  assert.equal(chapterIndexForKey("ArrowRight", 9, 10), 0);
  assert.equal(chapterIndexForKey("ArrowRight", 2, 10), 3);
  assert.equal(chapterIndexForKey("Home", 5, 10), 0);
  assert.equal(chapterIndexForKey("End", 5, 10), 9);
  assert.equal(chapterIndexForKey("Escape", 5, 10), null);
  assert.equal(chapterIndexForKey("Tab", 5, 10), null);
  assert.equal(chapterIndexForKey("Home", 0, 0), null);
});

test("chapter layout includes responsive artwork, a horizontally scrollable selector and reduced motion", async () => {
  const css = await readFile(new URL("../app/polis-chapters.css", import.meta.url), "utf8");
  assert.match(css, /overflow-x: auto/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.pc-archive-layout \{ animation: none/);
  assert.match(css, /button:focus-visible/);
  assert.match(css, /\.pc-announcement \{ position: absolute; top: 0; left: 0;/);
  assert.match(css, /object-fit: contain; object-position: center bottom/);
  assert.match(css, /align-items: stretch/);
  assert.match(css, /aspect-ratio: var\(--pc-poster-ratio\)/);
  assert.match(css, /transform: scale\(var\(--pc-poster-zoom, 1\)\); transform-origin: left top/);
  assert.match(css, /\.pc-media-stage \{[^}]*overflow: hidden/);
  assert.doesNotMatch(css, /object-fit: cover|pc-detail-pair|data-variant/);
  const component = await readFile(new URL("../components/reference-city/PolisChapters.tsx", import.meta.url), "utf8");
  assert.match(component, /new ResizeObserver\(revealSelected\)/);
  assert.match(component, /resize\.disconnect\(\)/);
});
