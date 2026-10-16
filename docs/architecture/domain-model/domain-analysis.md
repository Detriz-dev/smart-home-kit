# Domain Analysis

## Introduction

This document reviews the domain model from a **Domain-Driven Design (DDD)** point of view. It checks the [Ubiquitous Language](./ubiquitous-language.md) and [Relationships and Cardinality](./relationship-and-cardinality.md) against the DDD building blocks and lists what is missing or unclear.

It also uses the [product overview](../../product-requirements/product-overview.md) and [architecture overview](../architecture-overview.md), because a domain model has to cover what the product promises.

Proposed new terms are marked _(proposed)_. They aren't part of the Ubiquitous Language until they are added to the glossary.

## Table of contents

[DDD in one minute](#ddd-in-one-minute)

[Scorecard](#scorecard)

[Strategic design: subdomains](#strategic-design-subdomains)

[Strategic design: bounded contexts](#strategic-design-bounded-contexts)

[Context map](#context-map)

[Tactical design: entities and value objects](#tactical-design-entities-and-value-objects)

[Tactical design: aggregates review](#tactical-design-aggregates-review)

[Domain events](#domain-events)

[Domain services and policies](#domain-services-and-policies)

[Ubiquitous Language gaps](#ubiquitous-language-gaps)

[Recommended next steps](#recommended-next-steps)

## DDD in one minute

DDD has two halves. **Strategic design** splits a big problem into smaller parts and decides how they talk to each other. **Tactical design** describes what's inside each part.

| Concept | Half | Plain meaning | Smart Home Kit example |
| --- | --- | --- | --- |
| **Domain** | Strategic | The whole problem area the product solves | Getting live sensor data into prototypes |
| **Subdomain** | Strategic | One part of the problem, ranked by how much it matters to the business | Telemetry, Location, Identity |
| **Bounded Context** | Strategic | A boundary inside which every term has exactly one meaning. Usually one team, one model, one codebase area | "Device Management" |
| **Context Map** | Strategic | A drawing of the bounded contexts and how data flows between them | See [Context map](#context-map) |
| **Ubiquitous Language** | Both | The shared vocabulary, valid _inside one bounded context_ | The glossary |
| **Entity** | Tactical | Something with its own identity that lasts over time, even if its data changes | A Hub (same Hub after renaming) |
| **Value Object** | Tactical | Something defined only by its values, with no identity. Two equal ones are interchangeable | `22.4 °C` |
| **Aggregate** | Tactical | A group of entities and value objects changed together through one root, keeping its rules true | Hub with its Slots |
| **Domain Event** | Tactical | Something that happened, named in the past tense | `Device Paired` |
| **Command** | Tactical | A request to change something, which may be refused | `Pair Device` |
| **Domain Service / Policy** | Tactical | Domain logic that doesn't belong to a single entity | Deciding when a Device is Stale |
| **Invariant** | Tactical | A rule that must always be true | A Hub has exactly 4 Slots |

## Scorecard

| DDD building block | Status | Notes |
| --- | --- | --- |
| Ubiquitous Language | 🟡 Partial | Good core: location, devices, measurement, statuses. Missing terms for several product features (Record & Replay, sharing, interpretation). See [gaps](#ubiquitous-language-gaps). |
| Subdomains | 🔴 Missing | Not identified, so it's unclear which part is the core. |
| Bounded Contexts | 🔴 Missing | The glossary is one flat list. Its sections ("Where things are", "How is tracked"…) are already close to contexts. |
| Context Map | 🔴 Missing | The architecture overview describes Pi → API → client data flow but not domain boundaries. |
| Entities | 🟡 Partial | Exist in the glossary, but **identity** (what ID each one has) isn't defined. |
| Value Objects | 🔴 Missing | Not named. Reading value, Unit and timestamps are mixed into entities. |
| Aggregates | 🟡 Partial | Drafted in the relationships doc. The Hub aggregate needs revising (see [review](#tactical-design-aggregates-review)). |
| Invariants | 🟢 Good | 10 rules listed. A few more are needed for Connection Status and late Readings. |
| Domain Events | 🔴 Missing | Status values exist, but not the events that change them. |
| Commands | 🔴 Missing | User actions (pair, place, rename) aren't modelled. |
| Domain Services / Policies | 🔴 Missing | Staleness, Subject resolution and Unit conversion need homes. |

## Strategic design: subdomains

Subdomains are ranked by how much they make the product different from others:

- **Core:** what makes the product worth buying. Build it yourself and spend most effort here.
- **Supporting:** needed and specific to the product, but not the reason people buy it.
- **Generic:** every product has this. Use a ready-made solution where possible.

| Subdomain | Type | Why | Product promise it serves |
| --- | --- | --- | --- |
| **Device Management** | Core | Snap-in, auto-detect, zero-config pairing and hot-swap are the main selling point | "Snap-In Sensors, Zero Configuration" |
| **Telemetry** | Core | Live and historical Readings through REST, WebSocket and `useSensor` | "Live Data in a Few Lines of Code" |
| **Insight** _(proposed)_ | Core | Turning numbers into meaning: typical ranges, "stuffy, ventilate soon", comfort index | "Fewer misreadings of data" |
| **Record & Replay** _(proposed)_ | Core | Repeatable demos and tests without hardware | "Reliable During Tests" |
| **Location** | Supporting | Sites, Spaces and Assets give Readings context, but aren't the differentiator | Organising Hubs and Assets |
| **Sharing** _(proposed)_ | Supporting | Share links and exports of dashboards and Recordings | "Share Results in One Click" |
| **Identity and Access** | Generic | Accounts, sign-in, Hub tokens | Ingest API security |

The **design system** (`kit/packages/ui`) isn't a subdomain. It is a presentation layer that displays the domain. It must use the domain terms, but it has no domain rules of its own.

## Strategic design: bounded contexts

A **bounded context** is a boundary where each term has exactly one meaning. The same word can mean different things in two contexts, and that's fine as long as the boundary is clear.

For a project this size, contexts are **folders and modules inside one backend**, not separate services. The point is to keep the models apart, not to deploy them apart.

| Bounded Context | Owns these terms | Main question it answers |
| --- | --- | --- |
| **Identity and Access** | Account, Hub Token _(proposed)_ | Who is this, and what may they do? |
| **Location** | Site, Floor, Space, Space Type, Asset, Asset Type | Where is everything? |
| **Device Management** | Device, Device Kind, Hub, Module, Module Type, Slot, Sensor, Pairing Status, Connection Status, Fault, Fault Code | What hardware is there, and is it healthy? |
| **Telemetry** | Reading, Metric, Unit, Subject, Latest Reading _(proposed)_, Reading History _(proposed)_ | What was measured, and when? |
| **Insight** _(proposed)_ | Typical Range, Threshold, Interpretation, Derived Metric, Alert _(all proposed)_ | What does this value mean for a person? |
| **Record & Replay** _(proposed)_ | Recording, Replay _(proposed)_ | How do I capture and play back a session of Readings? |
| **Sharing** _(proposed)_ | Share Link, Export _(proposed)_ | How do I show results to someone else? |

### Words that mean different things in different contexts

These are the most likely sources of confusion. Each needs a decision about which context owns the term.

| Word | In one context | In another context | Suggestion |
| --- | --- | --- | --- |
| **Sensor** | Device Management: a physical part inside a Module, with a Metric fixed by Module Type | Telemetry: just "the source of a Reading", an ID | Device Management owns it. Telemetry only stores its ID. |
| **Stale** | Device Management: a Connection Status value | Telemetry: "no Reading arrived within the expected interval", which is a fact about Readings | Telemetry detects it, Device Management shows it. Define the **expected interval** (see [policies](#domain-services-and-policies)). |
| **Session** | Product overview: "recorded session" | Identity: a sign-in session | Avoid "Session" in the domain. Use **Recording**. |
| **Alert** | Design system: a UI component (`Alert`) | Insight: a domain event "Threshold crossed" | Keep both, but the glossary should define the domain meaning. |
| **Calibration** | Device Management: Fault Code `calibration_required` | Product overview: "calibration and accuracy status" shown to users | Decide whether **Calibration Status** is a fourth Device Status field or only a Fault. |
| **Hub** | Device Management: a Device in a Space | Architecture: the Raspberry Pi software (`platform/hub`) and the ingest API "hub token" | Fine, but the Pi software is the **Hub agent**, not the Hub. |

## Context map

How the bounded contexts connect (the map diagram, relationship patterns, events between contexts and where each context lives in code) is described in [Context Map](./context-map.md).

## Tactical design: entities and value objects

### Entities need a defined identity

An entity is "the same thing over time", so the glossary should say **what identifies it**. This matters most for the SDK: `useSensor(id)` needs a stable Sensor ID, and the product overview promises that "Modules keep stable IDs" when hot-swapped.

| Entity | Proposed identity | Why |
| --- | --- | --- |
| **Site, Floor, Space, Asset** | Generated ID (UUID) | Created by the user. The name can change. |
| **Hub** | Hardware serial number _(proposed term: Device ID)_ | Must survive renaming and moving to another Space. |
| **Module** | Hardware serial number | Must survive hot-swapping to another Slot or Hub. |
| **Slot** | Hub ID + Slot Number (1 to 4) | Has no meaning without its Hub. |
| **Sensor** | Module ID + Metric | A Module has at most one Sensor per Metric, so this pair is unique and stable when the Module moves. |
| **Reading** | Sensor ID + Recorded At _(proposed)_ | One Sensor can't record two values at the same moment. |

### Value objects are not named yet

Value objects have no identity: two equal ones are the same. They make types safer (you can't add °C to %RH by mistake).

| Value Object _(proposed)_ | Made of | Used by |
| --- | --- | --- |
| **Measurement** | value + Unit | Reading, Threshold, Typical Range |
| **Recorded At** | timestamp of when the Sensor measured | Reading |
| **Received At** | timestamp of when the API stored it | Reading (needed because the Hub buffers Readings during Wi-Fi drops) |
| **Slot Number** | integer 1 to 4 | Slot |
| **Device ID** | hardware serial | Hub, Module |
| **Typical Range** | lower and upper Measurement | Insight |
| **Fault** | Fault Code + time raised + optional details | Device |

**Metric, Unit, Space Type, Asset Type, Module Type, Device Kind and Fault Code** are **reference data**: fixed lists, usually modelled as enums or value objects, not entities.

## Tactical design: aggregates review

The relationships doc proposes three aggregates: Site, Hub and Reading. Two of them need changes.

### Problem 1: Modules shouldn't live inside the Hub aggregate

The product promises **hot-swappable Modules with stable IDs**. If a Module is inside the Hub aggregate, moving it to another Hub means deleting it from one aggregate and creating it in another, which loses its identity and history.

Also, every Device has its **own** Pairing Status, Connection Status and Fault. A thing with its own lifecycle is usually its own aggregate root.

**Proposal:** make each Device its own aggregate.

| Aggregate | Root | Contains | Points to (by ID) | Rules it protects |
| --- | --- | --- | --- | --- |
| **Hub** | Hub | Slots (which Module ID sits where), Device Status | Space | Exactly 4 Slots. One Module per Slot. A Hub gets a Space only when Paired. |
| **Module** | Module | Sensors, Device Status | Module Type, Hub + Slot Number | Sensors match the Module Type. One Sensor per Metric. |
| **Site** | Site | Floors, Spaces | Account | Floors and Spaces belong to the same Site. |
| **Asset** | Asset | (none) | Space, Asset Type | Exactly one Space. |
| **Reading** | Reading | (none) | Sensor, Metric, Subject | Never changes. |

### Problem 2: one rule crosses aggregates

Invariant 4 in the relationships doc says "a Sensor can only watch an Asset in its own Space". The Sensor is in the Module aggregate, the Asset is in the Asset aggregate and the Space comes from the Hub, so no single aggregate can check this alone.

**Proposal:** check it in a domain service when the Sensor is linked to the Asset. When a Hub moves to another Space, a policy unlinks its Sensors from Assets in the old Space (or asks the user what to do).

### Problem 3: Assets were inside the Site aggregate

If Assets live inside Site, adding a tap means loading and locking the whole Site. Assets are referenced from Sensors, so they work better as a small aggregate of their own (above).

## Domain events

The glossary defines **statuses** (where something is now) but not **events** (what happened to get there). Events are what the hub agent, the API and the WebSocket stream actually send, so they should be named in the Ubiquitous Language too. All of these are _(proposed)_.

The full event catalogue (per bounded context, with payloads, consumers, commands and a flow diagram) is in [Domain Events](./domain-events.md). How events move a single Device between statuses is in [Device Lifecycle](./device-lifecycle.md).

## Domain services and policies

Logic that doesn't belong to a single entity needs a named home.

| Service or policy _(proposed name)_ | Context | What it decides | Open question |
| --- | --- | --- | --- |
| **Staleness Policy** | Telemetry | When a Device becomes Stale | What is the **expected interval**? Per Metric, per Module Type, or one global value? |
| **Subject Resolution** | Telemetry | Which Subject (Space or Asset) a Reading is about | Is the Subject frozen when the Reading is recorded, or worked out at query time? If a Sensor is later linked to an Asset, do old Readings change Subject? (Frozen fits "a Reading never changes".) |
| **Unit Conversion** | Telemetry | Converting canonical Units to display Units | Who chooses the display Unit: the Account, the Site, or the viewer? |
| **Module Connection Rule** | Device Management | A Module's Connection Status when its Hub is Disconnected | Missing invariant: if the Hub is Disconnected, all its Modules should be Disconnected too. |
| **Late Reading Policy** | Telemetry | What to do with Readings buffered on the Hub and sent late | Do late Readings change a Device from Stale back to Connected? They should use Recorded At for history and Received At for staleness. |
| **Interpretation** | Insight | Turning a value into a plain-language label ("stuffy, ventilate soon") | Which inputs: Metric only, or also Space Type and Asset Type? |

## Ubiquitous Language gaps

### Terms used in the glossary but not defined

| Term | Where it appears | Suggestion |
| --- | --- | --- |
| **Account** / **user** | "one user can have several Sites", "registered to the account" | Define **Account**. Decide whether a Site can have several members later. |
| **Threshold** | Asset Type: "default Metrics and Thresholds" | Define it in the Insight context: a Measurement limit that triggers an Alert. |
| **Comfort preset** | Space Type: "comfort presets" | Define it, or replace it with Typical Range per Space Type. |
| **Expected interval** | Stale: "within the expected interval" | Define it (see Staleness Policy). |
| **Device Status** | Heading and Device definition | Add a row: "the three fields Pairing Status, Connection Status and Fault together". |

### Product features with no domain terms yet

| Product promise | Missing terms _(proposed)_ |
| --- | --- |
| Record & Replay | Recording, Replay |
| Share in one click | Share Link, Export |
| Typical ranges and plain-language meaning | Typical Range, Interpretation |
| Comfort index from temperature + humidity | Derived Metric |
| Status tiles and alerts | Alert, Threshold |
| Calibration and accuracy status | Calibration Status (or decide it's only a Fault) |
| On-hub buffering when Wi-Fi drops | Recorded At, Received At |
| Hot-swap with stable IDs | Device ID, Module Inserted, Module Ejected |
| History charts | Reading History, Latest Reading, Aggregation Interval |
| Ingest API security | Hub Token |

### Consistency issues in the current glossary

- **Space definition conflicts with the cardinality.** "A named area inside a Site where a Hub is placed" suggests every Space has a Hub, but the model allows zero Hubs (for example, a new Space set up before the Hub arrives). Suggested wording: "A named area inside a Site. Hubs and Assets are placed in Spaces."
- **Connected overlaps with Stale.** Connected says "reachable and sending Readings". Stale says "Connected, but no Reading arrived". So is Stale a kind of Connected or a separate value? Suggested wording for Connected: "Reachable, and Readings arrive within the expected interval."
- **Pairing "happens once per Device".** That isn't true after Device Removed or a factory reset. Suggested wording: "Happens once each time the Device joins an account."
- **Subject sits in the wrong section.** It's about Readings, so it belongs under "What is tracked".
- **Table of contents links are swapped.** "What is tracked" links to `#how-is-tracked` and the other way round. The trailing `-` in the anchors breaks the links too.
- **Heading levels.** "What are things statuses" uses `#` (a top-level heading) while the other sections use `##`.
- **Section names.** "How is tracked" is about _what does the measuring_ (Devices). Consider "What measures" / "What is measured", or name the sections after the bounded contexts: Location, Device Management, Telemetry.

## Recommended next steps

In order, smallest and most useful first:

1. **Fix the glossary consistency issues** above. Quick wins, no design decisions needed.
2. **Define identity** for Hub, Module and Sensor (Device ID, Sensor = Module ID + Metric). The SDK's `useSensor(id)` depends on it, so it should come before `api-spec`.
3. **Decide the Hub vs Module aggregate split** and update the [Aggregates section](./relationship-and-cardinality.md#aggregates) of the relationships doc. Record it as an ADR (`docs/adr/0001-device-aggregates.md`), because it changes the API shape.
4. **Group the glossary by bounded context** (Identity and Access, Location, Device Management, Telemetry) and add the proposed terms the POC needs: Recorded At, Received At, expected interval, Device ID.
5. **Add domain events** to the glossary, starting with Device lifecycle and Reading Recorded, since these become the WebSocket messages.
6. **Leave Insight, Record & Replay and Sharing as placeholders** until they are on the roadmap. Name the contexts now so the terms don't leak into Telemetry by accident.
