# Product overview

**DeTriz Smart Home Kit** is a plug-and-play prototyping kit for building smart home UI apps quickly. It uses AI in two ways: to help you build the UI, and as a feature inside the app you build.

## What's in the kit

1. **Smart home domain model:** the smart home domain is already mapped for you: the names ([Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx)), how things relate ([Data model](/kit/apps/docs-site/docs/domain-model/data-model.mdx)) and how Devices change status ([Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx)). The components, API and SDK all use it, so you can start building screens straight away instead of designing the model yourself.
2. **UI components (Figma):** a Figma library for designing smart home screens.
3. **UI components (React):** the same components in code. They are typed, take props and are themed with design tokens. You install them from npm and can use them in production.
4. **API Simulator:** realistic simulated Sensor Readings over REST and WebSocket, so you can build without any hardware.
5. **Raspberry Pi client:** software that runs on a Raspberry Pi (the Hub), reads real Sensors and serves the same API as the simulator. A typed SDK connects your app to it, so you can switch from simulated to real data without rewriting your app.
6. **MCP server and Generative UI:**
   - The MCP server gives AI tools (Claude Code, Cursor, Figma) the kit's components, tokens and API, so they can build smart home UIs with them.
   - Generative UI lets an app build screens at runtime from the kit's components, based on a plain-language request (e.g. "show bedroom air quality").

## Who it's for

Product designers, creative technologists and frontend developers who want to build smart home UIs without learning electronics or firmware.

## How it's built

The kit is built with AI coding tools, guided by context files, conventions and code review. See the [learning goals](/docs/learning/learning-goals.md).

User needs: [customer needs (JTBD)](/docs/customer/customer-needs-JTBD.md)
