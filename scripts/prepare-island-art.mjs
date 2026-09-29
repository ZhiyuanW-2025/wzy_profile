import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const [reference, cleanup, outskirts, ferry] = process.argv.slice(2);
if (!reference || !cleanup || !outskirts) throw new Error("Usage: node scripts/prepare-island-art.mjs reference.png cleanup.png outskirts.png");
const output = resolve("public/city-v3");
await mkdir(output, {recursive:true});
// Preserve the user's pixels, not an AI reinterpretation of the architecture.
// Only these mutable actor patches come from the generated removal-only plate.
export const actorPatches = [
  [42,553,119,73], [126,650,229,147], [516,733,111,84],
  [1095,722,78,71], [1178,784,79,76], [1457,600,114,61],
  [240,236,27,46], [650,482,17,33], [716,481,17,33],
];
const clean=await sharp(cleanup).resize(1672,941,{fit:"fill"}).png().toBuffer();
const patches=await Promise.all(actorPatches.map(async ([left,top,width,height])=>({
  input:await sharp(clean).extract({left,top,width,height}).png().toBuffer(),left,top,
})));
const original=await sharp(reference).resize(1672,941,{fit:"fill"}).png().toBuffer();
const edited=await sharp(original).composite(patches).png().toBuffer();
await sharp(edited).extract({left:0,top:70,width:1672,height:812}).webp({lossless:true}).toFile(resolve(output,"island-core.webp"));
await mkdir(resolve("outputs"),{recursive:true});
await sharp(edited).extract({left:0,top:70,width:1672,height:812}).extend({left:360,right:360,top:240,bottom:240,background:'#020e21'}).png().toFile(resolve("outputs/island-outpaint-input.png"));
await sharp(original).extract({left:0,top:70,width:1672,height:812}).webp({lossless:true}).toFile(resolve(output,"reference-core.webp"));
await sharp(outskirts).webp({quality:94,effort:6}).toFile(resolve(output,"island-world.webp"));
if (ferry) await sharp(ferry).trim().resize({width:800}).png().toFile(resolve(output,"shanghai-ferry.png"));
console.log("Prepared exact reference core, local actor cleanup patches and atmospheric outskirts.");
