import type { CommandStatus } from "../../../types/command";
import type { StateOf } from "../../../types/state";

/** The State Metrics this Control can pick from: those with a `set-…` command. Today only `mode`. */
export type StateSelectMetric = "mode";

/** The last State the user asked for, and where the command is. */
export interface StateSelectControlCommand {
  /** The State asked for, e.g. `heat`. */
  state: StateOf<StateSelectMetric>;
  /** `pending` until a Reading shows that State; `failed` if refused or timed out. */
  status: CommandStatus;
  /** Why it failed, shown after "Couldn't switch to Heat.". Defaults to "The device didn't respond." */
  failureMessage?: string;
}

/** The props of `StateSelectControl`. */
export interface StateSelectControlProps {
  /** What it sets, e.g. "Mode". Also names the group of options for screen readers. */
  name: string;
  /** The State Metric, which decides the options and their icons. */
  metric: StateSelectMetric;
  /** The State the Device **reports**. `null` while the first Reading is on its way. */
  state: StateOf<StateSelectMetric> | null;
  /** Called with the State the user picked. The app sends `set-mode` and passes back `command`. */
  onSelect: (state: StateOf<StateSelectMetric>) => void;
  /** The last State asked for, and its Command Status. Leave it out when there is none. */
  command?: StateSelectControlCommand;
  /** True when the Device's Connection Status is Disconnected. Hides the options. */
  isDisconnected?: boolean;
  /** True when the Account can only view this Site. Disables the options. */
  isViewOnly?: boolean;
}
