export interface SwitchProps {
  /** Whether the switch is on. The parent owns this value. The switch shows "On" or "Off" next to it. */
  isOn: boolean;
  /** Called with the new value when the user flips the switch. */
  onChange: (isOn: boolean) => void;
  /** Name read by screen readers only, e.g. "Show temperature in °F". Not shown on screen: the parent shows the same name as its own text. */
  ariaLabel: string;
  /** The id of an element that explains the switch, e.g. why it is disabled ("View only"). Screen readers read it after the name. */
  ariaDescribedBy?: string;
  /** Greys the switch out and ignores clicks, e.g. while the setting's value is still loading. Defaults to `false`. */
  isDisabled?: boolean;
}
