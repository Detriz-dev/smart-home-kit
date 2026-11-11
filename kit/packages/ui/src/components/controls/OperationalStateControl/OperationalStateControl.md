# OperationalStateControl

> Spec for the team. Status: **reviewed** (2026-11-08). In Figma and built in code (`pnpm build` passes). Not checked in a browser yet; no user docs page yet. Shared parts (message line, status icon, Failed text) live in [`ControlParts`](../ControlParts/ControlParts.md). Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md) (decisions 11 and 14), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md). Follows the Control pattern set by [`PowerControl`](../PowerControl/PowerControl.md).

Figma: `OperationalStateControl` component set (node `659:342`, page `OperationalStateControl`), property `state` with 10 values: `stopped`, `running`, `paused`, `error`, `pending`, `view-only`, `powered-off`, `failed`, `loading`, `disconnected` (washing machine, all four commands). The value is an `OperationalStateValue` instance; buttons are `Button` `secondary`. Usage: `OperationalStateControl / usage` (node `659:572`): kettle Running [Stop], Stop-only kettle while Stopped (no buttons), long name.

### Purpose

Starts, pauses, resumes and stops the task of a Device that runs one: a kettle (Start, Stop) or a washing machine (Start, Pause, Resume, Stop). It shows what the Device is doing with [`OperationalStateValue`](../../readings/OperationalStateValue/OperationalStateValue.md) and offers the commands the Device allows.

### Component in domain model context

Category: **Controls**.

| Part    | Domain term                                              | Example           | Rule                                                                         |
| ------- | -------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| name    | The Device or task                                       | Kettle            | Passed by the parent.                                                        |
| value   | **Operational State**, **Phase**, **Error Reason**       | Running · Heating | `OperationalStateValue`, reported.                                           |
| actions | **Allowed Commands**: `start`, `pause`, `resume`, `stop` | [Start] [Stop]    | Every allowed command is shown; those that don't fit the State are disabled. |
| message | **Command Status**, view-only                            | Stopping…         | As in PowerControl.                                                          |

**Which buttons show.** Like `OpenCloseControl`, a command the Device never allows is not shown. Every allowed one is always shown, in a fixed order, [Start / Resume] [Pause] [Stop], so the buttons don't move as the task runs (decided 2026-11-08, replaces "only the buttons that fit"). The first button says Resume while Paused and Start otherwise. A command that doesn't fit the current State is disabled:

| Operational State | Enabled (if allowed) | Disabled     |
| ----------------- | -------------------- | ------------ |
| Stopped           | Start                | Pause, Stop  |
| Running           | Pause, Stop          | Start        |
| Paused            | Resume, Stop         | Pause        |
| Error             | Stop                 | Start, Pause |

A kettle that only allows Stop shows [Stop], disabled while Stopped. A read-only kettle (no Allowed Commands) is just `OperationalStateValue`.

**Power Off.** If the Device also has a Power Control and Power is Off, Start isn't allowed (Data model rule 32). The parent passes `isPoweredOff`; [Start] is disabled and "Turn the power on to start" shows under the buttons.

When is a command **Confirmed**? `start` and `resume` when the Device reports Running; `pause` when it reports Paused; `stop` when it reports Stopped.

### Visual idea

| Question                        | Answer                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| What does it roughly look like? | Like OpenCloseControl. Row 1: name on the left, the `OperationalStateValue` on the right. Row 2: the buttons joined into one bar, sharing the full width equally: [Start | Pause | Stop]. Row 3: message. |
| Buttons                         | `Button` `secondary`, text only (decided 2026-11-08).                                                                                                                    |
| More than one size?             | One size.                                                                                                                                                                |
| When space is tight             | Name `…`; the value moves under the name when the row is too narrow; the bar stays on one line and long labels wrap inside their button.                                 |

### States

