import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalTS } from "./load-local-ts.mjs";

const { contactTerminal: contact } = await loadLocalTS("content/contact-terminal.ts");
const { ContactTerminal } = await loadLocalTS("components/reference-city/ContactTerminal.tsx");
const render = () => renderToStaticMarkup(createElement(ContactTerminal));

test("contact terminal contains exact copy and only two real contact rows", () => {
  assert.equal(contact.title, "我们一起从热爱中创造价值。");
  assert.equal(contact.subtitle, "如果你想聊聊城市、产品、用户、AI、商业......");
  assert.deepEqual(contact.channels.map(c => [c.label, c.value]), [["手机号 / 微信", "15216632116"], ["邮箱", "15216632116@163.com"]]);
  const html = render();
  assert.ok(html.includes(contact.title) && html.includes(contact.subtitle));
  assert.equal((html.match(/class="ct-row"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /个人简历|其他个人主页|待替换|example.com|contact-sheet|<table/);
  assert.match(html, /STATUS: ONLINE/);
});

test("copy controls and mailto are separate accessible actions with live feedback", () => {
  const html = render();
  assert.equal((html.match(/class="ct-copy"/g) ?? []).length, 2);
  for (const channel of contact.channels) assert.ok(html.includes(`aria-label="复制${channel.label}：${channel.value}"`));
  assert.match(html, /href="mailto:15216632116@163.com"/);
  assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
});

test("copy handles clipboard rejection and contact layout remains compact and responsive", async () => {
  const component = await readFile(new URL("../components/reference-city/ContactTerminal.tsx", import.meta.url), "utf8");
  assert.match(component, /await navigator.clipboard.writeText\(value\)/);
  assert.match(component, /catch[\s\S]*无法自动复制/);
  const css = await readFile(new URL("../app/contact-terminal.css", import.meta.url), "utf8");
  assert.match(css, /height: fit-content; max-height: calc\(100svh/);
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  const integration = await readFile(new URL("../components/reference-city/CityTerminal.tsx", import.meta.url), "utf8");
  assert.match(integration, /isContact && <ContactTerminal/);
  assert.doesNotMatch(integration, /aboutContent.links/);
});
