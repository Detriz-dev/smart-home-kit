import { Icon, type IconSize } from "../../../icons/Icon";
import { METRIC_ICONS } from "../../../icons/purposeIcons";
import { METRIC_NAMES } from "../../../utils/metricNames";
import styles from "./SensorLabel.module.css";
import type { SensorLabelProps, SensorLabelSize } from "./SensorLabel.types";

/** Which Icon size each size uses. lg keeps the 24px icon: a 32px one looked too heavy next to 18px text. */
const ICON_SIZES: Record<SensorLabelSize, IconSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
};

/** Says what a Sensor measures: an icon and the name of its Metric, e.g. Temperature. Takes props only, never fetches data. */
export function SensorLabel({ metric, size = "xs" }: SensorLabelProps) {
  const { label, spokenName } = METRIC_NAMES[metric];

  return (
    <span data-size={size} className={styles.root}>
      {/* The icon is decorative: the label next to it says the same thing. */}
      <Icon name={METRIC_ICONS[metric]} size={ICON_SIZES[size]} />
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
