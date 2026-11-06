import { useId } from "react";
import styles from "./Card.module.css";
import type { CardProps } from "./Card.types";

/** The plain card surface with an optional header and footer. Clickable when given `href` or `onClick`. Takes props only, never fetches data. */
export function Card({
  title,
  headerEnd,
  children,
  footer,
  href,
  onClick,
}: CardProps) {
  const titleId = useId();
  const isInteractive = href !== undefined || onClick !== undefined;
  const hasTitle = title !== undefined;
  const hasHeader = hasTitle || headerEnd !== undefined;

  // The title is the card's one link or button. Its ::after layer stretches over the whole card (see the CSS),
  // so the whole card can be tapped while screen readers hear one short name.
  let titleElement = null;
  if (hasTitle && href !== undefined) {
    titleElement = (
      <a id={titleId} href={href} className={styles.title} title={title}>
        {title}
      </a>
    );
  } else if (hasTitle && onClick !== undefined) {
    titleElement = (
      <button
        id={titleId}
        type="button"
        onClick={onClick}
        className={styles.title}
        title={title}
      >
        {title}
      </button>
    );
  } else if (hasTitle) {
    titleElement = (
      <span id={titleId} className={styles.title} title={title}>
        {title}
      </span>
    );
  }

  // A static card with a title is a named group. A clickable card isn't: its link already says the name.
  const isGroup = hasTitle && !isInteractive;

  return (
    <div
      role={isGroup ? "group" : undefined}
      aria-labelledby={isGroup ? titleId : undefined}
      data-interactive={isInteractive ? "true" : undefined}
      className={styles.root}
    >
      {hasHeader && (
        <div className={styles.header}>
          {titleElement}
          {headerEnd !== undefined && (
            <div className={styles.headerEnd}>{headerEnd}</div>
          )}
        </div>
      )}
      {/* No wrapper: the children sit straight in root, which sets the gap. */}
      {children}
      {footer !== undefined && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
