import styles from "./Switch.module.css";
import type { SwitchProps } from "./Switch.types";

/** An on/off switch that shows "On" or "Off". Takes props only: the parent keeps the value and reacts to `onChange`. */
export function Switch({
  isOn,
  onChange,
  ariaLabel,
  ariaDescribedBy,
  isDisabled = false,
}: SwitchProps) {
  return (
    // Wrapping the button in a <label> makes the "On"/"Off" text clickable too.
    <label className={styles.root}>
      {/* role="switch" + aria-checked tells screen readers it is an on/off switch, not a plain button. */}
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        disabled={isDisabled}
        className={styles.track}
        onClick={() => onChange(!isOn)}
      >
        <span className={styles.thumb} />
      </button>
      {/* Hidden from screen readers: aria-checked already says on or off. */}
      <span aria-hidden="true" className={styles.state}>
        {isOn ? "On" : "Off"}
      </span>
    </label>
  );
}
