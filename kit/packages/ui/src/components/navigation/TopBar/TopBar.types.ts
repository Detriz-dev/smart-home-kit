import type { ReactNode } from "react";
import type { IconName } from "../../../icons/Icon";

/** What every top bar shows. */
interface TopBarBaseProps {
  /** The screen's title, plain text, e.g. "Kitchen". Shown as the screen's `<h1>`. One line, ends with "…" when too long. */
  title: string;
  /** An icon before the title, e.g. `SPACE_TYPE_ICONS.kitchen` on a room's screen. Decorative. */
  icon?: IconName;
  /** Shown on the right, e.g. a `Button`. Never shrinks. */
  actions?: ReactNode;
}

/** A top bar without a back button, e.g. a top-level screen. */
interface TopBarNoBackProps {
  /** Shows a back button that links here. */
  backHref?: never;
  /** Shows a back button that calls this. */
  onBack?: never;
  /** Only with a back button. */
  backLabel?: never;
}

/** A top bar whose back button is a link. */
interface TopBarBackLinkProps {
  /** Shows a back button that links here, e.g. `/`. It uses your router through `LinkProvider`. */
  backHref: string;
  /** A back button is a link or a button, not both. */
  onBack?: never;
  /** The back button's name for screen readers, e.g. "Back to My flat". Defaults to "Back". */
  backLabel?: string;
}

/** A top bar whose back button is a button. */
interface TopBarBackButtonProps {
  /** Shows a back button that calls this, e.g. `() => router.back()`. */
  onBack: () => void;
  /** A back button is a link or a button, not both. */
  backHref?: never;
  /** The back button's name for screen readers. Defaults to "Back". */
  backLabel?: string;
}

/** The props of `TopBar`. TypeScript checks you pass `backHref` or `onBack`, not both. */
export type TopBarProps = TopBarBaseProps &
  (TopBarNoBackProps | TopBarBackLinkProps | TopBarBackButtonProps);
