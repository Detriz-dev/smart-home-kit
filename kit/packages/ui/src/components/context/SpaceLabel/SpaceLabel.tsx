import { Icon, type IconSize } from "../../../icons/Icon";
import styles from "./SpaceLabel.module.css";
import type { SpaceLabelProps, SpaceLabelSize } from "./SpaceLabel.types";
import { SPACE_TYPE_ICONS } from "../../../icons/purposeIcons";

/** Which Icon size each size uses. The same as SensorLabel: lg keeps the 24px icon next to 18px text. */
const ICON_SIZES: Record<SpaceLabelSize, IconSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
};

/** Names a Space: the icon of its Space Type and the Space's name, e.g. Bedroom. Takes props only, never fetches data. */
export function SpaceLabel({ name, spaceType, size = "xs" }: SpaceLabelProps) {
  return (
    <span data-size={size} className={styles.root}>
      {/* The icon is decorative: the name next to it says which Space it is. */}
      <Icon name={SPACE_TYPE_ICONS[spaceType]} size={ICON_SIZES[size]} />
      <span className={styles.label} title={name}>
        {name}
      </span>
    </span>
  );
}
