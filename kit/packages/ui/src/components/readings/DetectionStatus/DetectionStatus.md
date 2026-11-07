# DetectionStatus

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/detection-status.mdx). Props are defined in [`DetectionStatus.types.ts`](./DetectionStatus.types.ts).

### Purpose

Shows the latest State of a **Motion, Smoke or CO** Sensor together with **when**: 🔥 **Detected** since 14:02 · 3 min, or 🔥 **Clear** Last: 2 h ago. People don't only ask "is there smoke?" but "since when?" and "when was the last time?".

It is built from [`StateValue`](../StateValue/StateValue.md) (the pill) and [`RelativeTime`](../../context/RelativeTime/RelativeTime.md) (the time). For Power and Contact, use `StateValue` on its own.

Figma: `DetectionStatus` component set in _DeTriz - Smart Home Kit_ (node `588:130`, page `DetectionStatus`). The `value` layer is an exposed `StateValue`: switch its `state` for Alert colours and its icon for the Metric.

### Component in domain model context

Category: **Readings** ("What is it right now?"). It changes when a Reading with a different State arrives, and its time wording changes as time passes.

| Part | Domain term                                         | Example             | Rule                                                                           |
| ---- | --------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| pill | **State** of a Detection Metric (Motion, Smoke, CO) | Detected            | `StateValue`, with its Alert colours.                                          |
| time | start of the current **Detection**                  | since 14:02 · 3 min | Only while Detected. Start time (clock) and how long it has lasted (duration). |
| time | end of the last **Detection**                       | Last: 2 h ago       | Only while Clear. "None yet" when there was never a Detection.                 |

A Detection starts with the first Detected Reading and ends with the next Clear one (Glossary). The parent works out the times from the Readings and passes them in.

### States

Figma variant property `state` (5) × `size` (2) = 10 variants. The Alert colours are on the nested `StateValue` (exposed), not a variant here.

| Figma `state`  | When                                            | Shows                                |
| -------------- | ----------------------------------------------- | ------------------------------------ |
| `detected`     | State is Detected                               | Pill + "since 14:02 · 3 min"         |
| `clear`        | State is Clear and there was a Detection before | Pill + "Last: 2 h ago"               |
| `clear-never`  | State is Clear and there was never a Detection  | Pill + "None yet"                    |
| `loading`      | No Reading yet                                  | StateValue loading, no time          |
| `disconnected` | Connection Status is Disconnected               | StateValue disconnected, time hidden |

In code, worked out from the props: `isDisconnected` → disconnected; `state` null → loading; `detected` → detected; `clear` with `lastDetectedAt` → clear; otherwise clear-never.

Target states:

| Target state | Applies? | Why                                                           |
| ------------ | -------- | ------------------------------------------------------------- |
| loading      | yes      | `loading`.                                                    |
| Connected    | yes      | `detected`, `clear`, `clear-never`.                           |
| Stale        | no       | Shown by `DeviceConnectionStatus`. The times stay true.       |
| Disconnected | yes      | State **and** time hidden: an old "since" would look current. |
| Fault        | no       | Shown by `DeviceFaultStatus`.                                 |

### Sizes

| Size | StateValue | RelativeTime | Gap       | Use            |
| ---- | ---------- | ------------ | --------- | -------------- |
| `md` | `md`       | `xs`         | `space/2` | Rows. Default. |
| `lg` | `lg`       | `sm`         | `space/2` | Cards.         |

The pill and the time sit in one row, centred. In a narrow container the time wraps under the pill (`flex-wrap`), never shortened.

### Anatomy

```
DetectionStatus
├── value   StateValue (exposed)
└── time    "since " + RelativeTime(clock) + " · " + RelativeTime(duration)
            | "Last: " + RelativeTime(relative)
            | "None yet"
```

### API

Props are in [`DetectionStatus.types.ts`](./DetectionStatus.types.ts). Decisions:

- `metric` is a `DetectionMetric` only (`motion`, `smoke`, `co`). Power and Contact have no Detections.
- `detectedSince` (Date) is the start of the current Detection; `lastDetectedAt` (Date) is when the last one ended. The parent works them out.
- `alertLevel` and `isDisconnected` pass straight to `StateValue`.
- `now` (optional) fixes the time for stories, tests and docs.

### Accessibility

- Reads as one phrase: "Detected, since 14:02, 3 min" / "Clear, Last: 2 h ago".
- The times are `<time>` elements with the exact moment.

### Open questions

- Should "Last:" show the start or the end of the last Detection? Today: the end ("Clear since").
