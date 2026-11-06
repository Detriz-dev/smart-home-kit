import { createContext, type ComponentType, type ReactNode } from "react";

/** What the kit passes to a link component. `next/link`'s `Link` takes these as they are. */
export interface LinkComponentProps {
  /** Where the link goes, e.g. `/spaces/kitchen`. */
  href: string;
  /** The kit's class, so the link keeps the component's look. */
  className?: string;
  /** The link's content. */
  children?: ReactNode;
  /** Set by some components so other elements can refer to the link. */
  id?: string;
  /** Tooltip text, e.g. a full name that is cut off with "…". */
  title?: string;
  /** The link's name for screen readers, when it has no visible text (an icon-only back button). */
  "aria-label"?: string;
  /** "page" on the link to the screen people are on, e.g. the current BottomNav item. */
  "aria-current"?: "page";
}

/** Any component that renders a link from these props, e.g. `next/link`'s `Link`. */
export type LinkComponent = ComponentType<LinkComponentProps>;

/** Which link component the kit uses. `null` means a plain `<a>`. Read only by KitLink. */
export const LinkContext = createContext<LinkComponent | null>(null);

export interface LinkProviderProps {
  /** Your router's link component, e.g. `Link` from `next/link`. Every link in the kit renders with it. */
  component: LinkComponent;
  /** Your app, or the part of it that uses the kit. */
  children: ReactNode;
}

/**
 * Makes every link in the kit use your router's link component, so following a link
 * changes the screen without reloading the page. Put it once, at the root of your app.
 * Without it, the kit renders plain `<a>` links. See docs/adr/0001-router-links.md.
 */
export function LinkProvider({ component, children }: LinkProviderProps) {
  return (
    <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
  );
}
