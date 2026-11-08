import type { AlertLevel } from "../../../types/alert";
import type {
  ErrorReason,
  OperationalState,
} from "../../../types/operationalState";

/** How big it is drawn: `md` for rows and lists, `lg` for cards. The same sizes as StateValue. */
export type OperationalStateValueSize = "md" | "lg";

/** The props of `OperationalStateValue`. */
export interface OperationalStateValueProps {
  /** The latest Operational State, e.g. `running`. `null` while the first Reading is on its way. */
  state: OperationalState | null;
  /** What kind of Running, as the Device reports it, e.g. "Heating". Shown only while `running`. */
  phase?: string;
  /** Why it is Error, e.g. `{ code: "no-water", label: "No water" }`. Shown only while `error`. */
  errorReason?: ErrorReason;
  /** True when the Device's Connection Status is Disconnected. Hides the State, Phase and Error Reason. */
  isDisconnected?: boolean;
  /** The Alert Level of an Active Alert about this Reading. Colours the pill, as in StateValue. */
  alertLevel?: AlertLevel;
  /** How big it is drawn. Defaults to `md`. */
  size?: OperationalStateValueSize;
}
