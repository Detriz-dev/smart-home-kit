# Component docs review

Tracks the review of every page in the docs site's **UI Components** section (`kit/apps/docs-site/docs/ui-components/`). Each page is reviewed with the `smart-home-kit-copywriting` skill, one at a time, in sidebar order. Tick a page when its fixes are applied and the docs site builds.

Started: 2026-11-05. The Overview (`index.mdx`) is already done.

## Pages

| #   | Group          | Page                                     | Source                                               | Reviewed | Notes                                                                                             |
| --- | -------------- | ---------------------------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| 0.1 | 0. Foundations | `foundations/design-tokens.mdx`          | `kit/packages/tokens`                                | [x]      | 2026-11-05. Added an "In Figma" section (variable names).                                         |
| 0.2 | 0. Foundations | `foundations/colors.mdx`                 | `kit/packages/tokens`, Figma variables               | [x]      | 2026-11-06. New page, plus Figma page "Colors" (482:575).                                         |
| 0.3 | 0. Foundations | `foundations/typography.mdx`             | `kit/packages/tokens`, `ui/src/fonts.css`            | [x]      | 2026-11-06. Added "In Figma": 16 text styles bound to the typography variables.                   |
| 0.4 | 0. Foundations | `foundations/space-and-size.mdx`         | `kit/packages/tokens`, Figma variables               | [x]      | 2026-11-06. New page, plus Figma page "Space and size" (485:576).                                 |
| 0.5 | 0. Foundations | `foundations/shape.mdx`                  | `kit/packages/tokens`, Figma variables               | [x]      | 2026-11-06. New page, plus Figma page "Shape" (485:577).                                          |
| 0.6 | 0. Foundations | `foundations/elevation.mdx`              | `kit/packages/tokens` (surfaces), component specs    | [x]      | 2026-11-06. New page, plus Figma page "Elevation" (485:578). Flat model, no shadow tokens yet.    |
| 0.7 | 0. Foundations | `foundations/icons.mdx`                  | `ui/src/icons/Icon`                                  | [ ]      |                                                                                                   |
| 0.8 | 0. Foundations | `foundations/shared-types.mdx`           | `ui/src/types`                                       | [ ]      |                                                                                                   |
| 1.1 | 1. Layout      | `layout/stack-layout.mdx`                | `ui/src/components/layout/StackLayout`               | [ ]      |                                                                                                   |
| 1.2 | 1. Layout      | `layout/column-layout.mdx`               | `ui/src/components/layout/ColumnLayout`              | [ ]      |                                                                                                   |
| 1.3 | 1. Layout      | `layout/content-section.mdx`             | `ui/src/components/layout/ContentSection`            | [ ]      |                                                                                                   |
| 1.4 | 1. Layout      | `layout/floor-section.mdx`               | `ui/src/components/layout/FloorSection`              | [ ]      |                                                                                                   |
| 1.5 | 1. Layout      | `layout/card.mdx`                        | `ui/src/components/layout/Card`                      | [ ]      |                                                                                                   |
| 1.6 | 1. Layout      | `layout/list.mdx`                        | `ui/src/components/layout/List`                      | [ ]      | Also documents `ListItem`.                                                                        |
| 1.7 | 1. Layout      | `layout/icon-tile.mdx`                   | `ui/src/components/layout/IconTile`                  | [ ]      |                                                                                                   |
| 2.1 | 2. Context     | `context/sensor-label.mdx`               | `ui/src/components/context/SensorLabel`              | [ ]      |                                                                                                   |
| 2.2 | 2. Context     | `context/space-label.mdx`                | `ui/src/components/context/SpaceLabel`               | [ ]      |                                                                                                   |
| 2.3 | 2. Context     | `context/asset-label.mdx`                | `ui/src/components/context/AssetLabel`               | [ ]      |                                                                                                   |
| 2.4 | 2. Context     | `context/alert-rule-label.mdx`           | `ui/src/components/context/AlertRuleLabel`           | [ ]      |                                                                                                   |
| 2.5 | 2. Context     | `context/space-list-item.mdx`            | `ui/src/components/context/SpaceListItem`            | [ ]      |                                                                                                   |
| 2.6 | 2. Context     | `context/relative-time.mdx`              | `ui/src/components/context/RelativeTime`             | [ ]      |                                                                                                   |
| 3.1 | 3. Readings    | `readings/reading-value.mdx`             | `ui/src/components/readings/ReadingValue`            | [ ]      |                                                                                                   |
| 3.2 | 3. Readings    | `readings/state-value.mdx`               | `ui/src/components/readings/StateValue`              | [ ]      |                                                                                                   |
| 3.3 | 3. Readings    | `readings/operational-state-value.mdx`   | `ui/src/components/readings/OperationalStateValue`   | [ ]      |                                                                                                   |
| 3.4 | 3. Readings    | `readings/detection-status.mdx`          | `ui/src/components/readings/DetectionStatus`         | [ ]      |                                                                                                   |
| 3.5 | 3. Readings    | `readings/unit-label.mdx`                | `ui/src/components/readings/UnitLabel`               | [ ]      |                                                                                                   |
| 3.6 | 3. Readings    | `readings/sensor-reading.mdx`            | `ui/src/components/readings/SensorReading`           | [ ]      |                                                                                                   |
| 3.7 | 3. Readings    | `readings/sensor-state.mdx`              | `ui/src/components/readings/SensorState`             | [ ]      |                                                                                                   |
| 3.8 | 3. Readings    | `readings/device-card.mdx`               | `ui/src/components/readings/DeviceCard`              | [ ]      | Renamed from `ModuleCard` (2026-11-08). Figma still has the Switch and `state=off`; code doesn't. |
| 3.9 | 3. Readings    | `readings/space-card.mdx`                | `ui/src/components/readings/SpaceCard`               | [ ]      |                                                                                                   |
| 4.1 | 4. Status      | `status/device-connection-status.mdx`    | `ui/src/components/status/DeviceConnectionStatus`    | [ ]      | Stale is Modules only (decided 2026-11-05).                                                       |
| 4.2 | 4. Status      | `status/device-pairing-status.mdx`       | `ui/src/components/status/DevicePairingStatus`       | [ ]      |                                                                                                   |
| 4.3 | 4. Status      | `status/device-fault-status.mdx`         | `ui/src/components/status/DeviceFaultStatus`         | [ ]      |                                                                                                   |
| 4.4 | 4. Status      | `status/device-list-item.mdx`            | `ui/src/components/status/DeviceListItem`            | [ ]      |                                                                                                   |
| 4.5 | 4. Status      | `status/alert-list-item.mdx`             | `ui/src/components/status/AlertListItem`             | [ ]      |                                                                                                   |
| 5.1 | 5. Feedback    | `feedback/inline-message.mdx`            | `ui/src/components/feedback/InlineMessage`           | [ ]      | Not in the Figma library yet.                                                                     |
| 5.2 | 5. Feedback    | `feedback/badge.mdx`                     | `ui/src/components/feedback/Badge`                   | [ ]      |                                                                                                   |
| 5.3 | 5. Feedback    | `feedback/alert-banner.mdx`              | `ui/src/components/feedback/AlertBanner`             | [ ]      |                                                                                                   |
| 5.4 | 5. Feedback    | `feedback/empty-state.mdx`               | `ui/src/components/feedback/EmptyState`              | [ ]      |                                                                                                   |
| 6.1 | 6. Controls    | `controls/switch.mdx`                    | `ui/src/components/controls/Switch`                  | [ ]      |                                                                                                   |
| 6.2 | 6. Controls    | `controls/power-control.mdx`             | `ui/src/components/controls/PowerControl`            | [ ]      |                                                                                                   |
| 6.3 | 6. Controls    | `controls/open-close-control.mdx`        | `ui/src/components/controls/OpenCloseControl`        | [ ]      |                                                                                                   |
| 6.4 | 6. Controls    | `controls/state-select-control.mdx`      | `ui/src/components/controls/StateSelectControl`      | [ ]      |                                                                                                   |
| 6.5 | 6. Controls    | `controls/value-control.mdx`             | `ui/src/components/controls/ValueControl`            | [ ]      |                                                                                                   |
| 6.6 | 6. Controls    | `controls/operational-state-control.mdx` | `ui/src/components/controls/OperationalStateControl` | [ ]      |                                                                                                   |
| 6.7 | 6. Controls    | `controls/button.mdx`                    | `ui/src/components/controls/Button`                  | [ ]      | Not in the Figma library yet.                                                                     |
| 6.8 | 6. Controls    | `controls/icon-button.mdx`               | `ui/src/components/controls/IconButton`              | [ ]      |                                                                                                   |
| 7.1 | 7. Navigation  | `navigation/location-path.mdx`           | `ui/src/components/navigation/LocationPath`          | [ ]      | Moved from Context on 2026-11-06.                                                                 |
| 7.2 | 7. Navigation  | `navigation/top-bar.mdx`                 | `ui/src/components/navigation/TopBar`                | [ ]      |                                                                                                   |
| 7.3 | 7. Navigation  | `navigation/bottom-nav.mdx`              | `ui/src/components/navigation/BottomNav`             | [ ]      |                                                                                                   |

