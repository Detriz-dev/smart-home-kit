import type { ReactNode } from "react";
import type { IconName } from "../../../icons/Icon";

/** The parts every card can have, clickable or not. */
interface CardBaseProps {
  /** An icon before the title, 24px, e.g. `countertops` for a Kitchen. Decorative: screen readers skip it, the title says the name. Shown only with a `title`. */
  icon?: IconName;
  /** Shown at the right end of the header, e.g. a `DeviceConnectionStatus` when the card is about one Module. Never shrinks. */
  headerEnd?: ReactNode;
  /** The card's content, top to bottom, 12px apart. */
  children: ReactNode;
  /** Shown at the bottom in small grey text, e.g. "Updated 2 min ago". Components passed in keep their own styles. */
  footer?: ReactNode;
}

/** A card that isn't clickable. */
export interface CardStaticProps extends CardBaseProps {
  /** The card's name, plain text, e.g. "Kitchen". One line, ends with "…" when too long. Also names the card for screen readers. */
  title?: string;
  /** Only on a clickable card. */
  href?: never;
  /** Only on a clickable card. */
  onClick?: never;
}

/** A card that is a link: tapping anywhere on it opens `href`. */
export interface CardLinkProps extends CardBaseProps {
  /** The card's name, plain text, e.g. "Kitchen". Required: it is the link's text, so screen readers hear "Kitchen, link". */
  title: string;
  /** Where the card leads, e.g. `/spaces/kitchen`. A plain link: it doesn't use the app's router yet. */
  href: string;
  /** A card is a link or a button, not both. */
  onClick?: never;
}

/** A card that is a button: tapping anywhere on it calls `onClick`. */
export interface CardButtonProps extends CardBaseProps {
  /** The card's name, plain text, e.g. "Kitchen". Required: it is the button's text, so screen readers hear "Kitchen, button". */
  title: string;
  /** Called when the card is tapped, clicked, or activated with Enter or Space. */
  onClick: () => void;
  /** A card is a link or a button, not both. */
  href?: never;
}

/**
 * The props of `Card`. Three shapes, so TypeScript catches mistakes:
 * a clickable card (`href` or `onClick`) needs a `title`, and can't have both `href` and `onClick`.
 */
export type CardProps = CardStaticProps | CardLinkProps | CardButtonProps;
