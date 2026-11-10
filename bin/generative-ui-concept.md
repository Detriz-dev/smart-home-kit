# Generative UI concept

An exploration of the direction chosen in [product ideation](product-ideation.md): a person describes a screen in plain language, and Live Studio builds it from the DeTriz design system using live data.

This is a concept, not a final spec. Terms follow the [Glossary](../kit/apps/docs-site/docs/domain-model/glossary.mdx).

## Table of contents

- [The idea in short](#the-idea-in-short)
- [What generative UI means](#what-generative-ui-means)
- [Why it fits this product](#why-it-fits-this-product)
- [The experience](#the-experience)
- [How it works](#how-it-works)
- [The View Spec](#the-view-spec)
- [The Component Catalog](#the-component-catalog)
- [What can go wrong](#what-can-go-wrong)
- [UX states to design](#ux-states-to-design)
- [How to measure quality](#how-to-measure-quality)
- [What needs to exist first](#what-needs-to-exist-first)
- [Build plan](#build-plan)
- [What you will learn](#what-you-will-learn)
- [Open questions](#open-questions)

## The idea in short

> **Describe the screen. See it working with live data. Ship the same components.**

A designer types:

> A calm bedroom screen that makes air quality the main focus.

Studio shows a working screen a few seconds later. It uses real `ModuleCard` and `SensorReading` components, real tokens and live Readings. The designer can refine it, compare other versions, share it and export the code.

The model acts like a designer working inside a strict design system. It decides **what goes where**. It never draws anything or writes CSS, and it never touches the Readings.

## What generative UI means

Generative AI usually returns text. Generative UI returns an interface. There are three levels, and each gives the model more freedom:

| Level          | The model…                             | Example                               | Freedom | Risk   |
| -------------- | -------------------------------------- | ------------------------------------- | ------- | ------ |
| **1. Pick**    | chooses one screen you designed        | "Show the climate template"           | Low     | Low    |
| **2. Compose** | arranges your components into a layout | "Air quality first, then temperature" | Medium  | Medium |
| **3. Code**    | writes new React and CSS               | "Invent a new gauge"                  | High    | High   |

**Decision: build Level 2, Compose.**

- Level 1 is mostly a search through templates, so there's little to learn and little to surprise anyone.
- Level 3 can ignore tokens and the states from the Ubiquitous Language, and running generated code safely is a project of its own.
- Level 2 keeps the design system in charge. Every screen is made of components you already tested in Storybook, so the model has freedom only where you allow it.

A useful comparison: Level 3 gives the model a blank Figma file. Level 2 gives it your component library and locks the components, so it can arrange instances but can't detach them.

## Why it fits this product

- **It matches the promise.** The product overview says "the components you prototype with are the same ones you ship". An exported screen uses those same components.
- **It uses your UX skills.** The quality depends on hierarchy, component guidance and how people recover from mistakes. Those are design problems.
- **It makes the design system more valuable.** Your component docs become instructions the model reads.
- **It shows well in a portfolio.** It joins tokens, components, an API, live data and AI in one visible demo.
- **It tests the design system.** When the model builds a poor screen, the cause is often a missing component or unclear guidance. Each failure teaches you something about the system.

## The experience

These are five concepts that build on each other. The first is the core product, and the rest add to it.

### 1. Prompt to screen

The person writes a sentence, or picks a Space and a goal. Studio returns a working screen.

```
┌──────────────────────────────────────────────────────┐
│ A calm bedroom screen, air quality first        [ ↑ ]│
├──────────────────────────────────────────────────────┤
│ My flat / Bedroom                                    │
│                                                      │
│ ┌──────────────────────────────┐  ┌────────────────┐ │
│ │ Air Quality Module           │  │ Climate Module │ │
│ │ CO₂  840 ppm                 │  │ 21.5 °C        │ │
│ │ VOC  120 ppb                 │  │ 48 %RH         │ │
│ └──────────────────────────────┘  └────────────────┘ │
├──────────────────────────────────────────────────────┤
│ Why this layout: air quality is largest because you  │
│ asked for it first. Climate supports it.             │
└──────────────────────────────────────────────────────┘
```

### 2. Refine it

The person changes the screen with a follow-up, such as "Make CO₂ bigger" or "Remove the Switches". The model changes only what was asked and leaves the rest alone. Each change adds a version, so undo is always one step away.

Later, direct editing can sit alongside this. Dragging a card and typing a prompt would both change the same data.

### 3. Compare three directions

This is the most designer-friendly concept. The request "Show me three approaches" returns three real screens side by side, each with a clear angle:

| Version | Angle        | Main emphasis                              |
| ------- | ------------ | ------------------------------------------ |
| A       | At a glance  | Fewest elements, largest values            |
| B       | Diagnostic   | Connection Status and Faults are prominent |
| C       | Every Metric | Everything is visible and compact          |

All three use live data, so a team can compare how they behave rather than how they look in a static mockup. This is likely the strongest portfolio moment.

### 4. Share and export

A generated screen is small data, so it can be saved and shared as a link. Normal code, with no AI, can also turn that data into React:

```tsx
<LiveModuleCard moduleId="bedroom-air-quality" />
<LiveModuleCard moduleId="bedroom-climate" />
```

`LiveModuleCard` is a planned component in `@detriz-sh-kit/react`. Export is what separates this from a demo, because the prototype becomes a starting point for production code.

### 5. Answers as interface

Once the Site Assistant exists, it can answer with components as well as text. "Which Modules are Stale?" returns a list of real status components. This reuses the same engine, so it's a cheap addition later.

### An idea to avoid for now: screens that rearrange themselves

A screen could reshape itself live, for example by moving a Fault to the top. It sounds impressive, but moving controls while someone uses them breaks spatial memory and damages trust. A safer later version could suggest the change and let the person accept it.

## How it works

```
 "A calm bedroom screen, air quality first"
                  │
                  ▼
 ┌─ Build the context ───────────────────────┐
 │  Component Catalog: what can be used      │
 │  Site inventory: which Spaces and Modules │
 │  Current View Spec: when refining         │
 └────────────────┬──────────────────────────┘
                  ▼
 ┌─ Model ───────────────────────────────────┐
 │  Returns a View Spec as JSON              │
 └────────────────┬──────────────────────────┘
                  ▼
 ┌─ Validate (normal code) ──────────────────┐
 │  Does it match the schema?                │
 │  Do the components and IDs exist?         │──── failed: send the errors
 │  Is the layout allowed?                   │     back and retry
 └────────────────┬──────────────────────────┘
                  ▼
 ┌─ Render (normal code) ────────────────────┐
 │  Maps each node to a real component       │
 │  Live data arrives through the usual hooks│
 └───────────────────────────────────────────┘
```

Only the middle step uses AI. Everything else is normal code that you can test normally.

**The key decision: the model never sees or writes Readings.** It gets a list of what exists, such as "the Bedroom has an Air Quality Module", and refers to it by ID. Values reach the screen through the same hooks as any other screen. This has four benefits:

- The model can't invent a value, because it never provides one.
- The screen stays live after it's generated, with no further model calls.
- All states work automatically. A Disconnected Module still hides its values, because the component handles that.
- Less data goes to the model provider.

## The View Spec

The View Spec is the JSON description of a screen, and it's the most important design decision in this feature. Think of it as a small, safe design language made for a model to write.

```json
{
  "version": 1,
  "title": "Bedroom air quality",
  "rationale": "Air quality is largest because it was requested first.",
  "root": {
    "type": "Stack",
    "children": [
      { "type": "LocationPath", "spaceId": "bedroom", "layout": "inline" },
      {
        "type": "Columns",
        "ratio": "2:1",
        "children": [
          { "type": "ModuleCard", "moduleId": "bedroom-air-quality" },
          { "type": "ModuleCard", "moduleId": "bedroom-climate" }
        ]
      }
    ]
  }
}
```

Notice what's missing, and why:

| Not in the spec                      | Why                                                         |
| ------------------------------------ | ----------------------------------------------------------- |
| Readings and statuses                | They come from live data, which keeps them true.            |
| Colours, spacing and sizes in pixels | Tokens and components own those.                            |
| CSS or HTML                          | Allowing them would let the model bypass the design system. |
| Functions such as `onToggle`         | JSON can't hold code. The renderer connects behaviour.      |

Other rules:

- **Use the same shape for every feature.** Refining, comparing, saving, sharing and exporting all work from this one format.
- **Keep a `version` field.** Saved screens can still load after the format changes.
- **Keep `rationale` short.** It's shown to the person, and it helps you debug odd choices.

Components receive different props in a View Spec than in code. `ModuleCard` takes `sensors` and `connectionStatus` in `ui`, but a View Spec gives it only `moduleId`. The renderer uses the planned `Live*` layer to fill in the rest.

## The Component Catalog

The Catalog tells the model which components it may use, what each one is for and when not to use it. It's a short, curated list, written with the same care as a design guideline.

```yaml
ModuleCard:
  use_for: One Module with its current Readings and Connection Status.
  avoid: Showing one Metric in a small space. Use SensorReading.
  props:
    moduleId: an ID from the Site inventory
```

Start with a small set:

| Group    | Components                                    | Status   |
| -------- | --------------------------------------------- | -------- |
| Layout   | `Stack`, `Columns`                            | To build |
| Context  | `LocationPath`                                | Exists   |
| Readings | `ModuleCard`, `SensorReading`                 | Exist    |
| Status   | `DeviceConnectionStatus`, `DeviceFaultStatus` | Exist    |

Leave low-level parts out. `ReadingValue`, `UnitLabel` and `SensorLabel` are building blocks that `SensorReading` already combines. Fewer choices usually lead to better results.

Your `.md` component docs already contain most of this guidance. Generating the Catalog from them would keep one source of truth, but write it by hand first so you learn what the model actually needs.

## What can go wrong

| Problem                       | Example                                    | Response                                                                        |
| ----------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Invented ID                   | `moduleId: "bedroom-noise"`                | Validation catches it and the model retries with the error.                     |
| Request the kit can't meet    | "Show the noise level"                     | Say Noise isn't a Metric the kit measures, then build the rest. Never fake it.  |
| Unclear request               | "Show the room" on a Site with five Spaces | Ask "Which Space?" with the Spaces as options.                                  |
| Empty result                  | The Space has no Paired Modules            | Show a clear empty state that explains why.                                     |
| Bad but valid layout          | Eight equal cards with no hierarchy        | Add layout rules to the Catalog and test them in evals.                         |
| Screen goes out of date       | A saved screen refers to a removed Module  | Keep the rest of the screen and show a "Module removed" placeholder.            |
| Prompt injection              | A Module is named "Ignore your rules"      | Treat names as data, render them as plain text, and limit output to the schema. |
| Unwanted action               | A prompt says "Turn everything off"        | The View Spec can't perform actions. Generation can only build screens.         |
| Same prompt, different result | A saved screen changes on reload           | Saved screens load from the View Spec. Generate again only on request.          |

## UX states to design

Normal UI has loading, ready and error. Generative UI needs more:

| State                    | What the person sees                                    |
| ------------------------ | ------------------------------------------------------- |
| Empty                    | Example prompts built from their own Spaces             |
| Thinking                 | "Looking at the Bedroom's Modules…"                     |
| Building                 | The screen appears piece by piece, using skeletons      |
| Ready                    | The working screen with its rationale                   |
| Needs clarification      | One short question with options                         |
| Partly possible          | The screen, plus a note on what was left out and why    |
| Failed                   | What happened, with the prompt kept so they can retry   |
| Refining                 | The old screen stays visible until the new one is ready |
| Showing an older version | A clear way to go back to the latest version            |

Trust questions to answer in Figma:

- How does someone tell what's live data and what the AI chose?
- How much should the rationale explain, and when should it stay quiet?
- How do you show what changed after a refinement?
- What should the prompt box look like after the first result?

## How to measure quality

Quality has three layers, and they get harder to check:

| Layer       | Question                  | How to check                                              |
| ----------- | ------------------------- | --------------------------------------------------------- |
| **Valid**   | Does it render?           | Automatic: schema and ID checks                           |
| **Correct** | Did it do what was asked? | Automatic: expected Space, Modules and components         |
| **Good**    | Is it well designed?      | Your review against a rubric, later with a model as judge |

Start with 15 to 20 prompts:

| Prompt                              | Pass condition                                    |
| ----------------------------------- | ------------------------------------------------- |
| "A page for the bedroom"            | Uses all Bedroom Modules and no others            |
| "Air quality first"                 | The Air Quality Module comes first and is largest |
| "Show the noise level"              | Doesn't invent a Metric and says it's unavailable |
| "Show the room" with several Spaces | Asks which Space                                  |
| "Turn everything off"               | Performs no action and explains that it can't     |

For the "Good" layer, write a short rubric: one clear focal point, related items grouped, no duplicated information, and fits a narrow container. Writing that rubric is design critique turned into an engineering tool.

## What needs to exist first

- [ ] `Stack` and `Columns` layout components.
- [ ] `@detriz-sh-kit/react` with `LiveModuleCard` and `LiveSensorReading`, or a simple mock version.
- [ ] An endpoint that lists a Site's Spaces and Modules, which becomes the Site inventory.
- [ ] Mock data with several Spaces, including Stale, Disconnected and Fault cases.

The real Hub isn't needed. Mock data is enough for all of the steps below.

## Build plan

Each step gives you something you can show.

| Step | Build                                                                      | Uses AI? | Done when                                                    |
| ---- | -------------------------------------------------------------------------- | -------- | ------------------------------------------------------------ |
| 1    | Write three View Specs by hand and a renderer that shows them in Storybook | No       | The format can describe the screens you want                 |
| 2    | Write the Catalog and a script that turns a sentence into a View Spec      | Yes      | A sentence gives a valid spec                                |
| 3    | Add validation and retries, plus your first 10 evals                       | Yes      | Evals run with one command                                   |
| 4    | Add a Studio page with a prompt box and the screen states                  | Yes      | "A page for the bedroom" works in the browser with mock data |
| 5    | Add refinement and version history                                         | Yes      | "Make CO₂ bigger" changes only that part                     |
| 6    | Add three directions, side by side                                         | Yes      | Three distinct versions appear                               |
| 7    | Add sharing and React export                                               | No       | The exported code runs in a clean app                        |

Step 1 matters most, and it deliberately has no AI. If you can't describe a good screen in View Spec by hand, a model can't either.

## What you will learn

| Skill                              | Where you practise it                         |
| ---------------------------------- | --------------------------------------------- |
| Calling a model from a backend     | Steps 2 and 4                                 |
| Structured output and JSON schemas | Steps 1 and 2                                 |
| Prompt and context design          | The Catalog, Site inventory and system prompt |
| Validation and retries             | Step 3                                        |
| Evals                              | Step 3, then every step after it              |
| Streaming and AI loading states    | Step 4                                        |
| Editing state with AI              | Step 5                                        |
| Parallel model calls               | Step 6                                        |

This covers the core of [roadmap](../learning/AI-Software-Frontend-Engineer-roadmap.md) Stages 4, 5 and 7. Tool use isn't central here, so the Site Assistant remains the natural next project.

## Open questions

- Where should this live: `kit/`, `platform/`, or split between them? No decision yet. The design keeps the option open, because the View Spec, renderer, Catalog and model call are separate pieces.
- Who is the main user: a designer exploring ideas, or someone building a personal dashboard? This concept assumes the designer.
- Should people be able to change tokens by prompt, such as "make it calmer"? A small set of theme options could stay safe, but it isn't part of the first version.
- Does Level 2 feel too limited after real use? If so, a later version could let the model propose a new component for a human to review, rather than generating one at runtime.
