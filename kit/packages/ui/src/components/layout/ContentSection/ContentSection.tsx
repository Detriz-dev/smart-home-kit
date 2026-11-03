import { useId } from "react";
import styles from "./ContentSection.module.css";
import type { ContentSectionProps } from "./ContentSection.types";

/** A heading with a group of children, one under the other. Adds only spacing: no background, border or padding. */
export function ContentSection({
  title,
  headingLevel = 2,
  children,
}: ContentSectionProps) {
  // The heading element follows the level: 2 → <h2>, 3 → <h3>, 4 → <h4>.
  const Heading = `h${headingLevel}` as const;
  // A unique id, so the <section> can use its heading as its name.
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      data-heading-level={headingLevel}
      className={styles.root}
    >
      <Heading id={headingId} className={styles.heading}>
        {title}
      </Heading>
      {children}
    </section>
  );
}
