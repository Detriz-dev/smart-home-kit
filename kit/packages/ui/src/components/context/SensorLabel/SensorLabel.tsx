import { Icon, type IconName, type IconSize } from "../../../icons/Icon";
import styles from "./SensorLabel.module.css";
import type {
  SensorLabelMetric,
  SensorLabelProps,
  SensorLabelSize,
} from "./SensorLabel.types";

/**
 * The label, icon and (only where the label reads oddly) the spoken name for each Metric.
 * "CO₂" uses the subscript ₂ (U+2082), the same character as the glossary.
 */
const METRICS: Record<
  SensorLabelMetric,
  { label: string; icon: IconName; spokenName?: string }
> = {
  temperature: { label: "Temperature", icon: "thermometer" },
  humidity: { label: "Humidity", icon: "humidity_percentage" },
  illuminance: { label: "Illuminance", icon: "light_mode" },
  co2: { label: "CO₂", icon: "co2", spokenName: "carbon dioxide" },
  voc: { label: "VOC", icon: "airwave" },
  pm25: { label: "PM2.5", icon: "grain", spokenName: "PM 2.5" },
};

/** Which Icon size each size uses. lg keeps the 24px icon: a 32px one looked too heavy next to 18px text. */
const ICON_SIZES: Record<SensorLabelSize, IconSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
};

/** Says what a Sensor measures: an icon and the name of its Metric, e.g. Temperature. Takes props only, never fetches data. */
export function SensorLabel({ metric, size = "xs" }: SensorLabelProps) {
  const { label, icon, spokenName } = METRICS[metric];

  return (
    <span data-size={size} className={styles.root}>
      {/* The icon is decorative: the label next to it says the same thing. */}
      <Icon name={icon} size={ICON_SIZES[size]} />
      {/* When there is a spoken name, screen readers skip the label and read that instead ("carbon dioxide"). */}
      <span
        aria-hidden={spokenName ? "true" : undefined}
        className={styles.label}
        title={label}
      >
        {label}
      </span>
      {spokenName && <span className={styles.spokenName}>{spokenName}</span>}
    </span>
  );
}
