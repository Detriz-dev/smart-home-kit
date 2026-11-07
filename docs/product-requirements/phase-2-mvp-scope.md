# Phase 2 — MVP scope

What the MVP needs, compared with what the kit has today. The goal comes from the [roadmap](./roadmap.md): give designers and developers the tools to build the frontend of a smart home app that maps a Site and shows Readings, on/off states and detections. Frontend only: React and Figma components, Storybook and docs. No API, simulator, client or hardware.

Status as of 2026-11-07.

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
- [Suggested order of work](#suggested-order-of-work)
- [Left over from Phase 1](#left-over-from-phase-1)

## What the MVP app must show

| Need              | Examples                                                  | What it is                                                           |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| **Map a Site**    | Floors, Spaces, which Modules are in each Space           | The places and what's in them, so every value has a location         |
| **Readings**      | Temperature, humidity, CO₂, VOC, PM2.5, illuminance       | A measured number with a Unit                                        |
| **On/off states** | Electricity on or off, window open or closed              | One of two values, shown only: the kit is sensor-only, never control |
| **Detections**    | Motion, smoke, carbon monoxide                            | Something was detected; it raises an alert                           |
| **Alerts**        | "Smoke detected in Kitchen", "Motion in Hallway at 02:14" | A message that needs the user's attention                            |

Every value still follows the target states from the Glossary: loading, Connected, Stale, Disconnected and Fault.

## What we have today

**Domain model:** Glossary, Data model, Device lifecycle, Events and commands. They cover Places (Site, Floor, Space), Devices (Hub, Module), Sensors, Assets, numeric Readings and Device Status.

**Components (24):**

| Category   | Components                                                                             | Ready for the MVP?                                                                          |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Readings   | `ReadingValue`, `UnitLabel`, `SensorReading`, `ModuleCard`, `SpaceCard`                | Yes for Readings. Numbers only: they can't show an on/off state or a detection.             |
| Status     | `DeviceConnectionStatus`, `DevicePairingStatus`, `DeviceFaultStatus`, `DeviceListItem` | Yes.                                                                                        |
| Context    | `SensorLabel`, `SpaceLabel`                                                            | `SpaceLabel` yes. `SensorLabel` knows only the 6 numeric Metrics.                           |
| Navigation | `TopBar`, `BottomNav`, `LocationPath`                                                  | Yes. `LocationPath` already has Site → Floor → Space → Device.                              |
| Layout     | `Card`, `List`, `ListItem`, `StackLayout`, `ColumnLayout`, `ContentSection`            | Yes. Good base for Site and Floor screens.                                                  |
| Controls   | `Button`, `IconButton`, `Switch`                                                       | Yes. `Switch` is for app settings only, so it must **not** be used to show an on/off state. |
| Feedback   | `InlineMessage`                                                                        | Partly. Fine for errors on a screen; not an alert (no time, place or severity).             |

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

1. **On/off is a Reading.** A Sensor still measures and sends a value. A Metric is either a **Measured Metric** (number + Unit) or a **Two-state Metric** (one of two **States**, no Unit). Power is On/Off, Contact is Open/Closed.
2. **A detection starts and ends.** Motion, Smoke and CO are Two-state Metrics with the States Detected/Clear. A **Detection** starts with the first Detected Reading and ends with the next Clear Reading.
3. **Alerts come from Alert Rules.**
   - The developer defines **Alert Rules** in code, one condition per Sensor: in a given State (On, Off, Open…), above a value or below a value.
   - The UI can show a rule (e.g. "Alert above 28 °C" next to a temperature), but only if the developer wants to. For Smoke or an open door, the rule usually isn't shown.
   - An **Alert** stays **Active** until the condition is no longer true (**Ended**) or the user closes it (**Closed**).
   - Smoke and CO Sensors always have a **Built-in Alert Rule**: Detected raises a Critical Alert. It is on by default, and the developer can turn it off.
   - A **closed Alert never comes back.** Only a new start of the condition, after it has ended, raises a new Alert. While the condition is still true, the Reading itself shows the problem (e.g. Smoke Detected on the Module's card).
   - **Only the Site's owner can close an Alert.** Accounts the Site is shared with only see it. This keeps the existing view-only sharing rule, with no exceptions.
   - **Alert Levels:** Critical, Warning and Info. The developer sets a level on each Alert Rule; Built-in Alert Rules are Critical. The level sets how strong `AlertBanner` and `AlertListItem` look (`danger`, `warning` and `neutral` or `progress` tokens).
4. **Every Module sends its current Readings at least once per Expected Interval**, even when nothing has changed. A closed door still reports Closed, and a Smoke Sensor still reports Clear. Silence always means a problem, so Stale keeps its meaning.
5. **Mapping a Site is display only.** The developer builds Sites, Floors and Spaces in code. No forms and no new commands for creating or editing places in the MVP.
6. **MVP Metrics:** Power, Contact (door/window), Motion, Smoke and CO, next to the existing six Measured Metrics.
7. **Power is about an Asset.** A new Asset Type, **Appliance**, so the app shows "Washing machine On" with its own icon. Contact is about a Door or Window Asset; Motion, Smoke and CO are about the Space.

### Still open

Nothing open right now. New questions go here.

## Suggested order of work

1. ✅ Update the Glossary, Data model and Events and commands.
2. ✅ Add shared types, icons and tokens, in code and Figma (`state` collection, 5 Metric icons, `SensorLabel / Metrics` frame).
3. Build the small parts: ✅ `StateValue`, ✅ `DetectionStatus` (State + since when), ✅ `RelativeTime`, ✅ `AssetLabel`, ✅ `Badge` (all in Figma, code and docs).
4. ✅ Update `ModuleCard` and `SpaceCard` (State Sensors and rows, in code, Figma examples and docs); build `SensorState`.
5. Build alerts: ✅ `AlertListItem`, ✅ `AlertBanner`, and a way to show an Alert Rule next to a Reading (still to do).
6. Build Site display: ✅ `SpaceListItem`, `FloorSection`, `EmptyState`.
7. Figma, Storybook and docs alongside each step; example screens last.

## Left over from Phase 1

- The roadmap says `tokens` and `ui` are published on npm, but they aren't yet (`AGENTS.md`, open questions in `project-architecture.md`). Either publish them or move that item into Phase 2.
