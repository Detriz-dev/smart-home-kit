# Docs site: implementation plan

Status: **plan, not started**. Nothing in the repo has changed yet.

## Goal

A public documentation site for the DeTriz Smart Home Kit, built with **Docusaurus** in `kit/apps/docs-site`. It teaches a developer how to use the kit: what each component is for, when to use it, how it looks in each state, its props and code examples. Later it also holds the SDK and API docs.

## Decisions

| Decision  | Choice                                                                    | Why                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | **Docusaurus** (replaces the Starlight plan in the architecture overview) | It is React, like the kit, so real components can sit directly in the pages                                                                                                           |
| Location  | **`kit/apps/docs-site`**                                                  | Same idea as the Docusaurus monorepo guide (the site is its own package next to the code), placed next to Storybook. `kit/apps/*` is already in the workspace, so nothing has to move |
| Name      | **`docs-site`**                                                           | Says what it is. Doesn't clash with the root `docs/` folder or with the future landing page                                                                                           |
| Repos     | **One repo, for good.** No split into two repos later                     | Users choose what they use by installing npm packages, not by picking a repo                                                                                                          |
| Scope     | Documents **`kit/` only**                                                 | `platform/` code (Hub, API, Studio) runs for users, they don't build with it                                                                                                          |

### What goes where

| Folder              | Meaning                                                                              | Contains                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `kit/`              | The developer product: everything a developer needs to install, learn and build with | `packages/` (tokens, ui, later client, react, api-spec, mock), `apps/` (docs-site, storybook), later `examples/` |
| `platform/` (later) | The smart home product: what we run for users                                        | Studio, landing page, FastAPI backend, Hub software                                                              |
| `docs/`             | Product and architecture thinking                                                    | PRDs, domain model, ADRs, workflows                                                                              |

### One job per tool

| Tool                                   | Job                                                                                                                                     | Audience              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **docs-site**                          | Getting started, foundations, one page per component with guidance and examples, glossary. Later: SDK and API                           | People using the kit  |
| **Storybook**                          | The workbench: every state and stress story (`LongText`, `Minimal`), used while building and reviewing. Linked from each component page | Us, and curious users |
| **`<Name>.md`** next to each component | The internal spec (Figma nodes, domain rules, open questions)                                                                           | Us, Claude            |

## How it works

### Folder structure

```
kit/apps/docs-site/
├── package.json                  name "docs-site", private
├── docusaurus.config.ts          site settings, theme, deploy URL
├── sidebars.ts                   sidebar groups
├── tsconfig.json
├── src/
│   ├── pages/index.tsx           the landing page at "/" (explains the kit)
│   ├── clientModules/
│   │   └── kit-styles.ts         loads fonts, tokens.css and ui styles.css once
│   ├── css/custom.css            maps Docusaurus colours and fonts to --shk- tokens
│   └── components/               helpers used only on the site
│       ├── Example.tsx           a framed box that shows a live component
│       └── StorybookLink.tsx     "See all states in Storybook"
└── docs/                         served under /docs
    ├── domain/                   top bar "Domain": the smart home model
    │   ├── index.mdx             overview
    │   └── glossary.mdx          user-facing part of the Ubiquitous Language
    └── components/               top bar "Components"
        ├── index.mdx             overview
        ├── foundations/          tokens.mdx (colours, spacing, type), icons.mdx
        ├── status/               device-connection-status.mdx, …
        ├── readings/
        ├── context/
        ├── controls/
        └── layout/
```

The site has a landing page at `/` (like the Eightshift DevKit docs, see `screens/landing.png`) and two sections in the top bar, **Domain** and **Components**, each with its own sidebar. Clicking the site title opens the landing page. Inside Components, the categories (Status, Readings, Context, Controls, Layout) become the sidebar groups, so the site follows the same mental model as the code.

### How the site gets the components

The site uses the kit exactly as an outside developer would: by package name, through each package's `exports`.

