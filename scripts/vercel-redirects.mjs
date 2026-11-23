// Post-build fix for the Vercel output (run after `astro build`, see package.json). It does two things:
// 1) makes the page redirects match with and without a trailing slash and puts them first (below);
// 2) prepends a "continue" rule that adds the security headers to every response.
//
// @astrojs/vercel writes each redirect from astro.config.mjs as an exact regex
// (`^/automatyzacje/agenci-ai$`) and puts it AFTER its own trailing-slash rule. With
// `trailingSlash: "always"` the slashed form — the one Google has indexed,
// `/automatyzacje/agenci-ai/` — never matches and ends as a 404; the slashless form
// needs two hops (308, then 301).
//
// This script makes every 301/302/307/308 redirect that points to a page match both forms
// (`^/automatyzacje/agenci-ai/?$`) and moves those rules to the top, so each retired URL is
// answered with exactly one 301 straight to its final address.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const configPath = ".vercel/output/config.json";
if (!existsSync(configPath)) {
  console.log("[vercel-redirects] No .vercel/output/config.json, skipping (not a Vercel build).");
  process.exit(0);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const isPageRedirect = (route) =>
  [301, 302, 307, 308].includes(route.status) &&
  typeof route.src === "string" &&
  route.headers?.Location &&
  // Leave Astro's own trailing-slash rules (they use capture groups) untouched.
  !route.headers.Location.includes("$1");
const redirects = config.routes.filter(isPageRedirect).map((route) => ({
  ...route,
  src: route.src.replace(/\/?\$$/, "/?$"),
}));
const rest = config.routes.filter((route) => !isPageRedirect(route));
// Security headers for every response. `continue: true` lets routing go on to the redirects and
// the rest, so the headers are added to redirect responses and pages alike. No Content-Security-Policy
// here: Google Tag Manager and inline scripts need their own, separate rollout.
const securityHeaders = {
  src: "/(.*)",
  headers: {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  },
  continue: true,
};
config.routes = [securityHeaders, ...redirects, ...rest];
writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`[vercel-redirects] ${redirects.length} redirects now match with and without a trailing slash + security headers on every route.`);