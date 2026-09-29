"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent, type KeyboardEvent } from "react";
import { referenceCity as city } from "@/content/reference-city";
import { homeCamera, clampCamera, dragCamera, cameraEdge, isMapDrag, type Camera, type ViewSize } from "@/content/city-camera";

const size = { ...city.world, coreWidth: city.width, coreHeight: city.height };
type Gesture = { id: number; startX: number; startY: number; lastX: number; lastY: number; dragged: boolean };

/** No scroll offsets and no momentum/recentering on release. The camera is the
 * only moving layer; pointer capture starts after click slop is exceeded. */
export function useCityCamera(reduced: boolean, onDragStart: () => void) {
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const view = useRef<ViewSize>({width:0,height:0});
  const current = useRef<Camera>({x:0,y:0,scale:1});
  const target = useRef<Camera>({x:0,y:0,scale:1});
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);
  const initialized = useRef(false);
  const suppressClick = useRef(false);
  const startCallback = useRef(onDragStart);
  const reducedRef = useRef(reduced);
  const [dragging,setDragging] = useState(false);
  const [edge,setEdge] = useState("");
  useEffect(() => { startCallback.current=onDragStart; reducedRef.current=reduced; },[onDragStart,reduced]);

  const paint = useCallback(() => {
    const node=world.current, p=current.current;
    if (!node) return;
    node.style.transform=`translate3d(${p.x}px,${p.y}px,0) scale(${p.scale})`;
    node.dataset.cameraX=p.x.toFixed(3); node.dataset.cameraY=p.y.toFixed(3);
    node.dataset.scale=p.scale.toFixed(5);
    node.style.setProperty("--map-scale",String(p.scale));
    node.dataset.ready="true";
    setEdge(cameraEdge(p,view.current,size));
  },[]);
  const move = useCallback((next: Camera, immediate=false) => {
    target.current=clampCamera(next,view.current,size);
    cancelAnimationFrame(frame.current);
    if (immediate || reducedRef.current) { current.current=target.current; paint(); return; }
    let previous=performance.now();
    const tick=(now:number) => {
      const alpha=1-Math.exp(-Math.min(50,now-previous)/24); previous=now;
      const c=current.current,t=target.current;
      current.current={x:c.x+(t.x-c.x)*alpha,y:c.y+(t.y-c.y)*alpha,scale:t.scale};
      if (Math.hypot(t.x-current.current.x,t.y-current.current.y)<0.15) { current.current=t; paint(); return; }
      paint(); frame.current=requestAnimationFrame(tick);
    };
    frame.current=requestAnimationFrame(tick);
  },[paint]);

  useEffect(() => {
    const node=viewport.current;
    if (!node) return;
    const resize=() => {
      const rect=node.getBoundingClientRect(), old=view.current;
      const next={width:rect.width,height:rect.height};
      if (next.width<=0 || next.height<=0) return;
      const home=homeCamera(next,size);
      const before=current.current;
      const center={x:(old.width/2-before.x)/before.scale,y:(old.height/2-before.y)/before.scale};
      view.current=next;
      move(initialized.current ? {x:next.width/2-center.x*home.scale,y:next.height/2-center.y*home.scale,scale:home.scale} : home,true);
      initialized.current=true;
    };
    const observer=new ResizeObserver(resize); observer.observe(node); resize();
    const wheel=(event:WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return; // Keep browser zoom accessible.
      event.preventDefault();
      const factor=event.deltaMode===1 ? 16 : event.deltaMode===2 ? view.current.height : 1;
      const dx=(event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX)*factor;
      const dy=(event.shiftKey && !event.deltaX ? 0 : event.deltaY)*factor;
      move(dragCamera(target.current,-dx,-dy,view.current,size));
    };
    node.addEventListener("wheel",wheel,{passive:false});
    const releaseUncaptured=() => { if(gesture.current && !gesture.current.dragged) gesture.current=null; };
    const cancel=() => {
      if(!gesture.current) return;
      gesture.current=null; setDragging(false); cancelAnimationFrame(frame.current); target.current=current.current;
    };
    window.addEventListener("pointerup",releaseUncaptured);
    window.addEventListener("blur",cancel);
    return () => { observer.disconnect(); node.removeEventListener("wheel",wheel); window.removeEventListener("pointerup",releaseUncaptured); window.removeEventListener("blur",cancel); cancelAnimationFrame(frame.current); };
  },[move]);

  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button!==0 || gesture.current) return;
    cancelAnimationFrame(frame.current); target.current=current.current;
    suppressClick.current=false;
    gesture.current={id:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastY:event.clientY,dragged:false};
  };
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>) => {
    const g=gesture.current;
    if (!g || g.id!==event.pointerId) return;
    if (!g.dragged) {
      if (!isMapDrag(event.clientX-g.startX,event.clientY-g.startY)) return;
      g.dragged=true; suppressClick.current=true; setDragging(true); startCallback.current();
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    move(dragCamera(target.current,event.clientX-g.lastX,event.clientY-g.lastY,view.current,size));
    g.lastX=event.clientX;g.lastY=event.clientY;
  };
  const end=(event:ReactPointerEvent<HTMLDivElement>) => {
    const g=gesture.current;
    if (!g || g.id!==event.pointerId) return;
    gesture.current=null; setDragging(false);
    // Commit the last queued pointer delta even when down/move/up arrive in one
    // frame. Then stop: no inertia and no return-to-center animation.
    move(target.current,true);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onClickCapture=(event:MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current && event.detail!==0) { event.preventDefault(); event.stopPropagation(); }
  };
  const reset=useCallback(() => { move(homeCamera(view.current,size)); },[move]);
  const reveal=useCallback((box:readonly number[]) => {
    const [x,y,w,h]=box, c=current.current, v=view.current;
    const left=(size.coreX+x)*c.scale+c.x, top=(size.coreY+y)*c.scale+c.y;
    const right=left+w*c.scale,bottom=top+h*c.scale;
    if (left>=16 && right<=v.width-16 && top>=115 && bottom<=v.height-75) return;
    move({...c,x:v.width/2-(size.coreX+x+w/2)*c.scale,y:v.height/2+24-(size.coreY+y+h/2)*c.scale},true);
  },[move]);
  const onKeyDown=(event:KeyboardEvent<HTMLDivElement>) => {
    if (event.target!==event.currentTarget) return;
    const steps:Record<string,[number,number]>={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]};
    if (event.key==="Home") { event.preventDefault(); reset(); }
    else if (steps[event.key]) { event.preventDefault(); const [x,y]=steps[event.key]; move(dragCamera(target.current,x,y,view.current,size)); }
  };
  return {viewport,world,dragging,edge,reset,reveal,handlers:{onPointerDown,onPointerMove,onPointerUp:end,onPointerCancel:end,onLostPointerCapture:end,onClickCapture,onKeyDown}};
}
