import { Icon } from "../../../icons/Icon";
import { DEVICE_KIND_ICONS } from "../../../icons/purposeIcons";
import { ListItem } from "../../layout/ListItem";
import { DeviceConnectionStatus } from "../DeviceConnectionStatus";
import { DeviceFaultStatus } from "../DeviceFaultStatus";
import { DevicePairingStatus } from "../DevicePairingStatus";
import styles from "./DeviceListItem.module.css";
import type { DeviceListItemProps } from "./DeviceListItem.types";

/** One Device as a List row: its icon, name and Space, its status on the right, Faults under the name. Takes props only, never fetches data. */
export function DeviceListItem(props: DeviceListItemProps) {
  const { name, deviceKind, spaceName } = props;

  // One status on the right: Pairing Status until the Device is Paired, then its Connection Status.
  const status =
    props.pairingStatus === "paired" ? (
      <DeviceConnectionStatus status={props.connectionStatus} />
    ) : (
      <DevicePairingStatus status={props.pairingStatus} />
    );

  // Faults only exist while Paired. One line each, as a nested list, so screen readers count them.
  const faults =
    props.pairingStatus === "paired" && props.faults && props.faults.length > 0
      ? props.faults
      : undefined;
  const details = faults && (
    // role="list": Safari stops treating a list as a list once its bullets are removed.
    <ul role="list" className={styles.faults}>
      {faults.map((fault) => (
        <li key={`${fault.faultCode}-${fault.metric ?? "device"}`}>
          <DeviceFaultStatus {...fault} />
        </li>
      ))}
    </ul>
  );

  const parts = {
    // Decorative: the name says what the Device is.
    start: <Icon name={DEVICE_KIND_ICONS[deviceKind]} />,
    title: name,
    description: spaceName,
    details,
    end: status,
  };

  if (props.href !== undefined)
    return <ListItem {...parts} href={props.href} />;
  if (props.onClick !== undefined)
    return <ListItem {...parts} onClick={props.onClick} />;
  return <ListItem {...parts} />;
}
