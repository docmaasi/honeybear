// Turning "Fridays at 7 PM Eastern" into a real instant, correctly, in any
// timezone and on both sides of daylight saving.
//
// The old site hard-coded "7PM EST, 5PM CST" and got the conversion wrong.
// Nothing here is hard-coded: every displayed time is derived from the one
// Eastern time stated in site.ts.

/** Offset of America/New_York at a given instant, in minutes east of UTC. */
function etOffsetMinutes(at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(at)) p[part.type] = part.value;
  // `hour` can come back as "24" at midnight in some engines.
  const hour = Number(p.hour) % 24;
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    hour,
    Number(p.minute),
    Number(p.second),
  );
  return (asUTC - at.getTime()) / 60000;
}

/** The exact instant of a given Eastern wall-clock time. */
export function instantFromET(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  // First guess with the offset at the naive instant, then correct once —
  // this settles DST boundaries.
  let guess = new Date(naive - etOffsetMinutes(new Date(naive)) * 60000);
  guess = new Date(naive - etOffsetMinutes(guess) * 60000);
  return guess;
}

/** Today's date parts in Eastern. */
function etParts(at: Date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(at)) p[part.type] = part.value;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    weekday: days.indexOf(p.weekday),
  };
}

export type Occurrence = {
  /** The instant the show starts */
  start: Date;
  /** The instant it is assumed to end */
  end: Date;
};

/** The next (or currently running) occurrence of a weekly Eastern slot. */
export function nextOccurrence(
  weekday: number,
  hourET: number,
  minuteET: number,
  runtimeMin: number,
  now: Date = new Date(),
): Occurrence {
  const t = etParts(now);
  // Check today first, then walk forward up to 7 days.
  for (let add = 0; add <= 7; add++) {
    const dayIndex = (t.weekday + add) % 7;
    if (dayIndex !== weekday) continue;
    const start = instantFromET(
      t.year,
      t.month,
      t.day + add,
      hourET,
      minuteET,
    );
    const end = new Date(start.getTime() + runtimeMin * 60000);
    if (end.getTime() > now.getTime()) return { start, end };
  }
  // Only reachable if today's slot already ended — take next week's.
  const start = instantFromET(t.year, t.month, t.day + 7, hourET, minuteET);
  return { start, end: new Date(start.getTime() + runtimeMin * 60000) };
}

export function isLive(occ: Occurrence, now: Date = new Date()) {
  return now >= occ.start && now <= occ.end;
}

/** "Friday, 7:00 PM" in whichever timezone the reader is sitting in. */
export function localLabel(d: Date, tz?: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(d);
}

/** The reader's timezone abbreviation, e.g. "CDT". */
export function localZone(d: Date, tz?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
    timeZone: tz,
  }).formatToParts(d);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

/** "in 2 days" / "in 3 hours" / "now" */
export function relative(d: Date, now: Date = new Date()) {
  const ms = d.getTime() - now.getTime();
  if (ms <= 0) return "now";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `in ${mins} minute${mins === 1 ? "" : "s"}`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}
