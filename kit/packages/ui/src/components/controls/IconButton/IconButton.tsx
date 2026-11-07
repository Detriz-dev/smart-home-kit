import { Icon } from "../../../icons/Icon";
import styles from "./IconButton.module.css";
import type { IconButtonProps } from "./IconButton.types";

/** A button with only an icon, like Refresh or Close. Takes props only: the parent decides what `onClick` does. */
export function IconButton({
  icon,
  label,
  onClick,
  variant = "ghost",
  isDisabled = false,
}: IconButtonProps) {
  return (
    // type="button" stops it from submitting a form by accident.
    // aria-label names it for screen readers; title shows the same name as a tooltip on hover.
    // The native `disabled` attribute ignores clicks, skips it with Tab and tells screen readers it's unavailable.
    <button
      type="button"
      data-variant={variant}
      disabled={isDisabled}
      aria-label={label}
      title={label}
      className={styles.root}
      onClick={onClick}
    >
      {/* Decorative: the button's name is its label. */}
      <Icon name={icon} />
    </button>
  );
}
