import { useContext } from "react";
import { LinkContext, type LinkComponentProps } from "./LinkProvider";

/**
 * The one way kit components render a link. Uses the app's link component from LinkProvider,
 * or a plain `<a>` without one. Internal: not exported from the package.
 */
export function KitLink(props: LinkComponentProps) {
  const Link = useContext(LinkContext);
  if (Link) return <Link {...props} />;
  return <a {...props} />;
}
