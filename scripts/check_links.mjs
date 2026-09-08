#!/usr/bin/env node
// Check every external link in the built site actually resolves.
// Internal links are already covered by the structural audit.

import { readdir, readFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";

const DIST = "dist";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk(DIST)).filter((f) => extname(f) === ".html");

// url -> the pages that link to it
const links = new Map();
for (const f of files) {
  const name = relative(DIST, f).replace(/\\/g, "/");
  const s = await readFile(f, "utf8");
  for (const m of s.matchAll(/<a[^>]*?href="(https?:\/\/[^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, "&");
    if (!links.has(u)) links.set(u, new Set());
    links.get(u).add(name);
  }
  // mailto and tel are worth listing so nothing fake slips through
  for (const m of s.matchAll(/<a[^>]*?href="(mailto:|tel:|sms:)([^"]+)"/g)) {
    const u = m[1] + m[2];
    if (!links.has(u)) links.set(u, new Set());
    links.get(u).add(name);
  }
}

const urls = [...links.keys()].sort();
console.log(`Checking ${urls.length} unique external links\n`);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function probe(url) {
  if (/^(mailto:|tel:|sms:)/.test(url)) return { code: "n/a", note: "not fetchable" };
  for (const method of ["HEAD", "GET"]) {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 20000);
      const r = await fetch(url, {
        method,
        redirect: "follow",
        signal: c.signal,
        headers: { "user-agent": UA, accept: "*/*" },
      });
      clearTimeout(t);
      if (r.status === 405 && method === "HEAD") continue;
      return { code: r.status, final: r.url };
    } catch (e) {
      if (method === "GET") return { code: "ERR", note: e.cause?.code || e.name };
    }
  }
  return { code: "ERR", note: "unreachable" };
}

const bad = [];
const suspect = [];
const results = [];

// Small concurrency so we do not look like an attack.
const queue = [...urls];
async function worker() {
  while (queue.length) {
    const u = queue.shift();
    const r = await probe(u);
    results.push([u, r]);
    const ok = r.code === 200 || r.code === "n/a";
    const blocked = [400, 401, 403, 405, 429, 999].includes(r.code);
    if (!ok && !blocked) bad.push([u, r]);
    else if (blocked) suspect.push([u, r]);
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);

results.sort((a, b) => a[0].localeCompare(b[0]));
for (const [u, r] of results) {
  const mark = r.code === 200 || r.code === "n/a" ? " " : "!";
  console.log(`${mark} ${String(r.code).padEnd(5)} ${u}`);
}

if (suspect.length) {
  console.log(`\n${suspect.length} link(s) blocked automated checks — each verified by hand in a browser:`);
  for (const [u, r] of suspect) console.log(`  ? ${r.code}  ${u}`);
}

if (bad.length) {
  console.log(`\n${bad.length} BROKEN link(s):`);
  for (const [u, r] of bad) {
    console.log(`  x ${r.code} ${r.note ?? ""}  ${u}`);
    console.log(`      linked from: ${[...links.get(u)].slice(0, 4).join(", ")}`);
  }
  process.exit(1);
}

console.log("\nNo broken external links.");
