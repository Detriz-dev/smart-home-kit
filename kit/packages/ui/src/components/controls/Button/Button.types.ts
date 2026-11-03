import type { ReactNode } from "react";

/** How much weight the action has. `primary` is the one main action in a place, `secondary` is every other action. */
export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
  /** The text on the button, e.g. "Send prompt", or a Space name such as "Living room" when it answers a clarifying question. */
  children: ReactNode;
  /** Called when the button is clicked or activated with Enter or Space. Not called while disabled. */
  onClick: () => void;
  /** How much weight the action has. Defaults to `"secondary"`. */
  variant?: ButtonVariant;
  /** Greys the button out and ignores clicks, e.g. "Send prompt" while a screen builds. Defaults to `false`. */
  isDisabled?: boolean;
}
