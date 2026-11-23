// Reads the original PNG screenshots from assets-source/ (projects, 1_strony, 2_systemy; kept out of git and out of
// public/) and writes .webp copies to the same path under public/ (max 1600 px wide, quality 78; screenshots of
// phones max 800 px). Their pixel sizes are merged into src/data/projectImageSizes.json (other entries, e.g. the
// case-study captures, are kept), so <img> tags can carry width/height.
// Run: node scripts/optimize-project-images.mjs [file.png ...]   (paths relative to assets-source/, default: all)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const root = process.cwd();
const publicDir = path.join(root, "public");
const sourceDir = path.join(root, "assets-source");
const MAX_WIDTH = 1600;
const MAX_WIDTH_MOBILE = 800; // files named *mobile* / *mobilna*
const QUALITY = 78;
const files = new Set();
for (const name of fs.existsSync(path.join(sourceDir, "projects")) ? fs.readdirSync(path.join(sourceDir, "projects")) : []) {
  if (name.toLowerCase().endsWith(".png")) files.add(`/projects/${name}`);
}
// Screenshots used by /strony/ and /systemy/ (desktop, mobile and the /systemy/ hero).
const walk = (dir) => {
  if (!fs.existsSync(path.join(sourceDir, dir))) return;
  for (const entry of fs.readdirSync(path.join(sourceDir, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.toLowerCase().endsWith(".png")) files.add(`/${rel}`);
  }
};
walk("1_strony");
walk("2_systemy");
// Any other PNG referenced from the projects data (e.g. /2_systemy/portfolio/...).
const dataSrc = fs.readFileSync(path.join(root, "src/data/projects.js"), "utf8");
for (const m of dataSrc.matchAll(/image:\s*"([^"]+?)(?:\.png|\.webp)"/g)) files.add(`${m[1]}.png`);
// Optional: only the given files (e.g. /projects/x.png)
const only = process.argv.slice(2).map((a) => (a.startsWith("/") ? a : `/${a}`));
if (only.length) for (const f of [...files]) if (!only.includes(f)) files.delete(f);
const sizesPath = path.join(root, "src/data/projectImageSizes.json");
const sizes = fs.existsSync(sizesPath) ? JSON.parse(fs.readFileSync(sizesPath, "utf8")) : {};
let before = 0;
let after = 0;
for (const rel of [...files].sort()) {
  const src = path.join(sourceDir, rel);
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${rel}`);
    continue;
  }
  const out = path.join(publicDir, rel).replace(/\.png$/i, ".webp");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(src)
    .resize({ width: /mobile|mobilna/i.test(rel) ? MAX_WIDTH_MOBILE : MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const webpRel = rel.replace(/\.png$/i, ".webp");
  sizes[webpRel] = { width: info.width, height: info.height };
  before += fs.statSync(src).size;
  after += info.size;
  console.log(`${rel} -> ${webpRel}  ${info.width}x${info.height}  ${(fs.statSync(src).size / 1024) | 0} KB -> ${(info.size / 1024) | 0} KB`);
}
fs.writeFileSync(sizesPath, JSON.stringify(sizes, null, 2) + "\n");
console.log(`total: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);