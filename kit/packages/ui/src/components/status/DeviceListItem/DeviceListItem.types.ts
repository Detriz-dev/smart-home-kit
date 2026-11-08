import type { DeviceKind } from "../../../types/deviceKind";
import type { ConnectionStatus } from "../DeviceConnectionStatus";
import type { DeviceFaultStatusProps } from "../DeviceFaultStatus";

/** What every Device row shows. */
interface DeviceListItemBaseProps {
  /** The Device's name, e.g. "Climate Module" or "Kitchen Hub". For a Module, its Module Name (the user can rename it). */
  name: string;
  /** How the Device connects: Hub, Module or Standalone Device. Decides the icon. */
  deviceKind: DeviceKind;
  /** The name of the Space the Device is in, e.g. "Bedroom". Leave it out when the screen is already about that Space. */
  spaceName?: string;
}

/** A Device that isn't Paired yet: only its Pairing Status exists. */
interface DeviceListItemNotPairedProps {
  /** The Device's Pairing Status. Not Paired yet, so it has no Connection Status and no Faults. */
  pairingStatus: "unpaired" | "pairing";
  /** Only for a Paired Device. */
  connectionStatus?: never;
  /** Only for a Paired Device. */
  faults?: never;
}

/** A Paired Device: it has a Connection Status, and may have Faults. */
interface DeviceListItemPairedProps {
  /** The Device's Pairing Status. */
  pairingStatus: "paired";
  /** The Device's current Connection Status. A Hub without Capabilities is never Stale: only Devices with Capabilities send Readings. */
  connectionStatus: ConnectionStatus;
  /** The Device's current Faults, one per Fault Code. Leave it out, or pass an empty list, when there are none. */
  faults?: DeviceFaultStatusProps[];
}

/** A row that isn't clickable. */
interface DeviceListItemStaticAction {
  /** Only on a clickable row. */
  href?: never;
  /** Only on a clickable row. */
  onClick?: never;
}

/** A row that is a link, e.g. to the Device's own screen. */
interface DeviceListItemLinkAction {
  /** Where the row leads, e.g. `/devices/climate-module`. It uses the app's router through `LinkProvider`. */
  href: string;
  /** A row is a link or a button, not both. */
  onClick?: never;
}

/** A row that is a button. */
interface DeviceListItemButtonAction {
  /** Called when the row is tapped, clicked, or activated with Enter or Space. */
  onClick: () => void;
  /** A row is a link or a button, not both. */
  href?: never;
}

/** The status part of the props: either not Paired yet, or Paired with a Connection Status. */
export type DeviceListItemStatusProps =
  DeviceListItemNotPairedProps | DeviceListItemPairedProps;

/**
 * The props of `DeviceListItem`. TypeScript checks the domain rules:
 * `connectionStatus` and `faults` only for a Paired Device, and never both `href` and `onClick`.
 */
export type DeviceListItemProps = DeviceListItemBaseProps &
  DeviceListItemStatusProps &
  (
    | DeviceListItemStaticAction
    | DeviceListItemLinkAction
    | DeviceListItemButtonAction
  );
