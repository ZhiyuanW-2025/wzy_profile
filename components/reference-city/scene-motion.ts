import { referenceCity as city } from "@/content/reference-city";
import { routeLength, routePosition, patrolPosition, helicopterPosition, boatPosition } from "@/content/city-paths";
import { type CityVisitorActor } from "@/content/city-visitor";
import { visitorPose } from "./visitor-motion";

type Pen = CanvasRenderingContext2D;
type Crop = readonly [number, number, number, number];
// Exact alpha bounds in the original 1254px RGBA atlas; no destructive cropping.
export const spriteFrames: readonly Crop[] = [
  [30,99,262,141], [333,92,267,150], [702,84,163,179], [1012,75,170,183],
  [101,372,113,200], [424,371,84,209], [735,370,109,201], [1057,369,85,209],
  [12,681,287,191], [325,678,290,194], [643,718,276,131], [959,716,280,138],
  [15,1003,278,162], [326,993,288,174], [650,990,274,183], [949,988,287,186],
];

function sprite(c: Pen, atlas: HTMLImageElement, index: number, x: number, y: number, width: number, angle = 0, flip = false) {
  const [sx, sy, sw, sh] = spriteFrames[index], height = width * sh / sw;
  c.save(); c.translate(x, y); c.rotate(angle); c.scale(flip ? -1 : 1, 1);
  c.drawImage(atlas, sx, sy, sw, sh, -width / 2, -height / 2, width, height);
  c.restore();
}

