# Components: what we have and what's missing

An overview of every UI component category, what is built and what could come next. Updated 2026-11-06.

**Legend**

- ✅ **Built**: in `kit/packages/ui`, with a spec, stories and a docs page.
- 🔜 **Next**: proposed, and needed soon (other components or common screens depend on it).
- 💡 **Idea**: proposed, but can wait or needs a decision first.

**Two limits that shape every proposal**

- The kit is **sensor-only**. It reads Sensors and never sends commands to a Device, so there are no "turn the heating on" controls.
- `ui` is **presentational**. Components take props and never fetch data, so a chart gets its Readings as a prop.

## Summary

| #   | Category    | Question it answers                  | ✅ Built | 🔜 Next | 💡 Ideas |
| --- | ----------- | ------------------------------------ | -------- | ------- | -------- |
| 0   | Foundations | What is everything made of?          | 1        | 0       | 0        |
| 1   | Layout      | How is it arranged?                  | 4        | 0       | 2        |
| 2   | Context     | What is it?                          | 2        | 2       | 2        |
| 3   | Readings    | What is it right now?                | 5        | 0       | 2        |
| 4   | Status      | Is everything OK?                    | 3        | 1       | 1        |
| 5   | Feedback    | What is the interface doing?         | 1        | 2       | 2        |
| 6   | Controls    | How do I change what I see?          | 2        | 1       | 4        |
| 7   | Navigation  | Where am I, and where can I go?      | 1        | 3       | 3        |
| 8   | History     | How has it changed?                  | 0        | 3       | 2        |
| 9   | Comparison  | How do Sensors relate to each other? | 0        | 0       | 2        |
|     | **Total**   |                                      | **19**   | **12**  | **20**   |

History and Comparison are in the categorisation rules (`ds-conventions-and-structure.md`) but have no folder or docs page yet.

## 0. Foundations

Not components in a category, but the building blocks every component uses.

| Component | What it does                                         | Status |
| --------- | ---------------------------------------------------- | ------ |
| `Icon`    | Shows an icon from the kit's icon set at a set size. | ✅     |

## 1. Layout

**How is it arranged?** Structure and spacing. Shows no data of its own.

| Component        | What it does                                                                                                                          | Status |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `ContentSection` | A section of a screen with a heading.                                                                                                 | ✅     |
| `ColumnLayout`   | Places children side by side in columns.                                                                                              | ✅     |
| `StackLayout`    | Places children in one column with an even gap.                                                                                       | ✅     |
| `Card`           | The plain surface (background, border, padding) that `ModuleCard` and `SpaceCard` share, so apps can make their own cards that match. | ✅     |
| `AppShell`       | The frame of a whole app screen: `TopBar` at the top, content in the middle, `BottomNav` at the bottom on phones.                     | 💡     |
| `Divider`        | A thin line between groups of content.                                                                                                | 💡     |

## 2. Context

**What is it?** Fixed facts: names and details of things from the Glossary. They change only when the user renames or moves something. The pattern: one icon + name label per Glossary noun.

| Component       | What it does                                                                                          | Status |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| `SensorLabel`   | Says what a Sensor measures: Metric icon + name ("Temperature").                                      | ✅     |
| `DeviceLabel`   | Device Kind icon + name ("Climate Module", "Kitchen Hub"). The Device without its location.           | 🔜     |
| `SpaceLabel`    | Space Type icon + Space name ("Bedroom"). For lists of rooms and Space pickers. Holds `SPACE_TYPE_ICONS`. | ✅     |
| `ReadingTime`   | When a value was measured ("Updated 2 min ago"). Shows the Reading's timestamp, so it's a fixed fact. | 🔜     |
| `AssetLabel`    | Asset Type icon + Asset name ("Monstera"), for when a Reading's Subject is an Asset, not the Space.   | 💡     |
| `DeviceDetails` | A list of fixed facts about one Device: Device Kind, Module Type, its Hub, Expected Interval.         | 💡     |

## 3. Readings

**What is it right now?** Current values, from one number up to a card for a whole Space.

| Component       | What it does                                                                                                                          | Status |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `UnitLabel`     | Shows a Unit ("°C", "ppm").                                                                                                           | ✅     |
| `ReadingValue`  | Shows one value, with loading, Stale, Disconnected and Fault states.                                                                  | ✅     |
| `SensorReading` | `SensorLabel` + `ReadingValue` + `UnitLabel` in one piece.                                                                            | ✅     |
| `ModuleCard`    | All current Readings of one Module.                                                                                                   | ✅     |
| `SpaceCard`     | The current Readings of a whole Space.                                                                                                | ✅     |
| `AssetCard`     | The current Readings about one Asset ("Monstera: soil moisture 32 %").                                                                | 💡     |
| `ReadingLevel`  | A value on a scale from good to poor (for example CO₂). **Needs a domain decision first:** comfort ranges aren't in the Glossary yet. | 💡     |

## 4. Status

**Is everything OK?** The health of a Device. Pairing Status, Connection Status and Fault stay three separate fields.

| Component                | What it does                                                                                                    | Status |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | ------ |
| `DeviceConnectionStatus` | Connecting, Connected, Stale or Disconnected.                                                                   | ✅     |
| `DevicePairingStatus`    | Unpaired, Pairing or Paired.                                                                                    | ✅     |
| `DeviceFaultStatus`      | A Device's Fault, with a message per Fault Code.                                                                | ✅     |
| `DeviceListItem`         | One row in a list of Devices: `DeviceLabel` or `LocationPath` plus its statuses. Main job is health, so Status. | 🔜     |
| `FaultCount`             | A small badge with the number of Faults ("2"), for a nav item or a card corner.                                 | 💡     |

