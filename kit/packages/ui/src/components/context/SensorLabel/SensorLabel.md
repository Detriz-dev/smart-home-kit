# SensorLabel

### Purpose

Says what a Sensor measures: an icon and the name of its Metric, like 🌡 Temperature. It sits at the top of a reading card, in list rows and in table headers, so the user knows what the number next to it is about.

It is display-only and never changes on its own. It looks the same when the value is loading or the Device is Disconnected, so the user still knows _what_ was measured when the number is hidden.

Figma: `SensorLabel` component set in _DeTriz - Smart Home Kit_ (node `224:34`). Long-name example: frame `SensorLabel / usage` (node `235:6`).

Storybook: `Context/SensorLabel`.

### Component in domain model context

Category: **Context** ("Where is this / what is it?"). Which Metric a Sensor measures is a fixed fact. A `ReadingCard` that uses SensorLabel inside still stays in **Readings** (see [Rules for placing a component](/docs/architecture/design-system/ds-conventions-and-structure.md#rules-for-placing-a-component)).

It shows the Metric of one Sensor, from [How is tracked](/docs/architecture/domain-model/ubiquitous-language.md#how-is-tracked) and [What is tracked](/docs/architecture/domain-model/ubiquitous-language.md#what-is-tracked):

| Part  | Domain term                | Example     | Rule                                                                                            |
| ----- | -------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| icon  | **Metric**                 | thermostat  | One fixed icon per Metric. The parent can't change it, so a Metric looks the same everywhere.   |
| label | **Metric** (of the Sensor) | Temperature | The Metric's name. A Sensor produces Readings for exactly one Metric, so this names the Sensor. |

The parent passes the Metric. The icon and the text both follow from it.

What it does **not** show, and why:

- **The value and the Unit** ("22.4 °C"). That is `ReadingValue` and `UnitLabel`, in **Readings**.
- **Where the Sensor is** (Space, Module). That is `LocationPath`. A Sensor has no location of its own: it uses its Module's.
- **The Subject** (Bedroom, Kitchen tap). What a Reading is about is a different question from what is measured. Not shown for now.
- **Connection Status, Fault.** Those belong to the Device, and they are Status. A Sensor is not a Device and has no status of its own.

### Visual idea

| Question                        | Answer                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| What does it roughly look like? | An icon followed by a short name: 🌡 Temperature                                                 |
| Icons?                          | Yes, one, before the label. Fixed per Metric.                                                   |
| Separators?                     | No. The gap between the icon and the label is enough.                                           |
| More than one layout or size?   | One layout. Four sizes: `xs`, `sm`, `md`, `lg`.                                                 |
| Text and icon size              | Body-family text, from caption (12px) to body-lg (18px). Icons from 16px to 24px, see Variants. |

Plain text and an icon only: no chip, badge or background (those would look clickable or like a status). The icon and the label use the same colour, so the label reads as one unit.

### States

SensorLabel is Context, so it has no states of its own. What changes between versions is the **Metric** and the **size** (see Variants).

Target states:

| Target state | Applies? | Why                                                                                                                     |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| loading      | no       | The Metric is known before the first Reading arrives. The label stays visible above `ReadingValue`'s loading icon.      |
| Connected    | no       | Connection Status belongs to the Device. Shown by `DeviceConnectionStatus`.                                             |
| Stale        | no       | Same as above.                                                                                                          |
| Disconnected | no       | The **value** is hidden (by `ReadingValue`), the label is not. Next to the disconnected icon it says what was measured. |
| Fault        | no       | Fault is Status.                                                                                                        |

Pairing Status doesn't apply either: the Metric belongs to the Sensor, not to the Device's registration.

### Variants

**Metric** (prop `metric`). A fixed list, one value per Metric in the glossary. In Figma this is not a variant property: change the label text and swap the icon on the instance.

| Value         | Label       | Screen reader  | Icon           | In `icons.config.ts`? |
| ------------- | ----------- | -------------- | -------------- | --------------------- |
| `temperature` | Temperature | Temperature    | `thermostat`   | yes                   |
| `humidity`    | Humidity    | Humidity       | `humidity_mid` | yes                   |
| `illuminance` | Illuminance | Illuminance    | `light_mode`   | yes                   |
| `co2`         | CO₂         | carbon dioxide | `co2`          | yes                   |
| `voc`         | VOC         | VOC            | `airwave`      | yes                   |
| `pm25`        | PM2.5       | PM 2.5         | `grain`        | yes                   |

The label uses the subscript `₂` (U+2082) in "CO₂", the same character the glossary uses.

**Size** (Figma variant property `size`, prop `size`). Default `xs`, the same size as `LocationPath`, so the two sit well together in a card header.

| Size | Icon                  | Text style            | Icon ↔ label gap | Use it when                        |
| ---- | --------------------- | --------------------- | ---------------- | ---------------------------------- |
| `xs` | `Icon size="xs"` 16px | caption 12 / 18 / 400 | `space-1` (4px)  | Card headers, list rows. Default.  |
| `sm` | `Icon size="sm"` 20px | body-sm 14 / 21 / 400 | `space-1` (4px)  | Table headers, roomier cards.      |
| `md` | `Icon size="md"` 24px | body 16 / 24 / 400    | `space-2` (8px)  | Detail views.                      |
| `lg` | `Icon size="md"` 24px | body-lg 18 / 27 / 400 | `space-2` (8px)  | The main heading of a detail view. |

`lg` uses the 24px icon, not the 32px one: next to 18px text, a 32px icon looked too heavy. So `md` and `lg` differ only in text size.

Figma: 4 variants, named `size=<size>`.

### Anatomy

```
root            (size=xs | sm | md | lg)
├── icon        thermostat
├── label       "Temperature"
└── spokenName  "carbon dioxide"   (co2 and pm25 only; visually hidden, read by screen readers)
```

1. **root**: puts the icon and the label in one row, centred vertically. No padding and no background: spacing around it belongs to the parent. In code, the size is a `data-size` attribute, so the CSS can pick the text style and gap.
2. **icon**: says which Metric it is at a glance. Decorative for screen readers (see Accessibility).
3. **label**: the Metric's name.
4. **spokenName**: the Metric as it is said, for the labels screen readers read oddly. Visually hidden, like in `UnitLabel`. Only in code; Figma has no layer for it.

Long names: the label shrinks and ends with `…`. The icon never shrinks (the `Icon` component already makes sure of that).

In code, the label, icon and spoken name for each Metric live in one table (`METRICS` in `SensorLabel.tsx`), and the icon size for each size in another (`ICON_SIZES`). Adding a Metric means adding one row to `METRICS`; TypeScript complains until it is there.

### API

```ts
/** The Metric the Sensor measures. Decides the label and the icon. */
type SensorLabelMetric =
  "temperature" | "humidity" | "illuminance" | "co2" | "voc" | "pm25";

/** How big the label is drawn. */
type SensorLabelSize = "xs" | "sm" | "md" | "lg";

interface SensorLabelProps {
  /** The Metric the Sensor measures. The label text and the icon follow from it. */
  metric: SensorLabelMetric;
  /** How big the label is drawn. Defaults to `xs`. */
  size?: SensorLabelSize;
}
```

### Example values

From the glossary's Metric examples. Figma's sample text and the stories use the same values.

| Use              | metric        | size | Shows       | Note                                    |
| ---------------- | ------------- | ---- | ----------- | --------------------------------------- |
| Card header      | `temperature` | `xs` | Temperature | The default                             |
| Table header     | `humidity`    | `sm` | Humidity    |                                         |
| Detail view      | `co2`         | `md` | CO₂         | Checks the subscript renders            |
| Detail heading   | `pm25`        | `lg` | PM2.5       |                                         |
| `LongText` story | `illuminance` | `lg` | Illuminance | The longest name, in a narrow container |
| `Minimal` story  | `voc`         | `xs` | VOC         | The shortest name, on its own           |

Stories:

| Story         | Shows                                      |
| ------------- | ------------------------------------------ |
| `Temperature` | `temperature`, `xs`. The default.          |
| `Humidity`    | `humidity`, `sm`                           |
| `Illuminance` | `illuminance`, `md`                        |
| `Co2`         | `co2`, `md`                                |
| `Voc`         | `voc`, `sm`                                |
| `Pm25`        | `pm25`, `lg`                               |
| `Sizes`       | `temperature` in all four sizes            |
| `AllMetrics`  | Every Metric stacked, at the Controls size |
| `LongText`    | `illuminance`, `lg`, in a narrow container |
| `Minimal`     | `voc`, `xs`, on its own                    |

### Tokens

Every value is bound to a Figma variable, and all of these tokens already exist in `tokens.css`.

| Part  | Size  | Property     | Figma variable         | Code token                                   |
| ----- | ----- | ------------ | ---------------------- | -------------------------------------------- |
| label | all   | colour       | `color-text/primary`   | `--shk-color-text-primary`                   |
| icon  | all   | colour       | `color-text/primary`   | `--shk-color-text-primary`                   |
| label | xs    | text style   | `typography/caption/*` | `--shk-typography-caption-*` (12 / 18 / 400) |
| label | sm    | text style   | `typography/body-sm/*` | `--shk-typography-body-sm-*` (14 / 21 / 400) |
| label | md    | text style   | `typography/body/*`    | `--shk-typography-body-*` (16 / 24 / 400)    |
| label | lg    | text style   | `typography/body-lg/*` | `--shk-typography-body-lg-*` (18 / 27 / 400) |
| root  | xs sm | icon ↔ label | `space/1`              | `--shk-space-1` (4px)                        |
| root  | md lg | icon ↔ label | `space/2`              | `--shk-space-2` (8px)                        |

Checked in Storybook against Figma: every size has the same height, gap, icon size and text style. Widths match within 1px (text rounding).

### Accessibility

- Markup: a `<span>`, not a heading. SensorLabel doesn't know where it sits, so the parent wraps it in a heading (`<h3>` in a card) when it is one.
- The icon is hidden from screen readers (`aria-hidden`). The label already says the same thing, so nothing is lost.
- Screen readers may read "CO₂" and "PM2.5" oddly, so those two are said in two parts: the visible label gets `aria-hidden`, and a visually hidden copy next to it holds the spoken name from the Screen reader column ("carbon dioxide", "PM 2.5"). The same pattern `LocationPath` uses for its prefixes. Not `aria-label`: on a plain `<span>`, screen readers often ignore it. For the other Metrics the visible label is read as it is ("VOC" letter by letter, which is fine).
- Not colour alone: the Metric is told apart by its text and its icon shape.
- No live region: the Metric never changes on its own.
- When the name is truncated, the full name is still available: the label has a `title`, so it shows on hover.
- Contrast: `--shk-color-text-primary` (gray 900) on a light surface is well above 4.5:1.
- No motion.

### Open questions

- **The name says Sensor, the label shows the Metric.** That's on purpose: a Sensor measures exactly one Metric, so naming the Metric names the Sensor. If Sensors ever get their own names ("Kitchen thermometer"), add an optional `name` prop that replaces the Metric name. The glossary would need a new term for it first.
- **Illuminance icon.** `light_mode` (a sun) is used instead of `lightbulb`, because a bulb looks like a light Device. Confirm when the Metric → icon map is decided (see the Icons doc, "Still to do").
- **Shared Metric type.** `SensorLabelMetric` is the kit's first list of Metrics. When `api-spec` exists, should this use the API's Metric names, or keep its own and map them in the `react` package (same question as `UnitLabel`)?
