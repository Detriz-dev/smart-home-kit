import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

// The landing page at "/". Every file in src/pages/ becomes a page with the same name.
// The copy is a placeholder: replace it with the real explanation of the kit.
export default function Home(): ReactNode {
  return (
    <Layout description="Design system and SDK for prototyping with live sensor data">
      <main className={styles.hero}>
        <div className={styles.visual} aria-hidden="true">
          {/* Placeholder. Later: real kit components, for example a SpaceCard. */}
          Visual
        </div>

        <div className={styles.text}>
          <Heading as="h1" className={styles.title}>
            Smart home interfaces with live sensor data
          </Heading>
          <p>
            DeTriz Smart Home Kit gives you design tokens and React components
            for screens that show Readings from real Sensors.
          </p>
          <p>
            Placeholder text: explain here who the kit is for, what problem it
            solves and how to start.
          </p>
          <div className={styles.actions}>
            <Link
              className="button button--primary button--lg"
              to="/docs/domain"
            >
              Understand the domain
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/components"
            >
              Browse components
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
