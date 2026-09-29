import { useState } from "react";
import { agentSystem as system, type SystemScreenshot } from "@/content/agent-system";

/** Read-only system documentation. No model, tool or production-data requests. */
export function AgentSystemFile({ onClose }: { onClose: () => void }) {
  return <div className="dossier-body agent-system-file">
    <section className="sf-intro" aria-labelledby="sf-title">
      <div className="sf-file-meta"><span>SYSTEM FILE / 001</span><span><i />工作室内部使用中</span></div>
      <h3 id="sf-title">{system.title}</h3>
      <p className="sf-subtitle">{system.subtitle}</p>
      <div className="sf-why"><span className="sf-section-code">01 / 为什么做</span><p>{system.why}</p></div>
      <ul className="sf-problems" aria-label="要解决的协作问题">{system.problems.map(problem => <li key={problem}><span aria-hidden="true">!</span>{problem}</li>)}</ul>
      <dl className="sf-metrics">{system.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
    </section>

    <section className="sf-overview" aria-labelledby="sf-overview-title">
      <SystemHeading id="sf-overview-title" title="系统如何工作" code="02 / SYSTEM OVERVIEW" />
      <div className="sf-topology">
        <ol className="sf-flow" aria-label="Sugar Agent 系统流程">
          {system.flow.map((step, index) => <li key={step.id} data-step={step.id}>
            <span className="sf-step-code" aria-hidden="true">0{index + 1}</span><h4>{step.title}</h4>
            {step.id === "agents" ? <ul className="sf-agent-tags" aria-label="六类专业 Agent">{system.agents.map(agent => <li key={agent.name}><i aria-hidden="true">{agent.icon}</i>{agent.name}</li>)}</ul>
              : step.id === "resources" ? <ul className="sf-resource-tags">{system.resources.map(resource => <li key={resource}>{resource}</li>)}</ul>
              : <p>{step.detail}</p>}
            {index < system.flow.length - 1 && <b className="sf-flow-arrow" aria-hidden="true">→</b>}
          </li>)}
        </ol>
        <div className="sf-capabilities"><span>外部能力</span><ul>{system.tools.map(tool => <li key={tool.name} data-pending={tool.pending}>{tool.name}{tool.pending && <small>待上线</small>}</li>)}</ul></div>
      </div>
    </section>

    <section className="sf-designs" aria-labelledby="sf-designs-title">
      <SystemHeading id="sf-designs-title" title="三个核心产品设计" code="03 / DESIGN NOTES" />
      {system.designs.map((design, index) => <article className="sf-design" key={design.id} aria-labelledby={`sf-design-${design.id}`}>
        <div className="sf-design-copy"><span className="sf-section-code">0{index + 1} / {design.code}</span><h4 id={`sf-design-${design.id}`}>{design.title}</h4><strong>{design.summary}</strong><p>{design.description}</p></div>
        <div className="sf-design-visual">
          {design.id === "handoff" ? <div className="sf-handoff">
            <p className="sf-visual-label">阶段性成果的交接</p>
            <ol>{system.handoff.map((step, index) => <li key={step}><span>{step}</span>{index < system.handoff.length - 1 && <b aria-hidden="true">→</b>}</li>)}</ol>
            <div className="sf-payload"><span>随任务一并传递</span><strong>{system.handoffPayload}</strong></div>
          </div> : design.id === "context" ? <ol className="sf-context" aria-label="三层上下文结构">{system.context.map((layer, index) => <li key={layer.title}><span className="sf-layer-index" aria-hidden="true">L{index + 1}</span><div><strong>{layer.title}</strong><span>{layer.note}</span></div><em>{layer.scope}</em></li>)}</ol>
            : <div className="sf-integrations"><div className="sf-hub"><span aria-hidden="true">⌘</span>Sugar Agent <small>进入原有工具</small></div><ul>{system.tools.map(tool => <li key={tool.name}><strong>{tool.name}</strong><span>{tool.pending ? "待上线" : tool.role}</span></li>)}</ul></div>}
        </div>
      </article>)}
    </section>

    <section className="sf-walkthrough" aria-labelledby="sf-walkthrough-title">
      <SystemHeading id="sf-walkthrough-title" title="产品界面" code="04 / PRODUCT WALKTHROUGH" />
      <p className="sf-screenshot-note">真实产品截图 · 点击图片查看原图 · 仅展示界面，不连接在线服务</p>
      <SystemWalkthrough />
    </section>

    <section className="sf-outcome" aria-labelledby="sf-outcome-title">
      <span className="sf-section-code">05 / IN DAILY USE</span>
      <h3 id="sf-outcome-title"><i aria-hidden="true" />已进入真实团队工作</h3>
      <p className="sf-result">{system.outcome}</p>
      <p className="sf-privacy">{system.privacy}</p>
      <div className="sf-actions"><div>{system.githubUrl ? <a className="sf-button" href={system.githubUrl} target="_blank" rel="noopener noreferrer">查看 GitHub <span aria-hidden="true">→</span></a> : <><button type="button" className="sf-button" disabled aria-describedby="sf-github-note">查看 GitHub <span aria-hidden="true">→</span></button><small id="sf-github-note">仓库链接待补充</small></>}</div><button type="button" className="sf-button sf-button-secondary" onClick={onClose}>返回城市 <span aria-hidden="true">→</span></button></div>
    </section>
  </div>;
}

function SystemHeading({ id, title, code }: { id: string; title: string; code: string }) {
  return <header className="sf-section-heading"><h3 id={id}>{title}</h3><span>{code}</span></header>;
}

function SystemWalkthrough() {
  const [selected, setSelected] = useState("planning");
  return <div className="sf-walkthrough-groups">{system.walkthroughGroups.map(group => {
    const shots = system.screenshots.filter(shot => shot.group === group.id);
    const active = shots.find(shot => shot.id === selected) ?? shots[0];
    return <section className="sf-shot-group" key={group.id} aria-labelledby={`sf-shots-${group.id}`}>
      <header><h4 id={`sf-shots-${group.id}`}>{group.title}</h4><p>{group.note}</p></header>
      {group.id === "conversation" ? <>
        <div className="sf-shot-selector" role="group" aria-label="选择 Agent 界面">{shots.map(shot => <button type="button" key={shot.id} aria-pressed={selected === shot.id} aria-controls="sf-active-conversation" onClick={() => setSelected(shot.id)}>{shot.title}</button>)}</div>
        <div id="sf-active-conversation" aria-live="polite"><SystemScreen shot={active} index={system.screenshots.indexOf(active)} /></div>
      </> : <div className={`sf-screens sf-screens-${group.id}`}>{shots.map(shot => <SystemScreen key={shot.id} shot={shot} index={system.screenshots.indexOf(shot)} />)}</div>}
    </section>;
  })}</div>;
}

export function SystemScreen({ shot, index }: { shot: SystemScreenshot; index: number }) {
  return <figure className="sf-screen">
    <div className="sf-screen-bar"><span><i /><i /><i /></span><span>{String(index + 1).padStart(2, "0")} / {shot.code}</span></div>
    <div className="sf-screen-stage">{shot.src ? <a className="sf-screen-original" href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={`查看原图：${shot.title}（新窗口）`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local screenshots preserve their original dimensions. */}
      <img src={shot.src} alt={shot.alt} width={2880} height={1626} loading="lazy" decoding="async" /><span aria-hidden="true">查看原图 ↗</span></a> : <div className="sf-screen-placeholder" role="img" aria-label={`${shot.title}截图占位，待补充真实界面`}>
        <svg width="48" height="38" viewBox="0 0 48 38" fill="none" stroke="currentColor" aria-hidden="true"><path d="M2 2h44v29H2zM2 9h44M12 9v22M18 36h12M24 31v5M5 5h2m3 0h2m3 0h2M19 18l-3 3 3 3m16-6 3 3-3 3m-7-8-3 11" /></svg>
        <strong>{shot.title}</strong><span>真实界面截图 · 待补充</span>
      </div>}</div>
    <figcaption>{shot.title}</figcaption>
  </figure>;
}
