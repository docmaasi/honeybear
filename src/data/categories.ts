export const categories = {
  metaverse: {
    name: "Love in the digital world",
    blurb: "Relationships that begin, live, or fall apart inside virtual space.",
  },
  cheating: {
    name: "Trust and betrayal",
    blurb: "Where the line sits now that so much of life happens on a screen.",
  },
  dating: {
    name: "Dating",
    blurb: "Meeting people, reading them, and not losing yourself doing it.",
  },
  relationships: {
    name: "Making it work",
    blurb: "Repair, boundaries, and what long relationships actually run on.",
  },
  safety: {
    name: "Safety and control",
    blurb: "Recognising harm, in person and through a phone.",
  },
} as const;

export type CategoryKey = keyof typeof categories;
