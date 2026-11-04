# DeviceFaultStatus

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/device-fault-status.mdx). Props are defined in [`DeviceFaultStatus.types.ts`](./DeviceFaultStatus.types.ts).

### Purpose

A small indicator that shows a Device has a Fault: a danger icon and a short message, for example "CO₂ sensor failure". It tells the user the hardware has a problem, so they don't mistake a broken Sensor for a normal value.

It is used inside `ModuleCard`, and can sit anywhere a Device is shown.

It is read-only and takes props only. It shows the Fault, it doesn't fix it.

Figma: `DeviceFaultStatus` component set in _DeTriz - Smart Home Kit_ (node `344:25`), page `DeviceFaultStatus`.

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
- **Which Device it is.** The parent shows that, for example the `ModuleCard` name.

### Visual idea

| Question                        | Answer                                                                   |
| ------------------------------- | ------------------------------------------------------------------------ |
| What does it roughly look like? | One short line, like `DeviceConnectionStatus`: an icon, then the message |
| Icons?                          | Yes, `error`, in the danger colour                                       |
| Separators?                     | No                                                                       |
| More than one layout or size?   | No, one of each                                                          |
| Text and icon size              | Caption text, 16px icon (`xs`)                                           |

```
(!) CO₂ sensor failure
```

The icon comes first here, unlike the dot after `DeviceConnectionStatus`'s label, and aligns to the top, so it stays beside the first line when a long message wraps. The message wraps instead of truncating: a cut-off Fault message could hide what is wrong.

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
root           <span role="status">   icon and message in one row
├── icon       Icon name="error" size="xs"
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

| Part  | Property | Figma variable         | Code token                   | In `tokens.css`? |
| ----- | -------- | ---------------------- | ---------------------------- | ---------------- |
| root  | gap      | `space/1`              | `--shk-space-1` (4px)        | yes              |
| root  | padding  | `space/0`              | `--shk-space-0` (0px)        | yes              |
| icon  | colour   | `status/danger/fg`     | `--shk-status-danger-fg`     | yes              |
| label | colour   | `status/danger/fg`     | `--shk-status-danger-fg`     | yes              |
| label | text     | `typography/caption/*` | `--shk-typography-caption-*` | yes              |

### Accessibility

- `root` has `role="status"`, like `DeviceConnectionStatus`, so a new Fault is announced without interrupting. Apps shouldn't wrap it in another live region: it would be announced twice. The user docs page tells developers this.
- The icon has no label, because the text says the same thing.
- Not colour alone: the icon shape and the text both carry the meaning.
- `metric` needs the spoken name from `SensorLabel`, so a screen reader says "carbon dioxide sensor failure".
- Contrast: red 800 (`#7f161f`) on white is 10.3:1, above the 4.5:1 needed for text.

### Open questions

- **Help per Fault Code.** Add it later as a separate Controls component, or as text inside this one?
- **More Fault Codes.** Only two appear in the docs. The list needs to come from the Hub agent and the API.
