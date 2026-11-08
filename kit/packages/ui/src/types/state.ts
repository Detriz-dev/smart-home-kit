import type { StateMetric } from "./metric";
import type { OperationalState } from "./operationalState";

/** The States each State Metric allows: two or more. From the Glossary. TypeScript reports an error here if a State Metric is missing. */
export interface StatesByMetric {
  power: "on" | "off";
  contact: "open" | "closed";
  "open-close": "open" | "closed" | "opening" | "closing";
  mode: "off" | "heat";
  "operational-state": OperationalState;
  motion: "detected" | "clear";
  smoke: "detected" | "clear";
  co: "detected" | "clear";
}

/** The States of one State Metric, e.g. `StateOf<"contact">` is `"open" | "closed"`. */
export type StateOf<M extends StateMetric> = StatesByMetric[M];

/** One of the values a State Metric can have. From the Glossary. */
export type State = StateOf<StateMetric>;
