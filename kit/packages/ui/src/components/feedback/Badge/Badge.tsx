import styles from "./Badge.module.css";
import type { BadgeProps } from "./Badge.types";

/** A small count in a pill, e.g. Active Alerts. Shows nothing when the count is 0. Takes props only, never fetches data. */
export function Badge({
  count,
  label,
  tone = "neutral",
  max = 99,
}: BadgeProps) {
  if (count <= 0) {
    return null;
  }

  const shown = count > max ? `${max}+` : String(count);

  return (
    <span data-tone={tone} className={styles.root}>
      {/* The number is for the eyes; screen readers get the label, which says what is counted. */}
      <span aria-hidden="true">{shown}</span>
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
}
