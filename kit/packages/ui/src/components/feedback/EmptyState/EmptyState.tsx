import { Icon } from "../../../icons/Icon";
import { Button } from "../../controls/Button";
import styles from "./EmptyState.module.css";
import type { EmptyStateProps } from "./EmptyState.types";

/** What a list or screen shows when there is nothing in it yet: an icon, a title, a message and one optional action. Not for loading or errors. Takes props only. */
export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className={styles.root}>
      {/* Decorative: the title says what is missing. */}
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size="lg" />
        </span>
      )}
      <p className={styles.title}>{title}</p>
      {message && <p className={styles.message}>{message}</p>}
      {/* Only shown when both the text and the handler are given. */}
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
