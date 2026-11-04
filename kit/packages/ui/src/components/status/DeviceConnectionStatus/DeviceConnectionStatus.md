# DeviceConnectionStatus

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/device-connection-status.mdx). Props are defined in [`DeviceConnectionStatus.types.ts`](./DeviceConnectionStatus.types.ts).

### Purpose

Shows a Device's Connection Status as a short label with a coloured dot: "Connected ●". It answers "Can we reach this Device right now?" in card headers, list rows and detail views, next to the Device's name or Readings.

It is read-only and shows one field only. Pairing Status and Fault are separate fields with their own components.

Figma: `DeviceConnectionStatus` component set in _DeTriz - Smart Home Kit_ (node ID not recorded yet, see Open questions).

Storybook: `Status/DeviceConnectionStatus`.

### Component in domain model context

Category: **Status** ("Is everything OK?"). The Connection Status changes on its own, whenever the Device's link changes.

It shows one of the three Device Status fields from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx#connection-status) and the [Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx#connection-status):

| Value          | Domain term      | Meaning (from the Glossary)                                     |
| -------------- | ---------------- | --------------------------------------------------------------- |
| `connecting`   | **Connecting**   | A Paired Device is (re)establishing its connection.             |
| `connected`    | **Connected**    | The Device is reachable and sending Readings.                   |
| `stale`        | **Stale**        | Connected, but no Reading arrived within its Expected Interval. |
| `disconnected` | **Disconnected** | The Device can't be reached.                                    |

Only **Paired** Devices have a Connection Status, so the parent doesn't render this component for an Unpaired Device.

What it does **not** show, and why:

- **Pairing Status.** A separate field. Shown by `DevicePairingStatus`.
- **Fault.** A separate field: a Device can be Connected and have a Fault at the same time. Shown by `DeviceFaultStatus`.
- **When it was last seen** ("Last update 5 min ago"). A fact about the latest Reading, so it is Context. Not a component yet.
- **The Expected Interval.** A setting, not a status.
- **The Readings.** `ReadingValue` hides the value itself when the Device is Disconnected; this component only names the status.

### Visual idea

| Question                        | Answer                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A short label followed by a small filled circle: Connected ●                                  |
| Icons?                          | No. The dot is a shape, not an icon.                                                          |
| Separators?                     | No. The gap between the label and the dot is enough.                                          |
| More than one layout or size?   | One layout, one size.                                                                         |
| Text size                       | Caption (12px), the same as `LocationPath` and `SensorLabel xs`, so it fits in a card header. |

The label comes first and the dot second, as in Figma. The dot's colour changes with the status; the label says the same thing in words, so the colour is never the only signal.

### States

Four states, one per Connection Status (Figma variant property `status`, prop `status`). Default story: `disconnected`.

| State          | Label        | Dot colour token              | Dot colour |
| -------------- | ------------ | ----------------------------- | ---------- |
| `connecting`   | Connecting   | `--shk-status-progress-solid` | blue 400   |
| `connected`    | Connected    | `--shk-status-success-solid`  | green 400  |
| `stale`        | Stale        | `--shk-status-warning-solid`  | amber 400  |
| `disconnected` | Disconnected | `--shk-status-neutral-solid`  | gray 400   |

Disconnected is **neutral grey, not red**. Red (`danger`) is kept for Faults, so "unplugged" and "broken" never look the same.

Target states:

| Target state | Applies? | Why                                                                                                                                                                 |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| loading      | no       | Before the first status is known, the Device is Connecting (the Glossary: "happens after every power-up, restart or dropped link"). The parent passes `connecting`. |
| Connected    | yes      | The `connected` state.                                                                                                                                              |
| Stale        | yes      | The `stale` state.                                                                                                                                                  |
| Disconnected | yes      | The `disconnected` state.                                                                                                                                           |
| Fault        | no       | Fault is a separate field. Shown by `DeviceFaultStatus`, often next to this component.                                                                              |

### Anatomy

