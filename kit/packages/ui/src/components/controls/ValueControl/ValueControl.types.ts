import type { CommandStatus } from "../../../types/command";
import type { UnitLabelUnit } from "../../readings/UnitLabel";

/** How the user picks the value: − / + buttons for small ranges with fine steps (Setpoint), a slider for 0–100 (Position). */
export type ValueControlInput = "stepper" | "slider";

/** The last value sent, and where the command is. */
export interface ValueControlCommand {
  /** The value asked for, in the Metric's standard Unit. */
  value: number;
  /** `pending` until a Reading shows the value; `failed` if refused or timed out. */
  status: CommandStatus;
  /** Why it failed, shown after "Couldn't set 23 °C.". Defaults to "The device didn't respond." */
  failureMessage?: string;
}

/** The props of `ValueControl`. */
export interface ValueControlProps {
  /** What it sets, e.g. "Setpoint" or "Position". Names the input for screen readers. */
  name: string;
  /** The value the Device **reports**, in the Metric's standard Unit. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show, e.g. `celsius` or `percent`. */
  unit: UnitLabelUnit;
  /** The lowest value the Device accepts. */
  min: number;
  /** The highest value the Device accepts. */
  max: number;
  /** The step between values, e.g. 0.5 for a Setpoint. */
  step: number;
  /** Called **once** with the value the user chose: when the slider is released, on Enter, or 1 second after the last − / + press. The app sends `set-setpoint` or `set-position` and passes back `command`. */
  onCommit: (value: number) => void;
  /** − / + buttons or a slider. Defaults to `stepper`. */
  input?: ValueControlInput;
  /** How many decimals to show, e.g. 1 for a Setpoint, 0 for a Position. Defaults to 0. */
  fractionDigits?: number;
  /** The last value sent and its Command Status. Leave it out when there is none. */
  command?: ValueControlCommand;
  /** True when the Device's Connection Status is Disconnected. Hides the value and the input. */
  isDisconnected?: boolean;
  /** True when the Account can only view this Site. Disables the input. */
  isViewOnly?: boolean;
}
