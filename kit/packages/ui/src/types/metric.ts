/** A Metric whose value is a number with a Unit. From the Glossary. */
export type MeasuredMetric =
  "temperature" | "humidity" | "illuminance" | "co2" | "voc" | "pm25";

/** A Metric whose value is one of two States, with no Unit. From the Glossary. `co` is carbon monoxide, not CO₂. */
export type TwoStateMetric = "power" | "contact" | "motion" | "smoke" | "co";

/** The Two-state Metrics whose Detected State starts a Detection. */
export type DetectionMetric = Extract<
  TwoStateMetric,
  "motion" | "smoke" | "co"
>;

/** What a Sensor measures. The fixed list of Metrics from the Glossary: Measured Metrics and Two-state Metrics. */
export type Metric = MeasuredMetric | TwoStateMetric;
