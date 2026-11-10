import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

/** A text button for an action, like "Send prompt" or "Retry". Takes props only: the parent decides what `onClick` does. */
export function Button({
  children,
  onClick,
  variant = "secondary",
  size = "md",
  isDisabled = false,
}: ButtonProps) {
  return (
    // type="button" stops it from submitting a form by accident.
    // The native `disabled` attribute ignores clicks, skips the button with Tab and tells screen readers it's unavailable.
    <button
      type="button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      className={styles.root}
      onClick={onClick}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
}
