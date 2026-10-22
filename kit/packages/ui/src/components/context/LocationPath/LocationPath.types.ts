/** How the parts of a LocationPath are arranged: one line, two per row, or one per line. */
export type LocationPathLayout = "inline" | "grid" | "stack";

export interface LocationPathProps {
  /** Name of the Site, the top of the path. Leave out if the screen already shows it. */
  siteName?: string;
  /** Name of the Floor, e.g. "Level 2". Leave out if the Site doesn't use Floors. */
  floorName?: string;
  /** Name of the Space. Leave out if the Device has no Space yet. */
  spaceName?: string;
  /** Name of the Device (Hub or Module) the path points to. */
  deviceName?: string;
  /** How the parts are arranged. Defaults to `inline`. */
  layout?: LocationPathLayout;
}
