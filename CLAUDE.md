# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working style

- Ask clarifying questions before acting when a request is ambiguous.
- This is a learning project by a UX designer moving toward engineering. The docs explain concepts for beginners, so when you explain a change, keep it plain and short.

## Commands

Run everything from the repo root. It uses pnpm 11 workspaces, Turborepo and Node 22 or later (`corepack enable` if `pnpm` is missing).

| Task                                                   | Command                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Install                                                | `pnpm install`                                                                        |
| Storybook (port 6007)                                  | `pnpm storybook`                                                                      |
| Docs site (port 3000)                                  | `pnpm docs-site`                                                                      |
| Build everything (tokens → ui → storybook + docs-site) | `pnpm build` (`--force` skips the Turbo cache)                                        |
| Build only the docs site and what it needs             | `pnpm turbo run build --filter=docs-site...`                                          |
| Build one package                                      | `pnpm --filter @detriz-sh-kit/tokens build` / `pnpm --filter @detriz-sh-kit/ui build` |
| Typecheck components / docs site                       | `pnpm --filter @detriz-sh-kit/ui typecheck` / `pnpm --filter docs-site typecheck`     |
| Format / check formatting                              | `pnpm format` / `pnpm format:check`                                                   |

`pnpm lint` and `pnpm test` exist at the root, but no workspace package defines `lint` or `test` scripts yet, so there are no tests to run.

Turbo's `build`, `dev`, `test` and `typecheck` depend on `^build`, so `ui` needs a built `tokens/dist/tokens.css`. If a token change doesn't show up, rebuild the tokens.

pnpm 11 blocks dependency install scripts until they are listed under `allowBuilds` in `pnpm-workspace.yaml` (`true` to run, `false` to skip). If `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, add the package there with a comment saying why.

## Architecture

### Product scope

The product is described in `docs/product-requirements/product-overview.md`. It is a **software-only** kit for building smart home UI apps quickly, and AI is part of it in two ways: AI tools help build the UI, and apps use an LLM as a feature. The kit has six parts:

1. UI components in Figma (a Figma library, not stored in this repo).
2. UI components in React (`ui`, plus the planned `react` package).
3. An MCP server, so AI tools can build UIs with the kit's components, tokens and API, and Generative UI, so apps can build screens at runtime from a plain-language request.
4. An API Simulator: simulated Sensor Readings over REST and WebSocket, so you can build without hardware.
5. A Raspberry Pi client: software that runs on a Raspberry Pi (the Hub), reads real Sensors and serves the same API as the simulator, plus a typed SDK (`client`) that connects apps to it.
6. A ready-made smart home domain model: the Glossary, Data model, Device lifecycle and Events and commands in `kit/apps/docs-site/docs/domain-model/`. Every other part uses it, so builders start without designing the model themselves.

**Dropped from the scope:** custom snap-in Module hardware, Live Studio and Record & Replay. Older docs (architecture overview, domain model, POC scope, roadmap) still describe them and are out of date.

### Repo structure

The target design is in `docs/architecture/architecture-overview.md`. Only part of it exists so far, and parts of it are out of date (see above).

The project stays **one repo for good**. Users choose what they use by installing npm packages, not by picking a repo. The architecture overview still describes a later split into two repos and a Starlight docs app; that is out of date until the ADRs and the overview are updated.

- `kit/`: everything a developer installs, learns and builds with. All six parts of the kit belong here, following the overview's rule: "if a user needs it to install, learn or build with the kit, it goes in `kit/`". It exists today.
- `platform/`: was meant for what we run ourselves (Live Studio, landing page, backend, Hub). With Live Studio dropped, nothing is planned for it now. It doesn't exist.
- Packages that exist: `kit/packages/tokens`, `kit/packages/ui`, `kit/apps/storybook`, `kit/apps/docs-site`. Planned but not created yet: `api-spec`, `client`, `react`, the API Simulator (earlier called `mock`), the MCP server and Generative UI, and the Raspberry Pi Hub software.

Dependency rules (see "Dependency rules" in the overview):

- Nothing in `kit/` imports from `platform/`. `platform/` imports kit code only by package name (`@detriz-sh-kit/*`) and only through each package's `exports`, never with relative paths or `/src/` imports.
- `tokens` has no dependencies. `ui` is presentational only: it takes props, never fetches data and never imports `client`. Only the planned `react` package joins `client` and `ui` (the pre-bound `Live*` components).
- Libraries (`ui`, `react`) list React as a `peerDependency` plus a `devDependency`. Apps own React. Shared React versions come from the `catalog:` in `pnpm-workspace.yaml`.
- Internal packages are linked with `workspace:*` and built as if they were published (`exports` → `dist/`).

### Design system pipeline

1. **Tokens** (`kit/packages/tokens`): DTCG JSON in `src/primitive/` (raw values), `src/semantic/` (purpose, refers to primitives with `{palette.gray.900}`) and `src/component/`. Style Dictionary (`build/config.json`) builds them into `dist/tokens.css` as CSS variables with the **`--shk-` prefix**, for example `--shk-color-text-muted`. Some docs and comments still say `--dtz-`; that is out of date.
2. **UI** (`kit/packages/ui`): Vite library mode builds `src/index.ts` into `dist/index.js` + `dist/styles.css`, and `tsc -p tsconfig.build.json` emits the `.d.ts` files (stories and tests are excluded). Only what `src/index.ts` exports is public.
3. **Storybook** (`kit/apps/storybook`): loads stories from `../../packages/ui/src/**/*.stories.tsx` and imports `@detriz-sh-kit/tokens/tokens.css` once in `preview.ts`. It is the workbench: every state and stress story.

### Docs site

`kit/apps/docs-site` is the public documentation site, built with **Docusaurus 3** (React, TypeScript). Its information architecture will be planned in `docs/architecture/design-system/information-architecture.md` (empty for now). What still needs documenting is tracked in `docs/architecture/design-system/documentation-implementation-plan.md`.

- It documents `kit/` only, for people using the kit. Internal specs stay in `<Name>.md` next to each component; site pages are written for users (no Figma node IDs or open questions).
- `src/pages/index.tsx` is the landing page at `/`. Clicking the site title opens it.
- Docs live under `/docs`, in three top-bar sections with their own sidebars (`sidebars.ts`, generated from the folders): **Get Started** in `docs/get-started/` (Installation and Quick start, written as if the packages were already on npm; they aren't published yet), **Domain Model** in `docs/domain-model/` (the smart home model: Glossary, Data model, Device lifecycle and Events and commands; open questions about them stay in `docs/architecture/domain-model/open-questions.md`) and **UI Components** in `docs/ui-components/` (one page per component, grouped by category).
- It builds into `dist/` (`docusaurus build --out-dir dist`), not Docusaurus's default `build/`, so the existing ignore and Turbo rules cover it. Don't add `build/` to `.gitignore`: it would also hide `kit/packages/tokens/build/config.json`. `.docusaurus/` is its cache.
- `docusaurus.config.ts` and `sidebars.ts` run in Node, not in the browser: no JSX or browser APIs there.
- **Deployment: Vercel**, on a custom domain (the domain's DNS points to Vercel). Pushing to `main` deploys the live site, and every other branch or PR gets a preview URL. The settings live in the Vercel dashboard, not in the repo (there is no `vercel.json`):
  - Root Directory: `kit/apps/docs-site`. Framework Preset: Docusaurus (v2+). Node.js: 22.x.
  - Install Command: `pnpm install`. Build Command: `cd ../../.. && pnpm turbo run build --filter=docs-site...` (runs from the repo root so tokens → ui → docs-site build in order). Output Directory: `dist`.
  - Environment variable `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel uses the pnpm version pinned in the root `package.json`.
  - `url` in `docusaurus.config.ts` must match the production domain; keep `baseUrl: "/"`.
