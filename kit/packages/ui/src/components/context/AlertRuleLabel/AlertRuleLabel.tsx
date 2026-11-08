import { Icon, type IconSize } from "../../../icons/Icon";
import { ALERT_ICONS } from "../../../icons/purposeIcons";
import { STATE_NAMES } from "../../../utils/stateNames";
import { UNIT_NAMES } from "../../../utils/unitNames";
import styles from "./AlertRuleLabel.module.css";
import type {
  AlertRuleLabelProps,
  AlertRuleLabelSize,
} from "./AlertRuleLabel.types";

/** Which Icon size each size uses. */
const ICON_SIZES: Record<AlertRuleLabelSize, IconSize> = {
  xs: "xs",
  sm: "sm",
};

/** Thresholds are shown as written: 28 stays "28", 28.5 stays "28.5" (in the browser's language, e.g. "28,5"). */
const thresholdFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

/** Shows an Alert Rule in a few words, e.g. "Alert above 28 °C" or "Alert when Open". Secondary text, no Alert Level colour: a rule isn't an Alert. Takes props only, never fetches data. */
export function AlertRuleLabel({
  condition,
  unit,
  size = "xs",
}: AlertRuleLabelProps) {
  return (
    <span data-size={size} className={styles.root}>
      {/* The icon is decorative: the text starts with "Alert". */}
      <Icon name={ALERT_ICONS.default} size={ICON_SIZES[size]} />
      <span className={styles.text}>
        {"state" in condition ? (
          `Alert when ${STATE_NAMES[condition.state]}`
        ) : (
          <>
            {`Alert ${condition.comparison} ${thresholdFormat.format(condition.value)}`}
            {unit && (
              <>
                {" "}
                {/* Screen readers skip the symbol and read the spoken name, the same as UnitLabel. */}
                <span aria-hidden="true">{UNIT_NAMES[unit].symbol}</span>
                <span className={styles.spokenName}>
                  {UNIT_NAMES[unit].spokenName}
                </span>
              </>
            )}
          </>
        )}
      </span>
    </span>
  );
}
