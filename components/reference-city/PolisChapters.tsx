"use client";

/* eslint-disable @next/next/no-img-element -- configurable local chapter artwork uses native lazy loading */
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { polisChapters, polisContent, chapterIndexForKey, type PolisChapter, type PolisMedia } from "@/content/polis-chapters";

function ChapterMedia({ media }: { media: PolisMedia }) {
  return <figure className="pc-media" aria-label={media.label} style={{ "--pc-poster-zoom": media.zoom } as CSSProperties}>
    <div className="pc-media-stage">
      {media.src ? <img src={media.src} alt={media.alt} loading="lazy" decoding="async" width={media.width} height={media.height} /> : <div className="pc-media-placeholder" role="img" aria-label={`${media.label}图片占位，待替换真实素材`}>
        <svg viewBox="0 0 48 40" fill="none" aria-hidden="true" shapeRendering="crispEdges"><path d="M4 4H44V36H4Z M4 12H44 M12 4V12 M20 4V12 M28 4V12 M36 4V12" stroke="currentColor" strokeWidth="2"/><path d="M11 29L19 21L26 28L32 22L38 29 M33 16H37V20H33Z" stroke="currentColor" strokeWidth="2"/></svg>
        <strong>{media.label}</strong><span>待替换真实素材</span>
      </div>}
    </div>
  </figure>;
}

