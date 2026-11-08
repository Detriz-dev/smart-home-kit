# OperationalStateValue

> Spec for the team: decisions, Figma mapping and open questions. Status: **draft, waiting for review** (2026-11-08). In Figma and built in code (`pnpm build` passes). Not checked in a browser yet; no user docs page yet. Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md).

### Purpose

Shows what a Device that runs a task is doing right now: its **Operational State**, and next to it the **Phase** while it is Running ("Running · Heating") or the **Error Reason** when it is Error ("Error · No water"). Read-only: starting or stopping the task is `OperationalStateControl`.

Used in `DeviceCard` (the renamed `DeviceCard`), `SpaceCard` rows and Device lists, for a kettle, a washing machine or a thermostat.

Figma: `OperationalStateValue` component set in _DeTriz - Smart Home Kit_ (node `652:3315`, page `OperationalStateValue`), property `state` (8) × `size` (2) = 16 variants. The value is a nested `StateValue` instance; the Operational State icons are new `StateIcon` variants (`operational-state-*`). Usage: frame `OperationalStateValue / usage` (node `652:3316`). Figma can't show the detail text moving under the pill when space is tight (a fixed width can't be set on text inside an instance there); that is code behaviour (`flex-wrap`).

### Component in domain model context

Category: **Readings** ("What is it right now?"). It changes whenever the Device reports a new Operational State, Phase or Error Reason.

