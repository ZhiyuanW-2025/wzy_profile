"use client";

import { useState } from "react";
import { agentContent } from "@/content/site";
import { useStamps } from "@/components/StampSystem";
import { Placeholder } from "@/components/Placeholder";

type ProjectName = keyof typeof agentContent.projects;

export default function AgentPage() {
  const { award } = useStamps();
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeAgent, setActiveAgent] = useState(0);
  const [activeLayer, setActiveLayer] = useState(1);
  const [activeProject, setActiveProject] = useState<ProjectName>("Hilton");
  const [activeTool, setActiveTool] = useState(0);
  const workflow = agentContent.workflows[activeWorkflow];

  const selectWorkflow = (index: number) => {
    setActiveWorkflow(index);
    setWorkflowStep(0);
  };

  const advanceWorkflow = () => {
    const next = Math.min(workflowStep + 1, workflow.steps.length - 1);
    setWorkflowStep(next);
    if (next === workflow.steps.length - 1) award("agent");
  };

  return (
    <main className="agent-page">
      <section className="agent-hero page-hero">
        <div className="agent-hero-status"><i /> 演示工作区 / DEMO MODE</div>
        <div className="hero-copy">
          <p className="eyebrow">{agentContent.hero.kicker}</p>
          <h1>{agentContent.hero.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{agentContent.hero.description}</p>
        </div>
        <div className="agent-console" aria-label="Sugar Agent 示意界面">
          <div className="console-bar"><span>工作区 / 希尔顿项目</span><i /><i /><i /></div>
          <div className="console-message user-message"><small>我 / 09:41</small><p>帮我继续推进昨天的 City Play 方案。</p></div>
          <div className="console-message system-message"><small>SUGAR / 上下文已就绪</small><p>已读取项目共识、客户反馈与上一轮待办。</p><b>已连接 3 个信息源</b></div>
          <div className="console-prompt"><span>向团队发起任务…</span><i>↵</i></div>
        </div>
      </section>

      <section className="content-section why-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">01 / 为什么做</p><h2>问题不在于 AI 不够聪明。</h2></div>
          <p>问题在于它缺少团队的共享上下文、清晰分工，以及进入真实工作流的能力。</p>
        </div>
        <div className="problem-list">
          {agentContent.problems.map((problem, index) => <div key={problem}><span>{String(index + 1).padStart(2, "0")}</span><p>{problem}</p></div>)}
        </div>
        <div className="before-after">
          <FlowDiagram
            label="改变之前 / 信息分散"
            nodes={["人", "飞书", "微信", "AI 聊天", "本地文件", "重复复制"]}
            type="before"
          />
          <div className="flow-shift" aria-hidden="true"><span>重新组织</span>→</div>
          <FlowDiagram
            label="改变之后 / 共享上下文"
            nodes={["Sugar Agent", "项目知识", "专业 Agent", "原有工具", "长期记忆"]}
            type="after"
          />
        </div>
      </section>

      <section className="agent-network-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">02 / 六类专业 Agent</p><h2>不是六个聊天框，<br />而是一支会交接的团队。</h2></div>
          <p>每个 Agent 有清晰职责，也知道什么时候把任务交给更合适的专业角色。</p>
        </div>
        <div className="agent-network">
          <div className="network-rail" role="tablist" aria-label="专业 Agent">
            {agentContent.agents.map((agent, index) => (
              <button
                type="button"
                key={agent.id}
                role="tab"
                aria-selected={activeAgent === index}
                className={activeAgent === index ? "active" : ""}
                onClick={() => setActiveAgent(index)}
              >
                <span>{agent.short}</span><b>{agent.name}</b><i>↗</i>
              </button>
            ))}
          </div>
          <article className="agent-focus" role="tabpanel">
            <div className="agent-focus-code" aria-hidden="true">{agentContent.agents[activeAgent].short}</div>
            <p className="eyebrow">当前角色 / {String(activeAgent + 1).padStart(2, "0")}</p>
            <h3>{agentContent.agents[activeAgent].name}</h3>
            <p>{agentContent.agents[activeAgent].role}</p>
            <div className="handoff-note"><span>下一步交接给</span><strong>{agentContent.agents[activeAgent].handsTo}</strong></div>
          </article>
        </div>
      </section>

      <section className="content-section workflow-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">03 / 工作流模拟</p><h2>多 Agent 协作，<br />具体是怎么发生的？</h2></div>
          <p>选择一个真实工作任务，用预设 Mock Data 体验分析、确认、交接与工具调用。V1 不接入真实 LLM。</p>
        </div>
        <div className="workflow-demo">
          <div className="workflow-sidebar">
            <span className="demo-label">选择一个任务</span>
            {agentContent.workflows.map((item, index) => (
              <button type="button" key={item.id} className={activeWorkflow === index ? "active" : ""} onClick={() => selectWorkflow(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
              </button>
            ))}
            <p><i /> 所有输出均为模拟数据</p>
          </div>
          <div className="workflow-stage">
            <div className="workflow-topbar"><span>运行任务 / {workflow.id.toUpperCase()}</span><span>{workflowStep + 1} / {workflow.steps.length}</span></div>
            <div className="workflow-history">
              {workflow.steps.slice(0, workflowStep + 1).map((step, index) => (
                <div key={`${step.title}-${index}`} className={`workflow-event ${index === workflowStep ? "current" : ""}`}>
                  <div className="event-actor">{step.actor}</div>
                  <div><span>{step.title}</span><p>{step.body}</p></div>
                  <i aria-hidden="true">{index < workflowStep ? "✓" : "●"}</i>
                </div>
              ))}
            </div>
            <div className="workflow-actions">
              <div className="workflow-progress">{workflow.steps.map((_, index) => <i key={index} className={index <= workflowStep ? "done" : ""} />)}</div>
              {workflowStep < workflow.steps.length - 1 ? (
                <button className="button agent-button" type="button" onClick={advanceWorkflow}>继续运行 <span>→</span></button>
              ) : (
                <div className="workflow-complete"><b>工作流已完成</b><span>「AI 协作」章已收入探索册。</span></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="context-section content-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">04 / 上下文与记忆</p><h2>角色统一，项目隔离，<br />并且记得长期发生过什么。</h2></div>
          <p>点击任意层查看职责。切换项目时，中间的项目知识变化，但 Agent 的角色与能力边界保持稳定。</p>
        </div>
        <div className="context-demo">
          <div className="context-layers" role="tablist" aria-label="上下文三层结构">
            {agentContent.contextLayers.map((layer, index) => (
              <button
                type="button"
                key={layer.id}
                role="tab"
                aria-selected={activeLayer === index}
                className={`${layer.id} ${activeLayer === index ? "active" : ""}`}
                onClick={() => setActiveLayer(index)}
              >
                <span>{layer.index}</span>
                <div><small>{layer.subtitle}</small><strong>{layer.title}</strong></div>
                <i>↗</i>
              </button>
            ))}
          </div>
          <div className="context-inspector" role="tabpanel">
            <div className="inspector-bar"><span>上下文检查器</span><i>实时</i></div>
            <p className="eyebrow">当前层级 / {agentContent.contextLayers[activeLayer].index}</p>
            <h3>{agentContent.contextLayers[activeLayer].title}</h3>
            <p>{agentContent.contextLayers[activeLayer].description}</p>
            {activeLayer === 1 && (
              <div className="project-switcher">
                <div className="project-tabs">
                  {(Object.keys(agentContent.projects) as ProjectName[]).map((project) => (
                    <button type="button" key={project} className={activeProject === project ? "active" : ""} onClick={() => setActiveProject(project)}>{project}</button>
                  ))}
                </div>
                <ul>{agentContent.projects[activeProject].map((item) => <li key={item}><i />{item}</li>)}</ul>
              </div>
            )}
            {activeLayer === 0 && <div className="code-lines" aria-hidden="true"><i /><i /><i /><i /></div>}
            {activeLayer === 2 && <div className="conversation-mini"><span>我</span><p>把这版按我习惯的格式整理一下。</p><span>Sugar Agent</span><p>已沿用你的简洁汇报结构。</p></div>}
          </div>
        </div>
      </section>

      <section className="tool-section content-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">05 / 进入原有工作流</p><h2>AI 进入原有工作流，<br />而不是要求人迁移。</h2></div>
          <p>点击外部能力，查看 Sugar Agent 如何读写知识、衔接沟通与完成执行。所有接入在 V1 中均为前端模拟。</p>
        </div>
        <div className="tool-orbit">
          <div className="tool-center">
            <span>S</span><strong>Sugar Agent</strong><small>协作中枢</small>
          </div>
          <div className="tool-links" aria-hidden="true"><i /><i /><i /></div>
          <div className="tool-buttons">
            {agentContent.tools.map((tool, index) => (
              <button type="button" key={tool.id} className={activeTool === index ? "active" : ""} onClick={() => setActiveTool(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{tool.name}</b>
              </button>
            ))}
          </div>
          <div className="tool-detail" aria-live="polite">
            <span>能力 / {String(activeTool + 1).padStart(2, "0")}</span>
            <h3>{agentContent.tools[activeTool].name}</h3>
            <p>{agentContent.tools[activeTool].detail}</p>
            <small>模拟连接</small>
          </div>
        </div>
      </section>

      <section className="usage-section content-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">06 / 真实使用</p><h2>在真实项目里工作，<br />也在真实反馈里迭代。</h2></div>
          <p>{agentContent.usage.description}</p>
        </div>
        <div className="usage-metrics">
          {agentContent.usage.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
        <div className="usage-assets">
          {agentContent.usage.assets.map((asset) => <Placeholder key={asset.label} asset={asset} />)}
        </div>
        <p className="privacy-note">公开作品集模式 · 模拟数据 · 不含私有提示词 · 不含客户内部文件</p>
      </section>

      <section className="role-section agent-role">
        <p className="section-index">我的角色 / MY ROLE</p>
        <div><h2>产品负责人</h2></div>
        <ul>
          {["产品定义", "多 Agent 工作流", "上下文体系", "工具接入", "测试评测", "产品迭代"].map((item, index) => (
            <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function FlowDiagram({ label, nodes, type }: { label: string; nodes: string[]; type: "before" | "after" }) {
  return (
    <div className={`flow-diagram ${type}`}>
      <span className="flow-label">{label}</span>
      <div className="flow-nodes">
        {nodes.map((node, index) => (
          <div key={node} className={index === 0 ? "primary" : ""}><span>{node}</span>{index < nodes.length - 1 && <i>→</i>}</div>
        ))}
      </div>
    </div>
  );
}
