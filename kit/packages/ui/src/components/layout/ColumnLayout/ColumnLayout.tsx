import styles from "./ColumnLayout.module.css";
import type { ColumnLayoutProps } from "./ColumnLayout.types";

/** Places children side by side and falls back to one column when its own width is narrow. Adds only spacing. */
export function ColumnLayout({ children, ratio = "equal" }: ColumnLayoutProps) {
  return (
    <div className={styles.root}>
      <div data-ratio={ratio} className={styles.columns}>
        {children}
      </div>
    </div>
  );
}
