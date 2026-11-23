// Renders the social image of knowledge-base articles: public/og/wiedza/<slug>.png (1200x630), in the style of
// public/og-image.png (same dark background and corner brackets, small logo, Outfit, uppercase) with the article's
// category and title. Run by hand: node scripts/render-article-og.mjs [slug ...]   (default: every article)
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
const root = process.cwd();
const dir = path.join(root, "src/content/wiedza");
const outDir = path.join(root, "public/og/wiedza");
fs.mkdirSync(outDir, { recursive: true });
const wanted = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && (!wanted.length || wanted.includes(f.replace(/\.md$/, ""))));
const field = (src, key) => {
  const m = src.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"));
  return m ? m[1] : "";
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const font = fs.readFileSync(path.join(root, "public/fonts/outfit/outfit-latin.woff2")).toString("base64");
const fontExt = fs.readFileSync(path.join(root, "public/fonts/outfit/outfit-latin-ext.woff2")).toString("base64");
const logo = fs.readFileSync(path.join(root, "public/vf-logo-wireframe.png")).toString("base64");
const html = (category, title) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:O;font-weight:300 700;src:url(data:font/woff2;base64,${fontExt}) format("woff2");unicode-range:U+0100-02BA,U+1E00-1E9F,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:O;font-weight:300 700;src:url(data:font/woff2;base64,${font}) format("woff2");unicode-range:U+0000-00FF,U+0131,U+2000-206F,U+20AC}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:radial-gradient(ellipse at 50% 45%,#161616 0%,#050505 70%);font-family:O,sans-serif;color:#fff;position:relative;overflow:hidden}
.c{position:absolute;width:32px;height:32px;border:0 solid rgba(255,255,255,.45)}
.tl{top:36px;left:36px;border-top-width:2px;border-left-width:2px}.tr{top:36px;right:36px;border-top-width:2px;border-right-width:2px}
.bl{bottom:36px;left:36px;border-bottom-width:2px;border-left-width:2px}.br{bottom:36px;right:36px;border-bottom-width:2px;border-right-width:2px}
.logo{position:absolute;top:70px;left:96px;display:flex;align-items:center;gap:16px;font-weight:800;font-size:30px;letter-spacing:.02em}
.logo img{width:56px;height:56px;object-fit:contain}
.cat{position:absolute;left:96px;top:250px;font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:500}
h1{position:absolute;left:96px;right:96px;top:296px;font-size:64px;line-height:1.05;font-weight:800;text-transform:uppercase;letter-spacing:-.01em}
</style><div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div>
<div class="logo"><img src="data:image/png;base64,${logo}">VANTAFRAME</div>
<div class="cat">${esc(category)}</div><h1>${esc(title)}</h1>`;
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const slug = f.replace(/\.md$/, "");
  await page.setContent(html(field(src, "category"), field(src, "title")), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(outDir, `${slug}.png`);
  await page.screenshot({ path: out, type: "png" });
  console.log(`${out} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
await browser.close();