# Architecture Overview

## Architecture at a glance

DeTriz Smart Home Kit lives in **one public monorepo** for now. It works as a proof of concept and a portfolio piece: anyone can open it and see how the whole system is designed, built and documented, from the Raspberry Pi up to the UI.

Inside the repo, the code is already split into the **two future repositories**, as two top-level folders:

- **`kit/`** → future public repo **`smart-home-kit`**. Everything a developer or designer installs or reads to build their own solution: the design system, the TypeScript SDK and React hooks, the API contract (OpenAPI), mock data, Storybook, the API documentation site and starter examples.
- **`platform/`** → future repo **`smart-home-kit-platform`**. Everything we build and run ourselves: Live Studio, the landing page, the FastAPI backend, the Raspberry Pi hub software and (later) hardware files.

The two folders are connected **only through package names and the API contract**, never through relative imports. That one rule is what makes the split later a mechanical job instead of a refactor.

```
smart-home-kit  (ONE PUBLIC MONOREPO, today)
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  kit/          → future repo "smart-home-kit"                              │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │ packages/  tokens · ui · react · client · api-spec · mock    │          │
│  │ apps/      storybook · docs (API docs)                       │          │
│  │ examples/  starter projects                                  │          │
│  └──────────────┬──────────────────────────────┬────────────────┘          │
│                 │ @detriz-sh-kit/* workspace:* │ openapi.yaml              │
│                 ▼                              ▼                           │
│  platform/     → future repo "smart-home-kit-platform"                     │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │ apps/      studio · landing                                  │          │
│  │ services/  api (FastAPI)                                     │          │
│  │ hub/       Raspberry Pi agent + drivers                      │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                            │
│  docs/   product, architecture, ADRs     (shared, public)                  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Rule for deciding where something goes:** if a user needs it to install, learn or build with the kit, it goes in `kit/`. Everything else goes in `platform/`. Product thinking (PRD, roadmap, JTBD, ADRs) goes in `docs/`.

---

## Introduction

This document describes how the DeTriz Smart Home Kit code is organised today, how it is prepared for a future split into two repositories, and how to approach building it step by step.

The project has three practice goals:

1. **Design system**: build smart home components (tokens, components, Storybook) that others could install and use.
2. **API connection with a Raspberry Pi**: get real Readings from Sensors on a Hub, through a FastAPI backend, to the browser.
3. **Live Studio**: a dashboard that shows the Sensors live, built only with the design system.

On top of that, two supporting deliverables: a **landing page** that explains the product and **API documentation** for the REST and WebSocket API.

The repo is also meant to be read by others (recruiters, engineers, designers) who want to evaluate how I think and work, so the way of working is part of the architecture (see [How to approach this project](#how-to-approach-this-project)).

Terms such as Hub, Module, Sensor, Reading and Connection Status follow the [Ubiquitous Language](domain-model/ubiquitous-language.md).

## Table of contents

- [Architecture at a glance](#architecture-at-a-glance)
- [Key decisions](#key-decisions)
- [Repo structure](#repo-structure)
- [How data flows from the Raspberry Pi to Live Studio](#how-data-flows-from-the-raspberry-pi-to-live-studio)
- [Dependency rules](#dependency-rules)
- [Where to install React and other packages](#where-to-install-react-and-other-packages)
- [How the design system is layered](#how-the-design-system-is-layered)
- [How Studio uses the design system today](#how-studio-uses-the-design-system-today)
- [Preparing for the split](#preparing-for-the-split)
- [How to approach this project](#how-to-approach-this-project)
- [Tooling](#tooling)
- [Open questions](#open-questions)
- [Appendix: understanding `kit/packages` (a beginner's guide)](#appendix-understanding-kitpackages-a-beginners-guide)

---

## Key decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Number of repos | **One public monorepo for now**, split into two later | Faster to iterate while the API and components still change daily. One place for evaluators to look. A change that touches a component and Studio is one PR, not two PRs and a release. |
| Internal structure | **Top-level `kit/` and `platform/` folders**, one per future repo | The boundary is visible in the folder tree, so anyone reading the repo sees the intended split. Splitting later is `git filter-repo --subdirectory-filter kit`. |
| Visibility | **Everything public**, including product docs | The point of the repo is to show the thinking: PRD, JTBD, domain model and ADRs are as important as the code. |
| Package consumption | **`workspace:*` links, no npm publishing yet** | No release overhead while things change. Packages are still built as if they were published (`exports`, `dist/`), so publishing later is a config change, not a refactor. |
| Pi ↔ browser | **The Pi pushes Readings to a hosted API; Studio talks only to the API** | A public Live Studio demo works without exposing a home network. The hub stays a simple client. |
| Apps | **Four separate apps**: Storybook and API docs (`kit/`), Studio and landing (`platform/`) | Each one has a different job (component docs, API docs, live SPA, static marketing page), so each can use the best tool for it. All of them share the design system. |
| Design system framework | **React only** | Matches the `useSensor` hook in the product overview and keeps the scope manageable. Tokens are plain CSS variables, so non-React users still get the visual language. |
| API contract | **Spec-first OpenAPI** in `kit/packages/api-spec` | The roadmap asks for an OpenAPI file. SDK types, mocks and docs are generated from it, and the FastAPI backend is tested against it. |
| Existing `frontend/` | **Becomes `platform/apps/studio`** | The current Vite + React scaffold is the start of Live Studio. |

Each of these decisions gets a short ADR in `docs/adr/` (see [Way of working](#way-of-working)).

---

## Repo structure

```
smart-home-kit/
├── kit/                            ── future repo "smart-home-kit" (public, published to npm)
│   ├── packages/
│   │   ├── tokens/                 @detriz-sh-kit/tokens: design tokens (color, spacing, typography, motion)
│   │   │   ├── src/                  token source (JSON / DTCG format, synced from Figma variables)
│   │   │   ├── build/                Style Dictionary config
│   │   │   └── dist/                 → tokens.css (CSS variables), tokens.ts, tokens.json
│   │   │
│   │   ├── api-spec/               @detriz-sh-kit/api-spec: the API contract
│   │   │   ├── openapi.yaml          REST: sensors, readings, history, hubs, modules, hub ingest
│   │   │   ├── asyncapi.yaml         WebSocket stream messages (MVP)
│   │   │   └── src/generated/        TypeScript types generated with openapi-typescript
│   │   │
│   │   ├── client/                 @detriz-sh-kit/client: framework-agnostic TypeScript SDK (MVP)
│   │   │   └── src/
│   │   │       ├── rest/             typed REST client
│   │   │       ├── stream/           WebSocket stream, auto-reconnect, buffering
│   │   │       ├── replay/           Record & Replay: session format, player
│   │   │       └── domain/           Hub, Module, Sensor, Reading, Connection Status types
│   │   │
│   │   ├── react/                  @detriz-sh-kit/react: React bindings
│   │   │   └── src/
│   │   │       ├── DetrizProvider.tsx    connection config (live API, mock or replay)
│   │   │       ├── hooks/                useSensor, useReadings, useHub, useConnectionStatus
│   │   │       └── live/                 pre-bound components: <LiveGauge sensorId="…" />
│   │   │
│   │   ├── ui/                     @detriz-sh-kit/ui: presentational components (props only, no data fetching)
│   │   │   └── src/
│   │   │       ├── primitives/       Button, Card, Badge, Tooltip…
│   │   │       ├── sensor/           Gauge, ReadingValue, HistoryChart, StatusTile, Alert
│   │   │       ├── device/           HubCard, ModuleSlot, ConnectionBadge, FaultMessage
│   │   │       └── <Component>/      Component.tsx, Component.module.css,
│   │   │                             Component.stories.tsx, Component.test.tsx
│   │   │
│   │   └── mock/                   @detriz-sh-kit/mock: data without hardware
│   │       ├── handlers/             MSW handlers generated from the OpenAPI spec
│   │       ├── fixtures/             sample Readings for each Metric
│   │       └── sessions/             recorded sessions for Replay demos
│   │
│   ├── apps/
│   │   ├── storybook/              design system docs: usage guidelines, states, code examples
│   │   └── docs/                   Starlight (Astro): API documentation, Diátaxis structure
│   │       └── src/content/docs/
│   │           ├── tutorials/        "First live reading in 5 minutes"
│   │           ├── how-to/           Record & Replay, theming, adding a Module
│   │           ├── reference/        REST + WebSocket rendered from @detriz-sh-kit/api-spec (Scalar)
│   │           └── explanation/      how Connection Status, buffering and calibration work
│   │
│   ├── examples/
│   │   └── vite-react-starter/     "3 lines to a live reading" starter
│   │
│   └── README.md                   becomes the README of the future public repo
│
├── platform/                       ── future repo "smart-home-kit-platform"
│   ├── apps/
│   │   ├── studio/                 Vite + React SPA: Live Studio (moved from frontend/)
│   │   │   └── src/
│   │   │       ├── app/              routing, providers, layout
│   │   │       ├── features/         one folder per capability
│   │   │       │   ├── dashboard/      all connected Sensors live
│   │   │       │   ├── sensor-detail/  how it works, ranges, plain-language meaning
│   │   │       │   ├── diagnostics/    health, which Module or link failed, how to fix it
│   │   │       │   ├── record-replay/
│   │   │       │   └── share/          share links, exports
│   │   │       └── content/          sensor explanations (MDX), typical ranges
│   │   │
│   │   └── landing/                Astro: static, fast, good for SEO
│   │       └── src/
│   │           ├── pages/            index, use-cases, waitlist
│   │           └── components/       hero, use cases, a live demo widget
│   │                                 (a React island from @detriz-sh-kit/react in Replay mode)
│   │
│   ├── services/
│   │   └── api/                    FastAPI (Python, uv): REST + WebSocket, time-series storage
│   │       ├── app/
│   │       │   ├── domain/           same Ubiquitous Language terms as the TS types
│   │       │   ├── routes/           public read API + hub ingest API
│   │       │   └── storage/
│   │       ├── tests/contract/       checks responses against openapi.yaml (Schemathesis)
│   │       └── pyproject.toml
│   │
│   ├── hub/                        Raspberry Pi software (Python, uv)
│   │   ├── agent/                    module detection, auto-calibration, local buffer, pushes to the API
│   │   ├── drivers/                  I2C drivers per Module Type (climate, light, air quality)
│   │   ├── deploy/                   systemd unit, install script, .env.example
│   │   └── pyproject.toml
│   │
│   └── hardware/                   (later) enclosures (STEP/STL), schematics
│
├── docs/                           product and architecture docs (public, shared)
│   ├── product-requirements/         product overview, roadmap, user stories
│   ├── customer/                     JTBD
│   ├── architecture/                 this file, domain model
│   ├── adr/                          Architecture Decision Records: 0001-monorepo-first.md, …
│   └── learning/                     learning goals and assumptions
│
├── .github/
│   ├── workflows/                  one workflow per area, triggered by path filters
│   │   ├── kit.yml                   lint, test, build, visual tests for kit/**
│   │   ├── studio.yml                build + deploy for platform/apps/**
│   │   ├── api.yml                   Ruff, pytest, contract tests for platform/services/**
│   │   └── hub.yml                   Ruff, pytest for platform/hub/**
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── README.md                       evaluator-facing: what it is, live demo links, how to run, where to look
├── CLAUDE.md                       AI-assisted development context
├── LICENSE
├── package.json                    root tools only: turbo, typescript, eslint, prettier
├── pnpm-workspace.yaml             kit/packages/*, kit/apps/*, kit/examples/*, platform/apps/*
├── turbo.json
├── tsconfig.base.json
└── eslint.config.js                includes the boundary rules between kit/ and platform/
```

### Why `kit/` and `platform/` instead of a flat `packages/` + `apps/`

A flat layout (`packages/`, `apps/`, `services/`) is more common, but it hides the future split: Storybook and Studio would sit next to each other in `apps/`, and you'd have to remember which one belongs where. With two top-level folders:

- The folder tree itself documents the intended architecture.
- The boundary rule is easy to enforce: "nothing in `kit/` may import from `platform/`".
- Splitting is one command per repo, with history kept.
- CI path filters line up with the future repos (`kit/**` vs `platform/**`).

The cost is one extra level of nesting, which is small.

---

## How data flows from the Raspberry Pi to Live Studio

The Pi is a **client** of the API, not a server. It never accepts incoming connections.

```
 ┌──── at home (Raspberry Pi) ────┐          ┌──────── hosted ────────┐          ┌──── browser ────┐
 │                                │          │                        │          │                 │
 │  Module (I2C sensor)           │          │  platform/services/api │          │  platform/apps/ │
 │        │                       │          │  (FastAPI)             │          │  studio         │
 │        ▼                       │          │                        │          │                 │
 │  platform/hub/drivers          │  HTTPS   │  ingest API            │          │  @detriz-sh-kit/│
 │        │                       │  POST    │  (hub token)           │  REST    │  react: hooks   │
 │        ▼                       │  batched │       │                │ ◄─────── │       │         │
 │  platform/hub/agent  ──────────┼────────► │       ▼                │  WS      │       ▼         │
 │  · detects Modules             │ Readings │  storage (SQLite →     │ ───────► │  @detriz-sh-kit/│
 │  · calibrates                  │          │  Postgres)             │          │  ui: components │
 │  · buffers when offline        │          │       │                │          │                 │
 │                                │          │       ▼                │          │                 │
 │                                │          │  read API + WebSocket  │          │                 │
 │                                │          │  (public, read-only)   │          │                 │
 └────────────────────────────────┘          └────────────────────────┘          └─────────────────┘
```

Two API surfaces, both described in `kit/packages/api-spec/openapi.yaml`:

| Surface | Who calls it | Auth | Example |
| --- | --- | --- | --- |
| **Ingest API** | the hub agent | per-hub token (secret, in `hub/deploy/.env`) | `POST /hubs/{hubId}/readings` with a batch of Readings, `PUT /hubs/{hubId}/modules` when Modules change |
| **Read API** | Studio, landing, customers | none for the public demo (read-only) | `GET /sensors`, `GET /sensors/{id}/readings/latest`, `GET /sensors/{id}/readings?from=…`, WebSocket `/stream` |

Why this shape:

- **A public demo works safely.** Visitors connect to the hosted API, never to your home network. No port forwarding, no tunnel.
- **The Pi stays simple.** It reads, buffers and pushes. If the network drops, the agent keeps Readings in a local buffer and sends them when it reconnects, which is how Connection Status (Stale, Disconnected) gets real data.
- **Studio never knows the Pi exists.** It only knows the API. The same Studio works against the real API, against `@detriz-sh-kit/mock` in development, and against a recorded session in Replay mode.
- **Fallback for evaluators.** When the Pi is off, Studio and the landing page switch to Replay mode with a recorded session, so the demo is never empty. Show a clear "Replay" badge so nobody mistakes it for live data.

Start with polling (`GET …/latest` every few seconds) in the POC, and add the WebSocket stream in the MVP. The UI doesn't change, because the hooks hide the transport.

---

## Dependency rules

Arrows point from "depends on" to "dependency". A layer can only depend on the layers below it.

```
 ┌─────────────────────────── platform/ ──────────────────────────┐
 │   apps/studio        apps/landing                              │
 └──────┬──────────────────┬──────────────────────────────────────┘
        │  by package name │ (@detriz-sh-kit/*, never ../../kit/...)
 ┌──────┼──────── kit/ ────┼──────────────────────────────────────┐
 │      ▼                  ▼         apps/storybook    apps/docs  │
 │     react ◄──────────────────────────────┘               │     │
 │     │           │                                        │     │
 │     ▼           ▼                                        ▼     │
 │  client          ui                         api-spec           │
 │     │           │                                              │
 │     ▼           ▼                                              │
 │  api-spec          tokens                                      │
 └────────────────────────────────────────────────────────────────┘
   @detriz-sh-kit/mock depends on api-spec and is used by Storybook, tests, examples and Studio dev mode
   (react, client, ui, api-spec, tokens and mock are short for @detriz-sh-kit/react, …/client, and so on)

 platform/services/api and platform/hub are Python: they share only openapi.yaml, never code.
```

Rules:

- **Nothing in `kit/` imports from `platform/`.** The kit must work for any customer, so it can't know about our apps.
- **`platform/` imports `kit/` only by package name** (`@detriz-sh-kit/ui`), never by relative path (`../../kit/packages/ui/src`). After the split, the package name keeps working; a relative path would break.
- **Apps import only a package's public entry points** (`exports` in its `package.json`), never `@detriz-sh-kit/ui/src/...`.
- `tokens` has no dependencies.
- `ui` never fetches data and never imports `client`. It renders whatever props it receives, which keeps it reusable with any data source and easy to show in Storybook.
- `client` has no React dependency, so it also works in Node scripts, Vue and plain JS.
- `react` is the only package that joins `client` and `ui`. This is where the pre-bound components live.
- Apps depend only on packages, never on each other.
- `services/api` and `hub/` never import TypeScript. They share only the contract (`openapi.yaml`) and are checked against it in CI. `hub/` never imports from `services/api` either: the hub is a client of the API, exactly like a customer's script would be.

Enforce these rules with ESLint (`eslint-plugin-boundaries` or `import/no-restricted-paths`) in the root `eslint.config.js`, so they don't drift:

```js
// eslint.config.js (excerpt)
{
  files: ["kit/**"],
  rules: {
    "no-restricted-imports": ["error", { patterns: ["**/platform/**"] }],
  },
},
{
  files: ["platform/**"],
  rules: {
    "no-restricted-imports": ["error", { patterns: ["**/kit/**", "@detriz-sh-kit/*/src/*"] }],
  },
},
```

---

## Where to install React and other packages

The repo is a **pnpm workspace**: one repo that holds several projects, each with its own `package.json`. You run `pnpm install` once at the repo root, and pnpm installs what every project needs.

### The rule in one table

| Folder | What goes in its `package.json` | Is React installed here? |
| --- | --- | --- |
| **Repo root** | Only tools the whole repo uses: `turbo`, `typescript`, `eslint`, `prettier`. Marked `"private": true`. | **No** |
| **`kit/packages/tokens`**, **`api-spec`**, **`client`**, **`mock`** | Their own small dependencies. They don't use React. | **No** |
| **`kit/packages/ui`**, **`kit/packages/react`** (libraries) | React in `peerDependencies` ("the app must provide React") **and** in `devDependencies` (so Storybook and tests can run). | **Peer only**: the app supplies it |
| **`kit/apps/*`**, **`kit/examples/*`**, **`platform/apps/*`** | The framework (`vite`, `storybook`, `astro`), `react`, `react-dom`, and `@detriz-sh-kit/*` through `workspace:*`. | **Yes**, as a normal dependency |
| **`platform/services/api`**, **`platform/hub`** | Not npm. Python dependencies go in `pyproject.toml`, managed with `uv`. | — |

Rule of thumb: **apps own React, libraries only ask for it.**

### Why libraries use `peerDependencies` for React

React must exist **only once** on a page. If `@detriz-sh-kit/ui` brought its own copy of React and the app had another copy, hooks would crash with *"Invalid hook call"* and context (like `DetrizProvider`) would not reach the components. With `peerDependencies`, the library says "I work with React 19, please give me yours", and the app's single copy is used everywhere:

```
platform/apps/studio (or a customer project)
├── react 19.2          ← the one and only copy
├── @detriz-sh-kit/react  ──┐
│                            ├── peer: react → uses the app's copy
├── @detriz-sh-kit/ui     ──┘
└── @detriz-sh-kit/tokens      (no React, just CSS)
```

### Example files

`pnpm-workspace.yaml` at the root:

```yaml
packages:
  - "kit/packages/*"
  - "kit/apps/*"
  - "kit/examples/*"
  - "platform/apps/*"
catalog:
  react: ^19.2.0
  react-dom: ^19.2.0
  "@types/react": ^19.2.0
```

`catalog:` gives every project the same React version from this one list.

`kit/packages/ui/package.json` (library):

```json
{
  "name": "@detriz-sh-kit/ui",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": ["*.css"],
  "scripts": { "build": "vite build && tsc -p tsconfig.build.json" },
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "dependencies": { "@detriz-sh-kit/tokens": "workspace:*" },
  "devDependencies": { "react": "catalog:", "react-dom": "catalog:", "@types/react": "catalog:" }
}
```

`platform/apps/studio/package.json` (app):

```json
{
  "name": "studio",
  "private": true,
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "@detriz-sh-kit/react": "workspace:*",
    "@detriz-sh-kit/ui": "workspace:*",
    "@detriz-sh-kit/tokens": "workspace:*"
  },
  "devDependencies": { "vite": "^8.0.0", "@vitejs/plugin-react": "^6.0.0" }
}
```

`workspace:*` means "use the copy of this package from this repo". pnpm creates a symlink instead of downloading it. After the split, this line becomes a normal version (`"^0.3.0"`) and nothing else in Studio changes.

### Everyday commands (run from the repo root)

| Task | Command |
| --- | --- |
| Install everything | `pnpm install` |
| Run Studio in dev mode (and rebuild packages it uses) | `pnpm turbo dev --filter studio...` |
| Run Storybook | `pnpm --filter storybook dev` |
| Build everything in the right order | `pnpm turbo build` (Turborepo builds `tokens` before `ui`, `ui` before `react`, and so on) |
| Add React to an app | `pnpm add react react-dom --filter studio` |
| Add a dev tool for the whole repo | `pnpm add -D -w prettier` |
| Add one local package to another | `pnpm add @detriz-sh-kit/tokens --workspace --filter @detriz-sh-kit/ui` |
| Run the API | `cd platform/services/api && uv run fastapi dev` |
| Run the hub agent locally (fake sensors) | `cd platform/hub && uv run agent --fake-sensors` |

### Moving the current `frontend/` folder

1. `git mv frontend platform/apps/studio` (keeps history).
2. Delete `platform/apps/studio/package-lock.json` and `node_modules`. Rename the package to `studio`.
3. Add the root `package.json` (`"private": true`, shared tools), `pnpm-workspace.yaml` and `turbo.json`.
4. Move shared config (`tsconfig` base settings, ESLint) to the root; keep app-specific bits in Studio.
5. Run `pnpm install` at the root. This creates one `pnpm-lock.yaml` for the whole repo.

---

## How the design system is layered

The product overview says the components come "pre-bound to sensor streams" but are also "props-driven". Two layers give us both:

| Layer | Package | Example | Who uses it |
| --- | --- | --- | --- |
| Presentational | `@detriz-sh-kit/ui` | `<Gauge value={22.4} unit="°C" range={[18, 26]} status="connected" />` | Anyone with their own data source, Storybook, the landing page |
| Pre-bound | `@detriz-sh-kit/react` | `<LiveGauge sensorId="kitchen-temperature" />` | Studio, developers who want "3 lines to live data" |

Every `Live*` component is a thin wrapper: `useSensor(id)` → map to props → `<Gauge …/>`. Users who outgrow it can drop down one layer without changing how it looks.

**Theming**

- Tokens are CSS variables with a prefix (`--dtz-color-surface`, `--dtz-space-2`), built from one source with Style Dictionary.
- Components use only tokens, never hard-coded values.
- All component CSS ships inside `@layer detriz`, so any user stylesheet overrides it without fighting specificity.
- Themes are token overrides: `[data-theme="dark"] { --dtz-color-surface: … }`.

**Every component has the same states**, taken from the Ubiquitous Language: loading, live (Connected), Stale, Disconnected (last value dimmed) and Fault. Storybook shows each one, which covers the roadmap item "Storybook: every component documented in its states".

---

## How Studio uses the design system today

Studio uses the packages **exactly as a customer will after the split**: by package name, through their public `exports`, from their built `dist/`. The only difference today is that pnpm links them from `kit/` instead of downloading them from npm.

```
 kit/packages/ui/src/Gauge.tsx
        │ build (Vite library mode + tsc for types)
        ▼
 kit/packages/ui/dist/  ── symlink (workspace:*) ──►  platform/apps/studio/node_modules/@detriz-sh-kit/ui
                                                                   │
                                                                   ▼
                                               import { Gauge } from "@detriz-sh-kit/ui"
```

Global styles and the provider are set up once, in `platform/apps/studio/src/main.tsx`:

```tsx
import "@detriz-sh-kit/tokens/tokens.css";   // CSS variables: colors, spacing, typography
import "@detriz-sh-kit/ui/styles.css";       // component styles (inside @layer detriz)
import "./studio.css";                // Studio's own overrides

import { createRoot } from "react-dom/client";
import { DetrizProvider } from "@detriz-sh-kit/react";
import { App } from "./app/App";

createRoot(document.getElementById("root")!).render(
  <DetrizProvider api={import.meta.env.VITE_API_URL} fallback="replay">
    <App />
  </DetrizProvider>
);
```

Then any feature uses the components. Both layers are available:

```tsx
// platform/apps/studio/src/features/dashboard/Dashboard.tsx
import { LiveGauge, useConnectionStatus } from "@detriz-sh-kit/react";  // pre-bound: fetches its own data
import { StatusTile } from "@detriz-sh-kit/ui";                         // presentational: Studio passes props

export function Dashboard() {
  const status = useConnectionStatus("kitchen-hub");
  return (
    <>
      <StatusTile title="Kitchen Hub" status={status} />
      <LiveGauge sensorId="kitchen-temperature" />
    </>
  );
}
```

Studio-only UI (sensor explanations, the diagnostics wizard) stays in `platform/apps/studio/src/features/`. **If a component turns out to be useful for customers too, move it to `kit/packages/ui`.** Never copy components between the two folders.

---

## Preparing for the split

The split should happen when there's a real reason: someone wants to install `@detriz-sh-kit/*` from npm, or the platform side needs to become private. Until then, these habits keep it cheap.

### Split-readiness checklist

Keep these true from day one, and the split stays mechanical:

- [ ] `kit/` never imports from `platform/` (ESLint rule).
- [ ] `platform/` imports `kit/` only by package name and public `exports` (ESLint rule).
- [ ] Every `kit/packages/*` has `exports`, `files: ["dist"]`, a version and a `README.md`, as if it were already on npm.
- [ ] The backend and hub share only `openapi.yaml` with the rest of the repo.
- [ ] CI workflows are separate per area and use path filters (`kit/**`, `platform/**`), so each can be moved as-is.
- [ ] Secrets (hub token, deploy keys) are per-workflow, not shared, so they can move to the right repo.
- [ ] `kit/README.md` is written for an external developer, not for us.
- [ ] Product docs that are about our business (pricing, roadmap) are kept apart from user-facing docs (`kit/apps/docs`).

### What the split looks like

```
today                                           after the split
─────                                           ───────────────
smart-home-kit/                                 smart-home-kit/           (public, npm)
├── kit/         ── filter-repo ─────────────►  ├── packages/ apps/ examples/
├── platform/    ── filter-repo ──┐             │
├── docs/                         │             smart-home-kit-platform/  (public or private)
└── (root tooling, copied to both)└──────────►  ├── apps/ services/ hub/ docs/
```

1. Turn on publishing in `kit/`: add Changesets, an npm token and a release workflow. Publish `0.x` versions of `@detriz-sh-kit/*`.
2. Create `smart-home-kit-platform` with `git filter-repo --subdirectory-filter platform` (keeps history). Copy the root tooling and `docs/`.
3. In the platform repo, replace every `workspace:*` for `@detriz-sh-kit/*` with the published version (`^0.3.0`). Add Renovate so it gets PRs when new versions are released.
4. In `smart-home-kit`, run `git filter-repo --subdirectory-filter kit` on a fresh clone (or remove `platform/`) and flatten `kit/*` to the root.
5. Point the backend's contract tests at the published `@detriz-sh-kit/api-spec` (or a pinned git tag) instead of the local file.

After the split, a change that touches a component and Studio needs two PRs and a release in between. That's the trade-off: you get a clean public kit, Studio as a real consumer of the packages, and versioning discipline. It's worth it once others depend on the packages, not before.

---

## How to approach this project

### Principles

- **Walking skeleton first.** Get one Reading from one Sensor all the way to the browser before polishing any layer. Every layer is ugly at first, but the whole path works and is deployed.
- **Contract first.** Change `openapi.yaml` before changing the API or the UI. The spec is the single source of truth for both sides.
- **Vertical slices.** Each user story crosses all layers it needs (driver → agent → API → hook → component → Studio). Avoid "build the whole backend, then the whole frontend".
- **Always demoable.** `main` is always deployed: Studio, Storybook and API docs have public URLs, and Replay mode means there's always something to see.
- **Show the thinking.** Decisions go in ADRs, work goes in issues and PRs with context. The history is part of the portfolio.

### Phases

These follow the [roadmap](../product-requirements/roadmap.md), with an extra foundation step first.

**Phase 0: Foundation (repo set-up)**

- Restructure into `kit/` and `platform/`, move `frontend/` to `platform/apps/studio`, switch to pnpm + Turborepo.
- Root ESLint with boundary rules, Prettier, TypeScript base config, commitlint.
- CI: lint + build on every PR.
- Evaluator-facing root `README.md` (see below) and the first ADRs: monorepo-first, `kit/`/`platform/` split, Pi pushes to a hosted API.
- **Done when:** `pnpm install && pnpm turbo build` works from a clean clone and CI is green.

**Phase 1: Walking skeleton (POC)**

- `api-spec`: temperature endpoints only (list sensors, latest reading, history, hub ingest).
- `hub/`: one driver (temperature over I2C) and an agent that pushes Readings every few seconds, with a `--fake-sensors` mode for development without the Pi.
- `services/api`: FastAPI implementing the spec, SQLite storage, contract tests with Schemathesis. Deployed (Fly.io, Railway or Render).
- `ui`: a thin layer that wraps a third-party library (Mantine or shadcn/ui, as the roadmap asks). `react` with `useSensor`, fetch logic inside it (no separate `client` yet).
- `storybook`: every POC component in its states.
- `studio`: one page with a live temperature view.
- `landing`: one page that explains the product.
- **Done when:** a temperature change at the Pi shows up on the public Studio URL within a few seconds, and Storybook is public.

**Phase 2: Own design system (MVP part 1)**

- Add `tokens` (from Figma variables via Style Dictionary).
- Replace the third-party library with your own components, keeping the same props so Studio barely changes.
- Usage guidelines and states for every component in Storybook. Visual regression tests.
- **Done when:** `ui` no longer depends on a third-party component library and every component has documented states.

**Phase 3: Real-time and Live Studio (MVP part 2)**

- Light and air quality Modules (drivers + spec).
- Extract `client`, add the WebSocket stream and `asyncapi.yaml`, add `mock` and Record & Replay.
- Studio: dashboard with all three Sensors, sensor detail, diagnostics.
- `kit/apps/docs`: API documentation (tutorial, how-to, reference, explanation).
- **Done when:** the roadmap's MVP deliverables are met and the landing page has a live (or Replay) demo widget.

**Phase 4: Productise (when needed)**

- Publish `@detriz-sh-kit/*` to npm, split the repo (see [Preparing for the split](#preparing-for-the-split)), add `examples/`, hardware files and a contribution guide.

### Way of working

| Practice | How | What it shows an evaluator |
| --- | --- | --- |
| **Issues and a project board** | One GitHub issue per user story, labelled by area (`kit`, `studio`, `api`, `hub`) and phase. GitHub Projects board. | Planning and prioritisation |
| **Branches and PRs** | `<issue-number>-short-name` branches, small PRs with a template: what, why, screenshots, how to test. Squash merge. | Communication, reviewable changes |
| **Conventional commits** | `feat(ui): add Gauge size prop`, `fix(hub): retry when the API is down`. Scope = package or app. | Discipline, readable history, ready for automated changelogs |
| **ADRs** | `docs/adr/NNNN-title.md`: context, decision, consequences. One per decision in the [Key decisions](#key-decisions) table. | How you reason about trade-offs |
| **Definition of done** | Tests pass, Storybook story for every new state, spec updated, docs updated, deployed. | Quality bar |
| **AI-assisted development** | `CLAUDE.md` with conventions; AI-generated code is reviewed and tested like any other code. | Modern workflow, used responsibly |

### Root `README.md` for evaluators

The root README is the first thing an evaluator sees, so write it for them:

1. **One-paragraph pitch** and a GIF or screenshot of Live Studio.
2. **Live links:** Studio, Storybook, API docs, landing page.
3. **Architecture in one picture** (the diagram from [How data flows](#how-data-flows-from-the-raspberry-pi-to-live-studio)) and a link to this document.
4. **Where to look:** a short table, for example "design system → `kit/packages/ui`", "Pi integration → `platform/hub`", "product thinking → `docs/`".
5. **Run it locally** in three commands, with mock data, so no Pi is needed.
6. **Status:** current phase and a link to the roadmap.

---

## Tooling

| Concern | Tool |
| --- | --- |
| JS package manager / workspaces | pnpm |
| Task running and caching | Turborepo |
| Package build | tsup or Vite library mode (ESM + `.d.ts`) |
| Tokens | Style Dictionary (Figma variables → JSON → CSS/TS) |
| Component docs | Storybook (+ Chromatic or Playwright for visual tests) |
| API types | openapi-typescript |
| Mocks | MSW, with handlers generated from the spec |
| Docs site | Astro Starlight + Scalar for the OpenAPI reference |
| Python (API and hub) | uv, Ruff, pytest, Schemathesis |
| Raspberry Pi | Python agent as a systemd service; `smbus2` / Adafruit Blinka for I2C |
| Lint boundaries | ESLint (`eslint-plugin-boundaries` or `no-restricted-imports`) |
| Commits | Conventional commits (commitlint) |
| Versioning (from Phase 4) | Changesets, Renovate |
| CI/CD | GitHub Actions with path filters; Storybook and API docs to GitHub Pages; Studio and landing to Vercel/Netlify/Cloudflare Pages; API to Fly.io/Railway/Render |

---

## Open questions

- Package names and npm scope: is the `@detriz-sh-kit` scope free on npm? Reserve it early (create a free npm organisation with that name), even without publishing.
- License for the repo (MIT is the usual choice for a design system people should adopt).
- Hosting for the API and storage: SQLite on a small VM is enough for the POC. When to move to Postgres/TimescaleDB?
- Should the public read API be fully open for the demo, or rate-limited / behind a demo key?
- After the split, does `smart-home-kit-platform` stay public (portfolio) or become private (product)?
- Is Live Studio also something customers run locally (served from the Hub), or only hosted by us?

---

## Appendix: understanding `kit/packages` (a beginner's guide)

This appendix explains `kit/packages` from scratch, for someone who is learning to code and hasn't built a design system or a package before. It answers four questions:

1. What is a package, a design system and a client?
2. Why is `kit/packages` split into six small packages instead of one folder?
3. What do I install in each package, and why?
4. How does it all work together, from a Reading on the Raspberry Pi to a number on the screen?

At the end there's a step-by-step setup in the order you should build things.

### Contents

- [The idea in one picture](#the-idea-in-one-picture)
- [What is a package?](#what-is-a-package)
- [What is a design system?](#what-is-a-design-system)
- [What is a client (SDK)?](#what-is-a-client-sdk)
- [Why six packages instead of one?](#why-six-packages-instead-of-one)
- [Source code vs built code (`src/` and `dist/`)](#source-code-vs-built-code-src-and-dist)
- [The three kinds of dependencies](#the-three-kinds-of-dependencies)
- [Each package in detail](#each-package-in-detail)
- [How it all works together: one Reading, start to finish](#how-it-all-works-together-one-reading-start-to-finish)
- [Later: talking to the Hub directly](#later-talking-to-the-hub-directly)
- [Step-by-step setup](#step-by-step-setup)
- [Common beginner mistakes](#common-beginner-mistakes)
- [Glossary](#glossary)

---

### The idea in one picture

Think of `kit/packages` as a **LEGO set for smart home interfaces**:

| LEGO idea | Package | What it really is |
| --- | --- | --- |
| The instruction manual that says what each brick looks like | `@detriz-sh-kit/api-spec` | The **contract**: a file that describes exactly what data the API sends and accepts |
| The colours and sizes all bricks share | `@detriz-sh-kit/tokens` | **Design tokens**: colours, spacing, fonts, as named variables |
| The bricks themselves | `@detriz-sh-kit/ui` | **Components**: Gauge, StatusTile, HistoryChart… They only *look* right; they don't know where data comes from |
| The cable that brings power from the wall | `@detriz-sh-kit/client` | The **client**: code that talks to the API (and later to the Hub) and brings Readings back |
| Bricks with the cable already plugged in | `@detriz-sh-kit/react` | **React hooks and live components**: they use the client to get data and pass it into the `ui` bricks |
| A fake power supply for testing on the table | `@detriz-sh-kit/mock` | **Fake data**: lets you build and test everything without a Raspberry Pi |

Three of these packages are the **design system** (`tokens`, `ui`, and the visual part of `react`). Two are the **client** side (`api-spec`, `client`). `react` is the bridge between the two, and `mock` helps everyone.

```
                     what it looks like                     where the data comes from
                ┌───────────────────────────┐          ┌───────────────────────────┐
                │      DESIGN SYSTEM        │          │          CLIENT           │
                │                           │          │                           │
                │   tokens                  │          │   api-spec                │
                │        │                  │          │        │                  │
                │        ▼                  │          │        ▼                  │
                │   ui                      │          │   client ──────────────────────► hosted API
                │                           │          │                           │     (later: Hub)
                └─────────────┬─────────────┘          └─────────────┬─────────────┘
                              │                                      │
                              └──────────────┐      ┌────────────────┘
                                             ▼      ▼
                                             react ◄── the bridge: data + looks
                                               │
                                               ▼
                                   Live Studio, landing page,
                                   or anyone's React app

                 @detriz-sh-kit/mock: fake API data, used instead of the real API in Storybook, tests and dev
                 (every package name above is short for @detriz-sh-kit/<name>)
```

---

### What is a package?

A **package** is a folder of code with a `package.json` file that gives it a **name**, a **version** and a list of **what it needs**. Once something is a package, other code can use it by its name instead of by its file path.

Without packages, Studio would import a component like this:

```ts
import { Gauge } from "../../../kit/packages/ui/src/sensor/Gauge/Gauge";
```

That path breaks the moment you move a file, rename a folder or split the repo. With a package, Studio writes:

```ts
import { Gauge } from "@detriz-sh-kit/ui";
```

and it keeps working no matter where `@detriz-sh-kit/ui` lives: in this repo today, or on npm after the split.

You already use packages every day. `react`, `react-dom` and `vite` in the current `frontend/package.json` are packages that someone else wrote and published to **npm**, the public registry (a big online library of packages). When you run `pnpm install`, pnpm reads `package.json`, downloads those packages and puts them in `node_modules/`.

`@detriz-sh-kit/ui` works exactly the same way. The only difference today is that pnpm doesn't download it from npm. It **links** it from `kit/packages/ui`, because of `"workspace:*"` (see [Example files](#example-files)).

The important parts of a `package.json`:

```json
{
  "name": "@detriz-sh-kit/ui",        // how others import it. "@detriz-sh-kit" is the scope (like a family name)
  "version": "0.1.0",          // changes every release: 0.1.0 → 0.1.1 (fix) → 0.2.0 (new feature)
  "type": "module",            // use modern import/export syntax
  "exports": { ... },          // the "front door": what others are allowed to import
  "files": ["dist"],           // what gets published (only the built code)
  "scripts": { ... },          // commands like "build" and "test"
  "dependencies": { ... },     // what it needs to work
  "peerDependencies": { ... }, // what it needs, but expects the app to provide
  "devDependencies": { ... }   // what you need while working on it, never shipped
}
```

(Real JSON doesn't allow `//` comments. They're only here to explain.)

**`exports` is the front door.** It lists the only files other code may import. Everything else inside the package is private. That means you can reorganise the inside of `ui` freely without breaking Studio, as long as the front door stays the same.

---

### What is a design system?

A **design system** is a shared set of rules and building blocks so that every screen looks and behaves the same, and nobody has to redesign a button twice. It has three layers:

1. **Tokens**: the smallest decisions, as named values. Not "`#1F6FEB`" but `color-accent`. Not "`16px`" but `space-4`. If you change `color-accent` once, every component that uses it changes.
2. **Components**: reusable pieces of UI built *only* from tokens: `Button`, `Card`, `Gauge`, `StatusTile`.
3. **Documentation**: how and when to use each component, what states it has, what not to do. For us, that's Storybook (`kit/apps/storybook`).

In Figma you already know this as variables (tokens), components and a library page (documentation). The code version is the same idea:

| Figma | Code |
| --- | --- |
| Variables / styles | `@detriz-sh-kit/tokens` → CSS variables like `--dtz-color-accent` |
| Components with variants | `@detriz-sh-kit/ui` → React components with props like `status="stale"` |
| Library documentation page | Storybook, one page per component, one story per state |

**Why keep it separate from Studio?** Because Studio is just *one* user of the design system. The landing page uses it too, Storybook shows it, and in the future other people install it to build their own dashboards. If the components lived inside Studio, nobody else could use them without copying code.

**Why does `ui` never fetch data?** A component that fetches its own data only works with *our* API. A component that just takes props (`value={22.4}`) works with any data: our API, a mock, a CSV file, a Home Assistant integration. It's also trivial to show in Storybook: you just pass different props for each state. That's why fetching lives in a separate layer (`react`).

---

### What is a client (SDK)?

A **client** (often called an **SDK**, Software Development Kit) is code that knows how to talk to a server so that the people using it don't have to.

Without a client, every app that wants a Reading writes something like:

```ts
const res = await fetch("https://api.detriz.dev/sensors/kitchen-temperature/readings/latest");
if (!res.ok) throw new Error("…");
const data = await res.json();      // what's in here? a number? an object? nobody knows
```

Every app repeats the URL, the error handling and the guessing about the shape of the data. With a client:

```ts
import { createClient } from "@detriz-sh-kit/client";

const detriz = createClient({ baseUrl: "https://api.detriz.dev" });
const reading = await detriz.getLatestReading("kitchen-temperature");
//    ^ TypeScript knows: { sensorId: string; value: number; unit: "°C"; timestamp: string }
```

The client:

- knows every URL of the API,
- knows the exact shape of every response (thanks to `api-spec`), so your editor autocompletes `reading.value` and warns you if you type `reading.valeu`,
- handles errors, retries and reconnecting in one place,
- hides **how** data travels (polling in the POC, WebSocket in the MVP), so apps don't change when that changes,
- can be pointed at a different place by changing **one setting**, `baseUrl`. Today that's the hosted API; later it can be the Hub on your local network ([see below](#later-talking-to-the-hub-directly)).

**Why is the client separate from React?** Because talking to the API has nothing to do with React. Keeping it React-free means the same client works in a Vue app, a Node script, a test, or a small script that runs on the Pi. `@detriz-sh-kit/react` simply uses the client under the hood.

---

### Why six packages instead of one?

You could put everything in one big `@detriz-sh-kit/kit` package. It would work, but:

- someone who only wants the colours would have to install React and the whole API client;
- a change to the API client would force a new version of the buttons;
- it would be easy to accidentally make a button depend on the API, which breaks the "components only take props" rule.

Small packages, each with one job, make the rules **physical**: `ui` literally cannot import the client, because the client isn't in its `package.json`. Each package answers one question:

| Package | The question it answers | Uses React? | Depends on |
| --- | --- | --- | --- |
| `@detriz-sh-kit/api-spec` | "What does the API look like?" | No | nothing |
| `@detriz-sh-kit/tokens` | "What colours, spacing and fonts do we use?" | No | nothing |
| `@detriz-sh-kit/ui` | "What does a Gauge look like in each state?" | Yes (peer) | `tokens` |
| `@detriz-sh-kit/client` | "How do I get Readings from the API (or Hub)?" | No | `api-spec` |
| `@detriz-sh-kit/react` | "How do I show live data with 3 lines of code?" | Yes (peer) | `client`, `ui` |
| `@detriz-sh-kit/mock` | "How do I get realistic data without a Pi?" | No | `api-spec` |

And who installs what:

| I am… | I install |
| --- | --- |
| A designer who only wants the visual language in plain HTML/CSS | `@detriz-sh-kit/tokens` |
| A developer with their own data source | `@detriz-sh-kit/tokens` + `@detriz-sh-kit/ui` |
| A developer writing a Node or Vue script against the API | `@detriz-sh-kit/client` |
| A React developer who wants live sensor data fast (or Live Studio) | `@detriz-sh-kit/react` + `@detriz-sh-kit/ui` + `@detriz-sh-kit/tokens` |
| Anyone writing tests or demos | `@detriz-sh-kit/mock` (as a dev dependency) |

> **POC shortcut.** In Phase 1 you don't need all six. Start with `api-spec`, `ui` and `react` (with the fetch code inside `react`). Add `tokens` in Phase 2 and pull `client` and `mock` out in Phase 3, when there's enough code to justify them. The structure above is where you're heading, not what you build on day one.

---

### Source code vs built code (`src/` and `dist/`)

Every package has two versions of its code:

- **`src/`** is what **you write**: TypeScript (`.ts`, `.tsx`), CSS modules, tests, stories.
- **`dist/`** ("distribution") is what **others use**: plain JavaScript that any tool can run, type files (`.d.ts`) so editors still get autocomplete, and one combined CSS file.

A **build tool** turns `src/` into `dist/`:

```
kit/packages/ui/
├── src/
│   └── sensor/Gauge/
│       ├── Gauge.tsx              you write this
│       ├── Gauge.module.css       you write this
│       ├── Gauge.stories.tsx      for Storybook only, never shipped
│       └── Gauge.test.tsx         for tests only, never shipped
│
└── dist/                          ← generated by "pnpm build", never edit by hand, not committed to git
    ├── index.js                   all components as JavaScript
    ├── index.d.ts                 types: what props Gauge accepts
    └── styles.css                 all component CSS in one file
```

Why not let Studio use `src/` directly? Because a customer's app might use a different TypeScript setup, a different bundler, or no TypeScript at all. `dist/` is the lowest common denominator that works everywhere. And by making Studio use `dist/` too, you test exactly what a customer would get.

Add `dist/` to `.gitignore`. It's rebuilt by `pnpm turbo build`, and in dev mode a watcher (`pnpm dev`) rebuilds it every time you save.

---

### The three kinds of dependencies

In each package's `package.json`, you list what it needs in one of three places. Choosing the right one is the most confusing part for beginners, so here's the rule:

| Kind | Meaning | Example | Installed with |
| --- | --- | --- | --- |
| `dependencies` | "I need this to work, install it together with me." | `@detriz-sh-kit/ui` needs `@detriz-sh-kit/tokens` | `pnpm add <pkg> --filter <me>` |
| `peerDependencies` | "I need this to work, but **the app** must provide it. There must be only one copy." | `@detriz-sh-kit/ui` needs `react` | `pnpm add --save-peer <pkg> --filter <me>` |
| `devDependencies` | "I only need this while developing: building, testing, generating. Users never get it." | `tsup`, `vitest`, `style-dictionary`, `openapi-typescript` | `pnpm add -D <pkg> --filter <me>` |

Simple test: **would the code break in a user's browser without it?** If yes, it's a `dependency` (or a `peerDependency` if it's React or something the app must share). If it's only used on your computer or in CI, it's a `devDependency`.

React is always a peer in a library, because two copies of React on one page crash (see [Why libraries use `peerDependencies` for React](#why-libraries-use-peerdependencies-for-react)). You *also* add it as a `devDependency` so that tests and Storybook inside the package can run.

---

### Each package in detail

For each package: what it does, what's inside, what you install, and a small example. Build them in this order, because each one depends on the ones before it.

#### 1. `@detriz-sh-kit/api-spec`: the contract

**What it does.** Describes the API in a file both sides agree on: what URLs exist, what they accept, what they return. The backend (Python) is tested against it, and the client (TypeScript) gets its types from it. Neither side can "drift" without a test failing.

**What's inside.**

```
api-spec/
├── openapi.yaml                REST endpoints (you write this by hand)
├── asyncapi.yaml               WebSocket messages (MVP)
├── src/generated/schema.ts     TypeScript types, generated from openapi.yaml
├── src/index.ts                re-exports the types
└── package.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `openapi-typescript` | dev | Reads `openapi.yaml` and writes TypeScript types |
| `@redocly/cli` | dev | Checks that `openapi.yaml` is valid (`redocly lint`) |

```bash
pnpm add -D openapi-typescript @redocly/cli --filter @detriz-sh-kit/api-spec
```

**Example.** A small piece of `openapi.yaml`:

```yaml
paths:
  /sensors/{sensorId}/readings/latest:
    get:
      summary: Latest Reading of one Sensor
      parameters:
        - { name: sensorId, in: path, required: true, schema: { type: string } }
      responses:
        "200":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Reading" }
components:
  schemas:
    Reading:
      type: object
      required: [sensorId, value, unit, timestamp]
      properties:
        sensorId:  { type: string, example: kitchen-temperature }
        value:     { type: number, example: 22.4 }
        unit:      { type: string, example: "°C" }
        timestamp: { type: string, format: date-time }
```

A script turns it into types:

```json
"scripts": {
  "generate": "openapi-typescript openapi.yaml -o src/generated/schema.ts",
  "lint": "redocly lint openapi.yaml",
  "build": "pnpm generate && tsup src/index.ts --format esm --dts"
}
```

Now any TypeScript code can write `Reading` and get autocomplete for `value`, `unit` and `timestamp`, with no hand-written types to keep in sync.

#### 2. `@detriz-sh-kit/tokens`: the visual language

**What it does.** Holds every design decision (colours, spacing, font sizes, radii, motion) in one place and turns it into formats code can use.

**What's inside.**

```
tokens/
├── src/
│   ├── color.json              exported from Figma variables (DTCG format)
│   ├── space.json
│   └── typography.json
├── build/config.mjs            Style Dictionary config: which formats to output
└── dist/
    ├── tokens.css              :root { --dtz-color-accent: #1f6feb; … }
    ├── tokens.ts               export const colorAccent = "#1f6feb";
    └── tokens.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `style-dictionary` | dev | Converts token JSON into CSS variables, TS and JSON |

```bash
pnpm add -D style-dictionary --filter @detriz-sh-kit/tokens
```

No React, no runtime dependencies. This package is just data.

**Example.**

```json
// src/color.json (DTCG format, the same structure Figma variables export to)
{
  "color": {
    "accent":  { "$type": "color", "$value": "#1f6feb" },
    "status": {
      "connected":    { "$type": "color", "$value": "#1a7f37" },
      "stale":        { "$type": "color", "$value": "#9a6700" },
      "disconnected": { "$type": "color", "$value": "#6e7781" }
    }
  }
}
```

After `pnpm build`, `dist/tokens.css` contains:

```css
:root {
  --dtz-color-accent: #1f6feb;
  --dtz-color-status-connected: #1a7f37;
  --dtz-color-status-stale: #9a6700;
  --dtz-color-status-disconnected: #6e7781;
}
```

Any website can use these, React or not: `<link rel="stylesheet" href="…/tokens.css">` and then `color: var(--dtz-color-accent)`.

#### 3. `@detriz-sh-kit/ui`: the components

**What it does.** The visible building blocks. Each component takes props and renders them. It never fetches data and never knows about the API.

**What's inside.** One folder per component, with everything about that component next to each other:

```
ui/
├── src/
│   ├── sensor/
│   │   └── Gauge/
│   │       ├── Gauge.tsx            the component
│   │       ├── Gauge.module.css     its styles, using only tokens
│   │       ├── Gauge.stories.tsx    one story per state, shown in Storybook
│   │       └── Gauge.test.tsx       tests
│   ├── device/ …
│   ├── primitives/ …
│   └── index.ts                     the front door: export { Gauge } from "./sensor/Gauge/Gauge"; …
├── vite.config.ts                   build config (library mode)
└── package.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `react`, `react-dom` | **peer** + dev | Components are React. Peer so the app supplies the single copy; dev so tests can run here |
| `@detriz-sh-kit/tokens` | dependency (`workspace:*`) | Components use token CSS variables |
| `vite`, `@vitejs/plugin-react` | dev | Build `src/` into `dist/` (JS + one CSS file). Vite library mode is used here rather than tsup, because it handles CSS modules. `tsc` (from the root `typescript`) then writes the `.d.ts` type files |
| `typescript`, `@types/react`, `@types/react-dom` | dev | Type checking |
| `vitest`, `@testing-library/react`, `jsdom` | dev | Tests |
| `clsx` | dependency (optional) | Small helper to combine CSS class names |

```bash
pnpm add --save-peer react react-dom --filter @detriz-sh-kit/ui
pnpm add -D react react-dom @types/react @types/react-dom vite @vitejs/plugin-react vitest @testing-library/react jsdom --filter @detriz-sh-kit/ui
pnpm add @detriz-sh-kit/tokens --workspace --filter @detriz-sh-kit/ui
```

Storybook itself is **not** installed here. It lives in `kit/apps/storybook` and reads the `*.stories.tsx` files from this package. That keeps the library small.

In Phase 1 you also add the third-party library you're wrapping (for example `@mantine/core`) as a dependency here. In Phase 2 you remove it and replace it with your own components, keeping the same props.

**Example.**

```tsx
// src/sensor/Gauge/Gauge.tsx
import styles from "./Gauge.module.css";

export type ConnectionStatus = "loading" | "connected" | "stale" | "disconnected" | "fault";

export interface GaugeProps {
  value: number | null;
  unit: string;
  label: string;
  status: ConnectionStatus;
}

export function Gauge({ value, unit, label, status }: GaugeProps) {
  return (
    <figure className={styles.gauge} data-status={status}>
      <figcaption className={styles.label}>{label}</figcaption>
      <span className={styles.value}>
        {value === null ? "—" : value.toFixed(1)}
        <small>{unit}</small>
      </span>
    </figure>
  );
}
```

```css
/* src/sensor/Gauge/Gauge.module.css: only tokens, never raw colours */
@layer detriz {
  .gauge {
    padding: var(--dtz-space-4);
    border-radius: var(--dtz-radius-2);
    border: 2px solid var(--dtz-color-status-connected);
  }
  .gauge[data-status="stale"]        { border-color: var(--dtz-color-status-stale); }
  .gauge[data-status="disconnected"] { border-color: var(--dtz-color-status-disconnected); opacity: 0.6; }
}
```

```tsx
// src/sensor/Gauge/Gauge.stories.tsx: one story per state from the Ubiquitous Language
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gauge } from "./Gauge";

