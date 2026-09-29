import sharp from "sharp";
import { resolve } from "node:path";

// Generated artwork is composited only into the requested mutable areas.
// All coordinates are in the original core / configured world coordinate space.
const [sign, outskirts, cloud] = process.argv.slice(2);
if (!sign || !outskirts || !cloud) throw new Error("Usage: node scripts/prepare-city-arrival.mjs sign.png outskirts.png cloud.png");
const dir = resolve("public/city-v3");
const signCrop = await sharp(sign).resize(272,100,{fit:"fill"}).png().toBuffer();
const patches = [[252,460,238,42],[308,495,85,40]];
await sharp(resolve(dir,"island-core.webp")).composite(await Promise.all(patches.map(async ([left,top,width,height])=>({
  input:await sharp(signCrop).extract({left:left-240,top:top-448,width,height}).png().toBuffer(),left,top,
})))).webp({lossless:true}).toFile(resolve(dir,"island-core-v2.webp"));

// Feather outward, not inward: preserve the old world at the core perimeter,
// gradually introduce the enriched sea / clouds over the outer 100 world pixels.
const width=2392,height=1292;
const mask=Buffer.alloc(width*height*4);
for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
  const distance=Math.hypot(Math.max(360-x,0,x-2032),Math.max(240-y,0,y-1052));
  const t=Math.min(1,distance/100),a=t*t*(3-2*t),i=(y*width+x)*4;
  mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=Math.round(a*255);
}
const edge=await sharp(outskirts).resize(width,height,{fit:"fill"}).ensureAlpha()
  .composite([{input:mask,raw:{width,height,channels:4},blend:"dest-in"}]).png().toBuffer();
await sharp(resolve(dir,"island-world.webp")).resize(width,height,{fit:"fill"})
  .composite([{input:edge}]).webp({quality:95,effort:6}).toFile(resolve(dir,"island-world-v2.webp"));
await sharp(cloud).resize({width:1200,withoutEnlargement:true}).webp({quality:90,alphaQuality:100,effort:6}).toFile(resolve(dir,"arrival-cloud.webp"));
console.log("Prepared localized sign edit, feathered outer-world enrichment and transparent arrival clouds.");
