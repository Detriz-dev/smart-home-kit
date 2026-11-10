import type { ReactNode } from "react";
import type { IconName } from "../../../icons/Icon";

/** How much weight the action has. `primary` is the one main action in a place, `secondary` is every other action, `danger` is an action that removes or breaks something, e.g. "Unpair Module". */
export type ButtonVariant = "primary" | "secondary" | "danger";

/** How big the button is. `md` is 44px tall, easy to tap. `sm` is 32px, for tight places inside another component, e.g. AlertBanner. */
export type ButtonSize = "md" | "sm";

export interface ButtonProps {
  /** The text on the button, e.g. "Send prompt", or a Space name such as "Living room" when it answers a clarifying question. */
  children: ReactNode;
  /** Called when the button is clicked or activated with Enter or Space. Not called while disabled. */
  onClick: () => void;
  /** How much weight the action has. Defaults to `"secondary"`. Use `"danger"` for destructive actions, e.g. "Unpair Module". */
  variant?: ButtonVariant;
  /** An icon on the left of the text, e.g. `add` for "Add Alert Rule". 20px on `md`, 16px on `sm`, in the text's colour. Decorative: the text already says what the button does. */
  icon?: IconName;
  /** How big the button is. Defaults to `"md"` (44px). Use `"sm"` (32px) only inside compact components, where the row around it is already easy to hit. */
  size?: ButtonSize;
  /** Greys the button out and ignores clicks, e.g. "Send prompt" while a screen builds. Defaults to `false`. */
  isDisabled?: boolean;
}
