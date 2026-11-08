import { Icon } from "../../../icons/Icon";
import { KitLink } from "../../../link";
import { Badge } from "../../feedback/Badge";
import styles from "./BottomNav.module.css";
import type { BottomNavProps } from "./BottomNav.types";

/** The app's main sections as a bar: an icon and a label per section, the current one marked. Takes props only, never fetches data. */
export function BottomNav({ items, label = "Main" }: BottomNavProps) {
  return (
    <nav aria-label={label} className={styles.root}>
      {/* role="list": Safari stops treating a list as a list once its bullets are removed. */}
      <ul role="list" className={styles.items}>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <KitLink
              href={item.href}
              className={styles.link}
              aria-current={item.isCurrent ? "page" : undefined}
            >
              {/* The pill behind the icon. The icon is decorative: the label names the section. */}
              <span className={styles.indicator}>
                <Icon name={item.icon} />
              </span>
              <span className={styles.label} title={item.label}>
                {item.label}
              </span>
              {/* After the label in the code, so screen readers hear "Alerts, 3 active Alerts"; drawn on the icon's corner. */}
              {item.badge && (
                <span className={styles.badge}>
                  <Badge {...item.badge} />
                </span>
              )}
            </KitLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
