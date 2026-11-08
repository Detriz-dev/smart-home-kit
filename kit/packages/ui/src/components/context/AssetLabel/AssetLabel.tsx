import { Icon, type IconSize } from "../../../icons/Icon";
import styles from "./AssetLabel.module.css";
import type { AssetLabelProps, AssetLabelSize } from "./AssetLabel.types";
import { ASSET_TYPE_ICONS } from "../../../icons/purposeIcons";

/** Which Icon size each size uses. The same as SensorLabel: lg keeps the 24px icon next to 18px text. */
const ICON_SIZES: Record<AssetLabelSize, IconSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
};

/** Names an Asset: the icon of its Asset Type and the Asset's name, e.g. Front door. Takes props only, never fetches data. */
export function AssetLabel({ name, assetType, size = "xs" }: AssetLabelProps) {
  return (
    <span data-size={size} className={styles.root}>
      {/* The icon is decorative: the name next to it says which Asset it is. */}
      <Icon name={ASSET_TYPE_ICONS[assetType]} size={ICON_SIZES[size]} />
      <span className={styles.label} title={name}>
        {name}
      </span>
    </span>
  );
}
