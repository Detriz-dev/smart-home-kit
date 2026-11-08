import type {
  ErrorReason,
  GeneralErrorReason,
} from "../../../types/operationalState";
import { FAULT_NAMES } from "../../../utils/faultNames";
import { StateValue } from "../StateValue";
import styles from "./OperationalStateValue.module.css";
import type { OperationalStateValueProps } from "./OperationalStateValue.types";

/** The kit's text for each general Error Reason. */
const GENERAL_REASONS: Record<GeneralErrorReason, string> = {
  "unable-to-start-or-resume": "Can't start",
  "unable-to-complete": "Couldn't finish",
  "command-invalid-in-state": "Can't do that now",
};

/** The text for an Error Reason: the Device's label, or the kit's text, plus the Fault that caused it ("Can't start: sensor failure"). */
function reasonText(reason: ErrorReason): string {
  const base =
    reason.label ??
    GENERAL_REASONS[reason.code as GeneralErrorReason] ??
    reason.code;
  return reason.faultCode
    ? `${base}: ${FAULT_NAMES[reason.faultCode].afterMetric}`
    : base;
}

/** Shows what a Device that runs a task is doing: its Operational State, plus the Phase while Running or the Error Reason while Error. Read-only. Takes props only, never fetches data. */
export function OperationalStateValue({
  state,
  phase,
  errorReason,
  isDisconnected = false,
  alertLevel,
  size = "md",
}: OperationalStateValueProps) {
  // The detail shows only with the State it belongs to (Data model rule 31), and never while Disconnected or loading.
  const showsDetail = !isDisconnected && state !== null;
  const detail =
    showsDetail && state === "running" && phase
      ? { text: phase, tone: "phase" }
      : showsDetail && state === "error" && errorReason
        ? { text: reasonText(errorReason), tone: "error" }
        : null;

  return (
    <span data-size={size} className={styles.root}>
      <StateValue
        metric="operational-state"
        state={state}
        isDisconnected={isDisconnected}
        alertLevel={alertLevel}
        size={size}
      />
      {detail && (
        <span data-tone={detail.tone} className={styles.detail}>
          {detail.text}
        </span>
      )}
    </span>
  );
}
