import type { AlertLevel } from "../../../types/alert";
import type { MeasuredMetric } from "../../../types/metric";
import type { SensorStateAsset } from "../SensorState";
import type { StateValueReading } from "../StateValue";
import type { DeviceFaultStatusProps } from "../../status/DeviceFaultStatus";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import type { UnitLabelUnit } from "../UnitLabel";

/** A Sensor that measures a number. The same fields SensorReading takes. */
export interface ModuleCardMeasuredSensor {
  /** The Metric the Sensor measures. One Sensor per Metric, so it also identifies the Sensor within the Module. */
  metric: MeasuredMetric;
  /** The latest value of the Reading. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
}

/** A Sensor with two States (Power, Contact, Motion, Smoke, CO). The same fields SensorState takes. */
export type ModuleCardStateSensor = StateValueReading & {
  /** The Asset the Sensor watches, e.g. the Front door. Names its card instead of the Metric. */
  asset?: SensorStateAsset;
  /** The Alert Level of an Active Alert about this Reading. Colours the State. */
  alertLevel?: AlertLevel;
};

/** One Sensor in the Module: a number (`value` + `unit`) or a State (`state`). */
export type ModuleCardSensor = ModuleCardMeasuredSensor | ModuleCardStateSensor;

export interface ModuleCardProps {
  /** The Module Name, e.g. "Climate Module". The user can rename it, so the parent passes it in. */
  name: string;
  /** The Module's Sensors, one to three. */
  sensors: ModuleCardSensor[];
  /** The Module's current Connection Status. */
  connectionStatus: ConnectionStatus;
  /** The Module's current Faults, one per Fault Code. A Module can report several at once. Leave it out, or pass an empty list, when there are none. */
  faults?: DeviceFaultStatusProps[];
}
