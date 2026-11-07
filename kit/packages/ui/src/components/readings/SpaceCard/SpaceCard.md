# SpaceCard

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/space-card.mdx). Props are defined in [`SpaceCard.types.ts`](./SpaceCard.types.ts).

### Purpose

Shows one Space at a glance: its name, its Faults and one row per Metric with the latest Reading. It is the building block of whole-home screens: a Site overview shows one SpaceCard per Space instead of a `ModuleCard` for every Module. Passing only some Metrics answers prompts like "temperature in every room".

It only puts existing components together: [`SensorLabel`](../../context/SensorLabel/SensorLabel.md), [`ReadingValue`](../ReadingValue/ReadingValue.md), [`UnitLabel`](../UnitLabel/UnitLabel.md), [`DeviceConnectionStatus`](../../status/DeviceConnectionStatus/DeviceConnectionStatus.md) and [`DeviceFaultStatus`](../../status/DeviceFaultStatus/DeviceFaultStatus.md). It adds the card, the rows and the Space name.

It is read-only and takes props only. It has no Switch and calculates nothing.

Figma: `SpaceCard` component set in _DeTriz - Smart Home Kit_ (node `402:246`), page `SpaceCard`. Variant property `state`, boolean property `hasFault` (default off). Each variant shows four rows (Temperature, Humidity, CO₂, Illuminance). Hide rows on an instance for fewer Metrics. The `SpaceCard examples` frame (node `402:247`) shows Fault, One Metric, `LongText` and `Minimal`.

### Component in domain model context

Category: **Readings** ("What is it right now?"). Most of the card is current values.

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx):

| Part   | Domain term           | Example            | Shown by                 |
| ------ | --------------------- | ------------------ | ------------------------ |
| name   | **Space** (its name)  | Bedroom            | `SpaceCard`              |
| fault  | **Fault**             | CO₂ sensor failure | `DeviceFaultStatus`      |
| label  | **Metric**            | Temperature        | `SensorLabel`            |
| value  | **Reading**           | 21.5               | `ReadingValue`           |
| unit   | **Unit**              | °C                 | `UnitLabel`              |
| status | **Connection Status** | Stale              | `DeviceConnectionStatus` |

Domain rules behind it:

- **A Space has no status.** Only Devices do, and a Space can hold zero or more Hubs, so one status for the whole card would be invented. Each row carries the Connection Status of the Module its Reading comes from.
- **No averages.** An average isn't a Reading. If a Space has two Modules measuring the same Metric, the parent decides which one to show (see Open questions).

What it does **not** show, and why:

- **Module names.** The card is about the Space. Which Module a row comes from is `ModuleCard`'s job.
- **Pairing Status.** Only Paired Modules send Readings.
- **Site, Floor.** `LocationPath` shows where the Space is.
- **Time of the Reading.** Not part of this card yet, same as `SensorReading`.

### Visual idea

| Question                        | Answer                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A white card like `ModuleCard`: the Space name on top, Faults below it, then a list of rows.         |
| Icons?                          | Only those of its parts (Metric icons, `refresh`, `link_off`, `error`, the status dot).              |
| Separators?                     | No. Each row is a line: label on the left, value on the right.                                       |
| More than one layout?           | No. One stacked layout. Rows never wrap the value.                                                   |
| Text size                       | Name `h4`. Label `SensorLabel xs`. Value and Unit `sm`. Status: `DeviceConnectionStatus`'s own size. |

```
┌───────────────────────────────────┐
│ Bedroom                           │   name
│ (!) CO₂ sensor failure            │   faults
│ 🌡 Temperature          21.5 °C   │   row
│ 💧 Humidity               48 %RH  │   row
│ ☁ CO₂                   840 ppm   │   row
│ ☀ Illuminance   Stale ● 120 lx    │   row, Stale
└───────────────────────────────────┘
```

The card fills the width its parent gives it. The Space name stays on one line and ends with "…", and the full name shows on hover (same as `ModuleCard`). The value, Unit and status never truncate. When a row has no room for the label and the reading side by side, the reading moves onto a line below the label (the row wraps). The `LongText` example needs this: "Illuminance · Stale · 100,000 lx" doesn't fit on one line in 240px.