const meta: Meta<typeof Gauge> = { component: Gauge, args: { label: "Kitchen", unit: "°C" } };
export default meta;

export const Connected:    StoryObj<typeof Gauge> = { args: { value: 22.4, status: "connected" } };
export const Stale:        StoryObj<typeof Gauge> = { args: { value: 22.4, status: "stale" } };
export const Disconnected: StoryObj<typeof Gauge> = { args: { value: 22.4, status: "disconnected" } };
export const Loading:      StoryObj<typeof Gauge> = { args: { value: null, status: "loading" } };
```

Notice: no `fetch`, no API URL, no hooks. Give it props, it draws. That's what makes it reusable.

#### 4. `@detriz-sh-kit/client`: talking to the API (and later the Hub)

**What it does.** All the code that talks to the server lives here: REST calls, the WebSocket stream, reconnecting, buffering, Record & Replay. It returns plain data and has no idea React exists.

**What's inside.**

```
client/
├── src/
│   ├── createClient.ts        the entry point: createClient({ baseUrl, … })
│   ├── rest/                  getSensors(), getLatestReading(), getReadings()
│   ├── stream/                subscribe(sensorId, callback) over polling or WebSocket
│   ├── replay/                plays back a recorded session as if it were live
│   ├── domain/                Hub, Module, Sensor, Reading types (re-exported from api-spec)
│   └── index.ts               the front door
└── package.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `@detriz-sh-kit/api-spec` | dependency (`workspace:*`) | Types for every request and response |
| `openapi-fetch` | dependency | A tiny `fetch` wrapper that uses the generated types, so every call is type-checked |
| `tsup` | dev | Builds `src/` into `dist/` (JS + types). No CSS here, so tsup is enough |
| `vitest`, `msw` | dev | Tests against a fake API |

