// Episodes published on YouTube: https://www.youtube.com/@honeybearkatherineshaven
//
// TO ADD AN EPISODE: copy the block at the top of the list, paste it above,
// and change the three values. The id is the part of the YouTube link after
// "watch?v=" — for youtube.com/watch?v=eP0Juf2UagE the id is eP0Juf2UagE.
//
// Leave `title` exactly as it appears on YouTube. If an episode has no real
// title there, the site shows its date instead — but a descriptive title is
// far better, both for listeners and for search.
//
// `seconds` is the running time. Get it from the length shown on the YouTube
// player (4:15 is 255). It decides whether a video is listed as a full episode
// or as a short clip, so it is worth getting right.

export type Episode = {
  /** YouTube video id */
  id: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  published: string;
  /** Running time in seconds, as reported by YouTube. Used to tell a full
   *  episode apart from a short clip, and shown on the card. */
  seconds: number;
  /** Override the automatic episode/clip split. Almost never needed — the
   *  running time decides it. Set "episode" to force a short video into the
   *  main list, or "clip" to move a long one out of it. */
  kind?: "episode" | "clip";
  /** Optional: a sentence about the episode. Shown on the episode page. */
  summary?: string;
  /** Optional: topic slugs from topics.ts. An episode can carry several. */
  topics?: string[];
};

export const episodes: Episode[] = [
  { id: "eP0Juf2UagE", title: "September 7, 2026", published: "2026-09-07", seconds: 183 },
  {
    id: "PcjRvormCps",
    title: "The importance of Friendship",
    published: "2026-08-19",
    seconds: 1261,
    summary:
      "What friendship actually asks of us, and why the people who stay are the ones who show up unannounced.",
    topics: ["friendship"],
  },
  { id: "6lqEUlk4NWA", title: "August 16, 2026", published: "2026-08-16", seconds: 1470 },
  {
    id: "dwdl12Hprmk",
    title: "problems problems",
    published: "2026-08-13",
    seconds: 58,
    summary:
      "On the weeks when everything arrives at once, and what to do with the pile.",
    topics: ["conflict-repair"],
  },
  { id: "0tSCRdPRPGw", title: "August 13, 2026", published: "2026-08-13", seconds: 300 },
  { id: "HwjjhYimzI0", title: "August 13, 2026", published: "2026-08-13", seconds: 1470 },
  { id: "ac0PR6mccns", title: "August 12, 2026", published: "2026-08-12", seconds: 15 },
  { id: "biz3QJ-myvk", title: "July 24, 2026", published: "2026-07-24", seconds: 15 },
  { id: "ytYDK3joBGY", title: "July 24, 2026", published: "2026-07-24", seconds: 15 },
  { id: "vN8Fuh9kBMs", title: "July 24, 2026", published: "2026-07-24", seconds: 15 },
  { id: "mHljbn-Geqc", title: "July 24, 2026", published: "2026-07-24", seconds: 15 },
  { id: "INosQd6t15c", title: "June 17, 2026", published: "2026-06-17", seconds: 1289 },
  {
    id: "tQ3eYR1uGdw",
    title: "A Wild Week and What's Ahead",
    published: "2026-05-30",
    seconds: 1131,
    summary:
      "Catching up after a full week, and a look at what is coming to the Haven.",
  },
  { id: "HZaLnIzuwU0", title: "May 8, 2026", published: "2026-05-08", seconds: 256 },
  {
    id: "sJi3z7EPr_o",
    title: "September 13, 2025",
    published: "2025-09-13",
    seconds: 407,
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

/** Anything at or over this length is a full episode; anything under it is a
 *  short clip. The real library falls either side of a wide gap — the clips run
 *  15 seconds to under 7 minutes, the episodes run from nearly 19 minutes up —
 *  so the exact figure is not delicate. */
export const FULL_EPISODE_SECONDS = 600;

export function isFullEpisode(ep: Episode) {
  if (ep.kind) return ep.kind === "episode";
  return ep.seconds >= FULL_EPISODE_SECONDS;
}

/** The real episodes. This is what "episodes" means everywhere a visitor
 *  is being shown the body of work. */
export const fullEpisodes = episodes.filter(isFullEpisode);

/** Short pieces — trailers, bumpers and one-minute thoughts. Worth keeping,
 *  but they are not episodes and listing them as such made a library of
 *  twenty-minute shows look like a handful of clips. */
export const clips = episodes.filter((e) => !isFullEpisode(e));

/** Running time, written the way a person would say it. */
export function runtime(seconds: number) {
  if (seconds < 60) return `${seconds} sec`;
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

/** The newest full episode — never a fifteen-second bumper. */
export const latest = fullEpisodes[0] ?? episodes[0];