| #   | State          | When                       | Value             | Buttons             | Message                                                |
| --- | -------------- | -------------------------- | ----------------- | ------------------- | ------------------------------------------------------ |
| 1   | `disconnected` | `isDisconnected`           | disconnected icon | hidden              | none                                                   |
| 2   | `loading`      | `state={null}`             | loading icon      | hidden              | none                                                   |
| 3   | `pending`      | `command.status="pending"` | reported          | all disabled        | ⟳ "Starting…" / "Pausing…" / "Resuming…" / "Stopping…" |
| 4   | `view-only`    | `isViewOnly`               | reported          | all disabled        | "View only"                                            |
| 5   | `powered-off`  | `isPoweredOff`, Stopped    | Stopped           | all disabled        | "Turn the power on to start"                           |
| 6   | `failed`       | `command.status="failed"`  | reported          | as in 7             | ⚠ "Couldn't start. The device didn't respond."         |
| 7   | default        | otherwise                  | reported          | per the table above | none                                                   |

Target states: loading yes; Connected yes; Stale no; Disconnected yes; Fault partly (through the Error Reason, as in OperationalStateValue).

### Anatomy

```
OperationalStateControl    <div>
├── name                   "Kettle"
├── value                  OperationalStateValue
├── actions                <div role="group" aria-label={name}>  Buttons
└── message                role="status"
```

### API

| Prop              | Type                                                                              | Required | Description                                           |
| ----------------- | --------------------------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| `name`            | `string`                                                                          | yes      |                                                       |
| `state`           | `OperationalState \| null`                                                        | yes      | Reported.                                             |
| `phase`           | `string`                                                                          | no       | Passed to `OperationalStateValue`.                    |
| `errorReason`     | `ErrorReason`                                                                     | no       | Passed to `OperationalStateValue`.                    |
| `allowedCommands` | `OperationalCommand[]`                                                            | yes      | At least one; with none, use `OperationalStateValue`. |
| `onCommand`       | `(command: OperationalCommand) => void`                                           | yes      |                                                       |
| `command`         | `{ command: OperationalCommand; status: CommandStatus; failureMessage?: string }` | no       |                                                       |
| `isPoweredOff`    | `boolean`                                                                         | no       | The Device's Power Control is Off (rule 32).          |
| `isDisconnected`  | `boolean`                                                                         | no       |                                                       |
| `isViewOnly`      | `boolean`                                                                         | no       |                                                       |

### Example values

`KettleRunning` (Running · Heating, `["start", "stop"]`: [Start] disabled, [Stop]), `KettleStopped` ([Start], [Stop] disabled), `KettleStopOnly` (Stopped, `["stop"]`: [Stop] disabled), `WashingRunning` (Running · Rinsing, all four: [Start] disabled, [Pause] [Stop]), `WashingPaused` ([Resume], [Pause] disabled, [Stop]), `Error` (No water: only [Stop] enabled), `PoweredOff`, `Pending` (Stopping…), `Failed`, `ViewOnly`, `Loading`, `Disconnected`, `LongText`, `Minimal` (name "Kettle", Stopped, [Start]).

### Tokens

As `PowerControl` and `OperationalStateValue`. Name and value share a row (`space/3` gap, at least `size/6` tall), as in OpenCloseControl. The buttons are joined into one bar, the same as OpenCloseControl (Figma: `actions` spacing −1): no gap, the outlines overlap by `border-width/thin` so the shared line is 1px, inner corners `radius/0`, outer corners `radius/8`. Styles: `.row` and `.actionsBar` in `ControlParts.module.css`.

### Accessibility

- Buttons are a `role="group"` named by `name`.
- After a command, the pressed button can become disabled (Start once Running), and a disabled button loses focus. Focus then moves to the first enabled button, so keyboard users don't land on `<body>`.
- Message line: `role="status"`.

### Open questions

- **Stopped, Stop-only kettle:** only a disabled [Stop]. Show a hint ("Start it on the kettle")? This draft shows nothing extra.

### Decisions (2026-11-08, owner)

- **All buttons `secondary`.** Several Controls can share a card; filled buttons would compete. (Replaces "first one is `primary`" in Visual idea.)
- **Copy approved.**
