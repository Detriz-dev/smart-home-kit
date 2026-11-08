# PowerControl

> Spec for the team: decisions, Figma mapping and open questions. Status: **draft, waiting for review** (2026-11-08). In Figma and built in code (`pnpm build` passes). Not checked in a browser yet; no user docs page yet. Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md).

### Purpose

Turns one **Power** Control of a Device on or off: a socket on a power strip, or the power of a washing machine. It shows the value the Device **reports**, and while a command is on its way it says so ("Turning on…"). It wraps the existing [`Switch`](../Switch/Switch.md) (decision 25).

It is the **first Device Control** in the kit. The pattern it sets (reported value, Pending, Failed, not allowed, view-only, Disconnected) is reused by `OpenCloseControl`, `StateSelectControl`, `ValueControl` and `OperationalStateControl`.

Figma: `PowerControl` component set in _DeTriz - Smart Home Kit_ (node `653:73`, page `PowerControl`), property `state` with 8 values: `on`, `off`, `pending`, `view-only`, `not-allowed`, `failed`, `loading`, `disconnected`. 280px wide in Figma; in code it fills its container. The control is a nested `Switch` instance (or `ReadingStatusIcon` for loading / disconnected). Usage: frame `PowerControl / usage` (node `653:74`): a power strip card, the Minimal case and the LongText case.

### Component in domain model context

