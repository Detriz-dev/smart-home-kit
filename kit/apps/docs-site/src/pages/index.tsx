import { useEffect, useState, type ReactNode } from "react";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import { ModuleCard, type ModuleCardProps } from "@detriz-sh-kit/ui";

import DomainDiagram from "@site/src/components/DomainDiagram";
// Imported (not linked as "/img/…") so the paths still work when the site moves under a baseUrl,
// and the build fails if a file goes missing.
import figmaLogo from "@site/static/img/landing/figma-logo.png";
import reactLogo from "@site/static/img/landing/react-logo.png";

import styles from "./index.module.css";

// The kit's Figma library on Figma Community.
const FIGMA_URL =
  "https://www.figma.com/community/file/1700179982740576850/detriz-smart-home-kit";
const INSTALL_COMMAND = "npm install @detriz-sh-kit/ui @detriz-sh-kit/tokens";

// One example on all three cards: the diagram highlights these values, the Figma card renders
// them with the real ModuleCard, and the code card shows the same props.
const climateModule: ModuleCardProps = {
  name: "Climate Module",
  connectionStatus: "connected",
  sensors: [
    { metric: "temperature", value: 22.4, unit: "celsius" },
    { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
  ],
};

// Written by hand (not generated from climateModule) so the line breaks fit the card.
const climateModuleCode = `<ModuleCard
  name="Climate Module"
  connectionStatus="connected"
  sensors={[
    { metric: "temperature",
      value: 22.4, unit: "celsius" },
    { metric: "humidity",
      value: 48, unit: "percent-rh",
      fractionDigits: 0 },
  ]}
/>`;

// The install command with a button that copies it.
function InstallCommand(): ReactNode {
  const [isCopied, setIsCopied] = useState(false);

  // Switch the icon back to "copy" after a moment.
  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setIsCopied(true);
  };

  return (
    <div className={styles.option}>
      <span className={styles.prompt} aria-hidden="true">
        $
      </span>
      <code className={styles.command}>{INSTALL_COMMAND}</code>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copy}
        aria-label={isCopied ? "Copied" : "Copy the install command"}
      >
        <span
          className={`${styles.icon} ${isCopied ? styles.iconCheck : styles.iconCopy}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

// The landing page at "/". Every file in src/pages/ becomes a page with the same name.
// Design: Figma "SHK – Landing", node 70:598. The navbar and the footer come from Docusaurus
// (docusaurus.config.ts and src/css/custom.css), so they are the same on every page.
export default function Home(): ReactNode {
  return (
    <Layout description="Rapid prototyping kit for smart home apps: a ready-made domain model, a Figma kit and React components.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <Heading as="h1" className={styles.title}>
            <strong>Rapid prototyping kit</strong>
            <br />
            for smart home apps
          </Heading>
          <p className={styles.intro}>
            <strong>Skip the groundwork:</strong> domain modeling, UI design,
            and component development.{" "}
            <strong>Jump straight to building your idea.</strong>
          </p>

          {/* Three ways in, on one line: start in Figma, start in code, or read the intro.
              Figma and npm look the same, so neither is the "main" one. */}
          <div className={styles.options}>
            <a
              className={`${styles.option} ${styles.optionFigma}`}
              href={FIGMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the kit in Figma (opens in a new tab)"
            >
              <span className={styles.optionLabel}>Figma</span>
              <span
                className={`${styles.icon} ${styles.iconExternal}`}
                aria-hidden="true"
              />
            </a>
            <InstallCommand />
            <Link
              className={styles.introLink}
              to="/docs/get-started/introduction"
            >
              Introduction
              <span
                className={`${styles.icon} ${styles.iconArrow}`}
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        {/* The same Climate Module three times: as a model, as a Figma component and as code. */}
        <section className={styles.cards} aria-label="What's in the kit">
          <article className={`${styles.card} ${styles.cardDomain}`}>
            <Heading as="h2" className={styles.cardTitle}>
              <span
                className={`${styles.icon} ${styles.iconDomain}`}
                aria-hidden="true"
              />
              Domain model
            </Heading>
            <div className={styles.cardBody}>
              <DomainDiagram />
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardFigma}`}>
            <Heading as="h2" className={styles.cardTitle}>
              <img src={figmaLogo} alt="" width={20} height={20} />
              Figma kit
            </Heading>
            <ModuleCard {...climateModule} />
          </article>

          <article className={`${styles.card} ${styles.cardCode}`}>
            <Heading as="h2" className={styles.cardTitle}>
              <img src={reactLogo} alt="" width={22} height={20} />
              React components
            </Heading>
            <CodeBlock language="jsx" className={styles.code}>
              {climateModuleCode}
            </CodeBlock>
          </article>
        </section>
      </main>
    </Layout>
  );
}
