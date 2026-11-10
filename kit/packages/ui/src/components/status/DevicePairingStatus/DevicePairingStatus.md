# DevicePairingStatus

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/device-pairing-status.mdx). Props are defined in [`DevicePairingStatus.types.ts`](./DevicePairingStatus.types.ts).

### Purpose

Shows a Device's Pairing Status as a short label with a coloured dot: "Paired ●". It answers "Does this Device belong to the Account?" in setup flows and in lists of detected Devices, next to the Device's name.

It is read-only and shows one field only. Connection Status and Fault are separate fields with their own components.

Figma: `DevicePairingStatus` component set in _DeTriz - Smart Home Kit_ (node ID not recorded yet, see Open questions).

Storybook: `Status/DevicePairingStatus`.

### Component in domain model context

Category: **Status** ("Is everything OK?"). The Pairing Status changes rarely: usually once when the Device is added, and once when it is removed.

It shows one of the three Device Status fields from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx#pairing-status) and the [Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx#pairing-status):

| Value      | Domain term  | Meaning (from the Glossary)                                                           |
| ---------- | ------------ | ------------------------------------------------------------------------------------- |
| `unpaired` | **Unpaired** | The Device has been detected, but the user hasn't confirmed adding it to the Account. |
| `pairing`  | **Pairing**  | First-time setup is running: the Device is joining the Account.                       |
| `paired`   | **Paired**   | The Device belongs to the Account. Only now does it have a Connection Status.         |

Both Device Kinds have a Pairing Status: a Hub and a Module.

What it does **not** show, and why:

- **Connection Status.** A separate field, and only Paired Devices have one. Shown by `DeviceConnectionStatus`.
- **Fault.** A separate field. Shown by `DeviceFaultStatus`.
- **Pairing Failed.** In the lifecycle, a failed pairing goes back to Unpaired, so there is no "failed" status. Telling the user _why_ it failed is a message, so it belongs in **Feedback**, not here.
- **Removed or Dismissed Devices.** They leave the lifecycle, so there is nothing to show.

### Visual idea

| Question                        | Answer                                                    |
| ------------------------------- | --------------------------------------------------------- |
| What does it roughly look like? | A short label followed by a small filled circle: Paired ● |
| Icons?                          | No. The dot is a shape, not an icon.                      |
| Separators?                     | No. The gap between the label and the dot is enough.      |
| More than one layout or size?   | One layout, one size.                                     |
| Text size                       | Caption (12px), the same as `DeviceConnectionStatus`.     |

It looks exactly like `DeviceConnectionStatus` (same anatomy, tokens and size), so the two read as one family. Only the labels and colours differ.

### States

Three states, one per Pairing Status (Figma variant property `status`, prop `status`). Default story: `unpaired`.

| State      | Label    | Dot colour token              | Dot colour |
| ---------- | -------- | ----------------------------- | ---------- |
| `unpaired` | Unpaired | `--shk-status-neutral-solid`  | gray 400   |
| `pairing`  | Pairing  | `--shk-status-progress-solid` | blue 400   |
| `paired`   | Paired   | `--shk-status-success-solid`  | green 400  |

The colours follow the same meaning as in `DeviceConnectionStatus`: grey for "not active", blue for "in progress", green for "done".

Target states:

| Target state | Applies? | Why                                                                                                                   |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| loading      | no       | A Device that has been detected always has a Pairing Status (it starts as Unpaired), so there is nothing to wait for. |
| Connected    | no       | Connection Status is a separate field. Shown by `DeviceConnectionStatus`.                                             |
| Stale        | no       | Same as above.                                                                                                        |
| Disconnected | no       | Same as above.                                                                                                        |
| Fault        | no       | Fault is a separate field. Shown by `DeviceFaultStatus`.                                                              |

None of the target states apply because they all describe Connection Status or Fault. This component's states are the three Pairing Statuses.

### Anatomy

```
root            <span role="status">     (data-status = unpaired | pairing | paired)
├── label       "Paired"
└── indicator   ●                         filled circle, colour from the status
```

1. **root**: the label and the dot in one row, centred vertically. Small horizontal padding and no background, so it sits on any surface (a card header, a list row).
2. **label**: the status as a word. Never wraps or truncates: the labels are short and fixed.
3. **indicator**: a 12px filled circle. Never shrinks. Decorative: it has no text of its own.

### API

The props are defined in [`DevicePairingStatus.types.ts`](./DevicePairingStatus.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- One required prop, `status`, with the Glossary's three values in lowercase. They match the Figma variant values.
- The type is called `PairingStatus`, the domain term, so apps can use it for their own data.
- There is no `label` prop. The labels are fixed, so every screen says the same word for the same status.

### Example values

| Use                                        | status     | Shows                                                                             |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------------- |
| Default story: "New device found"          | `unpaired` | Unpaired ●                                                                        |
| The user tapped "Add", setup is running    | `pairing`  | Pairing ●                                                                         |
| The Climate Module is in the Kitchen Space | `paired`   | Paired ●                                                                          |
| `LongText` story                           | `unpaired` | The longest label, in a 96px container: stays on one line, the dot keeps its size |
| `Minimal` story                            | `paired`   | The shortest label                                                                |

Stories: `Unpaired`, `Pairing`, `Paired`, `LongText`, `Minimal`.

### Tokens

All tokens exist in `tokens.css`, and they are the same as `DeviceConnectionStatus`'s. The Figma variable names still need to be checked against the component in Figma (see Open questions).

| Part      | State      | Property   | Code token                                             |
| --------- | ---------- | ---------- | ------------------------------------------------------ |
| root      | all        | padding    | `--shk-space-0` (block), `--shk-space-1` (inline, 4px) |
| root      | all        | gap        | `--shk-space-1` (4px)                                  |
| label     | all        | colour     | `--shk-color-text-primary`                             |
| label     | all        | text style | `--shk-typography-caption-*` (12 / 18 / 400)           |
| indicator | all        | size       | `--shk-size-3` (12px)                                  |
| indicator | all        | shape      | `--shk-radius-full`                                    |
| indicator | `unpaired` | colour     | `--shk-status-neutral-solid`                           |
| indicator | `pairing`  | colour     | `--shk-status-progress-solid`                          |
| indicator | `paired`   | colour     | `--shk-status-success-solid`                           |

### Accessibility

- The status is told by the **label**, not by colour alone. The dot only repeats it.
- The dot has no text and no role, so screen readers skip it.
- `role="status"` makes the component a polite live region: when pairing finishes (Pairing → Paired), screen readers announce "Paired" without moving focus. This matters in a setup flow, where the user waits for it.
- The label is just the word ("Paired"). Which Device it belongs to comes from the parent: put it next to the Device's name.
- Contrast: the label is gray 900 on white, well above 4.5:1. The dot is decoration next to a text label, so it doesn't need 3:1.
- No motion.

### Open questions

- **Figma node ID and variables.** Not recorded in the old spec. Check the component in Figma, add its node ID, and add a Figma variable column to the Tokens table.
- **Where to show it once Paired.** After pairing, most screens care about Connection Status, not Pairing Status. Should Paired Devices show this component at all outside the setup flow? The user docs page currently recommends showing Connection Status instead.
- **Same green for Paired and Connected.** Both use `--shk-status-success-solid`. Fine while the two are never shown side by side; check if a screen ever needs both.
