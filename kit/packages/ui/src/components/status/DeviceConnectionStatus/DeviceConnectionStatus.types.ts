/** Can we reach this Device right now? Only Paired Devices have one. See docs/architecture/domain-model/device-lifecycle.md. */
export type ConnectionStatus =
  "connecting" | "connected" | "stale" | "disconnected";

export interface DeviceConnectionStatusProps {
  /** The Device's current Connection Status. */
  status: ConnectionStatus;
}
