import type { ReactNode } from "react";

export interface ListProps {
  /** The `ListItem` rows, top to bottom. Only ListItems: anything else inside a list is invalid HTML. */
  children: ReactNode;
  /** Draws a thin line between rows (not above the first or below the last). Defaults to `false`. */
  hasDividers?: boolean;
  /** Names the list for screen readers, e.g. "Rooms". Not shown. Leave it out when a visible heading right above names the list. */
  label?: string;
}
