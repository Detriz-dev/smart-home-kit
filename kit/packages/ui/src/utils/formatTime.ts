// How the kit writes moments and durations. English and a 24-hour clock for now: a locale option
// would only change this file.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const fullFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  hourCycle: "h23",
});

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** "just now", "3 min ago", "2 h ago", "3 days ago", or the date ("6 Nov") from 7 days on. */
export function formatRelative(time: Date, now: Date): string {
  const diff = Math.max(0, now.getTime() - time.getTime());
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} h ago`;
  if (diff < 7 * DAY) {
    const days = Math.floor(diff / DAY);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  return dateFormat.format(time);
}

/** "14:02" today, "6 Nov, 14:02" on another day. */
export function formatClock(time: Date, now: Date): string {
  const clock = clockFormat.format(time);
  return isSameDay(time, now) ? clock : `${dateFormat.format(time)}, ${clock}`;
}

/** Time from `time` until `now`: "under 1 min", "3 min", "2 h 5 min", "3 days". */
export function formatDuration(time: Date, now: Date): string {
  const diff = Math.max(0, now.getTime() - time.getTime());
  if (diff < MINUTE) return "under 1 min";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    const minutes = Math.floor((diff % HOUR) / MINUTE);
    return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
  }
  const days = Math.floor(diff / DAY);
  return days === 1 ? "1 day" : `${days} days`;
}

/** The full date and time, for a tooltip: "7 Nov 2026, 14:02". */
export function formatFull(time: Date): string {
  return fullFormat.format(time);
}
