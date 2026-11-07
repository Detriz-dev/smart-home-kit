import { Icon, type IconName, type IconSize } from "../../../icons/Icon";
import { READING_STATUS_ICONS, STATE_ICONS } from "../../../icons/purposeIcons";
import type { State } from "../../../types/state";
import { ACTIVE_STATES, STATE_NAMES } from "../../../utils/stateNames";
import styles from "./StateValue.module.css";
import type {
  StateValueProps,
  StateValueSize,
  StateValueVisualState,
} from "./StateValue.types";

/** Which Icon size each size uses. */
const ICON_SIZES: Record<StateValueSize, IconSize> = { md: "sm", lg: "md" };

/** Shows the latest State of a Two-state Metric as a pill: an icon and the State's name, like "On". Read-only. Takes props only, never fetches data. */
export function StateValue({
  metric,
  state,
  isDisconnected = false,
  alertLevel,
  size = "md",
}: StateValueProps) {
  const iconSize = ICON_SIZES[size];

  // No State to show: Disconnected wins over loading, like ReadingValue.
  if (isDisconnected || state === null) {
    const visual = isDisconnected ? "disconnected" : "loading";
    return (
      <span data-state={visual} data-size={size} className={styles.root}>
        <span className={styles.icon}>
          <Icon
            name={READING_STATUS_ICONS[visual]}
            label={isDisconnected ? "Disconnected" : "Loading"}
            size={iconSize}
          />
        </span>
      </span>
    );
  }

  // `metric` and `state` always match (the props type checks it), so this lookup is safe.
  const icons: Partial<Record<State, IconName>> = STATE_ICONS[metric];
  const visual: StateValueVisualState = alertLevel
    ? `alert-${alertLevel}`
    : ACTIVE_STATES.has(state)
      ? "active"
      : "inactive";

  return (
    <span data-state={visual} data-size={size} className={styles.root}>
      {/* The icon is decorative: the word next to it says the same thing. */}
      <span className={styles.icon}>
        <Icon name={icons[state] ?? STATE_ICONS.power.on} size={iconSize} />
      </span>
      <span className={styles.label}>{STATE_NAMES[state]}</span>
    </span>
  );
}