### States

Figma variant property `state`. In code there is no `state` prop: each row works out its own state from its `connectionStatus` and `value`, first match wins:

1. `connectionStatus` is `disconnected` → `disconnected`: value hidden, `link_off` icon.
2. `value` is `null` → `loading`: spinning `refresh` icon.
3. `connectionStatus` is `stale` → `stale`: the last value stays, and a `DeviceConnectionStatus` "Stale" shows beside it.
4. Otherwise → `connected`: the value.

**Connecting** has no state of its own, same rule as `SensorReading`: the parent passes the last value to keep showing it, or `null` to show `loading`.

The Figma `state` variants show every row in the same state, so each one can be checked. Real cards mix row states.

| State          | Figma value          | Row shows                       | Screen reader (one row)                    |
| -------------- | -------------------- | ------------------------------- | ------------------------------------------ |
| `connected`    | `state=connected`    | Temperature · 21.5 °C           | "Temperature, 21.5 degrees Celsius"        |
| `loading`      | `state=loading`      | Temperature · ⟳ °C              | "Temperature, Loading"                     |
| `stale`        | `state=stale`        | Temperature · Stale ● · 21.5 °C | "Temperature, Stale, 21.5 degrees Celsius" |
| `disconnected` | `state=disconnected` | Temperature · link_off °C       | "Temperature, Disconnected"                |

Fault is not a state: `hasFault` in Figma (`faults` in code) adds the Faults on top of any state.

Target states:

| Target state | Applies? | Why                                                                          |
| ------------ | -------- | ---------------------------------------------------------------------------- |
| loading      | yes      | The `loading` row state.                                                     |
| Connected    | yes      | The `connected` row state.                                                   |
| Stale        | yes      | The `stale` row state: the row says Stale.                                   |
| Disconnected | yes      | The `disconnected` row state. The value is **hidden**, as the glossary says. |
| Fault        | yes      | `faults`, shown with `DeviceFaultStatus` under the name, in any state.       |

### Anatomy

```
root               <div role="group">     card: background, outline, padding
├── name           <span id>              Space name, names the group
├── faults         <ul>                   only when there are Faults
│   └── fault      <li>                   DeviceFaultStatus
└── readings       <ul>                   one row per Metric
    └── row        <li>                   label left, reading right
        ├── SensorLabel  size="xs"
        └── reading     <span>            status (only when Stale), value, Unit
            ├── DeviceConnectionStatus  status="stale"
            ├── ReadingValue  size="sm"
            └── unit    <span aria-hidden?>  UnitLabel size="sm"
```

Figma layer names follow this anatomy. The `unit` wrapper exists only in code (it carries `aria-hidden`).

### API

