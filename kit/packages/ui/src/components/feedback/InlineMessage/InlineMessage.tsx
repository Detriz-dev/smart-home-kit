import type { IconName } from "../../../icons/generated/paths";
import { Icon } from "../../../icons/Icon";
import { Button } from "../../controls/Button";
import styles from "./InlineMessage.module.css";
import type {
  InlineMessageProps,
  InlineMessageTone,
} from "./InlineMessage.types";

/** The filled icon for each tone. Warning is the only triangle, so it can't be mixed up with error in greyscale. */
const ICONS: Record<InlineMessageTone, IconName> = {
  info: "info-fill",
  success: "check_circle-fill",
  warning: "warning-fill",
  error: "error-fill",
};

/** How screen readers announce each tone: `status` waits politely, `alert` speaks straight away. */
const ROLES: Record<InlineMessageTone, "status" | "alert"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};

/** A short message in the page about what the app did or couldn't do. Takes props only: the parent decides when to show it, what the action does and what happens on dismiss. */
export function InlineMessage({
  tone,
  title,
  children,
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = "Dismiss",
}: InlineMessageProps) {
  return (
    <div role={ROLES[tone]} data-tone={tone} className={styles.root}>
      <div className={styles.content}>
        {/* Decorative: the title and message say the same thing. The span carries the tone colour. */}
        <span className={styles.icon}>
          <Icon name={ICONS[tone]} size="md" />
        </span>
        <div className={styles.text}>
          {title && <p className={styles.title}>{title}</p>}
          <p className={styles.message}>{children}</p>
        </div>
        {/* Only shown when both the text and the handler are given. */}
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
      {onDismiss && (
        // type="button" stops it from submitting a form by accident. The label is for screen readers: the × has no text.
        <button
          type="button"
          aria-label={dismissLabel}
          className={styles.dismiss}
          onClick={onDismiss}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
