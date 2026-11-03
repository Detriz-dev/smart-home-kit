# Documentation implementation plan

Everything that has to be written or aligned before the docs site fully documents the UI components. It is a to-do list: tick items off and update the tables as pages ship.

How to write each component page: [Component documentation workflow](./workflows/component-documentation.md). Worked examples: [`location-path.mdx`](/kit/apps/docs-site/docs/ui-components/context/location-path.mdx) and [`sensor-label.mdx`](/kit/apps/docs-site/docs/ui-components/context/sensor-label.mdx).

Status as of 2026-11-03: all 15 component pages and the overview are written.

## Contents

- [Status legend](#status-legend)
- [1. Component pages](#1-component-pages)
- [2. Specs to align](#2-specs-to-align)
- [3. Docs site structure](#3-docs-site-structure)
- [4. Other pages and docs](#4-other-pages-and-docs)
- [5. Foundations](#5-foundations)
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

| #   | Component                | Category | Page                                  | Status | Built from                                                     | Notes                                                                                                                                                                                                                                                                        |
| --- | ------------------------ | -------- | ------------------------------------- | ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `LocationPath`           | Context  | `context/location-path.mdx`           | ✅     | –                                                              |                                                                                                                                                                                                                                                                              |
| 2   | `SensorLabel`            | Context  | `context/sensor-label.mdx`            | ✅     | –                                                              |                                                                                                                                                                                                                                                                              |
| 3   | `UnitLabel`              | Readings | `readings/unit-label.mdx`             | ✅     | –                                                              | The spec says Figma has "5 units × 4 sizes = 20 variants", but the code has 7 Units (`ppb`, `ug-m3` added later?). Check Figma and fix the spec.                                                                                                                             |
| 4   | `ReadingValue`           | Readings | `readings/reading-value.mdx`          | ✅     | –                                                              | First page with **states**. Spec fixed: it still said Fault was "a future Fault component".                                                                                                                                                                                  |
| 5   | `SensorReading`          | Readings | `readings/sensor-reading.mdx`         | ✅     | `SensorLabel`, `ReadingValue`, `UnitLabel`                     | Links to the three pages it is built from.                                                                                                                                                                                                                                   |
| 6   | `DeviceConnectionStatus` | Status   | `status/device-connection-status.mdx` | ✅     | –                                                              | Spec rewritten from the code, the Glossary and how `ModuleCard` and `SpaceCard` use it. Still to check in Figma: node ID and variable names (spec, Open questions).                                                                                                          |
| 7   | `DevicePairingStatus`    | Status   | `status/device-pairing-status.mdx`    | ✅     | –                                                              | Spec rewritten, same as `DeviceConnectionStatus`. Still to check in Figma: node ID and variable names.                                                                                                                                                                       |
| 8   | `DeviceFaultStatus`      | Status   | `status/device-fault-status.mdx`      | ✅     | –                                                              | 2 open questions in the spec (help per Fault Code, more Fault Codes); neither changes how it is used today.                                                                                                                                                                  |
| 9   | `ModuleCard`             | Readings | `readings/module-card.mdx`            | ✅     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorReading` | Spec fixed: a dead link to the deleted Domain Analysis, and the name colour was "to confirm". New open question: "one Sensor per Metric" isn't in the Data model.                                                                                                            |
| 10  | `SpaceCard`              | Readings | `readings/space-card.mdx`             | ✅     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorLabel`   | Written from how the code behaves today: the card shows what it gets and never averages, and the page tells developers to pass `metric` with each Fault. The 6 open questions stay in the spec; if they are decided differently, update the "Mapping your data" section.     |
| 11  | `StackLayout`            | Layout   | `layout/stack-layout.mdx`             | ✅     | –                                                              | Used in most live examples on other pages, which now link here.                                                                                                                                                                                                              |
| 12  | `ColumnLayout`           | Layout   | `layout/column-layout.mdx`            | ✅     | –                                                              | Has a width slider, like `ModuleCard`.                                                                                                                                                                                                                                       |
| 13  | `ContentSection`         | Layout   | `layout/content-section.mdx`          | ✅     | –                                                              | Spec fixed: it said "Studio's own page owns the `<h1>`"; Live Studio was dropped.                                                                                                                                                                                            |
| 14  | `Switch`                 | Controls | `controls/switch.mdx`                 | ✅     | –                                                              | Decided: Switch is for **app settings** (like "Show temperature in °F"), never for controlling a Device, because the kit is sensor-only. Spec rewritten; story and prop comment examples changed from "Heating". Still to update in Figma: the usage frame may show Heating. |
| 15  | `Button`                 | Controls | `controls/button.mdx`                 | ✅     | –                                                              | Spec fixed: "Studio uses it" now says apps using Generative UI.                                                                                                                                                                                                              |

For each page, the workflow's Step 5 also asks you to:

- update the spec (link to the page at the top, replace the API block with a link to `<Name>.types.ts`)
- turn mentions of the component on older pages into links

## 2. Specs to align

The user page is written from the spec, so a spec has to be complete first. "Complete" means the sections listed in [Step 1 of the component building workflow](./workflows/component-building.md#step-1-write-the-spec-namemd).

| Spec                        | What's missing                                                                                                                    | Status |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `LocationPath.md`           | –                                                                                                                                 | ✅     |
| `SensorLabel.md`            | –                                                                                                                                 | ✅     |
| `DeviceConnectionStatus.md` | Rewritten. Only the Figma node ID and variable names are missing.                                                                 | 🟡     |
| `DevicePairingStatus.md`    | Rewritten. Only the Figma node ID and variable names are missing.                                                                 | 🟡     |
| `Switch.md`                 | Rewritten for app settings. Only the Figma variable names are missing.                                                            | 🟡     |
| All the others (11)         | Only the Step 5 update: the link to the user page at the top and the API block replaced by a link. Do it while writing each page. | ⬜     |

`DeviceConnectionStatus` is named in CLAUDE.md and the component building workflow as a **reference example**, but its spec is one of the thinnest. Rewriting it fixes both.

## 3. Docs site structure

| Item                                        | What to do                                                                                                                                                                                                        | Status |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `ui-components/testing.mdx`, `testing2.mdx` | Deleted.                                                                                                                                                                                                          | ✅     |
| Category folders                            | All five exist: `status/`, `readings/`, `context/`, `controls/`, `layout/`.                                                                                                                                       | ✅     |
| Category order                              | `position` in each `_category_.json`: Overview page `1`, Foundations `2`, Status `3`, Readings `4`, Context `5`, Controls `6`, Layout `7`.                                                                        | ✅     |
| `ui-components/index.mdx`                   | Written: a live example, getting started, the groups and the question each answers, every component with one line, what they have in common, and how to read a component page.                                    | ✅     |
| `sidebar_position` inside a category        | Order pages the way people meet them: building blocks first, cards last. Readings: `ReadingValue` 1, `UnitLabel` 2, `SensorReading` 3, `ModuleCard` 4, `SpaceCard` 5. Context: `LocationPath` 3, `SensorLabel` 4. | ✅     |

## 4. Other pages and docs

| Item                                                          | What to do                                                                                                                                                                                                                                                                                                                     | Status |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `get-started/installation.mdx`                                | Written as if the packages were already published: requirements, install, styles, fonts, the cascade layer rule, a check that it works, and a table of what to fix. Plus a new `quick-start.mdx` that builds a Bedroom screen step by step. Check both again when the packages are really published (package names, versions). | ✅     |
| Landing page (`src/pages/index.tsx`)                          | Still uses Docusaurus's `--ifm-` variables and colours. Move it to the kit's tokens and components now that the site loads them.                                                                                                                                                                                               | ⬜     |
| `docs/architecture/design-system/information-architecture.md` | Empty. The site's structure is only described in CLAUDE.md. Write it, or remove the file and point to this plan.                                                                                                                                                                                                               | ⬜     |
| CLAUDE.md                                                     | Path fixed. It now also points to this plan.                                                                                                                                                                                                                                                                                   | ✅     |
| Domain Model pages                                            | Glossary, Data model and Device lifecycle exist. Check that every term the component pages link to (Metric, Unit, Subject, Pairing Status…) has an anchor.                                                                                                                                                                     | ⬜     |

## 5. Foundations

A **Foundations** category in UI Components (first after the Overview), for what every component is built from. Decided 2026-11-03.

| Page                            | Status | Notes                                                                                                              |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `foundations/design-tokens.mdx` | ✅     | What tokens are, primitive vs semantic, changing them, CSS cascade layers, and a reference of the semantic tokens. |
| `foundations/typography.mdx`    | ✅     | The fonts, how to load them (`@fontsource`), the 16 text styles with live samples.                                 |
| `foundations/icons.mdx`         | ✅     | The `Icon` component and the 22 icons, which component uses which, sizes, colour, decorative vs labelled.          |
| `foundations/shared-types.mdx`  | ✅     | `Metric`, `UnitLabelUnit`, `ConnectionStatus`, `PairingStatus`, `FaultCode`.                                       |
| Colour (palette, contrast)      | ⬜     | Later. The semantic colours are already in Design tokens; this would add the full palette and a contrast table.    |
| Spacing and Motion              | ⬜     | Later, if the Design tokens reference isn't enough.                                                                |

Still open:

- **No dark theme.** The kit has one light theme. The docs site keeps previews on a light surface as a workaround (`custom.css`). Design tokens says so in a note.
- **Figma checks** listed in four specs: `DeviceConnectionStatus`, `DevicePairingStatus`, `Switch` (node ID, variables, usage frame) and `UnitLabel` (5 vs 7 Units).

## Order of work

1. ✅ **Clean up the site:** delete the test pages, fix the Installation admonition and the CLAUDE.md path. These are small and make the sidebar right.
2. ✅ **Readings building blocks:** `UnitLabel`, `ReadingValue`, `SensorReading`. Adds the `readings/` category.
3. ✅ **Status:** rewrite the `DeviceConnectionStatus` and `DevicePairingStatus` specs, then write the three Status pages. Adds the `status/` category.
4. ✅ **Readings cards:** `ModuleCard`, then `SpaceCard` once its open questions are decided.
5. ✅ **Layout:** `StackLayout`, `ColumnLayout`, `ContentSection`.
6. ✅ **Controls:** rewrite the `Switch` spec, then `Switch` and `Button`.
7. ✅ **Overview page:** write `ui-components/index.mdx` last, when every component it lists has a page.
8. ✅ **Foundations:** Design tokens, Typography, Icons, Shared types (section 5).
