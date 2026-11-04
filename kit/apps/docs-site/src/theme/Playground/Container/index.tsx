// Swizzled (ejected) from @docusaurus/theme-live-codeblock 3.10.2 (MIT): the card around a live code block.
// Design: Figma "SHK – Landing", node 24:410 ("CodeBlock").
import type { ReactNode } from "react";

import styles from "./styles.module.css";

export default function PlaygroundContainer({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <div className={styles.container}>{children}</div>;
}
