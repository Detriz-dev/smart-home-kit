import styles from "./DeviceCommunicationStatus.module.css";
import type {
  ConnectionStatus,
  DeviceCommunicationStatusProps,
} from "./DeviceCommunicationStatus.types";

/** The text shown for each Connection Status. */
const LABELS: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  connected: "Connected",
  stale: "Stale",
  disconnected: "Disconnected",
};

/** Shows a Device's Connection Status: a label and a coloured indicator. Takes props only, never fetches data. */
export function DeviceCommunicationStatus({
  status,
}: DeviceCommunicationStatusProps) {
  return (
    <span role="status" data-status={status} className={styles.root}>
      <span className={styles.label}>{LABELS[status]}</span>
      <span className={styles.indicator} />
    </span>
  );
}
