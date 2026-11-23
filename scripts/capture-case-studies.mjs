// Captures the images used by the case-study template (src/pages/portfolio/[slug].astro) from the live sites.
// Run by hand: node scripts/capture-case-studies.mjs [slug ...] [--probe]
//   default      : full-page screenshot -> public/case-studies/<slug>/full.webp (1200 px wide, quality 75, max 9000 px
//                  high, longer pages are cut at the bottom) and three viewport frames (1440x900 at the scroll offsets
//                  listed in DETAILS below) -> detail-1..3.webp (1200 px wide, quality 78). Sizes are merged into
//                  src/data/projectImageSizes.json.
//   --probe      : writes a contact sheet of viewport shots (every 900 px of the page) to ./case-study-probe/<slug>/
//                  so the DETAILS offsets can be chosen from the real structure of each site.
// Cookie banners are declined (never accepted) and chat widgets / popups hidden with CSS.
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import sharp from "sharp";
const SITES = {
  "sgh-warsaw": "https://raportsghforum.pl/",
  "magdalena-zaplata": "https://magdalenazaplata.pl/",
  "teatr-scala": "https://teatrscala.com/",
};
// Scroll offsets (px) of the three detail frames; captions are written in src/data/caseStudies.js.
const DETAILS = {
  "sgh-warsaw": [900, 1800, 2700], // grupa docelowa, pakiety, obszary tematyczne
  "magdalena-zaplata": [3600, 6300, 9000], // cennik, zmiana przed/po, rezerwacja terminu
  "teatr-scala": [900, 2700, 4500], // Metoda 8S, oferta, partnerzy
};
const args = process.argv.slice(2);
const probe = args.includes("--probe");
const slugs = args.filter((a) => !a.startsWith("--"));
const targets = slugs.length ? slugs : Object.keys(SITES);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sizesPath = path.join(process.cwd(), "src/data/projectImageSizes.json");
const HIDE_CSS =
  '[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[class*="cmplz"],#CybotCookiebotDialog,[class*="chat" i],[id*="chat" i],[class*="popup" i],[id*="popup" i],[class*="gdpr" i],[id*="gdpr" i],[class*="whatsapp" i]{display:none!important}';
// Sites that open with a click-to-enter splash screen (teatr-scala: "TOUCH").
const ENTER_CLICK = new Set(["teatr-scala"]);
const prepare = async (page, url, slug) => {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2500);
  if (ENTER_CLICK.has(slug)) {
    await page.mouse.click(720, 300);
    await sleep(3000);
  }
  await page.evaluate(() => {
    const re = /odrzu|tylko niezb|reject|decline|necessary only|nie zgadzam/i;
    const el = [...document.querySelectorAll("button,a,[role=button]")].find((e) => re.test(e.textContent || "") && e.offsetParent);
    if (el) el.click();
  });
  await sleep(800);
  await page.addStyleTag({ content: HIDE_CSS });
  // scroll to the end and back so lazy images and reveal animations run
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(120);
  }
  await sleep(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(2000);
  return page.evaluate(() => document.documentElement.scrollHeight);
};
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const sizes = JSON.parse(fs.readFileSync(sizesPath, "utf8"));
for (const slug of targets) {
  const url = SITES[slug];
  if (!url) {
    console.warn(`skip ${slug}: no live site`);
    continue;
  }
  const page = await browser.newPage();
  const pageHeight = await prepare(page, url, slug);
  console.log(`${slug}: page height ${pageHeight}px`);
  if (probe) {
    const dir = path.join(process.cwd(), "case-study-probe", slug);
    fs.mkdirSync(dir, { recursive: true });
    for (let y = 0, i = 0; y < pageHeight; y += 900, i++) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(900);
      await page.screenshot({ path: path.join(dir, `y${String(y).padStart(5, "0")}.png`) });
    }
    await page.close();
    continue;
  }
  const outDir = path.join(process.cwd(), "public/case-studies", slug);
  fs.mkdirSync(outDir, { recursive: true });
  const full = await page.screenshot({ type: "png", fullPage: true });
  let img = sharp(full).resize({ width: 1200 });
  const meta = await sharp(await img.toBuffer()).metadata();
  if (meta.height > 9000) img = sharp(await img.toBuffer()).extract({ left: 0, top: 0, width: 1200, height: 9000 });
  const fullOut = path.join(outDir, "full.webp");
  const info = await img.webp({ quality: 75 }).toFile(fullOut);
  sizes[`/case-studies/${slug}/full.webp`] = { width: info.width, height: info.height };
  console.log(`  full.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
  for (let i = 0; i < 3; i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), DETAILS[slug][i]);
    await sleep(1800);
    const shot = await page.screenshot({ type: "png" });
    const out = path.join(outDir, `detail-${i + 1}.webp`);
    const d = await sharp(shot).resize({ width: 1200 }).webp({ quality: 78 }).toFile(out);
    sizes[`/case-studies/${slug}/detail-${i + 1}.webp`] = { width: d.width, height: d.height };
    console.log(`  detail-${i + 1}.webp ${d.width}x${d.height} ${(d.size / 1024).toFixed(0)} KB (offset ${DETAILS[slug][i]})`);
  }
  await page.close();
}
await browser.close();
if (!probe) fs.writeFileSync(sizesPath, JSON.stringify(sizes, null, 2) + "\n");