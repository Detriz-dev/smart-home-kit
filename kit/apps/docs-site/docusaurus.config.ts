import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This file runs in Node.js, not in the browser: no JSX or browser APIs here.

const config: Config = {
  title: "DeTriz Smart Home Kit",
  tagline: "Design system and SDK for prototyping with live sensor data",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Behave like the upcoming Docusaurus v4
  },

  // Placeholder. The real URL and baseUrl are set in the deploy step (GitHub Pages).
  url: "https://example.com",
  baseUrl: "/",

  onBrokenLinks: "throw",

  // Draws ```mermaid code blocks as diagrams (used on the Concepts pages).
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        // Docs live under /docs. The landing page (src/pages/index.tsx) is at "/".
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      // Clicking the title opens the landing page ("/").
      title: "DeTriz Smart Home Kit",
      items: [
        {
          type: "docSidebar",
          sidebarId: "getStartedSidebar",
          label: "Get Started",
          position: "right",
        },
        {
          type: "docSidebar",
          sidebarId: "domainModelSidebar",
          label: "Domain Model",
          position: "right",
        },
        {
          type: "docSidebar",
          sidebarId: "uiComponentsSidebar",
          label: "UI Components",
          position: "right",
        },
      ],
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} DeTriz Smart Home Kit`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
