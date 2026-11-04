# API Simulator in the POC — idea

Should the POC include a small API Simulator, so people can prototype with live (simulated) Readings and not only with values they type in by hand?

**Short answer:** yes, but keep it tiny and do it **after** the core POC deliverables ship. One Sensor (temperature), one endpoint, polling only. It's about 3–4 focused days of work, and it makes the kit's main promise ("every state is designed") something you can actually see working.

## Why it's worth considering

Right now a builder passes values into the components by hand:

```jsx
<ModuleCard
  connectionStatus="connected"
  sensors={[{ metric: "temperature", value: 21.5, unit: "celsius" }]}
/>
```

That shows what a screen looks like, but not how it **behaves**. Real smart home data arrives late, stops arriving, or fails. Those are exactly the states the kit's components are designed for (loading, Connected, Stale, Disconnected). With hand-typed values, nobody ever sees them happen.

A simulator gives the builder a value that changes on its own, over the network, like a real Sensor would. The prototype starts to feel real.

Note on wording: the simulator gives **realistic, simulated** data, not real data. Real data comes from a real Sensor on the Raspberry Pi in Phase 2. The copy should keep that difference clear.

## How it could work

### What the builder does

1. Start the simulator in a terminal:

   ```sh
   npx @detriz-sh-kit/api-simulator
   # Simulator running at http://localhost:4000
   ```

2. In their app, ask it for the latest temperature every few seconds and pass the result to a component.

That's it. No account, no hardware, no config.

### What's simulated

One small, fixed setup, named with Glossary terms:

- one **Hub** ("Living room Hub")
- one **Module** ("Climate Module")
- one **Sensor** that measures the **Temperature** Metric, in **°C** (the canonical Unit)

Every 5 seconds the simulator records a new **Reading**. The value moves like a real room temperature, not like a random number:

```
value = 21 °C  +  a slow wave (±1.5 °C)  +  a little noise (±0.1 °C)
```

The wave is sped up (one full cycle every ~10 minutes, not every day), so you see the value change during a demo. Values are rounded to one decimal place.

### The first API call

One endpoint, using REST:

```
GET http://localhost:4000/v0/sensors/living-room-temperature/readings/latest
```

Response:

```json
{
  "sensorId": "living-room-temperature",
  "metric": "temperature",
  "value": 21.4,
  "unit": "celsius",
  "recordedAt": "2026-11-04T10:15:03Z"
}
```

This is a Reading exactly as the Glossary defines it: Metric, value, Unit and time. The names match the component props (`metric`, `value`, `unit`), so the data goes into a component without converting anything.

`v0` in the URL says "early, may change". It gives us room to change the shape before Phase 2 without breaking a promise.

### How the app gets the states

The response doesn't include a Connection Status, because in the domain model a Reading doesn't have one: Connection Status belongs to the Device. The app works it out:

| What happens                                                       | State to show |
| ------------------------------------------------------------------ | ------------- |
| No answer yet                                                      | loading       |
| A recent Reading arrived                                           | Connected     |
| The latest Reading is older than the Expected Interval (e.g. 30 s) | Stale         |
| The request fails (simulator stopped or unreachable)               | Disconnected  |

This teaches builders the same rules the real Hub will follow, which is the point of the domain model.

A small React hook could do this in about 30 lines. In the POC it would be copy-paste code on a docs page. Later it belongs in the planned `client` and `react` packages, not in `ui` (which stays presentational and never fetches data).

### Scenarios: trigger the states on purpose

Waiting for a real failure is slow, so the simulator could take a flag to force one:

```sh
npx @detriz-sh-kit/api-simulator --scenario stale         # stops recording new Readings → app goes Stale
npx @detriz-sh-kit/api-simulator --scenario disconnected  # answers with an error → app shows Disconnected
npx @detriz-sh-kit/api-simulator --delay 2000             # answers slowly → you can see the loading state
```

This is the feature designers will like most: test every state with "live" data in a minute. It's optional for a first version, but cheap.

Fault is left out of v0. A Fault belongs to the Device, not to the Reading, so it needs a second endpoint.

### Why REST polling, not WebSocket (yet)

