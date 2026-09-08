#!/usr/bin/env node
// Pull each episode thumbnail once, at build time, and serve it from this site.
// Without this, every episode page and the whole episode grid sends a request
// to YouTube's image servers before the visitor has chosen to watch anything.

import { mkdir, writeFile, access } from "node:fs/promises";
import { readFile } from "node:fs/promises";

const OUT = "public/art/episodes";
await mkdir(OUT, { recursive: true });

const src = await readFile("src/data/episodes.ts", "utf8");
const ids = [...src.matchAll(/id:\s*"([A-Za-z0-9_-]{6,})"/g)].map((m) => m[1]);

let got = 0, skipped = 0;
for (const id of ids) {
  const dest = `${OUT}/${id}.jpg`;
  try { await access(dest); skipped++; continue; } catch {}
  // maxresdefault is not always present; hqdefault always is.
  for (const name of ["maxresdefault", "hqdefault"]) {
    const r = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
    if (!r.ok) continue;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) continue;
    await writeFile(dest, buf);
    got++;
    break;
  }
}
console.log(`thumbnails: ${got} fetched, ${skipped} already present, ${ids.length} episodes`);
