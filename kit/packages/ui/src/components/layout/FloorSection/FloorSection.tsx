import { useId } from "react";
import { Icon } from "../../../icons/Icon";
import { PLACE_ICONS } from "../../../icons/purposeIcons";
import styles from "./FloorSection.module.css";
import type { FloorSectionProps } from "./FloorSection.types";

/** "No Spaces", "1 Space", "4 Spaces". */
function formatSpaceCount(count: number): string {
  if (count === 0) return "No Spaces";
  return count === 1 ? "1 Space" : `${count} Spaces`;
}

/** The Spaces of one Floor under a heading: the Floor icon, its name and how many Spaces it has. Takes props only, never fetches data. */
export function FloorSection({
  name,
  spaceCount,
  headingLevel = 3,
  children,
}: FloorSectionProps) {
  const Heading = `h${headingLevel}` as const;
  // A unique id, so the <section> can use its heading as its name.
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      data-heading-level={headingLevel}
      className={styles.root}
    >
      <div className={styles.header}>
        {/* Decorative: the heading says it is a Floor. */}
        <Icon
          name={PLACE_ICONS.floor}
          size={headingLevel === 2 ? "lg" : "md"}
        />
        <Heading id={headingId} className={styles.heading} title={name}>
          {name}
        </Heading>
        {spaceCount !== undefined && (
          <span className={styles.count}>{formatSpaceCount(spaceCount)}</span>
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
