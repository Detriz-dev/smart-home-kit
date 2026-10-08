# Roadmap

## Phase 1 — POC (proof of concept)

Goal: prove that a live temperature reading can travel from a snap-in sensor to a web page with zero wiring, and test whether the product idea resonates.

### Deliverables

1. **Landing page** — explains the product idea, who it's for (product designers, creative technologists, frontend developers) and the two key use cases: rapid UX prototyping and custom dashboards.
2. **Temperature sensor connected** — one module snaps into the hub, auto-configures and streams readings.
3. **Live temperature view** — at least one component on the page showing the current reading, updating in real time.
4. **API as an OpenAPI file** — specification of the temperature endpoints (e.g. list sensors, latest reading, reading history), usable for mocks and client generation.
5. **Storybook** — every UI component used in the POC documented in its states (loading, live, offline, error), built on an existing third-party component library rather than a custom one.

## Phase 2 — MVP (minimum viable product)

Goal: deliver a usable kit with three sensors and DeTriz's own design system, so designers and developers can build real prototypes on it.

### Deliverables

1. **Three sensors** — temperature, light and air quality, all snap-in and auto-configured.
2. **Extended API** — OpenAPI file updated for all three sensors, plus real-time streaming over WebSocket.
3. **Live Studio** — dashboard showing all three sensors live.
4. **Own design system** — tokens (color, spacing, typography), core components (gauges, historical charts, status tiles) pre-bound to sensor data, exported from
5. **Design system documentation** — usage guidelines, component states and code examples for every component.