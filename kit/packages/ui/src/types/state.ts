import type { TwoStateMetric } from "./metric";

/** The two States each Two-state Metric allows. From the Glossary. TypeScript reports an error here if a Two-state Metric is missing. */
export interface StatesByMetric {
  power: "on" | "off";
  contact: "open" | "closed";
  motion: "detected" | "clear";
  smoke: "detected" | "clear";
  co: "detected" | "clear";
}

/** The two States of one Two-state Metric, e.g. `StateOf<"contact">` is `"open" | "closed"`. */
export type StateOf<M extends TwoStateMetric> = StatesByMetric[M];

/** One of the two values a Two-state Metric can have. From the Glossary. */
export type State = StateOf<TwoStateMetric>;
