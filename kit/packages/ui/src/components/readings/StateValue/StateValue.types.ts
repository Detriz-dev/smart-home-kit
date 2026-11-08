import type { AlertLevel } from "../../../types/alert";
import type { TwoStateMetric } from "../../../types/metric";
import type { StateOf } from "../../../types/state";

/** How big the pill is drawn: `md` for list rows, `lg` for cards. */
export type StateValueSize = "md" | "lg";

/** What the component shows. Not a prop: it is worked out from the props. Matches the Figma `state` variants. */
export type StateValueVisualState =
  | "inactive"
  | "active"
  | "alert-critical"
  | "alert-warning"
  | "alert-info"
  | "loading"
  | "disconnected";

/** The Metric and its State. TypeScript checks the State belongs to the Metric: Power can't be `open`. */
export type StateValueReading = {
  [M in TwoStateMetric]: {
    /** The Two-state Metric the Sensor measures, e.g. `power`. Decides the icon. */
    metric: M;
    /** The latest State, e.g. `on`. `null` while the first Reading is on its way. */
    state: StateOf<M> | null;
  };
}[TwoStateMetric];

/** The props of `StateValue`. */
export type StateValueProps = StateValueReading & {
  /** True when the Module's Connection Status is Disconnected. Hides the State and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** The Alert Level of an Active Alert about this Reading. Colours the pill with that level's status colours. Leave it out when there is none. */
  alertLevel?: AlertLevel;
  /** How big the pill is drawn. Defaults to `md`. */
  size?: StateValueSize;
};
