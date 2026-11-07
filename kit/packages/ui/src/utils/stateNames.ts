import type { State } from "../types/state";

/** The word shown for each State. From the Glossary. */
export const STATE_NAMES: Record<State, string> = {
  on: "On",
  off: "Off",
  open: "Open",
  closed: "Closed",
  detected: "Detected",
  clear: "Clear",
};

/** The active States: On, Open and Detected. They use the `state-active` colours; the others use `state-inactive`. */
export const ACTIVE_STATES: ReadonlySet<State> = new Set<State>([
  "on",
  "open",
  "detected",
]);
