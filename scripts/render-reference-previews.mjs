// Renders the first page of a reference PDF to two WebP previews (a 640 px thumbnail and a 1600 px
// full page) next to the PDF, and prints their sizes (copy them into src/data/references.js).
// Run by hand: node scripts/render-reference-previews.mjs [name]   (default: forum-ekonomiczne-vantaframe)
// Needs one of: pdftoppm (poppler), mutool, or macOS qlmanage — whichever is installed is used.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
const name = process.argv[2] || "forum-ekonomiczne-vantaframe";
const dir = path.join(process.cwd(), "public/referencje");
const pdf = path.join(dir, `${name}.pdf`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "refprev-"));
const png = path.join(tmp, "page.png");
const has = (cmd) => {
  try {
    execFileSync("which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
if (has("pdftoppm")) {
  execFileSync("pdftoppm", ["-png", "-r", "200", "-f", "1", "-l", "1", "-singlefile", pdf, path.join(tmp, "page")]);
} else if (has("mutool")) {
  execFileSync("mutool", ["draw", "-r", "200", "-o", png, pdf, "1"]);
} else if (has("qlmanage")) {
  execFileSync("qlmanage", ["-t", "-s", "2400", "-o", tmp, pdf], { stdio: "ignore" });
  fs.renameSync(path.join(tmp, `${name}.pdf.png`), png);
} else {
  console.error("No PDF renderer found (install poppler: pdftoppm, or mutool).");
  process.exit(1);
}
for (const [suffix, width, quality] of [["thumb", 640, 80], ["page", 1600, 85]]) {
  const out = path.join(dir, `${name}-${suffix}.webp`);
  const info = await sharp(png)
    .flatten({ background: "#ffffff" })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(out);
  console.log(`${path.relative(process.cwd(), out)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
fs.rmSync(tmp, { recursive: true, force: true });