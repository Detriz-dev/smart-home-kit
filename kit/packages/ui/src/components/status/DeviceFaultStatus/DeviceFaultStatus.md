# DeviceFaultStatus

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/device-fault-status.mdx). Props are defined in [`DeviceFaultStatus.types.ts`](./DeviceFaultStatus.types.ts).

### Purpose

A compact strip that shows a Device has a Fault: a danger icon tile and a short message, for example "CO₂ sensor failure". It looks like a small `AlertBanner` at the Critical level. It tells the user the hardware has a problem, so they don't mistake a broken Sensor for a normal value.

It sits inside what is faulty: inside `SensorReading` or `SensorState` when the Fault is about one Sensor (`DeviceCard` routes it there), and in the card body when it is about the whole Device. It can also sit anywhere a Device is shown (`DeviceListItem`, `SpaceCard`).

It is read-only and takes props only. It shows the Fault, it doesn't fix it.

Figma: `DeviceFaultStatus` component set in _DeTriz - Smart Home Kit_ (node `344:25`), page `DeviceFaultStatus`. The new design is the `DeviceFaultStatus (proposal)` set (node `797:28`) with in-context examples (node `797:29`) on the same page; it replaces `344:25` once reviewed.

### Component in domain model context

Category: **Status** ("Is everything OK?"). Not Feedback: Status describes the hardware, and a Fault is a hardware problem the Device reports about itself.

It is the third of the three Device Status fields, next to [`DevicePairingStatus`](../DevicePairingStatus/) and [`DeviceConnectionStatus`](../DeviceConnectionStatus/DeviceConnectionStatus.md).

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx):

| Part  | Domain term | Example            | Note                           |
| ----- | ----------- | ------------------ | ------------------------------ |
| label | **Fault**   | CO₂ sensor failure | The message for its Fault Code |
| icon  | **Fault**   | `error`            | Same icon for every Fault Code |

The **Fault Code** decides the message. It is a stable identifier, so the UI never shows `sensor_failure` itself.

What it does **not** show, and why:

- **No Fault.** The glossary says Fault is "None, or a specific Fault". When there is none, the parent doesn't render this component, so there is no "None" state.
- **Connection Status.** A Device can be Connected and have a Fault, so the two are shown side by side, never mixed.
- **Help or a fix.** The [device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx) asks for a message and help per Fault Code. A clickable help link would belong in Controls, so this component starts with the message only. See Open questions.
- **Which Device it is.** The parent shows that, for example the `DeviceCard` name.

### Visual idea

| Question                        | Answer                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| What does it roughly look like? | A full-width strip, like a small Critical `AlertBanner`: icon tile, then the message |
| Icons?                          | Yes, `error`, white on a 20px `status/danger/solid` tile                             |
| Separators?                     | No                                                                                   |
| More than one layout or size?   | No, one of each                                                                      |
| Text and icon size              | Caption text, 16px icon (`xs`)                                                       |

```
┌──────────────────────────────┐
│ [!] CO₂ sensor failure       │   light red fill, light red border
└──────────────────────────────┘
```

The colours are AlertBanner's Critical level (2026-11-11), so a Fault reads as a hardware problem at a glance and matches the rest of the danger UI. The text is `color-text/primary`, like AlertBanner's title; the tile carries the colour. The strip fills its parent's width. The icon tile aligns to the top, so it stays beside the first line when a long message wraps. The message wraps instead of truncating: a cut-off Fault message could hide what is wrong.

### States

Figma variant property `faultCode`, prop `faultCode`. One state per Fault Code. All of them look the same, only the message changes.

| State                  | Prop value             | Message, no `metric` | Message, with `metric`          | Colour role | Icon    |
| ---------------------- | ---------------------- | -------------------- | ------------------------------- | ----------- | ------- |
| `sensor_failure`       | `sensor_failure`       | Sensor failure       | CO₂ sensor failure              | danger      | `error` |
| `calibration_required` | `calibration_required` | Calibration required | CO₂ sensor calibration required | danger      | `error` |

Fault Codes use `snake_case` because that is how the glossary and the API write them, so they are an exception to the lowercase-with-hyphens union values.

