import type { IconName } from "../../../icons/Icon";

/** How the button looks. `ghost` is icon only, for bars and cards; `secondary` has `Button` secondary's outline. */
export type IconButtonVariant = "ghost" | "secondary";

export interface IconButtonProps {
  /** The icon, e.g. `refresh`. Decorative: the button is named by `label`. */
  icon: IconName;
  /** What the button does, e.g. "Refresh Readings". Read by screen readers and shown as a tooltip on hover. */
  label: string;
  /** Called when the button is clicked or activated with Enter or Space. Not called while disabled. */
  onClick: () => void;
  /** How the button looks. Defaults to `"ghost"`. */
  variant?: IconButtonVariant;
  /** Greys the button out and ignores clicks, e.g. Refresh while Readings are loading. Defaults to `false`. */
  isDisabled?: boolean;
}
