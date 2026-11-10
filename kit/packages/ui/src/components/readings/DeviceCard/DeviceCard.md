# DeviceCard

> Spec for the team. Status: **reviewed** (2026-11-08). In Figma and built in code. Replaces `ModuleCard` (decision 24): ModuleCard was renamed and extended, not kept next to it. The sections under "Carried over from ModuleCard" are its earlier spec, still valid for the Sensors part. Part of [ADR 0002](/docs/adr/0002-devices-and-capabilities.md), Step 5 of the [implementation plan](/docs/product-requirements/domain-model-change-implementation.md).

Figma: the `DeviceCard` component set (node `349:591`, page `DeviceCard`; it was `ModuleCard`). New properties: `hasSensors`, `hasControls`, and `control1`–`control3` (instance swap, preferred values: the five Controls and `OperationalStateValue`), with `hasSecondControl` / `hasThirdControl`. Examples: frame `DeviceCard / devices` (node `663:1823`): heating, power strip, kettle, blinds.

### Purpose

One Device as a card: its name and Connection Status on top, any Faults, then everything it reports and everything the user can change. It works for every Device Kind: a Climate Module with two Sensors, a power strip with four sockets, a kettle, heating with a Setpoint and a Mode, motorized blinds.

Everything ModuleCard does today stays the same (layouts, states, Sensors). DeviceCard adds **Controls** and lets a card have **no Sensors**.

### Component in domain model context

Category: **Readings** ("What is it right now?"), as ModuleCard was. It now also holds Controls, but each Control is its own component; the card only arranges them.

| Part     | Domain term                                 | Example                  | Rule                                                                                     |
| -------- | ------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| name     | **Device Name**                             | Kitchen kettle           | The user can rename it, so the parent passes it in.                                      |
| status   | **Connection Status**                       | Connected                | `DeviceConnectionStatus`, as in ModuleCard.                                              |
| faults   | **Fault**                                   | Sensor failure           | One `DeviceFaultStatus` per Fault, as in ModuleCard.                                     |
| sensors  | **Sensors** (Capabilities that only report) | Temperature 19.8 °C      | `SensorReading` or `SensorState`, the same data as ModuleCard's `sensors`. Now optional. |
| controls | **Controls** and **Operational State**      | Setpoint, Mode, Socket 1 | The Control components, placed by the parent (see API).                                  |

What it does **not** do:

- **Know how to draw each Control.** The parent passes the Control components (`PowerControl`, `OpenCloseControl`, `StateSelectControl`, `ValueControl`, `OperationalStateControl`, or `OperationalStateValue` for a read-only one). Each keeps its own commands and callbacks.
- **Send commands, fetch data.** Props only.
- **Show the Device Type icon.** Not yet: Device Type icons don't exist (Step 6). See Open questions.

### Visual idea

The same white card as ModuleCard. A new **controls** area sits under the Sensors, one Control per row, full width.

```
Heating (thermostat)                    Power strip (no Sensors)
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│ Living room heating  Connected ●│     │ Power strip         Connected ● │
│ ┌──────────────┐                │     │ Desk lamp              [●━━] On │
│ │ 🌡 Temperature│                │     │ Monitor                [━━○] Off│
│ │ 19.8 °C      │                │     │ Socket 3               [━━○] Off│
│ └──────────────┘                │     │ ⟳ Turning on…                   │
│ Setpoint        [−] 22.0 °C [+] │     │ Socket 4               [━━○] Off│
│ Mode               [Off | Heat] │     └─────────────────────────────────┘
└─────────────────────────────────┘
```

| Question              | Answer                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Order inside the card | Header, Faults, Sensors, Controls. The parent orders the Controls (Operational State first is the convention). |
| Separators?           | No. Gap `space/4` between Sensors and Controls, `space/3` between Controls.                                    |
| Layouts               | Sensors: ModuleCard's `row` / `stacked` rules, unchanged. Controls: always one per row, full width.            |
| Name                  | `Card` title: `body`, one line, `…` when long. Built on `Card` (ADR 0003): header strip, white body, shadow.   |

### States

The same four states as ModuleCard, worked out from `connectionStatus` (no `state` prop in code):

| State          | Status label | Sensors                   | Controls                                                                 |
| -------------- | ------------ | ------------------------- | ------------------------------------------------------------------------ |
| `loading`      | Connecting   | Spinning icon, per Sensor | Each Control shows its own loading (the parent passes `null` values).    |
| `connected`    | Connected    | The values                | Usable.                                                                  |
| `stale`        | Stale        | Last values, unchanged    | Usable: commands still go to a Stale Device (Device lifecycle rule 14).  |
| `disconnected` | Disconnected | Hidden, disconnected icon | Hidden and unusable: the parent passes `isDisconnected` to each Control. |

