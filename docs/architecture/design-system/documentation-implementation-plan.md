# Documentation implementation plan

Everything that has to be written or aligned before the docs site fully documents the UI components. It is a to-do list: tick items off and update the tables as pages ship.

How to write each component page: [Component documentation workflow](./workflows/component-documentation.md). Worked examples: [`location-path.mdx`](/kit/apps/docs-site/docs/ui-components/context/location-path.mdx) and [`sensor-label.mdx`](/kit/apps/docs-site/docs/ui-components/context/sensor-label.mdx).

Status as of 2026-11-03.

## Contents

- [Status legend](#status-legend)
- [1. Component pages](#1-component-pages)
- [2. Specs to align](#2-specs-to-align)
- [3. Docs site structure](#3-docs-site-structure)
- [4. Other pages and docs](#4-other-pages-and-docs)
- [5. Decisions needed](#5-decisions-needed)
- [Order of work](#order-of-work)

## Status legend

| Mark | Meaning                                                        |
| ---- | -------------------------------------------------------------- |
| ✅   | Done                                                           |
| 🟡   | Can start, but something has to be fixed first (see the notes) |
| 🔴   | Blocked: the spec is too thin to write a user page from        |
| ⬜   | To do, nothing in the way                                      |

## 1. Component pages

One page per component exported from `kit/packages/ui/src/index.ts`, at `kit/apps/docs-site/docs/ui-components/<category>/<kebab-name>.mdx`. Every component has a spec and stories; none is missing from the exports.

The order follows what each component is built from: a page links to the pages of the components inside it, so those come first.

| #   | Component                | Category | Page                                  | Status | Built from                                                     | Notes                                                                                                                                                                                          |
| --- | ------------------------ | -------- | ------------------------------------- | ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `LocationPath`           | Context  | `context/location-path.mdx`           | ✅     | –                                                              |                                                                                                                                                                                                |
| 2   | `SensorLabel`            | Context  | `context/sensor-label.mdx`            | ✅     | –                                                              |                                                                                                                                                                                                |
| 3   | `UnitLabel`              | Readings | `readings/unit-label.mdx`             | ✅     | –                                                              | The spec says Figma has "5 units × 4 sizes = 20 variants", but the code has 7 Units (`ppb`, `ug-m3` added later?). Check Figma and fix the spec.                                               |
| 4   | `ReadingValue`           | Readings | `readings/reading-value.mdx`          | ✅     | –                                                              | First page with **states**. Spec fixed: it still said Fault was "a future Fault component".                                                                                                    |
| 5   | `SensorReading`          | Readings | `readings/sensor-reading.mdx`         | ⬜     | `SensorLabel`, `ReadingValue`, `UnitLabel`                     | Link to the three pages it is built from.                                                                                                                                                      |
| 6   | `DeviceConnectionStatus` | Status   | `status/device-connection-status.mdx` | 🔴     | –                                                              | Spec is 39 lines: no States, Tokens or Accessibility sections. Rewrite it first (see section 2).                                                                                               |
| 7   | `DevicePairingStatus`    | Status   | `status/device-pairing-status.mdx`    | 🔴     | –                                                              | Same as `DeviceConnectionStatus`.                                                                                                                                                              |
| 8   | `DeviceFaultStatus`      | Status   | `status/device-fault-status.mdx`      | ⬜     | –                                                              | 2 open questions in the spec.                                                                                                                                                                  |
| 9   | `ModuleCard`             | Readings | `readings/module-card.mdx`            | ⬜     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorReading` | Write after the Status pages. 3 open questions in the spec.                                                                                                                                    |
| 10  | `SpaceCard`              | Readings | `readings/space-card.mdx`             | 🟡     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorLabel`   | 6 open questions, some about what the parent passes (which Temperature for two Modules, Faults without a Module). Decide those first, because the "Mapping your data" section depends on them. |
| 11  | `StackLayout`            | Layout   | `layout/stack-layout.mdx`             | ⬜     | –                                                              | Already used in live examples, so a link from other pages helps.                                                                                                                               |
| 12  | `ColumnLayout`           | Layout   | `layout/column-layout.mdx`            | ⬜     | –                                                              |                                                                                                                                                                                                |
| 13  | `ContentSection`         | Layout   | `layout/content-section.mdx`          | ⬜     | –                                                              | 1 open question in the spec.                                                                                                                                                                   |
| 14  | `Switch`                 | Controls | `controls/switch.mdx`                 | 🔴     | –                                                              | Spec has no domain model context, Anatomy, Tokens or API section (it has "Props"). Rewrite it first.                                                                                           |
| 15  | `Button`                 | Controls | `controls/button.mdx`                 | ⬜     | –                                                              | 1 open question in the spec.                                                                                                                                                                   |

For each page, the workflow's Step 5 also asks you to:

- update the spec (link to the page at the top, replace the API block with a link to `<Name>.types.ts`)
- turn mentions of the component on older pages into links

## 2. Specs to align

The user page is written from the spec, so a spec has to be complete first. "Complete" means the sections listed in [Step 1 of the component building workflow](./workflows/component-building.md#step-1-write-the-spec-namemd).

| Spec                        | What's missing                                                                                                                                                     | Status |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `LocationPath.md`           | –                                                                                                                                                                  | ✅     |
| `SensorLabel.md`            | –                                                                                                                                                                  | ✅     |
| `DeviceConnectionStatus.md` | States (with the target-states table), Visual idea, Example values, Tokens, Accessibility. "Status mapping" and "Stress stories" are there but use the old format. | 🔴     |
| `DevicePairingStatus.md`    | Same as `DeviceConnectionStatus.md`.                                                                                                                               | 🔴     |
| `Switch.md`                 | Domain model context, Anatomy, Tokens, Example values. "Props" should be called API.                                                                               | 🔴     |
| All the others (11)         | Only the Step 5 update: the link to the user page at the top and the API block replaced by a link. Do it while writing each page.                                  | ⬜     |

`DeviceConnectionStatus` is named in CLAUDE.md and the component building workflow as a **reference example**, but its spec is one of the thinnest. Rewriting it fixes both.

## 3. Docs site structure

| Item                                        | What to do                                                                                                                                                                                                              | Status |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `ui-components/testing.mdx`, `testing2.mdx` | Test pages ("2222 Components", "33333 Components"). They show up as two extra "Overview" entries in the sidebar. Delete them.                                                                                           | ⬜     |
| Category folders                            | `context/` and `readings/` exist. Add `status/`, `controls/` and `layout/`, each with a `_category_.json` like the others, when its first page is written.                                                              | ⬜     |
| Category order                              | `position` in each `_category_.json`, in the overview's order: Overview page `1`, Status `2`, Readings `3`, Context `4`, Controls `5`, Layout `6`. Readings and Context are set. Use these numbers for the new folders. | 🟡     |
| `ui-components/index.mdx`                   | Still a placeholder. Write the overview: what the categories mean (the question each one answers), how to install, and a list of every component with one line each.                                                    | ⬜     |
| `sidebar_position` inside a category        | Order pages the way people meet them: building blocks first, cards last. Readings: `ReadingValue` 1, `UnitLabel` 2, `SensorReading` 3, `ModuleCard` 4, `SpaceCard` 5. Context: `LocationPath` 3, `SensorLabel` 4.       | 🟡     |

## 4. Other pages and docs

| Item                                                          | What to do                                                                                                                                                              | Status |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `get-started/installation.mdx`                                | The `:::info Coming soon` box shows as plain text. Change it to `:::info[Coming soon]`. Write the page when the packages are published.                                 | ⬜     |
| Landing page (`src/pages/index.tsx`)                          | Still uses Docusaurus's `--ifm-` variables and colours. Move it to the kit's tokens and components now that the site loads them.                                        | ⬜     |
| `docs/architecture/design-system/information-architecture.md` | Empty. The site's structure is only described in CLAUDE.md. Write it, or remove the file and point to this plan.                                                        | ⬜     |
| CLAUDE.md                                                     | Points to `docs/architecture/docs-site/information-architecture.md`, which moved to `docs/architecture/design-system/`. Fix the path, or remove it with the item above. | ⬜     |
| Domain Model pages                                            | Glossary, Data model and Device lifecycle exist. Check that every term the component pages link to (Metric, Unit, Subject, Pairing Status…) has an anchor.              | ⬜     |

## 5. Decisions needed

| Question                            | Why it matters                                                                                                                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Does `Icon` get a page?**         | It is exported from `ui` (`Icon`, `IconName`, `IconSize`) but has no folder, spec or stories like the components. If apps should use it, it needs a page, maybe in a new "Foundations" section. |
| **A Foundations section?**          | Tokens, typography, colours and icons have no user page. The component pages' Styling sections already mention tokens, so a page that lists them would be useful to link to.                    |
| **The `Metric` type**               | It is exported on its own, and several components use it. Document it once (on a Foundations or Domain Model page) and link to it from each component.                                          |
| **Status pages: states shown how?** | Status components have states driven by data (Connecting, Connected, Stale, Disconnected). Decide whether to show one live example per state, or one example with all of them stacked.          |

## Order of work

1. **Clean up the site:** delete the test pages, fix the Installation admonition and the CLAUDE.md path. These are small and make the sidebar right.
2. **Readings building blocks:** `UnitLabel`, `ReadingValue`, `SensorReading`. Adds the `readings/` category.
3. **Status:** rewrite the `DeviceConnectionStatus` and `DevicePairingStatus` specs, then write the three Status pages. Adds the `status/` category.
4. **Readings cards:** `ModuleCard`, then `SpaceCard` once its open questions are decided.
5. **Layout:** `StackLayout`, `ColumnLayout`, `ContentSection`.
6. **Controls:** rewrite the `Switch` spec, then `Switch` and `Button`.
7. **Overview page:** write `ui-components/index.mdx` last, when every component it lists has a page.
8. **Foundations**, if decided (section 5).
