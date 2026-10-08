### 1. Product Description

**DeTriz Smart Home Kit** is a plug-and-play prototyping kit that takes you from unboxed hardware to live sensor data in a working interface in minutes. You don't need wiring, soldering, firmware, or electrical engineering knowledge. The components you prototype with are the same ones you ship.

- **Snap-In Sensors, Zero Configuration:** Temperature, light, and air-quality modules click into the core hub. They are detected, calibrated, and streaming automatically, with no drivers, pin mapping, or setup screens. Modules are hot-swappable and keep stable IDs, so you can add, swap, or combine sensors mid-session without restarting the hub or changing your code.
- **Live Data in a Few Lines of Code:** Every sensor shows up immediately on REST and WebSocket endpoints. A typed TypeScript SDK (e.g. a `useSensor` hook) puts a live reading into a React component in about three lines. You never need serial protocols, polling loops, or embedded code.
- **Interactive Live Studio:** A browser dashboard that shows every connected sensor in real time. It also helps you understand the data:
    - Visual explanations of how each sensor works and what affects its readings
    - Readings shown with units, typical ranges, and plain-language meaning (e.g. "CO₂ 1,200 ppm — stuffy, ventilate soon")
    - Calibration and accuracy status, so you can trust what you see
    - Guides for combining sensors (e.g. temperature + humidity = comfort index)
- **Reliable During Tests:** Built-in connection health monitoring, automatic reconnection, and on-hub buffering keep user tests and demos running when Wi-Fi drops. If something does fail, Live Studio shows exactly which module or link failed and how to fix it. **Record & Replay** lets you capture a real sensor session and play it back on demand, for repeatable tests or demos without the hardware.
- **Production-Ready Design System:** UI components (gauges, historical charts, status tiles, alerts) come pre-bound to sensor streams, so you build a working sensor UI by composing components instead of writing them from scratch. They are props-driven, typed, and themed with design tokens (CSS variables), and they're published as a standalone package you can install directly in your production codebase. Nothing about them is prototype-only.
- **Share Results in One Click:** Turn any dashboard or recorded session into a shareable link or export, so stakeholders see the prototype working with real data and don't have to rely on screenshots.

### 2. Who It's For & Key Use Cases

DeTriz Smart Home Kit is built for **product designers, creative technologists, and frontend developers** who want to build real-world IoT experiences without learning electrical engineering.

- **Rapid UX & Concept Prototyping:** Designers can feed authentic, live environmental data into interface concepts and user tests instead of faking static states. They can iterate on sensor setups as fast as they iterate on screens.
- **Custom Interfaces & Dashboarding:** Developers can skip restrictive vendor apps and build their own smart-home hubs. They can integrate sensor feeds into custom stacks and style their own UI end-to-end, reusing the same components and API calls in production.
- **Stakeholder Reviews & Demos:** Teams can present working prototypes, either live or from recorded sessions, so decisions are based on real data and real behavior.

### 3. Desired outcomes & solutions
[user needs](/docs/customer/customer-needs-JTBD.md)

| Desired outcome | Addressed by |
| --- | --- |
| Set up sensor hardware faster | Snap-in, auto-detect, auto-calibrate |
| Get live data into a prototype faster | REST/WebSocket plus typed SDK |
| Less low-level code | `useSensor` hook, no firmware or serial work |
| Understand sensors faster | Live Studio explanations |
| Fewer misreadings of data | Units, typical ranges, plain-language meaning, calibration status |
| Fewer hardware/connection errors | Health monitoring, auto-reconnect, buffering, clear diagnostics, Replay |
| Add, swap or combine sensors faster | Hot-swap, stable IDs, combination guides |
| Build a sensor UI faster | Pre-bound design system components |
| Reuse code and components in production | Props-driven, tokenized, installable package |
| Present results faster | Share links, exports, recorded sessions |






