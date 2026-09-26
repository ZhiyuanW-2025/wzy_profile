import Link from "next/link";
import { homeContent } from "@/content/site";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-intro">
        <div className="home-identity">
          <p className="eyebrow">个人作品集 · PORTFOLIO 2027</p>
          <h1>{homeContent.name}</h1>
          <p className="home-role">{homeContent.role}</p>
        </div>
        <p className="home-statement">{homeContent.statement}</p>
        <div className="scroll-cue" aria-hidden="true">
          <span>选择一个产品开始体验</span>
          <i />
        </div>
      </section>

      <section className="project-choices" aria-label="项目入口">
        {homeContent.projects.map((project) => (
          <Link key={project.number} href={project.href} className={`project-choice ${project.kind}`}>
            <div className="project-choice-top">
              <span className="project-number">{project.number}</span>
              <span className="project-category">{project.kind === "city" ? "真实世界体验" : "AI 团队工作台"}</span>
            </div>
            <div className="project-choice-body">
              <p className="project-eyebrow">{project.eyebrow}</p>
              <h2>{project.title}</h2>
              <ul>
                {project.metrics.map((metric) => <li key={metric}>{metric}</li>)}
              </ul>
            </div>
            <div className="project-choice-bottom">
              <span>{project.cta}</span>
              <span className="arrow" aria-hidden="true">↗</span>
            </div>

            <div className="project-signal" aria-hidden="true">
              {project.kind === "city" ? "路线 · 任务 · 解谜 · 城市" : "上下文 · 协作 · 工具 · 记忆"}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
