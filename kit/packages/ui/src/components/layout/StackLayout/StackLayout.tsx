import styles from "./StackLayout.module.css";
import type { StackLayoutProps } from "./StackLayout.types";

/** Places children in one column with an even gap. Adds only spacing: no background, border or padding. */
export function StackLayout({ children, gap = "md" }: StackLayoutProps) {
  return (
    <div data-gap={gap} className={styles.root}>
      {children}
    </div>
  );
}
