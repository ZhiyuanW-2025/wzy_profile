"use client";

import { type CSSProperties, type RefObject } from "react";
import { referenceCity as city, type CityEntrance, type PlaceId } from "@/content/reference-city";

export function HudIcon({ kind }: { kind: "map" | "signal" | "cursor" }) {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" aria-hidden="true">
    {kind === "map" ? <><path d="m2 5 5-2 6 2 5-2v13l-5 2-6-2-5 2Z M7 3v13 M13 5v13" /><path d="m9 8 2 2-2 2" /></>
      : kind === "signal" ? <><path d="M8 17h4 M10 10v7 M7 12a5 5 0 1 1 6 0 M5 14a8 8 0 1 1 10 0" /><path d="M9 7h2v2H9z" /></>
      : <path d="m4 2 12 9-6 1-3 6Z M11 12l4 5" />}
  </svg>;
}

function PixelAvatar() {
  return <svg className="rc-player-avatar" viewBox="0 0 24 26" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#102c4c" d="M0 0h24v26H0z" />
    <path fill="#1e5971" d="M2 3h2v2H2z M20 21h2v2h-2z M19 4h2v1h-2z" />
    <path fill="#7d94b5" d="M8 4h8v1H8z M6 5h12v3H6z" />
    <path fill="#061321" d="M7 4h9v2H7z M5 7h14v7H5z M7 5h10v6H7z" />
    <path fill="#f0cdbb" d="M7 10h10v7H7z M6 12h12v3H6z M9 17h6v3H9z" />
    <path fill="#081c30" d="M7 9h4v3H7z M10 8h7v3h-7z M8 13h2v1H8z M14 13h2v1h-2z" />
    <path fill="#c48483" d="M11 16h3v1h-3z" />
    <path fill="#167788" d="M6 20h12v6H6z M4 22h16v4H4z" />
    <path fill="#6ce5e7" d="M7 19h3v2H7z M14 19h3v2h-3z M6 22h2v4H6z M16 22h2v4h-2z" />
    <path fill="#12324c" d="M10 20h4v6h-4z" />
  </svg>;
}

type HudProps = {
  indexOpen: boolean;
  indexButton: RefObject<HTMLButtonElement | null>;
  onToggleIndex: () => void;
  onEnter: (id: PlaceId) => void;
  active: CityEntrance | undefined;
};

export function CityHud({ indexOpen, indexButton, onToggleIndex, onEnter, active }: HudProps) {
  return <header className="rc-hud" aria-label="玩家信息与城市系统">
    <section className="rc-player" aria-label="玩家信息">
      <div className="rc-avatar-frame"><PixelAvatar /><span>01</span></div>
      <div className="rc-player-info">
        <div className="rc-player-name"><h1>{city.player.name}</h1><span>{city.player.romanized}</span></div>
        <p className="rc-player-role">{city.player.identity}</p>
        <div className="rc-player-state"><span>主城 <b>{city.player.city}</b></span><span><i />{city.player.status}</span></div>
      </div>
    </section>
    <div className="rc-objective">
      <span><i />主线目标 <small>MAIN OBJECTIVE</small></span>
      <p>{city.player.objective}</p>
      <div className="rc-objective-rule" aria-hidden="true"><i /><i /><i /></div>
    </div>
    <div className="rc-system">
      <div className="rc-system-label"><span>城市系统</span><small>SYSTEM / 01</small></div>
      <nav className="rc-hud-actions" aria-label="主城系统菜单">
        <button ref={indexButton} type="button" aria-label="地图：打开地点索引" aria-expanded={indexOpen} aria-controls="city-directory" onClick={onToggleIndex} data-active={indexOpen}>
          <HudIcon kind="map" /><span>地图<small>MAP</small></span><i aria-hidden="true" />
        </button>
        <button type="button" aria-haspopup="dialog" onClick={() => onEnter("contact")} data-active={active?.id === "contact"}>
          <HudIcon kind="signal" /><span>通讯终端<small>COMMS</small></span><i aria-hidden="true" />
        </button>
      </nav>
    </div>
    <nav id="city-directory" className="rc-directory" aria-label="城市地点索引" hidden={!indexOpen}>
      <div className="rc-directory-title"><span>主城地图</span><small>06 个地点</small></div>
      {city.entrances.map((p, i) => <button key={p.id} type="button" onClick={() => onEnter(p.id)} style={{ "--district-color": p.color } as CSSProperties}>
        <b>{String(i + 1).padStart(2, "0")}</b><span>{p.label}<small>{p.district}</small></span><i aria-hidden="true">↗</i>
      </button>)}
      <p><kbd>ESC</kbd> 收起地图</p>
    </nav>
  </header>;
}

export function CityStatus({ active, paused, reduced, onPause, onReset, edge, dragging }: { active: CityEntrance | undefined; paused: boolean; reduced: boolean; onPause: () => void; onReset: () => void; edge: string; dragging: boolean }) {
  return <footer className="rc-statusbar" aria-label="主城状态与操作提示">
    <div className="rc-map-mode"><span aria-hidden="true">⌖</span><b>MAP MODE</b><small>城市探索</small></div>
    <div className="rc-current-region" data-edge={Boolean(edge)}><small>{edge ? "地图边界" : "当前区域"}</small><span>{edge || (dragging ? "正在探索海域" : active?.district ?? "上海 · 主城全景")}</span></div>
    <div className="rc-operating-hints"><span><HudIcon kind="cursor" />拖动探索 · 点击进入</span><span><kbd>ESC</kbd>返回主城</span></div>
    <span className="rc-pan-hint">拖动探索 · 点击建筑进入</span>
    <button className="rc-home-view" type="button" onClick={onReset} aria-label="重置地图，返回主城视角">⌖ <span>主城视角</span></button>
    <button className="rc-motion-button" type="button" aria-pressed={paused || reduced} disabled={reduced} onClick={onPause}>
      <i data-paused={paused || reduced} aria-hidden="true" /><span>{reduced ? "静态模式" : paused ? "继续动态" : "暂停动态"}</span><small aria-hidden="true">{paused || reduced ? "Ⅱ" : "LIVE"}</small>
    </button>
  </footer>;
}
