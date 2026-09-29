import { clientProjects, type ClientOutput } from "@/content/client-projects";
import type { CSSProperties } from "react";

/** Public-facing overview only: no customer-specific proposals or contract values. */
export function ClientProjects() {
  const galleryRows = [...new Set(clientProjects.gallery.map(output => output.row))];
  return (
    <div className="dossier-body client-projects">
      <section className="bp-overview" aria-labelledby="bp-intro-title">
        <p className="bp-eyebrow"><i aria-hidden="true" />合作概览<span>PARTNER HOUSE</span></p>
        <h3 id="bp-intro-title">{clientProjects.headline}</h3>
        <dl className="bp-metrics">
          {clientProjects.metrics.map(metric => (
            <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
          ))}
        </dl>
        <ul className="bp-clients" aria-label="合作客户">
          {clientProjects.clients.map(client => <li key={client}>{client}</li>)}
        </ul>
      </section>

      <section className="bp-missions" aria-labelledby="bp-missions-title">
        <SectionHeading id="bp-missions-title" title="委托类型" code="MISSION TYPE" />
        <div className="bp-mission-grid">
          {clientProjects.missions.map((mission, index) => (
            <article className="bp-mission" key={mission.id}>
              <div className="bp-mission-top"><MissionIcon kind={mission.id} /><span>0{index + 1}</span></div>
              <h4>{mission.title}</h4>
              <p>{mission.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bp-delivery" aria-labelledby="bp-delivery-title">
        <SectionHeading id="bp-delivery-title" title="通用交付流程" code="DELIVERY FLOW" />
        <ol className="bp-flow">
          {clientProjects.delivery.map((step, index) => (
            <li key={step}>
              <span className="bp-flow-number" aria-hidden="true">0{index + 1}</span>
              <span>{step}</span>
              {index < clientProjects.delivery.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
      </section>

      <section className="bp-outputs" aria-labelledby="bp-outputs-title">
        <SectionHeading id="bp-outputs-title" title={clientProjects.galleryTitle} code="PUBLIC SHOWCASE" />
        <div className="bp-gallery">
          {galleryRows.map(row => {
            const outputs = clientProjects.gallery.filter(output => output.row === row);
            return <div className="bp-gallery-row" key={row} style={{ "--bp-row-columns": outputs.map(output => `${output.width / output.height}fr`).join(" ") } as CSSProperties}>
              {outputs.map(output => <OutputMedia key={output.id} output={output} index={clientProjects.gallery.indexOf(output)} />)}
            </div>;
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ id, title, code }: { id: string; title: string; code: string }) {
  return <div className="bp-section-heading"><h3 id={id}>{title}</h3><span>{code}</span><i aria-hidden="true" /></div>;
}

function MissionIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {kind === "space" ? <>
      <path d="M3 27h26M5 25V11h9v14M17 25V5h10v20M9 15h2m-2 5h2m10-10h2m-2 5h2m-2 5h2" />
      <path d="M3 7h10M8 2v10" opacity=".55" />
    </> : kind === "team" ? <>
      <path d="M12 3h8v8h-8zM3 17h8v8H3zM21 17h8v8h-8zM16 14v6m-2 2h4M7 28v2h18v-2" />
      <path d="M8 9H5v5m19-5h3v5" opacity=".55" />
    </> : <>
      <path d="M4 11h8l14-6v20l-14-6H4zM11 19v9h5v-7M22 7v16M2 13v4" />
      <path d="M29 9h2m-2 6h3m-3 6h2" opacity=".55" />
    </>}
  </svg>;
}

export function OutputMedia({ output, index }: { output: ClientOutput; index: number }) {
  return <figure className="bp-output" data-format={output.format} style={{ "--bp-image-ratio": `${output.width} / ${output.height}` } as CSSProperties}>
    <div className="bp-output-stage">
      {output.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- public media is replaced through content configuration.
        <img src={output.src} alt={output.alt} width={output.width} height={output.height} loading="lazy" decoding="async" style={{ objectFit: output.fit ?? "contain" }} />
      ) : <div className="bp-output-placeholder">
        <OutputOutline format={output.format} />
        <strong>{output.placeholder}</strong>
        <span>素材待补充</span>
      </div>}
      {!output.src && <span className="bp-output-code" aria-hidden="true">{String(index + 1).padStart(2, "0")} / PLACEHOLDER</span>}
      <i className="bp-output-corner" aria-hidden="true" />
    </div>
    <figcaption>{output.label}</figcaption>
  </figure>;
}

/** Abstract empty frames, not simulated customer artifacts. */
function OutputOutline({ format }: { format: ClientOutput["format"] }) {
  return <svg className="bp-output-outline" viewBox="0 0 100 72" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    {format === "phone" ? <><path d="M34 2h32v68H34zM34 11h32M34 61h32M45 6h10M47 66h6" /><path d="M40 19h20v28H40zM40 52h15" opacity=".45" /></>
      : format === "map" ? <><path d="m10 15 26-7 28 9 26-7v47l-26 7-28-9-26 7zM36 8v47m28-38v47" /><path d="M22 44h12V29h22v15h22V27" strokeDasharray="3 3" /><path d="M19 41h6v6h-6zm56-17h6v6h-6z" /></>
      : format === "poster" ? <><path d="M27 3h46v66H27zM33 10h34v42H33zM33 59h20M33 63h30" /><path d="m40 33 10-12 10 12-10 12z" opacity=".4" /></>
      : format === "booklet" ? <><path d="M50 17 18 9v47l32 8 32-8V9zM50 17v47M24 20l18 5m-18 4 18 5m-18 4 18 5m16-18 18-5m-18 14 18-5" /></>
      : format === "props" ? <><path d="M14 18h44v37H14zM23 26h26M23 32h17M65 13h18v26H65zM66 47h16v15H66z" /><path d="M20 55v7h35M70 20h8M71 54h6" opacity=".5" /></>
      : format === "installation" ? <><path d="M29 60V11h42v49M23 60h54M35 17h30v24H35zM43 48h14v12" /><path d="M14 27h8m56 0h8M50 1v5M18 11l5 5m54 0 5-5" opacity=".5" /></>
      : <><path d="M9 11h82v50H9zM9 50l23-19 20 16 14-12 25 18" /><path d="M65 21h9v9h-9z" /><path d="M4 23V6h18m56 0h18v17M4 49v17h18m56 0h18V49" opacity=".4" /></>}
  </svg>;
}
