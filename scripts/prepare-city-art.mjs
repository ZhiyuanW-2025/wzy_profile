// Integration only: copy the generated transparent atlas and compress the unaltered
// environment to WebP. No architecture is redrawn or approximated by this script.
import { mkdir, copyFile } from "node:fs/promises";
import sharp from "sharp";

const [environment, actors] = process.argv.slice(2);
if (!environment || !actors) throw new Error("Usage: node scripts/prepare-city-art.mjs <environment.png> <actors.png>");
const output = new URL("../public/city-v2/", import.meta.url);
await mkdir(output, { recursive: true });
await sharp(environment).webp({ quality: 94, effort: 6 }).toFile(new URL("environment.webp", output).pathname);
await copyFile(actors, new URL("actors.png", output));
console.log("Saved environment.webp and the original transparent actors.png in public/city-v2.");
