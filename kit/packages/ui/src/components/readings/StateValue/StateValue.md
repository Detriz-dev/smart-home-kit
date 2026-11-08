# StateValue

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/state-value.mdx). Props are defined in [`StateValue.types.ts`](./StateValue.types.ts).

### Purpose

Shows the latest **State** of a Two-state Metric as a small pill: an icon and a word, like 🔌 **On**, 🚪 **Open** or 🔥 **Detected**. It is the Two-state twin of [`ReadingValue`](../ReadingValue/ReadingValue.md): ReadingValue shows a number, StateValue shows a State.

It shows the State only. What is measured ("Power", "Front door") is [`SensorLabel`](../../context/SensorLabel/SensorLabel.md) or a future `AssetLabel`, next to it. The kit is sensor-only, so StateValue is read-only: it never switches anything. (`Switch` is for app settings, never for Devices.)

Figma: `StateValue` component set in _DeTriz - Smart Home Kit_ (node `584:148`, page `StateValue`). The icon is an exposed `StateIcon` instance, so designers pick the Metric and State icon from a dropdown.

### Component in domain model context

Category: **Readings** ("What is it right now?"). The State changes every time a Reading with a different State arrives.

It shows one part of a [Reading](/kit/apps/docs-site/docs/domain-model/glossary.mdx#measurements) of a **Two-state Metric** (Power, Contact, Motion, Smoke, CO):

| Part  | Domain term | Example | Rule                                                                                           |
| ----- | ----------- | ------- | ---------------------------------------------------------------------------------------------- |
| icon  | **State**   | `power` | One icon per Metric and State, from `STATE_ICONS`. Smoke and CO keep one icon for both States. |
| label | **State**   | On      | The State's name: On, Off, Open, Closed, Detected, Clear.                                      |

Whether a State is **active** (On, Open, Detected) or **inactive** (Off, Closed, Clear) decides its colour. If the Reading has an **Active Alert**, the colour comes from the [Alert Level](/kit/apps/docs-site/docs/domain-model/glossary.mdx#alerts) instead (Data model rule 24: a Closed Alert doesn't hide the problem, so the parent keeps passing the level while the condition is true).

What it does **not** show, and why:

- **Metric or Asset name.** Context: `SensorLabel` or `AssetLabel` next to it.
- **The Alert itself** ("Smoke detected in Kitchen at 14:02"). That is `AlertBanner` / `AlertListItem`. StateValue only takes the level's colour.
- **The Alert Rule** ("Alert when Open"). Optional, shown by the parent if the app wants it.
- **Detection start time** ("since 02:14"). Context: a future `RelativeTime`.
- **Stale, Fault.** Status components, as with ReadingValue.

### Visual idea

| Question                        | Answer                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A rounded pill: icon + word, e.g. (🔌 On). Light fill, darker text and icon in the same hue.        |
| Icons?                          | One, before the word, from `STATE_ICONS`. `refresh` / `link_off` alone in loading / disconnected.   |
| More than one size?             | Two: `md` (lists, rows) and `lg` (cards, under `SensorLabel`).                                      |
| Why a pill, not plain text?     | On/Off must be scannable at a glance across a list. A filled shape reads as "a state", not a label. |
| Colour only?                    | No: the word always says the State, and the icon shape differs for most States.                     |

### States

Figma variant property `state` (7 values) × `size` (2) = 14 variants.

| Figma `state`    | When                                           | Shows                                             | Colours (bg / fg)                                                            | Screen reader  |
| ---------------- | ---------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | -------------- |
| `inactive`       | State is Off, Closed or Clear; no Active Alert | Pill: icon + word ("Off")                         | `state/inactive/bg` / `state/inactive/fg`                                    | "Off"          |
| `active`         | State is On, Open or Detected; no Active Alert | Pill: icon + word ("On")                          | `state/active/bg` / `state/active/fg`                                        | "On"           |
| `alert-critical` | The Reading has an Active **Critical** Alert   | Pill: icon + word ("Detected")                    | `status/danger/bg` / `status/danger/fg`                                      | "Detected"     |
| `alert-warning`  | The Reading has an Active **Warning** Alert    | Pill: icon + word ("Open")                        | `status/warning/bg` / `status/warning/fg`                                    | "Open"         |
| `alert-info`     | The Reading has an Active **Info** Alert       | Pill: icon + word ("Detected") with a thin border | `status/progress/bg` / `status/progress/fg`, border `status/progress/border` | "Detected"     |
| `loading`        | No Reading yet                                 | `refresh` icon, spinning, no pill                 | – / `color-text/secondary`                                                   | "Loading"      |
| `disconnected`   | The Module's Connection Status is Disconnected | `link_off` icon, no pill, State hidden            | – / `color-text/secondary`                                                   | "Disconnected" |

In code there is no `state` prop. It is worked out from the props, first match wins:

1. `isDisconnected` → `disconnected`.
2. `state` is `null` → `loading`.
3. `alertLevel` is set → `alert-<level>`.
4. The State is On, Open or Detected → `active`; otherwise `inactive`.

Target states:

| Target state | Applies? | Why                                                                 |
| ------------ | -------- | ------------------------------------------------------------------- |
| loading      | yes      | `loading`.                                                          |
| Connected    | yes      | `active`, `inactive` and the `alert-*` states.                      |
| Stale        | no       | Shown by `DeviceConnectionStatus`. The State stays as it is.        |
| Disconnected | yes      | `disconnected`: the last State is **hidden**, as the Glossary says. |
| Fault        | no       | Shown by `DeviceFaultStatus`.                                       |

### Sizes

| Size | Text style        | Icon    | Padding (block / inline) | Gap       | Height | Use                                 |
| ---- | ----------------- | ------- | ------------------------ | --------- | ------ | ----------------------------------- |
| `md` | `label` (14)      | `sm` 20 | `space/1` / `space/2`    | `space/1` | 28     | List rows, SpaceCard rows. Default. |
| `lg` | `readout-sm` (20) | `md` 24 | `space/1` / `space/3`    | `space/2` | 32     | Cards, under `SensorLabel`.         |

`loading` and `disconnected` keep the same height (`min-height`), so nothing moves when the state changes.

### Anatomy

```
StateValue
├── icon    StateIcon (or ReadingStatusIcon in loading / disconnected)
└── label   "On"            (not in loading / disconnected)
```

1. **root**: the pill. Radius `radius/full`, fill and text colour from the state. Hugs its content.
2. **icon**: decorative; the label says the same thing. Takes the root's text colour.
3. **label**: the State's name, one line, never truncated (the words are short).

### API

Props are in [`StateValue.types.ts`](./StateValue.types.ts). Decisions behind them:

- `metric` and `state` are one typed pair (`StateValueReading`), so the State must belong to the Metric (`{ metric: "power", state: "open" }` is a type error).
- No `state` variant prop in code: the visual state is worked out from `state`, `isDisconnected` and `alertLevel` (see States).
- `alertLevel` comes from the parent, which knows about Alerts; StateValue never looks Alerts up.

TypeScript checks that the State belongs to the Metric (`{ metric: "power", state: "open" }` is an error). Labels come from a `STATE_NAMES` map next to `METRIC_NAMES`.

### Tokens

| Part            | Property     | Token                                               |
| --------------- | ------------ | --------------------------------------------------- |
| root            | fill         | `state/*/bg`, `status/{danger,warning,progress}/bg` |
| icon, label     | colour       | `state/*/fg`, `status/*/fg`, `color-text/secondary` |
| root            | radius       | `radius/full`                                       |
| root            | padding, gap | `space/1`, `space/2`, `space/3`                     |
| label (md / lg) | text         | `typography/label/*`, `typography/readout-sm/*`     |

### Accessibility

- The label is real text, so screen readers read "On". The icon is hidden (`aria-hidden`).
- Loading and Disconnected have no text, so their icon gets a label ("Loading", "Disconnected"), like ReadingValue.
- Not colour alone: the word always says the State; alert colours add urgency on top.
- Contrast: `state/active/fg` on `state/active/bg` 8.98:1, `state/inactive/fg` on `state/inactive/bg` 6.46:1. Status fg on status bg is AA (same pairs as `InlineMessage`).
- Reduced motion: the loading icon stops spinning, like ReadingValue.

### Stress cases

- `LongText`: the longest label is "Detected" or "Closed"; in a narrow card the pill never wraps or truncates.
- `Minimal`: `md`, "On".

### Open questions

- Should `contact` show "Open/Closed" with a window icon when the Asset is a Window? Today the icon comes from the Metric only (`door_open` / `sensor_door`).
- Does an Active Alert on an **inactive** State happen (e.g. "Alert when Off")? The alert colours apply to any State, so yes, it is supported.

### Decisions

- **alert-info has a thin border** (2026-11-07). Info and active are both blue, so Info gets an inside 1px `status/progress/border` stroke. It doesn't change the size: Figma excludes it from the layout, CSS uses an inset shadow.
