# Design system conventions and structure

The naming rules, folder structure and component categories for `@detriz-sh-kit/ui` (`kit/packages/ui`). How to build a component step by step: [component building workflow](./workflows/component-building.md).

## Table of contents

- [1. Naming convention](#1-naming-convention)
- [2. UI directory structure](#2-ui-directory-structure)
- [3. Components categorisation](#3-components-categorisation)
- [Rules for placing a component](#rules-for-placing-a-component)
- [Variant naming](#variant-naming)

## 1. Naming convention

Use the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) terms in every name: Site, Space, Device, Sensor, Metric, Reading, and so on.

| Thing                | Pattern                                     | Example                                                    |
| -------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| Component            | PascalCase noun, file name = component name | `DeviceCard.tsx`                                           |
| Hook                 | `use<Thing>.ts`                             | `useRelativeTime.ts` (no shared hooks yet)                 |
| Helper function      | camelCase                                   | `formatReadingValue.ts`, `formatTime.ts`                   |
| Test                 | next to the file, same name                 | `DeviceCard.test.tsx` (no tests yet)                       |
| Folder               | kebab-case, except component folders        | `design-system/`, `ui-components/`                         |
| Component folder     | PascalCase, inside its category folder      | `components/readings/DeviceCard/`                          |
| Category folder      | the category in lowercase                   | `context/`, `readings/`, `controls/`                       |
| Type / interface     | PascalCase noun, no `I` prefix              | `ConnectionStatus`, `MeasuredMetric`                       |
| Props type           | `<Component>Props`                          | `DeviceCardProps`                                          |
| Union values         | lowercase string literals                   | `"connecting" \| "connected" \| "stale" \| "disconnected"` |
| Constant             | SCREAMING_SNAKE_CASE                        | `STATE_NAMES`, `METRIC_ICONS`                              |
| Boolean              | `is/has/can/should` prefix                  | `isDisabled`, `hasDividers`                                |
| Event prop / handler | `on<Event>` prop, `handle<Event>` inside    | `onAction`, `handleAction`                                 |
| Values with units    | unit suffix                                 | `temperatureC`, `humidityPct`, `timestampMs`               |
| Context / provider   | `<Thing>Context`, `<Thing>Provider`         | `LinkProvider`                                             |
| CSS token            | `--shk-<category>-<role>-<variant>`         | `--shk-color-text-secondary`                               |
| CSS module           | same name as component                      | `DeviceCard.module.css`                                    |
| Component states     | Glossary terms (Status, Readings, Controls) | loading, Connected, Stale, Disconnected, Fault             |
| Docs page            | kebab-case of the component name            | `ui-components/readings/device-card.mdx`                   |
| Barrel file          | `index.ts` per component folder             | `components/readings/DeviceCard/index.ts`                  |

## 2. UI directory structure

### UI source directory structure

```
kit/packages/ui/
├── scripts/
│   └── generate-icons.mjs   ← builds src/icons/generated/ from icons.config.ts
└── src/
    ├── components/
    │   └── <category>/<Name>/  ← one folder per component, grouped by category
    ├── examples/            ← example screens (Storybook only, not exported)
    ├── hooks/               ← shared UI hooks (empty for now)
    ├── icons/
    ├── link/                ← LinkProvider: lets apps plug in their router's link
    ├── types/
    ├── utils/
    ├── fonts.css            ← the kit's fonts
    └── index.ts             ← the public API: only what is exported here can be imported
```

#### `components/`: the building blocks users see

Every UI component the package offers: labels, readings, cards, status indicators, controls, layout and navigation. One folder per component, named after the component in PascalCase, inside the folder of its category:

```
kit/packages/ui/src/components/readings/DeviceCard/
├── DeviceCard.md            ← internal spec (Figma, states, anatomy, open questions)
├── DeviceCard.types.ts      ← DeviceCardProps, with a /** */ comment on every prop
├── DeviceCard.tsx
├── DeviceCard.module.css    ← wrapped in @layer detriz, var(--shk-…) tokens only
├── DeviceCard.stories.tsx   ← one story per state or variant, plus LongText and Minimal
└── index.ts
```

Two exceptions:

- **Components that only combine other components** may skip `<Name>.module.css`. For example, `PowerControl`, `OpenCloseControl` and `OperationalStateControl` use the shared classes from `ControlParts`, and `SpaceListItem` is built on `ListItem`.
- **Internal helpers** that are not exported from `src/index.ts`, such as `controls/ControlParts`, need only a spec, the code and `index.ts`. They have no stories and no docs page, because users never use them directly.

#### `types/`: shared vocabulary

Types used by more than one component, named after the Glossary: `metric.ts`, `state.ts`, `alert.ts`, `command.ts`, `operationalState.ts` and so on. Each component's own props stay in its `<Name>.types.ts`.

- Components import types to build their props: `metric: MeasuredMetric`.
- If a type is used by only one component, it stays in that component's folder. Move it to `types/` when a second component needs it.
- `types/` contains types only, no runtime code, so any other folder can import it safely.

#### `utils/`: pure functions

Formatting and labels with no React and no side effects: `formatReadingValue`, `formatTime`, `metricNames`, `stateNames`, `unitNames`, `faultNames`, `alertCountLabel`.

- Components never format values inline. They call a util, so every component shows 21.4 °C the same way.
- Utils take plain values and return plain values, which makes them easy to test and safe to export to users who don't use React.
- Utils may import from `types/` only.

#### `hooks/`: UI behavior, never data

Empty for now. React hooks that several components share go here, for example a timer that re-renders `RelativeTime`.

- Hooks handle UI logic such as timers, media queries and focus. They never fetch, open sockets or read app state. That belongs in the planned `client` and `react` packages.
- A hook may use utils and types.
- If logic is used by only one component, keep it inside that component's folder.

#### `icons/`: visual symbols

One `Icon` component and a curated set of Material Symbols (Rounded, weight 400). How to add one: [add an icon](./workflows/add-icon-to-design-system-workflow.md).

- `icons.config.ts` lists the icons. `generated/paths.ts` is written by the script, so never edit it by hand.
- `purposeIcons.ts` maps meanings to icons (`METRIC_ICONS`, `STATE_ICONS`, `ALERT_LEVEL_ICONS` …), so the same meaning always gets the same icon.
- Icons use `currentColor` and are decorative (`aria-hidden`) unless they get a label.
- Components pair status icons with status colors, so status is never shown by color alone.

### How components use other directories

```
types  ←  utils  ←  hooks  ←  components
                   icons  ←   components
                   link   ←   components
@detriz-sh-kit/tokens  ←  components (via CSS)
```

**The rule:** imports only point down this chain. A util never imports a hook, a hook never imports a component, and nothing imports from `components/` except other components.

## 3. Components categorisation

Components are grouped by **the question they answer** for the person looking at the screen, not by Sensor or Device type. Components are Metric-agnostic: the Metric is passed in through props (for example `<SensorReading metric="temperature" … />`).

| Category       | Question it answers                        | What belongs here                                                                                                                                     | Components                                                                                                                                       |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Context**    | "What is it?"                              | Static, descriptive information about Sensors, Spaces, Assets, Alert Rules and time. (Where things are is Navigation.) Never changes on its own.      | `SensorLabel`, `SpaceLabel`, `AssetLabel`, `AlertRuleLabel`, `RelativeTime`, `SpaceListItem`                                                     |
| **Readings**   | "What is it right now?"                    | The current value of one Reading, one Device or one Space.                                                                                            | `ReadingValue`, `UnitLabel`, `StateValue`, `OperationalStateValue`, `SensorReading`, `SensorState`, `DetectionStatus`, `DeviceCard`, `SpaceCard` |
| **History**    | "How has it changed?"                      | Data over time: trends, past values, summaries.                                                                                                       | None yet                                                                                                                                         |
| **Comparison** | "How do Sensors relate to each other?"     | Several Sensors or Metrics shown together.                                                                                                            | None yet                                                                                                                                         |
| **Status**     | "Is everything OK?"                        | Changing state of the physical world or hardware: Pairing Status, Connection Status, Faults, Alerts.                                                  | `DeviceConnectionStatus`, `DevicePairingStatus`, `DeviceFaultStatus`, `DeviceListItem`, `AlertListItem`                                          |
| **Feedback**   | "What is the interface doing?"             | State of the UI and data flow: messages, empty screens, counts, banners.                                                                              | `InlineMessage`, `EmptyState`, `Badge`, `AlertBanner`                                                                                            |
| **Controls**   | "How do I change what I see, or a Device?" | Inputs that change the view or settings, and Device Controls that send commands to a Device ([ADR 0002](/docs/adr/0002-devices-and-capabilities.md)). | `Button`, `IconButton`, `Switch`, `PowerControl`, `OpenCloseControl`, `StateSelectControl`, `ValueControl`, `OperationalStateControl`            |
| **Layout**     | "How is it arranged?"                      | Structure and spacing for placing other components.                                                                                                   | `StackLayout`, `ColumnLayout`, `ContentSection`, `FloorSection`, `Card`, `List`, `ListItem`, `IconTile`                                          |
| **Navigation** | "Where am I, and where can I go?"          | Wayfinding: where the person is (Site → Floor → Space → Device) and ways to move between screens (bottom nav, top bar, breadcrumbs).                  | `LocationPath`, `TopBar`, `BottomNav`                                                                                                            |

When you add a component, add it to this table.

## Rules for placing a component

- **One component, one category.** If a component fits two categories, it's probably doing two jobs and should be split or treated as a composition.
- **Composites keep the category of their main job.** `SensorReading` uses `SensorLabel` (Context) inside, but stays in **Readings**.
- **Context vs Status:** Context is a fixed fact ("Floor 2", "Updated 5 s ago"). Status is a changing state ("Disconnected", "Battery low").
- **Status vs Feedback:** Status describes the hardware or environment. Feedback describes the interface ("Loading…", "No Devices yet").
- **Context vs Navigation:** Context names a thing ("Temperature", "Bedroom"). Navigation places the person in the home or takes them somewhere else ("My flat › Floor 2 › Bedroom", a bottom nav).
- **Controls vs Navigation:** Controls change something on the current screen or a Device (a setting, a filter, a Device command). Navigation moves to another screen or view. Tabs that switch views are Navigation; a segmented switch that changes how the same data looks is Controls.
- **Components don't know about routers.** `ui` is presentational, so components take props like `href`, `isCurrent` and `onClick`, and render links through `LinkProvider` ([ADR 0001](/docs/adr/0001-router-links.md)). They never import a routing library.
- **Metric support is metadata, not a category.** Label each component with the Metrics it works with (for example "works with: temperature · humidity · CO2").

## Variant naming

Variants describe **shape, not device**, so they can be chosen based on available space:

| Prop     | Values   | Meaning                    |
| -------- | -------- | -------------------------- |
| `layout` | `inline` | All items in one row       |
|          | `grid`   | Items in a 2×2 arrangement |
|          | `stack`  | One item per row           |

`LocationPath` uses these values today. Use the same property name and values in Figma and in code.
