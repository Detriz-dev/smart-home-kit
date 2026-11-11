import type { Metric } from "../../../types/metric";

/** Which hardware problem the Device reports. See kit/apps/docs-site/docs/domain-model/glossary.mdx. */
export type FaultCode = "sensor_failure" | "calibration_required";

export interface DeviceFaultStatusProps {
  /** The Fault Code of the Device's current Fault. Decides the message. */
  faultCode: FaultCode;
  /** The Metric of the affected Sensor, when the Fault is about one Sensor. Adds it to the message. Leave it out inside that Sensor's own card (SensorReading, SensorState), where its name is already shown. */
  metric?: Metric;
}
