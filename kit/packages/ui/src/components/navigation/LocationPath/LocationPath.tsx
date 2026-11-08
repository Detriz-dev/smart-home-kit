import type { DeviceKind } from "../../../types/deviceKind";
import { Icon, type IconName } from "../../../icons/Icon";
import { DEVICE_KIND_ICONS, PLACE_ICONS } from "../../../icons/purposeIcons";
import styles from "./LocationPath.module.css";
import type { LocationPathProps } from "./LocationPath.types";

/** One part of the path: which prop it reads, its icon, and the word screen readers hear before the name. */
interface PathPart {
  key: "site" | "floor" | "space" | "device";
  icon: IconName;
  kind: string;
}

/** The place parts in their fixed order: Site, Floor, Space. The Device comes last and is added below. */
const PLACE_PARTS: PathPart[] = [
  { key: "site", icon: PLACE_ICONS.site, kind: "Site" },
  { key: "floor", icon: PLACE_ICONS.floor, kind: "Floor" },
  { key: "space", icon: PLACE_ICONS.space, kind: "Space" },
];

/** What screen readers hear before the Device's name. A Standalone Device is just "Device", which is shorter to hear. */
const DEVICE_KIND_SPOKEN: Record<DeviceKind, string> = {
  hub: "Hub",
  module: "Module",
  standalone: "Device",
};

/** Shows where a Device is: its Site, Floor, Space and the Device itself, each with an icon. Takes props only, never fetches data. */
export function LocationPath({
  siteName,
  floorName,
  spaceName,
  deviceName,
  deviceKind,
  layout = "inline",
}: LocationPathProps) {
  const names = {
    site: siteName,
    floor: floorName,
    space: spaceName,
    device: deviceName,
  };
  // Parts without a name are skipped, never shown empty.
  const parts: PathPart[] = deviceKind
    ? [
        ...PLACE_PARTS,
        {
          key: "device",
          icon: DEVICE_KIND_ICONS[deviceKind],
          kind: DEVICE_KIND_SPOKEN[deviceKind],
        },
      ]
    : PLACE_PARTS;
  const shownParts = parts.filter((part) => names[part.key]);

  if (shownParts.length === 0) {
    return null;
  }

  return (
    <ol aria-label="Location" data-layout={layout} className={styles.root}>
      {shownParts.map((part) => (
        <li key={part.key} className={styles.item}>
          {/* The icon is decorative; the hidden text below tells screen readers what kind of part it is. */}
          <Icon name={part.icon} size="xs" />
          <span className={styles.label} title={names[part.key]}>
            <span className={styles.visuallyHidden}>{part.kind}: </span>
            {names[part.key]}
          </span>
        </li>
      ))}
    </ol>
  );
}
