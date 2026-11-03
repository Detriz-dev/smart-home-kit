/** Does this Device belong to the Account? See kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx. */
export type PairingStatus = "unpaired" | "pairing" | "paired";

export interface DevicePairingStatusProps {
  /** The Device's current Pairing Status. */
  status: PairingStatus;
}
