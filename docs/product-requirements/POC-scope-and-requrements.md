# POC: scope and requirements

The POC is the first milestone in the [roadmap](roadmap.md) (Phase 1). It is a **walking skeleton**: one Sensor, one Reading, all the way from the Hub to a public web page. Every layer can be rough. What matters is that the whole path works and is deployed.

Terms such as Hub, Module, Sensor, Reading and Connection Status follow the [Ubiquitous Language](../architecture/domain-model/ubiquitous-language.md).

## Goal

Prove that a live temperature Reading can travel from a snap-in Module to a web page with zero wiring, and test whether the product idea resonates with product designers, creative technologists and frontend developers.

The POC answers two questions:

1. **Can we build it?** Does the path Raspberry Pi Hub → hosted API → browser work reliably enough for a demo?
2. **Do people want it?** Does the landing page explain the idea clearly, and do people from the target group find it useful?

## Scope

### In scope

| Area | What the POC includes |
| --- | --- |
| Hardware | One Hub (Raspberry Pi) with one temperature Sensor over I2C, in one Space. |
| Hub software | One driver and an agent that detects the Module and pushes Readings to the API every few seconds. A `--fake-sensors` mode for working without the Pi. |
| API contract | `openapi.yaml` with temperature endpoints only: list Sensors, latest Reading, Reading history and hub ingest. |
| Backend | FastAPI that implements the spec, stores Readings in SQLite and is deployed to a public URL. |
| Data in the browser | A `useSensor` hook that polls the latest Reading every few seconds (no WebSocket yet). |
| UI components | Only the components the POC needs (for example a temperature display and a status indicator). |
| Storybook | Every POC component documented in its states, published at a public URL. |
| Studio | One page with a live temperature view. |
| Landing page | One page that explains the product, who it's for and the two key use cases. |

### Out of scope (later phases)

- Light and air quality Modules, and more than one Module per Hub.
- WebSocket streaming, a separate `client` package and `mock` package.
- Record & Replay, share links and exports.
- Sensor explanations, typical ranges, calibration status and combination guides in Studio.
- Pairing flow, user accounts, several Sites or Spaces.
- The full Live Studio dashboard and the API documentation site.
- Publishing packages to npm and splitting the repo.

## Requirements

### Functional

1. **Temperature Sensor connected.** When the Module is snapped into the Hub, it is detected and starts sending Readings without manual setup.
2. **Readings reach the API.** The agent sends batches of Readings (`POST /hubs/{hubId}/readings`) using a per-hub token. If the network drops, the agent keeps Readings in a local buffer and sends them when it reconnects.
3. **Readings can be read.** The public, read-only API returns the list of Sensors, the latest Reading and the Reading history for a time range.
4. **Live temperature view.** Studio shows the current temperature with its Unit (°C) and the time of the last Reading, and updates without a page reload.
5. **Connection Status is visible.** The view shows Connected, Stale (no Reading within the expected interval) or Disconnected (last value stays visible but dimmed), plus a loading state and a Fault state.
6. **Landing page.** Explains the product idea, the target group (product designers, creative technologists, frontend developers) and the two key use cases: rapid UX prototyping and custom dashboards.
7. **Storybook.** Every component used in the POC has a story for each state: loading, Connected, Stale, Disconnected and Fault.

### Non-functional

- **Latency:** a temperature change at the Hub shows up on the public Studio page within a few seconds (polling interval plus network time).
- **Contract first:** the OpenAPI file is the single source of truth. The API is checked against it with contract tests (Schemathesis).
- **Security:** visitors only talk to the hosted API, never to the home network. The ingest API needs the hub token; the read API is read-only.
- **Always demoable:** Studio, Storybook and the landing page have public URLs, and `main` is always deployed.
- **Code quality:** follows the repo conventions (components only use `--shk-` tokens, typed props, domain terms in code and copy). `pnpm install && pnpm build` works from a clean clone.

## Definition of done

The POC is done when:

- a temperature change at the Pi shows up on the public Studio URL within a few seconds,
- the OpenAPI file describes every endpoint the POC uses and the API passes its contract tests,
- Storybook is public and shows every POC component in all its states,
- the landing page is live, and
- a few people from the target group have seen the demo and their feedback is written down.


