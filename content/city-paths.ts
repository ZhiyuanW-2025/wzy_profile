export type Point = readonly [number, number];

export function routeLength(points: readonly Point[]) {
  return points.slice(1).reduce((total, b, i) => total + Math.hypot(b[0] - points[i][0], b[1] - points[i][1]), 0);
}

/** Arc-length sampling keeps actors at a constant speed through street bends. */
export function routePosition(points: readonly Point[], distance: number, offset = 0) {
  const length = routeLength(points);
  let remaining = ((distance % length) + length) % length;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const dx = b[0] - a[0], dy = b[1] - a[1], segment = Math.hypot(dx, dy);
    if (remaining <= segment || i === points.length - 1) {
      const fraction = remaining / segment;
      return { x: a[0] + dx * fraction - dy / segment * offset, y: a[1] + dy * fraction + dx / segment * offset, angle: Math.atan2(dy, dx) };
    }
    remaining -= segment;
  }
  return { x: points[0][0], y: points[0][1], angle: 0 };
}

/** Shared by visible sprites and their optional information hit targets. */
export function patrolPosition(path: {points: readonly Point[]; speed: number; offset?: number}, time: number, phase = 0) {
  const length=routeLength(path.points),travel=length/path.speed,hold=2;
  const local=(time+phase*travel)%(travel*2+hold*2),reverse=local>=travel+hold;
  const distance=reverse ? Math.max(0,length-(local-travel-hold)*path.speed) : Math.min(length,local*path.speed);
  return {...routePosition(path.points,Math.min(length-0.001,distance),path.offset ? (reverse ? -path.offset : path.offset) : 0),reverse,waiting:local>travel&&local<travel+hold||local>travel*2+hold};
}

export function helicopterPosition(time: number, width: number) {
  // A continuous in-city patrol: never wrap/teleport beyond the world edge.
  // The persistent invitation shares this position and has room at both ends.
  const phase = (time + 17) / 90 * Math.PI * 2;
  return { x: width / 2 - (width / 2 - 210) * Math.cos(phase), y: 142 + Math.sin(phase * 2) * 16 };
}

export function boatPosition(path: {points: readonly Point[]; speed: number; offset?: number}, index: number, time: number) {
  const p=patrolPosition(path,time,index ? 0.45 : 0.35);
  return {...p,y:p.y+(index ? Math.sin(time*1.2)*.6 : 0)};
}
