import styles from "./DevicePairingStatus.module.css";
import type {
  DevicePairingStatusProps,
  PairingStatus,
} from "./DevicePairingStatus.types";

/** The text shown for each Pairing Status. */
const LABELS: Record<PairingStatus, string> = {
  unpaired: "Unpaired",
  pairing: "Pairing",
  paired: "Paired",
};

/** Shows a Device's Pairing Status: a label and a coloured indicator. Takes props only, never fetches data. */
export function DevicePairingStatus({ status }: DevicePairingStatusProps) {
  return (
    <span role="status" data-status={status} className={styles.root}>
      <span className={styles.label}>{LABELS[status]}</span>
      <span className={styles.indicator} />
    </span>
  );
}
