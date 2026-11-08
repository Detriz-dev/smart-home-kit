# SensorState

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/readings/sensor-state.mdx). Props are defined in [`SensorState.types.ts`](./SensorState.types.ts).

### Purpose

Shows the latest State of one Two-state Sensor as a small card: what it is about on top ("Power" or "Front door"), the State below (🔌 **On**). It is the twin of [`SensorReading`](../SensorReading/SensorReading.md): same card, same sizes, but a [`StateValue`](../StateValue/StateValue.md) instead of a number and Unit. `ModuleCard` uses one per Two-state Sensor.

Figma: `SensorState` component set in _DeTriz - Smart Home Kit_ (node `595:1773`), page `SensorState` (after SensorReading). Built from a copy of SensorReading, so the card is identical. `SensorLabel` and `StateValue` are exposed: pick the Metric on the first, and the State, icon and Alert colours on the second.

### Component in domain model context

Category: **Readings**.

| Part  | Domain term                                            | Example            | Shown by                     |
| ----- | ------------------------------------------------------ | ------------------ | ---------------------------- |
| label | **Metric**, or the **Asset** the Sensor watches        | Power / Front door | `SensorLabel` / `AssetLabel` |
| state | **State** of the latest Reading (+ Alert Level colour) | On                 | `StateValue`                 |

**Asset or Metric?** Contact and Power Readings are about an Asset (Data model rule 19). If the parent passes `asset`, the card is named after it ("Front door"), which says more than "Contact". Without it, the Metric names the card, as in SensorReading.

### States

Figma variant property `state` × `size`, the same as SensorReading: 3 × 2 = 6 variants.

| Figma `state`  | Code             | Shows                                               |
| -------------- | ---------------- | --------------------------------------------------- |
| `default`      | a State          | StateValue pill (active, inactive or alert colours) |
| `loading`      | `state={null}`   | StateValue loading icon                             |
| `disconnected` | `isDisconnected` | StateValue disconnected icon, State hidden          |

Target states: loading, Connected and Disconnected apply (through StateValue). Stale and Fault don't: they belong to the Module and are shown once by `ModuleCard`.

### Sizes and anatomy

`lg` (default, StateValue `lg`) and `md` (StateValue `md`). Card: padding `space/2`, gap `space/1`, radius `radius/12`, outline `color-border/subtle` `border-width/thin` inside, fill `surface/default` (same as SensorReading). The pill keeps its own width.

```
SensorState
├── SensorLabel | AssetLabel   (xs)
└── StateValue                 (lg | md)
```

The card is shorter than a SensorReading (72 vs 93px at `lg`), because a pill is lower than a readout number. In `ModuleCard`'s grid, rows line up at the top.

### Accessibility

A `role="group"` named by its label: screen readers say "Power, group, On". Everything else comes from StateValue.

### Open questions

- Should Detection Metrics in a card show the time too (`DetectionStatus` inside)? Today SensorState shows the State only; a parent wanting "since 14:02" uses `DetectionStatus`.