```bash
pnpm add @detriz-sh-kit/api-spec --workspace --filter @detriz-sh-kit/client
pnpm add openapi-fetch --filter @detriz-sh-kit/client
pnpm add -D tsup vitest msw --filter @detriz-sh-kit/client
```

No React. `fetch` and `WebSocket` are built into browsers and Node, so there's nothing else to install.

**Example.**

```ts
// src/createClient.ts
import createFetchClient from "openapi-fetch";
import type { paths, components } from "@detriz-sh-kit/api-spec";

export type Reading = components["schemas"]["Reading"];

export interface ClientOptions {
  /** Where to get data from. Hosted API today; a Hub on the local network later. */
  baseUrl: string;
  /** How often to poll, in milliseconds (POC). Replaced by WebSocket in the MVP. */
  pollInterval?: number;
}

export function createClient({ baseUrl, pollInterval = 3000 }: ClientOptions) {
  const http = createFetchClient<paths>({ baseUrl });

  async function getLatestReading(sensorId: string): Promise<Reading> {
    const { data, error } = await http.GET("/sensors/{sensorId}/readings/latest", {
      params: { path: { sensorId } },
    });
    if (error) throw new Error(`Could not load ${sensorId}`);
    return data;
  }

  /** Calls `onReading` every time a new Reading arrives. Returns a function that stops it. */
  function subscribe(sensorId: string, onReading: (r: Reading) => void, onError: (e: unknown) => void) {
    const tick = () => getLatestReading(sensorId).then(onReading, onError);
    tick();
    const timer = setInterval(tick, pollInterval);
    return () => clearInterval(timer);
  }

  return { getLatestReading, subscribe };
}

export type DetrizClient = ReturnType<typeof createClient>;
```

