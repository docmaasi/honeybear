// Episodes published on YouTube: https://www.youtube.com/@honeybearkatherineshaven
//
// TO ADD AN EPISODE: copy the block at the top of the list, paste it above,
// and change the three values. The id is the part of the YouTube link after
// "watch?v=" — for youtube.com/watch?v=eP0Juf2UagE the id is eP0Juf2UagE.
//
// Leave `title` exactly as it appears on YouTube. If an episode has no real
// title there, the site shows its date instead — but a descriptive title is
// far better, both for listeners and for search.

export type Episode = {
  /** YouTube video id */
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  published: string;
  /** Optional: a sentence about the episode. Shown on the episode page. */
  summary?: string;
  /** Optional: topic slugs from topics.ts. An episode can carry several. */
  topics?: string[];
};

export const episodes: Episode[] = [
  { id: "eP0Juf2UagE", title: "September 7, 2026", published: "2026-09-07" },
  {
    id: "PcjRvormCps",
    title: "The importance of Friendship",
    published: "2026-08-19",
    summary:
      "What friendship actually asks of us, and why the people who stay are the ones who show up unannounced.",
    topics: ["friendship"],
  },
  { id: "6lqEUlk4NWA", title: "August 16, 2026", published: "2026-08-16" },
  {
    id: "dwdl12Hprmk",
    title: "problems problems",
    published: "2026-08-13",
    summary:
      "On the weeks when everything arrives at once, and what to do with the pile.",
    topics: ["conflict-repair"],
  },
  { id: "0tSCRdPRPGw", title: "August 13, 2026", published: "2026-08-13" },
  { id: "HwjjhYimzI0", title: "August 13, 2026", published: "2026-08-13" },
  { id: "ac0PR6mccns", title: "August 12, 2026", published: "2026-08-12" },
  { id: "biz3QJ-myvk", title: "July 24, 2026", published: "2026-07-24" },
  { id: "ytYDK3joBGY", title: "July 24, 2026", published: "2026-07-24" },
  { id: "vN8Fuh9kBMs", title: "July 24, 2026", published: "2026-07-24" },
  { id: "mHljbn-Geqc", title: "July 24, 2026", published: "2026-07-24" },
  { id: "INosQd6t15c", title: "June 17, 2026", published: "2026-06-17" },
  {
    id: "tQ3eYR1uGdw",
    title: "A Wild Week and What's Ahead",
    published: "2026-05-30",
    summary:
      "Catching up after a full week, and a look at what is coming to the Haven.",
  },
  { id: "HZaLnIzuwU0", title: "May 8, 2026", published: "2026-05-08" },
  {
    id: "sJi3z7EPr_o",
    title: "September 13, 2025",
    published: "2025-09-13",
  },
];

/** A title that is only a date carries no information — detect it so the UI can adapt. */
export function isDateOnlyTitle(title: string) {
  return /^[A-Z][a-z]+ \d{1,2},? \d{4}$/.test(title.trim());
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function watchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Locally served thumbnail. Fetched once at build time by
 *  scripts/fetch_thumbs.mjs so that no page contacts YouTube before a
 *  visitor presses play. Run `npm run thumbs` after adding an episode. */
export function thumbUrl(id: string) {
  return `/art/episodes/${id}.jpg`;
}

/** The canonical YouTube thumbnail, for structured data only. */
export function remoteThumbUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function episodesByTopic(slug: string) {
  return episodes.filter((e) => e.topics?.includes(slug));
}

export const latest = episodes[0];