Every public component in `ui/src/index.ts` has a page above (50 pages, plus the Overview). `ListItem` is on the List page, and `Icon` on the Icons page. Internal helpers such as `ControlParts` have no page. If a component is added, add its page here.

## What to check on each page

From the `smart-home-kit-copywriting` quality gate, plus what the Get Started and Domain Model reviews turned up:

1. **Page settings:** `title`, `description` (160 characters or fewer) and `keywords`. No hand-written `#` heading.
2. **Accuracy:** every prop, type, default and value matches the component's `.types.ts` and `.tsx`. No props, hooks or packages that don't exist yet (like `useSensor` or the `react` package).
3. **Figma and code match:** Figma property and variant names match the React props. Mismatches are noted here, not hidden in the text.
4. **Domain words:** Glossary terms used exactly. Stale is for Modules only. No hardware details (Raspberry Pi, board models) and no planned parts (API Simulator, Hub software) presented as available.
5. **Live examples:** realistic smart home data, and they run.
6. **Accessibility:** keyboard, roles, focus and accessible names are covered where the component is interactive or announces changes.
7. **Writing:** American English, "you", short sentences, no "simply", "just" or "easy". No internal notes (Figma node IDs, open questions).
8. **Structure:** the sections from "How to read a component page" on the Overview, in that order, and a "Related" section at the end.
9. **Checks pass:** `pnpm format:check` and `pnpm turbo run build --filter=docs-site...` with no broken links.
