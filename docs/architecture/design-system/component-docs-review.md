# Component docs review

Tracks the review of every page in the docs site's **UI Components** section (`kit/apps/docs-site/docs/ui-components/`). Each page is reviewed with the `smart-home-kit-copywriting` skill, one at a time, in sidebar order. Tick a page when its fixes are applied and the docs site builds.

Started: 2026-11-05. The Overview (`index.mdx`) is already done.

## Pages

| #   | Group          | Page                                  | Source                                            | Reviewed | Notes                                                                                       |
| --- | -------------- | ------------------------------------- | ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| 0.1 | 0. Foundations | `foundations/design-tokens.mdx`       | `kit/packages/tokens`                             | [x]      | 2026-11-05. Added an "In Figma" section (variable names).                                   |
| 0.2 | 0. Foundations | `foundations/typography.mdx`          | `kit/packages/tokens`, `ui/src/fonts.css`         | [x]      | 2026-11-05. To do: add an "In Figma" section when the text styles are in the Figma library. |
| 0.3 | 0. Foundations | `foundations/icons.mdx`               | `ui/src/icons/Icon`                               | [ ]      |                                                                                             |
| 0.4 | 0. Foundations | `foundations/shared-types.mdx`        | `ui/src/types`                                    | [ ]      |                                                                                             |
| 1.1 | 1. Layout      | `layout/stack-layout.mdx`             | `ui/src/components/layout/StackLayout`            | [ ]      |                                                                                             |
| 1.2 | 1. Layout      | `layout/column-layout.mdx`            | `ui/src/components/layout/ColumnLayout`           | [ ]      |                                                                                             |
| 1.3 | 1. Layout      | `layout/content-section.mdx`          | `ui/src/components/layout/ContentSection`         | [ ]      |                                                                                             |
| 2.1 | 2. Context     | `context/location-path.mdx`           | `ui/src/components/context/LocationPath`          | [ ]      |                                                                                             |
| 2.2 | 2. Context     | `context/sensor-label.mdx`            | `ui/src/components/context/SensorLabel`           | [ ]      |                                                                                             |
| 3.1 | 3. Readings    | `readings/reading-value.mdx`          | `ui/src/components/readings/ReadingValue`         | [ ]      |                                                                                             |
| 3.2 | 3. Readings    | `readings/unit-label.mdx`             | `ui/src/components/readings/UnitLabel`            | [ ]      |                                                                                             |
| 3.3 | 3. Readings    | `readings/sensor-reading.mdx`         | `ui/src/components/readings/SensorReading`        | [ ]      |                                                                                             |
| 3.4 | 3. Readings    | `readings/module-card.mdx`            | `ui/src/components/readings/ModuleCard`           | [ ]      | Figma still has the Switch and `state=off`; code doesn't.                                   |
| 3.5 | 3. Readings    | `readings/space-card.mdx`             | `ui/src/components/readings/SpaceCard`            | [ ]      |                                                                                             |
| 4.1 | 4. Status      | `status/device-connection-status.mdx` | `ui/src/components/status/DeviceConnectionStatus` | [ ]      | Stale is Modules only (decided 2026-11-05).                                                 |
| 4.2 | 4. Status      | `status/device-pairing-status.mdx`    | `ui/src/components/status/DevicePairingStatus`    | [ ]      |                                                                                             |
| 4.3 | 4. Status      | `status/device-fault-status.mdx`      | `ui/src/components/status/DeviceFaultStatus`      | [ ]      |                                                                                             |
| 5.1 | 5. Feedback    | `feedback/inline-message.mdx`         | `ui/src/components/feedback/InlineMessage`        | [ ]      | Not in the Figma library yet.                                                               |
| 6.1 | 6. Controls    | `controls/button.mdx`                 | `ui/src/components/controls/Button`               | [ ]      | Not in the Figma library yet.                                                               |
| 6.2 | 6. Controls    | `controls/switch.mdx`                 | `ui/src/components/controls/Switch`               | [ ]      |                                                                                             |

All 17 public exports of `ui/src/index.ts` are covered: the 16 components above plus `Icon` (on the Icons page). If a component is added, add its page here.

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
