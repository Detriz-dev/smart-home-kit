import type { Metric } from "../../../types/metric";

/** The Metric a Sensor measures. Decides the label and the icon. */
export type SensorLabelMetric = Metric;

/** How big the label is drawn: xs (caption text, 16px icon) up to lg (body-lg text, 24px icon). */
export type SensorLabelSize = "xs" | "sm" | "md" | "lg";

export interface SensorLabelProps {
  /** The Metric the Sensor measures, e.g. `temperature`. The label text and the icon follow from it. */
  metric: SensorLabelMetric;
  /** How big the label is drawn. Defaults to `xs`. */
  size?: SensorLabelSize;
}
