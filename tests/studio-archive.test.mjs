import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalTS } from "./load-local-ts.mjs";
import sharp from "sharp";

const { studioArchive: archive } = await loadLocalTS("content/studio-archive.ts");
const { referenceCity: city } = await loadLocalTS("content/reference-city.ts");
const { mapContent } = await loadLocalTS("content/site.ts");
const { StudioArchive } = await loadLocalTS("components/reference-city/StudioArchive.tsx");
const { ProjectDetail } = await loadLocalTS("components/ProjectDetail.tsx");
const renderArchive = () => renderToStaticMarkup(createElement(StudioArchive, { onNavigate() {} }));

test("guild identity and saved statistics precede the chronological journal", () => {
  const html = renderArchive();
  for (const text of ["薯格工作室", "城市游戏开发 × 内容策划", "2025年12月", "20,000+", "70+", "50%", "60万+", "品牌合作", "上海城中希尔顿", "上海国际光影节", "东方明珠", "点亮成就", "一路走来", "未完待续……"]) assert.ok(html.includes(text), text);
  assert.ok(html.includes("社团 · 工作室的累计成果"));
  assert.ok(html.includes(archive.journal.subtitle));
  assert.doesNotMatch(html, /公会档案|SG \/ 001|一路走来的存档|城市开始热闹起来|近950|200多人的社团群/);
  assert.ok(html.indexOf('class="gs-identity"') < html.indexOf('class="gs-statistics"'));
  assert.ok(html.indexOf('class="gs-statistics"') < html.indexOf('class="gs-journal"'));
  assert.match(html, /<dl class="gs-figures">/);
  assert.doesNotMatch(html, /class="data-band|领取任务|解锁任务|收集印章/);
});

test("all nine requested dates remain ordered, including two distinct September milestones", () => {
  const records = archive.journal.records;
  assert.deepEqual(records.map(r => r.date), ["2021.08", "2022.10", "2023.05", "2024.03", "2024.11", "2025.04", "2025.12", "2026.09", "2026.09"]);
  assert.equal(new Set(records.map(r => r.id)).size, 9);
  const html = renderArchive();
  assert.equal((html.match(/<time dateTime=/g) ?? []).length, 9);
  for (const record of records) {
    assert.ok(html.includes(record.title));
    assert.ok(html.includes(record.description));
  }
  assert.match(html, /寻光奇遇记/);
  assert.match(html, /梧桐无同/);
  assert.match(html, /近1000/);
  assert.match(html, /某个周末，上海街头来了1000位侦探。/);
  assert.match(html, /有了一个200多人的“原住民”群/);
  assert.match(html, /3500\+/);
});

test("exactly five milestones have replaceable archive imagery, while everyday notes stay light", () => {
  const milestones = archive.journal.records.filter(r => r.kind === "milestone");
  assert.deepEqual(milestones.map(r => r.id), ["polis-first-season", "five-star-club", "studio-founded", "client-launches", "polis-seventh-season"]);
  for (const record of milestones) {
    assert.ok(record.media.length >= 1 && record.media.length <= 2);
    for (const media of record.media) {
      assert.ok(media.src.startsWith("/images/studio/"));
      assert.ok(media.label && media.alt && media.width && media.height);
    }
  }
  for (const record of archive.journal.records.filter(r => r.kind === "note")) assert.equal(record.media, undefined);
  const html = renderArchive();
  assert.equal((html.match(/class="gs-media"/g) ?? []).length, 6);
  assert.equal((html.match(/data-kind="milestone"/g) ?? []).length, 5);
  assert.equal((html.match(/data-kind="note"/g) ?? []).length, 4);
  assert.match(html, /aria-current="step"/);
});

test("real archive media can replace placeholders through data only, with alt text and lazy loading", () => {
  const media = archive.journal.records.find(r => r.media)?.media[0];
  const original = media.src;
  try {
    media.src = "/images/studio/test-photo.webp";
    const html = renderArchive();
    assert.match(html, /src="\/images\/studio\/test-photo.webp"/);
    assert.match(html, /loading="lazy"/);
    assert.ok(html.includes(`alt="${media.alt}"`));
    assert.equal((html.match(/class="gs-media-placeholder"/g) ?? []).length, 0);
  } finally { media.src = original; }
});

test("six real archive photos have the correct milestone mapping and intrinsic dimensions", async () => {
  const media = archive.journal.records.flatMap(record => record.media ?? []);
  assert.deepEqual(media.map(m => m.src), ["1.jpg", "2.png", "3.jpg", "4.jpg", "5.png", "6.jpg"].map(name => `/images/studio/${name}`));
  assert.deepEqual(media.map(m => m.id), ["polis-s1", "club-award", "studio-team", "hilton-launch", "light-launch", "polis-s7"]);
  for (const item of media) {
    const metadata = await sharp(new URL(`../public${item.src}`, import.meta.url).pathname).metadata();
    assert.equal(metadata.width, item.width);
    assert.equal(metadata.height, item.height);
  }
  const html = renderArchive();
  assert.equal((html.match(/<img /g) ?? []).length, 6);
  assert.doesNotMatch(html, /影像待归档|待替换|gs-media-code/);
  assert.match(html, /工作人员返程图记/);
  assert.match(html, /城市定向社 · 社团成员合照/);
});

test("all inline and closing destinations reuse existing project terminals", () => {
  const introLinks = archive.identity.intro.flat().filter(p => p.destination);
  assert.deepEqual(introLinks.map(p => p.destination), ["polis-card", "client-card", "agent-card"]);
  for (const link of [...introLinks, archive.statistics.partners, ...archive.now.destinations]) {
    assert.ok(city.entrances.some(entrance => entrance.id === link.destination));
  }
  const card = mapContent.mapCards.find(card => card.id === "experience-card");
  const html = renderToStaticMarkup(createElement(ProjectDetail, { card, onNavigate() {} }));
  assert.match(html, /studio-archive/);
  assert.match(html, /点亮成就/);
  assert.doesNotMatch(html, /从校园里的产品实验/);
});

test("all six partners share one visual list without size-based tiers", () => {
  const html = renderArchive();
  const list = html.match(/<ul class="gs-partner-list"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
  assert.ok(list);
  assert.equal((list.match(/<li>/g) ?? []).length, 6);
  for (const name of archive.statistics.partners.names) assert.ok(list.includes(`<li>${name}</li>`));
  assert.doesNotMatch(html, /重点合作品牌|其他合作品牌|gs-partner-featured/);
});

test("scoped guild stylesheet supports mobile layouts and reduced motion", async () => {
  const css = await readFile(new URL("../app/studio-archive.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none/);
  assert.match(css, /button:focus-visible/);
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /import "\.\/studio-archive.css"/);
});
