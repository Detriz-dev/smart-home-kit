# Design system components review for generative UI

A review of the current `@detriz-sh-kit/ui` components against the [generative UI concept](generative-ui-concept.md). It answers two questions: what can the model build with today, and which components are the minimum to add?

Terms follow the [Ubiquitous Language](../architecture/domain-model/ubiquitous-language.md). "The whole home" means one Site with several Spaces.

## Table of contents

- [Summary](#summary)
- [MVP scope](#mvp-scope)
- [Current components](#current-components)
- [Gaps that block generation](#gaps-that-block-generation)
- [Minimum components to add](#minimum-components-to-add)
- [Changes to existing components](#changes-to-existing-components)
- [The MVP Catalog](#the-mvp-catalog)
- [Prompt coverage](#prompt-coverage)
- [Other work the components depend on](#other-work-the-components-depend-on)
- [Build order](#build-order)
- [The bigger list](#the-bigger-list)
- [Open questions](#open-questions)

## Summary

The kit shows one Module well, but it can't yet arrange a screen or describe a whole Site.

**The minimum is 7 new components and 1 change to an existing one:**

| Purpose | Add or change | Count |
| --- | --- | --- |
| Generated screen | `StackLayout`, `ColumnLayout`, `ContentSection`, `SpaceCard`, `Notice` | 5 new |
| Studio around the screen | `Button`, `TextArea` | 2 new |
| Existing component | `ModuleCard`: a read-only mode and an `emphasis` prop | 1 change |

The model then chooses from just 6 components. Fewer than the concept's first list, because three existing components are unsafe or unclear when used alone. See [Current components](#current-components).

## MVP scope

| In | Out for now |
| --- | --- |
| One Site with several Spaces and no Floors | Several Sites, Floors |
| Climate, Light and Air Quality Modules | New Metrics such as motion, door contact or leak |
| The six Metrics in the fixed list | Assets |
| Current Readings, Connection Status and Fault | Reading history, Thresholds, Typical Ranges |
| Read-only screens | Turning Modules On or Off from a generated screen |
| Prompt to screen, then a simple refinement | Three directions side by side, sharing, export |
| Mock data | The real Hub |

No new Metrics are needed. `temperature`, `humidity`, `illuminance`, `co2`, `voc` and `pm25` already work in `SensorLabel`, `UnitLabel` and `ReadingValue`.

## Current components

"Catalog" means the model may choose the component directly. Everything else stays available to developers, but the model doesn't see it.

| Component | Category | In the MVP Catalog? | Why |
| --- | --- | --- | --- |
| `ModuleCard` | Readings | Yes, after a change | The main building block. It handles every target state by itself. |
| `LocationPath` | Context | Yes | Says where the screen is. |
| `SensorReading` | Readings | No | Alone it shows no Module, Space, Stale or Fault. A Stale value would look live. |
| `DeviceConnectionStatus` | Status | No | "Stale" means nothing without a Device name beside it. `ModuleCard` already includes it. |
| `DeviceFaultStatus` | Status | No | Same reason. `ModuleCard` already includes it. |
| `DevicePairingStatus` | Status | No | Generated screens only show Paired Modules. Pairing belongs to setup. |
| `Switch` | Controls | No | MVP screens are read-only. |
| `ReadingValue`, `UnitLabel`, `SensorLabel` | Readings, Context | No | Low-level parts, as the concept says. |
| `Icon` | Foundation | No | The model could use it to invent meaning. Components choose their own icons. |

The concept's first Catalog lists `SensorReading`, `DeviceConnectionStatus` and `DeviceFaultStatus`. This review removes them for the MVP. They can return once a component gives them the context they lack, such as the attention list in [the bigger list](#the-bigger-list).

## Gaps that block generation

| Gap | What happens today | Fixed by |
| --- | --- | --- |
| Nothing arranges components | The Layout category is empty, so the model has no way to express "what goes where". | `StackLayout`, `ColumnLayout` |
| No page title or groups | The View Spec has a `title`, but nothing shows it. Nothing can group "Air quality" apart from "Comfort". | `ContentSection` |
| No whole-home view | Four Spaces with four Modules each means 16 `ModuleCard`s, with no hierarchy. | `SpaceCard` |
| No Metric comparison across Spaces | "Temperature in every room" gives identical "Temperature" labels with nothing to tell them apart. | `SpaceCard` |
| No hierarchy inside a card | `ModuleCard` always draws Sensors at `md`, so "make CO₂ bigger" isn't possible. | `emphasis` on `ModuleCard` |
| The Switch is always shown | `onToggle` is required, so "read-only" isn't possible and "remove the Switches" has no answer. | Read-only `ModuleCard` |
| No way to report a limit | Empty Space, removed Module and "that isn't available" have no component. | `Notice` |
| No inputs at all | The only control is `Switch`. A person can't type a prompt or answer a question. | `Button`, `TextArea` |

## Minimum components to add

### `StackLayout` (Layout, small)

Places children in one column with an even gap. It's the root of most screens. `gap` is a named option, never pixels.

### `ColumnLayout` (Layout, medium)

Places children side by side, and it's how the model shows importance.

| `ratio` | Use |
| --- | --- |
| `equal` | Items of the same importance. Wraps onto new rows, so it also serves as the Site grid. |
| `2:1`, `1:2` | One main item and one supporting item. |

Like `ModuleCard`, it uses a container query, so it looks at its own width rather than the screen's. In a narrow space it becomes one column. Reading order always follows the View Spec order, so screen readers and the visual layout agree.

One component with these few ratios is deliberate. A separate `Grid` would be one more choice for the model to get wrong.

### `ContentSection` (Layout, small)

A heading with a group of children. `title` is plain text from the model, with a length limit in the schema. The renderer works out the heading level from nesting, so the model can't break the heading order.

### `SpaceCard` (Readings, medium)

One Space at a glance: the whole-home building block.

```
┌───────────────────────────────┐
│ Bedroom                       │
│ ⚠ CO₂ sensor failure          │
│ Temperature      21.5 °C      │
│ Humidity         48 %RH       │
│ CO₂              840 ppm      │
│ Illuminance      120 lx Stale │
└───────────────────────────────┘
```

```ts
interface SpaceCardReading {
  /** The Metric the Sensor measures. */
  metric: Metric;
  /** The latest value. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. */
  unit: UnitLabelUnit;
  /** How many decimal places to show. */
  fractionDigits?: number;
  /** Connection Status of the Module this Reading comes from. */
  connectionStatus: ConnectionStatus;
}

interface SpaceCardProps {
  /** The Space name, e.g. "Bedroom". */
  name: string;
  /** One row per Metric, in display order. */
  readings: SpaceCardReading[];
  /** Current Faults in this Space's Modules. Leave it out when there are none. */
  faults?: DeviceFaultStatusProps[];
}
```

Domain rules behind this design:

- **A Space has no status.** Only Devices do, and a Space can hold zero or more Hubs, so one status for the whole Space would be invented. Each row carries the Connection Status of its own Module.
- **No averages.** An average isn't a Reading, so the card never calculates one.
- **The target states stay per row.** A row from a Disconnected Module hides its value and shows the disconnected icon. A row from a Stale Module says Stale. It follows `SensorReading`'s states, in a smaller layout.
- **No Switch.** It only shows information.

The same card answers "temperature in every room". The View Spec gives it a `metrics` list, and the renderer passes only those rows:

```json
{ "type": "SpaceCard", "spaceId": "bedroom", "metrics": ["temperature"] }
```

### `Notice` (Feedback, small)

A short message with a `tone` of `info`, `warning` or `error`, using the existing status tokens. Tone is never shown by colour alone.

| Where | Example | Who chooses it |
| --- | --- | --- |
| Empty Space | "The Bedroom has no Paired Modules." | Renderer |
| Stale reference | "This Module was removed." | Renderer |
| Partly possible | "Noise isn't a Metric the kit measures." | Studio |
| Rationale | "Air quality is largest because you asked for it first." | Studio |
| Failed | "The screen couldn't be built. Your prompt is saved." | Studio |

The model never places a `Notice` in the View Spec. It would otherwise be able to write statements about the Site that aren't true. The name also avoids `Alert`, which is kept for a crossed Threshold.

### `Button` (Controls, small)

For sending a prompt, retrying, undoing and answering a clarifying question ("Which Space?"). Each option is a `Button`, so a separate chip component isn't needed yet. It isn't in the Catalog.

### `TextArea` (Controls, small)

The prompt box. It needs a visible label, an error message and a disabled state for while the screen builds. It isn't in the Catalog.

## Changes to existing components

Both changes affect `ModuleCard`, so they count as one piece of work. Update `ModuleCard.md`, the stories and Figma with them.

### Read-only mode

Make `onToggle` optional. Without it, no Switch is drawn.

**One thing to keep:** today the Switch is the only way to tell Off from Disconnected, because both show the label Disconnected and hidden values. In read-only mode, an Off Module needs a plain "Off" text where the Switch would be. Otherwise the card hides why the Module has no values.

MVP screens are always read-only: the renderer never passes `onToggle`. This fits the rule that real-world actions need confirmation. It also makes "Turn everything off" safe by design.

### `emphasis`

Add `emphasis?: "default" | "high"`. `high` draws the Sensors at `lg` instead of `md`.

`SensorReading.md` notes that `lg` doesn't fit the longest value in a 160px column. So `high` needs a wider minimum Sensor width, and the switching widths in the `ModuleCard` layout table need updating.

To focus on one Metric, the View Spec uses the same `metrics` list as `SpaceCard`. The renderer shortens `sensors`, so that part needs no change in `ui`.

## The MVP Catalog

| Group | Components | Status |
| --- | --- | --- |
| Layout | `StackLayout`, `ColumnLayout`, `ContentSection` | To build |
| Context | `LocationPath` | Exists |
| Readings | `ModuleCard` | Exists, needs a change |
| Readings | `SpaceCard` | To build |

Rules to write in the Catalog:

- Whole Site: one `SpaceCard` per Space.
- One Space: one `ModuleCard` per Module.
- Don't show the same Space as a `SpaceCard` and as `ModuleCard`s on one screen.
- Use `2:1` or `high` only for what the person asked to prioritise, and only once per screen.

## Prompt coverage

A check that the minimum is enough. These prompts can also become evals.

| Prompt | Built from | Result |
| --- | --- | --- |
| "A page for the bedroom" | `ContentSection`, `LocationPath`, `ColumnLayout`, `ModuleCard` | Works |
| "Overview of my home" | `ContentSection`, `ColumnLayout`, `SpaceCard` | Works |
| "Air quality first" | `ColumnLayout` at `2:1`, `ModuleCard` with `emphasis` | Works |
| "Temperature in every room" | `ColumnLayout`, `SpaceCard` with `metrics` | Works |
| "Make CO₂ bigger" | `ModuleCard` with `metrics` and `emphasis` | Works |
| "Show the room" with several Spaces | `Button` options in Studio | Asks which Space |
| "Turn everything off" | Nothing in the View Spec can act | Explains it can't |
| "Show the noise level" | The rest of the screen, plus `Notice` | Partly possible |
| "How was CO₂ last night?" | `Notice` | Not available: needs `HistoryChart` |
| "Which Modules need attention?" | All Modules, plus `Notice` | Partly possible: the model never sees statuses, so filtering needs its own component |
| "Is the air OK?" | The Readings, plus `Notice` | Partly possible: no Thresholds yet, so no verdict |

## Other work the components depend on

These aren't `ui` components, but the MVP can't run without them:

- **`LiveModuleCard` and `LiveSpaceCard`** in `@detriz-sh-kit/react`, or simple mock versions. `LiveSpaceCard` replaces `LiveSensorReading` from the concept.
- **Site inventory** listing Spaces, their Modules and each Module's Metrics.
- **One Metric display table:** the Unit and decimal places for each Metric. `ui` leaves this to the parent, so the Live layer needs one shared source.
- **Mock data:** three or four Spaces, including Stale, Disconnected, Off, Fault and an empty Space.

## Build order

| Step | Build | Unlocks |
| --- | --- | --- |
| 1 | `StackLayout`, `ColumnLayout`, `ContentSection` | Build plan step 1: hand-written View Specs |
| 2 | `ModuleCard` read-only mode and `emphasis` | Space screens with hierarchy |
| 3 | `SpaceCard` | Whole-home screens |
| 4 | `Notice` | Empty and removed-Module cases in the renderer |
| 5 | `Button`, `TextArea` | Build plan step 4: the Studio page |

Steps 1 to 4 need no AI, so you can test them in Storybook with View Specs written by hand.

## The bigger list

None of this is needed for the MVP. **Bold** items are the next ones to add, in order of how many prompts they unlock.

| Category | Component | What it adds |
| --- | --- | --- |
| History | **`HistoryChart`** | Trends over time. Needs Reading history and is the largest gap after the MVP. |
| History | `Sparkline`, `ReadingSummary` | A small trend inside a card, and min, max and average for a period. |
| Status | **`AttentionList`** | Lists Modules that are Stale, Disconnected or have a Fault, and filters live so the model doesn't need statuses. Also answers "Which Modules are Stale?" for the Site Assistant. |
| Status | `HubCard` | A Hub's Connection Status, Slots and Modules. |
| Status | `Alert`, `ThresholdStatus` | A crossed Threshold. Waits for the Insight context. |
| Context | **`LastUpdated`** | "Last update 5 min ago". It makes Stale easier to understand, and both `ModuleCard` and `SensorReading` leave it out for now. |
| Context | **`TypicalRange`** | "CO₂ 1,200 ppm: stuffy". Needs the Insight context to define its ranges. |
| Context | `AssetLabel`, `SpaceTypeIcon` | Assets as a Subject, and icons per Space Type. |
| Context | `SimulatedBadge` | Labels simulated or replayed sessions. |
| Comparison | `MetricComparison` | Several Spaces or Metrics in one view, beyond what `SpaceCard` offers. |
| Readings | `Gauge`, `StatusTile` | Planned in the architecture and roadmap. Only worth adding once Typical Ranges give a gauge its scale. |
| Readings | `SpaceSummary` | The one-sentence Space Snapshot from product ideation. |
| Feedback | `Skeleton` | Screens that appear piece by piece. Needs streaming. |
| Feedback | `EmptyState`, `Toast` | Larger empty screens, and short confirmations. |
| Controls | `TimeRangePicker`, `UnitToggle`, `Tabs` | History ranges, °C or °F, switching views. |
| Controls | `ChoiceChips`, `PromptInput` | Replace `Button` options and `TextArea` when the prompt experience matures. |
| Layout | `PageHeader`, `CompareFrame` | Page-level actions, and the three directions side by side. |
| Studio | `RationalePanel`, `VersionList`, `DiffHighlight` | Fuller rationale, version history, and what changed after a refinement. |
| New domain | Motion, door and leak components | These need new Metrics and on or off values, which `ReadingValue` doesn't cover because it only shows numbers. |

## Open questions

- **Which Sensors does each Module Type have?** `ModuleCard.md` already flags that this isn't documented. The Site inventory needs an answer, so it has to be settled before mock data. The working assumption: Climate has Temperature and Humidity, Light has Illuminance, and Air Quality has CO₂, VOC and PM2.5.
- **What if a Space has two Modules with the same Metric?** It can happen, because a Space can hold several Hubs. For the MVP, mock data avoids the case. Later, `SpaceCard` needs a rule, and averaging isn't an option.
- **Do `Button` and `TextArea` belong in `ui` or in Studio?** This review puts them in `ui`, because every later Controls feature needs them.
