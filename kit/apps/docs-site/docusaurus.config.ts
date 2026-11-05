import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This file runs in Node.js, not in the browser: no JSX or browser APIs here.

// Code theme for every code block and the live editor, in light and dark mode: VS Code's dark
// colours on our own background. The value is a CSS variable, so the colour itself lives in
// src/css/custom.css (--site-code-background) and the browser fills it in.
const codeTheme = {
  ...prismThemes.vsDark,
  plain: {
    ...prismThemes.vsDark.plain,
    backgroundColor: "var(--site-code-background)",
  },
};

const config: Config = {
  title: "DeTriz Smart Home Kit",
  tagline: "Design system and SDK for prototyping with live sensor data",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    // Behave like the upcoming Docusaurus v4. This also puts Docusaurus's own CSS in
    // cascade layers, so the kit's CSS (in `@layer detriz`) wins over it.
    v4: true,
  },

  // Placeholder. The real URL and baseUrl are set in the deploy step (GitHub Pages).
  url: "https://example.com",
  baseUrl: "/",

  onBrokenLinks: "throw",

  // Draws ```mermaid code blocks as diagrams (used on the Concepts pages).
  markdown: {
    mermaid: true,
  },
  // theme-live-codeblock turns ```jsx live code blocks into real, editable component previews.
  // The components they can use are listed in src/theme/ReactLiveScope.
  themes: ["@docusaurus/theme-mermaid", "@docusaurus/theme-live-codeblock"],

  // Loads the kit's fonts, tokens and component styles once, for every page.
  clientModules: ["./src/kit-styles.ts"],

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
      // Its icon and the link icons are added in src/css/custom.css ("Navbar").
      title: "Smart Home Kit",
      items: [
        {
          type: "docSidebar",
          sidebarId: "getStartedSidebar",
          label: "Get Started",
          position: "right",
          className: "site-nav-link site-nav-link--get-started",
        },
        {
          type: "docSidebar",
          sidebarId: "domainModelSidebar",
          label: "Domain Model",
          position: "right",
          className: "site-nav-link site-nav-link--domain-model",
        },
        {
          type: "docSidebar",
          sidebarId: "uiComponentsSidebar",
          label: "UI Components",
          position: "right",
          className: "site-nav-link site-nav-link--ui-components",
        },
        {
          // Icon only: the GitHub mark is drawn in src/css/custom.css ("Navbar").
          // The light / dark mode switch comes after it; Docusaurus adds it on its own.
          href: "https://github.com/Detriz-dev/smart-home-kit",
          position: "right",
          className: "site-nav-github",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} DeTriz Smart Home Kit`,
    },
    // Live code blocks show the result first, then the code.
    liveCodeBlock: {
      playgroundPosition: "top",
    },
    prism: {
      theme: codeTheme,
      darkTheme: codeTheme,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