export function ChapterArchive({ chapter, index }: { chapter: PolisChapter; index: number }) {
  const stamp = chapter.kind === "main" || chapter.kind === "collaboration" ? `SEASON ${String(chapter.season).padStart(2, "0")}` : `CHAPTER ${String(index + 1).padStart(2, "0")}`;
  return <section id="polis-chapter-panel" className="pc-archive" role="tabpanel" aria-labelledby={`pc-tab-${chapter.id}`} tabIndex={0} data-chapter={chapter.id}>
    <header className="pc-archive-header"><span><i aria-hidden="true" />本季档案</span><span>ARCHIVE / {String(index + 1).padStart(2, "0")}<b aria-hidden="true"> + + +</b></span></header>
    <div className="pc-archive-layout" key={chapter.id}>
      <div className="pc-gallery" aria-label={`${chapter.shortName}主视觉`} style={{ "--pc-poster-ratio": `${chapter.media.hero.width} / ${chapter.media.hero.height}` } as CSSProperties}>
        <ChapterMedia media={chapter.media.hero} />
      </div>
      <div className="pc-season-info">
        <div className="pc-season-code"><span>{stamp}</span><span><i aria-hidden="true" />已解锁</span></div>
        <p className="pc-season-name">{chapter.name}</p>
        <h4>{chapter.theme}</h4>
        <dl className="pc-season-facts">
          <div><dt>时间</dt><dd><time dateTime={chapter.date}>{chapter.date.replace("-", ".")}</time></dd></div>
          <div><dt>类型</dt><dd>{polisContent.kindLabels[chapter.kind]}</dd></div>
          <div className="pc-season-players"><dt>玩家</dt><dd><strong>{chapter.players.toLocaleString("en-US")}</strong><span>人</span></dd></div>
        </dl>
        <section className="pc-route" aria-label={`${chapter.shortName}城市街区`}>
          <h5><span aria-hidden="true">⌖</span> 城市街区</h5>
          <ol>{chapter.districts.map((district, districtIndex) => <li key={district}><span><b aria-hidden="true">{String(districtIndex + 1).padStart(2, "0")}</b>{district}</span>{districtIndex < chapter.districts.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>
        </section>
        <div className="pc-season-footer" aria-hidden="true"><span>POLISSH / CITY PLAY</span><span>{chapter.code}</span></div>
      </div>
    </div>
  </section>;
}

export function PolisChapters() {
  const [selected, setSelected] = useState(() => Math.max(0, polisChapters.findIndex(chapter => chapter.id === polisContent.defaultChapter)));
  const rail = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapter = polisChapters[selected];

  // Reveal only the horizontal rail. scrollIntoView would also scroll the dossier,
  // causing the intro/selector to jump when a chapter is changed.
  useEffect(() => {
    const container = rail.current, tab = tabRefs.current[selected];
    if (!container || !tab) return;
    const revealSelected = () => {
      // The parent opens its native dialog after this component mounts. Observe
      // visibility/size so the initial chapter is revealed on narrow screens too.
      if (!container.clientWidth) return;
      const outer = container.getBoundingClientRect(), inner = tab.getBoundingClientRect();
      if (inner.left >= outer.left + 8 && inner.right <= outer.right - 8) return;
      container.scrollTo({ left: container.scrollLeft + inner.left - outer.left - (container.clientWidth - inner.width) / 2, behavior: "instant" });
    };
    const frame = requestAnimationFrame(revealSelected);
    const resize = new ResizeObserver(revealSelected);
    resize.observe(container);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); };
  }, [selected]);

  const navigateByKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = chapterIndexForKey(event.key, index, polisChapters.length);
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    setSelected(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return <div className="dossier-body polis-chapters">
    <section className="pc-intro" aria-labelledby="pc-title">
      <div className="pc-intro-heading"><div><p className="pc-kicker">CITY PLAY / 城市即现场</p><h3 id="pc-title">{polisContent.title}<span>{polisContent.subtitle}</span></h3></div><span className="pc-intro-badge">真实城市 · 剧情解谜</span></div>
      <div className="pc-intro-copy">{polisContent.intro.map((paragraph, index) => <p key={index}>{paragraph.map((part, partIndex) => "emphasis" in part && part.emphasis ? <strong key={partIndex}>{part.text}</strong> : <span key={partIndex}>{part.text}</span>)}</p>)}</div>
      <dl className="pc-metrics" aria-label="PolisSH 关键数据">{polisContent.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
    </section>

    <section className="pc-selector" aria-labelledby="pc-selector-title">
      <header className="pc-selector-heading"><div><p className="pc-kicker">CHAPTER SELECT</p><h3 id="pc-selector-title">章节选择<span>{String(selected + 1).padStart(2, "0")} / {polisChapters.length}</span></h3></div>
        <div className="pc-selector-controls"><button type="button" aria-label="上一章节" disabled={selected === 0} onClick={() => setSelected(index => index - 1)}>←</button><button type="button" aria-label="下一章节" disabled={selected === polisChapters.length - 1} onClick={() => setSelected(index => index + 1)}>→</button></div>
      </header>
      <div className="pc-legend" aria-label="章节类型图例"><span><i data-shape="main" />正式季</span><span><i data-shape="side" />外传 / Lite / 合作篇</span><span><i data-shape="anniversary" />120周年特别篇</span></div>
      <div className="pc-rail" ref={rail}>
        <div className="pc-tabs" role="tablist" aria-label="PolisSH 章节选择" aria-orientation="horizontal">
          {polisChapters.map((item, index) => <button key={item.id} ref={element => { tabRefs.current[index] = element; }}
            type="button" role="tab" id={`pc-tab-${item.id}`} aria-label={item.shortName} aria-selected={selected === index} aria-controls="polis-chapter-panel" tabIndex={selected === index ? 0 : -1}
            className="pc-chapter-tab" data-kind={item.kind} onClick={() => setSelected(index)} onKeyDown={event => navigateByKey(event, index)}>
            <span className="pc-node-stage" aria-hidden="true"><span className="pc-node"><b>{item.code}</b></span></span>
            <strong>{item.shortName}</strong><span className="pc-selected-marker" aria-hidden="true">{selected === index ? "▴ 当前章节" : "·"}</span>
          </button>)}
        </div>
      </div>
    </section>
    <p className="pc-announcement" role="status" aria-live="polite" aria-atomic="true">当前档案：{chapter.name}，{chapter.theme}，{chapter.players.toLocaleString("en-US")}位玩家。</p>
    <ChapterArchive chapter={chapter} index={selected} />
  </div>;
}
