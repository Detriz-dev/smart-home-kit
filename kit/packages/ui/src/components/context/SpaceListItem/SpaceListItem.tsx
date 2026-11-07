import { Icon } from "../../../icons/Icon";
import { SPACE_TYPE_ICONS } from "../../../icons/purposeIcons";
import { Badge } from "../../feedback/Badge";
import { ListItem } from "../../layout/ListItem";
import type { SpaceListItemProps } from "./SpaceListItem.types";

/** "No Modules", "1 Module", "3 Modules". */
function formatModuleCount(count: number): string {
  if (count === 0) return "No Modules";
  return count === 1 ? "1 Module" : `${count} Modules`;
}

/** One Space as a List row: its Space Type icon, name, Floor and Modules, and a Badge of Active Alerts. Takes props only, never fetches data. */
export function SpaceListItem(props: SpaceListItemProps) {
  const {
    name,
    spaceType,
    floorName,
    moduleCount,
    activeAlertCount = 0,
    highestAlertLevel = "critical",
  } = props;

  // "Ground floor · 3 Modules": only the parts that are given.
  const description =
    [
      floorName,
      moduleCount !== undefined ? formatModuleCount(moduleCount) : undefined,
    ]
      .filter(Boolean)
      .join(" · ") || undefined;

  const parts = {
    // Decorative: the name says which Space it is.
    start: <Icon name={SPACE_TYPE_ICONS[spaceType]} />,
    title: name,
    description,
    end:
      activeAlertCount > 0 ? (
        <Badge
          count={activeAlertCount}
          tone={highestAlertLevel}
          label={
            activeAlertCount === 1
              ? "1 active Alert"
              : `${activeAlertCount} active Alerts`
          }
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
