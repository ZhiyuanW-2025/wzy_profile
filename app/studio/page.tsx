"use client";

import { useEffect, useRef, useState } from "react";
import { studioContent } from "@/content/site";
import { Placeholder } from "@/components/Placeholder";
import { useStamps } from "@/components/StampSystem";

const quizOptions = ["淮海中路", "武康路", "愚园路"];

export default function StudioPage() {
  const { award } = useStamps();
  const [seasonIndex, setSeasonIndex] = useState(6);
  const [stampPulse, setStampPulse] = useState(false);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "correct" | "wrong">("idle");
  const [hiltonStep, setHiltonStep] = useState(0);
  const polisEndRef = useRef<HTMLDivElement>(null);
  const activeSeason = studioContent.seasons[seasonIndex];

  useEffect(() => {
    const node = polisEndRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) award("city");
      },
      { threshold: 0.65 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [award]);

  const chooseSeason = (index: number) => {
    setSeasonIndex(index);
    setStampPulse(false);
    window.setTimeout(() => setStampPulse(true), 10);
    window.setTimeout(() => setStampPulse(false), 650);
  };

  const submitQuiz = () => {
    if (!quizChoice) return;
    if (quizChoice === "武康路") {
      setQuizState("correct");
      award("puzzle");
    } else {
      setQuizState("wrong");
    }
  };

  return (
    <main className="studio-page">
      <section className="studio-hero page-hero">
        <div className="hero-copy">
          <p className="eyebrow">{studioContent.hero.kicker}</p>
          <h1>{studioContent.hero.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{studioContent.hero.description}</p>
        </div>
        <div className="studio-hero-note" aria-hidden="true">
          <span>上海</span>
          <small>31.23° N · 121.47° E</small>
        </div>
        <div className="studio-stats">
          {studioContent.hero.stats.map((stat, index) => (
            <div key={stat.label} className={`studio-stat stat-${index + 1}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section polis-section">
        <div className="section-heading split-heading">
          <div>
          <p className="section-index">01 / 核心产品</p>
            <h2>PolisSH</h2>
          </div>
          <p>{studioContent.polis.description}</p>
        </div>

        <div className="polis-facts">
          {studioContent.polis.facts.map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>

        <div className="asset-mosaic polis-assets">
          {studioContent.polis.assets.map((asset, index) => (
            <Placeholder key={asset.label} asset={asset} className={`asset-${index + 1}`} />
          ))}
        </div>

        <div className="timeline-wrap">
          <div className="subsection-heading">
            <p className="eyebrow">产品迭代 · PRODUCT EVOLUTION</p>
            <h3>十期产品迭代，是一条不断重画的城市路线。</h3>
            <p>点击站点，查看每一季如何扩展规模与玩法。</p>
          </div>
          <div className="season-route" role="tablist" aria-label="PolisSH 季度时间线">
            <div className="season-route-line" aria-hidden="true" />
            {studioContent.seasons.map((season, index) => (
              <button
                key={season.id}
                type="button"
                role="tab"
                aria-selected={seasonIndex === index}
                className={seasonIndex === index ? "active" : ""}
                onClick={() => chooseSeason(index)}
              >
                <span>{season.id}</span>
                <i />
              </button>
            ))}
          </div>
          <div className="season-detail" role="tabpanel">
            <div className="season-image-placeholder">
              <div className="placeholder-grid" aria-hidden="true" />
              <span>{activeSeason.image}</span>
              <small>替换：本季代表图片</small>
              <b className={stampPulse ? "stamp pulse" : "stamp"} aria-hidden="true">已到达<br />{activeSeason.id}</b>
            </div>
            <div className="season-copy">
              <span className="season-id">{activeSeason.id}</span>
              <h3>{activeSeason.name}</h3>
              <dl>
                <div><dt>地点 / 主题</dt><dd>{activeSeason.place}</dd></div>
                <div><dt>参与人数</dt><dd>{activeSeason.players}</dd></div>
                <div><dt>核心玩法</dt><dd>{activeSeason.mechanic}</dd></div>
              </dl>
            </div>
          </div>
        </div>
        <div ref={polisEndRef} className="section-checkpoint"><span>PolisSH / 路线完成</span></div>
      </section>

      <section className="game-section">
        <div className="game-copy">
          <p className="section-index">02 / 30 秒体验</p>
          <h2>体验一道 PolisSH 任务</h2>
          <p>观察线索，选择它最可能指向的上海街道。V1 使用 Mock 谜题，明天可直接替换图片与答案。</p>
        </div>
        <div className="game-board">
          <div className="game-clue">
            <div className="placeholder-grid" aria-hidden="true" />
            <span>谜题图片占位 / PUZZLE IMAGE</span>
            <small>线索：梧桐、老洋房、文学与漫步</small>
          </div>
          <div className="game-answer">
            <p className="game-question">这张线索图最可能拍摄于哪里？</p>
            <div className="quiz-options">
              {quizOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => { setQuizChoice(option); setQuizState("idle"); }}
                  className={quizChoice === option ? "selected" : ""}
                >
                  <i aria-hidden="true" /> {option}
                </button>
              ))}
            </div>
            {quizState !== "correct" && (
              <button type="button" className="button dark" disabled={!quizChoice} onClick={submitQuiz}>提交答案</button>
            )}
            {quizState === "wrong" && <p className="quiz-feedback wrong">再观察一下，答案藏在“梧桐与老洋房”里。</p>}
            {quizState === "correct" && (
              <div className="quiz-success">
                <b aria-hidden="true">解谜成功</b>
                <div><strong>欢迎来到 PolisSH。</strong><span>「解谜」章已收入你的探索册。</span></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="content-section b2b-section">
        <div className="section-heading split-heading">
          <div><p className="section-index">03 / 企业案例</p><h2>上海城中希尔顿<br />City Play</h2></div>
          <p>重点不是“做出了什么物料”，而是如何把一句模糊需求，定义成一套可以被用户体验、被客户运营的完整产品。</p>
        </div>

        <div className="hilton-builder">
          <div className="hilton-quote">
            <span>客户原始需求 / 00</span>
            <blockquote>{studioContent.hilton.quote}</blockquote>
            <p>一个尚未被定义的问题</p>
          </div>
          <div className="hilton-process">
            <div className="process-track" aria-hidden="true"><i style={{ width: `${((hiltonStep + 1) / studioContent.hilton.steps.length) * 100}%` }} /></div>
            <div className="process-step-labels" role="tablist" aria-label="Hilton 产品定义流程">
              {studioContent.hilton.steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  aria-selected={index === hiltonStep}
                  className={index <= hiltonStep ? "reached" : ""}
                  onClick={() => setHiltonStep(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{step.title}</b>
                </button>
              ))}
            </div>
            <article className="process-detail" role="tabpanel">
              <span>{String(hiltonStep + 1).padStart(2, "0")} / 06</span>
              <h3>{studioContent.hilton.steps[hiltonStep].title}</h3>
              <p>{studioContent.hilton.steps[hiltonStep].body}</p>
              {hiltonStep < studioContent.hilton.steps.length - 1 ? (
                <button className="text-button" type="button" onClick={() => setHiltonStep((current) => current + 1)}>继续定义需求 →</button>
              ) : (
                <div className="concept-result"><small>最终产品概念 / FINAL CONCEPT</small><strong>城市手账 + 实景解谜 + 手作互动<br />→ 个人城市艺术展</strong></div>
              )}
            </article>
          </div>
        </div>

        <div className="asset-mosaic hilton-assets">
          {studioContent.hilton.assets.map((asset, index) => (
            <Placeholder key={asset.label} asset={asset} className={`asset-${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="light-festival-section content-section">
        <div className="case-number">12万+</div>
        <div className="section-heading split-heading">
          <div><p className="section-index">04 / 企业案例</p><h2>上海国际光影节<br />徐汇分会场</h2></div>
          <div><p>{studioContent.lightFestival.description}</p><span className="contract-note">已落地合同金额 / 12万+</span></div>
        </div>
        <div className="asset-mosaic light-assets">
          {studioContent.lightFestival.assets.map((asset, index) => (
            <Placeholder key={asset.label} asset={asset} className={`asset-${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="role-section studio-role">
        <p className="section-index">我的角色 / MY ROLE</p>
        <div><h2>创始人 /<br />产品负责人</h2></div>
        <ul>
          {["用户研究", "产品定义", "产品设计", "商业化", "客户沟通", "项目交付"].map((item, index) => (
            <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
