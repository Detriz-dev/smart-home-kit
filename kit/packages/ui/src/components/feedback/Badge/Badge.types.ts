/** The colour of the Badge: the highest Alert Level it counts, or `neutral` for counts that aren't Alerts. */
export type BadgeTone = "critical" | "warning" | "info" | "neutral";

export interface BadgeProps {
  /** How many, e.g. the number of Active Alerts. 0 or less shows nothing. */
  count: number;
  /** What screen readers say instead of the bare number, e.g. "3 active Alerts". Required: "3" alone means nothing. */
  label: string;
  /** The colour. Use the highest Alert Level among the counted Alerts. Defaults to `neutral`. */
  tone?: BadgeTone;
  /** The largest number shown. Above it the Badge shows "99+". Defaults to 99. */
  max?: number;
}
