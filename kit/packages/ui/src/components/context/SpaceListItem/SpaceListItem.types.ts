import type { AlertLevel } from "../../../types/alert";
import type { SpaceType } from "../../../types/spaceType";

/** What every Space row shows. */
interface SpaceListItemBaseProps {
  /** The Space's name, e.g. "Kitchen". Plain text, ends with "…" when too long. */
  name: string;
  /** The Space's Space Type, e.g. `kitchen`. Decides the icon. */
  spaceType: SpaceType;
  /** The Floor the Space is on, e.g. "Ground floor". Leave it out when the Site has no Floors, or inside a Floor section. */
  floorName?: string;
  /** How many Devices are in the Space: Hubs and Standalone Devices placed there, and Modules through their Hub. Shown as "3 Devices". Leave it out to hide it. */
  deviceCount?: number;
  /** How many Alerts are Active in the Space. Shown as a Badge; 0 or unset shows nothing. */
  activeAlertCount?: number;
  /** The highest Alert Level among the Active Alerts. Colours the Badge. Defaults to `critical`. */
  highestAlertLevel?: AlertLevel;
}

/** A row that isn't clickable. */
interface SpaceListItemStaticAction {
  /** Only on a clickable row. */
  href?: never;
  /** Only on a clickable row. */
  onClick?: never;
}

/** A row that is a link, e.g. to the Space's screen. */
interface SpaceListItemLinkAction {
  /** Where the row leads, e.g. `/spaces/kitchen`. It uses the app's router through `LinkProvider`. */
  href: string;
  /** A row is a link or a button, not both. */
  onClick?: never;
}

/** A row that is a button. */
interface SpaceListItemButtonAction {
  /** Called when the row is tapped, clicked, or activated with Enter or Space. */
  onClick: () => void;
  /** A row is a link or a button, not both. */
  href?: never;
}

/** The props of `SpaceListItem`. TypeScript checks you never pass both `href` and `onClick`. */
export type SpaceListItemProps = SpaceListItemBaseProps &
  (
    | SpaceListItemStaticAction
    | SpaceListItemLinkAction
    | SpaceListItemButtonAction
  );
