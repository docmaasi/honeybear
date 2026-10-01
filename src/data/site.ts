// Single source of truth for the site.
// Katherine can edit this file to change times, links, or copy — nothing else needs touching.

export const site = {
  name: "HoneyBear Katherine",
  legalName: "Katherine L. Carter",
  domain: "https://honeybearkatherine.com",
  tagline: "Encouragement, every week.",
  description:
    "HoneyBear Katherine's Haven is a weekly relationship podcast on love, trust, dating and repair, hosted by Katherine L. Carter live in Meta Horizon Worlds and Club Room.",
};

/** The two VR platforms the show broadcasts from. */
export const platforms = [
  {
    name: "Meta Horizon Worlds",
    href: "https://www.meta.com/horizon-worlds/",
    note: "Full virtual worlds, in headset or on screen.",
  },
  {
    name: "Club Room",
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

/**
 * One broadcast slot. A show can have more than one — the Haven runs Friday
 * in the Grand Pavilion and Monday in Club Room — so the time and the place
 * travel together and a venue can never end up attached to the wrong night.
 */
export type Airing = {
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  /** 24-hour, US Eastern */
  hourET: number;
  minuteET: number;
  /** Where it happens, in plain words. */
  venue: string;
};

export type Show = {
  id: string;
  name: string;
  /** The show's own sub-title, where it has one. */
  tagline?: string;
  blurb: string;
  /** Every night it goes out, in the order Katherine leads with. */
  airings: Airing[];
  /** Assumed runtime in minutes. Only used to decide how long the "on air
   *  now" badge stays up — not published anywhere as a fact. Adjust to the
   *  real length when Katherine confirms it. */
  runtimeMin: number;
  art: string;
  artW: number;
  artH: number;
  /** First broadcast. Stated as a plain fact, so it never goes stale. */
  firstBroadcast?: string;
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
    airings: [
      {
        weekday: 5,
        hourET: 20,
        minuteET: 0,
        venue: "HoneyBearKatherine's Grand Pavilion, in Meta Horizon Worlds",
      },
      { weekday: 1, hourET: 20, minuteET: 0, venue: "Club Room" },
    ],
    runtimeMin: 90,
    art: "/art/haven-podcast.jpg",
    artW: 270,
    artH: 370,
  },
  {
    id: "word-of-blessing",
    name: "HoneyBear Katherine's Word of Blessing",
    tagline: "Where Scripture Meets the Heart",
    blurb:
      "A midweek hour in the Word, streamed live on YouTube.",
    airings: [
      { weekday: 3, hourET: 19, minuteET: 0, venue: "Live on YouTube" },
    ],
    runtimeMin: 60,
    art: "/art/word-of-blessing.jpg",
    artW: 1200,
    artH: 800,
    firstBroadcast: "Wednesday, October 7, 2026",
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

/** "Fridays at 8:00 PM Eastern" */
export function airingLine(a: Airing) {
  return `${weekdayName(a.weekday)}s at ${timeLabel(a.hourET, a.minuteET)} Eastern`;
}

/** Every airing of every show, flattened and put in week order. */
export function allAirings() {
  return shows
    .flatMap((show) => show.airings.map((airing) => ({ show, airing })))
    .sort(
      (a, b) =>
        a.airing.weekday - b.airing.weekday ||
        a.airing.hourET - b.airing.hourET ||
        a.airing.minuteET - b.airing.minuteET,
    );
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
