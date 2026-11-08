import type { CommandOf, CommandStatus } from "../../../types/command";
import type { StateOf } from "../../../types/state";

/** The last command sent to the Control, and where it is. */
export interface PowerControlCommand {
  /** What the user asked for. */
  command: CommandOf<"power">;
  /** `pending` until a Reading shows the new value; `failed` if the Device refused it or didn't answer in time; `confirmed` shows nothing extra. */
  status: CommandStatus;
  /** Why it failed, shown after "Couldn't turn on.", e.g. "The power strip refused the command." Defaults to "The device didn't respond." */
  failureMessage?: string;
}

/** The props of `PowerControl`. */
export interface PowerControlProps {
  /** What it switches, e.g. "Desk lamp" or "Socket 2". Shown on the left and used as the switch's name for screen readers. */
  name: string;
  /** The Power State the Device **reports**. `null` while the first Reading is on its way. A command never changes it: only the next Reading does. */
  state: StateOf<"power"> | null;
  /** The commands this Control accepts: both, or only one (e.g. `["turn-off"]`). A Power that can never be changed is a Sensor: use StateValue instead. */
  allowedCommands: CommandOf<"power">[];
  /** Called with `"turn-on"` or `"turn-off"` when the user flips the switch. The app sends the command and passes back `command`. */
  onCommand: (command: CommandOf<"power">) => void;
  /** The last command and its Command Status. Leave it out when there is none. */
  command?: PowerControlCommand;
  /** True when the Device's Connection Status is Disconnected. Hides the switch and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** True when the Account can only view this Site (it was shared with them). Disables the switch. */
  isViewOnly?: boolean;
}
