# Tech stack

Every technology DeTriz Smart Home Kit uses, layer by layer, from the repo foundation up to hosting. Each entry says what the tool is, what we use it for and where it lives.

Its companion is [Project Architecture](project-architecture.md), which explains how the parts fit together. Read this file for the **tools**, and that one for the **shape**.

Versions are the ones installed today. ✅ means in use; ⬜ means planned and not chosen or built yet.

## The layers at a glance

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 9. AI tooling          Claude Code · AGENTS.md · Figma MCP             │
 │ 8. Hosting             Vercel (docs site) · GitHub (code)              │
 │ 7. Search              Algolia DocSearch                               │
 │ 6. Docs site           Docusaurus 3 · MDX · live code · Mermaid        │
 │ 5. Component workbench Storybook 10                                    │
 │ 4. UI components       React 19 · TypeScript · CSS Modules · Vite      │
 │ 3. Design tokens       Figma variables → DTCG JSON → Style Dictionary  │
 │ 2. Language & format   TypeScript 6 · Prettier                         │
 │ 1. Repo foundation     Node 22 · pnpm 11 workspaces · Turborepo        │
 ├────────────────────────────────────────────────────────────────────────┤
 │ ⬜ Planned: API contract · API Simulator · Hub software · client SDK · │
 │            react bindings · MCP server + Generative UI · tests · CI    │
 └────────────────────────────────────────────────────────────────────────┘
