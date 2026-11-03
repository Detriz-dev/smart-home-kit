import type { ReactNode } from "react";

/** How a ColumnLayout divides its width: same-width columns, wide then narrow, or narrow then wide. */
export type ColumnLayoutRatio = "equal" | "2:1" | "1:2";

export interface ColumnLayoutProps {
  /** The components to place side by side, in reading order. */
  children: ReactNode;
  /** How the width is divided. Defaults to `equal`. */
  ratio?: ColumnLayoutRatio;
}
