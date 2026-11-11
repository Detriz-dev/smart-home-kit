# SensorReading

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/sensor-reading.mdx). Props are defined in [`SensorReading.types.ts`](./SensorReading.types.ts).

### Purpose

Shows the latest Reading of one Sensor as a small card: what is measured on top ("Temperature"), the value and its Unit below ("22.4 °C"). It is the building block of a Module overview: `DeviceCard` shows one SensorReading per Sensor in the Module. It can also stand on its own, for example in a Space overview.

It only puts three existing components together: [`SensorLabel`](../../context/SensorLabel/SensorLabel.md), [`ReadingValue`](../ReadingValue/ReadingValue.md) and [`UnitLabel`](../UnitLabel/UnitLabel.md). It adds the card around them, keeps their sizes in step and gives the group one spoken name.

It is read-only. It has no status label: that belongs to the Module, so `DeviceCard` shows it once for all its Sensors.

Figma: `SensorReading` component set in _DeTriz - Smart Home Kit_ (node `310:32`), page `SensorReading`.

### Component in domain model context

Category: **Readings** ("What is it right now?"). A composite keeps the category of its main job, and its main job is the current value.

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx):

| Part  | Domain term                                                                                      | Example     | Shown by       |
| ----- | ------------------------------------------------------------------------------------------------ | ----------- | -------------- |
| label | **Metric** (names the [Sensor](/kit/apps/docs-site/docs/domain-model/glossary.mdx#capabilities)) | Temperature | `SensorLabel`  |
| value | **Reading** (its value)                                                                          | 22.4        | `ReadingValue` |
| unit  | **Unit**                                                                                         | °C          | `UnitLabel`    |

A Sensor measures exactly one Metric, so the Metric name is enough to name the Sensor (same reasoning as in `SensorLabel`).

What it does **not** show, and why:

- **Connection Status as a label** ("Connected", "Stale"). A Sensor is not a Device and has no status of its own. The status belongs to the Module, and `DeviceCard` shows it once for all its Sensors. SensorReading only reacts to **Disconnected**, through `ReadingValue` (the value is hidden).
- **A Device-wide Fault.** A Fault with no Metric is about the whole Device, so `DeviceCard` shows it in its body. A Fault about this Sensor does show here: see `faults` below.
- **Module, Space, Site.** Where the Sensor sits is `LocationPath` or the `DeviceCard` header.
- **Time of the Reading** ("Updated 5 s ago"). Context, not part of this card yet.

Pairing Status doesn't apply: an Unpaired Module sends no Readings, so there is no SensorReading to show.

### Visual idea

| Question                        | Answer                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A small white card with a thin light-grey outline and rounded corners. Label on top, value below.    |
| Icons?                          | Only those of its parts: the Metric icon in `SensorLabel`, `refresh` / `link_off` in `ReadingValue`. |
| Separators?                     | No.                                                                                                  |
| More than one layout or size?   | One layout (stacked). Two sizes: `lg` and `md`.                                                      |
| Text size                       | Caption label (`SensorLabel xs`) in both sizes. Value and Unit follow `size`.                        |

```
┌─────────────────────┐
│ 🌡 Temperature       │   label
│ 22.4 °C             │   reading (value + unit on one baseline)
└─────────────────────┘
```

The Unit sits on the same **baseline** as the number, not raised (rule from `UnitLabel`).

The card fills the width its parent gives it. The label truncates with "…" when there is no room (SensorLabel already does this). The value and the Unit never truncate or wrap: a cut-off number would be wrong, not just short. If the value doesn't fit, the parent uses `size="md"`.

### States

Three states (Figma variant property `state`), the same as `ReadingValue`:

| State          | Figma value          | When                                            | Shows                                       | Screen reader                       |
| -------------- | -------------------- | ----------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| `default`      | `state=default`      | A value is there.                               | Temperature · **22.4** °C                   | "Temperature, 22.4 degrees Celsius" |
| `loading`      | `state=loading`      | No value yet: the first Reading is on its way.  | Temperature · `refresh` icon, spinning · °C | "Temperature, Loading"              |
| `disconnected` | `state=disconnected` | The Module's Connection Status is Disconnected. | Temperature · `link_off` icon · °C          | "Temperature, Disconnected"         |

In code there is no `state` prop. `ReadingValue` picks the state from the props SensorReading passes on, first match wins:

1. `isDisconnected` is true → `disconnected`.
2. `value` is `null` → `loading`.
3. Otherwise → `default`.

The label and the Unit look the same in every state. The Unit stays on screen so the user still sees what was measured when the value is hidden. Screen readers skip it in `loading` and `disconnected`: "Loading degrees Celsius" would sound like a value.

Target states:

| Target state | Applies? | Why                                                                                             |
| ------------ | -------- | ----------------------------------------------------------------------------------------------- |
| loading      | yes      | The `loading` state.                                                                            |
| Connected    | yes      | The `default` state.                                                                            |
| Stale        | no       | The value stays as it is. The Module's `DeviceConnectionStatus` (in `DeviceCard`) says "Stale". |
| Disconnected | yes      | The `disconnected` state. The value is **hidden**, as the glossary says.                        |
| Fault        | yes      | `faults`: one `DeviceFaultStatus` per Fault about this Sensor, under the value, short message.  |

**Connecting** has no state of its own. Same rule as `ReadingValue`: the parent passes the last value to keep showing it, or `null` to show `loading`.

### Sizes

Figma variant property `size`, prop `size`. Default `lg`. SensorReading passes `size` straight to `ReadingValue` and `UnitLabel`. `SensorLabel` stays `xs` in both.

| Size | ReadingValue | UnitLabel                 | SensorLabel | Height (all states) | Use it for                                      |
| ---- | ------------ | ------------------------- | ----------- | ------------------- | ----------------------------------------------- |
| `lg` | `lg` (48px)  | `lg` (`readout`, 32px)    | `xs`        | 93                  | On its own: Space overview, a single Sensor     |
| `md` | `md` (32px)  | `md` (`readout-sm`, 20px) | `xs`        | 75                  | Tight spaces, e.g. a column inside `DeviceCard` |

All states of one size have the same height, so nothing moves when the state changes.

Checked in Storybook against Figma (160px wide): the browser draws the card **2px shorter** than Figma (`lg` 91, `md` 73). Figma's baseline alignment pushes the Unit 2px lower than the browser does, the same font difference `UnitLabel` describes. Widths, padding, gaps and the outline match. This difference is accepted.

`LongText` (100,000 lx at `md`) fits a 160px column with 1px to spare. At `lg` it would not fit, so `DeviceCard` columns use `md`.

`sm` and `xs` are left out on purpose: at those sizes the value belongs in a list row or a table, not in a card.

### Anatomy

```
root               <div role="group">       card: background, outline, padding
├── label          <span id>                wraps SensorLabel (gives the group its name)
│   └── SensorLabel  size="xs"
└── reading        <span>                   one row, baseline-aligned
    ├── ReadingValue size={size}
    └── unit         <span aria-hidden?>    hidden from screen readers when there is no value
        └── UnitLabel  size={size}
```

1. **root**: the card. Stacks `label` and `reading` with a small gap. No `overflow: hidden`: the value must never be cut off.
2. **label**: a wrapper around `SensorLabel` with an `id`, so `root` can point to it with `aria-labelledby`. `SensorLabel` has no `id` prop of its own.
3. **reading**: puts the value and the Unit side by side on one baseline. Never wraps.
4. **unit**: a wrapper around `UnitLabel`. Gets `aria-hidden="true"` in `loading` and `disconnected` (when `value` is `null` or `isDisconnected` is true). `UnitLabel` has no prop for this, so the wrapper does it.

Figma layer names follow this anatomy: the value row is called `reading`. The nested instances keep their component names. The `label` and `unit` wrappers exist only in code (they carry the `id` and `aria-hidden`), so Figma has no layers for them.

### API

The props are defined in [`SensorReading.types.ts`](./SensorReading.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `metric`, `unit`, `value`, `isDisconnected` and `fractionDigits` are passed on unchanged, with the same names and types as in `SensorLabel`, `UnitLabel` and `ReadingValue`. Someone who knows those components already knows this one.
- `unit` is separate from `metric` because one Metric can have more than one display Unit (Temperature: °C or °F). The glossary calls the display Unit "a formatting choice", and formatting choices belong to the parent.
- `isDisconnected` is a yes/no, not a `connectionStatus`, for the same reason as in `ReadingValue`: Stale and Fault don't change this component. `DeviceCard` sets it from the Module's Connection Status.
- `SensorReadingSize` is its own type with two values, not `ReadingValueSize`, so TypeScript stops anyone from passing `sm` or `xs`.

### Example values

From the glossary examples. Figma sample text and the stories use these. Stories render in English.

| Use              | metric        | value                  | unit         | fractionDigits | size | Shows                                                                  |
| ---------------- | ------------- | ---------------------- | ------------ | -------------- | ---- | ---------------------------------------------------------------------- |
| Default          | `temperature` | 22.4                   | `celsius`    | 1              | `lg` | Temperature · 22.4 °C                                                  |
| Humidity         | `humidity`    | 48                     | `percent-rh` | 0              | `lg` | Humidity · 48 %RH                                                      |
| Below zero       | `temperature` | -3.5                   | `celsius`    | 1              | `lg` | Temperature · -3.5 °C                                                  |
| Air quality      | `co2`         | 1250                   | `ppm`        | 0              | `md` | CO₂ · 1,250 ppm                                                        |
| Loading          | `temperature` | null                   | `celsius`    | 1              | `lg` | Temperature · ⟳ °C                                                     |
| Disconnected     | `temperature` | 22.4, `isDisconnected` | `celsius`    | 1              | `lg` | Temperature · link_off °C                                              |
| `LongText` story | `illuminance` | 100000                 | `lux`        | 0              | `md` | Illuminance · 100,000 lx, in a 160px container (a `DeviceCard` column) |
| `Minimal` story  | `illuminance` | 0                      | `lux`        | 0              | `md` | Illuminance · 0 lx                                                     |

Stories: `Default`, `Loading`, `Disconnected`, `SizeMd`, `Fault`, `SeveralFaults`, `LongText`, `Minimal`.

`faults` (2026-11-11): a Fault is shown inside what is faulty. The parent (`DeviceCard`) passes the Fault Codes of the Faults whose Metric is this Sensor's. `DeviceFaultStatus` gets no `metric` here, so the message is short ("Sensor failure"): the label above already names the Sensor. The value stays visible.

### Tokens

The parts (`SensorLabel`, `ReadingValue`, `UnitLabel`) bring their own tokens. SensorReading only adds the card and the spacing between the parts.

| Part    | Property            | Figma variable        | Code token                      | In `tokens.css`? |
| ------- | ------------------- | --------------------- | ------------------------------- | ---------------- |
| root    | background          | `surface/default`     | `--shk-surface-default`         | yes              |
| root    | border colour       | `color-border/subtle` | `--shk-color-border-subtle`     | yes (new)        |
| root    | border width        | `border-width/thin`   | `--shk-border-width-thin` (1px) | yes              |
| root    | corner radius       | `radius/12`           | `--shk-radius-12` (12px)        | yes              |
| root    | padding             | `space/2`             | `--shk-space-2` (8px)           | yes              |
| root    | gap label ↔ reading | `space/1`             | `--shk-space-1` (4px)           | yes              |
| reading | gap value ↔ unit    | `space/1`             | `--shk-space-1` (4px)           | yes              |
| reading | alignment           | Baseline              | `align-items: baseline`         | —                |

`--shk-color-border-subtle` was added for this component (`color-border.json`, points to `palette.gray.100`).

Figma draws the outline **inside** the card (it takes no space). A CSS `border` adds 1px on each side. So in code the padding is one border width smaller, `calc(var(--shk-space-2) - var(--shk-border-width-thin))`, and the card is the same size as in Figma. A `border` is used, not an inset `box-shadow`, because a border stays visible in Windows High Contrast mode.

### Accessibility

- `root` is a `<div role="group">` named by its label (`aria-labelledby` → `label`). A screen reader announces the group as "Temperature" and then reads its content: "22.4 degrees Celsius". This is the spoken name `ReadingValue` asks its parent to give.
- CO₂ and PM2.5 use the spoken name from `SensorLabel` ("carbon dioxide"), because `aria-labelledby` reads the visually hidden copy and skips the `aria-hidden` symbol.
- Not a heading. SensorReading doesn't know where it sits. If a screen needs headings, the parent adds them (see Open questions).
- In `loading` and `disconnected`, `ReadingValue`'s icon has a label ("Loading", "Disconnected"), so the group is never read as empty. The Unit is hidden from screen readers in these states (the `unit` wrapper gets `aria-hidden`), so the group reads "Temperature, Disconnected", not "Disconnected degrees Celsius".
- Not colour alone: `disconnected` has its own icon shape. The outline is decoration only: the card works without it.
- No live region. Readings arrive every few seconds and would keep interrupting. If a screen needs to announce changes, the parent decides how often.
- Contrast: the label and value use gray 900 and the Unit gray 700 on white, all above 4.5:1. The outline (gray 100) is decoration, so it doesn't need 3:1.
- Reduced motion: handled by `ReadingValue` (the loading icon stops spinning).

### Open questions

- **Heading.** Inside `DeviceCard`, should each Metric name be a heading (`<h3>`) for screen-reader navigation? If yes, add an optional `headingLevel` prop then, not now.
- **`fractionDigits` per Metric.** Every parent passes the same precision per Metric (Temperature 1, CO₂ 0). If this repeats in `DeviceCard` and elsewhere, move it into one shared Metric → precision map in `utils/`.
