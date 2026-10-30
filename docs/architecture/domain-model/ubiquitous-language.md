# Ubiquitous Language

## Introduction
This document defines the shared language of DeTriz Smart Home KIT. Each concept has exactly one name, and that name is used everywhere: in product specs, UI copy, the API, TypeScript types and design-system components

## Table of contnet

[Introduction](#introduction)

[Where things are](#where-things-are-)

[What is tracked](#how-is-tracked)

[How is tracked](#what-is-tracked-)

[What are things statuses](#what-are-things-statuses-)


## Where things are

| Term           | Definition | Example |
|----------------| --- | --- |
| **Site**       | A physical property the user monitors. The top of the location hierarchy; one user can have several Sites. | "My flat", "Warsaw office", "Test lab" |
| **Space**      | A named area inside a Site where a Hub is placed. It does not need walls. | Living room, Meeting room A, Open-plan desk zone, Balcony |
| **Space Type** | A category of Space, used for icons, defaults and comfort presets. | Bedroom, Kitchen, Office, Meeting, Outdoor, Other |
| **Floor**      | A grouping of Spaces within a Site, added only when Sites grow large. | Ground floor, Level 3 |


## How is tracked
**Device** is the umbrella term for every piece of connected hardware in the system: anything that can be paired, connects to the network and reports its own status. Today there are two kinds: the Hub and the Module. A Sensor is not a Device; it is a measuring element inside a Module and has no status of its own. Non-connected objects that Sensors watch, such as a tap or a door, are Assets, not Devices.

| Term | Definition | Example |
| --- | --- | --- |
| **Device** | Any trackable hardware with its own identity and Device Status. The shared parent of Hub and Module. | A Hub, a Module |
| **Device Kind** | Which sort of Device it is. | Hub, Module |
| **Hub** | The core unit that powers Modules, connects to the network and is placed in a Space. | The DeTriz Hub on the kitchen shelf |
| **Module** | A snap-in hardware piece attached to a Hub. It belongs to the Hub's Space. | Climate Module, Light Module, Air Quality Module |
| **Module Type** | The product model of a Module. It decides which Sensors the Module contains. | Climate, Light, Air Quality |
| **Module Name** | The name shown for one Module. Starts as its Module Type name, and the user can rename it at any time. Renaming never changes the Module Type. | "Climate Module", renamed to "Kitchen climate" |
| **Slot** | The physical position on a Hub where a Module snaps in. | Slot 1 to Slot 4 |
| **Sensor** | One measuring element inside a Module. It produces Readings for exactly one Metric. | The CO₂ sensor inside the Air Quality Module |

An **Asset** is a physical object in a Space that a Sensor watches but that isn't connected itself. It has no Device Status: a tap can't be paired, disconnected or faulty. Devices do the measuring; Assets are what some measurements are about.

| Term | Definition | Example |
| --- | --- | --- |
| **Asset** | A non-connected physical object in a Space that one or more Sensors monitor. | Kitchen tap, front door, office plant |
| **Asset Type** | A category of Asset, used for icons, default Metrics and Thresholds. | Tap, Door, Window, Plant |
| **Subject** | What a Reading is about: either a Space (room air) or an Asset in that Space (the tap). | Humidity → Bedroom; water flow → Kitchen tap |


## What is tracked
| Term | Definition | Example |
| --- | --- | --- |
| **Metric** | *What* is measured: a kind of physical quantity, from a fixed list. | Temperature, Humidity, Illuminance, CO₂, VOC, PM2.5 |
| **Unit** | How a Metric's value is expressed. Each Metric has one canonical Unit in the API; display Units are a formatting choice. | °C, °F (display Unit), %RH, lx, ppm |
| **Reading** | One timestamped value from one Sensor: Metric, value, Unit and time. Never changes once recorded. | 22.4 °C in the Kitchen at 10:15:03 |


# What are things statuses

### Device Status

A Device's status is three separate fields, each answering one question. Keeping them apart means a Device can be connected *and* faulty at the same time, and an unpaired Device can never carry a connection status.

| Field | Question it answers | Values |
| --- | --- | --- |
| **Pairing Status** | Is this Device registered to the account? | Unpaired, Pairing, Paired |
| **Connection Status** | Can we reach it right now? (Paired Devices only) | Connecting, Connected, Stale, Disconnected |
| **Fault** | Is the hardware healthy? | None, or a specific Fault |

### Pairing Status

| Term | Definition | Example |
| --- | --- | --- |
| **Unpaired** | The Hub has detected the Device, but the user hasn't confirmed adding it to the account yet. | A Climate Module is snapped into the Hub and appears as "New module found" |
| **Pairing** | First-time setup is running: the Device is joining the account and auto-configuring. Happens once per Device. | The user taps "Add" and the Module configures itself |
| **Paired** | The Device belongs to the account. Only now does it have a Connection Status. | The Climate Module shows up in the Kitchen Space |

### Connection Status

| Term | Definition | Example |
| --- | --- | --- |
| **Connecting** | A paired Device is (re)establishing its connection. Happens after every power-up, restart or dropped link. | The Hub boots after a power cut and reconnects its Modules |
| **Connected** | The Device is reachable and sending Readings. | The Kitchen Hub streams temperature every few seconds |
| **Stale** | Connected, but no Reading arrived within the expected interval. | "Last update 5 min ago" on the Light Module |
| **Disconnected** | The Device can't be reached, or the user turned it Off. Its last known values are hidden: a disconnected icon shows in their place. | The Hub was unplugged from the wall |

### On / Off

| Term | Definition | Example |
| --- | --- | --- |
| **On** | The user wants this Module to run. The default. | A Climate Module sending Readings |
| **Off** | The user turned this Module off. It stays in its Slot and stays Paired, but sends no Readings. It is a setting, not a status: an Off Module's Connection Status is Disconnected. | The Light Module is turned off in Live Studio, and shows as Disconnected with its switch Off |

### Fault

| Term | Definition | Example |
| --- | --- | --- |
| **Fault** | A hardware problem the Device reports about itself. Independent of connection: a Device can be Connected and have a Fault. | CO₂ sensor failure, calibration issue |
| **Fault Code** | A stable identifier for the kind of Fault, so the UI can show the right message and help. | `sensor_failure`, `calibration_required` |
 