```

Each layer builds on the ones below it. The numbers match the sections below.

---

## 1. Repo foundation

How the repo is organised, installed and built.

| Technology           | Version | What it does here                                                                                                                                                                                     | Where                                                     |
| -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Git** + **GitHub** | n/a     | Version control and the public repo (`Detriz-dev/smart-home-kit`). Issues and pull requests.                                                                                                          | github.com                                                |
| **Node.js**          | ≥ 22    | Runs every build tool and script.                                                                                                                                                                     | `engines` in the root `package.json`                      |
| **pnpm**             | 11.28   | Package manager. **Workspaces** link the repo's packages to each other (`workspace:*`). A **catalog** keeps one React version for every project. Install scripts run only if listed in `allowBuilds`. | `pnpm-workspace.yaml`, `packageManager` in `package.json` |
| **Corepack**         | (Node)  | Makes sure everyone uses the pnpm version pinned in `package.json`. Run `corepack enable` if `pnpm` is missing.                                                                                       | built into Node                                           |
| **Turborepo**        | 2.11    | Runs tasks (`build`, `dev`, `typecheck`) across packages in dependency order, and caches results. Builds `tokens` → `ui` → apps.                                                                      | `turbo.json`                                              |

## 2. Language and formatting

| Technology     | Version | What it does here                                                                                                                                                | Where                                                |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **TypeScript** | 6.0     | The language for components, config and the docs site. Strict mode is on. Checks types (`pnpm --filter … typecheck`) and writes the `.d.ts` type files for `ui`. | `tsconfig.base.json`, each package's `tsconfig.json` |
| **Prettier**   | 3.9     | Formats code and Markdown the same way everywhere (`pnpm format`, `pnpm format:check`).                                                                          | root `package.json`, `.prettierignore`               |

## 3. Design tokens

How design decisions (colours, spacing, type, motion) get from Figma into code. Package: `@detriz-sh-kit/tokens`.

| Technology                                      | Version | What it does here                                                                                                                                                 | Where                                   |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Figma variables**                             | n/a     | Where the tokens are designed. Exported as JSON.                                                                                                                  | `kit/packages/tokens/figma/`            |
| **`figma-to-dtcg.mjs`** (our Node script)       | n/a     | Converts Figma's export format into DTCG JSON, renames some groups and adds font fallbacks. Run with `pnpm --filter @detriz-sh-kit/tokens figma:import`.          | `kit/packages/tokens/scripts/`          |
| **DTCG format** (Design Tokens Community Group) | n/a     | The standard JSON format for tokens (`$type`, `$value`). Three layers: `primitive/`, `semantic/` (refers to primitives, e.g. `{palette.gray.900}`), `component/`. | `kit/packages/tokens/src/`              |
| **Style Dictionary**                            | 5.6     | Builds the DTCG JSON into **CSS custom properties** with the `--shk-` prefix, keeping references between tokens.                                                  | `kit/packages/tokens/build/config.json` |
| **CSS custom properties** (CSS variables)       | n/a     | The output: `dist/tokens.css`, for example `--shk-color-text-primary`. Works in any website, React or not.                                                        | `kit/packages/tokens/dist/tokens.css`   |

## 4. UI components

The React components people install. Package: `@detriz-sh-kit/ui`.

| Technology                                | Version | What it does here                                                                                                                                          | Where                                    |
| ----------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **React**                                 | 19.3    | The component framework. A **peer dependency**: the app using the kit provides React, so there is only one copy on the page.                               | `catalog:` in `pnpm-workspace.yaml`      |
| **TypeScript**                            | 6.0     | Every component has an exported `<Name>Props` interface with a comment on every prop.                                                                      | `<Name>.types.ts`                        |
| **CSS Modules**                           | n/a     | Each component's styles live in `<Name>.module.css`. Class names are scoped to the component, so they never clash.                                         | next to each component                   |
| **CSS cascade layers** (`@layer detriz`)  | n/a     | All component CSS sits in one layer, so an app's own CSS always wins without specificity fights.                                                           | every `.module.css`                      |
| **Vite** (library mode)                   | 8.3     | Builds `src/index.ts` into `dist/index.js` and one `dist/styles.css`. React is left out of the bundle.                                                     | `kit/packages/ui/vite.config.ts`         |
| **@vitejs/plugin-react**                  | 6.1     | Lets Vite compile React's JSX.                                                                                                                             | `vite.config.ts`                         |
| **`tsc`** (TypeScript compiler)           | 6.0     | Writes the `.d.ts` type files, so editors autocomplete props. Stories are excluded.                                                                        | `tsconfig.build.json`                    |
| **Material Symbols** (Rounded)            | 0.48    | The icon set. `generate-icons.mjs` copies the icons listed in `icons.config.ts` into the package, so apps don't install the whole set. Apache 2.0 licence. | `kit/packages/ui/src/icons/`, `scripts/` |
| **Fontsource**: Space Grotesk, Space Mono | 5.3     | The kit's fonts, loaded by `@detriz-sh-kit/ui/fonts.css` (optional for apps).                                                                              | `kit/packages/ui/src/fonts.css`          |

## 5. Component workbench

| Technology                              | Version | What it does here                                                                                                                                                                                   | Where                            |
| --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Storybook** (`@storybook/react-vite`) | 10.6    | Shows every component on its own, in every state or variant, plus the `LongText` and `Minimal` stress stories. Reads the stories from `ui`. Runs on port 6007 (`pnpm storybook`). Not deployed yet. | `kit/apps/storybook/.storybook/` |

## 6. Docs site

The public documentation and landing page, at https://smart-home-kit.detriz.com. App: `kit/apps/docs-site`.

| Technology                                                    | Version           | What it does here                                                                                                                                        | Where                                              |
| ------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Docusaurus 3** (`preset-classic`)                           | 3.10              | The static site generator: docs pages, sidebars, navbar, landing page. `future.v4` is on, which puts Docusaurus's CSS in cascade layers below the kit's. | `docusaurus.config.ts`, `sidebars.ts`              |
| **Docusaurus Faster** (`@docusaurus/faster`)                  | 3.10              | Faster builds: the **Rspack** bundler, **SWC** compiler and **Lightning CSS** minifier. Turned on by `future.v4`.                                        | `package.json`                                     |
| **MDX 3**                                                     | 3.1               | Markdown with React components inside. Every docs page is an `.mdx` file.                                                                                | `kit/apps/docs-site/docs/`                         |
| **Live code blocks** (`theme-live-codeblock`, **react-live**) | 3.10 / 4.1        | ` ```jsx live ` blocks render the real `ui` components and let readers edit the code. Every `ui` export is in scope.                                     | `src/theme/ReactLiveScope`, `src/theme/Playground` |
| **Mermaid** (`theme-mermaid`)                                 | 3.10 (Mermaid 12) | Draws diagrams from ` ```mermaid ` code blocks (Domain Model pages), coloured to match the kit.                                                          | `themeConfig.mermaid`                              |
| **Prism** (`prism-react-renderer`)                            | 2.x               | Syntax highlighting in code blocks, with a VS Code dark theme on the site's background.                                                                  | `docusaurus.config.ts`                             |
| **Infima**                                                    | 0.2               | Docusaurus's built-in CSS framework. Its `--ifm-` variables are mapped to `--shk-` tokens.                                                               | `src/css/custom.css`                               |
| **Lexend** (Fontsource variable)                              | 5.3               | The docs site's own font, for the site's text only. Components keep the kit's fonts.                                                                     | `src/kit-styles.ts`                                |
| **Material Symbols** (svg-300, svg-400)                       | 0.48              | Navbar and site icons, drawn as CSS masks.                                                                                                               | `src/css/custom.css`                               |
| **@detriz-sh-kit/tokens**, **@detriz-sh-kit/ui**              | workspace         | The kit itself, loaded once for every page, the same way an app would.                                                                                   | `src/kit-styles.ts`                                |

## 7. Search

| Technology                                                               | Version | What it does here                                                                                                                          | Where                                       |
| ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **Algolia DocSearch** (`@docusaurus/theme-search-algolia`, DocSearch v4) | 4.7     | The search box in the navbar (Cmd/Ctrl+K) and a full results page at `/search`. Included in `preset-classic`. Styled with `--shk-` tokens. | `themeConfig.algolia`, `src/css/custom.css` |
| **Algolia Crawler**                                                      | n/a     | Reads the live site about once a week with the Docusaurus v3 template and stores it in the index. Runs at Algolia, not in our build.       | crawler.algolia.com                         |

Setup details are in the "Docs site search" section of `AGENTS.md`.

## 8. Hosting and deployment

| Technology | What it does here                                                                                                                                                                            | Where      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Vercel** | Hosts the docs site on a custom domain (`smart-home-kit.detriz.com`). Pushing to `main` deploys the live site; every other branch gets a preview URL. Settings live in the Vercel dashboard. | vercel.com |
| **npm**    | ⬜ Not yet: `tokens` and `ui` are built as if published (`exports` → `dist/`) and will be published under the `@detriz-sh-kit` scope.                                                        | npmjs.com  |

There is no CI yet (no GitHub Actions). Storybook isn't hosted yet.

## 9. Design and AI tooling

| Technology                                  | What it does here                                                                                                   | Where                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Figma**                                   | The Figma component library and token variables. Not stored in this repo.                                           | figma.com                |
| **Claude Code** (and other AI coding tools) | Builds and reviews code and docs. Reads the project rules from `AGENTS.md` (`CLAUDE.md` imports it).                | `AGENTS.md`, `CLAUDE.md` |
| **Figma MCP server**                        | Lets AI tools read Figma designs and variables, so code can follow the Figma library.                               | AI tool settings         |
| **Turborepo agent rules**                   | A block at the end of `AGENTS.md`, managed by `turbo`, telling AI tools to read the installed Turborepo docs first. | `AGENTS.md`              |

---

## Planned layers (not chosen yet)

These come with later roadmap phases. Nothing here is installed, and the technologies are **not decided**. The "Candidates" column lists options only.

| Layer                         | What it will do                                                                                          | Candidates                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **API contract** (`api-spec`) | Describes the REST endpoints, the Reading shape and the WebSocket messages. Types are generated from it. | OpenAPI (REST), AsyncAPI (WebSocket), openapi-typescript |
| **API Simulator**             | Serves simulated Readings over REST and WebSocket, following the contract.                               | Node/TypeScript server                                   |
| **Raspberry Pi Hub software** | Reads real Sensors on the Pi and serves the same API.                                                    | Node/TypeScript or Python; I2C libraries for Sensors     |
| **Client SDK** (`client`)     | Typed calls to the API, the live stream, reconnecting and Connection Status. No React.                   | TypeScript, `fetch`, `WebSocket`                         |
| **React bindings** (`react`)  | Hooks and pre-bound `Live*` components that join `client` and `ui`.                                      | React 19                                                 |
| **MCP server**                | Gives AI tools the kit's components, tokens and API.                                                     | Model Context Protocol SDK                               |
| **Generative UI**             | Builds screens at runtime from the kit's components, from a plain-language request, using an LLM.        | Not decided                                              |
| **Tests**                     | Component and package tests. `pnpm test` exists, but no package defines it yet.                          | Vitest, Testing Library                                  |
| **Lint**                      | Code rules and the dependency rules between packages. `pnpm lint` exists, but nothing defines it yet.    | ESLint                                                   |
| **CI**                        | Build, typecheck and format checks on every pull request.                                                | GitHub Actions                                           |
| **Publishing**                | Versions and releases of the npm packages.                                                               | Changesets                                               |
