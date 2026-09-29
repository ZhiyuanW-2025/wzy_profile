"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { referenceCity as city } from "@/content/reference-city";

/** Foreground atmosphere, independent of the pannable world and fixed HUD.
 * Fresh component state intentionally replays the reveal on every page load. */
export function CityArrival({ ready, reduced, interrupted }: { ready: boolean; reduced: boolean; interrupted: boolean }) {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!ready || finished) return;
    // Fallback also removes the layers in background tabs where animationend
    // can be throttled. Never keep an invisible full-screen compositing layer.
    const timeout = window.setTimeout(() => setFinished(true), 3900);
    return () => window.clearTimeout(timeout);
  }, [ready, finished]);

  if (finished || reduced || interrupted) return null;

  return <div className="rc-arrival" aria-hidden="true" data-revealing={ready}
    style={{ "--arrival-cloud": `url("${city.arrival.cloud}")` } as CSSProperties}
    onAnimationEnd={event => {
      if (event.animationName === "city-arrival-finish") setFinished(true);
    }}>
    <div className="rc-arrival-veil" />
    <div className="rc-cloud-bank rc-cloud-nw" />
    <div className="rc-cloud-bank rc-cloud-ne" />
    <div className="rc-cloud-bank rc-cloud-sw" />
    <div className="rc-cloud-bank rc-cloud-se" />
  </div>;
}
