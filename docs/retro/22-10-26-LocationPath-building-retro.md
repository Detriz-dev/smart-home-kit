# Retro: building LocationPath

Date: 2026-10-22 · Branch: `37-build-locationpath-component` · Process: [Component building workflow](/docs/architecture/design-system/workflows/component-building.md)

A look back at how we built `LocationPath` (the first **Context** component), what worked, what slowed us down, and what to change in the workflow before the next component.

## Contents

- [Summary](#summary)
- [How it went, step by step](#how-it-went-step-by-step)
- [What went well](#what-went-well)
- [What slowed us down](#what-slowed-us-down)
- [Root causes](#root-causes)
- [Improvements](#improvements)
- [Action items](#action-items)

## Summary

|                                    |                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Result                             | Component built: spec, types, TSX, CSS, 10 stories. Typecheck and build pass. Not shipped yet (step 5). |
| Figma reviews                      | 4 rounds before code (1 full review, 3 re-checks).                                                      |
| Spec rewrites                      | 3 big ones: first draft, after the Figma review, after the build.                                       |
| Side changes outside the component | New text colour tokens, a new icon (`tv_gen`), a new icon size (`xs`, 16px).                            |
| Bugs found in Storybook            | 1: short names collapsed to one letter when space was tight.                                            |

The workflow did its job: the review caught a domain mistake (a Metric shown as a Device) and a broken Figma property before any code existed. But a lot of the back-and-forth came from things the workflow doesn't ask for yet: a visual idea before the spec, a Figma self-check before the review, and checking tokens and icons early.

## How it went, step by step

| Step                | What happened                                                                                                                                                                                                                                                                                                            | Rounds |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 0. Issue and branch | Already done (`37-…`).                                                                                                                                                                                                                                                                                                   | 1      |
| 1. Spec             | The draft used words outside the glossary ("Sleeping room", "smoke detector", "floor 2"). The AI rewrote it with domain terms. The spec described a `›` separator and no layouts; Figma later had icons and three layouts. Added "Device only" and "Space and Device" on request.                                        | 2      |
| 2. Figma            | Built in parallel with the spec, not from it.                                                                                                                                                                                                                                                                            | –      |
| 3. Review           | **FIX NEEDED** with 10 fixes. The biggest: the last part was a Sensor/Metric ("Temperature"), the layout variants weren't in the spec, there were no colour tokens for text at all. Re-checks found new problems: every part was linked to the `site` boolean, 11 of 12 labels had raw black, the description was empty. | 4      |
| 4a. TSX             | Started before a full PASS (by decision: the open items didn't affect types). Smooth. Discovered that Figma's `row` frames can't become HTML (a list may only hold list items).                                                                                                                                          | 1      |
| 4b. CSS             | Smooth. One raw `1px` value for the screen-reader-only text.                                                                                                                                                                                                                                                             | 1      |
| 4c. Storybook       | The Long Names story showed "Level 2" collapsing to "L". Fixed by switching the layout to CSS grid.                                                                                                                                                                                                                      | 2      |
| Side work           | Text colour tokens, `tv_gen` icon, `xs` icon size. Each one paused the main flow.                                                                                                                                                                                                                                        | –      |

## What went well

- **The spec-first rule paid off.** Because the spec said "a Sensor is not a Device", the review caught the "Temperature" part in Figma immediately.
- **The review report format worked.** A table with _where / problem / fix / rule_ made each fix clear, and the token map went straight into the CSS.
- **Decisions were made in the conversation, not guessed.** When the spec and Figma disagreed (Device vs Metric, layouts, separator), the AI stopped and asked instead of picking one.
- **Figma MCP gave real data.** Reading property links, variable bindings and layer names found problems a screenshot never shows (all four booleans linked to `site`).
- **Stress stories found a real bug.** The Long Names story exposed the collapsing short name before any app used the component.
- **Small commits were planned.** Tokens, icons and the component are kept as separate commits.

## What slowed us down

1. **The spec and the Figma design were written apart.** The spec imagined a `›` breadcrumb; Figma had icons and three layouts. Half of the first review was about this gap, not about mistakes.
2. **The first instruction was unclear.** "Drop the first step" could mean "remove it" or "do it". One clarifying question solved it, but it cost a round.
3. **Figma needed four checks.** Each check found new problems that a simple self-check would have caught (wrong boolean links, raw colours, `Frame 1` layer names, empty description, sample text "2").
4. **Missing building blocks appeared late.** No text colour tokens, no `tv_gen` icon, no 16px icon size. Each was found during the review or the build and stopped the main flow.
5. **The workflow assumes a Status component.** The spec template asks for a "States" table mapped to Connected / Stale / Disconnected / Fault. For a Context component almost none apply; the real variation is layout and which parts show. We had to invent a "Parts shown" table.
6. **Unclear terms.** "Separator" and "component description" needed a second explanation. The description was not where Figma users expect, and the first answer didn't say how to add it.
7. **A gate that is only PASS or FIX NEEDED.** Small leftovers (sample text, auto layout on two frames) blocked "PASS" even though they didn't affect the code. We bent the rule by hand to start 4a.
8. **Figma structure ≠ HTML structure.** The `row` frames in `grid` can't exist in the code. Nothing in the workflow warns about this.
9. **The AI recommended 20px icons; the designer wanted 16px.** A visual decision was framed as a technical one ("no size exists, so use 20px"). Adding the size was the right call.
10. **Tool friction.** `pnpm storybook --no-open` failed (Turbo doesn't pass flags), and reading Storybook through scripts took several tries before switching to screenshots.
11. **Noise in the checks.** `pnpm format:check` fails on 22 files outside this branch, so "formatting fails" says nothing about our files.

## Root causes

| Root cause                                               | Led to |
| -------------------------------------------------------- | ------ |
| No "visual idea" in the spec step                        | 1, 9   |
| No Figma self-check before asking for a review           | 3      |
| No early check that the needed tokens and icons exist    | 4      |
| Spec template written for Status components              | 5      |
| Gate has no "minor" level                                | 7      |
| Workflow doesn't explain how Figma maps to HTML          | 8      |
| Beginner-unfriendly terms without examples               | 2, 6   |
| Repo-wide formatting debt, undocumented script behaviour | 10, 11 |

## Improvements

Proposed changes to [component-building.md](/docs/architecture/design-system/workflows/component-building.md):

### Step 1. Spec

- **Add a "Visual idea" section (required).** Three lines, before Figma: rough look (a sketch or a reference), does it use icons, separators, layouts? This keeps the spec and Figma from drifting apart.
- **Replace "States" with "States or variants".** Status components fill the target-states table. Other categories (Context, Layout…) describe their variants instead (layout, which parts show) and say in one line why the target states don't apply.
- **Use realistic domain examples.** Sample values come from the glossary examples ("Level 2", "Climate Module"), never placeholders like "2" or "Site name". The same values go into Figma.

### Before step 2. Check the building blocks

A short new check, five minutes:

- Every token the component needs exists in `tokens.css` (text colour, spacing, type style). If not, add it first, as its own commit.
- Every icon is in `icons.config.ts`, at a size the `Icon` component supports (`xs` 16, `sm` 20, `md` 24, `lg` 32).

### Step 2. Figma self-check

Before asking for a review, run through:

- [ ] Every boolean property is linked to the right layer (toggle each one and look).
- [ ] Every text and icon colour is a variable (no raw black).
- [ ] Every frame uses auto layout; no `Frame 1`, `Frame 2` names.
- [ ] Sample text uses the spec's example values.
- [ ] The component **set** has a description: select the purple frame → component section in the right panel → pencil → Description.

The AI can run this check with the Figma MCP in one call; ask: _"Self-check `<Name>` in Figma before review."_

### Step 3. Review

- **Add a "Blocks" column to the fixes table** (`spec`, `4a`, `4b`, `ship`). Result becomes **PASS**, **PASS with minor fixes** (nothing blocks 4a) or **FIX NEEDED**.
- **Look decisions belong to the designer.** When a fix is about how something looks (size, spacing, icon), the AI offers options and doesn't recommend the technical shortcut by default.

### Step 4. Build

- **Figma structure is not HTML.** Add a note: wrapper frames used only for layout (like `row`) often become CSS (grid, gap) instead of elements, especially inside lists.
- **Stress stories are required.** Next to one story per state/variant: long text in a narrow frame, and the smallest case (one part, no data).

### Repo

- Fix the 22 files that fail `pnpm format:check`, so the check is useful again.
- Note in CLAUDE.md that `pnpm storybook` takes no extra flags.

### Working together

- When a request could mean two things, the AI asks first (it did here; keep it).
- When something is "not understood", answer with a concrete example from this component, not a definition.

## Action items

| #   | Action                                                          | Where                                | Who                           |
| --- | --------------------------------------------------------------- | ------------------------------------ | ----------------------------- |
| 1   | Add "Visual idea" and "States or variants" to the spec template | `component-building.md`, step 1      | AI drafts, you review         |
| 2   | Add the "building blocks" check before Figma                    | `component-building.md`, new step 1b | AI drafts, you review         |
| 3   | Add the Figma self-check list                                   | `component-building.md`, step 2      | AI drafts, you review         |
| 4   | Add the "Blocks" column and PASS-with-minor result              | `component-building.md`, step 3      | AI drafts, you review         |
| 5   | Add the Figma ≠ HTML note and required stress stories           | `component-building.md`, step 4      | AI drafts, you review         |
| 6   | Update the checklist at the end of the workflow to match        | `component-building.md`, Checklist   | AI                            |
| 7   | Fix repo-wide formatting in its own commit                      | repo                                 | AI                            |
| 8   | Finish LocationPath: Figma item D, commits, PR                  | this branch                          | You (Figma), AI (commits, PR) |
