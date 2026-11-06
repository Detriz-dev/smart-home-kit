# Smart home use cases

A list of things people could do with a smart home app built on the kit. Each use case is checked against the kit's domain model, so you can see which ones the model already supports and which ones would need it to grow.

The terms in **bold** come from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx). How they relate is in the [Data model](/kit/apps/docs-site/docs/domain-model/data-model.mdx), and how Devices change status is in the [Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx). What the kit is for: [Product overview](./product-overview.md).

## How to read this list

Each use case has an ID, a short user story, the domain concepts it uses, and a **Fit** that says how well today's model covers it:

| Fit        | Meaning                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| ✅ Ready   | The model has everything needed. An app can build it today with the kit's Metrics, Readings and statuses.             |
| 🟡 Partly  | The data is there, but the use case needs a small new concept (usually a threshold, an alert or a new Metric).        |
| ❌ Missing | The model has no place for it yet: it needs new hardware types, new Metrics or new concepts such as control or video. |

**What the model covers today.** The model is about **sensing**: Modules with Sensors measure six Metrics (Temperature, Humidity, Illuminance, CO₂, VOC, PM2.5) about a **Space** or an **Asset**. It has no way to _control_ things (turn on a light, set a thermostat), no cameras, and no on/off Metrics like "door open". Those use cases are collected in [Use cases the model doesn't cover yet](#use-cases-the-model-doesnt-cover-yet).

---

## 1. Comfort and climate

Uses a Climate **Module** (Temperature and Humidity **Sensors**). The **Subject** of the Readings is the **Space**.

| ID    | Use case                                                                                                                              | Domain concepts                                  | Fit                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| CL-01 | As a resident, I want to see the current temperature in each room, so I know where it's too cold or too warm.                         | Space, Sensor, Metric (Temperature), Reading     | ✅ Ready                                                 |
| CL-02 | As a resident, I want to see the humidity in the bedroom, so I can sleep comfortably.                                                 | Space Type (Bedroom), Metric (Humidity), Reading | ✅ Ready                                                 |
| CL-03 | As a parent, I want to check the temperature in the baby's room from my phone, without walking in and waking the baby.                | Space, Reading, Connection Status                | ✅ Ready                                                 |
| CL-04 | As a resident, I want temperatures shown in °F, because that's what I'm used to.                                                      | Unit (display Unit °F), Reading stored in °C     | ✅ Ready                                                 |
| CL-05 | As a resident, I want to see if a room is in its comfort range, so I don't need to know the right numbers myself.                     | Space Type (comfort presets), Reading            | 🟡 Partly: comfort presets are mentioned but not defined |
| CL-06 | As a resident, I want to know when the bathroom stays humid for too long, so I can air it out before mould grows.                     | Metric (Humidity), Reading history               | 🟡 Partly: needs a threshold + duration rule             |
| CL-07 | As a resident, I want to see the outdoor temperature on the balcony next to the indoor one, so I can decide whether to open a window. | Space Type (Outdoor), two Spaces, Reading        | ✅ Ready                                                 |
| CL-08 | As a homeowner, I want to know if a room is losing heat at night, so I can find bad windows or insulation.                            | Reading history, Space                           | ✅ Ready                                                 |
| CL-09 | As a remote worker, I want to see the temperature in my home office during the day, so I can dress or heat accordingly.               | Space Type (Office), Reading                     | ✅ Ready                                                 |
| CL-10 | As a renter, I want a record of how cold the flat got in winter, so I can show the landlord.                                          | Reading (never changes once recorded), history   | ✅ Ready                                                 |
| CL-11 | As a pet owner, I want to check the temperature in the room where my pet stays, so it doesn't overheat while I'm out.                 | Space, Reading                                   | ✅ Ready                                                 |
| CL-12 | As a homeowner, I want a frost warning for the garage or basement, so pipes don't freeze.                                             | Space, Metric (Temperature)                      | 🟡 Partly: needs a threshold + alert                     |
| CL-13 | As a resident, I want to see the dew point, so I know where condensation will form.                                                   | Temperature + Humidity Readings                  | 🟡 Partly: a derived Metric, calculated in the app       |

## 2. Air quality

Uses an Air Quality **Module** (CO₂, VOC and PM2.5 **Sensors**).

| ID    | Use case                                                                                                                  | Domain concepts                           | Fit                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| AQ-01 | As a resident, I want to see the CO₂ level in the bedroom, so I know when to open a window for better sleep.              | Metric (CO₂), Unit (ppm), Reading         | ✅ Ready                                       |
| AQ-02 | As a remote worker, I want to know when CO₂ in my office is high, because it makes me tired and less focused.             | Space Type (Office), Metric (CO₂)         | 🟡 Partly: needs a threshold + alert           |
| AQ-03 | As an office manager, I want to see CO₂ in each meeting room, so I can find rooms that need better ventilation.           | Site, Space Type (Meeting), Reading       | ✅ Ready                                       |
| AQ-04 | As a resident, I want to see VOC levels after painting or cleaning, so I know when the room is safe again.                | Metric (VOC), Unit (ppb), Reading history | ✅ Ready                                       |
| AQ-05 | As a resident, I want to see PM2.5 in the kitchen while cooking, so I know when to turn on the cooker hood.               | Space Type (Kitchen), Metric (PM2.5)      | ✅ Ready                                       |
| AQ-06 | As a person with asthma or allergies, I want to compare indoor and outdoor PM2.5, so I know whether to keep windows shut. | Space Type (Outdoor), Metric (PM2.5)      | ✅ Ready                                       |
| AQ-07 | As a parent, I want a simple "air is good / okay / bad" label for the child's room, instead of numbers.                   | CO₂, VOC, PM2.5 Readings                  | 🟡 Partly: needs an air-quality score or bands |
| AQ-08 | As a resident, I want to know how long it takes the air to recover after I open a window, so I can air rooms efficiently. | Reading history (CO₂)                     | ✅ Ready                                       |
| AQ-09 | As a teacher or office manager, I want to see when a room had too many people for its size, by watching CO₂ rise.         | Reading history, Space                    | ✅ Ready                                       |
| AQ-10 | As a resident near a busy road, I want to see which hours have the worst outdoor air, so I air the flat at better times.  | Space Type (Outdoor), Reading history     | ✅ Ready                                       |
| AQ-11 | As a homeowner using a fireplace or wood stove, I want to watch PM2.5 indoors, so I notice smoke leaking in.              | Metric (PM2.5)                            | ✅ Ready                                       |

## 3. Light

Uses a Light **Module** (Illuminance **Sensor**, measured in lx).

| ID    | Use case                                                                                                                    | Domain concepts                                      | Fit                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| LI-01 | As a remote worker, I want to know if my desk has enough light, so I don't strain my eyes.                                  | Space Type (Office), Metric (Illuminance), Unit (lx) | ✅ Ready                                               |
| LI-02 | As a resident, I want to see how much daylight each room gets during the day, so I can decide where to put a reading chair. | Reading history, Space                               | ✅ Ready                                               |
| LI-03 | As a resident, I want to know if lights were left on in an empty room, by seeing light at night.                            | Illuminance Reading, time                            | 🟡 Partly: needs presence to be sure the room is empty |
| LI-04 | As a parent, I want to check the child's room is dark enough at bedtime.                                                    | Space Type (Bedroom), Illuminance                    | ✅ Ready                                               |
| LI-05 | As a home buyer or renter, I want to compare daylight between rooms over a week, as a record of how bright the flat is.     | Reading history, Space comparison                    | ✅ Ready                                               |
| LI-06 | As an office manager, I want to see which desk zones are too dark, so I can add lamps.                                      | Site, Space (Open-plan desk zone), Illuminance       | ✅ Ready                                               |

## 4. Plants and other Assets

An **Asset** is an object watched by Sensors that isn't connected itself. The **Subject** of the Reading is the Asset, not the room.

| ID    | Use case                                                                                                            | Domain concepts                                 | Fit                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| AS-01 | As a plant owner, I want to see how much light my office plant gets, so I know if it's in the right spot.           | Asset (Asset Type: Plant), Illuminance, Subject | ✅ Ready                                                                               |
| AS-02 | As a plant owner, I want to see the temperature and humidity around a plant, so I can keep tropical plants healthy. | Asset, Climate Module, Subject                  | ✅ Ready                                                                               |
| AS-03 | As a plant owner, I want to know when the soil is dry, so I water it on time.                                       | Asset (Plant)                                   | ❌ Missing: no soil moisture Metric                                                    |
| AS-04 | As a plant owner, I want a list of all my plants and their conditions in one place.                                 | Asset, Asset Type, Reading                      | ✅ Ready                                                                               |
| AS-05 | As a homeowner, I want to watch the temperature near the front door, so I notice draughts.                          | Asset (Asset Type: Door), Temperature           | ✅ Ready                                                                               |
| AS-06 | As a resident, I want to check whether a window is open or closed.                                                  | Asset (Asset Type: Window)                      | ❌ Missing: no open/closed Metric (see [MI-02](#use-cases-the-model-doesnt-cover-yet)) |
| AS-07 | As a homeowner, I want to know if the kitchen tap is leaking.                                                       | Asset (Asset Type: Tap)                         | ❌ Missing: no water or leak Metric                                                    |
| AS-08 | As a wine collector, I want to monitor temperature and humidity near my wine rack.                                  | Asset (Asset Type: Other), Climate Module       | ✅ Ready                                                                               |
| AS-09 | As a musician, I want to watch humidity near my guitar or piano, so the wood doesn't crack.                         | Asset, Humidity                                 | ✅ Ready                                                                               |
| AS-10 | As a pet owner, I want to monitor the temperature in a terrarium or aquarium area.                                  | Asset, Temperature                              | ✅ Ready                                                                               |

## 5. Places: Sites, Spaces and Floors

How a home or building is organised in the app.

| ID    | Use case                                                                                                    | Domain concepts                           | Fit      |
| ----- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- |
| PL-01 | As a new user, I want to create my home as a Site and add my rooms, so the app matches my real flat.        | Account, Site, Space, Space Type          | ✅ Ready |
| PL-02 | As a homeowner with a holiday house, I want to see both homes in one app and switch between them.           | Account owns several Sites                | ✅ Ready |
| PL-03 | As a resident of a two-storey house, I want rooms grouped by floor.                                         | Floor                                     | ✅ Ready |
| PL-04 | As an office manager, I want to set up an office Site with meeting rooms and desk zones that have no walls. | Site, Space (no walls needed), Space Type | ✅ Ready |
| PL-05 | As a user, I want each room to show a fitting icon, so I find rooms quickly.                                | Space Type                                | ✅ Ready |
| PL-06 | As a user, I want a home overview that shows every room with its key values at a glance.                    | Site, Space, latest Reading per Metric    | ✅ Ready |
| PL-07 | As a user, I want to see where I am (Site › Floor › Space), so I don't get lost in a big building.          | Site → Floor → Space hierarchy            | ✅ Ready |
| PL-08 | As a user, I want to move a Hub from the bedroom to the living room and have the app follow.                | Place Hub command, Hub Placed event       | ✅ Ready |
| PL-09 | As a maker, I want a "Test lab" Site for trying new Modules, separate from my real home.                    | Several Sites per Account                 | ✅ Ready |
| PL-10 | As a landlord, I want to monitor several flats I rent out, each as its own Site.                            | Account owns several Sites                | ✅ Ready |

## 6. Setting up Devices

The **Pairing Status** lifecycle: Unpaired → Pairing → Paired. Commands: **Pair Device**, **Dismiss Device**, **Place Hub**.

| ID    | Use case                                                                                                             | Domain concepts                                      | Fit      |
| ----- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------- |
| SE-01 | As a new user, I want to link my Hub to my Account with a code, so only I can see it.                                | Hub Token, Account, Device Detected                  | ✅ Ready |
| SE-02 | As a user, I want the app to tell me "New module found" after I wire a Module to the Hub.                            | Device Detected, Unpaired                            | ✅ Ready |
| SE-03 | As a user, I want to tap "Add" and watch the Module being set up, so I know it's working.                            | Pair Device, Pairing Started, Pairing, Device Paired | ✅ Ready |
| SE-04 | As a user, I want to say "Not now" to a detected Module I'm not ready to use.                                        | Dismiss Device, Device Dismissed                     | ✅ Ready |
| SE-05 | As a user, I want a clear message when pairing fails, and a way to try again.                                        | Pairing Failed, back to Unpaired                     | ✅ Ready |
| SE-06 | As a user, I want to place my new Hub in a room right after pairing it.                                              | Place Hub, Hub Placed                                | ✅ Ready |
| SE-07 | As a user, I want to rename "Climate Module" to "Kitchen climate", so names make sense to me.                        | Module Name, Module Type (unchanged)                 | ✅ Ready |
| SE-08 | As a user, I want to tell the app that my plant is watched by the Light Module, so its Readings are about the plant. | Asset, Sensor watches Asset, Subject                 | ✅ Ready |
| SE-09 | As a user, I want to remove a Module I no longer use, but keep its old Readings.                                     | Remove Device, Device Removed, lifecycle rule 8      | ✅ Ready |
| SE-10 | As a user, I want a warning before moving a Module to another Hub, because its history will be deleted.              | Lifecycle rule 9, data model rule 12                 | ✅ Ready |
| SE-11 | As a user, I want the app to explain why I can't add a Module yet (its Hub isn't paired).                            | Pair Device refused, lifecycle rule 3                | ✅ Ready |
| SE-12 | As a user, I want to set how often a Module should report before it counts as late.                                  | Expected Interval                                    | ✅ Ready |

## 7. Device health

**Connection Status** (Connecting, Connected, Stale, Disconnected) and **Fault**.

| ID    | Use case                                                                                                           | Domain concepts                                      | Fit                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------- |
| DH-01 | As a user, I want to see at a glance if all my Devices are working.                                                | Connection Status, Fault                             | ✅ Ready                            |
| DH-02 | As a user, I want to know when a value is old ("Last update 5 min ago"), so I don't trust out-of-date numbers.     | Stale, Expected Interval                             | ✅ Ready                            |
| DH-03 | As a user, I want old values hidden when a Module is disconnected, so I'm never misled.                            | Disconnected (values hidden, icon shown)             | ✅ Ready                            |
| DH-04 | As a user coming back from holiday, I want to know if the Hub lost power or Wi-Fi while I was away.                | Device Disconnected, Reconnect Started, history      | 🟡 Partly: needs a stored event log |
| DH-05 | As a user, I want to understand that all Modules went offline because the Hub did, not because each one broke.     | Lifecycle rule 4                                     | ✅ Ready                            |
| DH-06 | As a user, I want a clear message and help when a Sensor reports a failure.                                        | Fault, Fault Code (`sensor_failure`)                 | ✅ Ready                            |
| DH-07 | As a user, I want to be told when a Sensor needs recalibrating, and see the message go away after I fix it.        | Fault Raised / Fault Cleared, `calibration_required` | ✅ Ready                            |
| DH-08 | As a user, I want to see a Device that is connected _and_ faulty, so I know its values may be wrong.               | Fault independent of Connection Status               | ✅ Ready                            |
| DH-09 | As a user, I want to see "Connecting" after a power cut, so I know the app is trying, not broken.                  | Connecting, lifecycle rule 2                         | ✅ Ready                            |
| DH-10 | As a user who unplugged a Module to move a cable, I want it to come back with its history when I plug it in again. | Lifecycle rule 5                                     | ✅ Ready                            |
| DH-11 | As a user, I want a push notification when a Device goes offline.                                                  | Device Disconnected                                  | 🟡 Partly: needs notifications      |

## 8. Sharing and households

Sites can be shared with other **Accounts**, view-only.

| ID    | Use case                                                                                                       | Domain concepts                           | Fit                                            |
| ----- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| SH-01 | As a homeowner, I want to share my home with my partner, so they can see the readings too.                     | Site shared with Account (view-only)      | ✅ Ready                                       |
| SH-02 | As an adult child, I want to see the temperature in my elderly parent's flat, to check they're warm enough.    | Shared Site, Reading                      | ✅ Ready                                       |
| SH-03 | As a guest viewer, I want to see that I can't change settings, instead of hitting errors.                      | Data model rule 14 (sharing is view-only) | ✅ Ready                                       |
| SH-04 | As an owner, I want to stop sharing my home with someone.                                                      | Site shared with Account                  | 🟡 Partly: no "Stop Sharing" command named yet |
| SH-05 | As a landlord, I want to share one flat with its tenant without them seeing my other flats.                    | Sharing is per Site                       | ✅ Ready                                       |
| SH-06 | As a partner, I want to also add Modules and rename rooms, not just view.                                      | Only the owner makes changes              | ❌ Missing: no shared edit rights              |
| SH-07 | As a facility manager, I want to share an office Site with all staff so they can see meeting-room air quality. | Shared Site                               | ✅ Ready                                       |

## 9. History, trends and comparison

**Readings** never change once recorded, so they build a reliable history.

| ID    | Use case                                                                                                         | Domain concepts                      | Fit                                     |
| ----- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------- |
| HI-01 | As a user, I want a chart of the last 24 hours for one room, so I see how it changed through the day.            | Reading history, Metric              | ✅ Ready                                |
| HI-02 | As a user, I want to compare two rooms side by side, so I see which one is warmer or stuffier.                   | Readings of two Spaces               | ✅ Ready                                |
| HI-03 | As a user, I want to see last week's minimum, maximum and average, so I understand typical conditions.           | Reading history                      | ✅ Ready                                |
| HI-04 | As a user, I want to export my Readings to a spreadsheet.                                                        | Readings                             | 🟡 Partly: export is an app/API feature |
| HI-05 | As a user, I want to compare this winter with last winter.                                                       | Long Reading history                 | 🟡 Partly: data retention isn't defined |
| HI-06 | As a user, I want gaps in a chart to show when a Module was disconnected, instead of a misleading straight line. | Readings + Connection Status history | 🟡 Partly: needs a stored event log     |
| HI-07 | As an office manager, I want a weekly report of the worst rooms for CO₂.                                         | Site, Spaces, CO₂ Readings           | ✅ Ready                                |

## 10. AI and Generative UI

From the [Product overview](./product-overview.md): apps can use an LLM as a feature and build screens from a plain-language request.

| ID    | Use case                                                                                                           | Domain concepts                      | Fit                                |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------- |
| AI-01 | As a user, I want to type "show bedroom air quality" and get a screen with the right components.                   | Space, Metrics (CO₂, VOC, PM2.5)     | ✅ Ready                           |
| AI-02 | As a user, I want to ask "Why do I feel tired in the afternoon?" and get an answer based on my office CO₂ history. | Reading history, Space               | ✅ Ready                           |
| AI-03 | As a user, I want a daily summary in plain words: "The bedroom was stuffy last night; open the window before bed." | Readings, Spaces                     | ✅ Ready                           |
| AI-04 | As a user, I want to ask "Is everything working?" and hear which Devices are offline or faulty.                    | Connection Status, Fault, Fault Code | ✅ Ready                           |
| AI-05 | As a user, I want help fixing a Fault in plain steps, based on its Fault Code.                                     | Fault Code                           | ✅ Ready                           |
| AI-06 | As a user, I want the AI to suggest where to place my Hub, based on light and temperature patterns.                | Readings, Spaces                     | ✅ Ready                           |
| AI-07 | As a user, I want to ask "What's the best room to work in right now?"                                              | Latest Readings across Spaces        | ✅ Ready                           |
| AI-08 | As a designer, I want an AI tool to build a dashboard for my Site using the kit's components and data model.       | Whole model, via the MCP server      | ✅ Ready                           |
| AI-09 | As a user, I want to say "turn the heating up" and have it happen.                                                 | –                                    | ❌ Missing: no control (see MI-07) |

---

## Use cases the model doesn't cover yet

These are common smart home use cases, including the camera and window examples, that today's model can't express. Each one says what would need to be added. They are ideas for later, not decisions: the kit's scope is in the [Product overview](./product-overview.md).

| ID    | Use case                                                                                      | What's missing in the model                                                                                 |
| ----- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| MI-01 | **Camera in the kitchen or outside the home**: see a live picture or recordings.              | A video stream is not a Reading (not a single value). Needs a new Module Type and a media concept.          |
| MI-02 | **Window or door open/closed**: check if all windows are shut before leaving.                 | A two-state Metric (open/closed). The Window and Door Asset Types exist, but no Sensor can say "open".      |
| MI-03 | **Motion or presence**: know if someone is in a room, or if a room is empty.                  | A presence/motion Metric. Would also improve LI-03 (lights left on in an empty room).                       |
| MI-04 | **Water leak**: alert when water is found under the sink or washing machine.                  | A leak Metric (wet/dry) and alerts.                                                                         |
| MI-05 | **Smoke and carbon monoxide (CO)**: a safety alarm.                                           | Smoke and CO Metrics (CO is not CO₂). Safety alarms also need alerts that can't be missed.                  |
| MI-06 | **Noise level**: see how loud a room or street is.                                            | A sound level Metric (dB).                                                                                  |
| MI-07 | **Control devices**: turn lights on/off, set a thermostat, open blinds, lock a door.          | Actuators: Devices that _act_, plus commands sent to them. Today the only commands are about Device Status. |
| MI-08 | **Automations**: "If CO₂ is above 1000 ppm, turn on the fan."                                 | Rules (trigger → action). Needs thresholds and control (MI-07).                                             |
| MI-09 | **Alerts and thresholds**: "Notify me if the baby's room goes below 18 °C."                   | A Threshold concept (Metric, limit, Space or Asset) and an Alert event. Many 🟡 use cases above need this.  |
| MI-10 | **Energy use**: see how much electricity the home or a device uses.                           | Power and energy Metrics (W, kWh), usually from a smart plug or meter.                                      |
| MI-11 | **Soil moisture**: know when a plant needs water.                                             | A soil moisture Metric.                                                                                     |
| MI-12 | **Battery level**: know when a wireless Module needs new batteries.                           | Modules are wired today. Battery-powered Modules would need a battery level and a low-battery Fault Code.   |
| MI-13 | **Atmospheric pressure / weather**: see a simple forecast from pressure changes.              | A pressure Metric (hPa).                                                                                    |
| MI-14 | **Radon**: monitor radon gas in a basement.                                                   | A radon Metric (Bq/m³).                                                                                     |
| MI-15 | **Doorbell and visitors**: see who rang while you were out.                                   | An event-style input (button press) and usually a camera (MI-01).                                           |
| MI-16 | **Household roles**: let a partner add Modules and edit rooms.                                | Roles beyond owner and view-only (see SH-06).                                                               |
| MI-17 | **Away mode / vacation**: switch the home into a mode that watches for problems more closely. | A Site-level mode, plus alerts (MI-09).                                                                     |
| MI-18 | **Device history log**: "the Hub was offline from 2:00 to 4:30".                              | Stored Connection Status events with times. Today events move status but aren't kept as history.            |

## What the gaps have in common

Most of the 🟡 and ❌ use cases come down to a few missing concepts. Adding them would unlock the most use cases:

1. **Threshold and Alert**: a limit on a Metric, and an event when a Reading crosses it. Unlocks CL-06, CL-12, AQ-02, DH-11, MI-04, MI-05, MI-09 and MI-17.
2. **More Metrics**, including two-state ones (open/closed, wet/dry, present/absent). Unlocks AS-03, AS-06, AS-07, MI-02 to MI-06, MI-10, MI-11, MI-13 and MI-14.
3. **Device event history**: keeping Connection Status and Fault events with their times. Unlocks DH-04, HI-06 and MI-18.
4. **Control (actuators)**: Devices that act, not just measure. Unlocks AI-09, MI-07 and MI-08. This is the biggest change, because the model is sensing-only today.
5. **Media (video and images)**: unlocks MI-01 and MI-15. It doesn't fit the Reading model at all, so it would be a separate part of the model.
