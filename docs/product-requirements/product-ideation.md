# Product ideation: AI features

Ideas for adding an AI layer after the design system and the FastAPI backend are done. The goal is to practise AI engineering on small features that also make the product better.

The [learning roadmap](../learning/AI-Software-Frontend-Engineer-roadmap.md) already plans the Site Assistant (Stage 6), evals (Stage 7) and MCP servers (Stage 8). This document adds smaller steps before them and a clearer product direction around them.

## Table of contents

- [Recommendation](#recommendation)
- [Three possible directions](#three-possible-directions)
- [Ideas at a glance](#ideas-at-a-glance)
- [Direction A: understand the data](#direction-a-understand-the-data)
- [Direction B: prototype without waiting for reality](#direction-b-prototype-without-waiting-for-reality)
- [Direction C: build from the design system](#direction-c-build-from-the-design-system)
- [Suggested order](#suggested-order)
- [Rules for every AI feature](#rules-for-every-ai-feature)
- [Open questions](#open-questions)

## Recommendation

**Chosen direction: C, generative UI.** It makes the most of a UX designer's skills and of the design system. The [generative UI concept](generative-ui-concept.md) explores it in depth.

The other directions stay as options for later. One pair is worth remembering:

1. **Scenario Generator**: describe a situation in words and get a simulated Record & Replay session.
2. **Session Story**: turn a recorded session into a short summary for stakeholders.

The generator writes the "answer key" for each session (for example, "window opened at 14:30"). You can then check whether Session Story found that event, which gives you automatic test data for evals.

## Three possible directions

| Direction | The promise | Job map stage | Best for practising |
| --- | --- | --- | --- |
| **A. Understand the data** | "Tell me what this means." | Confirm, Conclude | Prompts, grounding answers in real data, citations, tool use |
| **B. Prototype without waiting for reality** | "Show me what happens if…" | Execute, Monitor | Structured output, validation, turning words into data |
| **C. Build from the design system** | "Make me a screen for this." | Execute | Giving a model a limited vocabulary, generative UI, MCP |

## Ideas at a glance

Sizes are relative to each other. Small is one endpoint and one UI element. Large touches several layers.

| # | Idea | Direction | Size | Main AI skill | Needs |
| --- | --- | --- | --- | --- | --- |
| 1 | Space Snapshot | A | Small | First model call, prompts, structured output | Latest Readings |
| 2 | Fault Helper | A | Small | Retrieval (RAG) | Fault Codes, help articles |
| 3 | Unusual Moment Spotter | A | Medium | Mixing normal code with AI, classification | Reading history |
| 4 | Session Story | A | Medium | Summarising long data, citations | Record & Replay |
| 5 | Site Assistant | A | Large | Tool use, streaming, conversation | Read API |
| 6 | Scenario Generator | B | Medium | Structured output, validation | Record & Replay format |
| 7 | Rules from a Sentence | B | Small | Turning language into a strict format | A simple rule checker |
| 8 | Hub Placement Coach | B | Small | Images as input | Photo upload |
| 9 | Dashboard from a Sentence | C | Large | Generative UI | Finished components |

## Direction A: understand the data

### 1. Space Snapshot

One sentence that describes a Space from all its latest Readings.

> Meeting room A: warm and getting stuffy. CO₂ is 1,200 ppm, so open a window soon.

- **Why AI:** a lookup table can label one Reading. The model adds value by combining several Metrics into one thought.
- **You learn:** your first API call from FastAPI, how to write a system prompt, how to get JSON back, and how to cache a result so you don't pay for the same answer twice.
- **Design system:** a new presentational `SpaceSummary` component with loading, ready and failed states.

This is the best first feature. It delivers the "plain-language meaning" promised in the [product overview](product-overview.md).

### 2. Fault Helper

A "How do I fix this?" button next to a Fault. It finds the right help article for the Fault Code and rewrites it for this exact Device.

> The Air Quality Module in Slot 2 needs calibration. Keep it in fresh air for 10 minutes, then press Calibrate.

- **Why AI:** it adapts the same help article to the specific Module, Slot and situation.
- **You learn:** retrieval (RAG). You look up the right text first and give it to the model, so it answers from your docs instead of guessing.
- **Keep it simple:** start by finding articles with the exact Fault Code. Try embeddings later only if search is the part you want to learn.

### 3. Unusual Moment Spotter

Normal Python finds a sudden change in a Reading's history. The model then suggests the likely cause from a fixed list.

> CO₂ dropped quickly at 14:30. Likely cause: window opened.

- **Why AI:** detecting the change is maths and doesn't need AI. The model only explains it.
- **You learn:** the most useful AI engineering habit, which is to use the model only for the part that normal code can't do. A fixed list of causes also makes this easy to test.

### 4. Session Story

Turn a recorded session into a short report that a team can share. Each finding links to the moment in the replay it came from.

> During the 2-hour test, the room stayed comfortable for the first 40 minutes. CO₂ then passed 1,000 ppm [link to 12:40]. It dropped again after the door opened [link to 13:15].

- **Why AI:** it turns hours of numbers into a story, which supports "minimize the time it takes to present prototype results".
- **You learn:** how to shrink a large dataset before sending it to a model, how to summarise long data, and how to show sources for each claim.
- **Why it stands out:** few smart home demos do this, and it combines your UX and engineering work in one screen.

### 5. Site Assistant

The chat panel already planned in the roadmap. Keep it as the final project of this direction. By then, Snapshot, Fault Helper and Session Story can each become a tool it uses.

## Direction B: prototype without waiting for reality

### 6. Scenario Generator

Describe a situation and get a replayable session.

> Six people in Meeting room A from 14:00. The window opens at 14:30. The Light Module loses connection at 15:00.

The output plays in Live Studio like any other session, with a "Simulated" badge.

- **How it works:** the model does not write the Readings. It writes a short plan of events as JSON, and normal code turns that plan into realistic Readings. This keeps the numbers believable and cheap to produce.
- **You learn:** structured output, validating a model's answer, and retrying when the answer fails validation.
- **Why it fits:** designers can test Stale, Disconnected and Fault states on demand, and the landing page gets a demo that visitors can type into.

### 7. Rules from a Sentence

Type a rule in plain language and the model converts it into a strict rule. Normal code then checks that rule against Readings, with no AI needed.

> Tell me when the bedroom gets stuffy after 22:00.

```json
{ "space": "Bedroom", "metric": "CO₂", "above": 1000, "unit": "ppm", "after": "22:00" }
```

- **You learn:** translating language into data, asking a follow-up when a request is unclear ("How stuffy is stuffy?"), and showing the result so the person can confirm it.
- **Design question:** how do you show someone what the AI understood before it takes effect?

### 8. Hub Placement Coach

Upload a photo of a Space and get advice on where to place the Hub, for example away from direct sun, the heater and the kitchen window.

- **You learn:** sending images to a model, and how to design for advice that may be wrong.
- **Why it's here:** it's a small, fun feature and your only chance in this list to try image input.

## Direction C: build from the design system

### 9. Dashboard from a Sentence

Ask for "a page for the bedroom". The model picks from your real components and returns a layout as JSON, and Studio renders it.

- **Why AI:** the model can only use the components you allow, so the design system becomes its vocabulary. It can't invent UI that falls outside your system.
- **You learn:** generative UI, which is a strong topic for a design engineer portfolio.
- **Roadmap link:** this is the optional "dashboard builder" in Stage 8. It builds well on the **design system MCP server** from the same stage.
- **Next:** see the [generative UI concept](generative-ui-concept.md).

## Suggested order

Each step assumes the design system and the FastAPI backend are finished.

| Step | Build | What it teaches | Roadmap stage |
| --- | --- | --- | --- |
| 1 | Space Snapshot, as an optional warm-up | The basics of calling a model from a backend | 4 |
| 2 | Generative UI, following its [build plan](generative-ui-concept.md#build-plan) | Structured output, validation, evals and streaming | 4, 5, 7 |
| 3 | Site Assistant, which can reuse the generative UI engine | Tool use and conversation | 6 |
| 4 | Scenario Generator and Session Story | Long data and sources | 5, 7 |

Stop after any step and you still have a finished feature to show.

## Rules for every AI feature

These keep the features consistent with the [architecture](../architecture/architecture-overview.md) and the [Ubiquitous Language](../architecture/domain-model/ubiquitous-language.md).

- **The API key stays on a server.** The browser never calls the model directly.
- **`ui` stays presentational.** AI components take text and states as props and never call a model.
- **Facts come from data.** Every value in an answer must come from a Reading, a Fault or a document. If the data isn't there, the feature says so.
- **Disconnected stays Disconnected.** Last known values are hidden in the UI, so AI features must not reveal them. They can say a Device is Disconnected and since when.
- **Simulated is always labelled.** Generated sessions show a clear badge, like the planned "Replay" badge, so nobody mistakes them for real data.
- **Read-only first.** Anything that changes the real world, such as turning a Module Off, needs the person to confirm it.
- **Use the domain terms.** Prompts and answers say Space, Hub, Module and Reading, the same as everywhere else.
- **Works without AI.** If the model fails, the dashboard still shows every Reading.
- **Prefer normal code.** Use a model only for the part that normal code can't do well.

## Open questions

- Which Readings can leave the Site? Sending them to a model provider needs a privacy note, even in a demo.
- Should the AI features be part of `kit/` or `platform/`? Not decided yet. This can wait while we explore directions.
- Does the Record & Replay session format include enough context (Space, Module, events) for Session Story? Check this when designing the format, because changing it later will be harder.
