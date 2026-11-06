import { Icon } from "../../../icons/Icon";
import { KitLink } from "../../../link";
import styles from "./TopBar.module.css";
import type { TopBarProps } from "./TopBar.types";

/** The bar at the top of a screen: back button, the screen's title and actions. Takes props only, never fetches data. */
export function TopBar({
  title,
  icon,
  actions,
  backHref,
  onBack,
  backLabel = "Back",
}: TopBarProps) {
  // The arrow is decorative: the back button is named by backLabel.
  const arrow = <Icon name="arrow_back" />;
  let back = null;
  if (backHref !== undefined) {
    back = (
      <KitLink href={backHref} className={styles.back} aria-label={backLabel}>
        {arrow}
      </KitLink>
    );
  } else if (onBack !== undefined) {
    back = (
      <button
        type="button"
        onClick={onBack}
        className={styles.back}
        aria-label={backLabel}
      >
        {arrow}
      </button>
    );
  }

  return (
    <header data-has-back={back ? "true" : undefined} className={styles.root}>
      {back}
      {/* The screen's one main heading. ContentSections below it start at <h2>. */}
      <h1 className={styles.heading}>
        {/* Decorative: the title next to it says the name. */}
        {icon !== undefined && <Icon name={icon} />}
        <span className={styles.title} title={title}>
          {title}
        </span>
      </h1>
      {actions !== undefined && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