```
root            <span role="status">     (data-status = connecting | connected | stale | disconnected)
├── label       "Connected"
└── indicator   ●                         filled circle, colour from the status
```

1. **root**: the label and the dot in one row, centred vertically. Small horizontal padding and the default surface as background, as in Figma.
2. **label**: the status as a word. Never wraps or truncates: the labels are short and fixed.
3. **indicator**: a 12px filled circle. Never shrinks. Decorative: it has no text of its own.

### API

The props are defined in [`DeviceConnectionStatus.types.ts`](./DeviceConnectionStatus.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- One required prop, `status`, with the Glossary's four values in lowercase. They match the Figma variant values.
- The type is called `ConnectionStatus`, not `DeviceConnectionStatusStatus`, because other components use it too (`ModuleCard`, `SpaceCard`) and it is the domain term.
- There is no `label` prop. The labels are fixed, so every screen says the same word for the same status.
- There is no "unknown" or `null` status. See the `loading` row in Target states.

### Example values

| Use                       | status         | Shows                                                                             |
| ------------------------- | -------------- | --------------------------------------------------------------------------------- |
| Default story             | `disconnected` | Disconnected ●                                                                    |
| Hub after a power cut     | `connecting`   | Connecting ●                                                                      |
| Kitchen Hub streaming     | `connected`    | Connected ●                                                                       |
| Light Module running late | `stale`        | Stale ●                                                                           |
| `LongText` story          | `disconnected` | The longest label, in a 96px container: stays on one line, the dot keeps its size |
| `Minimal` story           | `stale`        | The shortest label                                                                |

Stories: `Disconnected`, `Connecting`, `Connected`, `Stale`, `LongText`, `Minimal`.

### Tokens

All tokens exist in `tokens.css`. The Figma variable names still need to be checked against the component in Figma (see Open questions).

| Part      | State          | Property   | Code token                                             |
| --------- | -------------- | ---------- | ------------------------------------------------------ |
| root      | all            | background | `--shk-surface-default`                                |
| root      | all            | padding    | `--shk-space-0` (block), `--shk-space-1` (inline, 4px) |
| root      | all            | gap        | `--shk-space-1` (4px)                                  |
| label     | all            | colour     | `--shk-color-text-primary`                             |
| label     | all            | text style | `--shk-typography-caption-*` (12 / 18 / 400)           |
| indicator | all            | size       | `--shk-size-3` (12px)                                  |
| indicator | all            | shape      | `--shk-radius-full`                                    |
| indicator | `connecting`   | colour     | `--shk-status-progress-solid`                          |
| indicator | `connected`    | colour     | `--shk-status-success-solid`                           |
| indicator | `stale`        | colour     | `--shk-status-warning-solid`                           |
| indicator | `disconnected` | colour     | `--shk-status-neutral-solid`                           |

### Accessibility

- The status is told by the **label**, not by colour alone. The dot only repeats it.
- The dot has no text and no role, so screen readers skip it.
- `role="status"` makes the component a polite live region: when the status changes (Connected → Stale), screen readers announce the new label without moving focus. This is on purpose: a change in Connection Status matters to the user, and it happens far less often than new Readings. `ModuleCard` and `SpaceCard` rely on it and add no live region of their own.
- The label is just the word ("Stale"). Which Device it belongs to comes from the parent: put it next to the Device's name, inside the same card or row.
- Contrast: the label is gray 900 on white, well above 4.5:1. The dot is decoration next to a text label, so it doesn't need 3:1.
- No motion.

### Open questions

- **Figma node ID and variables.** Not recorded in the old spec. Check the component in Figma, add its node ID, and add a Figma variable column to the Tokens table.
- **Many announcements at once.** Every instance is a live region. On a Site screen with many Devices, several can go Stale together and each one is announced. Accepted for now (same note in `SpaceCard`). If it becomes a problem, the parent could announce one summary instead.
- **Connecting animation.** Should the `connecting` dot pulse, to show something is happening? It would need a reduced-motion rule, like `ReadingValue`'s loading icon.