The props are defined in [`SpaceCard.types.ts`](./SpaceCard.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `readings` is a list with one row per Metric, not one prop per Metric, so the card works for any set of Metrics. The Metric is the row's React key, so each Metric appears once.
- `connectionStatus` sits on each row, not on the card: a Space has no status, and its rows can come from different Modules.
- Each item in `faults` is the same `faultCode` and `metric` that `DeviceFaultStatus` takes, passed on unchanged.
- At least one row. A Space with no Paired Modules gets a message instead of the card (the user docs page says so; the renderer's `Notice` is planned).

### Example values

| Use              | name                             | readings                                                              | faults                          |
| ---------------- | -------------------------------- | --------------------------------------------------------------------- | ------------------------------- |
| Connected        | Bedroom                          | Temperature 21.5 °C, Humidity 48 %RH, CO₂ 840 ppm, Illuminance 120 lx | —                               |
| Loading          | Bedroom                          | The same four rows, every `value` `null` (connecting)                 | —                               |
| Stale            | Bedroom                          | The same four rows, every row stale                                   | —                               |
| Disconnected     | Bedroom                          | The same four rows, every row disconnected                            | —                               |
| Fault            | Living room                      | CO₂ 1,250 ppm                                                         | CO₂ sensor failure              |
| One Metric only  | Bedroom                          | Temperature 21.5 °C                                                   | —                               |
| `LongText` story | Living room by the garden window | Illuminance 100,000 lx (stale), PM2.5 12 µg/m³, 240px wide            | CO₂ sensor calibration required |
| `Minimal` story  | Hall                             | Illuminance 0 lx                                                      | —                               |

Stories: `Connected`, `Loading`, `Stale`, `Disconnected`, `Fault`, `OneMetric`, `LongText`, `Minimal`.

### Tokens

Same card as `ModuleCard`. Confirmed in the step 3 review: every Figma value is bound to one of these variables, and every token exists in `tokens.css`. The parts bring their own tokens.

As in `ModuleCard`, Figma draws the outline inside the card, so in CSS the padding is `calc(var(--shk-space-4) - var(--shk-border-width-thin))`.

| Part     | Property         | Figma variable        | Code token                  |
| -------- | ---------------- | --------------------- | --------------------------- |
| root     | background       | `surface/default`     | `--shk-surface-default`     |
| root     | border colour    | `color-border/subtle` | `--shk-color-border-subtle` |
| root     | border width     | `border-width/thin`   | `--shk-border-width-thin`   |
| root     | corner radius    | `radius/16`           | `--shk-radius-16`           |
| root     | padding          | `space/4`             | `--shk-space-4`             |
| root     | gap              | `space/3`             | `--shk-space-3`             |
| name     | text             | `typography/h4/*`     | `--shk-typography-h4-*`     |
| name     | colour           | `color-text/primary`  | `--shk-color-text-primary`  |
| faults   | gap              | `space/1`             | `--shk-space-1`             |
| readings | gap              | `space/2`             | `--shk-space-2`             |
| row      | gap              | `space/2`             | `--shk-space-2`             |
| row      | gap when wrapped | `space/1`             | `--shk-space-1`             |
| reading  | gap              | `space/1`             | `--shk-space-1`             |

### Accessibility

- `root` is a `<div role="group">` named by the Space name (`aria-labelledby` → `name`), the same pattern as `ModuleCard`.
- `faults` and `readings` are real lists with `role="list"` (Safari drops list semantics once bullets are removed).
- Each row reads label first, then the status (when Stale), then the value.
- Not colour alone: Stale has a text label, Disconnected its own icon, a Fault its icon and message.
- No live region for Readings. `DeviceConnectionStatus` has `role="status"` already, so a row going Stale is announced. On a Site screen many rows can go Stale at once and each one is announced. This is accepted for now (see Open questions).

### Open questions

- **Two Modules, one Metric.** If a Space has two Climate Modules, which Temperature does the parent pass? The card shows whatever it gets, and never averages.
- **Fault without a Metric.** "Sensor failure" in a Space with several Modules doesn't say which Module. Should `faults` carry the Module Name?
- **Look of the Stale row** (designer's call): the `DeviceConnectionStatus` beside the value (current draft), or the value in a muted colour plus "Stale".
- **Heading.** Should the Space name be a heading? Same question as `ModuleCard`.
- **Row height per state** (designer's call): loading and disconnected rows are 2px taller than connected rows (the `sm` icon is taller than the `sm` text), so the card grows 8px when four rows lose their values. `SensorReading` keeps one height in every state. **Accepted for now:** the code follows Figma. To change it, give `row` a fixed height in Figma and a `min-block-size` in CSS.
- **Many Stale announcements.** Each Stale row has its own `role="status"`. If this is too noisy on a Site screen, the card could announce one summary instead.

### State rows (Phase 2, 2026-11-07)

- A row is a number row (unchanged) or a State row: `state`, optional `asset` (names the row with `AssetLabel`), `alertLevel`, and for Motion, Smoke and CO `detectedSince` / `lastDetectedAt` (the row then shows `DetectionStatus` instead of `StateValue`).
- Row keys are the Metric plus the Asset's name, so several Contact rows (Front door, Hall window) work.
- State rows centre the pill vertically (`data-kind="state"`), number rows keep baseline alignment.
- Figma: the `SpaceCard with States` example (node `596:261`) shows the recipe: in a SpaceCard instance, swap the row's SensorLabel to AssetLabel, ReadingValue to StateValue or DetectionStatus, and hide the UnitLabel. The rows aren't components, so the component itself is unchanged.
