# Component building workflow

How a new UI component goes from an idea to a merged PR. People and AI agents follow the same steps in the same order.

Every component **starts with a Markdown file**. The `.md` file decides what the component does. Figma decides how it looks. The code follows both.

```
0. Issue → 1. Spec → 1b. Building blocks → 2. Figma → 2b. Self-check → 3. Review → 4. Build: TSX → CSS → Storybook → 5. Ship
              ↑                               ↑                           │
              └────── behaviour change ───────┴─────── look change ───────┘   (the review sends you back until it passes)
```

Steps **1b** and **2b** are short checks you (or the AI) run alone, before asking for a review. They catch missing tokens, missing icons and small Figma mistakes early, so the review in step 3 can focus on domain words and naming.

Worked examples in the repo: [`DeviceConnectionStatus`](/kit/packages/ui/src/components/status/DeviceConnectionStatus/) (Status) and [`LocationPath`](/kit/packages/ui/src/components/context/LocationPath/) (Context).

## Contents

- [Read first](#read-first)
- [The order at a glance](#the-order-at-a-glance)
- [Step 0. Issue and branch](#step-0-issue-and-branch)
- [Step 1. Write the spec](#step-1-write-the-spec-namemd)
- [Step 1b. Check the building blocks](#step-1b-check-the-building-blocks)
- [Step 2. Design in Figma](#step-2-design-in-figma)
- [Step 2b. Figma self-check](#step-2b-figma-self-check)
- [Step 3. Review the design with AI](#step-3-review-the-design-with-ai)
- [Step 4. Build](#step-4-build)
- [Step 5. Check and ship](#step-5-check-and-ship)
- [Rules for agents](#rules-for-agents)
- [Words used in this workflow](#words-used-in-this-workflow)
- [Checklist](#checklist)
- [When something goes wrong](#when-something-goes-wrong)

## Read first

| Doc                                                                                           | Why                                                            |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx)                                | The only words allowed in props, labels, type names and docs.  |
| [Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx)                | Which statuses exist and how a Device moves between them.      |
| [Data model](/kit/apps/docs-site/docs/domain-model/data-model.mdx)                            | How Site, Space, Hub, Module, Sensor relate.                   |
| [Conventions and structure](/docs/architecture/design-system/ds-conventions-and-structure.md) | Naming rules, folders, the import chain, component categories. |
| [Figma variables → code](figma-variables-code-handoff.md)                                     | How a Figma variable becomes a `--shk-…` token.                |
| [Add an icon](add-icon-to-design-system-workflow.md)                                          | How icons get into the `Icon` component.                       |

## The order at a glance

| #   | Step             | Output                                               | Done when                                                    |
| --- | ---------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| 0   | Issue and branch | GitHub issue, `<issue>-short-name` branch            | The issue says what problem the component solves.            |
| 1   | Spec             | `<Name>.md` with a visual idea                       | Required sections are filled, including Visual idea.         |
| 1b  | Building blocks  | Missing tokens and icons added and committed         | Every token and icon the spec needs exists.                  |
| 2   | Figma            | Component set, one variant per state or variant      | Every state or variant exists and every value is a variable. |
| 2b  | Self-check       | Self-check list, all ticked                          | The self-check finds nothing.                                |
| 3   | Review (AI)      | Review report with a "Blocks" column and a token map | PASS, or PASS with minor fixes.                              |
| 4a  | TSX              | `<Name>.types.ts`, `<Name>.tsx`, `index.ts`          | The component renders every state, typecheck passes.         |
| 4b  | CSS              | `<Name>.module.css`                                  | Every state looks like its Figma variant, tokens only.       |
| 4c  | Storybook        | `<Name>.stories.tsx`                                 | One story per state or variant, plus the two stress stories. |
| 5   | Check and ship   | Passing checks, updated `.md`, PR                    | No open fixes from the review. PR is reviewed and merged.    |

Steps 1 and 2 go back and forth: drawing in Figma often shows a missing state or prop. When that happens, update the `.md` first, so it stays the source of truth.

## Step 0. Issue and branch

- Open a GitHub issue: one sentence on the problem, the Device or Metric it is about, and where it will be used.
- Create the branch: `git switch -c <issue-number>-short-name`.
- Start the AI session with the **kickoff prompt** (recommended), so the AI knows the component, the step and the goal from the first message:

> We're building `<Name>` (issue #<n>, category `<category>`). We're at step `<step>` of `docs/architecture/design-system/workflows/component-building.md`. Goal for this session: `<one sentence>`.

## Step 1. Write the spec: `<Name>.md`

Start here, before Figma. Writing makes you decide what the component **is** and what it **isn't**. The same file is the brief you give the AI in every later step.

### Pick the name and the folder

1. **Category.** Pick one from [Components categorisation](/docs/architecture/design-system/ds-conventions-and-structure.md#3-components-categorisation) by the question it answers: Context, Readings, History, Comparison, Status, Feedback, Controls or Layout. The folder name is the category in lowercase.
2. **Name.** PascalCase, built from domain words: `DeviceConnectionStatus`, not `OnlineBadge`.
3. **Create the file:** `kit/packages/ui/src/components/<category>/<Name>/<Name>.md`.

### Sections to write

Write the ones marked **required** before you open Figma. Fill the rest as you go.

| Section              | What to write                                                                                                                                                                                       |             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Purpose              | One or two sentences: what it shows, for whom, where it is used.                                                                                                                                    | required    |
| Domain model context | Which domain terms it shows, copied from the glossary, with links. What it does **not** show and why (neighbouring fields belong to other components).                                              | required    |
| Visual idea          | How it roughly looks: icons, separators, layouts, sizes. See below.                                                                                                                                 | required    |
| States or variants   | What changes between versions of the component. The table depends on the category, see below.                                                                                                       | required    |
| Anatomy              | A list or ASCII sketch of the parts: `root`, `label`, `indicator`… These names become Figma layer names and CSS class names.                                                                        | required    |
| API                  | The props: name, type, required or not, one line each. Once `<Name>.types.ts` exists, it replaces this section (see the [user docs workflow](./component-documentation.md#one-home-for-each-fact)). | required    |
| Example values       | Realistic values from the glossary examples, used in Figma and in the stories. See below.                                                                                                           | required    |
| Tokens               | Which `--shk-…` token each part uses, per state. Mark the ones that don't exist yet.                                                                                                                | after Figma |
| Accessibility        | Role, live region, contrast, "not colour alone", reduced motion.                                                                                                                                    | after Figma |
| Open questions       | Anything not decided yet.                                                                                                                                                                           | any time    |

#### Visual idea

Three to five lines that answer these questions, plus a sketch or a reference screenshot if you have one:

| Question                        | Example (LocationPath)                  |
| ------------------------------- | --------------------------------------- |
| What does it roughly look like? | A breadcrumb, or a link to a sketch     |
| Icons?                          | Yes, one per part (Site, Space, Device) |
| Separators between parts?       | No `›`: the icons separate the parts    |
| More than one layout?           | Yes: `inline`, `stacked`, `grid`        |
| Text and icon size              | Caption text, 16px icons                |

If the look changes while you draw in Figma, update this section first.

#### States or variants

What varies depends on the category:

| Category                    | Fill this table                                                                  | Target states (loading, Connected, Stale, Disconnected, Fault) |
| --------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Status, Readings, History   | **States:** state, prop value, label, colour role, icon                          | Required. Say which ones don't apply and why.                  |
| Controls                    | **States**, plus interaction states (hover, focus, pressed, disabled)            | Required.                                                      |
| Context, Layout, Comparison | **Variants:** variant prop, its values, which parts show (a "Parts shown" table) | One line on why they don't apply, or which ones do.            |
| Feedback                    | **Variants:** info, success, warning, error                                      | Usually Fault only.                                            |

`DeviceConnectionStatus.md` is the example for a States table, `LocationPath.md` for a Variants table.

#### Example values

Use values from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) examples, like "Level 2" or "Climate Module". Never placeholders like "2" or "Site name". List them in the spec once; Figma's sample text and the stories use the same values.

**Done when** all required sections are filled and no open question changes a prop or a state.

## Step 1b. Check the building blocks

Five minutes, right after the spec and before Figma, so Figma never uses something that doesn't exist yet.

Ask the AI: _"Building blocks check for `<Name>`."_ It reads the spec and answers:

```
Tokens:
| Needed for | Token | Exists in tokens.css? |

Icons:
| Icon | In icons.config.ts? | Size | Size supported? |
```

| Missing      | What to do                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| A token      | Add it via [Figma variables → code](figma-variables-code-handoff.md#workflow-changing-a-token). Commit on its own: `feat(tokens): …`. |
| An icon      | Follow [Add an icon](add-icon-to-design-system-workflow.md). Commit on its own: `feat(ui): add <icon> icon`.                          |
| An icon size | Sizes today: `xs` 16, `sm` 20, `md` 24, `lg` 32 (`Icon.types.ts`). Adding a size is a design decision: the designer chooses.          |

**Done when** every token and icon the spec needs exists and is committed.

## Step 2. Design in Figma

Build a real **component set**, not a loose frame. How you build it decides how much the AI can read from it in steps 2b, 3 and 4.

| Rule                                                                                                                  | Example                                        |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Component name = the name in the spec                                                                                 | `DeviceConnectionStatus`                       |
| One variant per state or variant. Property named like the prop, values exactly like the TypeScript values (lowercase) | `status=connecting`, `layout=stacked`          |
| Layer names = anatomy part names from the spec                                                                        | `root`, `label`, `indicator`, never `Frame 12` |
| Only variables, never raw values: every fill, stroke, gap, padding, radius and text style                             | `status/success/solid`, `space/1`              |
| Auto layout everywhere                                                                                                | So gap and padding are real values.            |
| Sample text = the spec's example values                                                                               | "Level 2", not "2"                             |
| Component description: one sentence from the spec and the path to the `.md`                                           | See [Words used](#words-used-in-this-workflow) |

If you find you need a new value after all, go back to step 1b for it.

**Done when** every state or variant in the spec exists in the component set and nothing uses a raw value.

## Step 2b. Figma self-check

Before asking for a review, run through this list:

- [ ] Every boolean property is linked to the right layer (toggle each one and look).
- [ ] Every text and icon colour is a variable (no raw black).
- [ ] Every frame uses auto layout, and no layer is called `Frame 1`, `Frame 2`.
- [ ] Layer names match the spec's anatomy.
- [ ] Sample text uses the spec's example values.
- [ ] The component **set** has a description: select the purple frame → component section in the right panel → pencil icon → Description.

The AI can run the whole list with the Figma MCP in one go. Copy the link to the component set (see step 3) and ask: _"Self-check `<Name>` in Figma before review."_ It answers with the list, ticked or not, and names the layer for every problem.

**Done when** everything is ticked.

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
| Domain words  | Component name, prop names, prop values and labels use [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) terms exactly. No synonyms ("online" for Connected, "device" for a Sensor).                                        |
| Domain rules  | States match the lifecycle docs. Device Status fields stay separate: Pairing Status, Connection Status and Fault are never mixed in one prop.                                                                                            |
| Naming        | Follows the [naming table](/docs/architecture/design-system/ds-conventions-and-structure.md#1-naming-convention): PascalCase component, lowercase union values, `is/has` booleans, `on<Event>` handlers, unit suffixes (`temperatureC`). |
| Spec ↔ Figma  | Every state or variant in the spec is in Figma, and the other way round. Variant property and values match the prop and its values. Layer names match the anatomy. The look matches the spec's Visual idea.                              |
| Tokens        | Every value is bound to a variable. Every variable maps to an existing `--shk-…` token in `kit/packages/tokens/dist/tokens.css`.                                                                                                         |
| Figma → HTML  | Frames that only exist for layout and won't become elements (see [Figma structure is not HTML](#figma-structure-is-not-html)).                                                                                                           |
| Category      | The folder matches the category rules (Status vs Feedback, Context vs Status, clickable means Controls).                                                                                                                                 |
| Accessibility | Status is not shown by colour alone. Text contrast is enough.                                                                                                                                                                            |

### The review report

The AI answers in this shape:

```
Result: PASS | PASS with minor fixes | FIX NEEDED

Fixes (only if not PASS):
| # | Where (spec / Figma / tokens) | Problem | Suggested fix | Rule | Blocks |

Token map:
| Figma variable | --shk- token | exists? |
```

`Blocks` says which step a fix must be done before: `spec`, `4a` (types and TSX), `4b` (CSS) or `ship` (the PR).

| Result                    | Means                                  | Next                                                   |
| ------------------------- | -------------------------------------- | ------------------------------------------------------ |
| **PASS**                  | Nothing to fix                         | Go to step 4.                                          |
| **PASS with minor fixes** | Only fixes that block `4b` or `ship`   | Start 4a now. Fix the rest before the step they block. |
| **FIX NEEDED**            | At least one fix blocks `spec` or `4a` | Fix the spec or Figma, then ask for a re-check.        |

A **re-check** is not a full review. The AI checks only the open fixes from the last report and says which are done. It reports a new problem only if a fix caused it.

The token map is the input for the CSS step.

## Step 4. Build

Three files, in this order. Each one depends on the one before it.

### 4a. TSX: types, data, markup

**Types: `<Name>.types.ts`.** Copied from the spec's API section.

- The union type for the states or variants, with lowercase values that match the Figma variant values.
- The `<Name>Props` interface with a `/** */` comment on every prop.
- If a second component needs a type, move it to `src/types/`.

```ts
/** Can we reach this Device right now? Only Paired Devices have one. */
export type ConnectionStatus =
  "connecting" | "connected" | "stale" | "disconnected";

export interface DeviceConnectionStatusProps {
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

export function DeviceConnectionStatus({
  status,
}: DeviceConnectionStatusProps) {
  return (
    <span role="status" data-status={status} className={styles.root}>
      <span className={styles.label}>{LABELS[status]}</span>
      <span className={styles.indicator} />
    </span>
  );
}
```

#### Figma structure is not HTML

Figma needs wrapper frames to lay things out. HTML often doesn't.

| In Figma                                   | In code                                                         |
| ------------------------------------------ | --------------------------------------------------------------- |
| A `row` frame that groups items for layout | Usually no element. Use CSS grid or flex on the parent.         |
| A frame inside a list (`ul` / `ol`)        | Not allowed: a list may only hold `li`. Move the layout to CSS. |
| A boolean property that hides a layer      | An optional prop: the part isn't rendered when it's off.        |
| A layer that is only there for spacing     | CSS `gap` or padding.                                           |

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

- `title` = `"<Category>/<Name>"`, for example `"Status/DeviceConnectionStatus"`.
- `argTypes` with a `select` control listing every state or variant, so you can switch them in the Controls panel.
- One story per state or variant from the spec, named after it (`Connected`, `Stale`, `Stacked`).
- Two **stress stories**, always:

| Story      | What it shows                                                    |
| ---------- | ---------------------------------------------------------------- |
| `LongText` | The longest realistic values in a narrow container (e.g. 240px). |
| `Minimal`  | The smallest case: one part, or no data.                         |

- Run `pnpm storybook`, open <http://localhost:6007> and open every story.
- Use the **Controls** panel to try odd values (very long text, negative or huge numbers). It's the quickest way to find cases that look wrong.
- When the AI checks the stories, it takes **screenshots** with the Chrome tools rather than reading the page with scripts.

`pnpm storybook` runs through Turbo, which doesn't pass extra flags on. To add a flag like `--no-open`, run Storybook directly: `pnpm --filter storybook dev --no-open`.

What to do when you change something while Storybook runs:

| You change…                                                                            | What to do                                                        | Why                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, or a new `*.stories.tsx` file | Just save                                                         | Storybook reads `ui/src` directly and reloads by itself.       |
| A token                                                                                | In a second terminal: `pnpm --filter @detriz-sh-kit/tokens build` | Storybook reads the built `tokens.css`, which must be rebuilt. |
| `.storybook/main.ts`, `.storybook/preview.ts` or a `package.json`                      | Stop with `Ctrl + C`, run `pnpm storybook` again                  | Settings are only read at start.                               |

**Done when** every state or variant has a story, the two stress stories exist, and each one looks like Figma.

## Step 5. Check and ship

| Check            | How                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Types            | `pnpm --filter @detriz-sh-kit/ui typecheck`                                                          |
| Build            | `pnpm build`                                                                                         |
| Formatting       | `pnpm prettier --check kit/packages/ui/src/components/<category>/<Name>` (only your files)           |
| Looks like Figma | Story next to the Figma screenshot. The AI can compare them with the Figma MCP and the Chrome tools. |
| Accessibility    | Contrast, works in greyscale, screen reader announces the state.                                     |
| Domain words     | Labels, props and type names still match the glossary.                                               |
| Review fixes     | Every fix from step 3 is done, including the ones marked `ship`.                                     |

Then:

1. **Update the spec.** Remove answered open questions, fix anything that changed while building.
2. **Write the user docs page** with the [user docs workflow](./component-documentation.md). It also tells you how to slim down the spec's API section once the types exist.
3. **Code Connect** (optional): link the Figma component to the React file, so Dev Mode shows the real code.
4. **Commit:** `feat(ui): add <Name>`. Tokens and icons are already in their own commits from step 1b. Never commit `dist/`, `storybook-static/`, `.turbo/` or `node_modules/`.
5. **Open the PR** and link the issue.
6. **Publish the Figma library** after the merge.
7. **Short retro** (optional, 10 minutes): what took more than one round? Does the workflow need a change? Write it in `docs/retro/`.

## Rules for agents

An AI agent working on a component follows these rules on top of the steps above.

- **Follow the order.** Don't write code before the spec exists and the step 3 review says PASS or PASS with minor fixes.
- **The spec is the source of truth for behaviour, Figma for looks.** If they disagree, stop and ask. Don't pick one.
- **Never invent a token.** If a Figma value has no `--shk-…` token, stop and list what's missing.
- **Never invent a domain word.** If a needed term isn't in the Ubiquitous Language, stop and ask.
- **Run the self-check first.** When asked for a step 3 review and step 2b wasn't run, run 2b and report it on its own before reviewing.
- **Re-checks only check open fixes.**
- **Look decisions belong to the designer.** When something is about how it looks (size, spacing, icon, colour), give two or three options with a one-line trade-off each. Don't pick the "nothing new to add" option by default.
- **Ask when a request can mean two things.** One question is cheaper than a wrong round.
- **Explain with an example from the current component**, not with a definition. "A separator is the `›` between `Home` and `Level 2`" beats "a visual divider between items".
- **Stay in the component folder,** plus `src/index.ts` (and `src/types/` or `src/utils/` when shared). Don't edit tokens, other components or config unless asked, or unless step 1b says something is missing.
- **Keep the import chain:** `types ← utils ← hooks ← components`, `icons ← components`. Nothing imports from `platform/`.
- **After each sub-step (4a, 4b, 4c), run typecheck** and report what was done and what's next.
- **Keep the `.md` up to date** when something changes while building.

## Words used in this workflow

| Word                  | Means                                                                   | Example                                                    |
| --------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| Component set         | The purple dashed frame in Figma that holds all variants of a component | `LocationPath` with `layout=inline`, `layout=stacked`, …   |
| Variant               | One version of the component, set by a property                         | `status=stale`                                             |
| Boolean property      | An on/off switch in Figma, usually to show or hide a layer              | `site` shows or hides the Site part                        |
| Component description | Text attached to the component set, shown in Figma's Assets panel       | "Shows where a Device is. Spec: `context/LocationPath.md`" |
| Separator             | A mark between items in a row                                           | The `›` in `Home › Level 2 › Kitchen`                      |
| Anatomy               | The named parts of a component                                          | `root`, `part`, `icon`, `label`                            |
| Auto layout           | Figma's flexbox: gap and padding become real values                     | A row with `gap = space/1`                                 |
| Stress story          | A Storybook story with extreme but realistic data                       | A very long Space name in a 240px box                      |

## Checklist

- [ ] Issue and `<issue>-short-name` branch
- [ ] `<Name>.md`: purpose, domain context, visual idea, states or variants, anatomy, API, example values
- [ ] Building blocks check: missing tokens and icons added and committed separately
- [ ] Figma component set: one variant per state or variant, layers named like the anatomy, only variables, real sample text
- [ ] Figma self-check: all ticked
- [ ] AI review: PASS or PASS with minor fixes, with a token map
- [ ] `<Name>.types.ts` and `<Name>.tsx`: semantic HTML, props only, no Figma-only wrapper elements
- [ ] Exported from the folder `index.ts` and `src/index.ts`
- [ ] `<Name>.module.css`: tokens only, inside `@layer detriz`
- [ ] `<Name>.stories.tsx`: one story per state or variant, plus `LongText` and `Minimal`
- [ ] Typecheck, build and format (your files) pass; matches Figma; accessibility checked
- [ ] All review fixes done, including `ship`
- [ ] Spec updated, user docs page written, PR opened

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
| Text collapses to one letter when space is tight                       | Flex items shrink below their content                                               | Use CSS grid, or `min-width` / `flex-shrink: 0` on the part that must stay readable. The `LongText` story shows it.                              |
| New component isn't in the Storybook sidebar                           | The file isn't named `*.stories.tsx`, it has an error, or Storybook needs a restart | Check the name and the terminal, then restart `pnpm storybook`.                                                                                  |
| `pnpm storybook --no-open` (or another flag) fails                     | Turbo doesn't pass extra flags on                                                   | `pnpm --filter storybook dev --no-open`                                                                                                          |
| `pnpm format:check` fails on files you didn't touch                    | Formatting problems elsewhere in the repo                                           | Check only your folder: `pnpm prettier --check <your folder>`.                                                                                   |
| `Module '"@detriz-sh-kit/ui"' has no exported member '<Name>'`         | Not exported from `src/index.ts`, or `ui` not rebuilt                               | Add the export, then `pnpm --filter @detriz-sh-kit/ui build`.                                                                                    |
| `Port 6007 is already in use`                                          | Storybook is already running in another terminal                                    | Use that one, or stop it with `Ctrl + C`.                                                                                                        |
| `Invalid hook call`                                                    | Two copies of React                                                                 | In `ui`, React must be a `peerDependency` (and `devDependency`), never a normal `dependency`.                                                    |
| `ERR_PNPM_IGNORED_BUILDS` after adding a package                       | pnpm 11 blocks install scripts of new packages                                      | Only if you trust it: `pnpm approve-builds <package>`.                                                                                           |
| A just-released package version won't install (`minimumReleaseAge`)    | pnpm 11 won't install versions published in the last day                            | Use the previous version, or wait a day.                                                                                                         |
| Build result looks old and nothing explains it                         | Turborepo cache                                                                     | `pnpm build --force`                                                                                                                             |
| Strange errors after switching branches or upgrading                   | `node_modules` out of date                                                          | `pnpm install`. If that doesn't help, start fresh: `rm -rf node_modules kit/*/*/node_modules kit/*/*/dist .turbo kit/*/*/.turbo && pnpm install` |
| `git status` shows `dist/`, `node_modules/` or `.turbo/`               | `.gitignore` is missing or changed                                                  | Check the root `.gitignore`. Never commit those folders.                                                                                         |