```json
// kit/apps/docs-site/package.json (dependencies)
"@detriz-sh-kit/tokens": "workspace:*",
"@detriz-sh-kit/ui": "workspace:*",
"react": "catalog:",
"react-dom": "catalog:"
```

```mdx
// a page
import { DeviceConnectionStatus } from "@detriz-sh-kit/ui";

<DeviceConnectionStatus status="stale" />
```

Never import with relative paths or from `/src/` (dependency rules in the architecture overview).

**Important while writing docs:** the site uses the **built** `ui` package (`dist/`), not the source. If you change a component, rebuild it (`pnpm --filter @detriz-sh-kit/ui build`) to see the change on the site. Storybook doesn't have this problem because its stories import the source directly. A watch mode for `ui` can fix this later.

### Styles

`src/clientModules/kit-styles.ts` loads everything once for every page, the same way Storybook's `preview.ts` does:

```ts
import "@fontsource/space-grotesk/400.css"; // + the other weights Storybook loads
import "@fontsource/space-mono/400.css";
import "@detriz-sh-kit/tokens/tokens.css";
import "@detriz-sh-kit/ui/styles.css";
```

`src/css/custom.css` makes Docusaurus itself look like the kit by pointing its theme variables (`--ifm-…`) at our tokens, for example `--ifm-color-primary: var(--shk-…)` and `--ifm-font-family-base` set to Space Grotesk. Use only `--shk-` tokens, no raw values.

**The CSS layer problem.** Our components' CSS is inside `@layer detriz`. Docusaurus's theme (Infima) is not in a layer, and **CSS outside a layer always wins over CSS in a layer**, whatever the selector. So Infima's styles for `button`, `a`, `table`, `h1`–`h6` and so on can override our components. The fix is to put Docusaurus's CSS into layers too. Recent Docusaurus versions have an option for this (`future.v4.useCssCascadeLayers`). Check the docs for the installed version, then make sure `detriz` comes after the Docusaurus layers. Test it with `Button` and `SpaceCard` before writing any pages.

### A component page

Each page lives in `docs/components/<category>/<kebab-name>.mdx`, is written for users, and follows the same template:

1. **What it is**: one or two sentences (from "Purpose" in the spec).
2. **Example**: the live component in `<Example>`, with its code below.
3. **When to use / when not to**: from "Component in domain model context".
4. **States or variants**: one live example per state or variant.
5. **Props**: a table (name, type, default, description), copied from the `/** */` comments.
6. **Accessibility**: from the spec.
7. **Related**: other components and `<StorybookLink>`.

Rules:

- Use the Ubiquitous Language terms, as everywhere else.
- No Figma node IDs, open questions or internal notes. Those stay in `<Name>.md`.
- Links to other pages use the site's links, not repo paths.
- When a component changes, update its page in the same PR. Add this step to the checklist in `component-building-v2.md`.

### Building and running

| Task                                  | Command                                                                |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Run the site locally                  | `pnpm docs-site` (new root script: `turbo run dev --filter=docs-site`) |
| Build only the site and what it needs | `pnpm turbo run build --filter=docs-site...`                           |
| Build everything                      | `pnpm build` (tokens → ui → storybook + docs-site)                     |

The `...` after `docs-site` tells Turbo to also build the packages the site depends on (tokens, then ui), and nothing else.

The site's scripts:

```json
"dev": "docusaurus start",
"build": "docusaurus build --out-dir dist",
"typecheck": "tsc"
```

The build goes to **`dist/`**, not Docusaurus's default `build/`. That way the existing Turbo `outputs` (`dist/**`), `.gitignore` and `.prettierignore` already cover it. Using `build/` would cause a problem: ignoring `build/` would also ignore `kit/packages/tokens/build/config.json`, which is source code.

