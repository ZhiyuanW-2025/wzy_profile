import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import sharp from "sharp";

const source = await readFile(new URL("../content/reference-city.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { referenceCity: city } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("new city keeps all six unique entrances inside the reference artwork", () => {
  assert.equal(new Set(city.entrances.map(p => p.id)).size, 6);
  for (const p of city.entrances) {
    const [x,y,w,h] = p.box;
    assert.ok(x >= 0 && y >= 0 && w > 44 && h > 44);
    assert.ok(x + w <= city.width && y + h <= city.height);
  }
});

test("cars, pedestrians and boats have separate configured routes and positive speeds", () => {
  for (const routes of [city.traffic, city.walks, city.boats]) {
    assert.ok(routes.length > 0);
    for (const path of routes) {
      assert.ok(path.speed > 0 && path.count > 0 && path.points.length > 1);
      for (const point of path.points) assert.ok(point.every(Number.isFinite));
    }
  }
  assert.ok(city.waterPolygons.length > 0 && city.occluders.length > 0);
});

test("production art exists locally and sprite atlas has actual transparency", async () => {
  const image = await sharp(new URL(`../public${city.environment}`, import.meta.url).pathname).metadata();
  assert.ok(Math.abs(image.width/image.height - city.width/city.height) < 0.002);
  const atlas = sharp(new URL(`../public${city.sprites}`, import.meta.url).pathname);
  const metadata = await atlas.metadata();
  assert.equal(metadata.width, 1254);
  assert.equal(metadata.hasAlpha, true);
  const { data } = await atlas.raw().toBuffer({ resolveWithObject: true });
  assert.equal(data[3], 0, "atlas corner must be transparent, not a painted checkerboard");
});

test("facade lights stay within the scene and use bounded local regions", () => {
  assert.ok(city.lighting.signs.length > 0 && city.lighting.signs.length <= 6);
  for (const sign of city.lighting.signs) {
    assert.ok(sign.points.length >= 3);
    for (const [x,y] of sign.points) assert.ok(x >= 0 && y >= 0 && x <= city.width && y <= city.height);
  }
  for (const [x,y,w,h] of city.lighting.windows) assert.ok(x >= 0 && y >= 0 && x+w <= city.width && y+h <= city.height && w <= 10 && h <= 10);
  assert.equal(city.player.name, "吴致远");
});

test("all reference pixels outside the moving-actor cleanup patches are unchanged", async () => {
  const base=new URL('../public/city-v3/',import.meta.url);
  const original=await sharp(new URL('reference-core.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const edited=await sharp(new URL('island-core.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const patches=[[42,553,119,73],[126,650,229,147],[516,733,111,84],[1095,722,78,71],[1178,784,79,76],[1457,600,114,61],[240,236,27,46],[650,482,17,33],[716,481,17,33]];
  let changed=0,unexpected=0;
  for(let y=0;y<city.height;y++) for(let x=0;x<city.width;x++) {
    const i=(y*city.width+x)*4;
    if(original[i]===edited[i]&&original[i+1]===edited[i+1]&&original[i+2]===edited[i+2]) continue;
    changed++;
    if(!patches.some(([px,py,w,h])=>x>=px&&x<px+w&&y+70>=py&&y+70<py+h)) unexpected++;
  }
  assert.ok(changed>0);
  assert.equal(unexpected,0,'Architecture, signs and unedited scenery must preserve source pixels');
  const ship=await sharp(new URL('shanghai-ferry.png',base).pathname).metadata();
  assert.equal(ship.hasAlpha,true);
});

test("campus label edit changes no unrelated architecture or scenery", async () => {
  const base=new URL('../public/city-v3/',import.meta.url);
  const before=await sharp(new URL('island-core.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const after=await sharp(new URL('island-core-v2.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const mutable=[[252,460,238,42],[308,495,85,40]];
  let changed=0,unexpected=0;
  for(let y=0;y<city.height;y++) for(let x=0;x<city.width;x++) {
    const i=(y*city.width+x)*4;
    if(before[i]===after[i]&&before[i+1]===after[i+1]&&before[i+2]===after[i+2]) continue;
    changed++;
    if(!mutable.some(([px,py,w,h])=>x>=px&&x<px+w&&y>=py&&y<py+h)) unexpected++;
  }
  assert.ok(changed>0);assert.equal(unexpected,0);
  assert.equal(city.campusSign,"关于我的工作室");
});

test("visitor art changes only requested signs and removed plaques", async () => {
  const base=new URL('../public/city-v3/',import.meta.url);
  const before=await sharp(new URL('island-core-v2.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const after=await sharp(new URL('island-core-v3.webp',base).pathname).ensureAlpha().raw().toBuffer();
  const mutable=[[245,26,140,34],[1464,763,196,43],[251,459,239,42],[1353,648,146,49],[918,204,250,40]];
  let changed=0,unexpected=0;
  for(let y=0;y<city.height;y++) for(let x=0;x<city.width;x++) {
    const i=(y*city.width+x)*4;
    if(before[i]===after[i]&&before[i+1]===after[i+1]&&before[i+2]===after[i+2]) continue;
    changed++;
    if(!mutable.some(([px,py,w,h])=>x>=px&&x<px+w&&y>=py&&y<py+h)) unexpected++;
  }
  assert.ok(changed>0);assert.equal(unexpected,0);
});

test("outer world fills the configured camera bounds and fog has real transparency", async () => {
  const world=await sharp(new URL(`../public${city.outskirts}`,import.meta.url).pathname).metadata();
  assert.equal(world.width,city.world.width);assert.equal(world.height,city.world.height);
  const fog=sharp(new URL(`../public${city.arrival.cloud}`,import.meta.url).pathname);
  assert.equal((await fog.metadata()).hasAlpha,true);
  const {data}=await fog.ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let transparent=0,opaque=0;
  for(let i=3;i<data.length;i+=4) { if(data[i]<10) transparent++;if(data[i]>240) opaque++; }
  assert.ok(transparent>100,'Clouds need a transparent outer silhouette');
  assert.ok(opaque>100,'Cloud centers must hide the city during arrival');
});
