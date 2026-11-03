/** Can we reach this Device right now? Only Paired Devices have one. See kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx. */
export type ConnectionStatus =
  "connecting" | "connected" | "stale" | "disconnected";

export interface DeviceConnectionStatusProps {
  /** The Device's current Connection Status. */
  status: ConnectionStatus;
}
