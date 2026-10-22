import { iconPaths } from "../generated/paths";
import styles from "./Icon.module.css";
import type { IconProps } from "./Icon.types";

/** Shows one icon from the kit's icon set. Its colour comes from the surrounding text colour. */
export function Icon({ name, size = "md", label }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      data-size={size}
      className={styles.root}
      // With a label the icon means something, so screen readers announce it as an image.
      // Without one it's decorative, so screen readers skip it.
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
