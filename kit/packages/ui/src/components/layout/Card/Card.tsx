import { useId } from "react";
import { Icon } from "../../../icons/Icon";
import { KitLink } from "../../../link";
import styles from "./Card.module.css";
import type { CardProps } from "./Card.types";

/** A raised card: an optional header strip in the app background colour, then a white body with the content and an optional footer. Clickable when given `href` or `onClick`. Takes props only, never fetches data. */
export function Card({
  icon,
  title,
  headerEnd,
  children,
  footer,
  padding = "md",
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
      <KitLink id={titleId} href={href} className={styles.title} title={title}>
        {title}
      </KitLink>
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
          {/* Decorative: the title next to it already says the name, so Icon hides it from screen readers. */}
          {icon !== undefined && hasTitle && (
            <span className={styles.icon}>
              <Icon name={icon} size="md" />
            </span>
          )}
          {titleElement}
          {headerEnd !== undefined && (
            <div className={styles.headerEnd}>{headerEnd}</div>
          )}
        </div>
      )}
      {/* The white body: the content, then the footer. It sets the 12px gap between them. */}
      <div data-padding={padding} className={styles.body}>
        {children}
        {footer !== undefined && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
