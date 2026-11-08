import { Icon } from "../../../icons/Icon";
import { READING_STATUS_ICONS } from "../../../icons/purposeIcons";
import styles from "./ControlParts.module.css";

/** The shared CSS classes: `root`, `row`, `name`, `actions`. */
export const controlStyles = styles;

/** What the message line under a Control says. */
export interface ControlMessageData {
  /** The words, e.g. "Turning on…". */
  text: string;
  /** `secondary` for progress and hints, `danger` for failures. */
  tone: "secondary" | "danger";
  /** A spinning loading icon (Pending) or the fault icon (Failed). */
  icon?: "loading" | "fault";
}

/** The message line. Always rendered (empty when there is no message), so screen readers announce new messages. */
export function ControlMessage({
  id,
  message,
}: {
  id: string;
  message: ControlMessageData | null;
}) {
  return (
    <div
      id={id}
      role="status"
      data-tone={message?.tone}
      className={styles.message}
    >
      {message?.icon && (
        <span data-icon={message.icon} className={styles.icon}>
          <Icon name={READING_STATUS_ICONS[message.icon]} size="xs" />
        </span>
      )}
      {message?.text}
    </div>
  );
}

/** The loading or disconnected icon that takes the place of a Control's input. */
export function ControlStatusIcon({
  status,
}: {
  status: "loading" | "disconnected";
}) {
  return (
    <span data-status={status} className={styles.status}>
      <Icon
        name={READING_STATUS_ICONS[status]}
        label={status === "loading" ? "Loading" : "Disconnected"}
        size="sm"
      />
    </span>
  );
}

/** "Couldn't {verb}. {why}", the Failed message of every Control. */
export function failedText(verb: string, failureMessage?: string): string {
  return `Couldn't ${verb}. ${failureMessage ?? "The device didn't respond."}`;
}
