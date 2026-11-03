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

`frontend/` is **not** part of the pnpm workspace. It is a separate npm + Vite scaffold (`cd frontend && npm run dev | build | lint`) and Prettier ignores it. It will move to `platform/apps/studio`.

Turbo's `build`, `dev`, `test` and `typecheck` depend on `^build`, so `ui` needs a built `tokens/dist/tokens.css`. If a token change doesn't show up, rebuild the tokens.

pnpm 11 blocks dependency install scripts until they are listed under `allowBuilds` in `pnpm-workspace.yaml` (`true` to run, `false` to skip). If `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, add the package there with a comment saying why.

## Architecture

The target design is in `docs/architecture/architecture-overview.md`. Only part of it exists so far.

The project stays **one repo for good** (decided in `docs/product-requirements/docusaurus-and-structure.md`). Users choose what they use by installing npm packages, not by picking a repo. The architecture overview still describes a later split into two repos and a Starlight docs app; that is out of date until the ADRs and the overview update (step 0 of that plan) are done.

- `kit/`: the developer product, everything a developer needs to install, learn and build with (design system, SDK, API spec, docs site, Storybook). It exists today.
- `platform/`: the smart home product, what we run for users (Live Studio, product landing page, FastAPI backend, Raspberry Pi hub). It doesn't exist yet. `frontend/` is the start of Studio.
- Packages that exist: `kit/packages/tokens`, `kit/packages/ui`, `kit/apps/storybook`, `kit/apps/docs-site`. Planned but not created yet: `api-spec`, `client`, `react`, `mock`.

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

`kit/apps/docs-site` is the public documentation site, built with **Docusaurus 3** (React, TypeScript). The full plan and its steps are in `docs/product-requirements/docusaurus-and-structure.md`; follow it and keep it up to date.

- It documents `kit/` only, for people using the kit. Internal specs stay in `<Name>.md` next to each component; site pages are written for users (no Figma node IDs or open questions).
- `src/pages/index.tsx` is the landing page at `/`. Clicking the site title opens it.
- Docs live under `/docs`, in two top-bar sections with their own sidebars (`sidebars.ts`, generated from the folders): `docs/domain/` (the smart home model, glossary) and `docs/components/` (one page per component, grouped by category).
- It builds into `dist/` (`docusaurus build --out-dir dist`), not Docusaurus's default `build/`, so the existing ignore and Turbo rules cover it. Don't add `build/` to `.gitignore`: it would also hide `kit/packages/tokens/build/config.json`. `.docusaurus/` is its cache.
- `docusaurus.config.ts` and `sidebars.ts` run in Node, not in the browser: no JSX or browser APIs there.
- Not yet connected to the kit (step 2 of the plan): the tokens, fonts and `ui` components are not loaded, and the landing page still uses Docusaurus's `--ifm-` variables. Once connected, the site imports the kit by package name (`@detriz-sh-kit/ui`), uses the **built** `ui` (`dist/`), so rebuild `ui` to see component changes, and needs Docusaurus's CSS in cascade layers below `@layer detriz`, because unlayered CSS always wins.

### Component conventions

Full workflow: `docs/architecture/design-system/workflows/component-building-v2.md` (the checklist is at the end).

- One folder per component: `kit/packages/ui/src/components/<category>/<Name>/` with `<Name>.md`, `<Name>.types.ts`, `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx` and `index.ts`. Reference examples: `status/DeviceConnectionStatus` (states) and `context/LocationPath` (variants).
- An exported `<Name>Props` interface with a `/** */` comment on every prop. Use semantic HTML.
- CSS Modules wrapped in `@layer detriz`, using only `var(--shk-…)` tokens (no raw colours or sizes).
- Export the component and its props type from `src/index.ts`.
- States or variants, depending on the category. Status, Readings, History and Controls components cover the target states (from the Ubiquitous Language): loading, Connected, Stale, Disconnected (value hidden, disconnected icon shown) and Fault. Other categories (Context, Layout, Comparison, Feedback) describe their variants instead and say why the target states don't apply. One story per state or variant.
- Two stress stories for every component: `LongText` (longest realistic values in a narrow container) and `Minimal` (smallest case).

General naming rules (PascalCase components, `use<Thing>` hooks, unit suffixes like `temperatureC`, `is/has` booleans, `on<Event>`/`handle<Event>`) are in `docs/architecture/design-system/ds-conventions-and-structure.md`.

## Domain language

Use the terms from `docs/architecture/domain-model/ubiquitous-language.md` exactly, in code, types, UI copy and docs: Site, Space, Hub, Module, Slot, Sensor, Asset, Metric, Unit, Reading, and so on. Device Status is three separate fields: Pairing Status, Connection Status (Connecting / Connected / Stale / Disconnected, for paired Devices only) and Fault. A Sensor is not a Device.

## Repo conventions

- Branches are named `<issue-number>-short-name`. Commits follow Conventional Commits, scoped to the package or app (`feat(ui): …`).
- Architecture decisions go in ADRs: `docs/adr/NNNN-title.md`.
- Never commit `dist/`, `storybook-static/`, `.docusaurus/`, `.turbo/` or `node_modules/`.
- `AGENTS.md` contains a block managed by Turborepo: before changing Turbo config or commands, read the docs bundled in the installed `turbo` package, because they may differ from what you know.
