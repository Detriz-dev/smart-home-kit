# Roadmap

## Phase 1 — POC (proof of concept)

**Goal:** show that designers and developers can design and build smart home UIs with the kit's components, and test whether the product idea resonates.

**Scope:** only the components needed to build a small, minimal app that shows Sensor Readings. Anything beyond that comes in later phases.

#### Deliverables

1. **Landing page** — explains the product, who it's for (product designers, creative technologists, frontend developers) and what's in the kit.
2. **Domain model** — a ready-made model of a smart home, so builders don't have to design one themselves: the Glossary (shared names such as Site, Space, Hub, Sensor and Reading), the Data model, the Device lifecycle and the Events and commands. Every other part of the kit (components, API, client) uses the same terms.
3. **Figma library** — the components in Figma, for designers who design the app.
4. **Storybook** — every component shown in its states or variants, for reviewing components.
5. **UI packages** — the design tokens (`@detriz-sh-kit/tokens`) and React components (`@detriz-sh-kit/ui`) published on npm, so others can install them and start building.
6. **Developer documentation** — the docs site, explaining how to install and use the components.

## Phase 2 — MVP (minimum viable product)

**Goal:** connect the kit to real hardware for the first time: read a real Sensor on a Raspberry Pi and show its Readings in an app built with the kit.

**Scope:** one Sensor connected to one Hub (a Raspberry Pi), an API to get its Readings, and a client that apps use to call that API. More Sensors, the API Simulator, the MCP server and Generative UI come in later phases.

#### Deliverables

1. **API design** — the contract between the Hub and apps: which endpoints exist, what a Reading looks like, and how live updates arrive (REST and WebSocket). It follows the domain model, and it is designed first because the Hub software and the client both depend on it.
2. **Raspberry Pi Hub software** — runs on the Raspberry Pi, reads the first real Sensor and serves its Readings through the API.
3. **Client** — a typed SDK (`@detriz-sh-kit/client`) that connects an app to the Hub, so developers get Readings without writing network code themselves.
4. **UI packages v2** — new and improved components needed to show live Readings from a real Sensor, including the Connection Status states (Connected, Stale, Disconnected) and Fault.
5. **Figma library v2** — the same new and updated components in Figma, kept in sync with the React components.
