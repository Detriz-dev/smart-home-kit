import type { State } from "../types/state";

/** The word shown for each State. From the Glossary. */
export const STATE_NAMES: Record<State, string> = {
  on: "On",
  off: "Off",
  open: "Open",
  closed: "Closed",
  detected: "Detected",
  clear: "Clear",
  opening: "Opening",
  closing: "Closing",
  heat: "Heat",
  stopped: "Stopped",
  running: "Running",
  paused: "Paused",
  error: "Error",
};

/** The active States: something is on, open, moving, heating or running. They use the `state-active` colours; the others use `state-inactive`. Error gets its own treatment in the components that show Operational State. */
export const ACTIVE_STATES: ReadonlySet<State> = new Set<State>([
  "on",
  "open",
  "detected",
  "opening",
  "closing",
  "heat",
  "running",
]);
