/* eslint-disable @next/next/no-img-element -- archive media are replaceable local assets with native lazy loading */
import { studioArchive as archive, type StudioArchiveMedia, type StudioRecord } from "@/content/studio-archive";
import type { PlaceId } from "@/content/reference-city";
import type { CSSProperties } from "react";

const tones = { cyan: "#83e6e4", pink: "#f3a2ce", gold: "#f2ce87" };

function GuildEmblem() {
  return <svg className="gs-emblem" viewBox="0 0 80 88" fill="none" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M12 4H68V12H76V60H68V68H60V76H48V84H32V76H20V68H12V60H4V12H12Z" fill="#112d3b" stroke="#83e6e4" strokeWidth="2" />
    <path d="M16 16H64V58H56V66H44V74H36V66H24V58H16Z" fill="#091724" stroke="#385b6a" strokeWidth="2" />
    <path d="M24 53V35H34V25H46V39H56V53Z" fill="#78c7cc" />
    <path d="M28 39H30V43H28ZM38 30H42V34H38ZM38 39H42V43H38ZM48 43H52V47H48Z" fill="#102734" />
    <path d="M36 53V47H44V53M22 58H58" stroke="#eecb83" strokeWidth="3" />
    <path d="M36 16H44M40 12V20" stroke="#eecb83" strokeWidth="2" />
  </svg>;
}

function ArchiveMedia({ media }: { media: StudioArchiveMedia }) {
  return <figure className="gs-media" data-format={media.format} data-real={Boolean(media.src)}>
    <div className="gs-media-frame">
      {media.src ? <img src={media.src} alt={media.alt} loading="lazy" decoding="async" width={media.width ?? 960} height={media.height ?? (media.format === "portrait" ? 1200 : media.format === "panorama" ? 384 : 540)} /> : <div className="gs-media-placeholder" role="img" aria-label={`${media.label}，图片占位，${media.note}`}>
        <svg viewBox="0 0 48 40" fill="none" aria-hidden="true" shapeRendering="crispEdges"><path d="M4 8H12V4H36V8H44V36H4Z" stroke="currentColor" strokeWidth="2"/><path d="M12 28L20 20L26 26L32 18L38 28M31 12H35V16H31Z" stroke="currentColor" strokeWidth="2"/></svg>
        <span>影像待归档</span>
      </div>}
      {!media.src && <span className="gs-media-code" aria-hidden="true">{media.id.toUpperCase()}</span>}
    </div>
    <figcaption><strong>{media.label}</strong>{!media.src && <span>{media.note}</span>}</figcaption>
  </figure>;
}

function RecordEntry({ record, number }: { record: StudioRecord; number: number }) {
  const major = record.kind === "milestone";
  return <li className="gs-record" data-kind={record.kind} data-record={record.id}
    style={{ "--record-accent": tones[record.accent ?? "cyan"] } as CSSProperties}>
    <div className="gs-record-date"><time dateTime={record.date.replace(".", "-")}>{record.date}</time><span aria-hidden="true">LOG / {String(number).padStart(2, "0")}</span></div>
    <span className="gs-record-node" aria-hidden="true" />
    <article className="gs-record-content" aria-labelledby={`gs-${record.id}`}>
      {record.badge && <p className="gs-record-badge"><span aria-hidden="true">◆</span>{record.badge}</p>}
      <div className="gs-record-layout" data-has-portrait={record.media?.[0]?.format === "portrait"}>
        <div className="gs-record-copy">
          <h4 id={`gs-${record.id}`}>{record.title}</h4>
          <p>{record.description}</p>
          {record.highlight && <div className="gs-record-highlight" data-stars={record.id === "five-star-club"}><strong>{record.highlight.value}</strong><span>{record.highlight.label}</span></div>}
        </div>
        {major && record.media && <div className="gs-record-media" data-count={record.media.length} style={{ "--gs-media-columns": record.media.map(media => `${media.width && media.height ? media.width / media.height : 1}fr`).join(" ") } as CSSProperties}>
          {record.media.map(media => <ArchiveMedia key={media.id} media={media} />)}
        </div>}
      </div>
    </article>
  </li>;
}

