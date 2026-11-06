import { Icon, type IconName } from "../../../icons/Icon";
import styles from "./LocationPath.module.css";
import type { LocationPathProps } from "./LocationPath.types";

/** One part of the path: which prop it reads, its icon, and the word screen readers hear before the name. */
interface PathPart {
  key: "site" | "floor" | "space" | "device";
  icon: IconName;
  kind: string;
}

/** The parts in their fixed order: Site, Floor, Space, Device. */
const PARTS: PathPart[] = [
  { key: "site", icon: "home", kind: "Site" },
  { key: "floor", icon: "stairs_2", kind: "Floor" },
  { key: "space", icon: "door_front", kind: "Space" },
  { key: "device", icon: "tv_gen", kind: "Device" },
];

/** Shows where a Device is: its Site, Floor, Space and the Device itself, each with an icon. Takes props only, never fetches data. */
export function LocationPath({
  siteName,
  floorName,
  spaceName,
  deviceName,
  layout = "inline",
}: LocationPathProps) {
  const names = {
    site: siteName,
    floor: floorName,
    space: spaceName,
    device: deviceName,
  };
  // Parts without a name are skipped, never shown empty.
  const shownParts = PARTS.filter((part) => names[part.key]);

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
