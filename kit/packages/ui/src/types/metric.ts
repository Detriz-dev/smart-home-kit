/** A Metric whose value is a number with a Unit. From the Glossary. Battery and Position are in %, Setpoint in the Unit of what it sets (°C for heating). */
export type MeasuredMetric =
  | "temperature"
  | "humidity"
  | "illuminance"
  | "co2"
  | "voc"
  | "pm25"
  | "battery"
  | "setpoint"
  | "position";

/** A Metric whose value is one of its own States (two or more), with no Unit. From the Glossary. `co` is carbon monoxide, not CO₂. */
export type StateMetric =
  | "power"
  | "contact"
  | "open-close"
  | "mode"
  | "operational-state"
  | "motion"
  | "smoke"
  | "co";

/** The State Metrics whose Detected State starts a Detection. */
export type DetectionMetric = Extract<StateMetric, "motion" | "smoke" | "co">;

/** What a Capability reports. The fixed list of Metrics from the Glossary: Measured Metrics and State Metrics. */
export type Metric = MeasuredMetric | StateMetric;
