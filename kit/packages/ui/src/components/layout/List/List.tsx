import styles from "./List.module.css";
import type { ListProps } from "./List.types";

/** A group of ListItem rows, one under the other, with optional lines between them. Takes props only, never fetches data. */
export function List({ children, hasDividers = false, label }: ListProps) {
  return (
    // role="list": Safari stops treating a list as a list once its bullets are removed.
    <ul
      role="list"
      aria-label={label}
      data-dividers={hasDividers ? "true" : undefined}
      className={styles.root}
    >
      {children}
    </ul>
  );
}
