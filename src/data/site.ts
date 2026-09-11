// Single source of truth for the site.
// Katherine can edit this file to change times, links, or copy — nothing else needs touching.

export const site = {
  name: "HoneyBear Katherine",
  legalName: "Katherine L. Carter",
  domain: "https://honeybearkatherine.com",
  tagline: "Encouragement, every week.",
  description:
    "HoneyBear Katherine's Haven is a weekly relationship podcast on love, trust, dating and repair, hosted by Katherine L. Carter live in Meta Horizon Worlds and Clubroom.",
};

/** The two VR platforms the show broadcasts from. */
export const platforms = [
  {
    name: "Meta Horizon Worlds",
    href: "https://www.meta.com/horizon-worlds/",
    note: "Full virtual worlds, in headset or on screen.",
  },
  {
    name: "Clubroom",
    href: "https://www.clubroom.app",
    note: "Voice-led rooms. No headset needed.",
  },
];

export const links = {
  youtube: "https://www.youtube.com/@honeybearkatherineshaven",
  youtubeChannelId: "UCxG1umFDs9pqK_53QYNRQMw",
  facebook: "https://www.facebook.com/HoneyBearKatherine777",
  instagram: "https://www.instagram.com/katherine_l_carter/",
  cashApp: "https://cash.app/$honeybearkatherine",
  email: "hbkgrandpavilion@gmail.com",
  ryze: "https://get.aspr.app/SH1HHw",
  book: "https://www.amazon.com/dp/1667889222",
  studio: "https://smithappstudio.com",
};

export type Show = {
  id: string;
  name: string;
  blurb: string;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  /** 24-hour, US Eastern */
  hourET: number;
  minuteET: number;
  /** Assumed runtime in minutes. Only used to decide how long the "on air
   *  now" badge stays up — not published anywhere as a fact. Adjust to the
   *  real length when Katherine confirms it. */
  runtimeMin: number;
  art: string;
};

// Times are stated in Eastern and converted for display by zoneLine().
// The old site hard-coded its Central conversion and got it an hour wrong.
// Nothing here is hard-coded, so that class of error cannot come back.
export const shows: Show[] = [
  {
    id: "haven",
    name: "HoneyBear Katherine's Haven",
    blurb:
      "The main show. Guests from every walk of life, real conversation, and a live audience that talks back.",
    weekday: 5,
    hourET: 19,
    minuteET: 0,
    runtimeMin: 90,
    art: "/art/haven-podcast.jpg",
  },
  {
    id: "encouraging-moment",
    name: "The Encouraging Moment",
    blurb:
      "A short midweek livestream to start the morning with something steady.",
    weekday: 3,
    hourET: 7,
    minuteET: 0,
    runtimeMin: 30,
    art: "/art/encouraging-moment.jpg",
  },
];

export type BingoSlot = { weekday: number; hourET: number; minuteET: number };

export const bingo = {
  name: "Bingo Under the Stars",
  blurb: "Bingo, live and hosted. Everyone is welcome.",
  slots: [
    { weekday: 1, hourET: 21, minuteET: 0 },
    { weekday: 4, hourET: 21, minuteET: 0 },
    { weekday: 5, hourET: 13, minuteET: 0 },
  ] as BingoSlot[],
};

export const worlds = [
  {
    name: "Serenity Cove",
    where: "Meta Horizon Worlds",
    image: "/art/serenity.jpg",
    blurb:
      "A quiet stretch of water and mountains built for people who need somewhere to put their shoulders down. Come for the view, stay as long as you like.",
  },
  {
    name: "SunnyDale",
    where: "Meta Horizon Worlds",
    image: "/art/sunnydale.jpg",
    // Katherine's own description of SunnyDale is still to come — the old site
    // repeated Serenity Cove's text here. Say only what is known until then.
    blurb:
      "A city Katherine built and runs inside Meta Horizon Worlds.",
  },
];

export const nav = [
  { label: "Live", href: "/live" },
  { label: "Journal", href: "/blog" },
  { label: "Topics", href: "/topics" },
  { label: "Shows", href: "/shows" },
  { label: "Episodes", href: "/episodes" },
  { label: "Worlds", href: "/worlds" },
  { label: "Book", href: "/book" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** "Friday" */
export function weekdayName(d: number) {
  return WEEKDAYS[d];
}

/** 19 -> "7:00 PM" */
export function timeLabel(hour: number, minute: number) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = String(minute).padStart(2, "0");
  return `${h12}:${mm} ${hour < 12 ? "AM" : "PM"}`;
}

/**
 * Eastern time converted across the US zones.
 * Offsets from Eastern: Central -1, Mountain -2, Pacific -3.
 */
export function zoneLine(hour: number, minute: number) {
  const zones: [string, number][] = [
    ["ET", 0],
    ["CT", -1],
    ["MT", -2],
    ["PT", -3],
  ];
  return zones
    .map(([z, off]) => {
      const h = (hour + off + 24) % 24;
      return `${timeLabel(h, minute)} ${z}`;
    })
    .join(" / ");
}