export function StudioArchive({ onNavigate }: { onNavigate: (id: PlaceId) => void }) {
  const { identity, statistics, journal, now } = archive;
  return <div className="dossier-body studio-archive">
    <section className="gs-identity" aria-labelledby="gs-title">
      <div className="gs-identity-meta"><span className="gs-live"><i aria-hidden="true" />{identity.status}</span></div>
      <div className="gs-identity-heading">
        <GuildEmblem />
        <div><p className="gs-eyebrow">SUGAR STUDIO</p><h3 id="gs-title">{identity.title}</h3><p className="gs-subtitle">{identity.subtitle}</p></div>
        <span className="gs-founded">{identity.since}</span>
      </div>
      <div className="gs-intro">{identity.intro.map((line, index) => <p key={index}>{line.map((part, partIndex) => {
        const destination = "destination" in part ? part.destination : undefined;
        return destination ? <button type="button" key={partIndex} onClick={() => onNavigate(destination)}>{part.text}<span aria-hidden="true"> ↗</span></button> : <span key={partIndex}>{part.text}</span>;
      })}</p>)}</div>
    </section>

    <section className="gs-statistics" aria-labelledby="gs-stats-title">
      <div className="gs-section-heading"><h3 id="gs-stats-title"><span aria-hidden="true">01</span>{statistics.title}</h3><small>{statistics.asOf}</small></div>
      <dl className="gs-figures"><div className="gs-players"><dt>{statistics.players.label}</dt><dd>{statistics.players.value}</dd></div>
        {statistics.figures.map(figure => <div key={figure.label}><dt>{figure.label}</dt><dd>{figure.value}</dd></div>)}
      </dl>
      <p className="gs-stat-scope">{statistics.scope}</p>
      <div className="gs-partners">
        <div className="gs-partner-label"><strong>{statistics.partners.title}</strong><span>合作版图，仍在扩展</span></div>
        <div className="gs-partner-names"><ul className="gs-partner-list" aria-label="合作品牌">{statistics.partners.names.map(name => <li key={name}>{name}</li>)}</ul>
          <div className="gs-partner-secondary"><button type="button" onClick={() => onNavigate(statistics.partners.destination)}>{statistics.partners.linkLabel}<span aria-hidden="true"> ↗</span></button></div>
        </div>
      </div>
    </section>

    <section className="gs-journal" aria-labelledby="gs-journal-title">
      <div className="gs-section-heading"><h3 id="gs-journal-title"><span aria-hidden="true">02</span>{journal.title}</h3><small>{journal.range}</small></div>
      <p className="gs-journal-subtitle">{journal.subtitle}</p>
      <ol className="gs-records" aria-label="工作室一路走来">
        {journal.records.map((record, index) => <RecordEntry key={record.id} record={record} number={index + 1} />)}
        <li className="gs-record gs-now" aria-current="step">
          <div className="gs-record-date"><span>NOW</span><small>当前节点</small></div><span className="gs-record-node" aria-hidden="true" />
          <article className="gs-now-content"><p className="gs-live"><i aria-hidden="true" />{now.status}</p><h4>{now.title}</h4><p className="gs-now-description">{now.description}</p>
            <ul className="gs-open-threads">{now.threads.map(thread => <li key={thread}>{thread}</li>)}</ul>
            <nav className="gs-destinations" aria-label="查看工作室当前作品">{now.destinations.map(link => <button key={link.destination} type="button" onClick={() => onNavigate(link.destination)}>{link.label}<span aria-hidden="true"> ↗</span></button>)}</nav>
          </article>
        </li>
      </ol>
    </section>
    <footer className="gs-footer"><span><i aria-hidden="true" /> 存档持续写入</span><span>SUGAR STUDIO / EST. 2025</span></footer>
  </div>;
}
