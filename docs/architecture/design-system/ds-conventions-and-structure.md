
## Table of content
[1. Naming conventions](#1-naming-convention)

[2. UI directory structure](#2-ui-componets-directory-structure)

[3. Components Categorisation](#3-components-categorisation)






## 1. Naming Convention
| Thing | Pattern                                     | Example                                                    |
|---|---------------------------------------------|------------------------------------------------------------|
| Component | PascalCase noun, file name = component name | `ModuleCard.tsx`                                           |
| Page | `<Name>Page.tsx`                            | `DashboardPage.tsx`                                        |
| Hook | `use<Thing>.ts`                             | `useTelemetry.ts`, `useModules.ts`                         |
| Helper function | camelCase verb                              | `formatUnit.ts`                                            |
| Test | next to the file, same name                 | `ModuleCard.test.tsx`, `useTelemetry.test.ts`              |
| Folder | kebab-case                                  | `design-system/`, `features/live-studio/`                  |
| Type / interface | PascalCase noun, no `I` prefix              | `SensorReading`, `ModuleStatus`                            |
| Props type | `<Component>Props`                          | `ModuleCardProps`                                          |
| Union / enum values | lowercase string literals                   | `'temperature' \| 'light' \| 'air-quality'`                |
| Constant | SCREAMING_SNAKE_CASE                        | `MAX_RECONNECT_ATTEMPTS`                                   |
| Boolean | `is/has/can/should` prefix                  | `isOnline`, `hasAlert`                                     |
| Event prop / handler | `on<Event>` prop, `handle<Event>` inside    | `onThresholdChange`, `handleThresholdChange`               |
| Values with units | unit suffix                                 | `temperatureC`, `humidityPct`, `timestampMs`               |
| API function | verb + resource                             | `getModules`, `subscribeToReadings`                        |
| Context / provider | `<Thing>Context`, `<Thing>Provider`         | `TelemetryProvider`                                        |
| CSS token | `--<prefix>-<category>-<role>-<variant>`    | `--shk-color-status-warning`, `--space-4`                  |
| CSS module | same name as component                      | `ModuleCard.module.css`                                    |
| Component states | fixed vocabulary                            | `default`, `loading`, `empty`, `error`, `disconnected`, `stale` |
| Mock / fixture data | `<name>.mock.ts`                            | `readings.mock.ts`                                         |
| Asset | kebab-case, type prefix                     | `icon-air-quality.svg`                                     |
| Route | kebab-case                                  | `/design-system`, `/live-studio`                           |
| Env variable | build-tool prefix + SCREAMING_SNAKE         | `VITE_WS_URL`                                              |
| Barrel file | `index.ts` per exported folder              | `design-system/index.ts`                                   |


## 2. UI directory structure

#### `components/`: the building blocks users see
Holds every UI component the package offers: cards, gauges, charts, status indicators. This is the main thing kit users install @detriz/ui for.
One folder per component, named after the component in PascalCase. All of its files live inside:
```
packages/ui/src/components/ModuleCard
```

### UI Source directory structure
```
├── src/
│   ├── components/
│   ├── hooks/
│   ├── icons/
│   ├── types/
│   ├── utils/
│   ├── styles.css          ← re-exports token CSS + base styles
│   └── index.ts
```

#### `types/`: shared vocabulary
Holds types used by more than one component. Each component's own props stay in its `<Component>.types.ts`.
- Components import types to build their props: `status?: Status`.
- If a type is used by only one component, it stays in that component's folder. Move it to `types/` when a second component needs it.
- `types/` contains types only, no runtime code, so any other folder can import it safely.


#### `utils/`: pure functions
Formatting, conversion and calculations with no React and no side effects: `formatTemperature`, `convertTemperature`, `formatTimeAgo`, `getStatusFromThresholds`.
- Components never format values inline. They call a util, so every component shows 21.4 °C the same way.
- Utils take plain values and return plain values, which makes them easy to test and safe to export to users who don't use React.
- Utils may import from `types/` only.


#### `hooks/`: UI behavior, never data
React hooks that several components share: `useTimeAgo(updatedAtMs)`, `useReducedMotion()`, `useId()` wrappers.
- Hooks handle UI logic such as timers, media queries and focus. They never fetch, open sockets or read app state. That belongs in the future client package.
- A hook may use utils and types, for example `useTimeAgo` uses `formatTimeAgo` and re-renders every few seconds.
- If logic is used by only one component, keep it inside that component's folder.



#### `icons/`: visual symbols
React components for icons: status icons (`IconWarning`, `IconOffline`) and module types (`IconTemperature`, `IconAirQuality`).
- Icons are components, so they follow component rules: they accept `size` and `className`, use `currentColor`, and are `aria-hidden` by default.
- Components pair status icons with status colors, so status is never shown by color alone.
- Icons import nothing except types.


### How components use other direcctories 
```
types  ←  utils  ←  hooks  ←  components
                   icons  ←   components
@detriz-sh-kit/tokens  ←  components (via CSS)
```
**The rule:** imports only point down this chain. A util never imports a hook, a hook never imports a component, and nothing imports from components/ except other components.

## 3. Components Categorisation

Components in the DeTriz Home design system are grouped by **the question they answer** for the person looking at the screen, not by sensor type. Components are sensor-agnostic: the sensor is passed in through props (e.g. `<ReadingCard sensor="temperature" />`).

| Category | Question it answers | What belongs here | Components |
|---|---|---|---|
| **Context** | "Where is this / what is it?" | Static, descriptive information about places, sensors, devices and time. Never changes on its own. | |
| **Readings** | "What is it right now?" | The current values of a single measurement or a single Module. | |
| **History** | "How has it changed?" | Data over time: trends, past values, summaries. | |
| **Comparison** | "How do sensors relate to each other?" | Several sensors or metrics shown together. | |
| **Status** | "Is everything OK?" | Changing state of the physical world or hardware: health, connection, alerts. | |
| **Feedback** | "What is the interface doing?" | State of the UI and data flow: loading, empty, errors, confirmations. | |
| **Controls** | "How do I change what I see?" | Inputs that change the view or settings. | |
| **Layout** | "How is it arranged?" | Structure and spacing for placing other components. | |

## Rules for placing a component

- **One component, one category.** If a component fits two categories, it's probably doing two jobs and should be split or treated as a composition.
- **Composites keep the category of their main job.** A `ReadingCard` that uses `SensorLabel` inside stays in **Readings**.
- **Context vs Status:** Context is a fixed fact ("Floor 2", "Updated 5 s ago"). Status is a changing state ("Offline", "Battery low", "Air quality: poor").
- **Status vs Feedback:** Status describes the hardware or environment. Feedback describes the interface ("Loading…", "Couldn't fetch data").
- **Clickable means Controls.** If a descriptive component becomes interactive (e.g. a clickable location path), the interactive version belongs in **Controls**.
- **Sensor support is metadata, not a category.** Label each component with the sensors it works with (e.g. "works with: temperature · light · air quality").

## Variant naming

Variants describe **shape, not device**, so they can be chosen based on available space:

| Prop | Values | Meaning |
|---|---|---|
| `layout` | `inline` | All items in one row |
| | `grid` | Items in a 2×2 arrangement |
| | `stack` | One item per row |

Use the same property name and values in Figma and in code.