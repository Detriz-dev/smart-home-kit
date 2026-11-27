# Docs site information architecture

How the public docs site (`kit/apps/docs-site`, https://smart-home-kit.detriz.com) is organised today. What still has to be written is tracked in the [documentation implementation plan](./documentation-implementation-plan.md). How to write a component page: [component documentation workflow](./workflows/component-documentation.md).

## Who it is for

Designers and developers who build smart home apps with the kit. It documents `kit/` only. Internal notes (specs, Figma node IDs, open questions) stay in the repo and are never published.

## Top level

| Place         | URL                    | What it is                                                                |
| ------------- | ---------------------- | ------------------------------------------------------------------------- |
| Landing page  | `/`                    | `src/pages/index.tsx`. What the kit is and where to start.                |
| Get Started   | `/docs/get-started/`   | Top-bar section. Install the kit and build a first screen.                |
| Domain Model  | `/docs/domain-model/`  | Top-bar section. The smart home model every other part of the kit uses.   |
| UI Components | `/docs/ui-components/` | Top-bar section. Foundations and one page per component.                  |
| Search        | `/search`              | Algolia DocSearch: search box in the navbar (Cmd/Ctrl+K) and a full page. |
| GitHub        | external               | Icon link at the right of the navbar.                                     |

Each top-bar section has its own sidebar. The sidebars are generated from the folders (`sidebars.ts`), so the order comes from `sidebar_position` in each page and `position` in each `_category_.json`.

## Get Started

The path from "what is this?" to a working screen, in reading order:

1. Introduction
2. What you can build
3. Installation
4. Build your first screen (`quick-start.mdx`)
5. Use your router's links (`links-and-routing.mdx`)

## Domain Model

Explanation first, then reference:

1. Domain Model (overview, `index.mdx`)
2. Glossary: the Ubiquitous Language. Other pages link to its terms.
3. Data model
4. Device lifecycle
5. Events and commands

## UI Components

The Overview comes first, then Foundations, then the component categories. Within the categories, building blocks come before the components built from them (for example `ReadingValue` before `DeviceCard`), so a page can link to the pages of its parts.

| Position | Sidebar group  | Folder         | What's in it                                                                              |
| -------- | -------------- | -------------- | ----------------------------------------------------------------------------------------- |
| 1        | UI Components  | `index.mdx`    | Overview: the groups, every component in one line, how to read a component page.          |
| 2        | 0. Foundations | `foundations/` | Design tokens, Colors, Typography, Space and size, Shape, Elevation, Icons, Shared types. |
| 3        | 1. Layout      | `layout/`      | Layout components.                                                                        |
| 4        | 2. Context     | `context/`     | Context components.                                                                       |
| 5        | 3. Readings    | `readings/`    | Readings components.                                                                      |
| 6        | 4. Status      | `status/`      | Status components.                                                                        |
| 7        | 5. Feedback    | `feedback/`    | Feedback components.                                                                      |
| 8        | 6. Controls    | `controls/`    | Controls, including Device Controls.                                                      |
| 9        | 7. Navigation  | `navigation/`  | Navigation components.                                                                    |

Which component belongs to which category, and why: [components categorisation](./ds-conventions-and-structure.md#3-components-categorisation). History and Comparison get a group when their first component ships.

## Rules

- **One page per public component**, at `ui-components/<category>/<kebab-name>.mdx`. Internal helpers (such as `ControlParts`) get no page. `ListItem` is documented on the `List` page.
- **Every page in a folder shows in the sidebar.** Adding a page is enough; set its `sidebar_position`.
- **A new top-bar section** needs a folder in `docs/`, a sidebar in `sidebars.ts` and a navbar item in `docusaurus.config.ts`.
- **Renaming or moving a page changes its URL.** Search the docs for links to it, and restart the Algolia crawl after the change goes live (see "Docs site search" in `AGENTS.md`).
