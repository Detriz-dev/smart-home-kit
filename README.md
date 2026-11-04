# DeTriz Smart Home Kit

A software kit for building smart home UI apps quickly, with AI built in: AI tools help you build the UI, and your app can use an LLM as a feature.

## Why this exists

I'm a UX designer, and I wanted to go beyond the handoff. This project follows one product idea all the way from concept, through design and development, to a real release. I build every part myself and use AI tools at every stage.

It's a **learning project**, not a startup. Success is measured by what I learn, not by users or revenue.

## What's in the kit

| Part                             | What it does                                                                                                    | Status         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------- |
| **Figma library**                | UI components for designers                                                                                     | 🛠️ In progress |
| **React components**             | The same components in code, built from shared design tokens                                                    | 🛠️ In progress |
| **Smart home domain model**      | A ready-made Glossary, Data model, Device lifecycle and Events, so you don't design the model yourself          | 🛠️ In progress |
| **API Simulator**                | Simulated Sensor Readings over REST and WebSocket, so you can build without hardware                            | 🔜 Planned     |
| **Raspberry Pi client**          | Runs on a Raspberry Pi (the Hub), reads real Sensors and serves the same API as the simulator, plus a typed SDK | 🔜 Planned     |
| **MCP server and Generative UI** | Lets AI tools build UIs with the kit, and lets apps build screens from a plain-language request                 | 🔜 Planned     |

## Take a look

- **Docs site:** _link coming soon_ (Get Started, Domain Model and UI Components)
- **Glossary:** [the shared language of the kit](kit/apps/docs-site/docs/domain-model/glossary.mdx)
- **Components:** [`kit/packages/ui`](kit/packages/ui/src/components)

## What I'm learning

| Area                     | Tools and methods                                                                       | Status   |
| ------------------------ | --------------------------------------------------------------------------------------- | -------- |
| Product specification    | PRD, user stories, acceptance criteria, story mapping, MoSCoW                           | ✅       |
| Domain modelling         | Domain-Driven Design                                                                    | ✅       |
| Design system            | Figma, design tokens, Storybook, npm packaging                                          | 🛠️       |
| Product documentation    | Diátaxis, Docusaurus                                                                    | 🛠️       |
| AI-assisted development  | Context files, skills, MCP (Figma, Claude Code), prompting, reviewing AI-generated code | 🛠️       |
| Frontend development     | HTML, CSS, React, TypeScript, data visualization                                        | 🛠️       |
| Continuous delivery      | Git, conventional commits, GitHub Actions, semantic versioning                          | 🛠️       |
| Backend and API design   | FastAPI (Python), REST, WebSocket, OpenAPI, time-series storage                         | 🔜       |
| AI engineering           | LLM APIs, tool calling, MCP servers, generative UI, structured output, evals            | 🔜       |
| Electronics and hardware | Raspberry Pi, I2C/GPIO sensors, sensor physics                                          | 🔜       |
| 3D design and printing   | Enclosures for the hardware                                                             | 💡 Later |

✅ done · 🛠️ in progress · 🔜 next · 💡 maybe later

## How I use AI

I use AI in two phases, so I can compare them:

1. **AI as a teacher.** AI explains, teaches and reviews, but I write the code myself and make sure I understand it.
2. **AI as a builder.** AI agents do most of the building, and I compare the speed, the quality and how well I still understand the result.

## Run it locally

You need Node 22 or later and pnpm (`corepack enable`).

```sh
pnpm install
pnpm storybook   # component workbench on http://localhost:6007
pnpm docs-site   # docs site on http://localhost:3000
```

## Repo structure

```
kit/
  packages/tokens   design tokens (DTCG JSON → CSS variables)
  packages/ui       React components
  apps/storybook    component workbench
  apps/docs-site    public documentation (Docusaurus)
```
