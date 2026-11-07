import type { AlertLevel } from "../../../types/alert";

export interface AlertBannerProps {
  /** What happened, in your app's words, e.g. "Smoke detected". The same text as in AlertListItem. */
  title: string;
  /** The Alert Level. Decides the icon, the colours and how urgently screen readers announce it. */
  alertLevel: AlertLevel;
  /** When the Alert was raised. Shown as "2 min ago". */
  raisedAt: Date;
  /** Where the Alert is, e.g. the Space "Kitchen". Leave it out when the screen is already about that place. */
  spaceName?: string;
  /** The action's text, e.g. "View". The action only shows when `onAction` is given too. */
  actionLabel?: string;
  /** Called when the action is clicked, e.g. to open the Alert. The action only shows when `actionLabel` is given too. */
  onAction?: () => void;
  /** Called when × is clicked: the Close Alert command. Only the Site's owner may close an Alert, so leave it out for anyone else. Left out, there is no ×. */
  onClose?: () => void;
  /** What screen readers say for ×. Change it for other languages. Defaults to `"Close alert"`. */
  closeLabel?: string;
  /** The current time. Leave it out to use the real clock. Pass it to fix the text, e.g. in tests. */
  now?: Date;
}
