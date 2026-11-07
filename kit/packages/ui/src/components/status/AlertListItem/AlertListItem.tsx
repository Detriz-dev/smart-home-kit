import { Icon } from "../../../icons/Icon";
import { ALERT_LEVEL_ICONS } from "../../../icons/purposeIcons";
import type { AlertLevel, AlertStatus } from "../../../types/alert";
import { RelativeTime } from "../../context/RelativeTime";
import { ListItem } from "../../layout/ListItem";
import styles from "./AlertListItem.module.css";
import type { AlertListItemProps } from "./AlertListItem.types";

/** The word for each Alert Level, read by screen readers for the icon. */
const LEVEL_NAMES: Record<AlertLevel, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

/** The word for each Alert Status. */
const STATUS_NAMES: Record<AlertStatus, string> = {
  active: "Active",
  ended: "Ended",
  closed: "Closed",
};

/** One Alert as a List row: its level, what happened, where, its status and when. Takes props only, never fetches data. */
export function AlertListItem(props: AlertListItemProps) {
  const { title, alertLevel, alertStatus, raisedAt, endedAt, spaceName, now } =
    props;
  const isActive = alertStatus === "active";
  const time = isActive ? raisedAt : (endedAt ?? raisedAt);
  // Active rows use the level's colour; Ended and Closed rows are grey.
  const tone = isActive ? alertLevel : "inactive";

  const parts = {
    start: (
      <span data-tone={tone} className={styles.level}>
        {/* Labelled: nothing else on the row says the level. */}
        <Icon
          name={ALERT_LEVEL_ICONS[alertLevel]}
          label={LEVEL_NAMES[alertLevel]}
        />
      </span>
    ),
    title,
    description: spaceName,
    end: (
      <span data-tone={tone} className={styles.status}>
        <span className={styles.word}>{STATUS_NAMES[alertStatus]}</span>
        <RelativeTime time={time} now={now} size="xs" />
      </span>
    ),
  };

  // ListItem is the <li> itself, so it is returned as is (no wrapper), like DeviceListItem.
  if (props.href !== undefined)
    return <ListItem {...parts} href={props.href} />;
  if (props.onClick !== undefined)
    return <ListItem {...parts} onClick={props.onClick} />;
  return <ListItem {...parts} />;
}
