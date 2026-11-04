# Figma ↔ code alignment workflow

How to check that a component in Figma and the same component in code match, and how to fix them when they don't. People and AI agents follow the same steps.

Use it for components that **already exist** in both places. To build a new component, use [Component building workflow](./component-building.md).

```
1. Gather → 2. Compare (8 checks) → 3. Report → 4. Decide → 5. Fix code → 6. Fix Figma → 7. Verify
```

Worked examples: [`DevicePairingStatus`](/kit/packages/ui/src/components/status/DevicePairingStatus/) and [`DeviceConnectionStatus`](/kit/packages/ui/src/components/status/DeviceConnectionStatus/).

## Contents

- [Read first](#read-first)
- [Which side wins](#which-side-wins)
- [Step 1. Gather](#step-1-gather)
- [Step 2. Compare: the 8 checks](#step-2-compare-the-8-checks)
- [Step 3. Report](#step-3-report)
- [Step 4. Decide](#step-4-decide)
- [Step 5. Fix code](#step-5-fix-code)
- [Step 6. Fix Figma](#step-6-fix-figma)
- [Step 7. Verify](#step-7-verify)
- [Rules for agents](#rules-for-agents)
- [Checklist](#checklist)

## Read first

| Doc                                                                 | Why                                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx)      | Decides names when Figma and code disagree.                                  |
| [Component building workflow](./component-building.md)              | The conventions every component must follow (files, states, stress stories). |
| [Figma variables ↔ code handoff](./figma-variables-code-handoff.md) | How Figma variables map to `--shk-` tokens.                                  |
| `kit/packages/tokens/dist/tokens.css`                               | The real token names and values.                                             |

## Which side wins

**Code is the source of truth**, with two exceptions:

1. **Domain words.** If one side uses a word from the Ubiquitous Language and the other doesn't, the Ubiquitous Language wins. Example: Figma said `DeviceConnectionStatus`, code said `DeviceCommunicationStatus`. "Connection Status" is the domain term, so the code was renamed.
2. **Clear mistakes in code.** If code uses a raw or wrong token and Figma uses the right semantic one, fix the code. Example: code used `--shk-palette-black` for text, Figma used `color-text/primary`.

Anything else that is unclear: ask, don't guess.

## Step 1. Gather

You need two inputs: the **component folder** and a **Figma link with `node-id`** pointing to the component set.

**Code.** Read all six files in the component folder (`.md`, `.types.ts`, `.tsx`, `.module.css`, `.stories.tsx`, `index.ts`) and the export in `kit/packages/ui/src/index.ts`. Look up every token the CSS uses in `tokens.css`.

**Figma.** Collect, for the component set and every child layer:

- Component set name, page name, description.
- Variant property names and values.
- For every layer: name, type, size, auto-layout gap and padding.
- **Every bound variable** (collection, name, code syntax) and **every unbound value** (raw fills, fixed gap, fixed size).
- Text: font, size, weight, line height, letter spacing, text style.

> **Agents:** `get_design_context` gives a screenshot and approximate code, but it hides which values are bound. Run a read-only `use_figma` script that walks the component set and returns `boundVariables` for each node and paint, plus raw fills and fixed numbers. `get_variable_defs` lists the variables used, but not what is missing.

## Step 2. Compare: the 8 checks

| #   | Check                  | Pass when                                                                                                                                                                                               | Example of a fail we found                                                          |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | **Names**              | Component set, page, folder, files and export have the same name, no typos, no trailing spaces. The name uses Ubiquitous Language words.                                                                | `DeviceParingStatus ` (typo + space), page `DevicePraingStatus`                     |
| 2   | **Properties**         | Figma variant property = code prop name, with the same values.                                                                                                                                          | Figma `paringStatus` / `paring` vs code `status` / `pairing`                        |
| 3   | **States / variants**  | One Figma variant per code state, one story per state, same label text. Code has `LongText` and `Minimal` stories.                                                                                      | Stress stories missing                                                              |
| 4   | **Everything bound**   | Every fill, stroke, gap, padding, size and radius in Figma is bound to a variable. Code uses only `var(--shk-…)`.                                                                                       | Gap fixed at 4px, background fixed white or missing                                 |
| 5   | **Same token**         | Each property uses the **same** token on both sides, not just the same colour. Components use semantic tokens, not palette primitives.                                                                  | Stale dot `palette/amber/400` vs `status/warning/solid` (same hex, different token) |
| 6   | **Typography**         | All text values come from one typography group (e.g. `typography/caption/*`), not a mix of primitives and another group.                                                                                | `font-size/12` + `typography/label/line-height` mixed                               |
| 7   | **Sizes on the scale** | Fixed sizes are a `size/*` or `space/*` step. Shapes are real shapes (ellipse, not image). Layers have meaningful names (`label`, `indicator`).                                                         | 11px dot, layer `Ellipse 5`                                                         |
| 8   | **Variable naming**    | Figma `collection / name` = code token path (`palette` / `gray/900` = `palette.gray.900`). Code syntax is `var(--shk-…)`. Primitives have scope `[]` (hidden), semantic variables have specific scopes. | `palette` / `color/gray/900` (extra `color/`), palette scope `ALL_SCOPES`           |

Also check that the component `.md` (anatomy, status mapping table) matches both sides.

## Step 3. Report

Write one table, grouped as ✅ aligned, ❌ mismatch, ⚠️ unbound in Figma. For each mismatch give: the check, the code value, the Figma value, and **where to fix it** (code or Figma).

Keep the report short. Change nothing yet.

## Step 4. Decide

Most fixes follow [Which side wins](#which-side-wins) and need no discussion. **Ask first** when:

- The fix renames a public export, prop or type (it breaks anyone importing it).
- The fix changes something used by many components (a whole variable collection, scopes, text styles).
- Both sides look wrong, or neither matches the Ubiquitous Language.

## Step 5. Fix code

1. Rename folders and files with `git mv`, so history is kept. Then replace the old name everywhere (code, docs, CLAUDE.md), and search again to confirm it is gone.
2. Fix CSS tokens, the `.md`, and add missing stories.
3. Run, from the repo root:
   - `pnpm --filter @detriz-sh-kit/ui typecheck`
   - `npx prettier --write <component folder>` (only the files you changed; other files may already have unrelated formatting warnings)

## Step 6. Fix Figma

Change the component in place. Don't rebuild it, so instances keep working.

- Rename the component set, page, variant property and values. Remove trailing spaces.
- Bind every value from check 4 to the variable the code uses.
- Bind text to one typography group.
- Resize shapes to a scale step and bind width and height.
- Rename layers to `label`, `indicator`, etc.
- Add a component description that names the code component.

> **Agents:** load the `figma-use` skill (and `figma-generate-library` for variable or component changes) before writing. Run writes one at a time, never in parallel. Load the font before touching text. Return every changed node ID.

### Known Figma limits

Things the plugin API can't do, or where Figma behaves differently from CSS. Don't fight them: do them by hand, or accept and document them.

| Limit                                                                                                                                                                                                               | What to do                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tabular figures** (`font-variant-numeric: tabular-nums`) can be read but not set through the API.                                                                                                                 | Set by hand: select the text, **Type settings → Details → Numbers → Style**, and click the **second `17`** (lining, tabular). The first `17` is lining, proportional. Then check through the API that the text has `TNUM`, not `PNUM`. |
| **Order of variant values** (`inline, stack, grid`) doesn't follow the layer order and can't be changed through the API.                                                                                            | Cosmetic. Drag the values in the property panel by hand if it matters.                                                                                                                                                                 |
| **Apostrophes in descriptions** are saved as `&#39;` through the API.                                                                                                                                               | Reword ("cannot" instead of "can't").                                                                                                                                                                                                  |
| **Old layout.** A frame can keep an old layout after the components inside it change. Baseline alignment is the usual victim: text looks 3–6px off even though the frame says Baseline.                             | Before changing components, **force a relayout first**: switch the frame's alignment to Center and back to Baseline, then measure again.                                                                                               |
| **Icons are SVG in code but a font in Figma.** An SVG has no text baseline, so the browser uses its bottom edge; Figma uses the icon font's baseline. Text next to an icon on a baseline sits 2–4px lower in Figma. | Accept it and say so in the component's `.md`. Changing it would mean rebuilding the Icon component.                                                                                                                                   |
| **Fixed height hides the baseline.** Figma can't find the baseline of text centred in a fixed-height frame.                                                                                                         | For text that needs a minimum height, use **hug + min height** bound to a variable, the same as CSS `min-block-size`.                                                                                                                  |

**Measuring alignment.** Don't trust a screenshot: compare the bottom of the glyphs (`absoluteRenderBounds`) of the two texts. Digits and letters like "C" or "x" sit on the baseline, so a difference of 0.5px or less is aligned.

## Step 7. Verify

- **Figma:** take a screenshot of the component set and run `get_variable_defs` again. The list of `--shk-` variables should be the same as the tokens in the `.module.css`.
- **Code:** typecheck passes, and searching for the old name finds nothing.
- Commit with a Conventional Commit scoped to the package, for example `fix(ui): align DevicePairingStatus with Figma`. Use `refactor(ui)!:` when a public name changed.

## Rules for agents

- Review first, then fix. Never change Figma or code during step 2 or 3.
- Changes to the shared Figma file need the user's OK.
- Stay on the one component you were given. List other problems you notice, but don't fix them.
- Never guess node IDs or variable names; read them from the file.

## Checklist

- [ ] Code: all six files read; tokens looked up in `tokens.css`
- [ ] Figma: all bound variables **and** unbound values collected
- [ ] 1 Names match and use domain words
- [ ] 2 Property name and values match
- [ ] 3 One variant and one story per state; `LongText` and `Minimal` exist
- [ ] 4 Nothing unbound in Figma; only `var(--shk-…)` in CSS
- [ ] 5 Same token on both sides; no palette primitives in components
- [ ] 6 Text uses one typography group
- [ ] 7 Sizes on the scale; real shapes; clear layer names
- [ ] 8 Variable names = token paths; code syntax correct; scopes set
- [ ] `.md` matches both sides
- [ ] Report written and decisions agreed
- [ ] Code fixed, typecheck passes, formatting checked
- [ ] Figma fixed, screenshot and `get_variable_defs` match the CSS
