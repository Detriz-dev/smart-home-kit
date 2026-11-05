import type { ReactNode } from "react";

/** What kind of message it is. Sets the colour, the icon and how screen readers announce it. */
export type InlineMessageTone = "info" | "success" | "warning" | "error";

export interface InlineMessageProps {
  /** What kind of message it is: `info` (worth knowing), `success` (it worked), `warning` (it worked, but not fully) or `error` (it failed). */
  tone: InlineMessageTone;
  /** A short bold line above the message, e.g. "Couldn't load Readings". Left out, only the message shows. */
  title?: string;
  /** The message, e.g. "Check that the Hub is on the same network." */
  children: ReactNode;
  /** The action's text, e.g. "Retry". The action only shows when `onAction` is given too. */
  actionLabel?: string;
  /** Called when the action is clicked. The action only shows when `actionLabel` is given too. */
  onAction?: () => void;
  /** Called when × is clicked. The parent removes the message. Left out, there is no ×. */
  onDismiss?: () => void;
  /** What screen readers say for ×. Change it for other languages. Defaults to `"Dismiss"`. */
  dismissLabel?: string;
}
