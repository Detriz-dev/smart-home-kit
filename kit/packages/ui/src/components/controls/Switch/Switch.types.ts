export interface SwitchProps {
  /** Whether the switch is on. The parent owns this value. The switch shows "On" or "Off" next to it. */
  isOn: boolean;
  /** Called with the new value when the user flips the switch. */
  onChange: (isOn: boolean) => void;
  /** Name read by screen readers only, e.g. "Heating". Not shown on screen: the parent shows its own label. */
  ariaLabel: string;
  /** Greys the switch out and ignores clicks, e.g. while the Device is Disconnected. Defaults to `false`. */
  isDisabled?: boolean;
}
