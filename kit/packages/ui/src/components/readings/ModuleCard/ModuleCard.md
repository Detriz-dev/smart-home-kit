# ModuleCard

### Purpose

Shows one Module as a card: its name, its Connection Status, the latest Reading of each of its Sensors, and a Switch to turn the Module off or on. A Module has one to three Sensors, so the card shows one to three `SensorReading`s.

It is used wherever a user looks at their Modules, for example a Space overview in Live Studio.

It only puts existing components together: [`SensorReading`](../SensorReading/SensorReading.md), [`DeviceConnectionStatus`](../../status/DeviceConnectionStatus/DeviceConnectionStatus.md), [`DeviceFaultStatus`](../../status/DeviceFaultStatus/DeviceFaultStatus.md) and [`Switch`](../../controls/Switch/Switch.tsx). It adds the card around them, passes the Module's state down to them and rearranges them to fit the space it gets.

It takes props only. It doesn't turn the Module off itself: it tells its parent the user flipped the Switch, and the parent sends the command.

Figma: `ModuleCard` component set in _DeTriz - Smart Home Kit_ (node `349:591`), page `ModuleCard`. Variant properties `layout` and `state`, boolean properties `hasFault`, `hasSecondSensor` and `hasThirdSensor`. The `ModuleCard examples` frame shows a Fault, one Sensor and three Sensors.

### Component in domain model context

Category: **Readings** ("What is it right now?"). A composite keeps the category of its main job, and most of this card is the current values. The Switch doesn't move it to Controls: only the Switch is interactive, and `Switch` already lives there.

It shows these terms from the [Ubiquitous Language](/docs/architecture/domain-model/ubiquitous-language.md):

| Part    | Domain term             | Example            | Shown by                 |
| ------- | ----------------------- | ------------------ | ------------------------ |
| name    | **Module Name**         | Climate Module     | `ModuleCard`             |
| status  | **Connection Status**   | Connected          | `DeviceConnectionStatus` |
| fault   | **Fault**               | CO₂ sensor failure | `DeviceFaultStatus`      |
| sensors | **Sensor**, **Reading** | 22.4 °C            | `SensorReading`          |
| switch  | **On / Off**            | Off                | `Switch`                 |

A Module has **one or more** Sensors, and **one Sensor per Metric** ([Domain Analysis](/docs/architecture/domain-model/domain-analysis.md)). The Sensors are fixed by the Module Type, so the user never adds or removes one.

What it does **not** show, and why:

- **Several Modules side by side.** A Hub has 4 Slots, so a screen can show up to 4 Modules. Placing those cards is the job of a separate Layout component, because a card shouldn't know about its neighbours.
- **Pairing Status.** Only Paired Modules have a Connection Status, so only Paired Modules get a ModuleCard. An Unpaired Module ("New module found") belongs to another component.
- **Hub, Slot, Space, Site.** Where the Module sits is `LocationPath`.
- **Time of the Reading** ("Last update 5 min ago"). Context, not part of this card yet.

### Visual idea

| Question                        | Answer                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A white card: the name and status on top, the Sensors below, the Switch at the bottom.                |
| Icons?                          | Only those of its parts.                                                                              |
| Separators?                     | No. The cards inside (`SensorReading`) separate the Sensors.                                          |
| More than one layout?           | Yes, two, chosen automatically by the card's own width: `row` and `stacked`. See [Layouts](#layouts). |
| Text size                       | Name: `h4`. Everything else comes from its parts.                                                     |

```
row (wide)                                      stacked (narrow)
┌───────────────────────────────────────────┐   ┌───────────────┐
│ Climate Module               Connected ●  │   │ Climate Module│
│ ┌───────────────┐ ┌───────────────┐       │   │ Connected ●   │
│ │ 🌡 Temperature │ │ 💧 Humidity    │       │   │ ┌───────────┐ │
│ │ 22.4 °C       │ │ 48 %RH        │       │   │ │ Temperature│ │
│ └───────────────┘ └───────────────┘       │   │ │ 22.4 °C   │ │
│ (●  ) On                                  │   │ └───────────┘ │
└───────────────────────────────────────────┘   │ ┌───────────┐ │
                                                │ │ Humidity  │ │
                                                │ │ 48 %RH    │ │
                                                │ └───────────┘ │
                                                │ (●  ) On      │
                                                └───────────────┘
```

### Layouts

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

### States

Figma variant property `state`. In code there is no `state` prop: the card works it out from `connectionStatus`, `isOn` and the Sensors' values.

