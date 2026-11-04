import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

// The landing page at "/". Every file in src/pages/ becomes a page with the same name.
// Design: Figma "SHK – Landing", node 8:3 (hero: node 23:396).
export default function Home(): ReactNode {
  return (
    <Layout description="Rapid prototyping for smart home apps: a ready-made domain model and React components.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.text}>
            <Heading as="h1" className={styles.title}>
              Rapid prototyping <br />
              for smart home apps
            </Heading>
            <p className={styles.intro}>
              <strong>Skip the groundwork.</strong> The domain model and
              components are ready.
              <strong> Start building on day one.</strong>
            </p>
            <Link className={styles.cta} to="/docs/get-started/how-it-works">
              How it works?
            </Link>
          </div>

          {/* Placeholder for the hero picture, which isn't designed yet. */}
          <div className={styles.picture} aria-hidden="true" />
        </section>
      </main>
    </Layout>
  );
}
