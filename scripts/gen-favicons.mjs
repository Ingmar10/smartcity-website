// Rasterizes the SVG app icons into a favicon set:
//   app/apple-icon.png  (180x180, SmartCity — auto-used as apple-touch-icon)
//   app/favicon.ico     (32x32 PNG wrapped in an ICO container — legacy tab icon)
// Run:  node scripts/gen-favicons.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svg = await readFile(path.join(root, "app", "icon.svg"));

// 180x180 apple touch icon
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(path.join(root, "app", "apple-icon.png"));

// 32x32 PNG → wrap in a minimal ICO container (ICO supports embedded PNG)
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const ico = pngToIco(png32, 32);
await writeFile(path.join(root, "app", "favicon.ico"), ico);

console.log("Favicons written: apple-icon.png, favicon.ico");

// Minimal single-image ICO (PNG payload) writer.
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // size of image data
  entry.writeUInt32LE(6 + 16, 12); // offset to image data

  return Buffer.concat([header, entry, pngBuffer]);
}
