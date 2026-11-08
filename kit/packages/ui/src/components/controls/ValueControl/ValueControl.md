# ValueControl

> Spec for the team. Status: **reviewed** (2026-11-08). In Figma, not built in code yet. Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md). Follows the Control pattern set by [`PowerControl`](../PowerControl/PowerControl.md).

Figma: `ValueControl` component set (node `659:177`, page `ValueControl`), properties `input` (`stepper`, `slider`) × `state` (`default`, `draft`, `pending`, `view-only`, `failed`, `loading`, `disconnected`) = 14 variants. − / + are `IconButton` `secondary` with the new `Icon` `remove` / `add`; the Unit is a `UnitLabel` instance (new `percent` variant). Usage: `ValueControl / usage` (node `659:512`), incl. at max (+ disabled).

### Purpose

Sets a number inside a range: the heating **Setpoint** (0–30 °C in steps of 0.5) or the blinds' **Position** (0–100 % in steps of 1). It shows the value the Device reports, lets the user pick a new one, and sends it once.

### Component in domain model context

Category: **Controls**.

| Part    | Domain term                                                         | Example           | Rule                                                                         |
| ------- | ------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| name    | The Control's name (its Metric)                                     | Setpoint          | Passed by the parent.                                                        |
| value   | **Value Control**, Metric **Setpoint** or **Position**, its Reading | 22 °C             | The **reported** value, with its Unit (`UnitLabel`).                         |
| input   | Range: **min, max, step**                                           | 0–30, 0.5         | The input never goes outside the range or off the step (Data model rule 30). |
| input   | **Allowed Commands**: `set-setpoint` or `set-position`              | –                 | Without it the Control is read-only: use `SensorReading` instead.            |
| message | **Command Status**, view-only                                       | Setting to 23 °C… | As in PowerControl.                                                          |

**A draft value.** While the user is choosing, the component keeps a **draft** (its own state) and shows it in place of the reported value, marked as not sent yet. It sends **one** command when the user is done: on releasing the slider, or 1 second after the last − / + press. Sending on every step would create many Pending commands, and only one may be Pending (Data model rule 35). After sending, the draft is dropped and the reported value shows again, with "Setting to 23 °C…" until it's confirmed.

**Not the measurement.** The heating's measured Temperature is a Sensor next to it (`SensorReading`), never part of this component. The Glossary's Setpoint row: "It is not a measurement."

### Visual idea

Two inputs, chosen by the `input` prop:

| `input`   | Looks like                                      | Use it for                             |
| --------- | ----------------------------------------------- | -------------------------------------- |
| `stepper` | Name, then [ − ] **22 °C** [ + ]                | Small ranges with fine steps: Setpoint |
| `slider`  | Name and **40 %** on one row, a slider under it | 0–100 ranges: Position                 |

- − / + are `IconButton` `secondary` with the icons `remove` and `add` (**two new icons**: Step 1b, "check the building blocks").
- The value uses the readout text style, so it reads like a Reading.
- A draft value is shown in the active colour with a dotted underline, so it reads as "not sent yet".
- One size. When space is tight, the name is shortened with `…`; the value never is.

### States

| #   | State          | When                       | Value                     | Input                               | Message                                            |
| --- | -------------- | -------------------------- | ------------------------- | ----------------------------------- | -------------------------------------------------- |
| 1   | `disconnected` | `isDisconnected`           | hidden; disconnected icon | hidden                              | none                                               |
| 2   | `loading`      | `value={null}`             | loading icon              | disabled                            | none                                               |
| 3   | `pending`      | `command.status="pending"` | reported value            | disabled                            | ⟳ "Setting to 23 °C…"                              |
| 4   | `view-only`    | `isViewOnly`               | reported value            | disabled                            | "View only"                                        |
| 5   | `draft`        | the user is choosing       | draft value, not sent     | enabled                             | none                                               |
| 6   | `failed`       | `command.status="failed"`  | reported value            | enabled                             | ⚠ "Couldn't set 23 °C. The device didn't respond." |
| 7   | default        | otherwise                  | reported value            | enabled; − off at min, + off at max | none                                               |

Target states: as in PowerControl.

### Anatomy

```
ValueControl (stepper)               ValueControl (slider)
├── name        "Setpoint"           ├── row
├── input                            │   ├── name     "Position"
│   ├── decrease  IconButton −       │   └── value    "40 %"
│   ├── value     "22" + UnitLabel   ├── input        <input type="range">
│   └── increase  IconButton +       └── message
└── message     role="status"
```

### API

| Prop                 | Type                                                                | Required | Description                                                                                |
| -------------------- | ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `name`               | `string`                                                            | yes      | "Setpoint", "Position".                                                                    |
| `value`              | `number \| null`                                                    | yes      | The reported value, in the Metric's standard Unit.                                         |
| `unit`               | `UnitLabelUnit`                                                     | yes      | `celsius`, `percent`…                                                                      |
| `min`, `max`, `step` | `number`                                                            | yes      | The range, from the Device.                                                                |
| `onCommit`           | `(value: number) => void`                                           | yes      | Called once, with the value the user chose. The app sends `set-setpoint` / `set-position`. |
| `input`              | `"stepper" \| "slider"`                                             | no       | Defaults to `stepper`.                                                                     |
| `fractionDigits`     | `number`                                                            | no       | How many decimals to show (Setpoint 1, Position 0). Defaults to 0.                         |
| `command`            | `{ value: number; status: CommandStatus; failureMessage?: string }` | no       | The value asked for, and its Command Status.                                               |
| `isDisconnected`     | `boolean`                                                           | no       |                                                                                            |
| `isViewOnly`         | `boolean`                                                           | no       |                                                                                            |

### Example values

`Setpoint` (22, celsius, 0–30, step 0.5, stepper), `Position` (40, percent, 0–100, 1, slider), `AtMax` (30: + disabled), `Draft` (23 chosen, not sent), `Pending`, `Failed`, `ViewOnly`, `Loading`, `Disconnected`, `LongText` ("Bedroom heating setpoint for the night", 200px), `Minimal` (name "Setpoint", 20 °C).

### Tokens

As `PowerControl` for name and message. Value: `typography/readout-sm/*`, `color-text/primary`; draft: `state/active/fg` with a dotted underline. Slider track `status/neutral/border`, filled part and thumb `status/progress/border`, like `Switch`.

### Accessibility

- Stepper: the value is an `<output>`; − / + are named "Decrease Setpoint" / "Increase Setpoint". Screen readers hear the new draft value after each press (the output is `aria-live="polite"`).
- Slider: a native `<input type="range">` named by `name`, with `aria-valuetext` including the Unit ("22.5 degrees Celsius"), so arrow keys and screen readers work without extra code.
- The commit delay (1 s) doesn't block keyboard users: Enter on the slider or the value commits at once.

### Open questions

- **New icons** `add` and `remove` for the stepper. OK?
- **Name `onCommit` vs. `onCommand`.** Other Controls use `onCommand(command)`. Here the command is always the same (`set-setpoint` or `set-position`), so `onCommit(value)` is simpler. OK?

### Decisions (2026-11-08, owner)

- **Draft, then one command.** Sent on slider release or 1 second after the last − / + press.
- **Copy approved.**
