# Component building workflow

How a new UI component goes from an idea to a merged PR. People and AI agents follow the same steps in the same order.

Every component **starts with a Markdown file**. The `.md` file decides what the component does. Figma decides how it looks. The code follows both.

```
1. Spec (.md)  →  2. Figma  →  3. Review (AI)  →  4. Build: TSX → CSS → Storybook  →  5. Check and ship
                     ↑               │
                     └── fix ────────┘   (the review sends you back until it passes)
```

Worked examples in the repo: [`DeviceCommunicationStatus`](/kit/packages/ui/src/components/status/DeviceCommunicationStatus/) and [`DevicePairingStatus`](/kit/packages/ui/src/components/status/DeviceParingStatus/).

## Contents

- [Read first](#read-first)
- [The order at a glance](#the-order-at-a-glance)
- [Step 0. Issue and branch](#step-0-issue-and-branch)
- [Step 1. Write the spec](#step-1-write-the-spec-namemd)
- [Step 2. Design in Figma](#step-2-design-in-figma)
- [Step 3. Review the design with AI](#step-3-review-the-design-with-ai)
- [Step 4. Build](#step-4-build)
- [Step 5. Check and ship](#step-5-check-and-ship)
- [Rules for agents](#rules-for-agents)
- [Checklist](#checklist)
- [When something goes wrong](#when-something-goes-wrong)

## Read first

| Doc                                                                                             | Why                                                            |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Ubiquitous Language](/docs/architecture/domain-model/ubiquitous-language.md)                   | The only words allowed in props, labels, type names and docs.  |
| [Device lifecycle](/docs/architecture/domain-model/device-lifecycle.md)                         | Which statuses exist and how a Device moves between them.      |
| [Relationship and cardinality](/docs/architecture/domain-model/relationship-and-cardinality.md) | How Site, Space, Hub, Module, Sensor relate.                   |
| [Conventions and structure](/docs/architecture/design-system/ds-conventions-and-structure.md)   | Naming rules, folders, the import chain, component categories. |
| [Figma variables → code](figma-variables-code-handoff.md)                                       | How a Figma variable becomes a `--shk-…` token.                |
| [Add an icon](add-icon-to-design-system-workflow.md)                                            | How icons get into the `Icon` component.                       |

## The order at a glance

| #   | Step             | Output                                      | Done when                                                    |
| --- | ---------------- | ------------------------------------------- | ------------------------------------------------------------ |
| 0   | Issue and branch | GitHub issue, `<issue>-short-name` branch   | The issue says what problem the component solves.            |
| 1   | Spec             | `<Name>.md`                                 | Purpose, states, anatomy, props and tokens are written down. |
| 2   | Figma            | Component set, one variant per state        | Every state exists and every value is a variable.            |
| 3   | Review (AI)      | Review report: pass, or a list of fixes     | Names match the conventions and the domain model.            |
| 4a  | TSX              | `<Name>.types.ts`, `<Name>.tsx`, `index.ts` | The component renders every state, typecheck passes.         |
| 4b  | CSS              | `<Name>.module.css`                         | Every state looks like its Figma variant, tokens only.       |
| 4c  | Storybook        | `<Name>.stories.tsx`                        | One story per state.                                         |
| 5   | Check and ship   | Passing checks, updated `.md`, PR           | PR is reviewed and merged.                                   |

Steps 1 and 2 go back and forth: drawing in Figma often shows a missing state or prop. When that happens, update the `.md` first, so it stays the source of truth.

## Step 0. Issue and branch

- Open a GitHub issue: one sentence on the problem, the Device or Metric it is about, and where it will be used.
- Create the branch: `git switch -c <issue-number>-short-name`.

## Step 1. Write the spec: `<Name>.md`

Start here, before Figma. Writing makes you decide what the component **is** and what it **isn't**. The same file is the brief you give the AI in every later step.

### Pick the name and the folder

1. **Category.** Pick one from [Components categorisation](/docs/architecture/design-system/ds-conventions-and-structure.md#3-components-categorisation) by the question it answers: Context, Readings, History, Comparison, Status, Feedback, Controls or Layout. The folder name is the category in lowercase.
2. **Name.** PascalCase, built from domain words: `DeviceCommunicationStatus`, not `OnlineBadge`.
3. **Create the file:** `kit/packages/ui/src/components/<category>/<Name>/<Name>.md`.

### Sections to write

Write the ones marked **required** before you open Figma. Fill the rest as you go.

| Section              | What to write                                                                                                                                                   |             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Purpose              | One or two sentences: what it shows, for whom, where it is used.                                                                                                | required    |
| Domain model context | Which domain terms it shows, copied from the glossary, with links. What it does **not** show and why (neighbouring fields belong to other components).          | required    |
| States               | A table: state, prop value, label, colour role, icon. Map them to the target states (loading, Connected, Stale, Disconnected, Fault) and say which don't apply. | required    |
| Anatomy              | A list or ASCII sketch of the parts: `root`, `label`, `indicator`… These names become Figma layer names and CSS class names.                                    | required    |
| API                  | The props: name, type, required or not, one line each.                                                                                                          | required    |
| Tokens               | Which `--shk-…` token each part uses, per state. Mark the ones that don't exist yet.                                                                            | after Figma |
| Accessibility        | Role, live region, contrast, "not colour alone", reduced motion.                                                                                                | after Figma |
| Open questions       | Anything not decided yet.                                                                                                                                       | any time    |

**Done when** all required sections are filled and no open question changes a prop or a state.

## Step 2. Design in Figma

Build a real **component set**, not a loose frame. How you build it decides how much the AI can read from it in steps 3 and 4.

| Rule                                                                                                       | Example                                        |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Component name = the name in the spec                                                                      | `DeviceCommunicationStatus`                    |
| One variant per state. Property named like the prop, values exactly like the TypeScript values (lowercase) | `status=connecting`, `status=stale`            |
| Layer names = anatomy part names from the spec                                                             | `root`, `label`, `indicator`, never `Frame 12` |
| Only variables, never raw values: every fill, stroke, gap, padding, radius and text style                  | `status/success/solid`, `space/1`              |
| Auto layout everywhere                                                                                     | So gap and padding are real values.            |
| Component description: one sentence from the spec and the path to the `.md`                                |                                                |

If a value has no variable yet, create it in Figma and follow [Figma variables → code](figma-variables-code-handoff.md#workflow-changing-a-token) (`figma:import`, then `build`). Commit tokens on their own: `feat(tokens): …`.

**Done when** every state in the spec's table exists as a variant and nothing uses a raw value.

## Step 3. Review the design with AI

A gate before any code. The AI compares three things: the **spec**, the **Figma component** and the **rules** (conventions + domain model).

### How to give the design to the AI

Use the Figma MCP. One-time setup: in Claude Code type `/mcp`, pick **figma**, log in.

Then in Figma select the **component set**, right-click → **Copy link to selection**, and paste the link with this prompt:

> Review `<Name>` before we build it. Spec: `<path to Name.md>`. Figma: `<link>`. Follow step 3 of `docs/architecture/design-system/workflows/component-building.md` and give me the review report.

(A screenshot works for a quick look, but the AI can't read layer names or variables from pixels, so it can't do this review properly.)

### What the review checks

| Area          | Check                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain words  | Component name, prop names, prop values and labels use [Ubiquitous Language](/docs/architecture/domain-model/ubiquitous-language.md) terms exactly. No synonyms ("online" for Connected, "device" for a Sensor).                         |
| Domain rules  | States match the lifecycle docs. Device Status fields stay separate: Pairing Status, Connection Status and Fault are never mixed in one prop.                                                                                            |
| Naming        | Follows the [naming table](/docs/architecture/design-system/ds-conventions-and-structure.md#1-naming-convention): PascalCase component, lowercase union values, `is/has` booleans, `on<Event>` handlers, unit suffixes (`temperatureC`). |
| Spec ↔ Figma  | Every state in the spec is a variant, and every variant is in the spec. Variant property and values match the prop and its values. Layer names match the anatomy.                                                                        |
| Tokens        | Every value is bound to a variable. Every variable maps to an existing `--shk-…` token in `kit/packages/tokens/dist/tokens.css`.                                                                                                         |
| Category      | The folder matches the category rules (Status vs Feedback, Context vs Status, clickable means Controls).                                                                                                                                 |
| Accessibility | Status is not shown by colour alone. Text contrast is enough.                                                                                                                                                                            |

### The review report

The AI answers in this shape:

```
Result: PASS | FIX NEEDED

Fixes (only if FIX NEEDED):
| # | Where (spec / Figma / tokens) | Problem | Suggested fix | Rule |

Token map:
| Figma variable | --shk- token | exists? |
```

- **FIX NEEDED:** fix the spec or Figma, then run the review again.
- **PASS:** go to step 4. The token map is the input for the CSS step.

## Step 4. Build

Three files, in this order. Each one depends on the one before it.

### 4a. TSX: types, data, markup

**Types: `<Name>.types.ts`.** Copied from the spec's API section.

- The union type for the states, with lowercase values that match the Figma variant values.
- The `<Name>Props` interface with a `/** */` comment on every prop.
- If a second component needs a type, move it to `src/types/`.

```ts
/** Can we reach this Device right now? Only Paired Devices have one. */
export type ConnectionStatus =
  "connecting" | "connected" | "stale" | "disconnected";

export interface DeviceCommunicationStatusProps {
  /** The Device's current Connection Status. */
  status: ConnectionStatus;
}
```

**Data and markup: `<Name>.tsx`.**

- **Data:** fixed values the component needs, like the label for each state, as a constant above the component. `Record<ConnectionStatus, string>` makes TypeScript complain if a state has no label.
- **Markup:** semantic HTML and ARIA from the spec's Accessibility section. Class names = anatomy names (`styles.root`, `styles.label`). The state goes in a data attribute (`data-status={status}`), so CSS can style it.
- **Props only.** No `fetch`, no app state, no formatting inline (use a util from `utils/`).
- Create an empty `<Name>.module.css` so the import works.

```tsx
const LABELS: Record<ConnectionStatus, string> = {
  connecting: "Connecting",
  connected: "Connected",
  stale: "Stale",
  disconnected: "Disconnected",
};

export function DeviceCommunicationStatus({
  status,
}: DeviceCommunicationStatusProps) {
  return (
    <span role="status" data-status={status} className={styles.root}>
      <span className={styles.label}>{LABELS[status]}</span>
      <span className={styles.indicator} />
    </span>
  );
}
```

**Exports.**

- `index.ts` in the component folder: the component and its types.
- `kit/packages/ui/src/index.ts`: the same, so apps can `import { Name } from "@detriz-sh-kit/ui"`. Only what this file exports is public.

**Done when** `pnpm --filter @detriz-sh-kit/ui typecheck` passes.

### 4b. CSS: `<Name>.module.css`

- Everything inside `@layer detriz { … }`.
- Only `var(--shk-…)` tokens, taken from the review's token map. No raw colours, sizes or fonts.
- One class per anatomy part. States via the data attribute: `.root[data-status="stale"] .indicator { … }`.
- A short comment above each rule saying what it does.
- If anything moves, add `@media (prefers-reduced-motion: reduce)`.

**Done when** every state looks like its Figma variant.

### 4c. Storybook: `<Name>.stories.tsx`

- `title` = `"<Category>/<Name>"`, for example `"Status/DeviceCommunicationStatus"`.
- `argTypes` with a `select` control listing every state, so you can switch states in the Controls panel.
- One story per state from the spec, named after the state (`Connected`, `Stale`).
- Run `pnpm storybook`, open <http://localhost:6007> and open every story.
- Use the **Controls** panel to try odd values (very long text, negative or huge numbers). It's the quickest way to find cases that look wrong.

What to do when you change something while Storybook runs:

| You change…                                                                            | What to do                                                        | Why                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, or a new `*.stories.tsx` file | Just save                                                         | Storybook reads `ui/src` directly and reloads by itself.       |
| A token                                                                                | In a second terminal: `pnpm --filter @detriz-sh-kit/tokens build` | Storybook reads the built `tokens.css`, which must be rebuilt. |
| `.storybook/main.ts`, `.storybook/preview.ts` or a `package.json`                      | Stop with `Ctrl + C`, run `pnpm storybook` again                  | Settings are only read at start.                               |

**Done when** every state from the spec has a story and each one looks like Figma.

## Step 5. Check and ship

| Check            | How                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Types            | `pnpm --filter @detriz-sh-kit/ui typecheck`                                                          |
| Build            | `pnpm build`                                                                                         |
| Formatting       | `pnpm format:check`                                                                                  |
| Looks like Figma | Story next to the Figma screenshot. The AI can compare them with the Figma MCP and the Chrome tools. |
| Accessibility    | Contrast, works in greyscale, screen reader announces the state.                                     |
| Domain words     | Labels, props and type names still match the glossary.                                               |

Then:

1. **Update the spec.** Remove answered open questions, fix anything that changed while building.
2. **Code Connect** (optional): link the Figma component to the React file, so Dev Mode shows the real code.
3. **Commit:** `feat(ui): add <Name>`. Never commit `dist/`, `storybook-static/`, `.turbo/` or `node_modules/`.
4. **Open the PR** and link the issue.
5. **Publish the Figma library** after the merge.

## Rules for agents

An AI agent working on a component follows these rules on top of the steps above.

- **Follow the order.** Don't write code before the spec exists and the step 3 review says PASS.
- **The spec is the source of truth for behaviour, Figma for looks.** If they disagree, stop and ask. Don't pick one.
- **Never invent a token.** If a Figma value has no `--shk-…` token, stop and list what's missing.
- **Never invent a domain word.** If a needed term isn't in the Ubiquitous Language, stop and ask.
- **Stay in the component folder,** plus `src/index.ts` (and `src/types/` or `src/utils/` when shared). Don't edit tokens, other components or config unless asked.
- **Keep the import chain:** `types ← utils ← hooks ← components`, `icons ← components`. Nothing imports from `platform/`.
- **After each sub-step (4a, 4b, 4c), run typecheck** and report what was done and what's next.
- **Keep the `.md` up to date** when something changes while building.

## Checklist

- [ ] Issue and `<issue>-short-name` branch
- [ ] `<Name>.md` with purpose, domain context, states, anatomy, API
- [ ] Figma component set: one variant per state, layers named like the anatomy, only variables
- [ ] Missing tokens added and committed separately
- [ ] AI review: PASS, with a token map
- [ ] `<Name>.types.ts` and `<Name>.tsx`, semantic HTML, props only
- [ ] Exported from the folder `index.ts` and `src/index.ts`
- [ ] `<Name>.module.css`: tokens only, inside `@layer detriz`
- [ ] `<Name>.stories.tsx`: one story per state
- [ ] typecheck, build and format pass; matches Figma; accessibility checked
- [ ] Spec updated, PR opened

## When something goes wrong

Read the **first** error in the terminal, not the last: later errors are often caused by the first one.

| Problem                                                                | Likely cause                                                                        | Fix                                                                                                                                              |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `command not found: pnpm`                                              | pnpm isn't set up on this computer                                                  | Run `corepack enable` once.                                                                                                                      |
| Component has no colour, font or spacing                               | `tokens.css` wasn't built                                                           | `pnpm --filter @detriz-sh-kit/tokens build`. Check that `kit/apps/storybook/.storybook/preview.ts` imports `@detriz-sh-kit/tokens/tokens.css`.   |
| Changed a token, nothing changed                                       | Tokens weren't rebuilt                                                              | `pnpm --filter @detriz-sh-kit/tokens build`                                                                                                      |
| Token build fails with `Some token references (1) could not be found.` | A `{…}` reference has a typo or points at a token that doesn't exist                | Run the build with `--verbose` to see which one, then fix the name.                                                                              |
| Token build fails with `Unexpected token` or `JSON`                    | A missing or extra comma or quote in a `.json` file                                 | Open the file and line from the message.                                                                                                         |
| Component has no styles at all, but tokens work                        | The class in the CSS doesn't match `styles.…` in the component                      | Make them identical (`.root` ↔ `styles.root`).                                                                                                   |
| New component isn't in the Storybook sidebar                           | The file isn't named `*.stories.tsx`, it has an error, or Storybook needs a restart | Check the name and the terminal, then restart `pnpm storybook`.                                                                                  |
| `Module '"@detriz-sh-kit/ui"' has no exported member '<Name>'`         | Not exported from `src/index.ts`, or `ui` not rebuilt                               | Add the export, then `pnpm --filter @detriz-sh-kit/ui build`.                                                                                    |
| `Port 6007 is already in use`                                          | Storybook is already running in another terminal                                    | Use that one, or stop it with `Ctrl + C`.                                                                                                        |
| `Invalid hook call`                                                    | Two copies of React                                                                 | In `ui`, React must be a `peerDependency` (and `devDependency`), never a normal `dependency`.                                                    |
| `ERR_PNPM_IGNORED_BUILDS` after adding a package                       | pnpm 11 blocks install scripts of new packages                                      | Only if you trust it: `pnpm approve-builds <package>`.                                                                                           |
| A just-released package version won't install (`minimumReleaseAge`)    | pnpm 11 won't install versions published in the last day                            | Use the previous version, or wait a day.                                                                                                         |
| Build result looks old and nothing explains it                         | Turborepo cache                                                                     | `pnpm build --force`                                                                                                                             |
| Strange errors after switching branches or upgrading                   | `node_modules` out of date                                                          | `pnpm install`. If that doesn't help, start fresh: `rm -rf node_modules kit/*/*/node_modules kit/*/*/dist .turbo kit/*/*/.turbo && pnpm install` |
| `git status` shows `dist/`, `node_modules/` or `.turbo/`               | `.gitignore` is missing or changed                                                  | Check the root `.gitignore`. Never commit those folders.                                                                                         |
