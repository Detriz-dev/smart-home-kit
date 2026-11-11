import styles from "./IconTile.module.css";
import type { IconTileProps } from "./IconTile.types";

/** A small 32px box around an icon: the app background colour with a light outline. Gives list rows a steady start. Takes props only. */
export function IconTile({ children }: IconTileProps) {
  // A plain <span>: it only frames the icon. Screen readers hear the icon itself (or nothing, if it is decorative).
  return <span className={styles.root}>{children}</span>;
}
