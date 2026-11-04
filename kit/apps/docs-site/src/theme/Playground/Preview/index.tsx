// Swizzled (ejected) from @docusaurus/theme-live-codeblock 3.10.2 (MIT): the rendered component.
// Changed: no "Result" header, and the preview sits on the kit's page surface (Figma node 24:410).
import type { ReactNode } from "react";
import { LiveError, LivePreview } from "react-live";
import BrowserOnly from "@docusaurus/BrowserOnly";
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import { ErrorBoundaryErrorMessageFallback } from "@docusaurus/theme-common";

import styles from "./styles.module.css";

// The preview only renders in the browser (no server rendering), so this shows while it loads.
function Loader() {
  return <div>Loading…</div>;
}

export default function PlaygroundPreview(): ReactNode {
  return (
    <div className={styles.preview}>
      <BrowserOnly fallback={<Loader />}>
        {() => (
          <>
            <ErrorBoundary
              fallback={(params) => (
                <ErrorBoundaryErrorMessageFallback {...params} />
              )}
            >
              <LivePreview />
            </ErrorBoundary>
            <LiveError />
          </>
        )}
      </BrowserOnly>
    </div>
  );
}