Category: **Controls**. Note: the [conventions](/docs/architecture/design-system/ds-conventions-and-structure.md#3-components-categorisation) define Controls as "inputs that change the view or settings". Device Controls change something in the home, so that definition needs widening (see Open questions).

| Part    | Domain term                                          | Example       | Rule                                                                                                       |
| ------- | ---------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| name    | The Control's name (its Subject or Metric)           | Desk lamp     | The parent passes it: an Asset name ("Desk lamp"), a socket ("Socket 2") or the Metric ("Power").          |
| switch  | **State Control**, Metric **Power**, its **Reading** | On            | Always the **reported** value. A command never moves it; only the next Reading does (Data model rule 34).  |
| switch  | **Allowed Commands**                                 | Turn off only | A command that isn't allowed isn't offered: the switch is disabled in that direction (Data model rule 29). |
| message | **Command Status**                                   | Turning on…   | Pending and Failed. Confirmed shows nothing extra: the switch already shows the new Reading.               |
| message | Sharing is view-only                                 | View only     | Accounts a Site is shared with can't send commands (Data model rule 14).                                   |

What it does **not** do, and why:

- **Send the command.** `ui` is presentational: `onCommand` tells the parent what the user asked for; the app sends it and passes back the Command Status.
- **Show a Power Reading that can never be changed.** That is a Sensor: use `StateValue` (Data model rule 29). PowerControl needs at least one Allowed Command.
- **Show Faults or Stale.** Status components, as for Readings. A Stale Device can still get commands (Device lifecycle rule 14), so Stale changes nothing here.
- **Start or stop a task.** A kettle uses `OperationalStateControl`, not Power (decision 14).

### Visual idea

| Question                        | Answer                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| What does it roughly look like? | One row: the name on the left, the `Switch` ("[●━━] On") on the right. Under it, when needed, one short line of message.             |
| Icons?                          | Only in the message line: a spinning `refresh` while Pending, `error` when Failed. `link_off` replaces the switch when Disconnected. |
| Separators?                     | No.                                                                                                                                  |
| More than one size?             | One size, the same as `Switch`.                                                                                                      |
| When space is tight             | The name is shortened with `…` (full name in a tooltip); the switch never shrinks; the message wraps.                                |

### States

Worked out from the props, first match wins:

| #   | State          | When                                          | Switch                             | Message line                                       | Message colour         |
| --- | -------------- | --------------------------------------------- | ---------------------------------- | -------------------------------------------------- | ---------------------- |
| 1   | `disconnected` | `isDisconnected`                              | Hidden; `link_off` icon instead    | none                                               | –                      |
| 2   | `loading`      | `state={null}`                                | Hidden; spinning `refresh` instead | none                                               | –                      |
| 3   | `pending`      | `command.status="pending"`                    | Reported value, **disabled**       | ⟳ "Turning on…" / "Turning off…"                   | `color-text/secondary` |
| 4   | `view-only`    | `isViewOnly`                                  | Reported value, disabled           | "View only"                                        | `color-text/secondary` |
| 5   | `not-allowed`  | The flip direction isn't in `allowedCommands` | Reported value, disabled           | "Can't be turned on from the app" / "…turned off…" | `color-text/secondary` |
| 6   | `failed`       | `command.status="failed"`                     | Reported value, **enabled again**  | ⚠ "Couldn't turn on. The device didn't respond."   | `status/danger/fg`     |
| 7   | `on` / `off`   | otherwise                                     | Reported value, enabled            | none                                               | –                      |

- `command.status="confirmed"` shows nothing extra (state 7). The parent may clear `command` once it's confirmed.
- **Pending keeps the reported value.** The thumb doesn't jump to the new position before the Device confirms it, so the switch never shows something that isn't true. The message line says what's happening.
- In `failed`, the second sentence is `command.failureMessage` when the parent passes one ("The power strip refused the command.").

Interaction states come from `Switch`: hover, focus ring, pressed, disabled.

Target states:

| Target state | Applies? | Why                                                                                           |
| ------------ | -------- | --------------------------------------------------------------------------------------------- |
| loading      | yes      | `loading`.                                                                                    |
| Connected    | yes      | `on`, `off`, and the command states.                                                          |
| Stale        | no       | Shown by `DeviceConnectionStatus`. Commands still work (Device lifecycle rule 14).            |
| Disconnected | yes      | `disconnected`: the value is hidden and the Control can't be used (Device lifecycle rule 14). |
| Fault        | no       | Shown by `DeviceFaultStatus`.                                                                 |

### Anatomy

```
PowerControl                 <div>
├── row
│   ├── name                 "Desk lamp"
│   └── control              Switch  |  status icon (loading / disconnected)
└── message                  role="status": icon + "Turning on…"   (only states 3–6)
```

1. **root**: a `<div>`, one column. Gap `space/1` between the row and the message.
2. **row**: name and control, `space-between`, centred.
3. **name**: label text style, one line, shortened with `…`.
4. **control**: the `Switch`, or one status icon in its place.
5. **message**: a live region (`role="status"`), so Pending and Failed are announced. Caption text style.

### API

The props are defined in [`PowerControl.types.ts`](./PowerControl.types.ts), the source of truth. The table below is the original proposal:

| Prop              | Type                                                                              | Required | Description                                                                                  |
| ----------------- | --------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `name`            | `string`                                                                          | yes      | Shown on the left and used as the switch's name for screen readers ("Desk lamp").            |
| `state`           | `StateOf<"power"> \| null`                                                        | yes      | The **reported** Power State. `null` while the first Reading is on its way.                  |
| `allowedCommands` | `CommandOf<"power">[]`                                                            | yes      | `["turn-on", "turn-off"]`, or one of them. At least one.                                     |
| `onCommand`       | `(command: CommandOf<"power">) => void`                                           | yes      | Called with `"turn-on"` or `"turn-off"` when the user flips the switch. The parent sends it. |
| `command`         | `{ command: CommandOf<"power">; status: CommandStatus; failureMessage?: string }` | no       | The last command and where it is. Leave it out when there is none.                           |
| `isDisconnected`  | `boolean`                                                                         | no       | The Device's Connection Status is Disconnected.                                              |
| `isViewOnly`      | `boolean`                                                                         | no       | The Account can only view this Site (shared). Disables the switch.                           |

`StateOf`, `CommandOf` and `CommandStatus` are shared types that already exist.

**Change to `Switch`:** it needs an optional `ariaDescribedBy` prop, so the switch is linked to the message line ("View only", "Can't be turned on from the app"). Screen readers then hear why it's disabled. `Switch`'s spec also drops the "app settings only, never for Devices" rule (decision 25).

### Example values

From the power strip and washing machine examples in the [domain model review](/docs/domain-model-revew.md#example-devices-and-their-capabilities).

| Story          | Props                                                                                    | Shows                                               |
| -------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `On`           | `name="Desk lamp"`, `state="on"`, both commands                                          | Desk lamp [●━━] On                                  |
| `Off`          | `name="Monitor"`, `state="off"`, both commands                                           | Monitor [━━○] Off                                   |
| `PendingOn`    | `state="off"`, `command={{ command: "turn-on", status: "pending" }}`                     | Off, disabled; ⟳ Turning on…                        |
| `Failed`       | `state="off"`, `command={{ command: "turn-on", status: "failed" }}`                      | Off; ⚠ Couldn't turn on. The device didn't respond. |
| `TurnOffOnly`  | `name="Power"`, `state="off"`, `allowedCommands={["turn-off"]}`                          | Off, disabled; Can't be turned on from the app      |
| `ViewOnly`     | `state="on"`, `isViewOnly`                                                               | On, disabled; View only                             |
| `Loading`      | `state={null}`                                                                           | Desk lamp ⟳                                         |
| `Disconnected` | `state="on"`, `isDisconnected`                                                           | Desk lamp ⛓ (link_off)                              |
| `PowerStrip`   | Four sockets in a column: On, Off, Pending, Failed                                       | How it looks in a `DeviceCard`                      |
| `LongText`     | `name="Socket 4 · Bedside lamp on the left"`, Failed with a long `failureMessage`, 200px | Name shortened with `…`; message wraps              |
| `Minimal`      | `name="Power"`, `state="on"`, both commands                                              | Power [●━━] On                                      |

### Tokens

| Part    | Property | Token                                                     |
| ------- | -------- | --------------------------------------------------------- |
| root    | gap      | `space/1`                                                 |
| row     | gap      | `space/3`                                                 |
| name    | text     | `typography/label/*`, `color-text/primary`                |
| message | text     | `typography/caption/*`                                    |
| message | colour   | `color-text/secondary`; Failed `status/danger/fg`         |
| icons   | size     | `sm` (20px) in the control slot, `xs` in the message line |
| control | –        | from `Switch`                                             |

### Accessibility

- The switch's accessible name is `name`: "Desk lamp, switch, on".
- The message line is `role="status"` (polite live region): "Turning on…" and "Couldn't turn on…" are announced without moving focus.
- When the switch is disabled for a reason (view-only, not allowed), the reason is linked with `aria-describedby`, so it's heard, not only seen.
- Pending disables the switch, so a second tap can't send a second command (Data model rule 35: one Pending command per Control).
- Not colour alone: Failed has the `error` icon and words; disabled has the message.
- Reduced motion: the Pending spinner stands still.

### Open questions

- **Controls category wording.** Widen the conventions' Controls definition to "Inputs that change the view, settings or a Device"? (Doc change only.)

### Decisions (2026-11-08, owner)

- **Copy approved.**
- **Not allowed: disabled with a reason.** One switch can't hide one direction. Controls with several buttons hide commands the Device never allows instead (see `OpenCloseControl`).
