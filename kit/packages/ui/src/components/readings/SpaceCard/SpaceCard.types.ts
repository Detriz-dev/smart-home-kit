import type { MeasuredMetric } from "../../../types/metric";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import type { DeviceFaultStatusProps } from "../../status/DeviceFaultStatus";
import type { UnitLabelUnit } from "../UnitLabel";

/** One row: the latest Reading of one Metric in the Space. */
export interface SpaceCardReading {
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

export interface SpaceCardProps {
  /** The Space name, e.g. "Bedroom". */
  name: string;
  /** One row per Metric, in display order. At least one: a Space with no Paired Modules gets a `Notice` from the renderer instead. */
  readings: SpaceCardReading[];
  /** Current Faults in this Space's Modules. Leave it out when there are none. */
  faults?: DeviceFaultStatusProps[];
}
