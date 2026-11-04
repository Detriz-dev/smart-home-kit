import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

// Imported (not linked as "/img/…") so the path still works when the site moves under a baseUrl,
// and the build fails if the file goes missing.
import heroIllustration from "@site/static/img/heroSection.png";

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
              <strong>Rapid prototyping</strong> <br />
              for smart home apps
            </Heading>
            <p className={styles.intro}>
              <strong>Skip the groundwork.</strong> The domain model and
              components are ready.
            </p>
            <Link className={styles.cta} to="/docs/get-started/how-it-works">
              Start building
            </Link>
          </div>

          <div className={styles.picture}>
            {/* Decorative: the text next to it says the same, so screen readers skip it (alt=""). */}
            <img
              src={heroIllustration}
              alt=""
              width={508}
              height={495}
              className={styles.illustration}
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