Faults add `DeviceFaultStatus` rows on top of any state, as today.

**Disconnected is passed twice.** The card passes `isDisconnected` to its Sensors itself (it renders them). Controls are rendered by the parent, so the parent passes `isDisconnected` to each Control too. This is the cost of the slot (see API).

Target states: loading, Connected, Stale, Disconnected yes; Fault yes (rows), as in ModuleCard.

### Anatomy

```
DeviceCard                <div role="group" aria-labelledby=name>
├── header
│   ├── name              "Living room heating"
│   └── status            DeviceConnectionStatus
├── faults                DeviceFaultStatus × n
├── sensors               <ul role="list">  SensorReading / SensorState × n   (only when there are Sensors)
└── controls              <div>  the Controls passed in, one per row          (only when there are Controls)
```

### API

Changes from ModuleCard:

| Prop               | Type                       | Required | Change                                                                                       |
| ------------------ | -------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `name`             | `string`                   | yes      | Same. Now the **Device Name**.                                                               |
| `connectionStatus` | `ConnectionStatus`         | yes      | Same.                                                                                        |
| `faults`           | `DeviceFaultStatusProps[]` | no       | Same.                                                                                        |
| `sensors`          | `DeviceCardSensor[]`       | no       | **Now optional** (was required, one to three). Same item shape (`ModuleCardSensor` renamed). |
| `controls`         | `ReactNode`                | no       | **New.** The Control components, in the order to show them.                                  |

A card needs at least Sensors or Controls.

**Why a slot for Controls, not data like `sensors`?** Each Control has its own props and callbacks (`onCommand`, `onSelect`, `onCommit`, its `command` status). As data, `controls` would need a large union type that repeats every Control's props, and every new Control would change DeviceCard. As a slot, the card stays small and a new Control works without touching it. Sensors stay data, because they have no callbacks and the card already knows how to lay them out.

**Rename.** `ModuleCard` → `DeviceCard`, `ModuleCardProps` → `DeviceCardProps`, `ModuleCardSensor` → `DeviceCardSensor` (and its two parts). No aliases: the packages aren't published yet. The docs page, Storybook title, Figma component and the ~25 docs that mention ModuleCard are updated in the same change.

```tsx
<DeviceCard
  name="Living room heating"
  connectionStatus="connected"
  sensors={[{ metric: "temperature", value: 19.8, unit: "celsius" }]}
  controls={
    <>
      <ValueControl
        name="Setpoint"
        value={22}
        unit="celsius"
        min={0}
        max={30}
        step={0.5}
        fractionDigits={1}
        onCommit={send}
      />
      <StateSelectControl
        name="Mode"
        metric="mode"
        state="heat"
        onSelect={setMode}
      />
    </>
  }
/>
```

### Example values

