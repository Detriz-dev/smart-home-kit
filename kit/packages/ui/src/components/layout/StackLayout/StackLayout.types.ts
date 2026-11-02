import type { ReactNode } from "react";

/** The space between the children of a StackLayout: 8px, 16px or 32px. */
export type StackLayoutGap = "sm" | "md" | "lg";

export interface StackLayoutProps {
  /** The components to place in one column, top to bottom. */
  children: ReactNode;
  /** The space between the children. Defaults to `md`. */
  gap?: StackLayoutGap;
}
