import { Icon } from "../../../icons/Icon";
import { ACTION_ICONS } from "../../../icons/purposeIcons";
import type { IconName } from "../../../icons/Icon";
import type { AlertLevel } from "../../../types/alert";
import { RelativeTime } from "../../context/RelativeTime";
import { Button } from "../../controls/Button";
import styles from "./AlertBanner.module.css";
import type { AlertBannerProps } from "./AlertBanner.types";

/** The outline Alert Level icons, shown in white on the coloured tile. Other Alert components use the filled ones (`ALERT_LEVEL_ICONS`). */
const TILE_ICONS: Record<AlertLevel, IconName> = {
  critical: "error",
  warning: "warning",
  info: "info",
};

/** How screen readers announce each level: `alert` speaks straight away, `status` waits politely. */
const ROLES: Record<AlertLevel, "alert" | "status"> = {
  critical: "alert",
  warning: "alert",
  info: "status",
};

/** A strong message at the top of a screen for one Active Alert: what happened, where, when, an action and ×. Takes props only: the parent decides when to show it and what the action and × do. */
export function AlertBanner({
  title,
  alertLevel,
  raisedAt,
  spaceName,
  actionLabel,
  onAction,
  onClose,
  closeLabel = "Close alert",
  now,
}: AlertBannerProps) {
  return (
    <div
      role={ROLES[alertLevel]}
      data-level={alertLevel}
      className={styles.root}
    >
      <div className={styles.content}>
        {/* Decorative: the title says what happened; the coloured tile adds urgency. */}
        <span className={styles.icon}>
          <Icon name={TILE_ICONS[alertLevel]} size="md" />
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.meta}>
            {spaceName && (
              <>
                {spaceName}
                <span aria-hidden="true"> · </span>
              </>
            )}
            <RelativeTime time={raisedAt} now={now} size="sm" />
          </p>
        </div>
        {/* Only shown when both the text and the handler are given. */}
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
      {onClose && (
        // type="button" stops it from submitting a form by accident. The label is for screen readers: the × has no text.
        <button
          type="button"
          aria-label={closeLabel}
          className={styles.close}
          onClick={onClose}
        >
          <Icon name={ACTION_ICONS.dismiss} size="sm" />
        </button>
      )}
    </div>
  );
}
