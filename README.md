# DeTriz Smart Home Kit

A software kit for building smart home UI apps quickly, with AI built in: AI tools help you build the UI, and your app can use an LLM as a feature.

> **This is a learning project.** I'm a product designer learning to build AI applications end to end, from idea to release. Success is measured by what I learn, not by users or revenue. Read the [learning goal and objectives](docs/learning/learning-goal-and-objectives.md).

## Explore the kit

- **[Documentation](https://smart-home-kit.detriz.com):** how to install and use the kit, the smart home domain model and every UI component, with live examples.
- **[Figma library](https://www.figma.com/community/file/1700179982740576850/detriz-smart-home-kit):** the same components for designing smart home screens.

## The product

- **[Product overview](docs/product-requirements/product-overview.md):** what the kit is, what's in it and who it's for.
- **[Roadmap](docs/product-requirements/roadmap.md):** what gets built in each phase.

## Working on this project

- **[Project architecture](docs/architecture/project-architecture.md):** how the repo is organised, what's built and what's planned.
- **[Tech stack](docs/architecture/tech-stack.md):** every technology the project uses, layer by layer.
- **[Component building workflow](docs/architecture/design-system/workflows/component-building.md):** how a new component goes from idea to merged PR.
- **[Component documentation workflow](docs/architecture/design-system/workflows/component-documentation.md):** how to write a component page for the docs site.
- **[AGENTS.md](AGENTS.md):** commands, conventions and rules for people and AI coding tools.

### Run it locally

You need Node 22 or later and pnpm (`corepack enable`).

```sh
pnpm install
pnpm storybook   # component workbench on http://localhost:6007
pnpm docs-site   # docs site on http://localhost:3000
```
