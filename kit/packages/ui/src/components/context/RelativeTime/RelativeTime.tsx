import { useEffect, useState } from "react";
import {
  formatClock,
  formatDuration,
  formatFull,
  formatRelative,
} from "../../../utils/formatTime";
import styles from "./RelativeTime.module.css";
import type {
  RelativeTimeFormat,
  RelativeTimeProps,
} from "./RelativeTime.types";

/** How often the text is refreshed when `now` isn't given. */
const TICK_MS = 30_000;

const FORMATTERS: Record<
  RelativeTimeFormat,
  (time: Date, now: Date) => string
> = {
  relative: formatRelative,
  clock: formatClock,
  duration: formatDuration,
};

/** Keeps "now" fresh with a timer, unless the parent passes a fixed `now`. */
function useNow(fixed?: Date): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (fixed) return;
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, [fixed]);
  return fixed ?? now;
}

/** Shows a moment the way people read it: "2 min ago", "14:02" or "3 min", in a <time> element. Takes props only, never fetches data. */
export function RelativeTime({
  time,
  format = "relative",
  now: fixedNow,
  size = "xs",
}: RelativeTimeProps) {
  const now = useNow(fixedNow);

  return (
    <time
      dateTime={time.toISOString()}
      title={formatFull(time)}
      data-size={size}
      className={styles.root}
    >
      {FORMATTERS[format](time, now)}
    </time>
  );
}
