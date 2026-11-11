import type { ReactNode } from "react";
import type { AlertLevel } from "../../../types/alert";
import type { MeasuredMetric } from "../../../types/metric";
import type { SensorStateAsset } from "../SensorState";
import type { StateValueReading } from "../StateValue";
import type { DeviceFaultStatusProps } from "../../status/DeviceFaultStatus";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import type { UnitLabelUnit } from "../UnitLabel";

/** A Sensor that measures a number. The same fields SensorReading takes. */
export interface DeviceCardMeasuredSensor {
  /** The Metric the Sensor measures. One Sensor per Metric, so it also identifies the Sensor within the Module. */
  metric: MeasuredMetric;
  /** The latest value of the Reading. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
}

/** A Sensor with a State Metric (Power, Contact, Motion, Smoke, CO…). The same fields SensorState takes. */
export type DeviceCardStateSensor = StateValueReading & {
  /** The Asset the Sensor watches, e.g. the Front door. Names its card instead of the Metric. */
  asset?: SensorStateAsset;
  /** The Alert Level of an Active Alert about this Reading. Colours the State. */
  alertLevel?: AlertLevel;
};

/** One Sensor of the Device: a number (`value` + `unit`) or a State (`state`). */
export type DeviceCardSensor = DeviceCardMeasuredSensor | DeviceCardStateSensor;

export interface DeviceCardProps {
  /** The Device Name, e.g. "Climate Module" or "Kitchen kettle". The user can rename it, so the parent passes it in. */
  name: string;
  /** The Device's Sensors (Capabilities that only report), usually one to three. Leave it out for a Device with Controls only, like a power strip. */
  sensors?: DeviceCardSensor[];
  /** The Device's Controls and Operational State: the Control components themselves (PowerControl, OpenCloseControl, StateSelectControl, ValueControl, OperationalStateControl or OperationalStateValue), in the order to show them. Pass `isDisconnected` to each one yourself: the card doesn't render them. */
  controls?: ReactNode;
  /** The Device's current Connection Status. */
  connectionStatus: ConnectionStatus;
  /** The Device's current Faults, one per Fault Code. A Device can report several at once. A Fault with the `metric` of a Sensor on the card shows inside that Sensor's card; the others show above the Sensors. Leave it out, or pass an empty list, when there are none. */
  faults?: DeviceFaultStatusProps[];
}
