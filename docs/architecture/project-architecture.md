# Project Architecture

This document explains how DeTriz Smart Home Kit is organised: what the kit is made of, where each part lives in the repo, how the parts depend on each other, and what is built today versus planned.

It has a companion: [Tech stack](tech-stack.md) lists every technology the project uses, layer by layer. Read this file for the **shape** of the project, and that one for the **tools**.

Terms such as Site, Space, Hub, Sensor, Reading and Connection Status follow the [Glossary](../../kit/apps/docs-site/docs/domain-model/glossary.mdx).

## Table of contents

- [Architecture at a glance](#architecture-at-a-glance)
- [What changed](#what-changed)
- [Key decisions](#key-decisions)
- [The six parts of the kit](#the-six-parts-of-the-kit)
- [Repo structure](#repo-structure)
- [Dependency rules](#dependency-rules)
- [How the design system is built](#how-the-design-system-is-built)
- [The docs site](#the-docs-site)
- [How data will flow (planned)](#how-data-will-flow-planned)
- [Where to install React and other packages](#where-to-install-react-and-other-packages)
- [Build and deploy](#build-and-deploy)
- [Way of working](#way-of-working)
- [Open questions](#open-questions)
- [Appendix: a beginner's guide to `kit/packages`](#appendix-a-beginners-guide-to-kitpackages)

---

## Architecture at a glance

DeTriz Smart Home Kit is a **software-only** kit for building smart home UI apps quickly. AI is part of it in two ways: AI tools help build the UI, and apps use an LLM as a feature. The full product description is in the [product overview](../product-requirements/product-overview.md).

The project lives in **one public repo, for good**. People choose which parts they use by installing npm packages, not by picking a repo.

Everything a developer installs, learns or builds with lives in **`kit/`**. Product thinking (product overview, roadmap, customer needs, architecture) lives in **`docs/`**.

```
smart-home-kit  (one public repo)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  kit/                                                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ packages/   tokens · ui                          ✅ built      │  │
│  │             api-spec · client · react            ⬜ planned    │  │
│  │ apps/       storybook · docs-site                ✅ built      │  │
│  │             API Simulator · MCP server           ⬜ planned    │  │
│  │ hub/        Raspberry Pi Hub software            ⬜ planned    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  docs/   product requirements, architecture, customer, learning      │
└──────────────────────────────────────────────────────────────────────┘
```

**Rule for deciding where something goes:** if a user needs it to install, learn or build with the kit, it goes in `kit/`. Product thinking goes in `docs/`.

**What exists today:** the design tokens, the React components, Storybook and the public docs site (with search), deployed at https://smart-home-kit.detriz.com. Everything about live data (API, simulator, Hub, SDK) is still planned.

---

## What changed

Earlier versions of this document described a different plan. These parts are **dropped** or **replaced**:

| Earlier plan                                                      | Now                                                                                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One repo now, **split into two repos later** (`kit` + `platform`) | **One repo for good.** No split is planned.                                                                                                                  |
| `platform/` folder for Live Studio, landing page, backend, Hub    | **No `platform/`.** Live Studio is dropped; the landing page is part of the docs site; the Hub software is part of the kit.                                  |
| **Live Studio** (our own live dashboard app)                      | **Dropped.** The kit helps people build their own apps instead.                                                                                              |
| **Record & Replay** of sessions                                   | **Dropped.**                                                                                                                                                 |
| Custom snap-in **Module hardware**                                | **Dropped.** The kit is software only and works with off-the-shelf Sensors on a Raspberry Pi.                                                                |
| Raspberry Pi **pushes Readings to a hosted API** (FastAPI)        | The **Hub serves the API itself**, on the local network. The **API Simulator** serves the same API with simulated Readings, so apps can switch between them. |
| `@detriz-sh-kit/mock` (MSW fake data)                             | Replaced by the **API Simulator** (REST and WebSocket).                                                                                                      |
| API docs in **Astro Starlight**                                   | One docs site built with **Docusaurus 3**.                                                                                                                   |
| Token prefix `--dtz-`                                             | **`--shk-`** (for example `--shk-color-text-primary`).                                                                                                       |
| Wrap a third-party component library first (Mantine, shadcn/ui)   | Own components from the start.                                                                                                                               |
| New                                                               | **MCP server and Generative UI**: AI tools build UIs with the kit, and apps build screens at runtime from a plain-language request.                          |
| New                                                               | A ready-made **smart home domain model** (Glossary, Data model, Device lifecycle, Events and commands), published on the docs site.                          |

---

## Key decisions

| Decision                   | Choice                                                                           | Why                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Number of repos            | **One public monorepo, for good**                                                | One place to look. A change that touches tokens, components and docs is one PR. Users pick parts by installing packages.                       |
| Where kit code lives       | **Everything in `kit/`**                                                         | The folder tree shows what a user gets. `docs/` holds the product thinking.                                                                    |
| Visibility                 | **Everything public**                                                            | The repo shows the thinking as well as the code.                                                                                               |
| Package consumption        | **`workspace:*` links, built as if published** (`exports` → `dist/`)             | No release overhead while things change. Publishing to npm later is a config change, not a refactor.                                           |
| Design system framework    | **React only**                                                                   | Keeps the scope manageable. Tokens are plain CSS variables, so non-React users still get the visual language.                                  |
| Styling                    | **CSS Modules inside `@layer detriz`, only `var(--shk-…)` tokens**               | No raw colours or sizes in components. The cascade layer means any app's own CSS overrides the kit without specificity fights.                 |
| Shared language            | **The Glossary is the Ubiquitous Language**                                      | Code, types, UI copy and docs use the same names (Site, Space, Hub, Sensor, Reading…). It lives in the docs site, so there is one public copy. |
| Documentation              | **One Docusaurus 3 site, deployed on Vercel**                                    | React-based, so it renders the real components in live code blocks. Vercel gives a preview URL for every branch.                               |
| Search                     | **Algolia DocSearch**                                                            | Free for public technical docs, built into Docusaurus, no search server to run. Setup: the "Docs site search" section of `AGENTS.md`.          |
| Live data source (planned) | **The Hub and the API Simulator serve the same API**                             | An app built against the simulator works with the real Hub by changing one setting. No hardware needed to start.                               |
| API contract (planned)     | **Contract first** in `kit/packages/api-spec`                                    | The Hub, the simulator and the client SDK all follow one spec, so they can't drift apart.                                                      |
| AI context                 | **`AGENTS.md`** holds the rules for AI coding tools; `CLAUDE.md` only imports it | Every AI tool (Claude Code, Codex, Cursor, Copilot) reads the same rules from one file.                                                        |

There is no `docs/adr/` folder yet. When decisions get Architecture Decision Records, they go in `docs/adr/NNNN-title.md`.

---

## The six parts of the kit

The kit has six parts. This table says what each one is, where it lives and whether it exists yet.

| #   | Part                             | What it is                                                                                                                                 | Where it lives                                                                 | Status                         |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| 1   | **UI components in Figma**       | A Figma library for designing smart home screens, with the same tokens as the code.                                                        | Figma (not in this repo). Tokens are exported to `kit/packages/tokens/figma/`. | ✅ In progress                 |
| 2   | **UI components in React**       | Typed, props-only React components themed with design tokens.                                                                              | `kit/packages/tokens`, `kit/packages/ui`; later `kit/packages/react`           | ✅ `tokens`, `ui` · ⬜ `react` |
| 3   | **MCP server and Generative UI** | The MCP server gives AI tools the kit's components, tokens and API. Generative UI lets an app build screens from a plain-language request. | `kit/` (folder not decided)                                                    | ⬜ Planned                     |
| 4   | **API Simulator**                | Simulated Sensor Readings over REST and WebSocket, so you can build without hardware.                                                      | `kit/` (folder not decided)                                                    | ⬜ Planned                     |
| 5   | **Raspberry Pi client**          | Software on a Raspberry Pi (the Hub) that reads real Sensors and serves the same API as the simulator, plus a typed SDK for apps.          | `kit/` (Hub software); `kit/packages/client` (SDK)                             | ⬜ Planned                     |
| 6   | **Smart home domain model**      | The Glossary, Data model, Device lifecycle and Events and commands. Every other part uses it.                                              | `kit/apps/docs-site/docs/domain-model/`                                        | ✅ Published                   |

The order of work follows the [roadmap](../product-requirements/roadmap.md):

- **Phase 1, POC:** landing page, domain model, Figma library, Storybook, `tokens` and `ui` on npm, developer docs.
- **Phase 2, MVP:** API design, Raspberry Pi Hub software with one real Sensor, the `client` SDK, components for live Readings (Connection Status and Fault), Figma library v2.
- **Later:** more Sensors, the API Simulator, the MCP server and Generative UI.

---

## Repo structure

What exists today is marked ✅. Planned folders are marked ⬜ and their names may change.

```
smart-home-kit/
├── kit/                                 everything a user installs, learns or builds with
│   ├── packages/
│   │   ├── tokens/              ✅      @detriz-sh-kit/tokens: design tokens as CSS variables
│   │   │   ├── figma/                     Figma variable exports (input)
│   │   │   ├── scripts/figma-to-dtcg.mjs  converts Figma exports into DTCG JSON
│   │   │   ├── src/                       DTCG JSON: primitive/, semantic/, component/
│   │   │   ├── build/config.json          Style Dictionary config (prefix "shk")
│   │   │   └── dist/tokens.css            built CSS variables (--shk-…)
│   │   │
│   │   ├── ui/                  ✅      @detriz-sh-kit/ui: presentational React components
│   │   │   ├── src/
│   │   │   │   ├── components/            one folder per component, grouped by category:
│   │   │   │   │                          context, controls, feedback, layout, readings, status
│   │   │   │   ├── icons/                 Icon component + icon set (Material Symbols)
│   │   │   │   ├── utils/ types/          shared helpers and types (e.g. Metric)
│   │   │   │   ├── fonts.css              the kit's fonts (Space Grotesk, Space Mono)
│   │   │   │   └── index.ts               the public entry: only what's exported here is public
│   │   │   ├── scripts/generate-icons.mjs copies the listed Material Symbols into the package
│   │   │   ├── vite.config.ts             library mode build → dist/index.js + dist/styles.css
│   │   │   └── tsconfig.build.json        emits the .d.ts type files
│   │   │
│   │   ├── api-spec/            ⬜      the API contract (REST + WebSocket)
│   │   ├── client/              ⬜      typed SDK that connects apps to the Hub or the simulator
│   │   └── react/               ⬜      hooks and pre-bound Live* components (joins client + ui)
│   │
│   ├── apps/
│   │   ├── storybook/           ✅      component workbench: every state and stress story
│   │   └── docs-site/           ✅      public docs site (Docusaurus 3), landing page at "/"
│   │       ├── docs/                      get-started/, domain-model/, ui-components/
│   │       ├── src/pages/index.tsx        landing page
│   │       ├── src/kit-styles.ts          loads the kit's fonts, tokens and component CSS
│   │       ├── src/theme/                 live code block scope and playground
│   │       ├── src/css/custom.css         site styling, mapped to --shk- tokens
│   │       ├── docusaurus.config.ts       site config, navbar, search (Algolia)
│   │       └── sidebars.ts                one sidebar per top-bar section
│   │
│   └── (planned)                ⬜      API Simulator, MCP server + Generative UI, Raspberry Pi Hub software
│
├── docs/                                product and architecture docs (public)
│   ├── product-requirements/              product overview, roadmap
│   ├── customer/                          customer needs (JTBD)
│   ├── learning/                          learning goals and assumptions
│   └── architecture/
│       ├── project-architecture.md        this file
│       ├── tech-stack.md                  every technology, layer by layer
│       ├── design-system/                 conventions, workflows, docs and search plans
│       └── domain-model/                  internal notes: open questions, API design notes, Hub setup
│
├── AGENTS.md                            rules for AI coding tools (all tools)
├── CLAUDE.md                            one line: imports AGENTS.md for Claude Code
├── README.md
├── package.json                         root tools only: turbo, typescript, prettier
├── pnpm-workspace.yaml                  workspace folders, shared React versions (catalog)
├── turbo.json                           task pipeline: build, dev, test, typecheck
└── tsconfig.base.json                   shared TypeScript settings (strict)
```

Not in the repo: `docs-ignore/` holds private notes (ideation, retros, project management) and is ignored by git. There is no `.github/` folder yet, so there is no CI.

---

## Dependency rules

Arrows point from "depends on" to "dependency". A layer only depends on the layers below it.

```
            apps (storybook, docs-site, your app)
               │                    │
               ▼                    │
     ⬜ react ─────────┐            │
        │              │            │
        ▼              ▼            ▼
     ⬜ client       ✅ ui ─────────────────► ✅ tokens
        │
        ▼
     ⬜ api-spec ◄──── ⬜ API Simulator
                 ◄──── ⬜ Hub software
```

(Every package name is short for `@detriz-sh-kit/<name>`.)

Rules:

- **`tokens` has no dependencies.** It is only data: CSS variables.
- **`ui` is presentational only.** It takes props, never fetches data and never imports `client`. That keeps it usable with any data source and easy to show in Storybook.
- **`client` has no React dependency** (planned), so it also works in Node scripts and other frameworks.
- **Only `react` joins `client` and `ui`** (planned). That's where the pre-bound `Live*` components live.
- **The Hub software and the API Simulator share only the contract** (`api-spec`) with the rest of the kit, never code.
- **Apps import packages by name** (`@detriz-sh-kit/ui`) and only through each package's `exports`, never with relative paths or `/src/` imports.
- **Apps depend only on packages, never on each other.**

These rules aren't checked by a linter yet; there is no ESLint setup. They're kept by convention and code review.

---

## How the design system is built

The design system goes from Figma to the screen in four steps. Each step is a separate package or app.

```
 Figma variables
       │  export JSON
       ▼
 kit/packages/tokens/figma/        ── scripts/figma-to-dtcg.mjs ──►  src/  (DTCG JSON)
                                                                       │  Style Dictionary
                                                                       ▼
                                                               dist/tokens.css  (--shk-… variables)
                                                                       │
 kit/packages/ui/src/  (React + CSS Modules using var(--shk-…))  ◄─────┘
       │  Vite library mode + tsc
       ▼
 kit/packages/ui/dist/  (index.js, index.d.ts, styles.css, fonts.css)
       │                                   │
       ▼                                   ▼
 kit/apps/storybook                  kit/apps/docs-site
 (every state, every stress story)   (live code blocks on component pages)
```

1. **Tokens** (`kit/packages/tokens`). Three layers of DTCG JSON:
   - `primitive/`: raw values named by look (`palette.blue.600`, `space.4`).
   - `semantic/`: values named by purpose that refer to primitives (`color.text.primary` → `{palette.gray.900}`).
   - `component/`: per-component values (empty for now).

   Style Dictionary builds them into `dist/tokens.css` as CSS variables with the `--shk-` prefix.

2. **Components** (`kit/packages/ui`). One folder per component: `<Name>.md` (internal spec), `<Name>.types.ts`, `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx` and `index.ts`. The CSS uses only tokens, inside `@layer detriz`. Vite library mode builds `src/index.ts` into `dist/`, and `tsc` writes the type files.
3. **Storybook** (`kit/apps/storybook`) loads the stories from `ui` and shows every state or variant, plus the `LongText` and `Minimal` stress stories.
4. **Docs site** (`kit/apps/docs-site`) loads the built `ui` and shows the real components on each component page.

**States and variants.**

- **Status, Readings, History and Controls** components cover the target states from the Glossary: loading, Connected, Stale, Disconnected (value hidden, disconnected icon shown) and Fault.
- **Context, Layout, Comparison, Feedback and Navigation** components describe their variants instead.

**Components today:**

| Category   | Components                                                     |
| ---------- | -------------------------------------------------------------- |
| context    | SensorLabel                                                    |
| controls   | Button, Switch                                                 |
| feedback   | InlineMessage                                                  |
| layout     | ColumnLayout, ContentSection, StackLayout                      |
| navigation | LocationPath                                                   |
| readings   | ModuleCard, ReadingValue, SensorReading, SpaceCard, UnitLabel  |
| status     | DeviceConnectionStatus, DeviceFaultStatus, DevicePairingStatus |

The full workflow is in [component building](design-system/workflows/component-building.md), and naming rules are in [conventions and structure](design-system/ds-conventions-and-structure.md).

---

## The docs site

`kit/apps/docs-site` is the public site for people using the kit, at **https://smart-home-kit.detriz.com**.

- **Landing page** at `/` (`src/pages/index.tsx`).
- **Three sections**, each with its own sidebar generated from its folder:
  - **Get Started**: introduction, installation, quick start.
  - **Domain Model**: Glossary, Data model, Device lifecycle, Events and commands.
  - **UI Components**: one page per component, grouped by category.
- **Live components.** Component pages show the real `ui` components in ` ```jsx live ` code blocks that readers can edit. The site loads the kit's fonts, tokens and component CSS once (`src/kit-styles.ts`), the same way an app would.
- **Diagrams** are written as Mermaid code blocks.
- **Search** is Algolia DocSearch. Algolia's crawler reads the live site about once a week into an index, and the search box queries it directly. Details: the "Docs site search" section of `AGENTS.md`.
- **Styling.** The site's own CSS (`src/css/custom.css`) maps Docusaurus's variables to `--shk-` tokens. Docusaurus's CSS sits in cascade layers below `@layer detriz`, so the kit's component styles win.

Internal specs (Figma node IDs, open questions) stay next to each component in `<Name>.md` and are not published. How to write a component page: [component documentation](design-system/workflows/component-documentation.md).

---

## How data will flow (planned)

None of this is built yet. It describes the target for the MVP and later phases.

The app gets Readings from **one API**, served by either the real Hub or the API Simulator. Both follow the same contract, so the app doesn't know or care which one it's talking to.

```
 ┌──── Raspberry Pi (the Hub) ────┐
 │  Sensor (e.g. temperature)     │
 │        │                       │
 │        ▼                       │        REST + WebSocket          ┌──────── your app ────────┐
 │  Hub software                  │ ───────────────────────────────► │  @detriz-sh-kit/client   │
 │  · reads Sensors               │                                  │        │                 │
 │  · serves the API              │                                  │        ▼                 │
 └────────────────────────────────┘                                  │  @detriz-sh-kit/react    │
                                         same API, simulated         │  (hooks, Live*)          │
 ┌──── API Simulator ─────────────┐ ───────────────────────────────► │        │                 │
 │  simulated Readings            │                                  │        ▼                 │
 └────────────────────────────────┘                                  │  @detriz-sh-kit/ui       │
                                                                     └──────────────────────────┘
```

- **Contract first.** `api-spec` describes the endpoints, what a Reading looks like and how live updates arrive. The Hub, the simulator and the client are all built against it.
- **One setting to switch.** The client is pointed at the simulator or at the Hub by its address, so moving from simulated to real data doesn't change the app.
- **Connection Status comes from real behaviour.** When updates stop, the client reports Stale and then Disconnected, and the components show those states.

The API's transport, language and hosting for the Hub software are still open (see [Open questions](#open-questions)).

---

## Where to install React and other packages

The repo is a **pnpm workspace**: one repo that holds several projects, each with its own `package.json`. Run `pnpm install` once at the repo root.

| Folder                          | What goes in its `package.json`                                                                                  | React?                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Repo root**                   | Only tools the whole repo uses: `turbo`, `typescript`, `prettier`. Marked `"private": true`.                     | **No**                             |
| **`kit/packages/tokens`**       | Its build tool (`style-dictionary`). No runtime dependencies.                                                    | **No**                             |
| **`kit/packages/ui`** (library) | React in `peerDependencies` ("the app must provide React") **and** in `devDependencies` (so Storybook can run).  | **Peer only**: the app supplies it |
| **`kit/apps/*`** (apps)         | The framework (`storybook`, `@docusaurus/*`), `react`, `react-dom` and `@detriz-sh-kit/*` through `workspace:*`. | **Yes**, as a normal dependency    |

Rule of thumb: **apps own React, libraries only ask for it.** React must exist only once on a page. If a library brought its own copy, hooks would crash with "Invalid hook call".

**One React version everywhere.** `pnpm-workspace.yaml` has a `catalog:` list with the React versions. Projects write `"react": "catalog:"` instead of a version number.

**Install scripts are blocked by default.** pnpm 11 only runs a dependency's install script if it's listed under `allowBuilds` in `pnpm-workspace.yaml`, with a comment saying why.

**Everyday commands** (from the repo root): see the Commands table in `AGENTS.md`. The main ones are `pnpm install`, `pnpm storybook`, `pnpm docs-site` and `pnpm build`.

---

## Build and deploy

**Build order.** Turborepo runs `build` in dependency order, because every task depends on `^build` (the packages it uses are built first):

```
tokens  →  ui  →  storybook
                └─►  docs-site
```

If a token change doesn't show up, rebuild the tokens. The docs site and Storybook use the **built** `ui` (`dist/`), so rebuild `ui` to see component changes.

**Build output** is never committed: `dist/`, `storybook-static/`, `.docusaurus/`, `.turbo/` and `node_modules/` are ignored by git.

**Deploy.** Only the docs site is deployed today, on **Vercel**:

- Pushing to `main` deploys the live site. Every other branch or pull request gets its own preview URL.
- Vercel runs the build from the repo root (`pnpm turbo run build --filter=docs-site...`), so tokens → ui → docs-site build in order.
- The settings live in the Vercel dashboard, not in the repo. The full list is in `AGENTS.md`.
- Algolia's crawler reads the deployed site for search, separately from the build.

Storybook isn't deployed yet. Packages aren't published to npm yet.

---

## Way of working

| Practice                    | How                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Issues and branches**     | One GitHub issue per piece of work. Branches are named `<issue-number>-short-name`.                                       |
| **Conventional Commits**    | Scoped to the package or app: `feat(ui): …`, `fix(docs-site): …`.                                                         |
| **Architecture decisions**  | ADRs in `docs/adr/NNNN-title.md` (folder not created yet).                                                                |
| **Component checklist**     | The checklist at the end of [component building](design-system/workflows/component-building.md).                          |
| **Formatting**              | Prettier (`pnpm format`, `pnpm format:check`).                                                                            |
| **Tests and lint**          | Not set up yet: `pnpm lint` and `pnpm test` exist, but no package defines those scripts.                                  |
| **AI-assisted development** | `AGENTS.md` holds the rules for every AI coding tool; `CLAUDE.md` imports it. AI-written code is reviewed like any other. |

---

## Open questions

- **API contract format:** OpenAPI for REST, plus AsyncAPI for the WebSocket stream? To decide when the MVP's API design starts.
- **Hub software language and runtime** on the Raspberry Pi (for example Node/TypeScript, so it can share types with the kit, or Python, for Sensor libraries).
- **Where the planned parts live:** folder names for the API Simulator, the MCP server and Generative UI, and the Hub software inside `kit/`.
- **How the browser reaches the Hub:** a page served over HTTPS can't call a plain HTTP address on the local network (mixed content). Does the Hub need its own certificate, or do apps run locally during prototyping?
- **Publishing:** is the `@detriz-sh-kit` npm scope free? When do `tokens` and `ui` get their first published versions (Phase 1 deliverable)?
- **Licence** for the repo (MIT is the usual choice for a design system).
- **CI:** which checks run on every pull request (build, typecheck, format) once tests and lint exist.
- **Ask AI in search:** Algolia DocSearch v4 can answer questions in the search box (`askAi` in the `algolia` config). Algolia doesn't charge for it, but it needs our own LLM provider, which we'd pay for. It fits the kit's AI angle.
- **Dark mode:** the kit has no dark theme yet; the docs site uses Docusaurus's dark colours for now.

---

## Appendix: a beginner's guide to `kit/packages`

This appendix explains the main ideas from scratch, for someone who hasn't built a package or a design system before.

### What is a package?

A **package** is a folder of code with a `package.json` file that gives it a **name**, a **version** and a list of **what it needs**. Once something is a package, other code uses it by name instead of by file path:

```ts
// Without a package: breaks the moment a folder moves
import { Button } from "../../../kit/packages/ui/src/components/controls/Button/Button";

// With a package: works wherever the package lives (this repo today, npm later)
import { Button } from "@detriz-sh-kit/ui";
```

Today pnpm doesn't download `@detriz-sh-kit/ui` from npm. It **links** it from `kit/packages/ui`, because of `"workspace:*"` in the app's `package.json`.

The important parts of a `package.json`:

| Field              | Meaning                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| `name`             | How others import it. `@detriz-sh-kit` is the scope, like a family name.      |
| `version`          | Changes every release: `0.1.0` → `0.1.1` (fix) → `0.2.0` (new feature).       |
| `exports`          | The front door: the only files others may import. Everything else is private. |
| `files`            | What gets published: only `dist`.                                             |
| `scripts`          | Commands such as `build`.                                                     |
| `dependencies`     | What it needs to work, installed with it.                                     |
| `peerDependencies` | What it needs, but the app must provide (React).                              |
| `devDependencies`  | What you need only while developing (build tools). Never shipped.             |

### What is a design system?

A shared set of rules and building blocks, so every screen looks and behaves the same. It has three layers:

| Layer         | Figma                      | Code                                                                    |
| ------------- | -------------------------- | ----------------------------------------------------------------------- |
| Tokens        | Variables                  | `@detriz-sh-kit/tokens` → CSS variables like `--shk-color-text-primary` |
| Components    | Components with variants   | `@detriz-sh-kit/ui` → React components with props                       |
| Documentation | Library documentation page | Storybook (every state) and the docs site (how to use it)               |

**Why does `ui` never fetch data?** A component that fetches its own data only works with one API. A component that just takes props works with any data: the Hub, the simulator, a CSV file. It's also easy to show in Storybook: pass different props for each state. Fetching will live in a separate layer (`react`).

### What is a client (SDK)?

A **client** (or **SDK**, Software Development Kit) is code that knows how to talk to a server, so apps don't have to. The planned `@detriz-sh-kit/client` will know every URL of the API and the exact shape of every response, handle errors and reconnecting in one place, and be pointed at the simulator or the Hub by one setting.

### Why several small packages instead of one?

Small packages, each with one job, make the rules **physical**: `ui` can't import the client, because the client isn't in its `package.json`. And people install only what they need:

| I am…                                                      | I install                                     |
| ---------------------------------------------------------- | --------------------------------------------- |
| A designer who wants the visual language in plain HTML/CSS | `@detriz-sh-kit/tokens`                       |
| A developer with my own data source                        | `@detriz-sh-kit/tokens` + `@detriz-sh-kit/ui` |
| A developer writing a script against the API (planned)     | `@detriz-sh-kit/client`                       |
| A React developer who wants live Readings fast (planned)   | `@detriz-sh-kit/react` + `ui` + `tokens`      |

### Source code vs built code (`src/` and `dist/`)

- **`src/`** is what **you write**: TypeScript, CSS Modules, stories.
- **`dist/`** is what **others use**: plain JavaScript, type files (`.d.ts`) and one combined CSS file. It's generated by `pnpm build`. Never edit it, and never commit it.

Storybook and the docs site use `dist/` too, so they test exactly what a user would get.

### The three kinds of dependencies

Simple test: **would the code break in a user's browser without it?**

- If yes, it's a `dependency`. If it's React, which the app must share, it's a `peerDependency`.
- If it's only used on your computer, it's a `devDependency`.

In a library, React is always a peer dependency and also a dev dependency, so Storybook can run.

### Common beginner mistakes

| Mistake                                                  | What happens                                         | Fix                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Running `pnpm install` inside a package folder           | A second lockfile appears                            | Always run pnpm from the repo root; use `--filter` to target a package |
| Importing from another package's `src/`                  | Skips the build; breaks once published               | Import by package name; export what you need from `index.ts`           |
| Forgetting to export a new component from `src/index.ts` | `import { NewThing } from "@detriz-sh-kit/ui"` fails | Every public component gets a line in `index.ts`                       |
| Putting React in `dependencies` of `ui`                  | Two copies of React, "Invalid hook call"             | React is a **peer** (and dev) dependency in a library                  |
| Hard-coding a colour or size in a component              | Theming stops working for that component             | Use only `var(--shk-…)` tokens                                         |
| Fetching data inside a `ui` component                    | Works with one API only; hard to show in Storybook   | Pass data as props                                                     |
| Docs site or Storybook doesn't show a component change   | They use the built `dist/`                           | Rebuild `ui` (`pnpm --filter @detriz-sh-kit/ui build`)                 |

### Glossary of technical terms

For the smart home terms (Hub, Sensor, Reading…), see the [Glossary](../../kit/apps/docs-site/docs/domain-model/glossary.mdx).

| Term                     | Meaning                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Package**              | A folder with a `package.json`: code with a name and version that others can install |
| **npm**                  | The public online registry of JavaScript packages                                    |
| **pnpm**                 | The install tool we use; good at workspaces                                          |
| **Workspace / monorepo** | One repo that contains several packages and apps, installed together                 |
| **`workspace:*`**        | "Use the copy of this package from this repo": a link instead of a download          |
| **`exports`**            | The front door of a package: the only files others may import                        |
| **Build**                | Turning `src/` (TypeScript, CSS Modules) into `dist/` (JavaScript, types, CSS)       |
| **Design token**         | A named design decision (`--shk-color-text-primary`) instead of a raw value          |
| **Props**                | The inputs of a component: `<ReadingValue value={22.4} />`                           |
| **Hook**                 | A React function starting with `use` that gives a component data or behaviour        |
| **Client / SDK**         | Code that knows how to talk to a server so apps don't have to                        |
| **API contract**         | A file describing every URL, input and output of an API, which both sides follow     |
| **Cascade layer**        | A CSS `@layer`: lets the kit's styles sit below an app's own styles                  |
| **Semver**               | Version numbers as MAJOR.MINOR.PATCH: breaking change, new feature, fix              |
