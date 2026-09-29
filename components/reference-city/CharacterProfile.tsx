"use client";

/* eslint-disable @next/next/no-img-element -- local generated pixel illustration; no external optimizer needed */
import type { CSSProperties } from "react";
import { characterProfile as profile } from "@/content/character-profile";
import type { PlaceId } from "@/content/reference-city";

export function ProfileIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    balance: "M9 2h2v3h6v2h-2v2h1v2h1v3h-6v-3h1V9h1V7h-2v9h4v2H5v-2h4V7H7v2h1v2h1v3H3v-3h1V9h1V7H3V5h6z",
    star: "M9 1h2v5h2v2h5v4h-5v2h-2v5H9v-5H7v-2H2V8h5V6h2z",
    flame: "M10 1h2v4h2v3h2v3h1v5h-2v2H5v-2H3v-5h2V7h2v4h2V6h1z",
    contact: "M8 2h4v2h2v4h-2v2H8V8H6V4h2z M5 12h10v2h2v4H3v-4h2z M1 2h3v2H3v5H1z M16 2h3v7h-2V4h-1z",
    return: "M7 3h2v2H7v2H5v2h10v2h2v6h-2v-4h-2v-2H5v2h2v2h2v2H7v-2H5v-2H3v-2H1V9h2V7h2V5h2z",
    location: "M6 1h8v2h2v10h-2v2h-2v2h-1v2H9v-2H8v-2H6v-2H4V3h2z M8 5v6h4V5z",
  };
  return <svg viewBox="0 0 20 20" fill="currentColor" fillRule="evenodd" shapeRendering="crispEdges" aria-hidden="true"><path d={paths[kind] ?? paths.location} /></svg>;
}

/** Decorative six-axis portrait, intentionally without scores or numeric scales. */
export function AttributeRadar() {
  const attributes = [...profile.attributes].sort((a, b) => a.axis - b.axis);
  const radius = 63;
  const point = (index: number, radius: number) => {
    const angle = (index * 60 - 90) * Math.PI / 180;
    return [150 + Math.cos(angle) * radius, 112 + Math.sin(angle) * radius];
  };
  const polygon = (radius: number) => attributes.map((_, i) => point(i, radius).join(",")).join(" ");
  // Do not clamp to the grid: appetite and night-owl levels intentionally burst out.
  const shape = attributes.map((item, i) => point(i, radius * item.value / 100));
  return <svg className="cp-radar" viewBox="0 0 300 224" role="img" aria-labelledby="profile-radar-title profile-radar-desc">
    <title id="profile-radar-title">六维属性图</title>
    <desc id="profile-radar-desc">好奇心、创造力、团队协作均为满格，续航稍低。饭量和夜猫指数在相对的两个方向超出六边形，夜猫指数超出更多。不显示数字刻度。</desc>
    {[.35, .68, 1].map(ratio => <polygon key={ratio} points={polygon(radius * ratio)} className="cp-radar-grid" data-boundary={ratio === 1} />)}
    {attributes.map((item, i) => {
      const [x, y] = point(i, radius);
      const [tx, ty] = point(i, Math.max(94, radius * item.value / 100 + 26));
      return <g key={item.label} data-overflow={item.value > 100}>
        <path d={`M150 112L${x} ${y}`} className="cp-radar-axis" />
        {item.value > 100 && <path d={`M${x} ${y}L${shape[i][0]} ${shape[i][1]}`} className="cp-radar-overrun" />}
        <text x={tx} y={ty + 4} textAnchor="middle">{item.label}</text></g>;
    })}
    <polygon className="cp-radar-shape" points={shape.map(p => p.join(",")).join(" ")} />
    {shape.map(([x, y], i) => <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" className="cp-radar-dot" data-overflow={attributes[i].value > 100} />)}
    <rect x="148" y="110" width="4" height="4" fill="#7eddd8" />
  </svg>;
}

export function CharacterProfile({ onNavigate, onClose }: { onNavigate: (id: PlaceId) => void; onClose: () => void }) {
  return <div className="dossier-body character-profile">
    <div className="cp-layout">
      <aside className="cp-character" aria-label="像素角色立绘">
        <div className="cp-character-meta"><span>PLAYER / {profile.id}</span><span><i />已连接</span></div>
        <div className="cp-portrait-stage">
          <span className="cp-portrait-cross cp-cross-top" aria-hidden="true">＋</span>
          <span className="cp-portrait-cross cp-cross-bottom" aria-hidden="true">＋</span>
          <img src={profile.portrait} alt={profile.portraitAlt} width="1024" height="1536" decoding="async" draggable={false} />
          <div className="cp-character-platform" aria-hidden="true" />
        </div>
        <div className="cp-character-caption"><span>{profile.romanized}</span><strong>{profile.name}</strong></div>
        <div className="cp-energy"><span>探索热情 <small>ON / 持续生长</small></span><div aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</div></div>
      </aside>

      <div className="cp-data">
        <section className="cp-identity" aria-label="角色身份">
          <div className="cp-name-row"><h3>{profile.name}</h3><span className="cp-level">Lv.<b>{profile.level}</b></span><span className="cp-player-type">城市探索者</span></div>
          <ul className="cp-tags" aria-label="身份标签">{profile.tags.map(tag => <li key={tag.icon} data-kind={tag.icon}><ProfileIcon kind={tag.icon} />{tag.text}</li>)}</ul>
        </section>

        <div className="cp-traits">
          <section className="cp-creed" aria-labelledby="profile-creed-title">
            <h4 id="profile-creed-title" className="cp-section-title"><span>01</span>角色信条</h4>
            <span className="cp-quote-mark" aria-hidden="true">“</span>
            <blockquote>{profile.creed}</blockquote>
            <span className="cp-creed-rule" aria-hidden="true"><i /><i /><i /></span>
          </section>
          <section className="cp-attributes" aria-label="六维属性">
            <h4 className="cp-section-title"><span>02</span>六维属性</h4>
            <AttributeRadar />
          </section>
        </div>

        <section className="cp-quest" aria-labelledby="profile-quest-title">
          <div className="cp-quest-top"><h4 className="cp-section-title"><span>03</span>当前主线</h4><span className="cp-quest-status"><i />进行中</span></div>
          <h4 id="profile-quest-title">{profile.quest.title}</h4>
          <p>{profile.quest.description}</p>
          <p className="cp-destination-invite">{profile.quest.invitation}<span aria-hidden="true">↓</span></p>
          <nav className="cp-destinations" aria-label="主线地点直达">{profile.quest.places.map(place => <button type="button" key={place.id}
            style={{ "--place-color": place.color } as CSSProperties} onClick={() => onNavigate(place.id)} aria-label={`前往 ${place.label}：${place.note}`}>
            <ProfileIcon kind="location" /><span><strong>{place.label}</strong><small>{place.note}</small></span><b aria-hidden="true">↗</b>
          </button>)}</nav>
        </section>

        <div className="cp-actions" aria-label="角色操作">
          <button className="cp-game-button cp-primary-button" type="button" onClick={() => onNavigate(profile.contactDestination)}><ProfileIcon kind="contact" />联系方式</button>
          <button className="cp-game-button" type="button" onClick={onClose}><ProfileIcon kind="return" />返回主城</button>
        </div>
      </div>
    </div>
    <footer className="cp-footer"><span><i />STATUS: ONLINE</span><span>SHANGHAI / PERSONAL WORLD</span><span><kbd>ESC</kbd> 返回主城</span></footer>
  </div>;
}
