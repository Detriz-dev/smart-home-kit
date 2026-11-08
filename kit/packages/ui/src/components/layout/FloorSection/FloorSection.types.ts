import type { ReactNode } from "react";

/** The heading level of a FloorSection: <h2>, <h3> or <h4>. Also sets the text and icon size. */
export type FloorSectionHeadingLevel = 2 | 3 | 4;

export interface FloorSectionProps {
  /** The Floor's name, shown as the heading, e.g. "Ground floor". Plain text. */
  name: string;
  /** How many Spaces are on the Floor. Shown as "4 Spaces" next to the heading. Leave it out to hide it. */
  spaceCount?: number;
  /** Which heading element to use, set from nesting. Defaults to `3`: Floors are groups on a Site's screen. */
  headingLevel?: FloorSectionHeadingLevel;
  /** The Floor's Spaces, usually a `List` of `SpaceListItem`. */
  children: ReactNode;
}
