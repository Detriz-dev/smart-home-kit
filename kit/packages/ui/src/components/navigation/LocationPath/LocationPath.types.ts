import type { DeviceKind } from "../../../types/deviceKind";

/** How the parts of a LocationPath are arranged: one line, two per row, or one per line. */
export type LocationPathLayout = "inline" | "grid" | "stack";

/** What every LocationPath takes. */
interface LocationPathBaseProps {
  /** Name of the Site, the top of the path. Leave out if the screen already shows it. */
  siteName?: string;
  /** Name of the Floor, e.g. "Level 2". Leave out if the Site doesn't use Floors. */
  floorName?: string;
  /** Name of the Space. Leave out if the Device has no Space yet. */
  spaceName?: string;
  /** How the parts are arranged. Defaults to `inline`. */
  layout?: LocationPathLayout;
}

/** A path that ends at a Device: its name and its Device Kind. */
interface LocationPathWithDevice {
  /** Name of the Device (Hub or Module) the path points to. */
  deviceName: string;
  /** Whether the Device is a Hub or a Module. Decides its icon and what screen readers hear ("Hub:", "Module:"). */
  deviceKind: DeviceKind;
}

/** A path that ends at a place: no Device. */
interface LocationPathWithoutDevice {
  /** Only with `deviceKind`. */
  deviceName?: never;
  /** Only with `deviceName`. */
  deviceKind?: never;
}

/** The props of `LocationPath`. TypeScript checks that `deviceName` and `deviceKind` come together. */
export type LocationPathProps = LocationPathBaseProps &
  (LocationPathWithDevice | LocationPathWithoutDevice);
