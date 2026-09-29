"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { mapContent } from "@/content/site";
import { referenceCity, type PlaceId } from "@/content/reference-city";
import { ProjectDetail } from "../ProjectDetail";
import { CharacterProfile } from "./CharacterProfile";
import { characterProfile } from "@/content/character-profile";
import { ContactTerminal } from "./ContactTerminal";

/** The scene knows only an entrance ID. Existing project content stays independent. */
export function CityTerminal({ selected, onClose, onNavigate }: { selected: PlaceId | null; onClose: () => void; onNavigate: (id: PlaceId) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const isProfile = selected === "about-card";
  const isStudio = selected === "experience-card";
  const isPolis = selected === "polis-card";
  const isClient = selected === "client-card";
  const isAgent = selected === "agent-card";
  const isContact = selected === "contact";
  const place = referenceCity.entrances.find(p => p.id === selected);
  const code = String(referenceCity.entrances.findIndex(p => p.id === selected) + 1).padStart(2, "0");
  const content = mapContent.mapCards.find(p => p.id === selected);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (selected) {
      if (!element.open) element.showModal();
      const scroll = element.querySelector(".dossier-body");
      if (scroll) scroll.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
    } else if (element.open) element.close();
    const previous = document.body.style.overflow;
    if (selected) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  return <dialog ref={dialog} className={`project-dossier game-terminal rc-terminal${isProfile ? " cp-terminal" : ""}${isStudio ? " gs-terminal" : ""}${isPolis ? " pc-terminal" : ""}${isClient ? " bp-terminal" : ""}${isAgent ? " sf-terminal" : ""}${isContact ? " ct-terminal" : ""}`} aria-labelledby="city-terminal-title"
    style={{ "--terminal-color": place?.color ?? "#71e4ea" } as CSSProperties}
    onCancel={onClose} onClose={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="terminal-shell">
      <header className="dossier-header">
        <div><span>{isProfile ? "个人终端 / CHARACTER PROFILE" : isStudio ? "TRAVELER PLAZA / GUILD ARCHIVE" : isPolis ? "POLISSH TOWER / CHAPTER ARCHIVE" : isClient ? "PARTNER HOUSE / 合作终端" : isAgent ? "AGENT STUDIO / SYSTEM FILE" : `区域 ${code} / ${place?.district ?? ""}`}</span><h2 ref={heading} tabIndex={-1} id="city-terminal-title">{isProfile ? "角色档案" : isStudio ? "关于我的工作室。" : isAgent ? "Sugar Agent · 系统档案" : place?.label}</h2></div>
        <div className="rc-terminal-controls">{isProfile && <small className="cp-profile-id">PROFILE ID <b>{characterProfile.id}</b></small>}
          <button type="button" onClick={onClose} aria-label="关闭内容，返回城市">{isProfile ? "关闭档案" : "返回城市"} <span aria-hidden="true">×</span></button>
        </div>
      </header>
      {isProfile ? <CharacterProfile onNavigate={onNavigate} onClose={onClose} /> : content && <ProjectDetail card={content} onNavigate={onNavigate} onClose={onClose} />}
      {isContact && <ContactTerminal />}
    </div>
  </dialog>;
}
