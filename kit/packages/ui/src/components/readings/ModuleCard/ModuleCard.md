# ModuleCard

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/module-card.mdx). Props are defined in [`ModuleCard.types.ts`](./ModuleCard.types.ts).

### Purpose

Shows one Module as a card: its name, its Connection Status, its Faults and the latest Reading of each of its Sensors. A Module has one to three Sensors, so the card shows one to three `SensorReading`s.

It is used wherever a user looks at their Modules, for example a Space overview in an app built with the kit.

It only puts existing components together: [`SensorReading`](../SensorReading/SensorReading.md), [`DeviceConnectionStatus`](../../status/DeviceConnectionStatus/DeviceConnectionStatus.md), and [`DeviceFaultStatus`](../../status/DeviceFaultStatus/DeviceFaultStatus.md). It adds the card around them, passes the Module's state down to them and rearranges them to fit the space it gets.

It takes props only and is read-only: it has no controls.

Figma: `ModuleCard` component set in _DeTriz - Smart Home Kit_ (node `349:591`), page `ModuleCard`. Variant properties `layout` and `state`, boolean properties `hasFault`, `hasSecondSensor` and `hasThirdSensor`. The `ModuleCard examples` frame shows a Fault, one Sensor and three Sensors.

Figma matches the code: the `state=off` variant and the Switch layer were removed from Figma on 2026-11-07 (the kit is sensor-only).

### Component in domain model context

Category: **Readings** ("What is it right now?"). A composite keeps the category of its main job, and this card is the current values.

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx):

| Part    | Domain term             | Example            | Shown by                 |
| ------- | ----------------------- | ------------------ | ------------------------ |
| name    | **Module Name**         | Climate Module     | `ModuleCard`             |
| status  | **Connection Status**   | Connected          | `DeviceConnectionStatus` |
| faults  | **Fault**               | CO₂ sensor failure | `DeviceFaultStatus`      |
| sensors | **Sensor**, **Reading** | 22.4 °C            | `SensorReading`          |