| State          | Figma value          | When                                                     | Status label | Sensors                    | Switch                 |
| -------------- | -------------------- | -------------------------------------------------------- | ------------ | -------------------------- | ---------------------- |
| `loading`      | `state=loading`      | The first Readings are on their way (`value` is `null`). | Connecting   | Spinning icon, per Sensor  | On                     |
| `connected`    | `state=connected`    | Reachable and sending Readings.                          | Connected    | The values                 | On                     |
| `stale`        | `state=stale`        | Connected, but no Reading within the expected interval.  | Stale        | The last values, unchanged | On                     |
| `disconnected` | `state=disconnected` | The Module is On, but can't be reached.                  | Disconnected | Hidden, disconnected icon  | On, greyed out         |
| `off`          | `state=off`          | The Module is in its Slot, and the user turned it off.   | Disconnected | Hidden, disconnected icon  | Off, can be flipped on |

`disconnected` and `off` look the same except for the Switch, and that is on purpose. Off is not a new status: an Off Module is Disconnected, and the Switch shows why. Switch Off means the user chose it. Switch On and greyed out means something went wrong.

The card works out what to show in this order, first match wins:

1. `isOn` is false → `off`. The label says Disconnected, whatever `connectionStatus` says, and the Switch stays usable so the user can turn the Module back on.
2. `connectionStatus` is `disconnected` → `disconnected`. The Switch can't reach the Module, so it is greyed out.
3. Otherwise → follows `connectionStatus`. Each `SensorReading` picks up its own `loading` from a `null` value.

In `off` and `disconnected`, the card passes `isDisconnected` to every `SensorReading`.

**Connecting** has no state of its own, same rule as `SensorReading`: the status label says "Connecting", and the parent passes the last values to keep showing them, or `null` to show `loading`.

When the user turns the Module back on, the parent passes `isOn` true and `connectionStatus` `connecting`. It then follows the normal path to Connected.

If the Module is Off and its Hub is Disconnected, the card can't tell: the Switch stays usable and the command fails. The parent handles that failure.

Target states:

| Target state | Applies? | Why                                                                                                                               |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| loading      | yes      | The `loading` state.                                                                                                              |
| Connected    | yes      | The `connected` state.                                                                                                            |
| Stale        | yes      | The `stale` state. `SensorReading` has no Stale state: only the status label changes, as `SensorReading.md` expects.              |
| Disconnected | yes      | The `disconnected` and `off` states. Values are **hidden**, as the glossary says.                                                 |
| Fault        | yes      | Not a state of its own: `fault` adds `DeviceFaultStatus` on top of any state, because a Module can be Connected and have a Fault. |

### Anatomy

```
root               <div role="group">    card: background, padding, stacks the parts
├── header         <div>                 name and status
│   ├── name       <span id>             gives the group its name
│   └── DeviceConnectionStatus
├── DeviceFaultStatus                    only when there is a Fault, under the header
├── sensors        <ul>                  one row, or a stack
│   └── sensor     <li>                  one per Sensor
│       └── SensorReading  size="md"
└── Switch
```

1. **root**: the card, and the element whose width decides the layout.
2. **header**: holds the name and the status. A real element in code, because it needs its own arrangement in each layout.
3. **name**: has an `id`, so `root` can point to it with `aria-labelledby`.
4. **sensors**: a list, because the Sensors are a group of equal items. Holds only `li`s, so any Figma `row` frame inside it doesn't become an element.
5. **sensor**: one list item. `SensorReading` fills it.

Figma layer names follow this anatomy.

### API

```ts
/** One Sensor in the Module. The same fields SensorReading takes. */
interface ModuleCardSensor {
  /** The Metric the Sensor measures. One Sensor per Metric, so it also identifies the Sensor within the Module. */
  metric: SensorLabelMetric;
  /** The latest value of the Reading. `null` while the first Reading is on its way. */
  value: number | null;
  /** The Unit to show. The parent picks it, so it can choose the display Unit (°C or °F). */
  unit: UnitLabelUnit;
  /** How many decimal places to show. Set it per Metric (Temperature 1, CO₂ 0). Defaults to 1. */
  fractionDigits?: number;
}

interface ModuleCardProps {
  /** The Module Name, e.g. "Climate Module". The user can rename it, so the parent passes it in. */
  name: string;
  /** The Module's Sensors, one to three. */
  sensors: ModuleCardSensor[];
  /** The Module's current Connection Status. */
  connectionStatus: ConnectionStatus;
  /** The Module's current Fault. Leave it out when there is none. */
  fault?: DeviceFaultStatusProps;
  /** Whether the Module is turned on. The parent owns this value. */
  isOn: boolean;
  /** Called with the new value when the user flips the Switch. */
  onToggle: (isOn: boolean) => void;
}
```

