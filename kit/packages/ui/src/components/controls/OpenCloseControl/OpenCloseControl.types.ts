import type { CommandOf, CommandStatus } from "../../../types/command";
import type { StateOf } from "../../../types/state";

/** The last command sent to the Control, and where it is. */
export interface OpenCloseControlCommand {
  /** What the user asked for. */
  command: CommandOf<"open-close">;
  /** `pending` until a Reading confirms it (Opening or Open for `open`, Closing or Closed for `close`, Open or Closed for `stop`); `failed` if refused or timed out. */
  status: CommandStatus;
  /** Why it failed, shown after "Couldn't open.". Defaults to "The device didn't respond." */
  failureMessage?: string;
}

/** The props of `OpenCloseControl`. */
export interface OpenCloseControlProps {
  /** What it opens and closes, e.g. "Living room blinds". Also names the group of buttons for screen readers. */
  name: string;
  /** The Open / Close State the Device **reports**. `null` while the first Reading is on its way. */
  state: StateOf<"open-close"> | null;
  /** The commands the Device accepts. A command not listed isn't shown. At least one. */
  allowedCommands: CommandOf<"open-close">[];
  /** Called with `"open"`, `"close"` or `"stop"` when the user presses a button. The app sends it and passes back `command`. */
  onCommand: (command: CommandOf<"open-close">) => void;
  /** The last command and its Command Status. Leave it out when there is none. */
  command?: OpenCloseControlCommand;
  /** True when the Device's Connection Status is Disconnected. Hides the State and the buttons. */
  isDisconnected?: boolean;
  /** True when the Account can only view this Site. Disables the buttons. */
  isViewOnly?: boolean;
}