The only new ignore entry is `.docusaurus/` (Docusaurus's cache), in `.gitignore` and `.prettierignore`.

### Deployment

Hosting: **GitHub Pages**, through a GitHub Actions workflow. The repo is public, so it's free.

What the workflow does (`.github/workflows/docs-site.yml`, runs on pushes to `main` that touch `kit/**`):

1. Check out the whole repo, set up Node 22 and pnpm, run `pnpm install --frozen-lockfile`.
2. Build the site and Storybook: `pnpm turbo run build --filter=docs-site... --filter=storybook...`.
3. Copy `kit/apps/storybook/storybook-static/` into `kit/apps/docs-site/dist/storybook/`.
4. Publish `kit/apps/docs-site/dist/`.

The whole repo is used to build it, but **only the `dist/` folder goes online**. Visitors never get the source code.

Result: the site is at `https://<github-user>.github.io/smart-home-kit/` and Storybook at `…/smart-home-kit/storybook/`. In `docusaurus.config.ts` set `url` and `baseUrl: "/smart-home-kit/"`. Links to Storybook use Docusaurus's `pathname://` prefix, so its link checker doesn't report them as broken.

## Implementation steps

Do one step per branch (`<issue-number>-short-name`). Each step has a clear "done when".

### 0. Decisions on paper

- ADR `docs/adr/0001-one-repo.md`: stay with one repo, `kit/` vs `platform/` meaning.
- ADR `docs/adr/0002-docusaurus-docs-site.md`: Docusaurus instead of Starlight, in `kit/apps/docs-site`.
- Update the architecture overview (Starlight → Docusaurus, `apps/docs` → `apps/docs-site`, remove the repo split section) and `CLAUDE.md`.

**Done when** the docs describe the new plan and nothing contradicts it.

### 1. Scaffold the app

- In `kit/apps`, run the Docusaurus `create` command with the `classic` template, TypeScript and without installing (`--skip-install`). Pin the version you get.
- Clean up the template: remove the blog and the example pages. Add the landing page and the Domain and Components sections.
- Switch React to `catalog:`, add the scripts above, add `.docusaurus/` to the ignore files, add the `pnpm docs-site` root script.
- Run `pnpm install` from the root.

**Done when** `pnpm docs-site` opens the empty site and `pnpm build` builds it into `kit/apps/docs-site/dist/`.

### 2. Connect the kit and fix the styles

- Add `tokens`, `ui` and the fonts as dependencies, add `kit-styles.ts`.
- Turn on CSS cascade layers and check the order against `@layer detriz`.
- Map the Docusaurus theme to the tokens in `custom.css`.
- Make a test page with `Button` and `SpaceCard` and compare it with Storybook.

**Done when** the components look the same on the site as in Storybook.

### 3. The first component page (the template)

- Build `Example` and `StorybookLink`.
- Write `components/status/device-connection-status.mdx`, the reference component, with all parts of the template.

**Done when** the page is complete and can be copied for the next component.

### 4. The rest of the content

- One page per existing component: DeviceConnectionStatus, DeviceFaultStatus, DevicePairingStatus, ReadingValue, UnitLabel, SensorReading, ModuleCard, SpaceCard, LocationPath, SensorLabel, Button, Switch, StackLayout, ColumnLayout, ContentSection.
- `intro.md`, `foundations/tokens.mdx`, `foundations/icons.mdx`, `concepts/glossary.mdx`.
- Add the "update the docs page" step to the component checklist.

**Done when** every component exported from `ui/src/index.ts` has a page.

### 5. Deploy

- Turn on GitHub Pages (source: GitHub Actions) and add the workflow.
- Set `url` and `baseUrl`, add `StorybookLink` links.

**Done when** the site and Storybook are online and update on every push to `main`.

## Later

- **Editable code examples:** Docusaurus's live code block theme, so users can edit an example and see the result.
- **Generated props tables:** read the props and `/** */` comments from the TypeScript (for example with `react-docgen-typescript`) instead of copying them by hand.
- **Search:** a local search plugin, or Algolia DocSearch once the site is public.
- **SDK and API docs:** once `client`, `react` and `api-spec` exist. The REST reference can be rendered from `openapi.yaml`.
- **Versioned docs:** once the packages are published to npm.
- **A "How we build it" section:** the domain model, ADRs and workflows from `docs/`, to show the thinking behind the kit.