- Connected to the kit: `src/kit-styles.ts` loads the fonts, tokens and `ui` CSS on every page, and component pages show the real components in ` ```jsx live ` code blocks (`@docusaurus/theme-live-codeblock`; every `ui` export is in scope via `src/theme/ReactLiveScope`). The site uses the **built** `ui` (`dist/`), so rebuild `ui` to see component changes. `future.v4: true` puts Docusaurus's CSS in cascade layers below `@layer detriz`; don't remove it, because unlayered CSS always wins. The landing page still uses Docusaurus's `--ifm-` variables. How to write a component page: `docs/architecture/design-system/workflows/component-documentation.md`.

### Component conventions

Full workflow: `docs/architecture/design-system/workflows/component-building.md` (the checklist is at the end).

- One folder per component: `kit/packages/ui/src/components/<category>/<Name>/` with `<Name>.md`, `<Name>.types.ts`, `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx` and `index.ts`. Reference examples: `status/DeviceConnectionStatus` (states) and `context/LocationPath` (variants).
- An exported `<Name>Props` interface with a `/** */` comment on every prop. Use semantic HTML.
- CSS Modules wrapped in `@layer detriz`, using only `var(--shk-…)` tokens (no raw colours or sizes).
- Export the component and its props type from `src/index.ts`.
- States or variants, depending on the category. Status, Readings, History and Controls components cover the target states (from the Glossary): loading, Connected, Stale, Disconnected (value hidden, disconnected icon shown) and Fault. Other categories (Context, Layout, Comparison, Feedback) describe their variants instead and say why the target states don't apply. One story per state or variant.
- Two stress stories for every component: `LongText` (longest realistic values in a narrow container) and `Minimal` (smallest case).

General naming rules (PascalCase components, `use<Thing>` hooks, unit suffixes like `temperatureC`, `is/has` booleans, `on<Event>`/`handle<Event>`) are in `docs/architecture/design-system/ds-conventions-and-structure.md`.

## Domain language

The Glossary (`kit/apps/docs-site/docs/domain-model/glossary.mdx`) is the project's Ubiquitous Language. It lives in the docs site so there is one copy, published for users; internal docs link to it. Use its terms exactly, in code, types, UI copy and docs: Site, Space, Hub, Module, Sensor, Asset, Metric, Unit, Reading, and so on. Device Status is three separate fields: Pairing Status, Connection Status (Connecting / Connected / Stale / Disconnected, for paired Devices only) and Fault. A Sensor is not a Device.

## Repo conventions

- Branches are named `<issue-number>-short-name`. Commits follow Conventional Commits, scoped to the package or app (`feat(ui): …`).
- Architecture decisions go in ADRs: `docs/adr/NNNN-title.md`.
- Never commit `dist/`, `storybook-static/`, `.docusaurus/`, `.turbo/` or `node_modules/`.
- `AGENTS.md` contains a block managed by Turborepo: before changing Turbo config or commands, read the docs bundled in the installed `turbo` package, because they may differ from what you know.
