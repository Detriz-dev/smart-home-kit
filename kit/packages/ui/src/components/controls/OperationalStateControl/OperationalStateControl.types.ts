import type { CommandStatus } from "../../../types/command";
import type {
  ErrorReason,
  OperationalCommand,
  OperationalState,
} from "../../../types/operationalState";

/** The last command sent to the Control, and where it is. */
export interface OperationalStateControlCommand {
  /** What the user asked for. */
  command: OperationalCommand;
  /** `pending` until a Reading confirms it (Running for `start` and `resume`, Paused for `pause`, Stopped for `stop`); `failed` if refused or timed out. */
  status: CommandStatus;
  /** Why it failed, shown after "Couldn't start.". Defaults to "The device didn't respond." */
  failureMessage?: string;
}

/** The props of `OperationalStateControl`. */
export interface OperationalStateControlProps {
  /** The Device or its task, e.g. "Kettle". Also names the group of buttons for screen readers. */
  name: string;
  /** The Operational State the Device **reports**. `null` while the first Reading is on its way. */
  state: OperationalState | null;
  /** What kind of Running, e.g. "Heating". Shown only while `running`. */
  phase?: string;
  /** Why it is Error. Shown only while `error`. */
  errorReason?: ErrorReason;
  /** The commands the Device accepts. A command not listed isn't shown. With none, use OperationalStateValue instead. */
  allowedCommands: OperationalCommand[];
  /** Called with the command when the user presses a button. The app sends it and passes back `command`. */
  onCommand: (command: OperationalCommand) => void;
  /** The last command and its Command Status. Leave it out when there is none. */
  command?: OperationalStateControlCommand;
  /** True when the Device also has a Power Control and it is Off: Start isn't allowed (Data model rule 32). */
  isPoweredOff?: boolean;
  /** True when the Device's Connection Status is Disconnected. Hides the State and the buttons. */
  isDisconnected?: boolean;
  /** True when the Account can only view this Site. Disables the buttons. */
  isViewOnly?: boolean;
}
