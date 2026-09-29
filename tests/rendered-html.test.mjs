import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const pages = [["/", "吴致远", "PolisSH 系列"]];

for (const [path, title, content] of pages) {
  test(`server-renders ${path}`, async () => {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(
      html,
      new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
    assert.match(
      html,
      new RegExp(content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
    assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
  });
}

test("renders six accessible building entrances, not floating project cards", async () => {
  const html = await (await render("/")).text();
  for (const label of [
    "进入关于我：个人终端",
    "进入关于我的工作室：Traveler Plaza",
    "进入PolisSH 系列：城市游戏街区",
    "进入B 端客户与项目：商业合作区",
    "进入AI Agent 工作台：数字实验室",
    "进入联系我：通讯塔",
  ]) {
    assert.ok(html.includes(`aria-label="${label}"`));
  }
  assert.match(html, /<canvas\b/);
  assert.match(html, /<dialog\b/);
  assert.doesNotMatch(html, /PROJECT FILE|class="map-card/);
});

test("homepage has a player HUD and the retired map is no longer served", async () => {
  const html = await (await render("/")).text();
  assert.match(html, /city-v3\/island-core-v3\.webp/);
  assert.match(html, /city-v3\/island-world-v3\.webp/);
  assert.match(html, /class="rc-world"/);
  assert.match(html, /重置地图，返回主城视角/);
  assert.match(html, /暂停动态/);
  assert.doesNotMatch(html, /href="\/legacy"|旧版地图/);
  for (const text of ["玩家信息", "产品构建者", "主线目标", "地图：打开地点索引", "通讯终端", "当前区域", "MAP MODE", "ESC"]) assert.ok(html.includes(text));
  assert.equal((html.match(/class="rc-building-outline"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /class="city-stage/);
  const response = await render("/legacy");
  assert.equal(response.status, 404);
});

test("server paints the cloud arrival layer and updated campus sign description", async () => {
  const html = await (await render("/")).text();
  assert.match(html, /关于我的工作室/);
  assert.doesNotMatch(html, /00 开端｜把热爱发扬光大/);
  assert.match(html, /class="rc-studio-entry-sign"/);
  assert.match(html, /Traveler Plaza/);
  assert.match(html, /class="rc-landmark-signs"/);
  assert.match(html, /class="rc-arrival"/);
  assert.match(html, /data-revealing="false"/);
  assert.equal((html.match(/class="rc-cloud-bank /g) ?? []).length, 4);
  assert.match(html, /arrival-cloud\.webp/);
});

test("only helicopter invitation remains; eighteen emoji choices live in a closed dialog", async () => {
  const html=await (await render("/")).text();
  assert.equal((html.match(/class="rc-helicopter-entry"/g)??[]).length,1);
  assert.match(html,/在这里留言，成为城市旅客/);
  const choices=html.match(/class="rc-emoji-grid">([\s\S]*?)<\/div>/)?.[1]??"";
  assert.equal((choices.match(/aria-pressed="(?:true|false)"/g)??[]).length,18);
  assert.doesNotMatch(html,/rc-info-hotspot|小彩蛋：|id="city-info-note"/);
  assert.doesNotMatch(html,/<dialog[^>]*\sopen(?:\s|=|>)/);
  assert.doesNotMatch(html,/船到桥头自然直|收集进度|解锁彩蛋|探索印章/);
});

test("visitor form shows the requested copy and a name field before mood selection", async () => {
  const html=await (await render("/")).text();
  for (const text of ["哦对，你会跳伞的，对吧？", "你现在心情如何？", "来都来了，打个招呼再走吧！", "此处信息将私密发送给我，不会公开展示。提交即表示同意发送，请勿填写敏感信息哦！"]) assert.ok(html.includes(text));
  assert.match(html, /<input[^>]+id="visitor-name"[^>]+name="name"/);
  assert.ok(html.indexOf('id="visitor-name"') < html.indexOf('class="rc-emoji-grid"'));
  assert.doesNotMatch(html, /留下一句话，然后从空中降落到这座城市|选一个旅客表情|给这座城留句话|直升机 → 码头 → 城市街道/);
});

for (const [path, destination] of [
  ["/timeline", "/#city-map"],
  ["/studio", "/#city-map"],
  ["/agent", "/#city-map"],
  ["/about", "/#city-map"],
]) {
  test(`redirects ${path} into the personal map`, async () => {
    const response = await render(path);
    assert.ok(response.status >= 300 && response.status < 400);
    assert.ok(response.headers.get("location")?.endsWith(destination));
  });
}