Notes:

- `sensors` is a list, not `temperatureC` / `humidityPct` props, because the card works with any Module Type. This is the "sensor-agnostic" rule from the conventions.
- The list order is the display order. The parent decides it.
- `isOn` has the same name and meaning as in `Switch`. It is a setting the user chose, not a status, so it is separate from `connectionStatus`. Without it, the card couldn't tell "the user turned it off" from "we lost it".
- `connectionStatus` is required because only Paired Modules get a ModuleCard.
- `fault` is the same `faultCode` and `metric` that `DeviceFaultStatus` takes, passed on unchanged. A Fault shows once per Module, and `metric` names the affected Sensor in the message. `SensorReading` doesn't change. It stays visible in `off` and `disconnected`, because the last Fault stays until **Fault Cleared**.
- The Switch's `ariaLabel` comes from `name`, so a screen reader says "Climate Module, switch, on".
- More than three Sensors isn't blocked, but no Module has that many today, and the layouts are only designed up to three.

### Example values

Stories render in English. Which Sensors each Module Type has is not written down in the domain docs yet: these are assumed from the glossary examples.

| Use              | name               | sensors                                    | connectionStatus | isOn  | Shows                                      |
| ---------------- | ------------------ | ------------------------------------------ | ---------------- | ----- | ------------------------------------------ |
| Connected        | Climate Module     | Temperature 22.4 °C, Humidity 48 %RH       | `connected`      | true  | Two Sensors, Connected, On                 |
| Loading          | Climate Module     | Temperature `null`, Humidity `null`        | `connecting`     | true  | Two spinning icons, Connecting             |
| Stale            | Light Module       | Illuminance 320 lx                         | `stale`          | true  | One Sensor, Stale                          |
| Disconnected     | Climate Module     | Temperature 22.4 °C, Humidity 48 %RH       | `disconnected`   | true  | Values hidden, Switch On and greyed out    |
| Off              | Climate Module     | Temperature 22.4 °C, Humidity 48 %RH       | `disconnected`   | false | Values hidden, Switch Off and usable       |
| Fault            | Air Quality Module | CO₂ 1,250 ppm                              | `connected`      | true  | Value still shown, plus CO₂ sensor failure |
| Three Sensors    | Air Quality Module | CO₂ 1,250 ppm, VOC 120 ppb, PM2.5 12 µg/m³ | `connected`      | true  | Three in one row                           |
| `LongText` story | Air Quality Module | CO₂ 1,250 ppm, Illuminance 100,000 lx      | `connected`      | true  | Longest name and values, 240px wide        |
| `Minimal` story  | Light Module       | Illuminance 0 lx                           | `connected`      | true  | One Sensor                                 |

Stories: `Connected`, `Loading`, `Stale`, `Disconnected`, `Off`, `Fault`, `ThreeSensors`, `LongText`, `Minimal`.

### Tokens

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
| name    | text          | `typography/h4/*`     | `--shk-typography-h4-*`         |
| name    | colour        | `color-text/primary`  | to confirm in step 3            |

The Figma `row` variants are 364px wide (two 160px Sensors) and `stacked` 192px (one 160px Sensor). The card fills its parent, so these are the smallest widths.

The switching widths (364px, 536px) can't be `var(--shk-…)`: CSS doesn't allow variables in a container query. They need an exception to the tokens-only rule, or another way to do it in the CSS step.

### Accessibility

- `root` is a `<div role="group">` named by the Module's name (`aria-labelledby` → `name`), the same pattern as `SensorReading`.
- Reading order follows the anatomy: name, status, Sensors, Switch. It stays the same in both layouts.
- `sensors` is a real list, so a screen reader says how many Sensors there are.
- Each `SensorReading` keeps its own spoken name ("Temperature, 22.4 degrees Celsius").
- Not colour alone: `DeviceConnectionStatus` has a text label, `disconnected` has its own icon, and the Switch shows "On" or "Off" as text.
- A screen reader tells `off` from `disconnected` through the Switch: "on" and dimmed, or "off" and usable.
- No new live region. `DeviceConnectionStatus` already has `role="status"`, so status changes are announced. Readings are not, same rule as `SensorReading`.
- The rest (contrast, reduced motion) comes from the parts.

### Open questions

- **Which Sensors each Module Type has.** Not written down in the domain docs, and "one to three" is the working limit. Add it to the Ubiquitous Language or the Relationship doc.
- **Heading.** Should the Module name be a heading for screen-reader navigation? If yes, the card needs a `headingLevel` prop, because it doesn't know where it sits on the page.
