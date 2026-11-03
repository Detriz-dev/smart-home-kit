import type { ReactNode } from "react";

/** The heading level of a ContentSection: <h2>, <h3> or <h4>. Also sets the text size. */
export type ContentSectionHeadingLevel = 2 | 3 | 4;

export interface ContentSectionProps {
  /** The section's name, shown as a heading. Plain text, such as "Air quality". */
  title: string;
  /** Which heading element to use, set from nesting. Also sets the text size. Defaults to `2`. */
  headingLevel?: ContentSectionHeadingLevel;
  /** The components that belong to this section, top to bottom. */
  children: ReactNode;
}
