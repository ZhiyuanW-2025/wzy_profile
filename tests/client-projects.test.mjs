import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalTS } from "./load-local-ts.mjs";
import sharp from "sharp";

const { clientProjects: content } = await loadLocalTS("content/client-projects.ts");
const { ClientProjects, OutputMedia } = await loadLocalTS("components/reference-city/ClientProjects.tsx");
const render = () => renderToStaticMarkup(createElement(ClientProjects));

test("Partner House contains the supplied headline, exact counts and lightweight client names", () => {
  assert.equal(content.headline, "把客户的目标，做成可以被真实体验的城市游戏产品。");
  assert.deepEqual(content.metrics.map(m => m.value), ["6", "4", "2"]);
  assert.deepEqual(content.clients, ["希尔顿", "上海国际光影节", "B站", "华为", "东方明珠", "OPPO"]);
  const html = render();
  assert.ok(html.includes(content.headline));
  for (const { value, label } of content.metrics) assert.ok(html.includes(`<dt>${label}</dt><dd>${value}</dd>`));
  for (const client of content.clients) assert.ok(html.includes(`<li>${client}</li>`));
  assert.doesNotMatch(html, /合同|万[元+＋]|36万|12万|梧桐无同|寻光奇遇记|个人城市艺术展|重点案例/);
});

test("headline stays on one line and scales to its actual container width", async () => {
  const css = await readFile(new URL("../app/client-projects.css", import.meta.url), "utf8");
  assert.match(css, /\.bp-overview \{ container-type: inline-size; \}/);
  assert.match(css, /font-size: min\(32px, 3\.9cqi\)/);
  assert.match(css, /white-space: nowrap/);
  assert.doesNotMatch(css, /max-width: 760px|text-wrap: balance/);
});

test("three mission types preserve the user's sentences without exposing individual proposals", () => {
  assert.deepEqual(content.missions.map(m => [m.title, m.description]), [
    ["城市空间体验升级", "通过城市探索、互动任务、剧情导览等方式，把酒店、景区、街区或大型活动空间转化为更有参与感、记忆点和内容深度的体验产品。"],
    ["团队共创与团建体验", "根据团队规模、组织文化和活动目标定制城市游戏，让成员在协作、探索和共同完成任务的过程中建立更自然的互动与共同记忆。"],
    ["品牌场景化营销体验", "将品牌产品、功能和传播诉求嵌入真实城市生活场景，通过可参与、可体验的活动，让用户在实际使用中理解和感知品牌价值。"],
  ]);
  const html = render();
  assert.equal((html.match(/class="bp-mission"/g) ?? []).length, 3);
  for (const mission of content.missions) assert.ok(html.includes(`<p>${mission.description}</p>`));
  assert.doesNotMatch(html, /<button|<a\s/); // Static overview, no fake interaction controls.
});

test("six supplied public images replace placeholders with the correct project roles", async () => {
  assert.equal(content.galleryTitle, "可公开素材展示");
  assert.deepEqual(content.gallery.map(m => m.format), ["phone", "booklet", "props", "scene", "scene", "poster"]);
  assert.equal(new Set(content.gallery.map(m => m.id)).size, 6);
  assert.deepEqual(content.gallery.map(m => m.src), ["1.png", "2.jpg", "3.jpg", "4.jpg", "5.png", "6.png"].map(name => `/images/clients/${name}`));
  assert.deepEqual(content.gallery.map(m => m.row), [1, 1, 1, 2, 2, 2]);
  const html = render();
  assert.equal((html.match(/class="bp-output"/g) ?? []).length, 6);
  assert.equal((html.match(/<img /g) ?? []).length, 6);
  assert.equal((html.match(/class="bp-gallery-row"/g) ?? []).length, 2);
  for (const item of content.gallery) {
    assert.ok(html.includes(`<figcaption>${item.label}</figcaption>`));
    assert.equal(item.fit, "contain");
    const metadata = await sharp(new URL(`../public${item.src}`, import.meta.url).pathname).metadata();
    assert.equal(metadata.width, item.width);
    assert.equal(metadata.height, item.height);
  }
  assert.match(html, /可公开素材展示/);
  assert.doesNotMatch(html, /素材待补充|公开素材画廊|PLACEHOLDER|https?:\/\//);
});

test("gallery can receive local public images, with alt text, configurable fit and lazy loading", () => {
  const output = { ...content.gallery[0], src: "/images/clients/mini-program.webp" };
  const html = renderToStaticMarkup(createElement(OutputMedia, { output, index: 0 }));
  assert.match(html, /src="\/images\/clients\/mini-program.webp"/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.ok(html.includes(`alt="${output.alt}"`));
  assert.match(html, /object-fit:contain/);
  assert.doesNotMatch(html, /素材待补充|PLACEHOLDER/);
});

test("the six-step delivery flow precedes the public image showcase", () => {
  assert.deepEqual(content.delivery, ["客户目标", "用户与场景研究", "概念提案", "产品设计", "小程序 / 物料 / 视觉设计落地", "上线执行"]);
  const html = render();
  const sections = ["bp-overview", "bp-missions", "bp-delivery", "bp-outputs"].map(name => html.indexOf(`class="${name}"`));
  assert.ok(sections.every((position, index) => position >= 0 && (index === 0 || position > sections[index - 1])));
  const flow = html.slice(html.indexOf('class="bp-flow"'));
  assert.equal((flow.match(/<li>/g) ?? []).length, 6);
  let previous = -1;
  for (const step of content.delivery) { const position = flow.indexOf(`<span>${step}</span>`); assert.ok(position > previous); previous = position; }
});

test("the existing B-end entrance routes to the new detail without changing other project routes", async () => {
  const { ProjectDetail } = await loadLocalTS("components/ProjectDetail.tsx");
  const { mapContent } = await loadLocalTS("content/site.ts");
  const card = mapContent.mapCards.find(c => c.id === "client-card");
  const html = renderToStaticMarkup(createElement(ProjectDetail, { card, onNavigate() {} }));
  assert.match(html, /class="dossier-body client-projects"/);
  assert.doesNotMatch(html, /case-sheet|minor-clients|合同|万[元+＋]/);
  const css = await readFile(new URL("../app/client-projects.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
