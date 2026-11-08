import type { OperationalCommand } from "./operationalState";

/** The commands each Control's Metric can accept. A Control's Allowed Commands are some or all of these. From Events and commands. */
export interface CommandsByMetric {
  power: "turn-on" | "turn-off";
  "open-close": "open" | "close" | "stop";
  mode: "set-mode";
  "operational-state": OperationalCommand;
  position: "set-position";
  setpoint: "set-setpoint";
}

/** A Metric a Control can have: the ones that accept commands. */
export type ControlMetric = keyof CommandsByMetric;

/** The commands of one Control Metric, e.g. `CommandOf<"power">` is `"turn-on" | "turn-off"`. */
export type CommandOf<M extends ControlMetric> = CommandsByMetric[M];

/** Any command a Control can accept. */
export type ControlCommand = CommandOf<ControlMetric>;

/** Where a command to a Control is. From the Glossary: `pending` until a Reading shows the new value (`confirmed`) or the Device refuses it or doesn't answer in time (`failed`). */
export type CommandStatus = "pending" | "confirmed" | "failed";
