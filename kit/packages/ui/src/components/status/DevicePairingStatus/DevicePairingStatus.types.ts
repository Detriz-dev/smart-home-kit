/** Does this Device belong to the Account? See docs/architecture/domain-model/device-lifecycle.md. */
export type PairingStatus = "unpaired" | "pairing" | "paired";

export interface DevicePairingStatusProps {
  /** The Device's current Pairing Status. */
  status: PairingStatus;
}