| Story                | Device                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `ClimateModule`      | Climate Module: Temperature 22.4 °C, Humidity 48 %RH (today's ModuleCard default; unchanged)                     |
| `PowerStrip`         | Power strip: four `PowerControl` (Desk lamp On, Monitor Off, Socket 3 Pending, Socket 4 Failed), no Sensors      |
| `Kettle`             | Kitchen kettle: `OperationalStateControl` Running · Heating, [Stop]                                              |
| `Heating`            | Living room heating: Temperature Sensor 19.8 °C; `ValueControl` Setpoint 22.0 °C; `StateSelectControl` Mode Heat |
| `Blinds`             | Living room blinds: `OpenCloseControl` Opening; `ValueControl` Position 40 % (slider)                            |
| `Disconnected`       | Heating, Disconnected: Sensors and Controls hidden                                                               |
| `WithFault`          | Kettle with `sensor_failure` and Operational State Error "Can't start: sensor failure"                           |
| ModuleCard's stories | Kept, renamed: loading, connected, stale, disconnected, State Sensors, LongText, Minimal                         |

### Tokens

As ModuleCard; new: `space/4` gap before the controls area, `space/3` between Controls.

### Accessibility

- As ModuleCard: the card is a `group` named by the Device Name.
- Each Control brings its own name, group and live region.

### Decisions (2026-11-08, owner)

- **Controls are a slot** (`controls: ReactNode`), not data. The parent passes `isDisconnected` to each Control.
- **No Device Type icon yet.** Add an optional `deviceType` prop once Device Type icons exist (Step 6).
- **Folder stays `readings/`.**

### Carried over from ModuleCard

The earlier ModuleCard spec, for the Sensors part of the card. "Module" there now means any Device with Sensors.

#### Layouts

The card fills the width its parent gives it and arranges itself. There is no `layout` prop, and it looks at **its own width, not the screen's** (a CSS container query). This way it also works in a narrow column on a big screen.

A Sensor is never narrower than **160px**, the width `SensorReading` is designed for. Above that, the Sensors share the row equally, so they grow with the card. The switching widths follow from that: Sensors × 160px, plus 12px gaps, plus 16px padding on each side.

| Card width   | Header                                | One Sensor | Two Sensors | Three Sensors |
| ------------ | ------------------------------------- | ---------- | ----------- | ------------- |
| Under 364px  | Name, status below it                 | Full width | Stacked     | Stacked       |
| 364 to 535px | Name on the left, status on the right | Full width | One row     | Stacked       |
| 536px and up | Name on the left, status on the right | Full width | One row     | One row       |

Three Sensors are never split into two rows: they all sit in one row, or all stack.

`row` means Sensors side by side and `stacked` means one under the other.

These two names are for Figma frames and this spec only. In code they are CSS, not a prop.

A container query measures the space inside the card, without its padding and border. So the CSS uses 332px and 504px for the 364px and 536px card widths in the table above.

The card needs a parent that gives it a width, such as a block or a grid cell. It gets its width from its parent, not from its content.

The Module Name can be long, because the user can rename it. It stays on one line and ends with "…", and the full name shows on hover. The status label never shrinks. The value and the Unit never truncate (rule from `SensorReading`).

#### Tokens

The parts bring their own tokens. ModuleCard only adds the card and the spacing between the parts.

| Part    | Property      | Figma variable        | Code token                      |
| ------- | ------------- | --------------------- | ------------------------------- |
| root    | background    | `surface/default`     | `--shk-surface-default`         |
| root    | border colour | `color-border/subtle` | `--shk-color-border-subtle`     |
| root    | border width  | `border-width/thin`   | `--shk-border-width-thin` (1px) |
| root    | corner radius | `radius/16`           | `--shk-radius-16` (16px)        |
| root    | padding       | `space/4`             | `--shk-space-4` (16px)          |
| root    | gap           | `space/3`             | `--shk-space-3` (12px)          |
| sensors | gap           | `space/3`             | `--shk-space-3` (12px)          |
| name    | text          | `typography/body/*`   | `--shk-typography-body-*`       |
| name    | colour        | `color-text/primary`  | `--shk-color-text-primary`      |

The Figma `row` variants are 364px wide (two 160px Sensors) and `stacked` 192px (one 160px Sensor). The card fills its parent, so these are the smallest widths.

The container query widths (332px, 504px) are raw values, an exception to the tokens-only rule: CSS doesn't allow variables in a container query.

#### Accessibility

- `root` is a `<div role="group">` named by the Module's name (`aria-labelledby` → `name`), the same pattern as `SensorReading`.
- Reading order follows the anatomy: name, status, Faults, Sensors. It stays the same in both layouts.
- `sensors` is a real list with `role="list"`, because Safari stops treating a list as a list once its bullets are removed. A screen reader says how many Sensors there are.
- Each `SensorReading` keeps its own spoken name ("Temperature, 22.4 degrees Celsius").
- Not colour alone: `DeviceConnectionStatus` has a text label, and `disconnected` has its own icon.
- No new live region. `DeviceConnectionStatus` already has `role="status"`, so status changes are announced. Readings are not, same rule as `SensorReading`.
- The rest (contrast, reduced motion) comes from the parts.

#### State Sensors (Phase 2, 2026-11-07)

- A Sensor is a number Sensor (`value` + `unit`, shown by `SensorReading`) or a State Sensor (`state`, optional `asset` and `alertLevel`, shown by `SensorState`). Told apart by the `state` field. Existing number Sensors are unchanged.
- The Module's Connection Status applies to both: Disconnected hides the States too.
- Figma: the `ModuleCard with States` example (node `596:741`) swaps the SensorReading instances to `SensorState` (Smoke Clear, CO Detected Critical). The component itself is unchanged.
- Done (2026-11-07): the Switch row and the `state=off` variants were removed from the Figma ModuleCard. It now has `layout` × `state` (connected, loading, stale, disconnected) = 8 variants.
