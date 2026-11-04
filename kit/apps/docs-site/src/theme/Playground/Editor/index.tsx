// Swizzled (ejected) from @docusaurus/theme-live-codeblock 3.10.2 (MIT): the editor bar and the code.
// Changed: our own bar ("Live editor" + Reset with a Material Symbols icon), Figma node 24:410.
import type { ReactNode } from "react";
import { LiveEditor } from "react-live";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { usePlayground } from "@docusaurus/theme-live-codeblock/client";

import styles from "./styles.module.css";

function ResetButton(): ReactNode {
  const { reset } = usePlayground();
  return (
    <button
      type="button"
      className={styles.reset}
      onClick={() => reset()}
      aria-label="Reset code to original"
    >
      Reset
    </button>
  );
}

export default function PlaygroundEditor(): ReactNode {
  const isBrowser = useIsBrowser();
  return (
    <>
      <div className={styles.bar}>
        <span className={styles.label}>Live editor</span>
        <ResetButton />
      </div>
      <LiveEditor
        // Remount after hydration, otherwise the code colours from the server render stay.
        key={String(isBrowser)}
        className={styles.editor}
      />
    </>
  );
}
