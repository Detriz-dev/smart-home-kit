import type { SpaceType } from "../../../types/spaceType";

/** How big the label is drawn: xs (caption text, 16px icon) up to lg (body-lg text, 24px icon). The same sizes as SensorLabel. */
export type SpaceLabelSize = "xs" | "sm" | "md" | "lg";

export interface SpaceLabelProps {
  /** The Space's name, e.g. "Bedroom" or "Anna's room". Plain text. Long names end with "…". */
  name: string;
  /** The Space's Space Type, e.g. `bedroom`. Decides the icon. */
  spaceType: SpaceType;
  /** How big the label is drawn. Defaults to `xs`. */
  size?: SpaceLabelSize;
}
