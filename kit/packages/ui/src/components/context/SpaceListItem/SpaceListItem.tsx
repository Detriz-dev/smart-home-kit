import { Icon } from "../../../icons/Icon";
import { SPACE_TYPE_ICONS } from "../../../icons/purposeIcons";
import { Badge } from "../../feedback/Badge";
import { activeAlertsLabel } from "../../../utils/alertCountLabel";
import { IconTile } from "../../layout/IconTile";
import { ListItem } from "../../layout/ListItem";
import type { SpaceListItemProps } from "./SpaceListItem.types";

/** "No Devices", "1 Device", "3 Devices". */
function formatDeviceCount(count: number): string {
  if (count === 0) return "No Devices";
  return count === 1 ? "1 Device" : `${count} Devices`;
}

/** One Space as a List row: its Space Type icon, name, Floor and Devices, and a Badge of Active Alerts. Takes props only, never fetches data. */
export function SpaceListItem(props: SpaceListItemProps) {
  const {
    name,
    spaceType,
    floorName,
    deviceCount,
    activeAlertCount = 0,
    highestAlertLevel = "critical",
  } = props;

  // "Ground floor · 3 Devices": only the parts that are given.
  const description =
    [
      floorName,
      deviceCount !== undefined ? formatDeviceCount(deviceCount) : undefined,
    ]
      .filter(Boolean)
      .join(" · ") || undefined;

  const parts = {
    // Decorative: the name says which Space it is.
    start: (
      <IconTile>
        <Icon name={SPACE_TYPE_ICONS[spaceType]} />
      </IconTile>
    ),
    title: name,
    description,
    end:
      activeAlertCount > 0 ? (
        <Badge
          count={activeAlertCount}
          tone={highestAlertLevel}
          label={activeAlertsLabel(activeAlertCount)}
        />
      ) : undefined,
  };

  // ListItem is the <li> itself, so it is returned as is, like DeviceListItem.
  if (props.href !== undefined)
    return <ListItem {...parts} href={props.href} />;
  if (props.onClick !== undefined)
    return <ListItem {...parts} onClick={props.onClick} />;
  return <ListItem {...parts} />;
}
