export type Camera = { x: number; y: number; scale: number };
export type ViewSize = { width: number; height: number };
export type MapSize = { width: number; height: number; coreX: number; coreY: number; coreWidth: number; coreHeight: number };
export const DRAG_THRESHOLD = 6;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function cameraBounds(view: ViewSize, world: MapSize, scale: number) {
  return { minX: Math.min(0, view.width-world.width*scale), maxX: 0, minY: Math.min(0, view.height-world.height*scale), maxY: 0 };
}
export function clampCamera(camera: Camera, view: ViewSize, world: MapSize): Camera {
  const b = cameraBounds(view, world, camera.scale);
  return { ...camera, x: clamp(camera.x,b.minX,b.maxX), y: clamp(camera.y,b.minY,b.maxY) };
}
export function homeCamera(view: ViewSize, world: MapSize): Camera {
  const mobile = view.width <= 760;
  const fit = mobile ? 0.75 : Math.min(view.width/world.coreWidth, Math.max(100,view.height-180)/world.coreHeight);
  const scale = Math.max(fit, (view.width+1)/world.width, (view.height+80)/world.height);
  const x = mobile ? view.width/2 - (world.coreX+270)*scale : view.width/2 - (world.coreX+world.coreWidth/2)*scale;
  const y = view.height/2+24 - (world.coreY+world.coreHeight/2)*scale;
  return clampCamera({x,y,scale},view,world);
}
export function dragCamera(camera: Camera, dx: number, dy: number, view: ViewSize, world: MapSize): Camera {
  const b = cameraBounds(view,world,camera.scale);
  const resisted = (value: number, delta: number, min: number, max: number) => {
    const remaining = delta < 0 ? value-min : max-value;
    return clamp(value + delta*(0.3+0.7*Math.min(1,remaining/56)),min,max);
  };
  return { ...camera, x: resisted(camera.x,dx,b.minX,b.maxX), y: resisted(camera.y,dy,b.minY,b.maxY) };
}
export function isMapDrag(dx: number, dy: number) { return Math.hypot(dx,dy) >= DRAG_THRESHOLD; }
export function cameraEdge(camera: Camera, view: ViewSize, world: MapSize) {
  const b = cameraBounds(view,world,camera.scale);
  if (camera.x-b.minX < 5) return "东侧海域 · 地图边缘";
  if (b.maxX-camera.x < 5) return "西侧海域 · 地图边缘";
  if (camera.y-b.minY < 5) return "南侧海域 · 地图边缘";
  if (b.maxY-camera.y < 5) return "北侧远景 · 地图边缘";
  return "";
}
