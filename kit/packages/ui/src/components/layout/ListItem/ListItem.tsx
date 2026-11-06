import styles from "./ListItem.module.css";
import type { ListItemProps } from "./ListItem.types";

/** One row of a List: start, title and description, end. Clickable when given `href` or `onClick`. Takes props only, never fetches data. */
export function ListItem({
  start,
  title,
  description,
  details,
  end,
  href,
  onClick,
}: ListItemProps) {
  const isInteractive = href !== undefined || onClick !== undefined;

  // The title is the row's one link or button. Its ::after layer stretches over the whole row (see the CSS),
  // the same pattern as Card.
  let titleElement = null;
  if (title !== undefined && href !== undefined) {
    titleElement = (
      <a href={href} className={styles.title} title={title}>
        {title}
      </a>
    );
  } else if (title !== undefined && onClick !== undefined) {
    titleElement = (
      <button
        type="button"
        onClick={onClick}
        className={styles.title}
        title={title}
      >
        {title}
      </button>
    );
  } else if (title !== undefined) {
    titleElement = (
      <span className={styles.title} title={title}>
        {title}
      </span>
    );
  }

  return (
    <li
      data-interactive={isInteractive ? "true" : undefined}
      className={styles.root}
    >
      {start !== undefined && <div className={styles.start}>{start}</div>}
      {(titleElement !== null ||
        description !== undefined ||
        details !== undefined) && (
        <div className={styles.text}>
          {titleElement}
          {description !== undefined && (
            <span className={styles.description} title={description}>
              {description}
            </span>
          )}
          {details !== undefined && (
            <div className={styles.details}>{details}</div>
          )}
        </div>
      )}
      {end !== undefined && <div className={styles.end}>{end}</div>}
    </li>
  );
}