When you switch from polling to WebSocket in the MVP, only the inside of `subscribe` changes. Every app that uses `subscribe` keeps working.

#### 5. `@detriz-sh-kit/react`: the bridge

**What it does.** Connects the client (data) with the ui (looks), the React way:

- `DetrizProvider` creates **one** client for the whole app and shares it, so every component uses the same connection.
- **Hooks** like `useSensor(id)` subscribe to a Sensor and give you `{ reading, status }`, re-rendering when new data arrives.
- **Live components** like `<LiveGauge sensorId="…" />` are a hook plus a `ui` component, glued together.

**What's inside.**

```
react/
├── src/
│   ├── DetrizProvider.tsx      creates the client, shares it through React context
│   ├── hooks/
│   │   ├── useSensor.ts        { reading, status } for one Sensor
│   │   └── useConnectionStatus.ts
│   ├── live/
│   │   └── LiveGauge.tsx       useSensor + <Gauge>
│   └── index.ts
└── package.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `react` | **peer** + dev | Hooks and context are React. Peer, so the app's copy is used |
| `@detriz-sh-kit/client` | dependency (`workspace:*`) | Gets the data |
| `@detriz-sh-kit/ui` | dependency (`workspace:*`) | Draws the data |
| `tsup` | dev | Build |
| `vitest`, `@testing-library/react`, `jsdom`, `@detriz-sh-kit/mock` | dev | Tests with fake data |

```bash
pnpm add --save-peer react --filter @detriz-sh-kit/react
pnpm add @detriz-sh-kit/client @detriz-sh-kit/ui --workspace --filter @detriz-sh-kit/react
pnpm add -D react @types/react tsup vitest @testing-library/react jsdom --filter @detriz-sh-kit/react
pnpm add -D @detriz-sh-kit/mock --workspace --filter @detriz-sh-kit/react
```

**Example.**

```tsx
// src/DetrizProvider.tsx
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createClient, type DetrizClient } from "@detriz-sh-kit/client";

