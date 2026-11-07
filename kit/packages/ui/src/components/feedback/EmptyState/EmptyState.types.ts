import type { IconName } from "../../../icons/Icon";

export interface EmptyStateProps {
  /** What is missing, e.g. "No Spaces yet" or "All clear". Plain text. */
  title: string;
  /** Why it's empty, or what will show up here, e.g. "Spaces you add to the Site show up here." Left out, only the title shows. */
  message?: string;
  /** A large grey icon above the title. Take it from a purpose map, e.g. `NAV_ICONS.spaces` or `ALERT_ICONS.default`. Left out, there is no icon. */
  icon?: IconName;
  /** The action's text, e.g. "View setup guide". The action only shows when `onAction` is given too. */
  actionLabel?: string;
  /** Called when the action is clicked. The action only shows when `actionLabel` is given too. */
  onAction?: () => void;
}
