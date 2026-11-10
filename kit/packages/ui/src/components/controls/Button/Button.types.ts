import type { ReactNode } from "react";

/** How much weight the action has. `primary` is the one main action in a place, `secondary` is every other action. */
export type ButtonVariant = "primary" | "secondary";

/** How big the button is. `md` is 44px tall, easy to tap. `sm` is 32px, for tight places inside another component, e.g. AlertBanner. */
export type ButtonSize = "md" | "sm";

export interface ButtonProps {
  /** The text on the button, e.g. "Send prompt", or a Space name such as "Living room" when it answers a clarifying question. */
  children: ReactNode;
  /** Called when the button is clicked or activated with Enter or Space. Not called while disabled. */
  onClick: () => void;
  /** How much weight the action has. Defaults to `"secondary"`. */
  variant?: ButtonVariant;
  /** How big the button is. Defaults to `"md"` (44px). Use `"sm"` (32px) only inside compact components, where the row around it is already easy to hit. */
  size?: ButtonSize;
  /** Greys the button out and ignores clicks, e.g. "Send prompt" while a screen builds. Defaults to `false`. */
  isDisabled?: boolean;
}
