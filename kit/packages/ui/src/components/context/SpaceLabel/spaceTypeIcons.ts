import type { IconName } from "../../../icons/Icon";
import type { SpaceType } from "../../../types/spaceType";

/**
 * The icon for each Space Type. The one place the kit decides it, so a kitchen looks the same everywhere.
 * Exported, so apps can give a room card the same icon: `<Card icon={SPACE_TYPE_ICONS.kitchen} …>`.
 * It lives here, not in utils, because utils can't import icons.
 */
export const SPACE_TYPE_ICONS: Record<SpaceType, IconName> = {
  bedroom: "bed",
  bathroom: "bathtub",
  kitchen: "countertops",
  "living-room": "weekend",
  hallway: "door_front",
  garage: "garage_home",
  office: "desk",
  meeting: "groups",
  outdoor: "yard",
  other: "home",
};
