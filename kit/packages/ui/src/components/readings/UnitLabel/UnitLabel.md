# UnitLabel

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/unit-label.mdx). Props are defined in [`UnitLabel.types.ts`](./UnitLabel.types.ts).

### Purpose

Shows the Unit of a Metric as a short symbol: "°C", "%RH", "ppm". It sits next to `ReadingValue` so the user knows what the number means: **22.4** °C.

It shows the symbol only. Because it is its own component, the same Unit style can be used where there is no number: chart axis labels, table headers, settings.

It is display-only and never changes on its own. It looks the same when the value is loading or the Device is Disconnected, so the user still knows _what_ was measured when the number is hidden.

Figma: `UnitLabel` component set in _DeTriz - Smart Home Kit_ (node `213:92`). Usage examples with `ReadingValue`: frame `UnitLabel / usage` (node `218:50`).

Storybook: `Readings/UnitLabel`.

### Component in domain model context

Category: **Readings** ("What is it right now?"). It is kept next to `ReadingValue` because the two are almost always used together. Unlike `ReadingValue`, it doesn't change when a new Reading arrives.

It shows one part of a [Reading](/kit/apps/docs-site/docs/domain-model/glossary.mdx#what-is-tracked):

| Part   | Domain term | Example | Rule                                                                                                            |
| ------ | ----------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| symbol | **Unit**    | °C      | How the Metric's value is expressed. The parent picks the display Unit (°C or °F): that is a formatting choice. |

What it does **not** show, and why:

- **The value** ("22.4"). That is `ReadingValue`. A parent puts the two side by side.
- **Metric name** ("Temperature"). That says _what_ is measured, so it is Context: `SensorLabel` sits next to the value.
- **Which display Unit to use.** UnitLabel shows the Unit it is given. Converting °C to °F and remembering the user's choice is the parent's job (later: a setting).
- **Connection Status, Fault.** Shown by Status components. UnitLabel doesn't change for them.

### Visual idea

| Question                        | Answer                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| What does it roughly look like? | A short symbol on its own: °C                                                                    |
| Icons?                          | No. Plain text only, no chip, badge or background (those would look clickable or like a status). |
| Separators?                     | No. Only one part.                                                                               |
| More than one layout or size?   | Four sizes, the same names as `ReadingValue`: `lg`, `md`, `sm`, `xs`. One layout.                |
| Text size                       | One readout step smaller than the number at the same size, see Sizes.                            |

Next to the number it is **smaller and quieter**: secondary text colour, so the number stays the first thing the user sees.

It sits on the same **baseline** as the number, not raised like a superscript. Superscript works for "°C" but not for "%RH" or "ppm".

How it sits next to `ReadingValue`, for example: **22.4** °C. The parent sets the gap and the baseline alignment, not UnitLabel (see Pairing with ReadingValue).

### States

UnitLabel has no states. What changes between versions is the **Unit** and the **size** (see Variants).

Target states:

| Target state | Applies? | Why                                                                                                                    |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| loading      | no       | The Unit is known before the first Reading arrives. It stays visible next to `ReadingValue`'s loading icon.            |
| Connected    | no       | Nothing to show differently: the Unit is the same whatever the Connection Status.                                      |
| Stale        | no       | Shown by `DeviceConnectionStatus`.                                                                                     |
| Disconnected | no       | The **value** is hidden (by `ReadingValue`), the Unit is not. Next to the disconnected icon it says what was measured. |
| Fault        | no       | Shown by a Status component.                                                                                           |

Pairing Status doesn't apply either: the Unit belongs to the Metric, not to the Device.

### Variants

**Unit** (Figma variant property `unit`, prop `unit`). A fixed list, one value per Unit we show:

| Value        | Shows | Screen reader                | Used for (Metric)          |
| ------------ | ----- | ---------------------------- | -------------------------- |
| `celsius`    | °C    | "degrees Celsius"            | Temperature                |
| `fahrenheit` | °F    | "degrees Fahrenheit"         | Temperature (display Unit) |
| `percent-rh` | %RH   | "percent relative humidity"  | Humidity                   |
| `lux`        | lx    | "lux"                        | Illuminance                |
| `ppm`        | ppm   | "parts per million"          | CO₂                        |
| `ppb`        | ppb   | "parts per billion"          | VOC (provisional)          |
| `ug-m3`      | µg/m³ | "micrograms per cubic metre" | PM2.5                      |

A fixed list instead of free text, for two reasons:

1. Every screen writes the same Unit the same way. Nobody types "°c" or "C°".
2. Each Unit has a spoken name. A screen reader reads "°C" differently from one reader to the next. With a fixed list, UnitLabel can always say "degrees Celsius".

The symbols use the right characters: the degree sign `°` (U+00B0), not the ordinal sign `º` or the single `℃` glyph (Space Grotesk may not have it, and screen readers handle it badly). "%RH" has no space.

**Size** (Figma variant property `size`, prop `size`). Default `lg`. Use the same size as the `ReadingValue` next to it, so a parent can pass one `size` to both.

| Size | Text style   | Unit text         | Height | Next to ReadingValue | Use it for                   |
| ---- | ------------ | ----------------- | ------ | -------------------- | ---------------------------- |
| `lg` | `readout`    | 32px / 35, medium | 35     | 48px number          | Hero spot, detail view       |
| `md` | `readout-sm` | 20px / 22, medium | 22     | 32px number          | Reading card                 |
| `sm` | `readout-xs` | 14px / 15, medium | 15     | 20px number          | List rows, compact cards     |
| `xs` | `readout-xs` | 14px / 15, medium | 15     | 14px number          | Tables, inline in a sentence |

The rule: **one readout step smaller than the number**. `xs` has no smaller step, so the unit is the same size as the number. That suits it: inline in a sentence, "22.4 °C" reads best at one size. `sm` and `xs` look the same; they are two names so the parent can always pass the same `size` as `ReadingValue`.

Figma: 5 units × 4 sizes = 20 variants, named `unit=<value>, size=<size>`.

### Pairing with ReadingValue

The parent (for example a reading card) puts the two together:

| What      | Value                    | Figma                  | Code                    |
| --------- | ------------------------ | ---------------------- | ----------------------- |
| Direction | number first, then Unit  | horizontal auto layout | `display: inline-flex`  |
| Alignment | on the text baseline     | align: **Baseline**    | `align-items: baseline` |
| Gap       | 4px                      | `space/1`              | `--shk-space-1`         |
| Size      | the same `size` for both | same `size` variant    | the same `size` prop    |

In `loading` and `disconnected`, `ReadingValue` shows an icon instead of the number. The Unit stays next to it: link_off °C. With baseline alignment, the Unit lines up with the bottom of the icon in code (checked in the `WithReadingValue` story): the icon is an SVG with no text baseline, so its bottom edge is used. In Figma the icons are a font, so the Unit sits 2–4px lower than the icon's bottom. This difference is accepted.

### Anatomy

```
root               <span>
├── symbol         "°C"                      (seen, hidden from screen readers)
└── spokenName     "degrees Celsius"         (visually hidden, read by screen readers)
```

1. **root**: holds the symbol. No padding, no background: spacing comes from the parent.
2. **symbol**: the Unit as it is written. `aria-hidden`, so the screen reader doesn't spell it out.
3. **spokenName**: the Unit as it is said. Visually hidden, like the prefixes in `LocationPath`. Only in code; Figma has no layer for it.

Long text never wraps and never truncates: `white-space: nowrap`, so "%RH" never breaks into "%" and "RH", and never becomes "%R…". If the container is too narrow, the symbol overflows; the parent must leave room for it.

### API

The props are defined in [`UnitLabel.types.ts`](./UnitLabel.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `unit` is required: there is no sensible default Unit.
- `size` is `"xs" | "sm" | "md" | "lg"`, default `lg`, the same names as `ReadingValue`'s sizes, so a parent can pass one `size` to both.
- The symbol and the spoken name live in one place inside the component (`UNITS` in `UnitLabel.tsx`, one entry per Unit), so adding a Unit means adding one line, plus the Figma variants.
- The values match the Figma variant values exactly, so a designer and a developer use the same words.
- There is no `value` prop and no status prop. UnitLabel looks the same in every Connection Status.

### Example values

From the glossary and `ReadingValue.md` examples. Figma sample text and stories use these. Stories render in English.

| Use              | unit         | size | Shows | Paired with (ReadingValue)           |
| ---------------- | ------------ | ---- | ----- | ------------------------------------ |
| Default          | `celsius`    | `lg` | °C    | 22.4                                 |
| Humidity         | `percent-rh` | `md` | %RH   | 48                                   |
| Air quality      | `ppm`        | `sm` | ppm   | 1,250                                |
| Illuminance      | `lux`        | `xs` | lx    | 320                                  |
| Display Unit     | `fahrenheit` | `lg` | °F    | 72.3                                 |
| `LongText` story | `percent-rh` | `lg` | %RH   | in a narrow container: must not wrap |
| `Minimal` story  | `lux`        | `xs` | lx    | on its own                           |

Stories:

| Story                     | Shows                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Celsius`                 | °C, `lg`. The default.                                                                                        |
| `Fahrenheit`              | °F, `lg`                                                                                                      |
| `PercentRh`               | %RH, `md`                                                                                                     |
| `Lux`                     | lx, `xs`                                                                                                      |
| `Ppm`                     | ppm, `sm`                                                                                                     |
| `Sizes`                   | °C in all four sizes side by side                                                                             |
| `WithReadingValue`        | The pairs from the table above at every size, plus `loading` and `disconnected`. Checks the baseline in code. |
| `Ppb`                     | ppb, `md`                                                                                                     |
| `MicrogramsPerCubicMetre` | µg/m³, `md`                                                                                                   |
| `LongText`                | %RH, `lg`, in a narrow container                                                                              |
| `Minimal`                 | lx, `xs`, on its own                                                                                          |

### Tokens

Every value is bound to a Figma variable. No new tokens are needed.

| Part   | Size | Property   | Figma variable            | Code token                                      | In `tokens.css`? |
| ------ | ---- | ---------- | ------------------------- | ----------------------------------------------- | ---------------- |
| symbol | all  | colour     | `color-text/secondary`    | `--shk-color-text-secondary`                    | yes              |
| symbol | lg   | text style | `typography/readout/*`    | `--shk-typography-readout-*` (32 / 35 / 500)    | yes              |
| symbol | md   | text style | `typography/readout-sm/*` | `--shk-typography-readout-sm-*` (20 / 22 / 500) | yes              |
| symbol | sm   | text style | `typography/readout-xs/*` | `--shk-typography-readout-xs-*` (14 / 15 / 500) | yes              |
| symbol | xs   | text style | `typography/readout-xs/*` | `--shk-typography-readout-xs-*` (14 / 15 / 500) | yes              |
| root   | all  | padding    | none                      | none (spacing belongs to the parent)            | —                |
| pair   | all  | gap        | `space/1` (set by parent) | `--shk-space-1` (4px)                           | yes              |

### Accessibility

- The screen reader hears the spoken name ("degrees Celsius"), not the symbol. Together with `ReadingValue` and the Metric label, the parent's group reads "Temperature 22.4 degrees Celsius".
- No live region: the Unit never changes on its own.
- Apps shouldn't add an `aria-label` or their own hidden text for the Unit: the spoken name is already read out, so it would be announced twice. The user docs page tells developers this.
- Not colour alone: the Unit is told apart by its text. The secondary colour only lowers its weight next to the number.
- Contrast: gray 700 (`--shk-color-text-secondary`) on a light surface is above 4.5:1, also at 14px.
- No motion.

### Open questions

- **VOC Unit.** `ppb` is provisional, because the Air Quality Module's sensor isn't chosen. Some sensors give a **VOC Index** (0–500) with no Unit instead. If that sensor is chosen, `unit` becomes optional in `SensorReading`, and the glossary needs an exception to "one canonical Unit per Metric".
- **API Unit names.** Not decided. When `api-spec` exists, should `unit` use the API's canonical Unit strings, or keep its own names and map them in the `react` package?
