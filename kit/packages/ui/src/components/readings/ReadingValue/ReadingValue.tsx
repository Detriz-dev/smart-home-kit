import { Icon, type IconName } from "../../../icons/Icon";
import { formatReadingValue } from "../../../utils/formatReadingValue";
import styles from "./ReadingValue.module.css";
import type {
  ReadingValueProps,
  ReadingValueState,
} from "./ReadingValue.types";

/** The icon shown in place of the number, and what screen readers hear, for each state without a number. */
const ICONS: Record<
  Exclude<ReadingValueState, "default">,
  { name: IconName; label: string }
> = {
  loading: { name: "refresh", label: "Loading" },
  disconnected: { name: "link_off", label: "Disconnected" },
};

/** Shows the latest value of one Metric as a number, or an icon while loading or Disconnected. Takes props only, never fetches data. */
export function ReadingValue({
  value,
  isDisconnected = false,
  fractionDigits = 1,
  size = "lg",
}: ReadingValueProps) {
  // No number to show: Disconnected wins over loading.
  if (isDisconnected || value === null) {
    const state = isDisconnected ? "disconnected" : "loading";
    const icon = ICONS[state];

    return (
      <span data-state={state} data-size={size} className={styles.root}>
        <span className={styles.icon}>
          <Icon name={icon.name} label={icon.label} size={size} />
        </span>
      </span>
    );
  }

  return (
    <span data-state="default" data-size={size} className={styles.root}>
      <span className={styles.value}>
        {formatReadingValue(value, fractionDigits)}
      </span>
    </span>
  );
}
