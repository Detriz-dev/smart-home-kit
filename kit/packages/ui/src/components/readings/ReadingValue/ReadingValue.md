# ReadingValue

### Purpose

Shows the latest value of one Metric as an easy-to-read number: "22.4". It is the number in a reading card, a Space overview or a detail view, the thing the user looks at first.

It shows the number only. The Unit ("°C") is a separate component, [`UnitLabel`](../UnitLabel/UnitLabel.md), so it can also be used on its own in other places (axis labels, table headers, settings). A parent puts the two side by side.

It is kept simple on purpose: it shows a number, a loading icon while there is no number yet, or a disconnected icon when the Device can't be reached. Everything else about the Device's health (Stale, Fault) is shown by Status components next to it.

It is read-only and shows one value only. Several Metrics side by side belong in **Comparison**; a trend or chart belongs in **History**.

Figma: `ReadingValue` component set in _DeTriz - Smart Home Kit_ (node `197:31`).

### Component in domain model context

Category: **Readings** ("What is it right now?"). The value changes every time a new Reading arrives.

It shows one part of a [Reading](/docs/architecture/domain-model/ubiquitous-language.md#what-is-tracked):

| Part  | Domain term | Example | Rule                                                                                                       |
| ----- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| value | **Reading** | 22.4    | The number from the latest Reading. Formatted for display (decimal places, minus sign, thousands spacing). |

What it does **not** show, and why:

- **Unit** ("°C", "%RH"). That is [`UnitLabel`](../UnitLabel/UnitLabel.md), so the same Unit style can be reused outside of readings. Choosing the display Unit (°C or °F) is a formatting choice made by the parent.
- **Connection Status as a label** ("Stale", "Disconnected"). That is `DeviceConnectionStatus`. `ReadingValue` only reacts to **Disconnected** (it swaps the number for an icon), because a number from an unreachable Device would look fresh when it isn't.
- **Fault.** Shown by a future Fault component. `ReadingValue` doesn't change its look for it.
- **Metric name** ("Temperature"). That says _what_ is measured, so it is Context. A label component sits next to the value.
- **Time of the Reading** ("Updated 5 s ago"). A fixed fact about the Reading, so it is Context too.
- **Sensor, Module, Space.** Where the value comes from is `LocationPath`.
- **Thresholds** ("too warm", "CO₂ high"). Not in the Ubiquitous Language yet. If it comes, it is Status, not part of this component.

### Visual idea

| Question                        | Answer                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| What does it roughly look like? | A number on its own: **22.4**                                                       |
| Icons?                          | In place of the number: `refresh` in `loading`, `link_off` in `disconnected`.       |
| Separators?                     | No. Only one part.                                                                  |
| More than one layout or size?   | Four sizes: `lg` (48px), `md` (32px), `sm` (20px), `xs` (14px). One layout.         |
| Text size                       | Depends on `size`, see Sizes. The loading icon is scaled to roughly match the text. |

Numbers use tabular figures (every digit the same width), so the layout doesn't jump when 19.9 becomes 20.0.

How it sits next to the Unit, for example: **22.4** °C. The gap and the baseline alignment are set by the parent that puts them together, not by `ReadingValue`.

### States

Three states (Figma variant property `state`):

| State          | Figma value          | When                                            | Shows                               | Screen reader  |
| -------------- | -------------------- | ----------------------------------------------- | ----------------------------------- | -------------- |
| `default`      | `state=default`      | A value is there.                               | The number, e.g. "22.4"             | "22.4"         |
| `loading`      | `state=loading`      | No value yet: the first Reading is on its way.  | `refresh` icon, spinning, no number | "Loading"      |
| `disconnected` | `state=disconnected` | The Device's Connection Status is Disconnected. | `link_off` icon, no number          | "Disconnected" |

In code there is no `state` prop. The component picks the state from its props, first match wins:

1. `isDisconnected` is true → `disconnected` (even if there is a value or none yet).
2. `value` is `null` → `loading`.
3. Otherwise → `default`.

This way it can never show two states at once.

Target states:

| Target state | Applies? | Why                                                                                                                                     |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| loading      | yes      | The `loading` state.                                                                                                                    |
| Connected    | yes      | The `default` state: the latest value.                                                                                                  |
| Stale        | no       | Shown by `DeviceConnectionStatus`. The number stays as it is.                                                                        |
| Disconnected | yes      | The `disconnected` state. The last value is **hidden**, as the [glossary](/docs/architecture/domain-model/ubiquitous-language.md) says. |
| Fault        | no       | Shown by a Status component.                                                                                                            |

**Connecting** (a Device re-establishing its link) has no state of its own. The parent decides: pass the last value to keep showing it, or `null` to show `loading`.

Pairing Status doesn't apply: an unpaired Device sends no Readings, so there is nothing to show.

### Sizes

Figma variant property `size`, prop `size`. Default `lg`.

| Size | Text style   | Number text       | Icon size (both icons) | Height (all states) | Use it for                   |
| ---- | ------------ | ----------------- | ---------------------- | ------------------- | ---------------------------- |
| `lg` | `readout-lg` | 48px / 53, medium | `Icon size="lg"` 32px  | 53                  | Hero spot, detail view       |
| `md` | `readout`    | 32px / 35, medium | `Icon size="md"` 24px  | 35                  | Reading card                 |
| `sm` | `readout-sm` | 20px / 22, medium | `Icon size="sm"` 20px  | 22                  | List rows, compact cards     |
| `xs` | `readout-xs` | 14px / 15, medium | `Icon size="xs"` 16px  | 16                  | Tables, inline in a sentence |

Each `ReadingValue` size uses the `Icon` size with the same name, so code can pass `size` straight through.

All states have the same height, so nothing moves when the state changes. The height is the text's line height, or the icon size when the icon is taller (`xs`: 16px icon, 15px line). Icons are centred in that height.

### Anatomy

```
root               <span>
├── value          "22.4"     (state=default)
└── icon           refresh    (state=loading)
                   link_off   (state=disconnected)
```

1. **root**: holds either the value or the icon. Size comes from `size`.
2. **value**: the formatted number. Tabular figures.
3. **icon**: the `Icon` component. `refresh` spins while loading; `link_off` stands still.

The root has no padding and no background: spacing around the number comes from the parent.

### API

```ts
/** How big the number is drawn. */
type ReadingValueSize = "xs" | "sm" | "md" | "lg";

interface ReadingValueProps {
  /** The latest value of the Reading. `null` while it is loading. */
  value: number | null;
  /** True when the Device's Connection Status is Disconnected. Hides the value and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
  /** How big the number is drawn. Defaults to `lg`. */
  size?: ReadingValueSize;
}
```

Notes:

- The value is a number, not a string. The component formats it with the browser's language (`Intl.NumberFormat`), so every user sees their own decimal mark and thousands separator: "22.4" and "1,250" in English, "22,4" and "1250" in Polish.
- The parent passes `fractionDigits` for the Metric: each Metric has its own natural precision (Temperature 1, Humidity 0, CO₂ 0, Illuminance 0). The default of 1 fits Temperature, the most common case.
- There is no `unit` prop. The parent renders `UnitLabel` next to it.
- `isDisconnected` is the only status prop. It's a yes/no on purpose: Stale and Fault don't change this component, so a full `connectionStatus` prop would suggest it reacts to them. The parent sets it from the Device's Connection Status (`connectionStatus === "disconnected"`).
- The Unit stays visible next to the icon in `disconnected` (for example: link_off °C). It tells the user what was measured even when the value is hidden.

### Example values

From the glossary examples. Figma sample text and stories use these. The Metric column is only there to show where the number comes from. Stories render in English; the Polish column shows the same props in a Polish browser.

| Use              | Metric      | value                  | fractionDigits | Shows (English)   | Shows (Polish)    |
| ---------------- | ----------- | ---------------------- | -------------- | ----------------- | ----------------- |
| Default          | Temperature | 22.4                   | 1              | 22.4              | 22,4              |
| Humidity         | Humidity    | 48                     | 0              | 48                | 48                |
| Below zero       | Temperature | -3.5                   | 1              | -3.5              | -3,5              |
| Air quality      | CO₂         | 1250                   | 0              | 1,250             | 1250              |
| `LongText` story | Illuminance | 100000                 | 0              | 100,000           | 100 000           |
| `Minimal` story  | Illuminance | 0                      | 0              | 0                 | 0                 |
| Loading          | Temperature | null                   | 1              | loading icon      | loading icon      |
| Disconnected     | Temperature | 22.4, `isDisconnected` | 1              | disconnected icon | disconnected icon |

### Tokens

Every value is bound to a Figma variable. The number uses the readout text styles: font family, size, weight, line height and letter spacing, for example `--shk-typography-readout-lg-font-size`.

| Part  | Size    | Property      | Figma variable                 | Code token                                      | In `tokens.css`? |
| ----- | ------- | ------------- | ------------------------------ | ----------------------------------------------- | ---------------- |
| value | all     | colour        | `color-text/primary`           | `--shk-color-text-primary`                      | yes              |
| value | lg      | text style    | `typography/readout-lg/*`      | `--shk-typography-readout-lg-*` (48 / 53 / 500) | yes              |
| value | md      | text style    | `typography/readout/*`         | `--shk-typography-readout-*` (32 / 35 / 500)    | yes              |
| value | sm      | text style    | `typography/readout-sm/*`      | `--shk-typography-readout-sm-*` (20 / 22 / 500) | yes              |
| value | xs      | text style    | `typography/readout-xs/*`      | `--shk-typography-readout-xs-*` (14 / 15 / 500) | yes              |
| root  | xs      | min height    | 16 (icon taller than the line) | `--shk-size-4` (16px)                           | yes              |
| root  | all     | padding       | none                           | none (spacing belongs to the parent)            | —                |
| icon  | all     | name          | `refresh` (loading)            | `refresh` in `icons.config.ts`                  | yes              |
| icon  | all     | name          | `link_off` (disconnected)      | `link_off` in `icons.config.ts`                 | yes              |
| icon  | lg      | size          | 32×32                          | `Icon size="lg"` (32px)                         | yes              |
| icon  | md      | size          | 24×24                          | `Icon size="md"` (24px)                         | yes              |
| icon  | sm      | size          | 20×20                          | `Icon size="sm"` (20px)                         | yes              |
| icon  | xs      | size          | 16×16                          | `Icon size="xs"` (16px)                         | yes              |
| icon  | all     | colour        | `color-text/secondary`         | `--shk-color-text-secondary`                    | yes              |
| icon  | loading | spin duration | — (Figma has no motion)        | `--shk-motion-duration-spin` (1000ms)           | yes              |

### Accessibility

- A number alone ("22.4") means little to a screen reader. The parent that puts `ReadingValue`, the Unit and the Metric together gives the group its spoken name: "Temperature 22.4 degrees Celsius".
- In `loading` and `disconnected`, the icon gets a label ("Loading", "Disconnected") via the `Icon` `label` prop, so the screen reader doesn't read an empty space.
- Not colour alone: `disconnected` is told apart by its own icon shape, not by a colour.
- No live region on this component. Readings can arrive every few seconds and would keep interrupting. If a screen needs to announce changes, the parent decides how often.
- Contrast: the number is gray 900, the icons gray 700 (`--shk-color-text-secondary`). Both are above 4.5:1 on a light surface.
- Reduced motion: the loading icon stops spinning when the user asks for reduced motion. It still shows, so loading is still visible.

### Open questions

None right now.
