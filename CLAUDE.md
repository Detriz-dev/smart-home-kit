# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working style

- Ask clarifying questions before acting when a request is ambiguous.
- This is a learning project by a UX designer moving toward engineering. The docs explain concepts for beginners, so when you explain a change, keep it plain and short.

## Commands

Run everything from the repo root. It uses pnpm 11 workspaces, Turborepo and Node 22 or later (`corepack enable` if `pnpm` is missing).

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Storybook (port 6007) | `pnpm storybook` |
| Build everything (tokens → ui → storybook) | `pnpm build` (`--force` skips the Turbo cache) |
| Build one package | `pnpm --filter @detriz-sh-kit/tokens build` / `pnpm --filter @detriz-sh-kit/ui build` |
| Typecheck components | `pnpm --filter @detriz-sh-kit/ui typecheck` |
| Format / check formatting | `pnpm format` / `pnpm format:check` |

`pnpm lint` and `pnpm test` exist at the root, but no workspace package defines `lint` or `test` scripts yet, so there are no tests to run.

`frontend/` is **not** part of the pnpm workspace. It is a separate npm + Vite scaffold (`cd frontend && npm run dev | build | lint`) and Prettier ignores it. It will move to `platform/apps/studio`.

Turbo's `build`, `dev`, `test` and `typecheck` depend on `^build`, so `ui` needs a built `tokens/dist/tokens.css`. If a token change doesn't show up, rebuild the tokens.

## Architecture

The target design is in `docs/architecture/architecture-overview.md`. Only part of it exists so far:

- `kit/`: the future public repo `smart-home-kit` (design system, SDK, API spec, Storybook). It exists today.
- `platform/`: the future repo `smart-home-kit-platform` (Live Studio, landing page, FastAPI backend, Raspberry Pi hub). It doesn't exist yet. `frontend/` is the start of Studio.
- Packages that exist: `kit/packages/tokens`, `kit/packages/ui`, `kit/apps/storybook`. Planned but not created yet: `api-spec`, `client`, `react`, `mock`, `apps/docs`.

Dependency rules (see "Dependency rules" in the overview):

- Nothing in `kit/` imports from `platform/`. `platform/` imports kit code only by package name (`@detriz-sh-kit/*`) and only through each package's `exports`, never with relative paths or `/src/` imports.
- `tokens` has no dependencies. `ui` is presentational only: it takes props, never fetches data and never imports `client`. Only the planned `react` package joins `client` and `ui` (the pre-bound `Live*` components).
- Libraries (`ui`, `react`) list React as a `peerDependency` plus a `devDependency`. Apps own React. Shared React versions come from the `catalog:` in `pnpm-workspace.yaml`.
- Internal packages are linked with `workspace:*` and built as if they were published (`exports` → `dist/`).

### Design system pipeline

1. **Tokens** (`kit/packages/tokens`): DTCG JSON in `src/primitive/` (raw values), `src/semantic/` (purpose, refers to primitives with `{palette.gray.900}`) and `src/component/`. Style Dictionary (`build/config.json`) builds them into `dist/tokens.css` as CSS variables with the **`--shk-` prefix**, for example `--shk-color-text-muted`. Some docs and comments still say `--dtz-`; that is out of date.
2. **UI** (`kit/packages/ui`): Vite library mode builds `src/index.ts` into `dist/index.js` + `dist/styles.css`, and `tsc -p tsconfig.build.json` emits the `.d.ts` files (stories and tests are excluded). Only what `src/index.ts` exports is public.
3. **Storybook** (`kit/apps/storybook`): loads stories from `../../packages/ui/src/**/*.stories.tsx` and imports `@detriz-sh-kit/tokens/tokens.css` once in `preview.ts`.

### Component conventions

Full guide: `docs/architecture/design-system/how-to-create-a-component.md` (section 8 is the checklist).

- One folder per component: `kit/packages/ui/src/<group>/<Name>/` with `<Name>.tsx`, `<Name>.module.css` and `<Name>.stories.tsx`. `sensor/Gauge` is the reference example.
- An exported `<Name>Props` interface with a `/** */` comment on every prop. Use semantic HTML.
- CSS Modules wrapped in `@layer detriz`, using only `var(--shk-…)` tokens (no raw colours or sizes).
- Export the component and its props type from `src/index.ts`.
- Target states for every component (from the Ubiquitous Language): loading, Connected, Stale, Disconnected (last value dimmed) and Fault, each with a story.

General naming rules (PascalCase components, `use<Thing>` hooks, unit suffixes like `temperatureC`, `is/has` booleans, `on<Event>`/`handle<Event>`) are in `docs/architecture/frontend/frontend-conventions.md`.

## Domain language

Use the terms from `docs/architecture/domain-model/ubiquitous-language.md` exactly, in code, types, UI copy and docs: Site, Space, Hub, Module, Slot, Sensor, Asset, Metric, Unit, Reading, and so on. Device Status is three separate fields: Pairing Status, Connection Status (Connecting / Connected / Stale / Disconnected, for paired Devices only) and Fault. A Sensor is not a Device.

## Repo conventions

- Branches are named `<issue-number>-short-name`. Commits follow Conventional Commits, scoped to the package or app (`feat(ui): …`).
- Architecture decisions go in ADRs: `docs/adr/NNNN-title.md`.
- Never commit `dist/`, `storybook-static/`, `.turbo/` or `node_modules/`.
- `AGENTS.md` contains a block managed by Turborepo: before changing Turbo config or commands, read the docs bundled in the installed `turbo` package, because they may differ from what you know.
