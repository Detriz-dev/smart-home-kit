/** How the moment is written: "2 min ago", "14:02" or "3 min". */
export type RelativeTimeFormat = "relative" | "clock" | "duration";

/** How big the text is drawn: `xs` (caption) or `sm` (body-sm). */
export type RelativeTimeSize = "xs" | "sm";

export interface RelativeTimeProps {
  /** The moment to show, e.g. when a Detection started. */
  time: Date;
  /** How it is written: `relative` ("2 min ago"), `clock` ("14:02") or `duration` ("3 min", time from `time` until now). Defaults to `relative`. */
  format?: RelativeTimeFormat;
  /** The current time. Leave it out to use the real clock, which updates the text every 30 seconds. Pass it to fix the text, e.g. in tests. */
  now?: Date;
  /** How big the text is drawn. Defaults to `xs`. */
  size?: RelativeTimeSize;
}
