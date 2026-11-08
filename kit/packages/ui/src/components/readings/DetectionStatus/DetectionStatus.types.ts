import type { AlertLevel } from "../../../types/alert";
import type { DetectionMetric } from "../../../types/metric";
import type { StateOf } from "../../../types/state";

/** How big it is drawn: `md` for rows, `lg` for cards. */
export type DetectionStatusSize = "md" | "lg";

export interface DetectionStatusProps {
  /** The Detection Metric the Sensor measures: `motion`, `smoke` or `co`. Decides the icon. */
  metric: DetectionMetric;
  /** The latest State. `null` while the first Reading is on its way. */
  state: StateOf<DetectionMetric> | null;
  /** When the current Detection started: the first Detected Reading. Shown as "since 14:02 · 3 min" while Detected. */
  detectedSince?: Date;
  /** When the last Detection ended: the Clear Reading after it. Shown as "Last: 2 h ago" while Clear. Leave it out when there was never a Detection ("None yet"). */
  lastDetectedAt?: Date;
  /** True when the Module's Connection Status is Disconnected. Hides the State and the time. */
  isDisconnected?: boolean;
  /** The Alert Level of an Active Alert about this Reading. Colours the State pill. */
  alertLevel?: AlertLevel;
  /** The current time. Leave it out to use the real clock. Pass it to fix the text, e.g. in tests. */
  now?: Date;
  /** How big it is drawn. Defaults to `md`. */
  size?: DetectionStatusSize;
}
