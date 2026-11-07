import type { AssetType } from "../../../types/assetType";

/** How big the label is drawn: xs (caption text, 16px icon) up to lg (body-lg text, 24px icon). The same sizes as SensorLabel and SpaceLabel. */
export type AssetLabelSize = "xs" | "sm" | "md" | "lg";

export interface AssetLabelProps {
  /** The Asset's name, e.g. "Front door" or "Washing machine". Plain text. Long names end with "…". */
  name: string;
  /** The Asset's Asset Type, e.g. `door`. Decides the icon. */
  assetType: AssetType;
  /** How big the label is drawn. Defaults to `xs`. */
  size?: AssetLabelSize;
}
