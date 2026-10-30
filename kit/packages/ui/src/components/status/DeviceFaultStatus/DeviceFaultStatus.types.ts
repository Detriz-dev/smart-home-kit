import type { Metric } from "../../../types/metric";

/** Which hardware problem the Device reports. See docs/architecture/domain-model/ubiquitous-language.md. */
export type FaultCode = "sensor_failure" | "calibration_required";

export interface DeviceFaultStatusProps {
  /** The Fault Code of the Device's current Fault. Decides the message. */
  faultCode: FaultCode;
  /** The Metric of the affected Sensor, when the Fault is about one Sensor. Adds it to the message. */
  metric?: Metric;
}