## 5. Feedback

**What is the interface doing?** Messages about the app, not the hardware.

| Component       | What it does                                                                                         | Status |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------ |
| `InlineMessage` | A message inside the page: a request failed, or a change was saved.                                  | ✅     |
| `EmptyState`    | What to show when there's nothing yet: no Spaces, no Devices, a new Device whose history is empty.   | 🔜     |
| `Toast`         | A short message that appears for a moment and goes away ("Module renamed").                          | 🔜     |
| `ConfirmDialog` | Asks before something hard to undo, like removing a Device from the Account.                         | 💡     |
| `Skeleton`      | Grey placeholder shapes while a whole screen loads (single components already have a loading state). | 💡     |

## 6. Controls

**How do I change what I see?** Inputs that change the current screen or app settings. Never commands to a Device.

| Component          | What it does                                                                                                      | Status |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------ |
| `Button`           | Starts an action.                                                                                                 | ✅     |
| `Switch`           | Turns an app setting on or off.                                                                                   | ✅     |
| `SegmentedControl` | Picks one of a few options that change how the same data looks: "24 h / 7 d / 30 d", "°C / °F". History needs it. | 🔜     |
| `IconButton`       | A button with only an icon (close, more, refresh), with a hidden text label.                                      | 💡     |
| `Select`           | Picks one option from a longer list (a Space, a display Unit).                                                    | 💡     |
| `TextField`        | Types text: rename a Module, paste a Hub Token.                                                                   | 💡     |
| `NumberField`      | Types a number with limits, such as a Module's Expected Interval.                                                 | 💡     |

## 7. Navigation

**Where am I, and where can I go?** Where the person is in the home, and ways to move between screens.

| Component       | What it does                                                                  | Status |
| --------------- | ----------------------------------------------------------------------------- | ------ |
| `LocationPath`  | Shows where a Device is: Site → Floor → Space → Device. Read-only.            | ✅     |
| `Tabs`          | Switches between views of one thing (a Space's Overview / History / Devices). | 🔜     |
| `BottomNav`     | The main app sections on phones and wall tablets, 3–5 items.                  | 🔜     |
| `TopBar`        | Screen title, back button and actions at the top of a screen.                 | 🔜     |
| `Breadcrumbs`   | A clickable `LocationPath`: each part links to that Site, Floor or Space.     | 💡     |
| `SpaceSwitcher` | Jumps between the Spaces of a Site.                                           | 💡     |
| `SideNav`       | The main app sections in a side column on tablets and desktops.               | 💡     |

## 8. History (new)

**How has it changed?** Readings over time. Like Readings, these components cover the target states (loading, Connected, Stale, Disconnected, Fault), and a chart should show gaps where a Device was Disconnected instead of drawing a line through them.

| Component        | What it does                                                                            | Status |
| ---------------- | --------------------------------------------------------------------------------------- | ------ |
| `ReadingChart`   | A line chart of one Metric over a time range, with gaps for missing Readings.           | 🔜     |
| `Sparkline`      | A tiny trend line with no axes, to fit inside a card next to the current value.         | 🔜     |
| `ReadingSummary` | Lowest, average and highest value over a period ("Today: 19.2 – 22.8 °C, avg 21.0").    | 🔜     |
| `TrendIndicator` | An arrow and a short label for the direction of change ("↑ rising").                    | 💡     |
| `EventTimeline`  | A list of past Events for a Device: Connected, Disconnected, Fault reported, and so on. | 💡     |

## 9. Comparison

**How do Sensors relate to each other?** Several Sensors or Metrics side by side. Best left until History exists, because it reuses the charts.

| Component          | What it does                                                                   | Status |
| ------------------ | ------------------------------------------------------------------------------ | ------ |
| `MultiMetricChart` | Two or more Metrics on one chart (temperature and humidity in the Bedroom).    | 💡     |
| `SpaceComparison`  | The same Metric across Spaces ("CO₂: Bedroom 820, Office 1 140, Kitchen 600"). | 💡     |

## Decisions needed before some of these

1. **Chart library for History.** Build charts by hand (SVG) or use a library. Worth an ADR in `docs/adr/`.
2. **History data.** The API Simulator needs to serve past Readings before History components can be shown with real-looking data.
3. **Comfort ranges.** `ReadingLevel` needs "good / OK / poor" ranges per Metric. They aren't in the Glossary yet; Space Type mentions "comfort presets".
4. **Overlays.** `Toast` and `ConfirmDialog` float above the page. Decide whether overlays are Feedback or get their own category.
5. **Folders and docs.** History and Comparison need a `ui` folder, a docs-site `_category_.json` and a line on the UI Components overview page when their first component is built.

## Suggested order

1. **Navigation basics:** `TopBar`, `BottomNav`, `Tabs`. Every app screen needs them.
2. **Context labels:** `DeviceLabel`, `ReadingTime`. (`SpaceLabel` is built.) Small, quick, and used inside many other components.
3. **Screen states:** `EmptyState`, `Toast`. (`Card` is built.)
4. **History:** `SegmentedControl` first (for the time range), then `Sparkline`, `ReadingSummary`, `ReadingChart`.
5. **Lists:** `DeviceListItem`.
6. Ideas (💡) as real screens ask for them.