The product overview mentions REST and WebSocket. For the first version, polling (asking every 5 seconds) is enough. It's simpler to build, simpler to explain, and easy to debug in the browser's Network tab. WebSocket ("the server pushes each new Reading") can come later as a second way to get the same data.

### How it's built

- A new package, `kit/packages/api-simulator`, published as `@detriz-sh-kit/api-simulator` with a command (`bin`) so `npx` works.
- Node only, using its built-in `http` module. No framework needed for one endpoint.
- It must allow requests from other ports (CORS), because the builder's app runs on a different port (for example Vite on 5173).
- The Reading's TypeScript type is written once and shared. That type is the start of the planned `api-spec` package.

## How much work

Estimates assume focused days, building with AI tools, the way the rest of the kit is built.

| Task                                                                    | Effort        |
| ----------------------------------------------------------------------- | ------------- |
| Design the first endpoint and the Reading type (a short API doc)        | ½ day         |
| Set up the package in the monorepo (pnpm workspace, Turbo, `bin`)       | ½ day         |
| Build the simulator: value generator, endpoint, CORS, errors            | 1 day         |
| Scenarios (`stale`, `disconnected`, `--delay`)                          | ½ day         |
| Docs: a "Use live data" page, the copy-paste hook, update How it works  | ½–1 day       |
| Testing it from a fresh Vite app, fixing what breaks, publishing to npm | ½ day         |
| **Total**                                                               | **~3–4 days** |

Part-time, that's roughly 1–2 weeks.

Things that would make it grow (keep them out of v0): more Sensors or Metrics, history ("Readings from the last hour"), WebSocket, Faults, Pairing, letting the user configure the setup.

## Does it make sense right now?

### For

- **It shows the kit's biggest strength.** "Every state is designed" is the main value point. A simulator lets people see Stale and Disconnected happen, not just read about them.
- **It makes the landing page promise stronger.** "Start building on day one" is more convincing with data that moves.
- **It tests the POC's question better.** The POC asks whether designers and developers can build with the kit. Building with live data is a much better test than arranging static cards.
- **It's the cheap version of Phase 2's first step.** Phase 2 starts with "API design". The simulator forces us to design the first endpoint now, in a tiny, safe way. When the Raspberry Pi Hub arrives, it serves the **same** endpoint, and the builder's app keeps working.
- **It's small.** One endpoint, one Sensor.

### Against

- **It delays the POC.** The backlog still has landing page copy and style, docs copy, publishing to npm and Figma, and deploying the docs. Those are what the POC must ship.
- **It's one more package to publish and maintain.**
- **The API may change.** When the real Hub is built, we may learn the shape is wrong. The `v0` label softens this.
- **Scope creep risk.** "Just one more Sensor", "just add WebSocket"… The value is in keeping it tiny.

### Recommendation

Do it, with three limits:

1. **After** the core POC ships: packages on npm, docs deployed, landing page live. Treat it as the last POC item (or "Phase 1.5"), not as a blocker.
2. **Timebox it** to about 4 days. If it runs over, ship what works without the scenarios.
3. **Scope is fixed:** one temperature Sensor, one endpoint, polling, `v0`.

It also suggests a roadmap change worth considering: the roadmap puts the API Simulator **after** the Raspberry Pi (Phase 3+). Building it **before** makes more sense: it's easier than hardware, it defines the API the Hub must serve, and it gives builders something useful while the hardware isn't ready.

## If we do it, also update

- `docs/product-requirements/roadmap.md`: move the API Simulator (v0) into Phase 1 or a Phase 1.5.
- The docs site "How it works" page: the simulator moves from "Coming next" to "Ready".
- `docs/ideation/landing-page-copy.md`: the "Coming next" teaser.
- An ADR for the API contract decision (REST, `v0`, Reading shape).

## Open questions

- Should the response include the Reading's **Subject** (the Space it's about)? The Glossary says every Reading has one. Leaving it out keeps v0 simple, but the Hub will need it.
- What **Expected Interval** should the docs use? 30 seconds makes Stale easy to see in a demo; real Devices use minutes.
- Should the simulator also run **inside the browser** (a fake function, no server)? Easier to start, and it could power live examples on the docs site. But it wouldn't teach real network behaviour, which is half the point.
- Package name: `api-simulator` or the older `mock`? CLAUDE.md now uses "API Simulator".
