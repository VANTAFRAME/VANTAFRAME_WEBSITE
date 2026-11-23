// Serves the production build locally (after `npm run build`): node scripts/preview-local.mjs [port]
// `npm run preview` does not work here: the @astrojs/vercel adapter does not support it. This serves the static output
// in .vercel/output/static (same files Vercel serves). For everyday work use `npm run dev` (http://localhost:4321).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(".vercel/output/static");
const port = Number(process.argv[2]) || 4322;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".mp4": "video/mp4", ".pdf": "application/pdf" };
if (!fs.existsSync(root)) {
  console.error("Brak .vercel/output/static — najpierw uruchom: npm run build");
  process.exit(1);
}
http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(root, urlPath);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!urlPath.endsWith("/")) return res.writeHead(308, { Location: `${urlPath}/` }).end();
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(fs.existsSync(path.join(root, "404.html")) ? fs.readFileSync(path.join(root, "404.html")) : "404");
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Podgląd builda: http://localhost:${port}/`));