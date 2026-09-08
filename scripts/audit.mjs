#!/usr/bin/env node
// Structural audit of the built site. Numbers, not eyeballing.
// Every check here maps to a finding from the assessment of the old site,
// so the failures that shipped before cannot ship again.
//
//   npm run build && npm run audit

import { readdir, readFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";

const DIST = "dist";
const problems = [];
const warnings = [];
let checks = 0;

function fail(file, msg) { problems.push(`${file}: ${msg}`); }
function warn(file, msg) { warnings.push(`${file}: ${msg}`); }
function check() { checks++; }

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(DIST);
const html = files.filter((f) => extname(f) === ".html");

if (html.length === 0) {
  console.error("No HTML found in dist/. Run `npm run build` first.");
  process.exit(1);
}

// Collect internal link targets so we can verify every one resolves.
const pageSet = new Set(
  html.map((f) => {
    let r = "/" + relative(DIST, f).replace(/\\/g, "/");
    r = r.replace(/index\.html$/, "").replace(/\.html$/, "");
    return r.replace(/\/$/, "") || "/";
  }),
);
const assetSet = new Set(
  files
    .filter((f) => extname(f) !== ".html")
    .map((f) => "/" + relative(DIST, f).replace(/\\/g, "/")),
);

for (const file of html) {
  const name = relative(DIST, file).replace(/\\/g, "/");
  const s = await readFile(file, "utf8");

  // --- F-07: language must be declared, and never "zxx" ---
  check();
  const lang = s.match(/<html[^>]*lang="([^"]*)"/)?.[1];
  if (!lang) fail(name, "no lang attribute on <html>");
  else if (lang === "zxx") fail(name, 'lang="zxx" — declares the page has no language');

  // --- F-07: real title, never template leftovers ---
  check();
  const title = s.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "";
  if (!title) fail(name, "empty <title>");
  if (/^movies\b/i.test(title)) fail(name, `template title left in place: "${title}"`);
  if (title.length > 65) warn(name, `title is ${title.length} chars, may truncate in search`);

  // --- F-07: description must exist and say something ---
  check();
  const desc = s.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (!desc.trim()) fail(name, "empty meta description");
  else if (desc.length < 50) warn(name, `description is only ${desc.length} chars`);

  // --- F-05: share previews ---
  check();
  for (const tag of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!s.includes(`property="${tag}"`)) fail(name, `missing ${tag}`);
  }
  const ogImage = s.match(/property="og:image" content="([^"]*)"/)?.[1];
  if (ogImage && !/^https?:\/\//.test(ogImage))
    fail(name, "og:image must be an absolute URL");

  // --- F-18: one h1 per page ---
  check();
  const h1s = (s.match(/<h1[\s>]/g) || []).length;
  if (h1s === 0) fail(name, "no <h1>");
  if (h1s > 1) fail(name, `${h1s} <h1> elements, expected 1`);

  // --- F-18: images need alt attributes (empty alt is fine = decorative) ---
  check();
  const imgs = s.match(/<img\b[^>]*>/g) || [];
  const noAlt = imgs.filter((t) => !/\salt=/.test(t));
  if (noAlt.length) fail(name, `${noAlt.length} of ${imgs.length} <img> without alt`);

  // --- F-04 / F-08: every internal link must resolve ---
  check();
  const hrefs = [...s.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|sms:|#|data:)/.test(href)) continue;
    const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
    if (pageSet.has(clean) || assetSet.has(clean) || assetSet.has(href)) continue;
    fail(name, `broken internal link: ${href}`);
  }

  // --- F-11: no dead controls or placeholder copy ---
  // Checked against visible text only: script and style bodies legitimately
  // contain words like "placeholder" as configuration keys.
  check();
  if (/href="#"/.test(s)) fail(name, 'dead link: href="#"');
  const visible = s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const banned = [
    "coming soon", "lorem ipsum", "placeholder",
    "create or restart your membership", "TODO", "FIXME",
  ];
  for (const b of banned) {
    if (visible.toLowerCase().includes(b.toLowerCase()))
      fail(name, `placeholder copy found: "${b}"`);
  }

  // --- F-12: encoding must be clean ---
  check();
  if (/Â©|Ã©|â€™|�/.test(s)) fail(name, "character encoding fault in output");

  // --- Astro drops the space at a line break before an inline tag, producing
  //     "Built bySmith App Studio". Caught in the rendered output, not source. ---
  check();
  const glued = [
    ...s.matchAll(/[a-z0-9,)]<(?:strong|a|em|code)[ >]/g),
    ...s.matchAll(/<\/(?:strong|a|em|code)>[a-zA-Z]/g),
  ];
  if (glued.length) {
    const sample = glued.slice(0, 3).map((m) => m[0]).join(", ");
    fail(name, `${glued.length} missing space(s) beside an inline tag: ${sample}`);
  }

  // --- canonical ---
  check();
  if (!/rel="canonical"/.test(s)) fail(name, "missing canonical link");

  // --- structured data must be valid JSON ---
  check();
  const ld = [...s.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )];
  if (ld.length === 0) fail(name, "no JSON-LD structured data");
  for (const [, body] of ld) {
    try {
      const parsed = JSON.parse(body);
      if (!parsed["@context"]) fail(name, "JSON-LD missing @context");
    } catch (e) {
      fail(name, `JSON-LD is not valid JSON: ${e.message}`);
    }
  }
}

// --- site-level checks ---
check();
if (!assetSet.has("/robots.txt")) fail("site", "no robots.txt");
check();
if (![...assetSet].some((f) => f.startsWith("/sitemap"))) fail("site", "no sitemap");

// --- the old site's time-zone bug, guarded ---
check();
const shows = await readFile("src/data/site.ts", "utf8");
if (/5PM CST/i.test(shows)) fail("site.ts", "the old 7PM ET / 5PM CST conversion error is back");

console.log(`\nAudited ${html.length} pages, ${checks} checks.\n`);

if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ~ ${w}`);
  console.log("");
}

if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  for (const p of problems) console.log(`  x ${p}`);
  console.log("");
  process.exit(1);
}

console.log("All structural checks passed.\n");