function water(c: Pen, environment: HTMLImageElement, time: number) {
  c.save();
  c.beginPath();
  city.waterPolygons.slice(0,1).forEach(points => {
    points.forEach(([x,y], i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
    c.closePath();
  });
  c.clip();
  const sx = environment.naturalWidth / city.width, sy = environment.naturalHeight / city.height;
  // Refract the actual painted neon reflections, in shallow horizontal wave bands.
  // Buildings, embankments and bridges are outside the water masks.
  for (let y = 0; y < city.height; y += 3) {
    const shift = Math.sin(time * 1.05 + y * 0.052) * 1.8 + Math.sin(time * 0.67 - y * 0.021) * 0.8;
    const sourceX = Math.max(0, -shift);
    c.drawImage(environment, sourceX * sx, y * sy, (city.width - Math.abs(shift)) * sx, Math.min(3, city.height-y) * sy,
      Math.max(0, shift), y, city.width - Math.abs(shift), Math.min(3,city.height-y));
  }
  // Small highlight changes follow the same coherent wave field rather than random flicker.
  c.globalCompositeOperation = "screen";
  for (let i = 0; i < 160; i++) {
    const x = (i * 89.7) % city.width, y = (i * 71.3) % city.height;
    const wave = Math.sin(time * 1.3 + i * 0.62);
    c.globalAlpha = 0.04 + (wave + 1) * 0.045;
    c.fillStyle = i % 3 ? "#33b9f2" : "#fc71df";
    c.fillRect(x + wave * 4, y, 5 + (wave + 1) * 5, 1);
  }
  c.restore();
  // Subtract the UNION of protected land, skyline and bridge masks. Subtracting
  // once avoids the overlap holes that even-odd clipping would introduce.
  c.save(); c.globalCompositeOperation="destination-out"; c.fillStyle="#000";
  city.waterPolygons.slice(1).forEach(points => {
    c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.closePath(); c.fill();
  });
  c.restore();
}

function cars(c: Pen, atlas: HTMLImageElement, time: number) {
  city.traffic.forEach((path, k) => {
    const length = routeLength(path.points);
    for (let i = 0; i < path.count; i++) {
      const reverse = i % 2 === 1;
      const distance = time * path.speed * (reverse ? -1 : 1) + (i + 0.4) / path.count * length;
      const p = routePosition(path.points, distance, (path.offset ?? 8) * (reverse ? -1 : 1));
      // End fades hide route restarts in junctions / covered road ends.
      const normalized = ((distance % length) + length) % length;
      c.save(); c.globalAlpha = Math.min(1, normalized / 24, (length - normalized) / 24);
      const vertical = Math.abs(Math.sin(p.angle)) > 0.7;
      const index = vertical ? (reverse ? 3 : 2) : (reverse ? 1 : 0);
      const angle = vertical ? p.angle - Math.PI / 2 : p.angle;
      const bus = k === 0 && i === 2;
      c.fillStyle = "#01092170";
      c.beginPath(); c.ellipse(p.x + 2, p.y + 6, vertical ? 7 : 13, 4, 0, 0, Math.PI*2); c.fill();
      sprite(c, atlas, bus ? 14 : index, p.x, p.y, vertical ? 10 : bus ? 25 : 19, angle);
      c.restore();
    }
  });
}

function pedestrians(c: Pen, atlas: HTMLImageElement, time: number) {
  city.walks.forEach((path, k) => {
    for (let i = 0; i < path.count; i++) {
      const actor = patrolPosition(path, time, i * 0.47 + k * 0.2);
      const frame = actor.waiting ? 1 : Math.floor(time * 5 + i) % 4;
      const source = spriteFrames[4 + frame];
      const height = 11 + (i % 3), width = height * source[2] / source[3];
      c.fillStyle = "#01091d60";
      c.fillRect(actor.x - 4, actor.y + 3, 9, 2);
      sprite(c, atlas, 4 + frame, actor.x, actor.y - height / 2 + 4, width, 0, actor.reverse);
    }
  });
}

function boats(c: Pen, atlas: HTMLImageElement, ferry: HTMLImageElement, time: number) {
  city.boats.forEach((path, i) => {
    const p = boatPosition(path, i, time);
    const heading = p.reverse ? p.angle + Math.PI : p.angle;
    const left = Math.cos(heading) < 0;
    const tilt = Math.max(-0.25, Math.min(0.25, left ? heading - Math.PI : heading));
    // Moving wakes are behind the sprite, never baked into the scene.
    c.save();
    for (let j = 1; j < 13; j++) {
      c.globalAlpha = (1 - j/13) * 0.23;
      c.strokeStyle = i ? "#72c9f8" : "#de91ed";
      c.lineWidth = 1;
      const x = p.x - Math.cos(heading) * (j*4 + 21), y = p.y - Math.sin(heading) * (j*4 + 21);
      c.beginPath(); c.ellipse(x, y+8, 4+j*0.45, 1.5+j*0.12, tilt, 0, Math.PI); c.stroke();
    }
    c.restore();
    if (i===0) {
      const width=195, height=width*ferry.naturalHeight/ferry.naturalWidth;
      c.save();c.translate(p.x,p.y);c.rotate(tilt*.3);
      // Never mirror the SHANGHAI lettering when the ship changes direction.
      c.drawImage(ferry,-width/2,-height+19,width,height);c.restore();
    } else sprite(c, atlas, 10+(left ? 1 : 0), p.x, p.y, i===1 ? 61 : 49, tilt);
  });
}

function helicopter(c: Pen, atlas: HTMLImageElement, time: number) {
  const {x,y} = helicopterPosition(time,city.width);
  c.save();
  c.globalAlpha = 0.18;
  c.fillStyle = "#020817";
  c.beginPath(); c.ellipse(x + 29, y + 108, 27, 7, 0.15, 0, Math.PI * 2); c.fill();
  c.restore();
  sprite(c, atlas, 12, x, y, 75);
  const phase = (time+17) * 18, centerX = x - 1, centerY = y - 22;
  c.save();
  c.lineWidth = 1.6;
  for (let i = 0; i < 2; i++) {
    const angle = phase + i * Math.PI / 2;
    const dx = Math.cos(angle) * 41, dy = Math.sin(angle) * 8;
    c.strokeStyle = i ? "#64b9d2b0" : "#b5e5f0cf";
    c.beginPath(); c.moveTo(centerX-dx,centerY-dy); c.lineTo(centerX+dx,centerY+dy); c.stroke();
  }
  c.restore();
}

function facadeLights(c: Pen, time: number) {
  c.save();
  c.globalCompositeOperation = "screen";
  city.lighting.signs.forEach(sign => {
    // Slow, low-amplitude neon breathing. No strobe or random frame-to-frame flicker.
    c.globalAlpha = 0.025 + (Math.sin(time * 0.65 + sign.phase) + 1) * 0.02;
    c.fillStyle = sign.color;
    c.beginPath();
    sign.points.forEach(([x,y], i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
    c.closePath(); c.fill();
  });
  c.globalCompositeOperation = "source-over";
  city.lighting.windows.forEach(([x,y,w,h], i) => {
    const brightness = (Math.sin(time * 0.24 + i * 1.7) + 1) / 2;
    c.globalAlpha = 0.15 + Math.abs(brightness - 0.5) * 0.7;
    c.fillStyle = brightness > 0.5 ? "#ffe4a1" : "#0a1e3d";
    c.fillRect(x,y,w,h);
  });
  c.globalAlpha = 1;
  city.lighting.signals.forEach(([x,y], i) => {
    const phase = (time + i * 12) % 28;
    const active = phase < 12 ? 2 : phase < 14 ? 1 : 0;
    c.fillStyle = "#061323"; c.fillRect(x-2,y-10,5,12); c.fillRect(x,y+2,1,9);
    ["#ff637b", "#ffce76", "#67f4cb"].forEach((color, light) => {
      c.globalAlpha = active === light ? 0.95 : 0.15;
      c.fillStyle = color; c.fillRect(x-1,y-8+light*3,3,2);
    });
    c.globalAlpha = 1;
  });
  c.restore();
}

function visitor(c: Pen, atlas: HTMLImageElement, actor: CityVisitorActor, time: number) {
  const p = visitorPose(actor, time);
  c.save(); c.translate(Math.round(p.x), Math.round(p.y));
  c.fillStyle = "#75efde50";
  if (p.phase !== "parachuting") c.fillRect(-9, 2, 18, 3);
  if (p.canopy > 0) {
    c.save(); c.scale(p.canopy, p.canopy);
    // Stepped canopy and suspension cords, aligned to the sprite's pixel grid.
    c.fillStyle = "#8af5ee";
    c.beginPath();
    const dome = [[-28,-44],[-28,-53],[-24,-53],[-24,-59],[-18,-59],[-18,-64],[-10,-64],[-10,-68],[10,-68],[10,-64],[18,-64],[18,-59],[24,-59],[24,-53],[28,-53],[28,-44]];
    dome.forEach(([x,y], i) => i ? c.lineTo(x,y) : c.moveTo(x,y)); c.closePath(); c.fill();
    c.strokeStyle = "#29577b"; c.lineWidth = 2; c.stroke();
    c.fillStyle = "#cf9bff"; c.fillRect(-6,-67,12,22); c.fillRect(-20,-57,6,12); c.fillRect(14,-57,6,12);
    c.fillStyle = "#419fba"; c.fillRect(-27,-46,13,3); c.fillRect(-6,-46,12,3); c.fillRect(14,-46,13,3);
    c.strokeStyle = "#bafafa"; c.lineWidth = 1;
    c.beginPath(); c.moveTo(-26,-42); c.lineTo(-4,-13); c.moveTo(26,-42); c.lineTo(4,-13);
    c.moveTo(-8,-42); c.lineTo(-2,-13); c.moveTo(9,-42); c.lineTo(2,-13); c.stroke();
    c.restore();
  }
  const index = p.phase === "walking" ? 4 + Math.floor(time * 6) % 4 : 5;
  const frame = spriteFrames[index];
  sprite(c, atlas, index, 0, -7, 17 * frame[2] / frame[3], 0, p.reverse);
  const tagX = p.phase === "parachuting" ? 17 : -12;
  const tagY = p.phase === "parachuting" ? -23 : -35;
  c.fillStyle = "#081b36ed"; c.fillRect(tagX, tagY, 24, 21);
  c.strokeStyle = "#83e5ed"; c.lineWidth = 1; c.strokeRect(tagX-.5, tagY-.5, 25, 22);
  c.font = "15px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
  c.fillText(actor.emoji, tagX+12, tagY+10);
  c.restore();
}

export function drawCityMotion(c: Pen, environment: HTMLImageElement, atlas: HTMLImageElement, ferry: HTMLImageElement, time: number, visitors: readonly CityVisitorActor[] = []) {
  c.clearRect(0, 0, city.width, city.height);
  water(c, environment, time);
  boats(c, atlas, ferry, time);
  cars(c, atlas, time);
  pedestrians(c, atlas, time);
  visitors.filter(actor => visitorPose(actor, time).phase !== "parachuting").forEach(actor => visitor(c, atlas, actor, time));
  c.save();
  c.beginPath();
  city.occluders.forEach(points => {
    points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
    c.closePath();
  });
  c.clip();
  c.drawImage(environment, 0, 0, city.width, city.height);
  c.restore();
  facadeLights(c, time);
  helicopter(c, atlas, time);
  visitors.filter(actor => visitorPose(actor, time).phase === "parachuting").forEach(actor => visitor(c, atlas, actor, time));
}
