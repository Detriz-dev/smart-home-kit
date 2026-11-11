# Roadmap

## Phase 1 — POC (proof of concept)

**Status:** done.

**Goal:** check that we can deliver every part needed to run the product, and that designers and developers can design and build smart home UIs with the kit's components.

**Scope:** only the parts and components needed to build a small, minimal app that shows Sensor Readings.

#### Deliverables

1. **Landing page** — explains the product, who it's for (product designers, creative technologists, frontend developers) and what's in the kit.
2. **Domain model** — a ready-made model of a smart home, so builders don't have to design one themselves: the Glossary (shared names such as Site, Space, Hub, Sensor and Reading), the Data model, the Device lifecycle and the Events and commands. Every other part of the kit (components, API, client) uses the same terms.
3. **Figma library** — the components in Figma, for designers who design the app.
4. **Storybook** — every component shown in its states or variants, for reviewing components.
5. **UI packages** — the design tokens (`@detriz-sh-kit/tokens`) and React components (`@detriz-sh-kit/ui`) published on npm, so others can install them and start building. ✅ First published as `0.1.0` on 2026-11-11.
6. **Developer documentation** — the docs site, explaining how to install and use the components.

## Phase 2 — MVP (minimum viable product)

**Goal:** give designers and developers the tools to build the frontend of a smart home app: map a Site, show Readings, detections and whether things are on or off, and control Devices (turn on or off, open or close, set a value, start or stop a task).

**Scope:** frontend only: UI components in React and Figma, plus the docs and Storybook that explain them. Components take their data as props, so they work with any data source. The components cover four kinds of information:

- **Readings** — measured values, such as temperature, humidity and air quality (CO₂, VOC, PM2.5).
- **On/off states** — whether something is on or off, or open or closed, such as electricity or a window.
- **Detections** — something was detected, such as motion, smoke or carbon monoxide, which raises an alert.
- **Controls** — changing a Device: turning a socket on or off, opening blinds, setting the heating to 22 °C, starting or stopping a kettle. Each Device allows only the commands it supports. See [ADR 0002](../adr/0002-devices-and-capabilities.md).

The API, the API Simulator, the client, real hardware, camera video, the MCP server and Generative UI come in later phases.

#### Deliverables

1. **Domain model v2** — adds the new concepts to the Glossary: on/off states, detections and alerts, then Devices and Capabilities (Standalone Devices, Sensors and Controls, Operational State). It is updated first, because components, props and UI copy use its terms.
2. **UI packages v2** — new and improved React components for:
   - mapping a Site: Floors, Spaces and the Devices in each Space;
   - showing Readings, on/off states and detections;
   - showing alerts when something is detected, and the Alert Rules behind them;
   - controlling Devices: on/off, open/close, picking a mode, setting a value, and starting, pausing or stopping a task, with a pending and failed state for every command;
   - the Connection Status states (Connected, Stale, Disconnected) and Fault.
3. **Figma library v2** — the same new and updated components in Figma, kept in sync with the React components.
4. **Storybook and developer documentation** — the new components in Storybook, and a docs page for each one.

## Phase 3 — to be decided

Not planned yet. Candidates moved here from earlier versions of the roadmap:

- **API design** — the contract between the data source and apps: endpoints, what a Reading, a state and a detection look like, and how live updates and alerts arrive (REST and WebSocket).
- **API Simulator** — simulated Readings, states and detections served over the API, so developers can build without hardware.
- **Client** — a typed SDK (`@detriz-sh-kit/client`) that connects an app to the API.
- **Real hardware** — Raspberry Pi Hub software that reads real Sensors and serves the same API as the simulator.
- **Camera** — a live camera view, next to motion detection.
- **MCP server and Generative UI** — so AI tools can build UIs with the kit, and apps can build screens from a plain-language request.
- **More Controls and pairing** — left out of the MVP by ADR 0002: blind Tilt, heating Cool and Auto, pairing screens (Start Search, Device Token), setup codes (QR, Matter) and account linking with manufacturers' clouds.
