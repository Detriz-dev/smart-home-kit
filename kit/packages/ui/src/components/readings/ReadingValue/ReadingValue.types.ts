/** How big the number is drawn. Each size uses the Icon size with the same name. */
export type ReadingValueSize = "xs" | "sm" | "md" | "lg";

/** What the component shows. Not a prop: it is worked out from `value` and `isDisconnected`. */
export type ReadingValueState = "default" | "loading" | "disconnected";

export interface ReadingValueProps {
  /** The latest value of the Reading. `null` while it is loading. */
  value: number | null;
  /** True when the Device's Connection Status is Disconnected. Hides the value and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
  /** How big the number is drawn. Defaults to `lg`. */
  size?: ReadingValueSize;
}