const ClientContext = createContext<DetrizClient | null>(null);

export function DetrizProvider({ api, children }: { api: string; children: ReactNode }) {
  const client = useMemo(() => createClient({ baseUrl: api }), [api]);
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

export function useDetrizClient() {
  const client = useContext(ClientContext);
  if (!client) throw new Error("Wrap your app in <DetrizProvider>");
  return client;
}
```

```ts
// src/hooks/useSensor.ts
import { useEffect, useState } from "react";
import type { Reading } from "@detriz-sh-kit/client";
import type { ConnectionStatus } from "@detriz-sh-kit/ui";
import { useDetrizClient } from "../DetrizProvider";

export function useSensor(sensorId: string) {
  const client = useDetrizClient();
  const [reading, setReading] = useState<Reading | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("loading");

  useEffect(() => {
    const stop = client.subscribe(
      sensorId,
      (r) => { setReading(r); setStatus("connected"); },
      () => setStatus((s) => (s === "loading" ? "fault" : "stale")),
    );
    return stop;                       // stop polling when the component disappears
  }, [client, sensorId]);

  return { reading, status };
}
```

```tsx
// src/live/LiveGauge.tsx: the "3 lines to a live reading" component
import { Gauge } from "@detriz-sh-kit/ui";
import { useSensor } from "../hooks/useSensor";

export function LiveGauge({ sensorId, label }: { sensorId: string; label?: string }) {
  const { reading, status } = useSensor(sensorId);
  return <Gauge value={reading?.value ?? null} unit={reading?.unit ?? ""} label={label ?? sensorId} status={status} />;
}
```

See how small `LiveGauge` is? All the hard work is in `client` (data) and `ui` (looks). `react` just connects them.

#### 6. `@detriz-sh-kit/mock`: data without a Raspberry Pi

**What it does.** Pretends to be the API, so you can build Studio, write tests and show Storybook stories without a Pi, without the backend running, and without internet.

**What's inside.**

```
mock/
├── src/
│   ├── handlers.ts             fake API endpoints (MSW)
│   ├── fixtures/               realistic sample Readings per Metric (temperature, light…)
│   └── sessions/               recorded sessions for Replay demos
└── package.json
```

**What to install.**

| Package | Kind | Why |
| --- | --- | --- |
| `msw` (Mock Service Worker) | dependency | Catches `fetch` calls in the browser or in tests and answers them with fake data |
| `@detriz-sh-kit/api-spec` | dependency (`workspace:*`) | So the fake responses have exactly the right shape |
| `tsup` | dev | Build |

```bash
pnpm add msw --filter @detriz-sh-kit/mock
pnpm add @detriz-sh-kit/api-spec --workspace --filter @detriz-sh-kit/mock
pnpm add -D tsup --filter @detriz-sh-kit/mock
```

Other packages and apps install `@detriz-sh-kit/mock` as a **dev** dependency, because it's only for development and tests.

**Example.**

```ts
// src/handlers.ts
import { http, HttpResponse } from "msw";
import type { components } from "@detriz-sh-kit/api-spec";

type Reading = components["schemas"]["Reading"];

export const handlers = [
  http.get("*/sensors/:sensorId/readings/latest", ({ params }) => {
    const reading: Reading = {
      sensorId: String(params.sensorId),
      value: 21 + Math.random() * 2,          // a believable room temperature
      unit: "°C",
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(reading);
  }),
];
```

Because the reading is typed as `Reading` from `api-spec`, if someone renames `value` in `openapi.yaml`, this mock stops compiling. The fake API can't silently drift away from the real one.

---

### How it all works together: one Reading, start to finish

Here's what happens when Studio shows the kitchen temperature, step by step.

```
 Raspberry Pi            hosted API              client                react                   ui                   screen
 ────────────            ──────────              ──────                ─────                   ──                   ──────
 sensor reads 22.4 °C
 hub agent POSTs it ───► stores it
                                                 subscribe() polls
                         GET …/latest  ◄──────── every 3 s
                         returns JSON ─────────► typed Reading ──────► useSensor sets
                                                                       { reading, status }
                                                                       LiveGauge re-renders ─► <Gauge value={22.4}
                                                                                                status="connected">
                                                                                               uses tokens.css ───► ┌──────────┐
                                                                                                                    │ Kitchen  │
                                                                                                                    │ 22.4 °C  │
                                                                                                                    └──────────┘
```

1. The hub agent on the Pi reads the sensor and sends the Reading to the hosted API (`platform/hub`, Python).
2. The API stores it (`platform/services/api`, Python).
3. In Studio, `<DetrizProvider api="https://api.detriz.dev">` has created one client (`@detriz-sh-kit/react` → `@detriz-sh-kit/client`).
4. `<LiveGauge sensorId="kitchen-temperature" />` calls `useSensor`, which calls `client.subscribe`.
5. The client calls `GET /sensors/kitchen-temperature/readings/latest`. The response shape is checked by types from `@detriz-sh-kit/api-spec`.
6. `useSensor` stores the Reading and sets `status` to `"connected"`. React re-renders.
7. `LiveGauge` passes plain props to `<Gauge>` from `@detriz-sh-kit/ui`.
8. `Gauge` draws itself using CSS variables from `@detriz-sh-kit/tokens`.
9. If the API stops answering, `useSensor` switches `status` to `"stale"`, and the Gauge turns amber. No other code has to know.

And in development, step 5 is answered by `@detriz-sh-kit/mock` instead of the real API. Nothing else changes.

---

### Later: talking to the Hub directly

Today, the client talks only to the hosted API. Because the client is pointed at a place by **one setting** (`baseUrl`), it can later talk straight to a Hub on the local network, for example when you're prototyping at home and don't want to go through the cloud:

```tsx
// today: through the hosted API
<DetrizProvider api="https://api.detriz.dev">

// later: straight to the Hub on your Wi-Fi
<DetrizProvider api="http://detriz-hub.local:8080">
```

For that to work, three things have to be true. They're future work, not part of the POC:

1. **The Hub must speak the same language.** The hub agent would expose a small local server that implements the **read** part of `openapi.yaml` (`GET /sensors`, `GET …/readings/latest`, the stream). Same contract, same contract tests, so the client can't tell the difference.
2. **The browser must be allowed to call it.** The Hub must send CORS headers that allow the page's origin. And a page served over **HTTPS** (like the hosted Studio) is not allowed to call a plain **HTTP** address like `http://detriz-hub.local`. That's called mixed content and browsers block it. So local mode works for Studio running locally (`pnpm dev`, which is HTTP), or the Hub needs its own HTTPS certificate.
3. **The client may need a "hub mode" option.** A Hub knows only its own Sensors and has a short local history, so the client might expose `createClient({ baseUrl, source: "hub" })` to adjust a few defaults (shorter history range, different reconnect timing). Apps keep calling the same functions.

The design choice that makes this cheap is the one already in place: **apps never build URLs themselves; only the client knows where data comes from.**

The client also works outside the browser, in Node. That means a small TypeScript script (on a laptop, or even on the Pi) can `import { createClient } from "@detriz-sh-kit/client"` to read the Hub. The hub agent itself stays in Python.

---

### Step-by-step setup

Do Phase 0 first (root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`; see [Phase 0](#phases)). Then create the packages in this order. Run every command from the **repo root**.

**Step 1: Create the folders and `package.json` files.**

```bash
mkdir -p kit/packages/{api-spec,tokens,ui,react}/src
for p in api-spec tokens ui react; do (cd kit/packages/$p && pnpm init); done
```

Open each new `package.json` and set at least `"name"` (`"@detriz-sh-kit/ui"` etc.), `"version": "0.0.0"`, `"type": "module"`, `"files": ["dist"]`, `"exports"` and the `"build"` / `"dev"` scripts. Use the [`@detriz-sh-kit/ui` example](#example-files) as a template.

**Step 2: `api-spec`.** Install its tools, write the temperature endpoints in `openapi.yaml`, generate the types.

```bash
pnpm add -D openapi-typescript @redocly/cli --filter @detriz-sh-kit/api-spec
pnpm --filter @detriz-sh-kit/api-spec lint
pnpm --filter @detriz-sh-kit/api-spec generate
```

✅ Check: `src/generated/schema.ts` exists and contains `Reading`.

**Step 3: `ui`.** Install React as a peer, the build tools and the third-party library you're wrapping in the POC. Create `Gauge` and export it from `src/index.ts`.

```bash
pnpm add --save-peer react react-dom --filter @detriz-sh-kit/ui
pnpm add -D react react-dom @types/react @types/react-dom vite @vitejs/plugin-react --filter @detriz-sh-kit/ui
pnpm --filter @detriz-sh-kit/ui build
```

✅ Check: `kit/packages/ui/dist/` has `index.js`, `index.d.ts` and `styles.css`.

**Step 4: Storybook.** Set up `kit/apps/storybook` and point it at the `ui` stories.

```bash
mkdir -p kit/apps/storybook && cd kit/apps/storybook && pnpm dlx storybook@latest init --type react_vite_project
```

In `.storybook/main.ts`, set `stories: ["../../../packages/ui/src/**/*.stories.tsx"]`.

✅ Check: `pnpm --filter storybook dev` shows Gauge in all its states.

**Step 5: `react`.** For the POC, put the fetch code directly in `useSensor` (or in a small `src/client.ts` inside this package). You'll move it to `@detriz-sh-kit/client` in Phase 3.

```bash
pnpm add --save-peer react --filter @detriz-sh-kit/react
pnpm add @detriz-sh-kit/ui @detriz-sh-kit/api-spec --workspace --filter @detriz-sh-kit/react
pnpm add -D react @types/react tsup --filter @detriz-sh-kit/react
pnpm --filter @detriz-sh-kit/react build
```

✅ Check: `dist/index.d.ts` exports `DetrizProvider`, `useSensor` and `LiveGauge`.

**Step 6: Use it in Studio.**

```bash
pnpm add @detriz-sh-kit/react @detriz-sh-kit/ui --workspace --filter studio
pnpm turbo dev --filter studio...
```

The three dots after `studio` mean "Studio **and everything it depends on**", so Turborepo also starts the watch builds for `ui` and `react`. Edit `Gauge.tsx`, save, and Studio updates.

✅ Check: Studio shows a `LiveGauge` with a real (or mocked) temperature.

**Step 7 (Phase 2): `tokens`.** Export variables from Figma, add Style Dictionary, then replace every hard-coded value in `ui` with `var(--dtz-…)`.

```bash
mkdir -p kit/packages/tokens/src && (cd kit/packages/tokens && pnpm init)
pnpm add -D style-dictionary --filter @detriz-sh-kit/tokens
pnpm add @detriz-sh-kit/tokens --workspace --filter @detriz-sh-kit/ui
```

**Step 8 (Phase 3): `client` and `mock`.** Move the fetch code out of `react` into `@detriz-sh-kit/client`, make `react` depend on it, and create `@detriz-sh-kit/mock` for tests, Storybook and dev mode. Apps don't change, because they only use `@detriz-sh-kit/react`.

---

### Common beginner mistakes

| Mistake | What happens | Fix |
| --- | --- | --- |
| Running `pnpm install` inside a package folder | A second lockfile appears, packages get out of sync | Always run pnpm from the repo root, use `--filter` to target a package |
| Importing from another package's `src/` (`@detriz-sh-kit/ui/src/…`) | Works today, breaks after the split, skips the build | Import only by package name; add what you need to the package's `index.ts` |
| Forgetting to export a new component from `src/index.ts` | `import { NewThing } from "@detriz-sh-kit/ui"` fails | Every public component gets a line in `index.ts` |
| Putting React in `dependencies` of `ui` or `react` | Two copies of React, "Invalid hook call" | React is always a **peer** (and dev) dependency in a library |
| Hard-coding a colour (`#1f6feb`) in a component | Theming and dark mode stop working for that component | Only use `var(--dtz-…)` tokens |
| Fetching data inside a `ui` component | The component only works with our API and is hard to show in Storybook | Fetch in `@detriz-sh-kit/react` (hooks), pass props to `ui` |
| Editing files in `dist/` | Your change disappears on the next build | Edit `src/`; `dist/` is generated |
| Studio doesn't show your change | The package wasn't rebuilt | Run `pnpm turbo dev --filter studio...` so packages rebuild on save |
| Committing `dist/` | Noisy diffs, merge conflicts | Add `dist/` to `.gitignore` |

---

### Glossary

| Term | Meaning |
| --- | --- |
| **Package** | A folder with a `package.json`: code with a name and version that others can install and import by name |
| **npm** | The public online registry of JavaScript packages. Also the name of the original install tool |
| **pnpm** | The install tool we use. Faster than npm and good at workspaces |
| **Workspace / monorepo** | One repo that contains several packages and apps, installed together |
| **`workspace:*`** | "Use the copy of this package from this repo", a link instead of a download |
| **Scope** | The `@detriz-sh-kit/` prefix. Groups the Smart Home Kit packages under one name on npm |
| **`exports`** | The front door of a package: the only files others may import |
| **`src/` / `dist/`** | Code you write / built code others use |
| **Build** | Turning TypeScript, CSS modules etc. in `src/` into plain JS, types and CSS in `dist/` |
| **Dependency / peer / dev dependency** | Needed and installed with me / needed, but the app provides it / only needed while developing |
| **Design token** | A named design decision (`--dtz-color-accent`) instead of a raw value (`#1f6feb`) |
| **Component** | A reusable piece of UI, like `Gauge`, configured through props |
| **Props** | The inputs of a component: `<Gauge value={22.4} />` |
| **Hook** | A React function starting with `use` that gives a component data or behaviour (`useSensor`) |
| **Provider / context** | A React way to share one thing (our client) with every component below it |
| **Client / SDK** | Code that knows how to talk to a server so apps don't have to |
| **API contract (OpenAPI)** | A file describing every URL, input and output of the API, which both sides follow |
| **Mock** | Fake data or a fake server used instead of the real one in development and tests |
| **Storybook** | A tool that shows each component on its own, in every state, as living documentation |
| **Semver** | Version numbers as MAJOR.MINOR.PATCH: breaking change, new feature, fix |
