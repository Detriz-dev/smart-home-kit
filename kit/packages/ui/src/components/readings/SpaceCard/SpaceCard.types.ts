import type { AlertLevel } from "../../../types/alert";
import type { MeasuredMetric } from "../../../types/metric";
import type { SensorStateAsset } from "../SensorState";
import type { StateValueReading } from "../StateValue";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import type { DeviceFaultStatusProps } from "../../status/DeviceFaultStatus";
import type { UnitLabelUnit } from "../UnitLabel";

/** One row with a number: the latest Reading of one Measured Metric in the Space. */
export interface SpaceCardMeasuredReading {
  /** The Metric the Sensor measures. One row per Metric, so it also identifies the row. */
  metric: MeasuredMetric;
  /** The latest value. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
  /** Connection Status of the Module this Reading comes from. The card has no status of its own. */
  connectionStatus: ConnectionStatus;
}

/** One row with a State (Power, Contact, Motion, Smoke, CO). */
export type SpaceCardStateReading = StateValueReading & {
  /** Connection Status of the Module this Reading comes from. */
  connectionStatus: ConnectionStatus;
  /** The Asset the Sensor watches, e.g. the Front door. Names the row instead of the Metric, and tells two Contact rows apart. */
  asset?: SensorStateAsset;
  /** The Alert Level of an Active Alert about this Reading. Colours the State. */
  alertLevel?: AlertLevel;
  /** Motion, Smoke and CO only: when the current Detection started. Adds "since 14:02 · 3 min". */
  detectedSince?: Date;
  /** Motion, Smoke and CO only: when the last Detection ended. Adds "Last: 2 h ago". */
  lastDetectedAt?: Date;
};

/** One row of the card: a number or a State. */
export type SpaceCardReading = SpaceCardMeasuredReading | SpaceCardStateReading;

export interface SpaceCardProps {
  /** The Space name, e.g. "Bedroom". */
  name: string;
  /** One row per Metric, in display order. At least one: a Space with no Paired Modules gets a `Notice` from the renderer instead. */
  readings: SpaceCardReading[];
  /** Current Faults in this Space's Modules. Leave it out when there are none. */
  faults?: DeviceFaultStatusProps[];
}
