"use client";

/* eslint-disable @next/next/no-img-element -- native image is shared with the canvas water renderer; no remote image service */
import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import { referenceCity as city, type PlaceId } from "@/content/reference-city";
import { CityTerminal } from "./CityTerminal";
import { CityHud, CityStatus } from "./CityHud";
import { drawCityMotion } from "./scene-motion";
import { useCityCamera } from "./useCityCamera";
import { CityArrival } from "./CityArrival";
import { CityLandmarkSigns } from "./CityLandmarkSigns";
import { HelicopterEntry, VisitorDialog, type VisitorEntryHandle } from "./CityVisitor";
import { type CityVisitorActor } from "@/content/city-visitor";
import { helicopterPosition } from "@/content/city-paths";
import { visitorPose } from "./visitor-motion";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`City asset unavailable: ${src}`));
    image.src = src;
  });
}

export function ReferenceCity() {
  const [selected, setSelected] = useState<PlaceId | null>(null);
  const [hovered, setHovered] = useState<PlaceId | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [arrivalInterrupted, setArrivalInterrupted] = useState(false);
  const [visitorOpen, setVisitorOpen] = useState(false);
  const [helicopterHovered, setHelicopterHovered] = useState(false);
  const [visit, setVisit] = useState<{ emoji: string; demo: boolean } | null>(null);
  const visitorMotion = useRef<VisitorEntryHandle>(null);
  const visitors = useRef<CityVisitorActor[]>([]);
  const visitorStatus = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { viewport: viewportRef, world: worldRef, dragging, edge, reset, reveal, handlers } = useCityCamera(reduced, useCallback(() => { setHovered(null); setHelicopterHovered(false); }, []));
  const indexButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const art = useRef<{ environment: HTMLImageElement; atlas: HTMLImageElement; ferry: HTMLImageElement } | null>(null);
  const clock = useRef(0);
  const active = city.entrances.find(p => p.id === (selected ?? hovered));
  const frozen = paused || reduced || selected !== null || visitorOpen || helicopterHovered;
  const close = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => returnFocus.current?.focus({preventScroll:true}));
  }, []);
  const closeVisitor = useCallback(() => {
    setVisitorOpen(false);
    requestAnimationFrame(() => { visitorMotion.current?.focus(); setHelicopterHovered(false); });
  }, []);

  useEffect(() => {
    if (!indexOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIndexOpen(false); indexButton.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".rc-hud")) setIndexOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", outside); };
  }, [indexOpen]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Decorative fog failure must never block the usable city.
    Promise.all([loadImage(city.environment), loadImage(city.sprites), loadImage(city.ferry), loadImage(city.outskirts), loadImage(city.arrival.cloud).catch(() => null)])
      .then(([environment, atlas, ferry]) => {
        if (cancelled) return;
        art.current = { environment, atlas, ferry };
        setReady(true);
      }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    const assets = art.current;
    if (!ready || !context || !assets) return;
    let frame = 0, last = 0, previous = 0;
    const render = (now: number) => {
      if (previous && !frozen) clock.current += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (!last || now - last >= 1000/24 || frozen) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        drawCityMotion(context, assets.environment, assets.atlas, assets.ferry, clock.current, visitors.current);
        const actor = visitors.current.at(-1), status = visitorStatus.current;
        visitorMotion.current?.update(clock.current);
        if (actor && status) {
          const phase = visitorPose(actor, clock.current).phase;
          if (status.dataset.phase !== phase) {
            status.dataset.phase = phase;
            status.textContent = phase === "parachuting" ? "你的旅客正在降落码头…" : phase === "landed" ? "已抵达码头，欢迎来到城市。" : "你的旅客正在城市街道上散步。";
          }
        }
        last = now;
      }
      if (!frozen && !document.hidden) frame = requestAnimationFrame(render);
    };
    const resume = () => {
      cancelAnimationFrame(frame); previous = 0;
      if (!document.hidden) render(performance.now());
    };
    render(performance.now());
    document.addEventListener("visibilitychange", resume);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", resume); };
  }, [ready, frozen, visit]);

  const arrive = (emoji: string, demo: boolean) => {
    const origin = helicopterPosition(clock.current, city.width);
    visitors.current = [...visitors.current.slice(-2), { id: crypto.randomUUID(), emoji, origin, startedAt: clock.current, reduced }];
    setVisit({ emoji, demo }); setVisitorOpen(false); setHelicopterHovered(false);
    // Return keyboard focus to the world, not the helicopter (which would pause it).
    viewportRef.current?.focus({ preventScroll: true });
  };

  const enter = (id: PlaceId) => {
    returnFocus.current = indexOpen ? indexButton.current : document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected(id); setIndexOpen(false);
  };

  return <main className="reference-city" data-paused={frozen}
    onPointerDownCapture={() => setArrivalInterrupted(true)}
    onWheelCapture={() => setArrivalInterrupted(true)}
    onKeyDownCapture={() => setArrivalInterrupted(true)}>
    <CityHud indexOpen={indexOpen} indexButton={indexButton} onToggleIndex={() => setIndexOpen(value => !value)} onEnter={enter} active={active} />

    <div ref={viewportRef} className="rc-viewport" id="city-map" aria-label="可拖动的像素城市地图，拖动探索；方向键平移，Home 返回主城" tabIndex={0} data-dragging={dragging} {...handlers}>
      <div ref={worldRef} className="rc-world" style={{width:city.world.width,height:city.world.height}}>
        <img className="rc-outskirts" src={city.outskirts} alt="" width={city.world.width} height={city.world.height} draggable={false} fetchPriority="high" />
        <div className="rc-stage" style={{left:city.world.coreX,top:city.world.coreY,width:city.width,height:city.height}}>
        <img className="rc-environment" src={city.environment} width={1672} height={812} alt={`像素岛屿主城：左上关于我小岛；中央${city.campusSign}、PolisSH Tower、Partner House、Agent Studio；右下通讯小岛。`} fetchPriority="high" draggable={false} />
        <canvas ref={canvas} width={city.width} height={city.height} aria-hidden="true" data-motion={frozen ? "paused" : "running"} data-ready={ready} />
        <CityLandmarkSigns />
        <nav className="rc-entrances" aria-label="城市中的六个内容入口">
          {city.entrances.map((place, i) => <div key={place.id} className="rc-place" data-active={!dragging && hovered === place.id}
            style={{ left: `${place.box[0]/city.width*100}%`, top: `${place.box[1]/city.height*100}%`, width: `${place.box[2]/city.width*100}%`, height: `${place.box[3]/city.height*100}%`, "--district-color": place.color, "--district-shape": `polygon(${place.polygon})` } as CSSProperties}>
            <button className="rc-hotspot" type="button"
            aria-label={`进入${place.label}：${place.district}`} aria-haspopup="dialog"
            onClick={() => enter(place.id)} onFocus={event => { setHovered(place.id); if(event.currentTarget.matches(":focus-visible")) reveal(place.box); }} onBlur={() => setHovered(null)}
            onPointerEnter={() => { if(!dragging) setHovered(place.id); }} onPointerLeave={() => setHovered(null)} />
            <svg className="rc-building-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={place.polygon.replaceAll("%", "")} vectorEffect="non-scaling-stroke" /></svg>
            <span className="rc-entry-glow" aria-hidden="true" />
            <span className="rc-hotspot-caption" aria-hidden="true"><small>区域 {String(i+1).padStart(2,"0")} / {place.district}</small><strong>{place.label}</strong><span>点击进入 <i>↗</i></span></span>
          </div>)}
        </nav>
        <HelicopterEntry motionRef={visitorMotion} disabled={dragging || !ready} onReveal={reveal} onHover={setHelicopterHovered}
          onOpen={() => { setVisitorOpen(true); setHovered(null); setIndexOpen(false); }} />
      </div>
      </div>
    </div>

    <CityArrival ready={ready} reduced={reduced} interrupted={arrivalInterrupted || failed} />
    <VisitorDialog open={visitorOpen} onClose={closeVisitor} onArrive={arrive} />
    {visit && <div className="rc-visitor-arrived" role="status"><b aria-hidden="true">{visit.emoji}</b><div>
      <small>{visit.demo ? "本地动效演示 · 留言未发送" : "邮件服务已接受留言"}</small><span ref={visitorStatus}>准备降落…</span>
    </div><button type="button" aria-label="收起旅客状态" onClick={() => setVisit(null)}>×</button></div>}
    <CityStatus active={active} paused={paused} reduced={reduced} onPause={() => setPaused(value => !value)} onReset={reset} edge={edge} dragging={dragging} />
    {!ready && <div className="rc-load-status" role="status">{failed ? <>场景加载失败，<button type="button" onClick={() => window.location.reload()}>重新连接</button></> : "正在点亮城市…"}</div>}
    <CityTerminal selected={selected} onClose={close} onNavigate={setSelected} />
  </main>;
}
