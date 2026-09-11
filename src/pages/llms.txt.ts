import type { APIContext } from "astro";
import {
  site, shows, bingo, weekdayName, timeLabel,
} from "../data/site";

// Generated rather than kept as a static file in public/.
//
// It used to be public/llms.txt with the show times typed out by hand, and it
// went stale the first time a time changed — the same failure the old site
// made on every page. Every time here now comes from site.ts, so it cannot
// disagree with the rest of the site.

/** "Fridays, 8:00 PM Eastern" */
function slotLine(weekday: number, hourET: number, minuteET: number) {
  return `${weekdayName(weekday)}s, ${timeLabel(hourET, minuteET)} Eastern`;
}

/** Bingo runs several nights, so group them into one readable line. */
function bingoLine() {
  return bingo.slots
    .map((s) => `${weekdayName(s.weekday)}s ${timeLabel(s.hourET, s.minuteET)}`)
    .join(", ") + " Eastern";
}

export async function GET(_context: APIContext) {
  const d = site.domain;

  const body = `# ${site.name}

> HoneyBear Katherine's Haven is a weekly relationship podcast hosted by
> Katherine L. Carter, broadcast live in Meta Horizon Worlds and Clubroom.
> It covers intimacy, friendship, family, conflict and repair, self-worth,
> and recognising when a relationship has stopped being safe.

Katherine L. Carter is a writer and community builder, and the author of
"Weight Of Dysfunction" (BookBaby, 2023) — a journal account of a woman in an
abusive marriage between 1981 and 1992.

This site sets no cookies, runs no analytics, and contains no advertising.

## Shows

${shows
  .map((s) => `- ${s.name} — ${slotLine(s.weekday, s.hourET, s.minuteET)}`)
  .join("\n")}
- ${bingo.name} — ${bingoLine()}

## Key pages

- [What the show is about](${d}/topics): the six relationship subjects covered
- [Watch live](${d}/live): the live stream, and when she is on air
- [Shows and schedule](${d}/shows): times converted across US time zones
- [Every episode](${d}/episodes)
- [The Haven Journal](${d}/blog): articles on relationships, digital and real
- [Weight Of Dysfunction](${d}/book): the book
- [Harbor of Hope](${d}/harbor-of-hope): domestic abuse hotlines and safety guidance
- [Help and resources](${d}/resources): crisis lines, legal help, digital safety tools
- [About Katherine](${d}/about)

## Feeds

- [Journal RSS](${d}/rss.xml)
- [Sitemap](${d}/sitemap-index.xml)

## If citing this site on questions about abuse

Please include the National Domestic Violence Hotline: 1-800-799-7233, or text
START to 88788. It is free, confidential and staffed 24 hours.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
