# StateSelectControl

> Spec for the team. Status: **reviewed** (2026-11-08). In Figma and built in code (`pnpm build` passes). Not checked in a browser yet; no user docs page yet. Shared parts (message line, status icon, Failed text) live in [`ControlParts`](../ControlParts/ControlParts.md). Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md) (decision 22), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md). Follows the Control pattern set by [`PowerControl`](../PowerControl/PowerControl.md).

Figma: `StateSelectControl` component set (node `658:97`, page `StateSelectControl`), property `state` with 7 values: `heat`, `off`, `pending`, `view-only`, `failed`, `loading`, `disconnected`. Segments are built from tokens (no separate segment component yet), with the new `StateIcon` `mode-*` icons. The row wraps: when narrow, the segments move under the name (name min width 96px). Usage: `StateSelectControl / usage` (node `659:478`).

### Purpose

Picks one of a few States for a State Control: today the heating **Mode** (Off, Heat). It is generic on purpose (decision 22), so later Controls with a few options reuse it: Cool and Auto for heating, fan speed, washing programmes.

### Component in domain model context

Category: **Controls**.

| Part    | Domain term                                        | Example            | Rule                                                                                                |
| ------- | -------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| name    | The Control's name (its Metric)                    | Mode               | Passed by the parent.                                                                               |
| options | **State Control**, Metric **Mode**, its **States** | Off · Heat         | One segment per State of the Metric (`StatesByMetric`). The selected one is the **reported** State. |
| options | **Allowed Commands**: `set-mode`                   | –                  | Without `set-mode` the Control is read-only: use `StateValue` instead.                              |
| message | **Command Status**, view-only                      | Switching to Heat… | As in PowerControl.                                                                                 |

One command (`set-mode`) with a value: the State to switch to. Confirmed when a Reading shows that State.

What it does **not** do: show the measured temperature or the Setpoint (a Sensor and a `ValueControl` next to it); send commands; show Faults or Stale.

### Visual idea

| Question                        | Answer                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | Name on the left; on the right a segmented control: [ Off                                                     | Heat ], the reported State filled. |
| Icons?                          | Each segment has its State's icon from `STATE_ICONS` (`mode_off_on`, `mode_heat`) and its word.               |
| More than one size?             | One size.                                                                                                     |
| When space is tight             | The segmented control moves under the name; the words never truncate.                                         |
| Why segments, not a dropdown?   | Two to four options, all visible at once, one tap to change. A dropdown is for longer lists (not needed yet). |

### States

| #   | State          | When                       | Segments                              | Message                                                 |
| --- | -------------- | -------------------------- | ------------------------------------- | ------------------------------------------------------- |
| 1   | `disconnected` | `isDisconnected`           | hidden; disconnected icon             | none                                                    |
| 2   | `loading`      | `state={null}`             | hidden; loading icon                  | none                                                    |
| 3   | `pending`      | `command.status="pending"` | reported State selected; all disabled | ⟳ "Switching to Heat…"                                  |
| 4   | `view-only`    | `isViewOnly`               | reported State selected; all disabled | "View only"                                             |
| 5   | `failed`       | `command.status="failed"`  | reported State selected; enabled      | ⚠ "Couldn't switch to Heat. The device didn't respond." |
| 6   | default        | otherwise                  | reported State selected; enabled      | none                                                    |

Interaction states per segment: hover, focus ring, pressed, disabled. Target states: as in PowerControl.

### Anatomy

```
StateSelectControl        <div>
├── row
│   ├── name              "Mode"            (id used as the group's label)
│   └── options           <div role="group" aria-labelledby=name>
│       ├── option        <button aria-pressed>  icon + "Off"
│       └── option        <button aria-pressed>  icon + "Heat"
└── message               role="status"
```

### API

| Prop             | Type                                                                         | Required | Description                                                                                |
| ---------------- | ---------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `name`           | `string`                                                                     | yes      | "Mode".                                                                                    |
| `metric`         | `"mode"`                                                                     | yes      | Decides the options and their icons. Only `mode` has `set-mode` today; more Metrics later. |
| `state`          | `StateOf<"mode"> \| null`                                                    | yes      | The reported State.                                                                        |
| `onSelect`       | `(state: StateOf<"mode">) => void`                                           | yes      | Called with the State the user picked. The app sends `set-mode`.                           |
| `command`        | `{ state: StateOf<"mode">; status: CommandStatus; failureMessage?: string }` | no       | The State asked for, and its Command Status.                                               |
| `isDisconnected` | `boolean`                                                                    | no       |                                                                                            |
| `isViewOnly`     | `boolean`                                                                    | no       |                                                                                            |

No `allowedCommands` prop: `set-mode` is the Metric's only command, and a Mode without it is a Sensor (`StateValue`).

### Example values

`Heat` (state heat), `Off`, `Pending` (off → Heat), `Failed`, `ViewOnly`, `Loading`, `Disconnected`, `LongText` (name "Heating mode in the children's bedroom", 200px), `Minimal` (name "Mode", Off).

### Tokens

As `PowerControl` for name and message. Segments: container `radius/full` with `status/neutral/border` outline; selected segment `state/active/bg` + `state/active/fg` (Heat) or `state/inactive/bg` + `state/inactive/fg` (Off), the same colours as `StateValue`; padding `space/1` / `space/3`; label text style.

### Accessibility

- A `group` of toggle buttons named by the name: "Mode, group, Heat, toggle button, pressed". **Not a radio group** (changed while building, 2026-11-08): in a radio group the arrow keys change the selection, and here every change sends a command to the Device. With toggle buttons, Tab moves between options and Enter or Space picks one.
- Selection is not colour alone: the selected option has a fill **and** `aria-pressed`.

### Open questions

- **Generic now, one Metric today.** `metric` only accepts `"mode"` until another Metric with a `set-…` command exists. OK, or name it `ModeControl` for now and generalise later? (Decision 22 said generic.)

### Decisions (2026-11-08, owner)

- **Copy approved.**
