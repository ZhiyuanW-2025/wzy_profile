import sharp from "sharp";

// Local imagegen edits are composited only inside these explicit rectangles.
// The rest of the existing map remains byte-identical after lossless decoding.
const [plaques, campus, contact, partners, moon] = process.argv.slice(2);
if (!moon) throw new Error("Usage: node scripts/prepare-visitor-art.mjs plaques.png campus.png contact.png partners.png moon.png");
const base = "public/city-v3/";
const removal = await sharp(plaques).trim({ background: "#000000", threshold: 0 }).resize(1672, 812, { fit: "fill" }).png().toBuffer();
const crop = async (input, left, top, width, height) => sharp(input).extract({ left, top, width, height }).png().toBuffer();
const campusArt = await sharp(campus).resize(286, 100, { fit: "fill" }).png().toBuffer();
const contactArt = await sharp(contact).resize(172, 78, { fit: "fill" }).png().toBuffer();
// The edit model letterboxed this especially wide sign; remove the white matte.
const partnerArt = await sharp(partners).trim({ background: "#ffffff", threshold: 18 }).resize(268, 56, { fit: "fill" }).png().toBuffer();
const patches = [
  { left: 245, top: 26, input: await crop(removal, 245, 26, 140, 34) },
  { left: 1464, top: 763, input: await crop(removal, 1464, 763, 196, 43) },
  { left: 251, top: 459, input: await crop(campusArt, 16, 11, 239, 42) },
  { left: 1353, top: 648, input: await crop(contactArt, 9, 10, 146, 49) },
  { left: 918, top: 204, input: await crop(partnerArt, 9, 9, 250, 40) },
];
await sharp(`${base}island-core-v2.webp`).composite(patches).webp({ lossless: true }).toFile(`${base}island-core-v3.webp`);

// Feather only the moon repair into the surrounding night sky.
const width = 175, height = 170;
const moonArt = await sharp(moon).resize(width, height, { fit: "fill" }).ensureAlpha().raw().toBuffer();
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  moonArt[(y * width + x) * 4 + 3] = Math.round(255 * Math.min(1, Math.min(x, y, width - 1 - x, height - 1 - y) / 18));
}
const moonPatch = await sharp(moonArt, { raw: { width, height, channels: 4 } }).png().toBuffer();
await sharp(`${base}island-world-v2.webp`).composite([
  ...patches.map(patch => ({ ...patch, left: patch.left + 360, top: patch.top + 240 })),
  { left: 2070, top: 40, input: moonPatch },
]).webp({ lossless: true }).toFile(`${base}island-world-v3.webp`);
console.log("Prepared local sign/plaque/moon patches; all other map pixels preserved.");
