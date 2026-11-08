# OpenCloseControl

> Spec for the team. Status: **reviewed** (2026-11-08). In Figma and built in code (`pnpm build` passes). Not checked in a browser yet; no user docs page yet. Shared parts (message line, status icon, Failed text) live in [`ControlParts`](../ControlParts/ControlParts.md). Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md). Follows the Control pattern set by [`PowerControl`](../PowerControl/PowerControl.md): reported value, Pending, Failed, view-only, loading, Disconnected.

Figma: `OpenCloseControl` component set (node `657:154`, page `OpenCloseControl`), property `state` with 9 values: `closed`, `opening`, `open`, `closing`, `pending`, `view-only`, `failed`, `loading`, `disconnected`. Buttons are `Button` `secondary` instances; the pill is a `StateValue` instance with the new `StateIcon` `open-close-*` icons. Usage: `OpenCloseControl / usage` (node `659:401`), incl. a Device without Stop (button hidden) and a long name.

### Purpose

Opens, closes or stops something that moves: motorized blinds (case B in the review), and later a garage door, a gate or a valve. It shows the reported State (Open, Closed, Opening, Closing) and offers the commands the Device allows.

Position (0–100 %, case C) is a separate [`ValueControl`](../ValueControl/ValueControl.md) next to it. Manual blinds (case A) are an Asset watched by a Contact Sensor: use `SensorState`.

### Component in domain model context

Category: **Controls**.

| Part    | Domain term                                             | Example            | Rule                                                                                                      |
| ------- | ------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| name    | The Control's name                                      | Living room blinds | Passed by the parent.                                                                                     |
| value   | **State Control**, Metric **Open / Close**, its Reading | Opening            | Always the reported State, shown with `StateValue` (`metric="open-close"`).                               |
| actions | **Allowed Commands**: `open`, `close`, `stop`           | [Open] [Stop]      | Only allowed commands are shown. Of those, a command that doesn't fit the State is disabled (see States). |
| message | **Command Status**, view-only                           | Opening…           | As in PowerControl.                                                                                       |

**Not allowed: hidden here, disabled in PowerControl.** PowerControl has one switch, so it can't hide a direction; it disables it and says why. Here every command is its own button, so a command the Device never allows is simply **not shown**, as the Glossary says ("isn't offered"). A command that is allowed but doesn't fit the current State (Open while already Open) stays visible but disabled, so the buttons don't jump around as the blinds move.

When is a command **Confirmed**? `open` when the Device reports Opening or Open; `close` when it reports Closing or Closed; `stop` when it reports Open or Closed (a stopped blind reports where it is).

What it does **not** do: Position (ValueControl), Tilt (later, not in the MVP), send commands (`onCommand`), show Faults or Stale.

### Visual idea

| Question                        | Answer                                                                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | Row 1: name on the left, the State pill on the right. Row 2: the buttons, sharing the full width equally: [Open] [Stop] [Close]. Row 3: the message, when there is one. |
| Buttons                         | `Button` `secondary`, text only (no icons needed). In this order: Open, Stop, Close, so Stop sits between the two directions.                                           |
| More than one size?             | One size.                                                                                                                                                               |
| When space is tight             | The name is shortened with `…`; the buttons wrap to a second line.                                                                                                      |

### States

| #   | State                                     | When                       | Value (pill)      | Buttons                                                                                                       | Message                                       |
| --- | ----------------------------------------- | -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | `disconnected`                            | `isDisconnected`           | disconnected icon | hidden                                                                                                        | none                                          |
| 2   | `loading`                                 | `state={null}`             | loading icon      | hidden                                                                                                        | none                                          |
| 3   | `pending`                                 | `command.status="pending"` | reported State    | all disabled                                                                                                  | ⟳ "Opening…" / "Closing…" / "Stopping…"       |
| 4   | `view-only`                               | `isViewOnly`               | reported State    | all disabled                                                                                                  | "View only"                                   |
| 5   | `failed`                                  | `command.status="failed"`  | reported State    | as in 6                                                                                                       | ⚠ "Couldn't open. The device didn't respond." |
| 6   | `open` / `closed` / `opening` / `closing` | otherwise                  | reported State    | Open enabled when Closed or Closing; Close enabled when Open or Opening; Stop enabled when Opening or Closing | none                                          |

Target states: loading yes; Connected yes; Stale no (commands still work); Disconnected yes; Fault no.

### Anatomy

```
OpenCloseControl          <div>
├── row
│   ├── name              "Living room blinds"
│   └── value             StateValue (metric="open-close")
├── actions               <div role="group" aria-label={name}>
│   ├── Button            "Open"
│   ├── Button            "Stop"
│   └── Button            "Close"
└── message               role="status"
```

### API

| Prop              | Type                                                                                   | Required | Description                                     |
| ----------------- | -------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| `name`            | `string`                                                                               | yes      | Shown on the left; names the group of buttons.  |
| `state`           | `StateOf<"open-close"> \| null`                                                        | yes      | The reported State.                             |
| `allowedCommands` | `CommandOf<"open-close">[]`                                                            | yes      | At least one. Commands not listed aren't shown. |
| `onCommand`       | `(command: CommandOf<"open-close">) => void`                                           | yes      | Called with `"open"`, `"close"` or `"stop"`.    |
| `command`         | `{ command: CommandOf<"open-close">; status: CommandStatus; failureMessage?: string }` | no       | The last command and its Command Status.        |
| `isDisconnected`  | `boolean`                                                                              | no       |                                                 |
| `isViewOnly`      | `boolean`                                                                              | no       |                                                 |

### Example values

| Story                                 | Props                                                                | Shows                                 |
| ------------------------------------- | -------------------------------------------------------------------- | ------------------------------------- |
| `Closed`                              | `name="Living room blinds"`, `state="closed"`, all three commands    | Closed; [Open] [Stop off] [Close off] |
| `Opening`                             | `state="opening"`                                                    | Opening; [Open off] [Stop] [Close]    |
| `Open`                                | `state="open"`                                                       | Open; [Open off] [Stop off] [Close]   |
| `Pending`                             | `state="closed"`, `command={{ command: "open", status: "pending" }}` | Closed; all off; ⟳ Opening…           |
| `Failed`                              | `state="closed"`, `command={{ command: "open", status: "failed" }}`  | ⚠ Couldn't open. …                    |
| `NoStop`                              | `allowedCommands={["open", "close"]}`                                | No Stop button                        |
| `ViewOnly`, `Loading`, `Disconnected` | as in PowerControl                                                   |                                       |
| `LongText`                            | name "Bedroom blackout blinds by the balcony door", 200px            | Name `…`; buttons wrap                |
| `Minimal`                             | `name="Blinds"`, `state="open"`, `allowedCommands={["close"]}`       | Open; [Close]                         |

### Tokens

As `PowerControl` (name, message, gaps); `space/2` between buttons; buttons and pill from `Button` and `StateValue`.

### Accessibility

- The buttons are a `role="group"` named by `name`: "Living room blinds, group, Open, button".
- Disabled buttons stay in the tab order? No: native `disabled`. The pill already says why (it is Open, so Open is off).
- Message line: `role="status"`, as in PowerControl.

### Decisions (2026-11-08, owner)

- **Not allowed: hidden.** A command the Device never allows isn't shown; an allowed one that doesn't fit the State is disabled.
- **Copy approved**, including "Opening…" for Pending.
