# A Philosophy of Software Design, applied to this project

_A Philosophy of Software Design_ (John Ousterhout, 2nd edition, 2021) is a short book with one big idea: **the main job of software design is to fight complexity.** Every concept in the book is a tool for that fight.

This page explains each concept in plain words, then shows where it already appears in DeTriz Smart Home Kit and where it could go wrong. Examples point to real files, so you can open them side by side.

## Table of contents

- [1. What complexity is](#1-what-complexity-is)
- [2. Strategic vs tactical programming](#2-strategic-vs-tactical-programming)
- [3. Deep modules](#3-deep-modules)
- [4. Information hiding (and leakage)](#4-information-hiding-and-leakage)
- [5. Different layer, different abstraction](#5-different-layer-different-abstraction)
- [6. Pull complexity downwards](#6-pull-complexity-downwards)
- [7. Somewhat general-purpose modules](#7-somewhat-general-purpose-modules)
- [8. Better together or better apart?](#8-better-together-or-better-apart)
- [9. Define errors out of existence](#9-define-errors-out-of-existence)
- [10. Design it twice](#10-design-it-twice)
- [11. Comments](#11-comments)
- [12. Choosing names](#12-choosing-names)
- [13. Consistency](#13-consistency)
- [14. Code should be obvious](#14-code-should-be-obvious)
- [Red flags checklist](#red-flags-checklist)
- [What to fix now](#what-to-fix-now)

---

## 1. What complexity is

> "Complexity is anything related to the structure of a software system that makes it hard to understand and modify the system."

Complexity is not about size. A big system can be simple; a tiny one can be a mess. You notice it through **three symptoms**:

| Symptom                  | Plain meaning                                      | In this project it would look like…                                             |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Change amplification** | One small change needs edits in many places.       | Changing the brand blue means editing every component's CSS.                    |
| **Cognitive load**       | You must hold a lot in your head to make a change. | To add a component you must remember 10 unwritten rules.                        |
| **Unknown unknowns**     | You don't even know what you need to change.       | You change a token and Studio breaks, but nothing told you they were connected. |

Unknown unknowns are the worst, because you can't plan for them.

Complexity has **two causes**:

- **Dependencies**: a piece of code can't be understood or changed on its own.
- **Obscurity**: important information isn't obvious (vague names, missing docs, hidden rules).

**Where the project already fights this**

- **Change amplification** → design tokens. The brand blue lives once in `kit/packages/tokens/src/primitive/palette.json`. Components use `var(--shk-…)`, so changing the colour is a one-line edit.
- **Cognitive load** → `docs/architecture/design-system/workflows/component-building.md` (the checklist is at the end) and `CLAUDE.md`. The rules are written down, so you don't have to remember them.
- **Unknown unknowns** → Turborepo. `turbo.json` knows that `ui` depends on `tokens`, so it rebuilds things in the right order for you.

Complexity is **incremental**: it never arrives in one big commit. It grows from hundreds of small "it's just one hard-coded value" decisions. That's why the book asks for "zero tolerance" on small things.

---

## 2. Strategic vs tactical programming

- **Tactical programming**: "just make it work". Fast today, slow forever, because every shortcut adds a little complexity.
- **Strategic programming**: working code isn't enough. The goal is a **good design** that also works. You invest roughly **10–20% extra time** in design, and it pays back within months.

A "tactical tornado" is a developer who ships very fast and leaves a mess for everyone else.

**In this project**

This repo is strongly strategic, and on purpose:

- The architecture was designed **before** most of the code (`docs/architecture/architecture-overview.md`).
- The `kit/` vs `platform/` split exists today, even though it's one repo, so the future split is "a mechanical job instead of a refactor". That's a textbook strategic investment.
- The Ubiquitous Language was written before the components.

**Watch out:** strategic doesn't mean "design everything up front forever". The book recommends small, continuous investments. Planned packages (`client`, `react`, `mock`) can be designed when you actually build them, as long as the rules they must follow are already clear.

---

## 3. Deep modules

This is the book's most famous idea.

A **module** is anything with an interface and an implementation: a function, a component, a package, a whole service.

- The **interface** is what users must know to use it (its cost).
- The **implementation** is what it does for them (its benefit).

Picture a module as a rectangle. The top edge is the interface, the area is the functionality:

```
Deep module                    Shallow module
┌──────┐                       ┌──────────────────────────┐
│      │  small interface      │                          │ big interface
│      │                       └──────────────────────────┘ little behind it
│      │  lots of power
│      │  hidden inside
└──────┘
```

**Deep modules are the goal**: a simple interface hiding a lot of power. The classic example is opening a file: `open(path)` hides disks, caches, permissions and file systems.

A **shallow module** has an interface almost as complex as what it does. It costs more to learn than it saves.

**In this project**

- **`@detriz-sh-kit/tokens`** is deep. Its interface is one line, `import "@detriz-sh-kit/tokens/tokens.css"`. Behind it: DTCG JSON, primitive → semantic layers, Style Dictionary, a build step and prefixes.
- **The planned `<LiveGauge sensorId="kitchen-temperature" />`** is the deepest piece of the design. One prop hides the WebSocket, reconnecting, the Connection Status and unit formatting. "3 lines to live data" is basically a deep-module promise.
- **`<Gauge label value unit />`** is deep for its size today: three props, and it handles the semantic HTML (`<figure>`, `<figcaption>`), the number formatting (`toFixed(1)`) and the styling.

**Watch out: "classitis"**. The book warns against splitting things into many tiny pieces just because "small is good". For components, that would mean `GaugeLabel`, `GaugeValue` and `GaugeUnit` that every user must assemble by hand. Only split when the pieces are really useful on their own.

**Watch out: prop explosion.** As the Gauge grows (`range`, `status`, `min`, `max`, `decimals`, `size`, `variant`, `showUnit`…), each prop makes the interface wider. Before adding a prop, ask: _can the component work this out itself?_ (See [Pull complexity downwards](#6-pull-complexity-downwards).)

---

## 4. Information hiding (and leakage)

**Information hiding**: each module keeps its own design decisions secret. If a decision changes, only that module changes.

**Information leakage** is the opposite: the same knowledge lives in several modules, so changing it means changing all of them. Leakage creates dependencies, which is cause #1 of complexity.

**In this project**

Information hiding is built into the repo rules:

- **`exports` in `package.json`** decides what is public. `kit/packages/ui/package.json` exposes only `.` and `./styles.css`. Everything in `src/` is hidden.
- **`src/index.ts`** is the "front door": only what it exports can be imported. Its comment says exactly that.
- **No `/src/` imports, no relative imports between `kit/` and `platform/`.** If Studio could reach into `ui/src/sensor/Gauge/Gauge.module.css`, the ui team could never rename that file. Because Studio only knows the package name, `ui` can reorganise its insides freely.
- **`ui` never fetches data.** It doesn't know if values come from a WebSocket, a mock or Storybook. Only the planned `react` package knows both sides.

**Where leakage could sneak in**

- **Connection Status rules.** "When is a Sensor Stale?" (for example, no Reading for 60 seconds) must live in **one** place, probably `client`. If both the backend and Studio compute it, they will disagree one day.
- **Token prefix.** The prefix `shk` is decided in `kit/packages/tokens/build/config.json`. But docs and comments also mention it, and some still say `--dtz-`. That's leakage of a "secret" into text that doesn't update itself (see [What to fix now](#what-to-fix-now)).
- **Unit formatting.** If Studio, Storybook and the landing page each format `22.4 °C` themselves, a change to formatting rules must be made three times. Keep it inside the component (or one shared helper).

**Temporal decomposition** is a common cause of leakage: structuring code by the _order_ things happen ("first read, then parse, then display") instead of by _what knowledge they hold_. In the hub, for example, avoid a `read_sensor.py` and a `parse_sensor.py` that both need to know the sensor's byte format. One driver per Sensor that owns all of it is better.

---

## 5. Different layer, different abstraction

In a well-designed system, each layer offers a **different** way of thinking about the problem. If two neighbouring layers look the same, one of them probably isn't earning its place.

The red flag is a **pass-through method** (or pass-through prop): a function that only forwards its arguments to another one with the same signature. It adds interface without adding power.

**In this project**

The layers really do change abstraction:

| Layer                                                | Thinks in terms of…                                        |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| Primitive tokens (`palette.blue.500`)                | Raw values: "this exact blue"                              |
| Semantic tokens (`color.accent`, `color.text.muted`) | Purpose: "the brand colour", "secondary text"              |
| `ui` components (`<Gauge value unit />`)             | What the user sees: "a Reading on screen"                  |
| `react` (`<LiveGauge sensorId />`)                   | The domain: "this Sensor, live"                            |
| `client` (`useSensor`)                               | Data and connection: WebSocket, retries, Connection Status |

The planned `Live*` components are described as "thin wrappers". That's fine, **because they change the abstraction**: from `sensorId` to props. A wrapper that took the same props as `Gauge` and passed them through would be a red flag.

**Watch out: components should use semantic tokens, not primitives.** `Gauge.module.css` uses `var(--shk-palette-blue-100)`, which skips the semantic layer. If you later add a dark theme by overriding `--shk-color-…` variables, this border won't change. Use `var(--shk-color-accent)` or `var(--shk-color-border)` instead.

---

## 6. Pull complexity downwards

> "It is more important for a module to have a simple interface than a simple implementation."

When there's unavoidable complexity, the module should handle it **inside**, rather than pushing it up to every user. There are many users and only one module author, so the author should suffer, not the users.

Configuration options are often a way of pushing complexity up: "I didn't know the right value, so you decide." Only add an option when the user really knows better.

**In this project**

- **`@layer detriz`** in every component's CSS. Users can override any style without fighting specificity. The design system takes on the complexity, users get the simple path.
- **`peerDependencies` for React.** The library handles the "React must exist only once" problem, so apps don't hit "Invalid hook call".
- **Turborepo** handles build order, so you don't have to remember "build tokens before ui".
- **Future example:** `LiveGauge` should work out the Connection Status itself (Connected / Stale / Disconnected) and show the right state. It shouldn't ask every developer to pass `status` and write their own staleness timer.

**Watch out:** `toFixed(1)` in `Gauge.tsx` is a good default for temperature, but CO₂ in ppm has no decimals. Rather than adding a `decimals` prop that everyone must think about, consider letting the Metric decide (the component, or a helper, knows that ppm uses 0 decimals). Keep the prop only as an override.

---

## 7. Somewhat general-purpose modules

Ousterhout's advice: make modules **somewhat general-purpose**. The _interface_ should be general enough to support many uses; the _implementation_ only needs to solve today's needs.

Ask yourself:

- What is the simplest interface that covers all my current needs?
- In how many situations will this be used?
- Is this API easy to use for my current needs? (If not, it's too general.)

**In this project**

This is exactly why the design system has two layers:

- **`ui` is general-purpose.** `<Gauge value unit />` works with any data source: Storybook, the landing page, someone else's API.
- **`react` is special-purpose.** `<LiveGauge sensorId />` is built only for DeTriz data.

Special-purpose code sits on top of general-purpose code, never inside it. That's why `ui` must never import `client`.

**Watch out:** don't make `Gauge` _too_ general (a "Widget" that can show anything) or _too_ special (`KitchenTemperatureGauge`). "Shows one Reading" is a good level.

---

## 8. Better together or better apart?

When should two pieces of code be one module, and when two? The book's rules of thumb:

- **Bring together** if they share information, are always used together, overlap in concept, or one is hard to understand without the other.
- **Separate** general-purpose code from special-purpose code.
- **Red flag: conjoined methods**: two pieces you can't understand without reading both.

**In this project**

- **Together:** each component's folder holds `Gauge.tsx`, `Gauge.module.css` and `Gauge.stories.tsx`. They change together, so they live together. A global `styles/` folder for all components would split things that belong together.
- **Apart:** `tokens` and `ui` are separate packages, because tokens are useful without React (a plain HTML landing page could use them).
- **Apart, in the domain model:** Device Status is **three separate fields** (Pairing Status, Connection Status, Fault), not one big `status` enum. A single enum would need values like `connected-but-faulty`, and you'd need one for every combination. Three independent questions, three fields.

---

## 9. Define errors out of existence

Exceptions and special cases add a lot of complexity, because every caller must handle them. The best way to deal with an error is often to **design it away**, so the situation can't happen or becomes normal behaviour.

Techniques from the book:

- **Define errors out of existence**: change the definition so the "error" is normal. (Example: deleting something that's already gone just succeeds.)
- **Mask exceptions**: handle them low down so higher layers never see them (like TCP resending lost packets).
- **Aggregate exceptions**: handle many kinds in one place.
- **Just crash**, when an error is rare and can't be recovered from.

**In this project**

- **Connection Status as normal states.** A lost connection isn't an exception the UI must catch; it's a state: `Stale` or `Disconnected`, with the last value dimmed. Every component must have these states, so "the WebSocket dropped" becomes ordinary rendering instead of a crash.
- **Unpaired Devices have no Connection Status.** The Ubiquitous Language says Connection Status exists "for paired Devices only". If your types follow this (for example, a Paired Device type that has `connectionStatus` and an Unpaired one that doesn't), the error "Connection Status on an unpaired Device" can't even be written.
- **Readings never change once recorded.** Immutable data removes a whole class of bugs: you never have to ask "was this edited after I loaded it?"
- **Masking reconnects.** The planned `client` should retry the WebSocket by itself. Components only see `Connecting → Connected`, never the retry logic.

---

## 10. Design it twice

Your first idea is rarely your best. For important decisions, sketch **at least two quite different designs**, compare them, then pick (or combine). It costs an hour and can save weeks.

As a UX designer you already do this: it's the same as exploring several layout options before committing.

**In this project**

- **Two layers** (`ui` + `react`) came from comparing "props-driven" with "pre-bound to sensor streams" and keeping both.
- **ADRs** (`docs/adr/NNNN-title.md`) are where "design it twice" gets written down: an ADR should list the options you considered, not only the winner.
- **Storybook** is a great place to design a component twice: write two story variants with different props APIs and see which one reads better.

---

## 11. Comments

Ousterhout disagrees with "good code doesn't need comments". Code tells you **what** it does and **how**; it can't tell you **why**, or what the author was thinking.

Rules:

- **Comments should describe things that aren't obvious from the code.** Don't repeat the code (`// increments i`).
- **Interface comments** (above a function, component or prop) describe what it does for the user, not how.
- **Write comments first**, as part of design. If a comment is hard to write, the design is probably unclear.
- **Keep comments close to the code** they describe, so they get updated together.

**In this project**

- `GaugeProps` follows this well: every prop has a `/** */` comment with an example, e.g. `/** The Reading's value, e.g. 22.4. */`. Those show up in the editor and in Storybook docs.
- `index.ts` has a great "why" comment: _"Only what is exported here can be imported by apps."_ You can't learn that from the code alone.
- The Gauge component comment says _"Takes props only, never fetches data."_: a design rule, not a description of the code. Exactly what comments are for.

**Watch out: stale comments.** `Gauge.module.css` says `/* Only tokens (var(--dtz-…)) … */`, but the prefix is now `--shk-`. A wrong comment is worse than no comment, because people trust it.

---

## 12. Choosing names

A good name creates a picture in the reader's mind; a vague name creates obscurity (cause #2 of complexity). Names should be:

- **Precise**: `temperatureC` beats `value` or `data`. If you struggle to find a precise name, the thing may be doing too much.
- **Consistent**: one name per concept, and that name means only that concept.

**In this project**

The Ubiquitous Language (`docs/architecture/domain-model/ubiquitous-language.md`) is the strongest tool here. It's exactly the book's "consistency" rule applied to the whole product: **one concept, one name, everywhere** (UI copy, API, types, components).

- A **Sensor** is never called a "device", because a Sensor is not a Device.
- **Space**, not "room": a Space doesn't need walls.
- **Reading**, not "data point", "measurement" or "value".
- Naming rules like unit suffixes (`temperatureC`), `is/has` for booleans and `on<Event>` for callbacks (`docs/architecture/design-system/ds-conventions-and-structure.md`) make names predictable.

**Watch out:** `GaugeProps.label` is described as _"What is being measured, e.g. 'Kitchen'"_. "Kitchen" is a Space (where), not a Metric (what). A precise comment, maybe a precise prop name, avoids confusion.

---

## 13. Consistency

> Similar things should be done in similar ways, and different things in different ways.

Consistency lowers cognitive load: once you learn how one component works, you know how all of them work. It comes from names, coding style, interfaces and design patterns.

Ways to keep it: **write it down**, **enforce it with tools**, and **when in Rome, do as the Romans do** (follow existing conventions, even if you'd personally choose differently).

**In this project**

- **Written down:** `component-building.md`, `ds-conventions-and-structure.md`, `CLAUDE.md`.
- **Enforced by tools:** Prettier (`pnpm format:check`), TypeScript (`pnpm --filter @detriz-sh-kit/ui typecheck`). Linting isn't set up yet, so rules like "no raw values in CSS" are only enforced by review. A Stylelint rule could check it automatically.
- **A reference example:** `sensor/Gauge` is the one component everyone copies. That makes it important to keep it perfect: whatever is in it, including mistakes, will be copied.
- **Every component has the same states** (loading, Connected, Stale, Disconnected, Fault), so users learn the pattern once.

---

## 14. Code should be obvious

Code is obvious when a reader can understand it **quickly, without much thought, and their first guess is right**. Obviousness is judged by the **reader**, not the writer. If a code reviewer says something isn't obvious, it isn't, no matter how clear it feels to you.

Things that make code less obvious: generic containers (returning a `[string, number]` instead of a named object), event-driven code (it's hard to see what triggers what), and code that breaks the reader's expectations.

**In this project**

- Semantic HTML (`<figure>`, `<figcaption>`) makes the Gauge's structure obvious to both humans and screen readers.
- **Event-driven code will arrive** with WebSockets. Make the flow obvious: document which events `client` emits and what each component does with them.
- **AI-assisted development** fits here: if Claude or a teammate misreads your code, that's a signal the code isn't obvious yet, not only a mistake by the reader.

---

## Red flags checklist

The book ends with a list of warning signs. Use it when reviewing a pull request.

| Red flag                                      | Question to ask in this project                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Shallow module**                            | Does this component or hook do more than it costs to learn?                            |
| **Information leakage**                       | Is the same rule (staleness timeout, unit format, token prefix) written in two places? |
| **Temporal decomposition**                    | Is the code split by "steps in time" instead of by knowledge?                          |
| **Overexposure**                              | Must users learn rare options just to use the common case?                             |
| **Pass-through method / prop**                | Does this wrapper only forward props without changing the abstraction?                 |
| **Repetition**                                | Is the same chunk of code or CSS copied across components?                             |
| **Special-general mixture**                   | Did DeTriz-specific code end up inside `ui`?                                           |
| **Conjoined methods**                         | Can I understand this file without opening another one?                                |
| **Comment repeats code**                      | Does the comment add a "why", or just say what the code says?                          |
| **Implementation docs contaminate interface** | Does a prop comment talk about internals the user doesn't need?                        |
| **Vague name**                                | Would the Ubiquitous Language use a more precise term?                                 |
| **Hard to pick a name**                       | Is this thing doing two jobs?                                                          |
| **Hard to describe**                          | If the comment is long and full of "and", should it be split?                          |
| **Non-obvious code**                          | Would a new reader guess right on the first try?                                       |

---

## What to fix now

Small issues spotted while writing this page. Each one is a little bit of complexity, and the book's advice is to fix them while they're small.

- [ ] **`Gauge.module.css` uses raw values** (`padding: 5px`, `border: 2px solid`, `font-size: 2em`). Replace them with `--shk-space-…`, `--shk-border-…` and typography tokens. _(Change amplification)_
- [ ] **`Gauge.module.css` uses a primitive token** (`--shk-palette-blue-100`). Use a semantic one, such as `--shk-color-border` or `--shk-color-accent`. _(Different layer, different abstraction)_
- [ ] **Stale `--dtz-` mentions** in the Gauge CSS comment and in `architecture-overview.md` (theming section). Update them to `--shk-`. _(Stale comments, information leakage)_
- [ ] **`GaugeProps.label` example** says "Kitchen" (a Space) for "what is being measured" (a Metric). Make the comment match the Ubiquitous Language. The Humidity story also uses `%` where the Ubiquitous Language says `%RH`. _(Precise names)_
- [ ] **Gauge has no state stories yet** (loading, Connected, Stale, Disconnected, Fault). Since Gauge is the reference example, add them before other components copy it. _(Consistency, define errors out of existence)_
- [ ] **Decide where Connection Status logic lives** (most likely `client`) and write it in an ADR before building `react`. _(Information hiding, design it twice)_

---

_Source: John Ousterhout, "A Philosophy of Software Design", 2nd edition, Yaknyam Press, 2021. Ousterhout also teaches the course CS 190 at Stanford, based on the book._
