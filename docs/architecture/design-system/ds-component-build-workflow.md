# Component build workflow

The order to design and build a new UI component, from the first idea to a merged PR. Each step says what to do, which file it produces, and when it is done.

`DevicePairingStatus` is the worked example throughout.

## Read first

- [Ubiquitous Language](/docs/architecture/domain-model/ubiquitous-language.md): the words you must use in props, labels and docs.
- [Relationship and cardinality](/docs/architecture/domain-model/relationship-and-cardinality.md)
- [Device lifecyc
- le](/docs/architecture/domain-model/device-lifecycle.md)
- [UI component conventions](ui-component-conventions.md): folders and the import chain.
- [Frontend conventions](/docs/architecture/frontend/frontend-conventions.md): naming rules.
- [Figma → code handoff](figma-code-handoff.md): how tokens move from Figma into the repo.
- [Tokens](/kit/packages/tokens/dist/tokens.css): every `--shk-…` variable you can use (run the tokens build first).

## Table of contents

[The order at a glance](#the-order-at-a-glance)

[Phase 1. Define](#phase-1-define)

[Phase 2. Design](#phase-2-design)

[Phase 3. Hand the design to Claude](#phase-3-hand-the-design-to-claude)

[Phase 4. Build, file by file](#phase-4-build-file-by-file)

[Phase 5. Check and ship](#phase-5-check-and-ship)

[Checklist](#checklist)



| # | Step | Output | Done when |
| --- | --- | --- | --- |
| 1 | Issue and branch | GitHub issue, `<issue>-short-name` branch | The issue says what problem the component solves. |
| 2 | Write the spec | `<Name>.md` | States, props and tokens are listed, open questions answered. |
| 3 | Design in Figma | Figma component with one variant per state | Every state exists and every value is a variable. |
| 4 | Add missing tokens | `figma/` export → `src/` → `tokens.css` | Every token named in the spec exists in `tokens.css`. |
| 5 | Show the design to Claude | Figma link (MCP) | Claude can read the frame, its variables and a screenshot. |
| 6 | Types | `src/types/*.ts`, `<Name>.types.ts` | Props compile with no component yet. |
| 7 | Utils, icons, hooks (only if needed) | files in `utils/`, `icons/`, `hooks/` | Each one is small and imports only from below it. |
| 8 | Mock props | `<Name>.mock.ts` | One example props object per state. |
| 9 | Component | `<Name>.tsx` | Semantic HTML, no styles yet. |
| 10 | Stories | `<Name>.stories.tsx` | Every state shows in Storybook (unstyled is fine). |
| 11 | Styles | `<Name>.module.css` | Looks like Figma, tokens only. |
| 12 | Exports | `index.ts` in the folder + `src/index.ts` | `import { Name } from '@detriz-sh-kit/ui'` works. |
| 13 | Check | typecheck, build, a11y, visual compare | All checks pass. |
| 14 | Link and ship | Code Connect, updated `.md`, PR | PR is reviewed and merged. |

Steps 2 and 3 go back and forth: drawing in Figma often shows a missing state or prop. Update the `.md` when that happens, so it stays the source of truth for **behaviour**, while Figma stays the source of truth for **looks**.

## Phase 1. Define

### Step 1. Issue and branch

- Open a GitHub issue: one sentence on the problem, the Device or Metric it is about, and where it will be used.
- Create the branch: `git switch -c <issue-number>-short-name`.

### Step 2. Write the spec: `<Name>.md`

Start here, before Figma. Writing forces you to decide what the component **is** and, just as important, what it **isn't**. It is also the best brief you can give Claude later.

Create the folder and the file: `kit/packages/ui/src/components/<group>/<Name>/<Name>.md`.

Sections, in this order (copy them from [`DevicePairingStatus.md`](/kit/packages/ui/src/components/status/DeviceParingStatus/DevicePairingStatus.md)):

| Section | What to write |
| --- | --- |
| Intro | One sentence: what it shows, for whom. Links to the domain docs it is based on. |
| What it shows | The domain values it displays, with their meaning, copied from the glossary. |
| What it doesn't show | Neighbouring fields and actions that belong somewhere else, and why. |
| States | A table: state, prop value, tone, icon, label, and which target state it is (loading, Connected, Stale, Disconnected, Fault). Say which target states don't apply. |
| Lifecycle | How the app moves it between states (a Mermaid state diagram). |
| Anatomy | An ASCII sketch with numbered parts. Use the same part names as the Figma layers. |
| Props | The `<Name>Props` interface with a `/** */` comment on each prop. Say which types are shared (`src/types/`). |
| Tokens | Which `--shk-…` token each part uses, per state. Mark tokens that don't exist yet. |
| Accessibility | Role, live region, keyboard, contrast, reduced motion, "not colour alone". |
| Usage | A code example, plus Do and Don't. |
| Stories | One story per state, plus an overview story. |
| Files | The file tree this component will add. |
| Open questions | Anything you haven't decided yet. |

**Done when** the open questions that change props or states are answered. Questions about copy or sizes can stay open until the design step.

Tip: ask Claude to review the spec against the glossary and the lifecycle doc before you open Figma. It is cheap to fix a wrong word now and expensive later.

## Phase 2. Design

### Step 3. Design the component in Figma

Build it as a real Figma **component set**, not a loose frame. The way you structure it decides how well Claude can read it in step 5.

- **One variant per state**, with the variant property named like the prop: `status=unpaired`, `status=pairing`, `status=paired`. Same lowercase values as the TypeScript type.
- **Layer names = anatomy part names** from the spec: `container`, `icon`, `label`. Not `Frame 12`.
- **Only variables, never raw values.** Every fill, stroke, gap, padding and radius is bound to a `semantic` (or `component`) variable. If a value has no variable, write it down: that's step 4.
- **Auto layout everywhere**, so gap and padding are real values Claude can read.
- **Component description**: paste one sentence from the spec and the path to the `.md`.
- If the design changes a state, prop or token, update the `.md` now.

**Done when** every state from the spec table exists as a variant and nothing uses a raw value.

### Step 4. Add missing tokens

Only if step 3 needed variables that don't exist yet. Follow [Figma → code handoff → Workflow: changing a token](figma-code-handoff.md#workflow-changing-a-token):

1. Create the variable in Figma (in the `semantic` collection, named like `status/progress/bg`).
2. Export it into `kit/packages/tokens/figma/<layer>/`.
3. `pnpm --filter @detriz-sh-kit/tokens figma:import`
4. `pnpm --filter @detriz-sh-kit/tokens build`
5. Check the new `--shk-…` name in `dist/tokens.css` matches the Tokens table in the spec.

Commit tokens separately (`feat(tokens): …`), so the component commit only contains the component.

## Phase 3. Hand the design to Claude

Claude can't see your Figma file unless you give it a way in. Three options, best first.

### Option A. Figma MCP (recommended)

The Figma MCP server lets Claude read a Figma node directly: its structure, the variables it uses, and a screenshot. The Figma plugin is already installed in this Claude Code setup; it only needs a one-time login.

One-time setup:

1. In Claude Code, type `/mcp`, pick **figma** and log in with your Figma account.
2. That's it. Run `/mcp` again later to check it says "connected".

Each time you want Claude to work from a design:

1. In Figma, select the **component set** (not the whole page).
2. Right-click → **Copy/Paste as → Copy link to selection**. The link contains `node-id=…`, which points Claude to exactly that node.
3. Paste it into Claude with the spec, for example:

   > Build `DevicePairingStatus` from this Figma component: `<link>`. Follow `DeviceParingStatus.md` and the build workflow. Map every Figma variable to its `--shk-…` token and tell me if one is missing.

What Claude does with it:

| MCP tool | What it gives Claude |
| --- | --- |
| `get_design_context` | The layer tree, layout, sizes and suggested code for the node. |
| `get_variable_defs` | The variables the node uses, e.g. `status/progress/bg`, so Claude writes `var(--shk-status-progress-bg)` instead of guessing a hex value. |
| `get_screenshot` | A picture of the node, to compare with Storybook later. |
| Code Connect | Links the Figma component to the React file after it's built (step 14). |

This is why step 3 matters: if layers are named after the anatomy and values are variables, the MCP output maps almost one-to-one onto the spec. A frame full of `Frame 12` and raw hex values gives Claude much less to work with.

### Option B. Screenshot

Paste or drag a screenshot of each variant into the chat. It works with no setup, but Claude only sees pixels: it has to guess spacing and colours, and it can't know variable names. Use it for quick questions ("does this look right?"), not for building.

### Option C. Spec only

Claude builds from the `.md` alone. This works for very small components because the spec already lists tokens, anatomy and states, but the result won't match Figma exactly. Compare and adjust in step 13.

**Rule for any option:** Claude never invents a token. If something in the design has no `--shk-…` token, it stops and asks, and you go back to step 4.

## Phase 4. Build, file by file

Build in the order of the import chain from [UI component conventions](ui-component-conventions.md#how-components-use-other-direcctories): `types ← utils ← hooks ← components`, and `icons ← components`. Each file then only depends on files you've already written.

### Step 6. Types

- **Shared types** go in `src/types/` if another component will need them. `PairingStatus` goes in `src/types/device.ts`, because cards and lists will use it too.
- **Component props** go in `<Name>.types.ts`: the `<Name>Props` interface, with a `/** */` comment on every prop, copied from the spec.

**Done when** `pnpm --filter @detriz-sh-kit/ui typecheck` passes. You can check types before any component exists.

### Step 7. Utils, icons and hooks (only if needed)

Skip any of these the component doesn't need. Keep each one in the component folder if only this component uses it; move it to the shared folder when a second one does.

| Folder | Add when | Example |
| --- | --- | --- |
| `utils/` | A value is formatted or calculated | `formatTimeAgo` |
| `icons/` | The spec's anatomy has an icon | `IconCheck`, `IconSpinner` (with `size`, `className`, `currentColor`, `aria-hidden`) |
| `hooks/` | There is UI behaviour (timers, media queries) | `useReducedMotion` |

Icons: export the SVG from Figma, or ask Claude to read it through the MCP, then turn it into a component.

### Step 8. Mock props: `<Name>.mock.ts`

One example props object per state, typed with `<Name>Props`:

```ts
export const unpaired: DevicePairingStatusProps = { status: 'unpaired' };
export const pairing: DevicePairingStatusProps = { status: 'pairing' };
export const paired: DevicePairingStatusProps = { status: 'paired' };
```

Stories and tests both import these, so every example lives in one place.

### Step 9. Component: `<Name>.tsx`

- Markup only: semantic HTML, roles and ARIA from the Accessibility section, class names from the anatomy (`styles.container`, `styles.icon`, `styles.label`).
- Props only. No `fetch`, no app state.
- Don't style yet. An empty `<Name>.module.css` is enough for the import to work.

### Step 10. Stories: `<Name>.stories.tsx`

Write the stories **before** the CSS. You then style with every state open in Storybook, instead of checking one state at a time.

- One story per row of the spec's Stories table, using the mocks from step 8.
- An overview story (`AllStatuses`) that shows every state side by side, like the Figma component set.
- Run `pnpm storybook` and keep it open.

### Step 11. Styles: `<Name>.module.css`

- Everything inside `@layer detriz`.
- Only `var(--shk-…)` tokens, taken from the spec's Tokens table (or from the MCP's variable list).
- Use data attributes or classes per state (`[data-status='pairing']`), not inline styles.
- Add `@media (prefers-reduced-motion: reduce)` if anything moves.

**Done when** every story looks like its Figma variant.

### Step 12. Exports

- `index.ts` in the component folder: export the component and its types.
- `src/index.ts`: export the component, `<Name>Props` and any shared type (`PairingStatus`). Only what this file exports is public.

### Later: tests in `<Name>.test.tsx`

There is no test runner yet. When there is one, test what the spec promises: the right label and `role` for each mock, `aria-busy` while loading. Leave the file out until then.

## Phase 5. Check and ship

### Step 13. Check

| Check | How |
| --- | --- |
| Types | `pnpm --filter @detriz-sh-kit/ui typecheck` |
| Build | `pnpm build` |
| Formatting | `pnpm format:check` |
| Looks like Figma | Put the Storybook story next to the Figma screenshot. Claude can do this with the Figma MCP (`get_screenshot`) and the Chrome browser tools (screenshot of Storybook). |
| Accessibility | Contrast of every `fg` on `bg`, screen reader announces state changes, works in greyscale, reduced motion respected. |
| Domain words | Labels, prop values and type names match the glossary. |

### Step 14. Link and ship

1. **Code Connect.** Link the Figma component to the React file, so Dev Mode shows `<DevicePairingStatus status="paired" />` instead of generated CSS. Ask Claude: "set up Code Connect for this component".
2. **Update the spec.** Remove answered open questions and fix anything that changed while building.
3. **Commit** with a scoped message: `feat(ui): add DevicePairingStatus`. Never commit `dist/`, `storybook-static/`, `.turbo/` or `node_modules/`.
4. **Open the PR** and link the issue.
5. **Publish the Figma library** after the merge, so design and code change together.

## Checklist

- [ ] Issue and `<issue>-short-name` branch
- [ ] `<Name>.md` written, props and states decided
- [ ] Figma component set: one variant per state, layers named like the anatomy, only variables
- [ ] Missing tokens added through Figma → `figma:import` → `build`
- [ ] Figma link given to Claude through the MCP
- [ ] Shared types in `src/types/`, props in `<Name>.types.ts`
- [ ] Utils, icons, hooks only where needed
- [ ] `<Name>.mock.ts` with one example per state
- [ ] `<Name>.tsx` with semantic HTML and ARIA
- [ ] `<Name>.stories.tsx` with one story per state plus an overview
- [ ] `<Name>.module.css` with tokens only, inside `@layer detriz`
- [ ] Exported from the folder `index.ts` and `src/index.ts`
- [ ] typecheck, build and format pass; matches Figma; accessibility checked
- [ ] Code Connect linked, spec updated, PR opened
