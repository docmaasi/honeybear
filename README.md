# HoneyBear Katherine

The website for **HoneyBear Katherine's Haven** — a weekly podcast about
encouragement hosted by Katherine L. Carter, broadcast live from Meta Horizon
Worlds.

Built with [Astro](https://astro.build). Static output, no database, no server
to keep running.

---

## Adding an episode

Open `src/data/episodes.ts` and add one line at the top of the list:

```ts
{ id: "eP0Juf2UagE", title: "The importance of Friendship", published: "2026-08-19" },
```

- **id** — the part of the YouTube link after `watch?v=`.
  For `youtube.com/watch?v=eP0Juf2UagE` the id is `eP0Juf2UagE`.
- **title** — exactly as it appears on YouTube.
- **published** — the date, written `YYYY-MM-DD`.

You can also add an optional `summary` line, which shows on the episode page and
gives search engines something to quote:

```ts
{
  id: "eP0Juf2UagE",
  title: "The importance of Friendship",
  published: "2026-08-19",
  summary: "What friendship actually asks of us.",
},
```

The episode page, the listing, the sitemap, and the structured data are all
generated from that one entry.

> **A note on titles.** Several episodes are currently titled only with their
> date. A descriptive title is worth real traffic — it is what a person scanning
> the list reads, and what an AI assistant quotes when someone asks about the
> show. Renaming them on YouTube and updating them here is the single cheapest
> improvement available.

## Changing show times, links, or wording

Everything else lives in `src/data/site.ts` — show days and times, social links,
the worlds, the Bingo schedule.

Times are written **once, in Eastern**. Every other time zone on the site is
calculated from it, so they cannot drift apart or be converted wrongly.

## Running it

```bash
npm install
npm run dev      # http://localhost:3800
npm run build    # writes dist/
npm run audit    # structural checks against the built site
```

## The audit

`npm run audit` runs 267 checks over the built pages and **fails the build on
any problem**. Each check exists because the previous version of this site
shipped that exact fault:

| Check | What it prevents |
|---|---|
| `lang` present and never `zxx` | Pages that told search engines they contained no language |
| Real `<title>`, no template text | Browser tabs reading "Movies" |
| Non-empty meta description | Blank search results |
| Full Open Graph set, absolute image URL | Shared links with no preview card |
| Exactly one `<h1>` per page | Pages with no identifiable subject |
| Every `<img>` has `alt` | Images invisible to screen readers |
| Every internal link resolves | "Home" links that 404 or leave the domain |
| No `href="#"`, no placeholder copy | Dead buttons and fake membership signups |
| Clean character encoding | `Copyright Â©2025` in every footer |
| Valid JSON-LD on every page | Structured data that silently fails to parse |
| `robots.txt` and sitemap present | An unindexable site |
| Time-zone conversion guard | The 7 PM ET / 5 PM CT error |

## Contact form

The contact page shows email and social routes by default. To add a form,
create a free key at [web3forms.com](https://web3forms.com) using the address
that should receive messages, then set:

```
PUBLIC_CONTACT_FORM_KEY=your-key-here
```

Without a key the form is not rendered at all — a form that cannot deliver is
worse than no form.

## Structure

```
src/
  data/
    site.ts        shows, times, links, worlds — edit this
    episodes.ts    the episode list — edit this
    schedule.ts    time-zone maths (leave alone)
  components/      header, footer, episode card, next-show widget
  layouts/Base.astro   head tags, Open Graph, JSON-LD
  pages/           one file per page
public/
  art/             podcast artwork, portrait, share card
  images/          the HBK777 medallion
  robots.txt
scripts/audit.mjs
```

## Deploying

Any static host works. On Vercel: import the repo, framework **Astro**, and it
builds on every push. The `dist/` folder is the whole site.

---

Design and build by [Smith App Studio](https://smithappstudio.com).
