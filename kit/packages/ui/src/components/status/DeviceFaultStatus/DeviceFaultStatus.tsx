import { Icon } from "../../../icons/Icon";
import { READING_STATUS_ICONS } from "../../../icons/purposeIcons";
import { FAULT_NAMES } from "../../../utils/faultNames";
import { METRIC_NAMES } from "../../../utils/metricNames";
import styles from "./DeviceFaultStatus.module.css";
import type { DeviceFaultStatusProps } from "./DeviceFaultStatus.types";

/** Shows a Device's Fault: a danger icon and a short message. Takes props only, never fetches data. */
export function DeviceFaultStatus({
  faultCode,
  metric,
}: DeviceFaultStatusProps) {
  const { alone, afterMetric } = FAULT_NAMES[faultCode];
  const names = metric ? METRIC_NAMES[metric] : undefined;
  const message = names ? `${names.label} ${afterMetric}` : alone;

  return (
    <span role="status" data-fault-code={faultCode} className={styles.root}>
      {/* The icon is decorative: the message next to it says the same thing. */}
      <Icon name={READING_STATUS_ICONS.fault} size="xs" />
      {/* When there is a spoken name, screen readers skip the message and read that instead ("carbon dioxide sensor failure"). */}
      <span
        aria-hidden={names?.spokenName ? "true" : undefined}
        className={styles.label}
      >
        {message}
      </span>
      {names?.spokenName && (
        <span className={styles.spokenMessage}>
          {names.spokenName} {afterMetric}
        </span>
      )}
    </span>
  );
}
