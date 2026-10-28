import styles from "./DeviceConnectionStatus.module.css";
import type {
  ConnectionStatus,
  DeviceConnectionStatusProps,
} from "./DeviceConnectionStatus.types";

/** The text shown for each Connection Status. */
const LABELS: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  connected: "Connected",
  stale: "Stale",
  disconnected: "Disconnected",
};

/** Shows a Device's Connection Status: a label and a coloured indicator. Takes props only, never fetches data. */
export function DeviceConnectionStatus({
  status,
}: DeviceConnectionStatusProps) {
  return (
    <span role="status" data-status={status} className={styles.root}>
      <span className={styles.label}>{LABELS[status]}</span>
      <span className={styles.indicator} />
    </span>
  );
}
