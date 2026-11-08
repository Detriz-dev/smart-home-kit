# Documentation implementation plan

Everything that has to be written or aligned before the docs site fully documents the UI components. It is a to-do list: tick items off and update the tables as pages ship.

How to write each component page: [Component documentation workflow](./workflows/component-documentation.md). Worked examples: [`location-path.mdx`](/kit/apps/docs-site/docs/ui-components/navigation/location-path.mdx) and [`sensor-label.mdx`](/kit/apps/docs-site/docs/ui-components/context/sensor-label.mdx).

Status as of 2026-11-07: all 27 component pages in this table and the overview are written. Phase 2 components are added as they ship.

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

| #   | Component                | Category   | Page                                  | Status | Built from                                                     | Notes                                                                                                                                                                                                                                                                        |
| --- | ------------------------ | ---------- | ------------------------------------- | ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `LocationPath`           | Navigation | `navigation/location-path.mdx`        | ✅     | –                                                              |                                                                                                                                                                                                                                                                              |
| 2   | `SensorLabel`            | Context    | `context/sensor-label.mdx`            | ✅     | –                                                              |                                                                                                                                                                                                                                                                              |
| 3   | `UnitLabel`              | Readings   | `readings/unit-label.mdx`             | ✅     | –                                                              | The spec says Figma has "5 units × 4 sizes = 20 variants", but the code has 7 Units (`ppb`, `ug-m3` added later?). Check Figma and fix the spec.                                                                                                                             |
| 4   | `ReadingValue`           | Readings   | `readings/reading-value.mdx`          | ✅     | –                                                              | First page with **states**. Spec fixed: it still said Fault was "a future Fault component".                                                                                                                                                                                  |
| 5   | `SensorReading`          | Readings   | `readings/sensor-reading.mdx`         | ✅     | `SensorLabel`, `ReadingValue`, `UnitLabel`                     | Links to the three pages it is built from.                                                                                                                                                                                                                                   |
| 6   | `DeviceConnectionStatus` | Status     | `status/device-connection-status.mdx` | ✅     | –                                                              | Spec rewritten from the code, the Glossary and how `ModuleCard` and `SpaceCard` use it. Still to check in Figma: node ID and variable names (spec, Open questions).                                                                                                          |
| 7   | `DevicePairingStatus`    | Status     | `status/device-pairing-status.mdx`    | ✅     | –                                                              | Spec rewritten, same as `DeviceConnectionStatus`. Still to check in Figma: node ID and variable names.                                                                                                                                                                       |
| 8   | `DeviceFaultStatus`      | Status     | `status/device-fault-status.mdx`      | ✅     | –                                                              | 2 open questions in the spec (help per Fault Code, more Fault Codes); neither changes how it is used today.                                                                                                                                                                  |
| 9   | `ModuleCard`             | Readings   | `readings/module-card.mdx`            | ✅     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorReading` | Spec fixed: a dead link to the deleted Domain Analysis, and the name colour was "to confirm". New open question: "one Sensor per Metric" isn't in the Data model.                                                                                                            |
| 10  | `SpaceCard`              | Readings   | `readings/space-card.mdx`             | ✅     | `DeviceConnectionStatus`, `DeviceFaultStatus`, `SensorLabel`   | Written from how the code behaves today: the card shows what it gets and never averages, and the page tells developers to pass `metric` with each Fault. The 6 open questions stay in the spec; if they are decided differently, update the "Mapping your data" section.     |
| 11  | `StackLayout`            | Layout     | `layout/stack-layout.mdx`             | ✅     | –                                                              | Used in most live examples on other pages, which now link here.                                                                                                                                                                                                              |
| 12  | `ColumnLayout`           | Layout     | `layout/column-layout.mdx`            | ✅     | –                                                              | Has a width slider, like `ModuleCard`.                                                                                                                                                                                                                                       |
| 13  | `ContentSection`         | Layout     | `layout/content-section.mdx`          | ✅     | –                                                              | Spec fixed: it said "Studio's own page owns the `<h1>`"; Live Studio was dropped.                                                                                                                                                                                            |
| 14  | `Switch`                 | Controls   | `controls/switch.mdx`                 | ✅     | –                                                              | Decided: Switch is for **app settings** (like "Show temperature in °F"), never for controlling a Device, because the kit is sensor-only. Spec rewritten; story and prop comment examples changed from "Heating". Still to update in Figma: the usage frame may show Heating. |
| 15  | `Button`                 | Controls   | `controls/button.mdx`                 | ✅     | –                                                              | Spec fixed: "Studio uses it" now says apps using Generative UI.                                                                                                                                                                                                              |
| 16  | `StateValue`             | Readings   | `readings/state-value.mdx`            | ✅     | `StateIcon`, `ReadingStatusIcon`                               | Phase 2. The State twin of `ReadingValue`. Linked from the overview, Shared types, Colors, Icons, SensorLabel and ReadingValue pages.                                                                                                                                        |
| 17  | `RelativeTime`           | Context    | `context/relative-time.mdx`           | ✅     | –                                                              | Phase 2. Formats in `utils/formatTime.ts` (English, 24-hour).                                                                                                                                                                                                                |
| 18  | `DetectionStatus`        | Readings   | `readings/detection-status.mdx`       | ✅     | `StateValue`, `RelativeTime`                                   | Phase 2. Motion, Smoke and CO only.                                                                                                                                                                                                                                          |
| 19  | `AssetLabel`             | Context    | `context/asset-label.mdx`             | ✅     | `AssetTypeIcon`                                                | Phase 2. The Asset twin of `SpaceLabel`.                                                                                                                                                                                                                                     |
| 20  | `Badge`                  | Feedback   | `feedback/badge.mdx`                  | ✅     | –                                                              | Phase 2. Count of Active Alerts; tone = highest Alert Level.                                                                                                                                                                                                                 |
| 21  | `SensorState`            | Readings   | `readings/sensor-state.mdx`           | ✅     | `SensorLabel`, `AssetLabel`, `StateValue`                      | Phase 2. The twin of `SensorReading`. `ModuleCard` and `SpaceCard` pages updated for State Sensors and rows.                                                                                                                                                                 |
| 22  | `AlertListItem`          | Status     | `status/alert-list-item.mdx`          | ✅     | `ListItem`, `AlertLevelIcon`, `RelativeTime`                   | Phase 2. One Alert as a List row.                                                                                                                                                                                                                                            |
| 23  | `AlertBanner`            | Feedback   | `feedback/alert-banner.mdx`           | ✅     | `AlertLevelIcon`, `RelativeTime`, `Button`, `ActionIcon`       | Phase 2. One Active Alert at the top of a screen. Critical is solid red.                                                                                                                                                                                                     |
| 24  | `SpaceListItem`          | Context    | `context/space-list-item.mdx`         | ✅     | `ListItem`, `SpaceTypeIcon`, `Badge`                           | Phase 2. A Space as a List row.                                                                                                                                                                                                                                              |
| 25  | `FloorSection`           | Layout     | `layout/floor-section.mdx`            | ✅     | `PlaceIcon`, `SpaceListItem` (as children)                     | Phase 2. A Floor's Spaces under a heading.                                                                                                                                                                                                                                   |
| 26  | `EmptyState`             | Feedback   | `feedback/empty-state.mdx`            | ✅     | `Button`                                                       | Phase 2. Nothing here yet. Not for loading or errors.                                                                                                                                                                                                                        |
| 27  | `AlertRuleLabel`         | Context    | `context/alert-rule-label.mdx`        | ✅     | `AlertIcon`, `UnitLabel` symbols                               | Phase 2. An Alert Rule in a few words, next to its Reading. Optional.                                                                                                                                                                                                        |

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

`DeviceConnectionStatus` is named in AGENTS.md and the component building workflow as a **reference example**, but its spec is one of the thinnest. Rewriting it fixes both.

## 3. Docs site structure

| Item                                        | What to do                                                                                                                                                                                                                    | Status |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `ui-components/testing.mdx`, `testing2.mdx` | Deleted.                                                                                                                                                                                                                      | ✅     |
| Category folders                            | All exist: `foundations/`, `layout/`, `context/`, `readings/`, `status/`, `feedback/`, `controls/`, `navigation/`.                                                                                                            | ✅     |
| Category order                              | `position` in each `_category_.json`: Overview page `1`, Foundations `2`, Layout `3`, Context `4`, Readings `5`, Status `6`, Feedback `7`, Controls `8`, Navigation `9`.                                                      | ✅     |
| `ui-components/index.mdx`                   | Written: a live example, getting started, the groups and the question each answers, every component with one line, what they have in common, and how to read a component page.                                                | ✅     |
| `sidebar_position` inside a category        | Order pages the way people meet them: building blocks first, cards last. Readings: `ReadingValue` 1, `UnitLabel` 2, `SensorReading` 3, `ModuleCard` 4, `SpaceCard` 5. Context: `SensorLabel` 4. Navigation: `LocationPath` 1. | ✅     |

## 4. Other pages and docs

| Item                                                          | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `get-started/installation.mdx`                                | Written as if the packages were already published: requirements, install, styles, fonts, the cascade layer rule, a check that it works, and a table of what to fix. Plus a new `quick-start.mdx` that builds a Bedroom screen step by step. Check both again when the packages are really published (package names, versions).                                                                                                                                                             | ✅     |
| Landing page (`src/pages/index.tsx`)                          | Still uses Docusaurus's `--ifm-` variables and colours. Move it to the kit's tokens and components now that the site loads them.                                                                                                                                                                                                                                                                                                                                                           | ⬜     |
| `docs/architecture/design-system/information-architecture.md` | Empty. The site's structure is only described in AGENTS.md. Write it, or remove the file and point to this plan.                                                                                                                                                                                                                                                                                                                                                                           | ⬜     |
| CLAUDE.md                                                     | Path fixed. It now also points to this plan.                                                                                                                                                                                                                                                                                                                                                                                                                                               | ✅     |
| Domain Model pages                                            | Glossary, Data model, Device lifecycle and **Events and commands** exist. Events and commands was split out of Device lifecycle (2026-11-03): the events and commands tables are a reference, the lifecycle is an explanation. The Rules stayed on the lifecycle page, because they explain its diagrams and the two rule lists refer to each other by number; each event and command links to the rules it follows. Still to check: every term the component pages link to has an anchor. | ⬜     |

## 5. Foundations

A **Foundations** category in UI Components (first after the Overview), for what every component is built from. Decided 2026-11-03.

| Page                             | Status | Notes                                                                                                                                                                                                                                 |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foundations/design-tokens.mdx`  | ✅     | What tokens are, primitive vs semantic, changing them, CSS cascade layers, and a short reference (colours moved to Colors).                                                                                                           |
| `foundations/typography.mdx`     | ✅     | The fonts, how to load them (`@fontsource`), the 16 text styles with live samples.                                                                                                                                                    |
| `foundations/icons.mdx`          | ✅     | The `Icon` component and the 22 icons, which component uses which, sizes, colour, decorative vs labelled.                                                                                                                             |
| `foundations/shared-types.mdx`   | ✅     | `Metric`, `UnitLabelUnit`, `ConnectionStatus`, `PairingStatus`, `FaultCode`.                                                                                                                                                          |
| `foundations/colors.mdx`         | ✅     | Palette (57) and semantic colours (46) with live swatches from `src/components/ColorTokens`, Figma ↔ CSS names, status roles, contrast. Checked against Figma variables 2026-11-06: all match.                                        |
| `foundations/space-and-size.mdx` | ✅     | Space (13) and size (11) scales drawn from `src/components/SpaceSizeTokens`, Figma ↔ CSS names, which components use each step, touch targets, borders on the grid. Checked against Figma variables 2026-11-06: all match.            |
| `foundations/shape.mdx`          | ✅     | Corner radius (7) and border width (4) from `src/components/ShapeTokens`, radius by size, focus rings, borders and padding. Checked against Figma variables 2026-11-06: all match.                                                    |
| `foundations/elevation.mdx`      | ✅     | The flat model: page / card / sunken surfaces and outlines, why no shadows (high contrast), how to build a card, and that shadow and z-index tokens come with the first floating component. No tokens of its own. Decided 2026-11-06. |
| Motion                           | ⬜     | Later. One token (`--shk-motion-duration-spin`), still on Design tokens.                                                                                                                                                              |

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
