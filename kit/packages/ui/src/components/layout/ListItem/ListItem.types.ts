import type { ReactNode } from "react";

/** The parts every row can have, clickable or not. */
interface ListItemBaseProps {
  /** Shown on the left, e.g. `<Icon name="countertops" />` or a `SensorLabel`. Never shrinks. */
  start?: ReactNode;
  /** A second line under the title, e.g. "Ground floor". Plain text, one line, ends with "…" when too long. */
  description?: string;
  /** Shown under the description, e.g. a list of `DeviceFaultStatus`. For content too long for the right side. */
  details?: ReactNode;
  /** Shown on the right, e.g. a `SensorReading` or a `DeviceConnectionStatus`. Never shrinks. */
  end?: ReactNode;
}

/** A row that isn't clickable. */
export interface ListItemStaticProps extends ListItemBaseProps {
  /** The row's name, plain text, e.g. "Kitchen". One line, ends with "…" when too long. */
  title?: string;
  /** Only on a clickable row. */
  href?: never;
  /** Only on a clickable row. */
  onClick?: never;
}

/** A row that is a link: tapping anywhere on it opens `href`. */
export interface ListItemLinkProps extends ListItemBaseProps {
  /** The row's name, plain text, e.g. "Kitchen". Required: it is the link's text, so screen readers hear "Kitchen, link". */
  title: string;
  /** Where the row leads, e.g. `/spaces/kitchen`. It uses the app's router through `LinkProvider`. */
  href: string;
  /** A row is a link or a button, not both. */
  onClick?: never;
}

/** A row that is a button: tapping anywhere on it calls `onClick`. */
export interface ListItemButtonProps extends ListItemBaseProps {
  /** The row's name, plain text, e.g. "Kitchen". Required: it is the button's text, so screen readers hear "Kitchen, button". */
  title: string;
  /** Called when the row is tapped, clicked, or activated with Enter or Space. */
  onClick: () => void;
  /** A row is a link or a button, not both. */
  href?: never;
}

/**
 * The props of `ListItem`. Three shapes, the same as `Card`:
 * a clickable row (`href` or `onClick`) needs a `title`, and can't have both `href` and `onClick`.
 */
export type ListItemProps =
  ListItemStaticProps | ListItemLinkProps | ListItemButtonProps;
