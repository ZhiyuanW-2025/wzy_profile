import { cityVisitor as config, type CityVisitorActor } from "@/content/city-visitor";
import { routeLength, routePosition } from "@/content/city-paths";

export function visitorPose(actor: CityVisitorActor, time: number) {
  const age = Math.max(0, time - actor.startedAt);
  const [dx, dy] = config.dock;
  if (actor.reduced) return { x: dx, y: dy, phase: "landed" as const, canopy: 0, reverse: false };
  if (age < config.dropDuration) {
    const t = age / config.dropDuration;
    const ease = t * t * (3 - 2 * t);
    return {
      x: actor.origin.x + (dx - actor.origin.x) * ease + Math.sin(t * Math.PI * 4) * 7 * Math.sin(t * Math.PI),
      y: actor.origin.y + (dy - actor.origin.y) * t,
      phase: "parachuting" as const, canopy: Math.min(1, age / .65), reverse: false,
    };
  }
  if (age < config.dropDuration + config.landingDuration) return {
    x: dx, y: dy, phase: "landed" as const,
    canopy: Math.max(0, 1 - (age - config.dropDuration) / .65), reverse: false,
  };
  // Continuous there-and-back patrol; no teleport from the end of the road.
  const distance = (age - config.dropDuration - config.landingDuration) * config.walkSpeed;
  const length = routeLength(config.walk);
  const progress = distance % (length * 2), reverse = progress > length;
  const p = routePosition(config.walk, Math.min(length - .001, reverse ? 2 * length - progress : progress));
  return { x: p.x, y: p.y, phase: "walking" as const, canopy: 0, reverse };
}
