import type { MeasuredMetric } from "../../../types/metric";
import type { UnitLabelUnit } from "../UnitLabel";

/** How big the value and the Unit are drawn. Passed to ReadingValue and UnitLabel. Only the two card sizes. */
export type SensorReadingSize = "lg" | "md";

export interface SensorReadingProps {
  /** The Measured Metric the Sensor measures, e.g. `temperature`. Decides the label and its icon. State Metrics (Power, Contact…) have no number, so they aren't accepted. */
  metric: MeasuredMetric;
  /** The latest value of the Reading. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show, e.g. `celsius`. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** True when the Module's Connection Status is Disconnected. Hides the value and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
  /** How big the value and the Unit are drawn. Defaults to `lg`. */
  size?: SensorReadingSize;
}
