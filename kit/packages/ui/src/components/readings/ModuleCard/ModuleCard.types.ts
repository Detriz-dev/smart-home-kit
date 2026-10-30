import type { SensorLabelMetric } from "../../context/SensorLabel";
import type { DeviceFaultStatusProps } from "../../status/DeviceFaultStatus";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import type { UnitLabelUnit } from "../UnitLabel";

/** One Sensor in the Module. The same fields SensorReading takes. */
export interface ModuleCardSensor {
  /** The Metric the Sensor measures. One Sensor per Metric, so it also identifies the Sensor within the Module. */
  metric: SensorLabelMetric;
  /** The latest value of the Reading. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
}

export interface ModuleCardProps {
  /** The Module Name, e.g. "Climate Module". The user can rename it, so the parent passes it in. */
  name: string;
  /** The Module's Sensors, one to three. */
  sensors: ModuleCardSensor[];
  /** The Module's current Connection Status. */
  connectionStatus: ConnectionStatus;
  /** The Module's current Fault. Leave it out when there is none. */
  fault?: DeviceFaultStatusProps;
  /** Whether the Module is turned on. The parent owns this value. */
  isOn: boolean;
  /** Called with the new value when the user flips the Switch. */
  onToggle: (isOn: boolean) => void;
}