It shows one Reading of the [Operational State](/kit/apps/docs-site/docs/domain-model/glossary.mdx#operational-state) Capability:

| Part   | Domain term           | Example  | Rule                                                                                                                                      |
| ------ | --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| value  | **Operational State** | Running  | One of Stopped, Running, Paused, Error. Shown with [`StateValue`](../StateValue/StateValue.md) (`metric="operational-state"`).            |
| detail | **Phase**             | Heating  | Only while Running (Data model rule 31). Reported by the Device, so it is free text.                                                      |
| detail | **Error Reason**      | No water | Only while Error. The kit's message for a general reason, or the Device's own label. See [Error Reason messages](#error-reason-messages). |

If a Fault caused the Error, the Error Reason points to its Fault Code, and this component shows **one** message that names both ("Can't start: sensor failure"), so the user doesn't see the same problem twice (Data model rule 33).

What it does **not** show, and why:

- **Start, Pause, Resume, Stop.** Commands belong to `OperationalStateControl`, which uses this component inside it.
- **The Fault itself.** `DeviceFaultStatus` shows Faults. A Fault that doesn't stop the task (a thermostat that needs calibration but keeps Running) is not shown here.
- **The Device's name.** Context: the card or row around it.
- **Stale.** `DeviceConnectionStatus` shows it; the last State stays as it is.

### Visual idea

| Question                        | Answer                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | The `StateValue` pill, then a short text: (▶ Running) Heating. In Error: (⚠ Error) No water, the text in the danger colour. |
| Icons?                          | Only the pill's icon, from `STATE_ICONS["operational-state"]`.                                                              |
| Separators?                     | No `·`: the pill's edge separates the two parts.                                                                            |
| More than one size?             | Two, the same as `StateValue`: `md` (rows, lists) and `lg` (cards).                                                         |
| When space is tight             | The detail text moves under the pill and may wrap. The pill never wraps or shrinks.                                         |

### States

| State           | When                                 | Shows                                     | Colours                                            | Screen reader      |
| --------------- | ------------------------------------ | ----------------------------------------- | -------------------------------------------------- | ------------------ |
| `stopped`       | `state="stopped"`                    | Grey pill "Stopped"                       | `StateValue` inactive                              | "Stopped"          |
| `running`       | `state="running"`, no `phase`        | Blue pill "Running"                       | `StateValue` active                                | "Running"          |
| `running-phase` | `state="running"`, `phase="Heating"` | Blue pill "Running", then "Heating"       | `StateValue` active; detail `color-text/secondary` | "Running, Heating" |
| `paused`        | `state="paused"`                     | Grey pill "Paused"                        | `StateValue` inactive                              | "Paused"           |
| `error`         | `state="error"`, `errorReason` set   | Red pill "Error", then the reason         | `StateValue` error; detail `status/danger/fg`      | "Error, No water"  |
| `error-alone`   | `state="error"`, no `errorReason`    | Red pill "Error" only                     | `StateValue` error                                 | "Error"            |
| `loading`       | `state={null}`                       | `StateValue` loading icon, no detail      | `StateValue` loading                               | "Loading"          |
| `disconnected`  | `isDisconnected`                     | `StateValue` disconnected icon, no detail | `StateValue` disconnected                          | "Disconnected"     |

A `phase` passed while the state isn't Running, or an `errorReason` passed while it isn't Error, is ignored. With `alertLevel`, the pill takes the Alert Level's colours, as in `StateValue`; the detail text keeps its own colour.

Target states:

| Target state | Applies? | Why                                                                                                                  |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| loading      | yes      | `loading`, from `StateValue`.                                                                                        |
| Connected    | yes      | `stopped`, `running`, `paused`, `error`.                                                                             |
| Stale        | no       | Shown by `DeviceConnectionStatus`. The last State stays.                                                             |
| Disconnected | yes      | `disconnected`: the State, Phase and Error Reason are hidden.                                                        |
| Fault        | partly   | Only when a Fault caused the Error: its name is part of the Error Reason message. Other Faults: `DeviceFaultStatus`. |

### Error Reason messages

| `errorReason`                                                        | Shows                                  |
| -------------------------------------------------------------------- | -------------------------------------- |
| `{ code: "unable-to-start-or-resume" }`                              | Can't start                            |
| `{ code: "unable-to-complete" }`                                     | Couldn't finish                        |
| `{ code: "command-invalid-in-state" }`                               | Can't do that now                      |
| `{ code: "no-water", label: "No water" }` (the Device's own)         | No water                               |
| Any reason with `label`                                              | The `label`, instead of the kit's text |
| `{ code: "unable-to-start-or-resume", faultCode: "sensor_failure" }` | Can't start: sensor failure            |

The Fault part reuses the `DeviceFaultStatus` wording ("sensor failure", "calibration required"), so the same Fault reads the same everywhere.

### Anatomy

```
OperationalStateValue
├── value    StateValue (metric="operational-state")
└── detail   "Heating" / "No water"     (only for running-phase and error)
```

1. **root**: a `<span>`, inline-flex, wraps when narrow. Gap `space/2`.
2. **value**: the `StateValue` pill, same size as the component.
3. **detail**: one short text. Secondary colour for a Phase, danger colour for an Error Reason. May wrap, never truncated: it's the only place that says why.

### API

The props are defined in [`OperationalStateValue.types.ts`](./OperationalStateValue.types.ts), the source of truth. The table below is the original proposal:

| Prop             | Type                       | Required | Description                                                                                 |
| ---------------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `state`          | `OperationalState \| null` | yes      | The latest Operational State. `null` while the first Reading is on its way.                 |
| `phase`          | `string`                   | no       | What kind of Running, as the Device reports it ("Heating"). Shown only while `running`.     |
| `errorReason`    | `ErrorReason`              | no       | Why it is Error. Shown only while `error`.                                                  |
| `isDisconnected` | `boolean`                  | no       | The Device's Connection Status is Disconnected. Hides everything but the disconnected icon. |
| `alertLevel`     | `AlertLevel`               | no       | The Alert Level of an Active Alert about this Reading. Passed to `StateValue`.              |
| `size`           | `"md" \| "lg"`             | no       | Defaults to `md`.                                                                           |

`OperationalState`, `ErrorReason` and `AlertLevel` are shared types that already exist.

### Example values

| Story            | Props                                                                                               | Shows                                 |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `Running`        | `state="running"`, `phase="Heating"` (kettle)                                                       | (▶ Running) Heating                   |
| `KeepingWarm`    | `state="running"`, `phase="Keeping warm"`                                                           | (▶ Running) Keeping warm              |
| `Paused`         | `state="paused"` (washing machine)                                                                  | (⏸ Paused)                            |
| `Stopped`        | `state="stopped"`                                                                                   | (⏹ Stopped)                           |
| `ErrorOwnReason` | `state="error"`, `errorReason={{ code: "no-water", label: "No water" }}`                            | (⚠ Error) No water                    |
| `ErrorFromFault` | `state="error"`, `errorReason={{ code: "unable-to-start-or-resume", faultCode: "sensor_failure" }}` | (⚠ Error) Can't start: sensor failure |
| `Loading`        | `state={null}`                                                                                      | loading icon                          |
| `Disconnected`   | `state="running"`, `isDisconnected`                                                                 | disconnected icon                     |
| `LongText`       | `state="error"`, label "Water level too low to start heating", `lg`, 200px wide                     | The reason wraps under the pill       |
| `Minimal`        | `state="stopped"`, `md`                                                                             | (⏹ Stopped)                           |

### Tokens

| Part             | Property   | Token                                                          |
| ---------------- | ---------- | -------------------------------------------------------------- |
| root             | gap        | `space/2`                                                      |
| detail (phase)   | colour     | `color-text/secondary`                                         |
| detail (error)   | colour     | `status/danger/fg`                                             |
| detail (md / lg) | text       | `typography/label/*` / `typography/body/*` (to check in Figma) |
| value            | everything | from `StateValue`                                              |

### Accessibility

- All text is real text: screen readers read "Running, Heating" or "Error, No water".
- Not colour alone: the word "Error", the error icon and the reason text all say it.
- No live region, like `StateValue`: the value is part of a card the user is reading. Commands that change it announce through `OperationalStateControl`.

### Open questions

- **Phase while Paused.** Matter keeps the Phase while Paused ("Paused · Rinsing"). The Data model says Phase only while Running. Keep it simple (Running only), or show it while Paused too?

### Decisions (2026-11-08, owner)

- **Error Reason copy approved:** "Can't start", "Couldn't finish", "Can't do that now".
