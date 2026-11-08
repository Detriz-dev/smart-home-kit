import type { IconName } from "../../../icons/Icon";
import type { BadgeProps } from "../../feedback/Badge";

/** One section of the app in the BottomNav. */
export interface BottomNavItem {
  /** The section's name, e.g. "Devices". Short: one word if you can. Ends with "…" when too long. */
  label: string;
  /** The section's icon, e.g. `sensors`. Decorative: the label names the section. */
  icon: IconName;
  /** Where the section is, e.g. `/devices`. It uses your router through `LinkProvider`. */
  href: string;
  /** True for the section the person is in, also on its sub-screens. Exactly one item should be current. */
  isCurrent?: boolean;
  /** A count on the icon's corner, e.g. Active Alerts on the Alerts tab: `{ count: 3, label: "3 active Alerts", tone: "critical" }`. A count of 0 shows nothing. */
  badge?: BadgeProps;
}

export interface BottomNavProps {
  /** The app's main sections, left to right. 3 to 5. */
  items: BottomNavItem[];
  /** The bar's name for screen readers. Defaults to "Main". */
  label?: string;
}
