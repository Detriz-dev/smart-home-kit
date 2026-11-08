# Phase 2 — MVP scope

What the MVP needs, compared with what the kit has today. The goal comes from the [roadmap](./roadmap.md): give designers and developers the tools to build the frontend of a smart home app that maps a Site, shows Readings, on/off states and detections, and controls Devices. Frontend only: React and Figma components, Storybook and docs. No API, simulator, client or hardware.

Status as of 2026-11-08. The scope grew on 2026-11-08 with [ADR 0002](../adr/0002-devices-and-capabilities.md): Devices have Capabilities, and the kit can control them. See [Update 2026-11-08: Devices and Controls](#update-2026-11-08-devices-and-controls).

## Contents

- [What the MVP app must show](#what-the-mvp-app-must-show)
- [What we have today](#what-we-have-today)
- [Gaps](#gaps)
  - [1. Domain model](#1-domain-model)
  - [2. Shared types](#2-shared-types)
  - [3. Components](#3-components)
  - [4. Icons and tokens](#4-icons-and-tokens)
  - [5. Figma library](#5-figma-library)
  - [6. Storybook and docs](#6-storybook-and-docs)
- [Decisions](#decisions)
- [Update 2026-11-08: Devices and Controls](#update-2026-11-08-devices-and-controls)
- [Suggested order of work](#suggested-order-of-work)
- [Left over from Phase 1](#left-over-from-phase-1)

## What the MVP app must show

| Need                       | Examples                                                                | What it is                                                                               |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Map a Site**             | Floors, Spaces, which Devices are in each Space                         | The places and what's in them, so every value has a location                             |
| **Readings**               | Temperature, humidity, CO₂, VOC, PM2.5, illuminance                     | A measured number with a Unit                                                            |
| **On/off states**          | Electricity on or off, window open or closed                            | One of a few States (On/Off, Open/Closed, Opening/Closing)                               |
| **Detections**             | Motion, smoke, carbon monoxide                                          | Something was detected; it raises an alert                                               |
| **Alerts**                 | "Smoke detected in Kitchen", "Motion in Hallway at 02:14"               | A message that needs the user's attention                                                |
| **Controls**               | Socket on/off, blinds open/close/position, heating 22 °C, Mode Off/Heat | Changing a Device. Only the commands it allows; every command is pending until confirmed |
| **What a Device is doing** | Kettle Running · Heating, washing machine Paused                        | Operational State (Stopped, Running, Paused, Error), with Start, Pause, Resume, Stop     |

Every value still follows the target states from the Glossary: loading, Connected, Stale, Disconnected and Fault. Controls add pending, failed, not allowed and view-only.

## What we have today

**Domain model:** Glossary, Data model, Device lifecycle, Events and commands. They cover Places (Site, Floor, Space), Devices (Hub, Module), Sensors, Assets, numeric Readings and Device Status.

**Components (24):**

| Category   | Components                                                                             | Ready for the MVP?                                                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Readings   | `ReadingValue`, `UnitLabel`, `SensorReading`, `ModuleCard`, `SpaceCard`                | Yes for Readings. Numbers only: they can't show an on/off state or a detection.                                                                             |
| Status     | `DeviceConnectionStatus`, `DevicePairingStatus`, `DeviceFaultStatus`, `DeviceListItem` | Yes.                                                                                                                                                        |
| Context    | `SensorLabel`, `SpaceLabel`                                                            | `SpaceLabel` yes. `SensorLabel` knows only the 6 numeric Metrics.                                                                                           |
| Navigation | `TopBar`, `BottomNav`, `LocationPath`                                                  | Yes. `LocationPath` already has Site → Floor → Space → Device.                                                                                              |
| Layout     | `Card`, `List`, `ListItem`, `StackLayout`, `ColumnLayout`, `ContentSection`            | Yes. Good base for Site and Floor screens.                                                                                                                  |
| Controls   | `Button`, `IconButton`, `Switch`                                                       | For app settings, yes. `Switch` was for app settings only; whether Device Controls reuse it is decided when `PowerControl` is built (see the update below). |
| Feedback   | `InlineMessage`                                                                        | Partly. Fine for errors on a screen; not an alert (no time, place or severity).                                                                             |

**Tokens:** status colours `neutral`, `progress`, `success`, `warning`, `danger`. **Icons:** 30, mostly Metrics, Space Types and feedback.

## Gaps

### 1. Domain model

The model only knows numeric Readings. Everything new needs words before it needs components.

| Gap                                           | Why it matters                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **On/off state** has no term                  | ✅ Glossary: Two-state Metric and State (decision 1).                                                                                                   |
| **Detection** has no term                     | ✅ Glossary: Detection (decision 2).                                                                                                                    |
| **Alert** has no term                         | ✅ Glossary: Alert Rule, Built-in Alert Rule, Alert, Alert Status (decision 3). Some questions still open.                                              |
| **Metric list** is fixed at 6                 | ✅ Glossary: Power, Contact, Motion, Smoke, CO added (decision 6). Still to add in code.                                                                |
| **Module Types**: Climate, Light, Air Quality | ✅ Glossary: Motion, Contact, Power, Smoke, CO added.                                                                                                   |
| **Asset Types**: Plant, Tap, Door, Window     | ✅ Glossary: Appliance added. Contact watches a Door or Window, Power an Appliance (decision 7).                                                        |
| **Stale** breaks for event sensors            | ✅ Glossary: every Module reports at least once per Expected Interval (decision 4).                                                                     |
| **Data model, Events and commands**           | ✅ Updated: Reading value (number or State), Alerts section and rules 18–26; events for State changes, Detections and Alerts; Close Alert command.      |
| **Open questions file** is missing            | `AGENTS.md` points to `docs/architecture/domain-model/open-questions.md`, which doesn't exist. Open questions are in [Still open](#still-open) for now. |

### 2. Shared types

In `kit/packages/ui/src/types/`, following the Domain model decisions:

- Extend `Metric` with `power`, `contact`, `motion`, `smoke` and `co`, and split it into Measured and Two-state Metrics.
- Add a `State` type (`on`, `off`, `open`, `closed`, `detected`, `clear`) and a Reading value that is a number or a State.
- Add `AlertRule`, `AlertStatus` (`active`, `ended`, `closed`), `AlertLevel` (`critical`, `warning`, `info`), `ModuleType` and `AssetType` (none exist in code yet).

### 3. Components

Names are suggestions. Each one follows the component workflow: spec, types, CSS, stories (every state plus `LongText` and `Minimal`), export, docs page.

**On/off states and detections**

| Component           | Category | What it does                                                                              |
| ------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `StateValue`        | Readings | Shows "On"/"Off" or "Open"/"Closed" with an icon, plus the target states. Read-only.      |
| `SensorState`       | Readings | Label + `StateValue`, the on/off twin of `SensorReading`.                                 |
| `DetectionStatus`   | Readings | "Motion detected" / "No motion", with time of the last detection, plus the target states. |
| `AssetLabel`        | Context  | Asset name with its Asset Type icon (front door, kitchen window).                         |
| `ModuleCard` update | Readings | Accept states and detections, not just numbers.                                           |
| `SpaceCard` update  | Readings | Same: rows for states and detections, e.g. "Window open", "Motion 2 min ago".             |

**Alerts**

| Component       | Category | What it does                                                                                       |
| --------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `AlertBanner`   | Feedback | A strong, top-of-screen message for an active alert (smoke, CO): what, where, when, action.        |
| `AlertListItem` | Feedback | One alert in a list: kind, Space, time, active or cleared.                                         |
| `Badge`         | Feedback | A small count, e.g. active alerts on a `BottomNav` item or a `SpaceCard`.                          |
| `RelativeTime`  | Context  | "2 min ago" / "at 02:14", used by detections and alerts. Today each component formats time itself. |

**Mapping a Site**

| Component       | Category | What it does                                                               |
| --------------- | -------- | -------------------------------------------------------------------------- |
| `FloorSection`  | Layout   | A Floor heading with its Spaces under it. Optional, as Floors are.         |
| `SpaceListItem` | Layout   | A Space row: icon, name, Floor, short summary (e.g. "3 Modules, 1 alert"). |
| `EmptyState`    | Feedback | "No Spaces yet". Needed on every new list.                                 |

Forms (text field, select, dialog) are **out of scope**: mapping a Site is display only (decision 5).

### 4. Icons and tokens

- **Icons to add:** motion, door, window, power or plug, smoke, CO, appliance, bell (alert), plus/add, edit, chevron, delete, floor or layers, and the new Asset Type icons. Workflow: `add-icon-to-design-system-workflow.md`.
- **Tokens:** a colour for "on/active" that isn't `success` (on isn't good or bad), an alert style for critical alerts (likely `danger` with a stronger, solid treatment), and component tokens for the new components.

### 5. Figma library

The Figma library isn't in this repo, so it couldn't be checked here. It needs the same new and updated components, icons and tokens. Known items still open from Phase 1: `UnitLabel` variant count, and the `Switch` usage frame that may still show "Heating".

### 6. Storybook and docs

- Stories for every new component (each state, `LongText`, `Minimal`).
- A docs page per new component, and updates to the `ModuleCard` and `SpaceCard` pages.
- Domain Model pages updated with the new terms, data model, events and commands.
- Not in the roadmap yet, but worth adding: **example screens** (Site overview, Space detail, Alerts) in Storybook or the docs, to show the components work together as a frontend.

## Decisions

Decided on 2026-11-07. The new terms are in the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx).

1. **On/off is a Reading.** A Sensor still measures and sends a value. A Metric is either a **Measured Metric** (number + Unit) or a **Two-state Metric** (one of two **States**, no Unit). Power is On/Off, Contact is Open/Closed. _Updated by decision 8: Two-state Metric becomes State Metric, with two or more States._
2. **A detection starts and ends.** Motion, Smoke and CO are Two-state Metrics with the States Detected/Clear. A **Detection** starts with the first Detected Reading and ends with the next Clear Reading.
3. **Alerts come from Alert Rules.**
   - The developer defines **Alert Rules** in code, one condition per Sensor: in a given State (On, Off, Open…), above a value or below a value.
   - The UI can show a rule (e.g. "Alert above 28 °C" next to a temperature), but only if the developer wants to. For Smoke or an open door, the rule usually isn't shown. _Updated by decision 8: the kit must be able to show every rule, and a range is two rules._
   - An **Alert** stays **Active** until the condition is no longer true (**Ended**) or the user closes it (**Closed**).
   - Smoke and CO Sensors always have a **Built-in Alert Rule**: Detected raises a Critical Alert. It is on by default, and the developer can turn it off.
   - A **closed Alert never comes back.** Only a new start of the condition, after it has ended, raises a new Alert. While the condition is still true, the Reading itself shows the problem (e.g. Smoke Detected on the Module's card).
   - **Only the Site's owner can close an Alert.** Accounts the Site is shared with only see it. This keeps the existing view-only sharing rule, with no exceptions.
   - **Alert Levels:** Critical, Warning and Info. The developer sets a level on each Alert Rule; Built-in Alert Rules are Critical. The level sets how strong `AlertBanner` and `AlertListItem` look (`danger`, `warning` and `neutral` or `progress` tokens).
4. **Every Module sends its current Readings at least once per Expected Interval**, even when nothing has changed. A closed door still reports Closed, and a Smoke Sensor still reports Clear. Silence always means a problem, so Stale keeps its meaning. _Updated by decision 8: this applies to every Device that sends Readings, not only Modules._
5. **Mapping a Site is display only.** The developer builds Sites, Floors and Spaces in code. No forms and no new commands for creating or editing places in the MVP.
6. **MVP Metrics:** Power, Contact (door/window), Motion, Smoke and CO, next to the existing six Measured Metrics.
7. ✅ Figma, Storybook and docs alongside each step; example screens last: **Site overview** and **Space detail** (Kitchen), with the same sample Site ("My flat"), in Storybook (`Examples/Screens`, `kit/packages/ui/src/examples/`) and on the Figma `Example Screens` page. An Alerts screen and an empty Site were left out for now.
8. **Devices have Capabilities, and the kit can control them** (2026-11-08, [ADR 0002](../adr/0002-devices-and-capabilities.md)). Details in the [update below](#update-2026-11-08-devices-and-controls).

### Still open

Nothing open right now. New questions go here.

## Update 2026-11-08: Devices and Controls

The [domain model review](../domain-model-revew.md) (23 decisions) and [ADR 0002](../adr/0002-devices-and-capabilities.md) widen the MVP. The step-by-step work is in the [implementation plan](./domain-model-change-implementation.md).

### What changes in the model

- **Everything you pair is a Device.** Device Kind: Hub, Module (through a Hub, wired or wireless) or Standalone Device (connected directly). Device Type replaces Module Type, for every Device.
- **A Device has Capabilities:** Sensors (only report) and Controls (State Control, Value Control). Each Control lists its allowed commands.
- **Operational State** (Stopped, Running, Paused, Error + Phase) with Start, Pause, Resume and Stop. Devices that run a task use it instead of Power.
- **State Metric** (two or more States) replaces Two-state Metric. New Metrics: Open / Close, Position, Setpoint, Mode (Off, Heat), Battery.
- Alert Rules can check any Capability, the UI must be able to show them, and a range is two rules.

### New example devices for the MVP

Power strip (one Power Control per socket), kettle (Operational State, Start / Stop per model), motorized blinds (Open / Close, Position), heating (Setpoint, Temperature, Mode Off / Heat), a wireless Module, and manual blinds as an Asset watched by a Contact Sensor.

### New gaps

| Area           | Gap                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Domain model   | Glossary, Data model, Device lifecycle and Events and commands rewritten for Devices, Capabilities, Controls and Operational State               |
| Shared types   | `StateMetric`, `DeviceType`, a third `DeviceKind`, Connection Type, Operational State, command status                                            |
| Components     | Updates to `StateValue`, `SensorState`, `DeviceListItem`, `SpaceCard`, `SensorLabel`, `AlertRuleLabel`, `LocationPath`, `DeviceConnectionStatus` |
| New components | `PowerControl`, `OpenCloseControl`, `StateSelectControl`, `ValueControl`, `OperationalStateControl`, `OperationalStateValue`, `DeviceCard`       |
| Icons, tokens  | New Metrics, States, Operational States, Device Types and commands; tokens for pending and failed if the existing ones don't fit                 |
| Figma, docs    | The same components in Figma, Storybook and docs; the example screens gain the new devices                                                       |

### Still out of the MVP

Blind Tilt, heating Cool and Auto, pairing screens (Start Search, Device Token), setup codes (QR), account linking with manufacturers' clouds, forms for creating places (decision 5 still holds).

## Suggested order of work

1. ✅ Update the Glossary, Data model and Events and commands.
2. ✅ Add shared types, icons and tokens, in code and Figma (`state` collection, 5 Metric icons, `SensorLabel / Metrics` frame).
3. Build the small parts: ✅ `StateValue`, ✅ `DetectionStatus` (State + since when), ✅ `RelativeTime`, ✅ `AssetLabel`, ✅ `Badge` (all in Figma, code and docs).
4. ✅ Update `ModuleCard` and `SpaceCard` (State Sensors and rows, in code, Figma examples and docs); build `SensorState`.
5. ✅ Build alerts: `AlertListItem`, `AlertBanner`, and `AlertRuleLabel` to show an Alert Rule next to a Reading.
6. ✅ Build Site display: `SpaceListItem`, `FloorSection`, `EmptyState`.
7. Figma, Storybook and docs alongside each step; example screens last.
8. Devices and Controls (decision 8): follow the [implementation plan](./domain-model-change-implementation.md), Steps 2–8.

## Left over from Phase 1

- The roadmap says `tokens` and `ui` are published on npm, but they aren't yet (`AGENTS.md`, open questions in `project-architecture.md`). Either publish them or move that item into Phase 2.