A Module has **one or more** Sensors ([Data model](/kit/apps/docs-site/docs/domain-model/data-model.mdx#cardinality-summary)), and **one Sensor per Metric**. The second rule is not in the Data model yet (see Open questions), but the card relies on it: it uses the Metric to tell Sensors apart. The Sensors are fixed by the Module's board, so the user never adds or removes one.

What it does **not** show, and why:

- **Several Modules side by side.** A Hub can have several Modules wired to it. Placing those cards is the job of a separate Layout component, because a card shouldn't know about its neighbours.
- **Pairing Status.** Only Paired Modules have a Connection Status, so only Paired Modules get a ModuleCard. An Unpaired Module ("New module found") belongs to another component.
- **Hub, Space, Site.** Where the Module sits is `LocationPath`.
- **Time of the Reading** ("Last update 5 min ago"). Context, not part of this card yet.

### Visual idea

| Question                        | Answer                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A white card: the name and status on top, any Faults below them, then the Sensors.                    |
| Icons?                          | Only those of its parts.                                                                              |
| Separators?                     | No. The cards inside (`SensorReading`) separate the Sensors.                                          |
| More than one layout?           | Yes, two, chosen automatically by the card's own width: `row` and `stacked`. See [Layouts](#layouts). |
| Text size                       | Name: `h4`. Everything else comes from its parts.                                                     |

```
row (wide)                                      stacked (narrow)
┌───────────────────────────────────────────┐   ┌───────────────┐
│ Climate Module               Connected ●  │   │ Climate Module│
│ ┌───────────────┐ ┌───────────────┐       │   │ Connected ●   │
│ │ 🌡 Temperature │ │ 💧 Humidity    │       │   │ ┌───────────┐ │
│ │ 22.4 °C       │ │ 48 %RH        │       │   │ │ Temperature│ │
│ └───────────────┘ └───────────────┘       │   │ │ 22.4 °C   │ │
└───────────────────────────────────────────┘   │ └───────────┘ │
                                                │ │ Humidity  │ │
                                                │ │ 48 %RH    │ │
                                                │ └───────────┘ │
                                                └───────────────┘
```

### Layouts

The card fills the width its parent gives it and arranges itself. There is no `layout` prop, and it looks at **its own width, not the screen's** (a CSS container query). This way it also works in a narrow column on a big screen.

A Sensor is never narrower than **160px**, the width `SensorReading` is designed for. Above that, the Sensors share the row equally, so they grow with the card. The switching widths follow from that: Sensors × 160px, plus 12px gaps, plus 16px padding on each side.

| Card width   | Header                                | One Sensor | Two Sensors | Three Sensors |
| ------------ | ------------------------------------- | ---------- | ----------- | ------------- |
| Under 364px  | Name, status below it                 | Full width | Stacked     | Stacked       |
| 364 to 535px | Name on the left, status on the right | Full width | One row     | Stacked       |
| 536px and up | Name on the left, status on the right | Full width | One row     | One row       |

Three Sensors are never split into two rows: they all sit in one row, or all stack.

`row` means Sensors side by side and `stacked` means one under the other.

These two names are for Figma frames and this spec only. In code they are CSS, not a prop.

A container query measures the space inside the card, without its padding and border. So the CSS uses 332px and 504px for the 364px and 536px card widths in the table above.

The card needs a parent that gives it a width, such as a block or a grid cell. It gets its width from its parent, not from its content.

The Module Name can be long, because the user can rename it. It stays on one line and ends with "…", and the full name shows on hover. The status label never shrinks. The value and the Unit never truncate (rule from `SensorReading`).

### States

Figma variant property `state`. In code there is no `state` prop: the card works it out from `connectionStatus` and the Sensors' values.

| State          | Figma value          | When                                                       | Status label | Sensors                    |
| -------------- | -------------------- | ---------------------------------------------------------- | ------------ | -------------------------- |
| `loading`      | `state=loading`      | The first Readings are on their way (`value` is `null`).   | Connecting   | Spinning icon, per Sensor  |
| `connected`    | `state=connected`    | Reachable and sending Readings.                            | Connected    | The values                 |
| `stale`        | `state=stale`        | Connected, but no Reading within its Expected Interval.    | Stale        | The last values, unchanged |
| `disconnected` | `state=disconnected` | The Module can't be reached, for example it was unplugged. | Disconnected | Hidden, disconnected icon  |

The card follows `connectionStatus`. Each `SensorReading` picks up its own `loading` from a `null` value. In `disconnected`, the card passes `isDisconnected` to every `SensorReading`.

**Connecting** has no state of its own, same rule as `SensorReading`: the status label says "Connecting", and the parent passes the last values to keep showing them, or `null` to show `loading`.

When an unplugged Module is plugged back in, the parent passes `connectionStatus` `connecting`. It then follows the normal path to Connected.

Target states:

| Target state | Applies? | Why                                                                                                                                             |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| loading      | yes      | The `loading` state.                                                                                                                            |
| Connected    | yes      | The `connected` state.                                                                                                                          |
| Stale        | yes      | The `stale` state. `SensorReading` has no Stale state: only the status label changes, as `SensorReading.md` expects.                            |
| Disconnected | yes      | The `disconnected` state. Values are **hidden**, as the glossary says.                                                                          |
| Fault        | yes      | Not a state of its own: `faults` adds one `DeviceFaultStatus` per Fault on top of any state, because a Module can be Connected and have Faults. |

### Anatomy

```
root               <div role="group">    card: background, padding, stacks the parts
├── header         <div>                 name and status
│   ├── name       <span id>             gives the group its name
│   └── DeviceConnectionStatus
├── DeviceFaultStatus                    one per Fault, under the header (none when there are no Faults)
├── sensors        <ul>                  one row, or a stack
│   └── sensor     <li>                  one per Sensor
│       └── SensorReading  size="md"
```

1. **root**: the card, and the element whose width decides the layout.
2. **header**: holds the name and the status. A real element in code, because it needs its own arrangement in each layout.
3. **name**: has an `id`, so `root` can point to it with `aria-labelledby`.
4. **sensors**: a list, because the Sensors are a group of equal items. Holds only `li`s, so any Figma `row` frame inside it doesn't become an element.
5. **sensor**: one list item. `SensorReading` fills it.

Figma layer names follow this anatomy. In Figma, `hasFault` stands for a non-empty `faults` list, and `hasSecondSensor` and `hasThirdSensor` stand for the length of `sensors`.

### API

The props are defined in [`ModuleCard.types.ts`](./ModuleCard.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `sensors` is a list, not `temperatureC` / `humidityPct` props, because the card works with any Module Type. This is the "sensor-agnostic" rule from the conventions.
- The list order is the display order. The parent decides it.
- `connectionStatus` is required because only Paired Modules get a ModuleCard.
- Each item in `faults` is the same `faultCode` and `metric` that `DeviceFaultStatus` takes, passed on unchanged. Each Fault shows once, and `metric` names the affected Sensor in the message. `SensorReading` doesn't change. Faults stay visible in `disconnected`, because a Fault stays until **Fault Cleared**.
- `faults` is a list because a Device can report several Faults at once, one per Fault Code. The card uses the Fault Code as the React key.
- More than three Sensors isn't blocked, but no Module has that many today, and the layouts are only designed up to three.

### Example values

Stories render in English. Which Sensors each Module Type has is not written down in the domain docs yet: these are assumed from the glossary examples.

| Use              | name                                  | sensors                                     | connectionStatus | faults                                               | Shows                                           |
| ---------------- | ------------------------------------- | ------------------------------------------- | ---------------- | ---------------------------------------------------- | ----------------------------------------------- |
| Connected        | Climate Module                        | Temperature 22.4 °C, Humidity 48 %RH        | `connected`      | none                                                 | Two Sensors, Connected                          |
| Loading          | Climate Module                        | Temperature `null`, Humidity `null`         | `connecting`     | none                                                 | Two spinning icons, Connecting                  |
| Stale            | Light Module                          | Illuminance 320 lx                          | `stale`          | none                                                 | One Sensor, Stale                               |
| Disconnected     | Climate Module                        | Temperature 22.4 °C, Humidity 48 %RH        | `disconnected`   | none                                                 | Values hidden, disconnected icon                |
| Fault            | Air Quality Module                    | CO₂ 1,250 ppm                               | `connected`      | `sensor_failure` (CO₂)                               | Value still shown, plus CO₂ sensor failure      |
| Several Faults   | Air Quality Module                    | CO₂ 1,250 ppm, VOC 120 ppb, PM2.5 12 µg/m³  | `connected`      | `sensor_failure` (CO₂), `calibration_required` (VOC) | Two Fault messages above the Sensors            |
| Three Sensors    | Air Quality Module                    | CO₂ 1,250 ppm, VOC 120 ppb, PM2.5 12 µg/m³  | `connected`      | none                                                 | Three in one row                                |
| `LongText` story | Living room air quality by the window | Temperature 22.4 °C, Illuminance 100,000 lx | `connected`      | none                                                 | Name ends with "…", Sensors stacked, 240px wide |
| `Minimal` story  | Light Module                          | Illuminance 0 lx                            | `connected`      | none                                                 | One Sensor                                      |

Stories: `Connected`, `Loading`, `Stale`, `Disconnected`, `Fault`, `SeveralFaults`, `ThreeSensors`, `Stacked`, `LongText`, `Minimal`.

### Tokens

The parts bring their own tokens. ModuleCard only adds the card and the spacing between the parts.

| Part    | Property      | Figma variable        | Code token                      |
| ------- | ------------- | --------------------- | ------------------------------- |
| root    | background    | `surface/default`     | `--shk-surface-default`         |
| root    | border colour | `color-border/subtle` | `--shk-color-border-subtle`     |
| root    | border width  | `border-width/thin`   | `--shk-border-width-thin` (1px) |
| root    | corner radius | `radius/16`           | `--shk-radius-16` (16px)        |
| root    | padding       | `space/4`             | `--shk-space-4` (16px)          |
| root    | gap           | `space/3`             | `--shk-space-3` (12px)          |
| sensors | gap           | `space/3`             | `--shk-space-3` (12px)          |
| name    | text          | `typography/h4/*`     | `--shk-typography-h4-*`         |
| name    | colour        | `color-text/primary`  | `--shk-color-text-primary`      |

The Figma `row` variants are 364px wide (two 160px Sensors) and `stacked` 192px (one 160px Sensor). The card fills its parent, so these are the smallest widths.

The container query widths (332px, 504px) are raw values, an exception to the tokens-only rule: CSS doesn't allow variables in a container query.

### Accessibility

- `root` is a `<div role="group">` named by the Module's name (`aria-labelledby` → `name`), the same pattern as `SensorReading`.
- Reading order follows the anatomy: name, status, Faults, Sensors. It stays the same in both layouts.
- `sensors` is a real list with `role="list"`, because Safari stops treating a list as a list once its bullets are removed. A screen reader says how many Sensors there are.
- Each `SensorReading` keeps its own spoken name ("Temperature, 22.4 degrees Celsius").
- Not colour alone: `DeviceConnectionStatus` has a text label, and `disconnected` has its own icon.
- No new live region. `DeviceConnectionStatus` already has `role="status"`, so status changes are announced. Readings are not, same rule as `SensorReading`.
- The rest (contrast, reduced motion) comes from the parts.

### Open questions

- **Which Sensors each Module Type has.** Not written down in the domain docs, and "one to three" is the working limit. Add it to the Glossary or the Data model once the supported boards are chosen (domain open question 19).
- **One Sensor per Metric.** The card uses the Metric as each Sensor's key, so it assumes a Module never has two Sensors with the same Metric. The old link for this rule (Domain Analysis) was deleted in the repo cleanup. Add the rule to the Data model, or change the card if it isn't true.
- **Heading.** Should the Module name be a heading for screen-reader navigation? If yes, the card needs a `headingLevel` prop, because it doesn't know where it sits on the page.

### Two-state Sensors (Phase 2, 2026-11-07)

- A Sensor is a number Sensor (`value` + `unit`, shown by `SensorReading`) or a State Sensor (`state`, optional `asset` and `alertLevel`, shown by `SensorState`). Told apart by the `state` field. Existing number Sensors are unchanged.
- The Module's Connection Status applies to both: Disconnected hides the States too.
- Figma: the `ModuleCard with States` example (node `596:741`) swaps the SensorReading instances to `SensorState` (Smoke Clear, CO Detected Critical). The component itself is unchanged.
- Done (2026-11-07): the Switch row and the `state=off` variants were removed from the Figma ModuleCard. It now has `layout` × `state` (connected, loading, stale, disconnected) = 8 variants.