Target states:

| Target state | Applies? | Why                                                                                    |
| ------------ | -------- | -------------------------------------------------------------------------------------- |
| loading      | no       | A Fault is either reported or not. While nothing is known, the parent renders nothing. |
| Connected    | no       | Connection Status belongs to `DeviceConnectionStatus`.                                 |
| Stale        | no       | Same reason.                                                                           |
| Disconnected | no       | Same reason. The last Fault stays until **Fault Cleared**.                             |
| Fault        | yes      | The whole component.                                                                   |

### Anatomy

```
root           <span role="status">   icon tile and message in one row, full width
├── icon       <span> tile with Icon name="error" size="xs"
└── label      <span>                 the message
```

1. **root**: holds the parts and carries `data-fault-code`.
2. **icon**: decorative, because the label says the same thing.
3. **label**: the message.

### API

The props are defined in [`DeviceFaultStatus.types.ts`](./DeviceFaultStatus.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- The Metric's name comes from `METRIC_NAMES` in `utils/metricNames.ts`, the same list `SensorLabel` uses.
- `metric`, not `sensorId`: **Fault Raised** carries an optional `sensorId`, but this component takes props only and can't look it up. The parent finds the Sensor's Metric and passes it.
- One component shows one Fault. A Device can report several Faults at once, so the parent renders one `DeviceFaultStatus` per Fault.

### Example values

| Use              | faultCode              | metric        | Shows                                               |
| ---------------- | ---------------------- | ------------- | --------------------------------------------------- |
| Sensor failure   | `sensor_failure`       | `co2`         | CO₂ sensor failure                                  |
| Calibration      | `calibration_required` | `co2`         | CO₂ sensor calibration required                     |
| `LongText` story | `calibration_required` | `illuminance` | Illuminance sensor calibration required, 160px wide |
| `Minimal` story  | `sensor_failure`       | —             | Sensor failure                                      |

Stories: `SensorFailure`, `CalibrationRequired`, `LongText`, `Minimal`.

### Tokens

| Part  | Property | Figma variable                                     | Code token                                                     | In `tokens.css`? |
| ----- | -------- | -------------------------------------------------- | -------------------------------------------------------------- | ---------------- |
| root  | gap      | `space/2`                                          | `--shk-space-2` (8px)                                          | yes              |
| root  | padding  | `space/1`, right `space/2`                         | `--shk-space-1`, `--shk-space-2`                               | yes              |
| root  | fill     | `status/danger/bg-subtle`                          | `--shk-status-danger-bg-subtle`                                | yes              |
| root  | border   | `status/danger/border-subtle`, `border-width/thin` | `--shk-status-danger-border-subtle`, `--shk-border-width-thin` | yes              |
| root  | radius   | `radius/8`                                         | `--shk-radius-8`                                               | yes              |
| icon  | tile     | `status/danger/solid`, `size/5`, `radius/4`        | `--shk-status-danger-solid`, `--shk-size-5`, `--shk-radius-4`  | yes              |
| icon  | colour   | `color-text/inverse`                               | `--shk-color-text-inverse`                                     | yes              |
| label | colour   | `color-text/primary`                               | `--shk-color-text-primary`                                     | yes              |
| label | text     | `typography/caption/*`                             | `--shk-typography-caption-*`                                   | yes              |

### Accessibility

- `root` has `role="status"`, like `DeviceConnectionStatus`, so a new Fault is announced without interrupting. Apps shouldn't wrap it in another live region: it would be announced twice. The user docs page tells developers this.
- The icon has no label, because the text says the same thing.
- Not colour alone: the icon shape and the text both carry the meaning.
- `metric` needs the spoken name from `SensorLabel`, so a screen reader says "carbon dioxide sensor failure".
- Contrast: `color-text/primary` on `status/danger/bg-subtle` is well above the 4.5:1 needed for text. The white icon on the tile is decorative.

### Open questions

- **Help per Fault Code.** Add it later as a separate Controls component, or as text inside this one?
- **More Fault Codes.** Only two appear in the docs. The list needs to come from the Hub agent and the API.
