import type { AlertLevel, AlertStatus } from "../../../types/alert";

/** What every Alert row shows. */
interface AlertListItemBaseProps {
  /** What happened, in your app's words, e.g. "Smoke detected" or "Kitchen above 28 °C". Plain text. */
  title: string;
  /** The Alert Level. Decides the icon and, while Active, its colour. */
  alertLevel: AlertLevel;
  /** Where the Alert is in its life: `active`, `ended` or `closed`. */
  alertStatus: AlertStatus;
  /** When the Alert was raised. Shown while Active ("2 min ago"). */
  raisedAt: Date;
  /** When the Alert ended or was closed. Shown once it is Ended or Closed; falls back to `raisedAt`. */
  endedAt?: Date;
  /** Where the Alert is, e.g. the Space "Kitchen". Leave it out when the screen is already about that place. */
  spaceName?: string;
  /** The current time. Leave it out to use the real clock. Pass it to fix the text, e.g. in tests. */
  now?: Date;
}

/** A row that isn't clickable. */
interface AlertListItemStaticAction {
  /** Only on a clickable row. */
  href?: never;
  /** Only on a clickable row. */
  onClick?: never;
}

/** A row that is a link, e.g. to the Alert's own screen. */
interface AlertListItemLinkAction {
  /** Where the row leads, e.g. `/alerts/42`. It uses the app's router through `LinkProvider`. */
  href: string;
  /** A row is a link or a button, not both. */
  onClick?: never;
}

/** A row that is a button. */
interface AlertListItemButtonAction {
  /** Called when the row is tapped, clicked, or activated with Enter or Space. */
  onClick: () => void;
  /** A row is a link or a button, not both. */
  href?: never;
}

/** The props of `AlertListItem`. TypeScript checks you never pass both `href` and `onClick`. */
export type AlertListItemProps = AlertListItemBaseProps &
  (
    | AlertListItemStaticAction
    | AlertListItemLinkAction
    | AlertListItemButtonAction
  );
