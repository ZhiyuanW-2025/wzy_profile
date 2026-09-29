import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { loadLocalTS } from "./load-local-ts.mjs";

const { characterProfile: profile } = await loadLocalTS("content/character-profile.ts");
const { referenceCity: city } = await loadLocalTS("content/reference-city.ts");
const { CharacterProfile, AttributeRadar } = await loadLocalTS("components/reference-city/CharacterProfile.tsx");

test("character dossier contains exact user copy, badge tags and game actions", () => {
  const html = renderToStaticMarkup(createElement(CharacterProfile, { onNavigate() {}, onClose() {} }));
  for (const text of [profile.name, profile.creed, profile.quest.description, ...profile.tags.map(t => t.text), "联系方式", "返回主城", "STATUS: ONLINE"]) assert.ok(html.includes(text));
  assert.match(html, /aria-label="身份标签"/);
  assert.equal(profile.contactDestination, "contact");
  assert.doesNotMatch(html, /查看简历|mailto:|发送邮件|带着好奇，继续探索。|城市构建者/);
  assert.match(html, /cp-character-caption[^]*?<strong>吴致远<\/strong>/);
  assert.match(html, /class="cp-character"/);
  assert.match(html, /class="cp-data"/);
  assert.match(html, /Lv\.<b>24<\/b>/);
  assert.equal((html.match(/aria-label="前往 /g) ?? []).length, 4);
  assert.doesNotMatch(html, /credential-sheet|about-dossier|your-email@example/);
});

test("radar has six labels, configured shape and no score text or numeric scales", () => {
  const html = renderToStaticMarkup(createElement(AttributeRadar));
  const labels = [...html.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(m => m[1]);
  assert.deepEqual(labels, [...profile.attributes].sort((a,b) => a.axis-b.axis).map(a => a.label));
  assert.deepEqual(profile.attributes.map(a => a.label), ["好奇心", "创造力", "团队协作", "续航", "饭量", "夜猫指数"]);
  assert.deepEqual(profile.attributes.slice(0,3).map(a => a.value), [100,100,100]);
  assert.equal((html.match(/class="cp-radar-dot"/g) ?? []).length, 6);
  assert.doesNotMatch(html, />\s*\d+\s*</);
});

test("radar really overflows the outer hexagon on two separated axes, with night owl highest", () => {
  const attributes = [...profile.attributes].sort((a,b) => a.axis-b.axis);
  assert.deepEqual(attributes.map(a => a.axis), [0,1,2,3,4,5]);
  const appetite = attributes.find(a => a.label === "饭量");
  const nightOwl = attributes.find(a => a.label === "夜猫指数");
  assert.ok(appetite.value > 100 && nightOwl.value > appetite.value);
  assert.equal(Math.abs(appetite.axis-nightOwl.axis), 3, "The oversized attributes should be on opposite axes");
  const endurance = attributes.find(a => a.label === "续航");
  assert.ok(endurance.value >= 75 && endurance.value < 100);
  const html = renderToStaticMarkup(createElement(AttributeRadar));
  const shapeTag = html.match(/<polygon[^>]*class="cp-radar-shape"[^>]*>/)?.[0];
  assert.ok(shapeTag);
  const shape = shapeTag.match(/points="([^"]+)"/)[1].split(" ").map(p=>p.split(",").map(Number));
  for (let i=0; i<6; i++) {
    const distance = Math.hypot(shape[i][0]-150,shape[i][1]-112);
    assert.ok(Math.abs(distance - 63*attributes[i].value/100) < .001, "Rendered points must not be clamped to the grid");
  }
  assert.equal((html.match(/class="cp-radar-overrun"/g)??[]).length,2);
});

test("all profile destinations resolve to existing content entrances and the plaza sign shares that target", () => {
  assert.deepEqual(profile.quest.places.map(p => p.id), ["experience-card", "polis-card", "client-card", "agent-card"]);
  for (const place of profile.quest.places) assert.ok(city.entrances.some(e => e.id === place.id));
  const sign = city.landmarkSigns.find(s => s.text === "Traveler Plaza");
  assert.ok(sign);
  assert.equal(sign.place, profile.quest.places[0].id);
  const [x,y,w,h] = city.entrances.find(p => p.id === sign.place).box;
  assert.ok(sign.x >= x && sign.y >= y && sign.x + sign.width <= x + w && sign.y + sign.height <= y + h);
  assert.equal(city.campusSign, "关于我的工作室");
  assert.equal(city.entrances.find(p => p.id === "experience-card").label, city.campusSign);
  assert.deepEqual(city.studioEntrySign, { x:251, y:459, width:239, height:42 });
});

test("supplied character cutout is transparent around the body and between the legs; dark clothes stay opaque", async () => {
  const file = new URL(`../public${profile.portrait}`, import.meta.url).pathname;
  const {data,info} = await sharp(file).raw().toBuffer({resolveWithObject:true});
  assert.equal(info.channels, 4);
  assert.equal(data[3], 0);
  assert.ok(info.width >= 512 && info.height > info.width);
  assert.equal(profile.portrait, "/images/profile/zhiyuan-pixel-v2.png");
  assert.ok(profile.portraitAlt.includes("黑框眼镜"));
  assert.ok(profile.portraitAlt.includes("白色连帽卫衣"));
  const alphaAt = (x, y) => data[(Math.floor(y * info.height / 1536) * info.width + Math.floor(x * info.width / 1024)) * 4 + 3];
  for (const [x, y] of [[100,500],[200,700],[565,1250],[570,1400]]) assert.equal(alphaAt(x,y), 0, "Background gaps should be genuinely transparent");
  for (const [x, y] of [[400,100],[520,520],[460,960]]) assert.ok(alphaAt(x,y) > 245, "Hair, hoodie and trousers must remain opaque");
});
