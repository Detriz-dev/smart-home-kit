# 0002. Devices have Capabilities, and the kit can control them

- Status: accepted (2026-11-08)
- Date: 2026-11-08
- Affects: the Domain Model pages (Glossary, Data model, Device lifecycle, Events and commands), the shared types and many components in `@detriz-sh-kit/ui`, the Figma library, the Phase 2 (MVP) scope
- Details: [Domain model review](../domain-model-revew.md) (decisions 1–25), [implementation plan](../product-requirements/domain-model-change-implementation.md)

## Context

The domain model describes one setup: a Raspberry Pi **Hub** with **Modules** wired to it, each Module carrying **Sensors** that only report. Five assumptions are built in:

1. A Device is either a Hub or a Module, and every Sensor sits on a Module wired to a Hub.
2. Everything is read-only. The only commands manage Devices and Alerts (Pair, Dismiss, Remove, Place Hub, Close Alert).
3. A State Metric has exactly two States.
4. Alert Rules are defined in code, and an app "may show them, but doesn't have to".
5. Only Modules can be Stale.

Common smart home devices don't fit:

| Device               | Why it doesn't fit                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Power strip          | Connects by itself, and has several sockets switched one by one                                   |
| Kettle               | Connects by itself, has more than two states, and some models only allow some changes (Stop only) |
| Motorized blinds     | Connects by itself, can be opened and closed, and some have a position (0–100 %)                  |
| Heating (thermostat) | You set a number (the setpoint) and it measures another (the temperature)                         |
| Wireless Module      | Connects to the Hub without a wire                                                                |

The MVP scope also said "the kit is sensor-only, never control". The owner decided that Controls belong in the MVP (review decision 5).

## Options

1. **A "device type" split: hub vs. solo.** A Hub has Modules; a solo device is one thing. Simple to explain, but the power strip breaks it: it's one device connected by itself, with several parts you control separately.
2. **Devices with Capabilities.** Every paired thing is a Device. A Device has Capabilities; each one either only reports or can also be changed. How a Device connects (through a Hub or directly) is a separate question. This is how the big platforms model it: Matter (Node → Endpoints → Clusters), Home Assistant (Device → Entities), SmartThings (Device → Components → Capabilities), Google Home (Device → Traits).
3. **Keep the model and add one-off types per device.** No redesign, but every new device needs new rules, and the kit stops being a reusable model.

## Decision

Option 2: **Devices have Capabilities, and the kit can control them.** Two modelling principles guided every choice and apply to future changes:

- **Follow the industry.** Start from Matter, Google Home, Home Assistant and SmartThings when naming a concept, a State or a command. Only invent a term when none fits.
- **Keep it simple.** When options are otherwise equal, pick the one that adds the fewest new concepts, fields and rules.

### Devices

- **Everything you pair is a Device.** It has Device Status as today: Pairing Status, Connection Status and Fault.
- **Device Kind** says how it connects: **Hub** (other Devices connect through it), **Module** (connects through a Hub, by wire or wirelessly) or **Standalone Device** (connects directly).
- **Device Type** says what it is, as one list for every Device. It replaces Module Type: Hub, Climate, Light, Air Quality, Motion, Contact, Power, Smoke, CO, Kettle, Power strip, Blinds, Thermostat, Washing machine, Other. **Module Name** becomes **Device Name**.
- **Connection Type** (Wired, Wi-Fi, Zigbee, Thread, Bluetooth, Other) is optional and for display only.

### Capabilities

- A Device has **Capabilities**, each about one Subject (a Space or an Asset).
- A **Sensor** only reports. A **Control** reports and can be changed: a **State Control** picks a State (Power On / Off, Open / Close, Mode Off / Heat), a **Value Control** sets a number in a range (Setpoint 0–30 °C, Position 0–100 %).
- Each Control lists its **allowed commands**. A kettle may allow only Stop; a socket allows Turn on and Turn off.
- **Operational State** (Stopped, Running, Paused, Error, plus a **Phase** such as Heating) is a special State Control with Start, Pause, Resume and Stop, following Matter.
- A Device that runs a task (kettle, washing machine) is controlled through Operational State. It has a **Power** Control only if the real device has a separate power button. When Power is Off, Operational State is Stopped.
- Operational State **Error** and **Fault** are separate questions ("can it do its task?" vs. "is the hardware healthy?"), linked when a Fault causes the Error. Error has an **Error reason**: a fixed base list from the kit plus device-specific reasons with a label.
- **Two-state Metric** becomes **State Metric**, with two or more States. New Metrics: Open / Close (Open, Closed, Opening, Closing), Position, Setpoint, Mode, Battery.
- Every command goes through a **pending** step (sent → confirmed, or failed). Accounts a Site is shared with can't send commands (sharing stays view-only).

### Alerts, pairing and connection

- Alert Rules are still defined in code, now on any Capability, and the **UI must be able to show them**. A range is **two rules** ("below 20 °C" and "above 30 °C").
- **Pairing:** the lifecycle stays Detected → Unpaired → Pairing → Paired. Wired Modules are listed in the Hub's settings; wireless Modules are found with a new **Start Search** command. The Hub Token becomes a **Device Token**, used by every Device connected directly. **Place Hub** becomes **Place Device**.
- **Disconnected** has no reason field, as today. **Battery** is an ordinary Sensor. Any Device that sends Readings can be **Stale**.

## Consequences

- **Domain Model pages:** the Glossary, Data model, Device lifecycle and Events and commands are rewritten for Devices and Capabilities, with new commands (Turn on, Turn off, Open, Close, Stop, Set position, Set setpoint, Set mode, Start, Pause, Resume, Start Search, Place Device) and events (Command Sent, Command Confirmed, Command Failed, Operational State Changed, Search Started, Search Ended). "Wired", "Two-state" and "Modules only" disappear.
- **Phase 2 (MVP) grows:** Controls and Operational State are in scope. The roadmap and the MVP scope are updated. Out of the MVP: Tilt, heating Cool and Auto, setup codes (QR), account linking with manufacturers' clouds, pairing screens.
- **Shared types:** `TwoStateMetric` → `StateMetric`, `ModuleType` → `DeviceType`, a third `DeviceKind`, and new types for Connection Type, Operational State and command status. Renames don't need deprecated aliases, because the packages aren't published yet.
- **Components:** several existing ones change (for example `StateValue`, `SensorState`, `DeviceListItem`, `SpaceCard`, `Switch`'s usage rule). New Controls are needed (`PowerControl`, `OpenCloseControl`, `StateSelectControl`, `ValueControl`, `OperationalStateControl`), plus `OperationalStateValue` and `DeviceCard`. Every Control covers the target states plus pending, failed, not allowed and view-only.
- **`ui` stays presentational.** Controls take the value, the command status and `on<Command>` callbacks as props; they never send commands themselves.
- **Open for Phase 3:** the architecture says the Hub serves the API on the local network. A Standalone Device doesn't go through a Hub, so the API design must decide where Standalone Devices connect (to a Hub on the network, or to a hosted API).
