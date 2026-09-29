import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalTS } from "./load-local-ts.mjs";

const { agentSystem: system } = await loadLocalTS("content/agent-system.ts");
const { AgentSystemFile, SystemScreen } = await loadLocalTS("components/reference-city/AgentSystemFile.tsx");
const render = () => renderToStaticMarkup(createElement(AgentSystemFile, { onClose() {} }));

test("system file opens with the real team problem and accurate 6/8/6 figures", () => {
  const html = render();
  assert.ok(html.includes(system.why));
  assert.deepEqual(system.metrics.map(m => [m.value, m.label]), [["6", "类 Agent"], ["8", "名成员"], ["6", "个推进项目"]]);
  assert.match(html, /SYSTEM FILE/);
  assert.doesNotMatch(html, /agent-grid|在线试用|开始试用|查看 Demo/);
});

test("overview preserves the six-step system flow, compact agents and all resources", () => {
  assert.deepEqual(system.flow.map(s => s.id), ["members", "project", "agents", "resources", "conversation", "delivery"]);
  assert.deepEqual(system.agents.map(a => a.name), ["策划", "代码", "视觉", "客户沟通", "采购", "营销"]);
  const html = render();
  assert.equal((html.match(/data-step=/g) ?? []).length, 6);
  let previous = -1;
  for (const step of system.flow) { const position = html.indexOf(`data-step="${step.id}"`); assert.ok(position > previous); previous = position; }
  for (const resource of ["工具", "Skill", "项目知识库", "Agent知识库"]) assert.ok(html.includes(`<li>${resource}</li>`));
  assert.match(html, /企业微信<small>待上线<\/small>/);
  assert.equal(system.tools.filter(t => t.pending).length, 1);
});

test("three core designs include handoff, user confirmation and isolated context layers", () => {
  const html = render();
  assert.equal((html.match(/class="sf-design"/g) ?? []).length, 3);
  for (const design of system.designs) assert.ok(html.includes(design.description));
  assert.match(html, /用户确认/);
  assert.match(html, /任务 \+ 项目知识 \+ 已确认结果/);
  assert.deepEqual(system.context.map(c => c.title), ["全局 Agent Prompt", "项目知识库", "个人会话"]);
  for (const label of ["角色统一", "项目隔离", "成员独立"]) assert.ok(html.includes(label));
});

test("eight real screenshots map to five conversations, shared/personal records, testing and Skills", () => {
  const html = render();
  assert.deepEqual(system.screenshots.map(s => s.id), ["planning", "coding", "purchasing", "visual", "marketing", "records", "testing", "skills"]);
  assert.deepEqual(system.screenshots.map(s => s.group), ["conversation", "conversation", "conversation", "conversation", "conversation", "records", "management", "management"]);
  assert.doesNotMatch(html, /sf-screen-placeholder|真实界面截图待补充/);
  assert.equal((html.match(/aria-pressed=/g) ?? []).length, 5);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/<img /g) ?? []).length, 4);
  assert.match(html, /项目进度记录与个人工作日志/);
  for (const [index, shot] of system.screenshots.entries()) {
    assert.equal(shot.src, `/images/agent/${index + 1}.png`);
    const image = renderToStaticMarkup(createElement(SystemScreen, { shot, index }));
    assert.match(image, /loading="lazy" decoding="async"/);
    assert.ok(image.includes(`alt="${shot.alt}"`));
    assert.ok(image.includes(`href="${shot.src}"`));
    assert.match(image, /target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(image, /sf-screen-placeholder/);
  }
});

test("all eight local screenshots retain their original full-resolution PNG dimensions", async () => {
  for (const shot of system.screenshots) {
    const png = await readFile(new URL(`../public${shot.src}`, import.meta.url));
    assert.equal(png.readUInt32BE(16), 2880);
    assert.equal(png.readUInt32BE(20), 1626);
  }
});

test("outcome states actual usage and privacy boundary; missing GitHub link is disabled", () => {
  const html = render();
  assert.ok(html.includes(system.outcome));
  assert.ok(html.includes(system.privacy));
  assert.match(html, /disabled="" aria-describedby="sf-github-note"/);
  assert.match(html, /仓库链接待补充/);
  assert.match(html, /返回城市/);
  assert.doesNotMatch(html, /href="#"|<form|<input/);
});

test("real GitHub config produces a usable safe link, without changing other content", () => {
  const original = system.githubUrl;
  try {
    system.githubUrl = "https://github.com/example/sugar-agent";
    const html = render();
    assert.match(html, /href="https:\/\/github.com\/example\/sugar-agent"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /仓库链接待补充/);
  } finally { system.githubUrl = original; }
});

test("existing Agent entrance now renders the system file and supports mobile/reduced motion", async () => {
  const { ProjectDetail } = await loadLocalTS("components/ProjectDetail.tsx");
  const { mapContent } = await loadLocalTS("content/site.ts");
  const html = renderToStaticMarkup(createElement(ProjectDetail, { card: mapContent.mapCards.find(c => c.id === "agent-card"), onNavigate() {}, onClose() {} }));
  assert.match(html, /class="dossier-body agent-system-file"/);
  const css = await readFile(new URL("../app/agent-system.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const component = await readFile(new URL("../components/reference-city/AgentSystemFile.tsx", import.meta.url), "utf8");
  assert.match(component, /onClick=\{onClose\}/);
  assert.doesNotMatch(component, /fetch\(|XMLHttpRequest|WebSocket|localStorage/);
});
