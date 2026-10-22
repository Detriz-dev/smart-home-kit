import type { IconName } from "../generated/paths";

/** How big an icon is drawn. Each size maps to a `--shk-size-*` token. */
export type IconSize = "sm" | "md" | "lg";

export interface IconProps {
  /** Which icon to show. Only names listed in `icons.config.ts` are allowed. */
  name: IconName;
  /** sm = 20px, md = 24px, lg = 32px. Defaults to `md`. */
  size?: IconSize;
  /**
   * What the icon means, read by screen readers (e.g. "Disconnected").
   * Leave it out when the icon is decorative, i.e. text next to it already says the same thing.
   */
  label?: string;
}
