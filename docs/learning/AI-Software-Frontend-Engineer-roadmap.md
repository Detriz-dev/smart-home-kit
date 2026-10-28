# Roadmap: from UX designer to AI design engineer

A step-by-step learning plan built around this repo. Each stage teaches one skill, gives you something real to build in DeTriz Smart Home Kit, and ends with a clear "done when" check.

It builds on [learning goals](learning-goals.md) and [learning assumptions](learning-assumptions.md), and follows the build order in the [architecture overview](../architecture/architecture-overview.md).

## Table of contents

- [Which role am I aiming for?](#which-role-am-i-aiming-for)
- [How to use this roadmap](#how-to-use-this-roadmap)
- [The big picture](#the-big-picture)
- [Stage 1: Frontend foundations through the design system](#stage-1-frontend-foundations-through-the-design-system)
- [Stage 2: AI in my everyday workflow](#stage-2-ai-in-my-everyday-workflow)
- [Stage 3: Data, APIs and live state](#stage-3-data-apis-and-live-state)
- [Stage 4: How LLMs work (for builders)](#stage-4-how-llms-work-for-builders)
- [Stage 5: Designing for AI](#stage-5-designing-for-ai)
- [Stage 6: Build the AI feature: Site Assistant](#stage-6-build-the-ai-feature-site-assistant)
- [Stage 7: Evals, safety and cost](#stage-7-evals-safety-and-cost)
- [Stage 8: Agents and MCP](#stage-8-agents-and-mcp)
- [Stage 9: Ship it and tell the story](#stage-9-ship-it-and-tell-the-story)
- [Weekly rhythm](#weekly-rhythm)
- [AI glossary for designers](#ai-glossary-for-designers)
- [Resources](#resources)
- [Progress tracker](#progress-tracker)

---

## Which role am I aiming for?

Three titles overlap a lot. The difference is mostly **where you spend most of your time**.

| Role                 | Spends most time on                                                                                        | Typical output                                             | Fit for me                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Design engineer**  | The space between Figma and code: design systems, components, interaction, motion, prototypes in real code | Component libraries, polished UI, high-fidelity prototypes | Closest to where I am today. This repo is already a design engineer project. |
| **Product engineer** | Whole features end to end: UI, API, data, shipping, talking to users                                       | Working features in production                             | The next step: same as above, plus backend and ownership of outcomes.        |
| **AI engineer**      | Building on top of models: prompts, tools, agents, retrieval, evals                                        | AI features and agents that work reliably                  | A specialisation you can add on top of either role.                          |

**Recommendation:** aim for **design engineer first, then AI product engineer**. My UX background is the advantage: most AI engineers can call a model, but few can design how people trust, correct and understand it. Don't pick a title now. Build the skills in order and the title will follow from the work you enjoy most.

---

## How to use this roadmap

Every stage has the same five parts:

1. **Why it matters**: one or two sentences.
2. **Learn**: the concepts, in the order to learn them.
3. **Build in this repo**: a concrete task in DeTriz Smart Home Kit.
4. **AI practice**: how to use AI in this stage, following the two phases from the learning assumptions: first AI **teaches and reviews** (I write the code), later AI **builds** (I direct and review).
5. **Done when**: a checklist. Don't move on until it's ticked.

**Assumed pace:** about 6–8 hours a week. Each stage takes 2–6 weeks. Stages 1–3 can overlap a little; from Stage 4 on, go in order.

**The one rule:** never ship code you can't explain. If AI wrote it, ask it to explain each line, then explain it back in your own words in the PR description.

---

## The big picture

```
 FOUNDATIONS                 AI WORKFLOW            AI PRODUCT
 ───────────                 ───────────            ──────────
 1 Frontend + design system  2 AI in my workflow    4 How LLMs work
 3 Data, APIs, live state                           5 Designing for AI
                                                    6 Build Site Assistant
                                                    7 Evals, safety, cost
                                                    8 Agents and MCP
                                                    9 Ship and tell the story
```

The AI product I'll build is the **Site Assistant**: a chat panel in Live Studio where a person asks questions in plain language ("Why is the kitchen Sensor Stale?", "What was the warmest Space yesterday?") and the assistant answers using real Readings from the API. It's small enough to finish and covers every core AI skill: prompts, tool use, streaming, UX of uncertainty, and evals.

---

## Stage 1: Frontend foundations through the design system

**Why it matters:** AI can write React for me, but I can only judge its output if I understand the basics. The design system is the safest place to learn them, because each component is small.

**Learn**

- [ ] HTML semantics and accessibility: landmarks, labels, `aria-*` only when HTML can't do it, keyboard focus.
- [ ] CSS: the box model, flexbox, grid, custom properties (`var(--shk-…)`), cascade layers (`@layer detriz`), CSS Modules.
- [ ] TypeScript: types vs interfaces, union types (great for states like `'connected' | 'stale' | 'disconnected'`), optional props, generics at a basic level.
- [ ] React: components and props, state (`useState`), effects (`useEffect`) and why to avoid them, composition, controlled vs uncontrolled inputs.
- [ ] Testing: what a unit test is, Vitest, React Testing Library, Storybook interaction tests.

**Build in this repo**

- [ ] Finish the empty categories: one `feedback/` component (for example an empty state or inline error) and one `layout/` component, following `component-building-v2.md`.
- [ ] Add the repo's first tests: Vitest + Testing Library for `DeviceConnectionStatus`, checking that each state renders the right label and that Disconnected hides the value.
- [ ] Add a `test` script to `kit/packages/ui` so `pnpm test` finally runs something.
- [ ] Run an accessibility check on every story (Storybook a11y addon) and fix what it finds.

**AI practice (teach and review)**

- Ask AI to **explain** existing code before changing it: "Explain `DeviceConnectionStatus.tsx` line by line to a designer."
- Write the component yourself, then ask AI to **review** it against the checklist in `component-building-v2.md`.
- Ask AI to quiz you: "Give me 5 questions about React state, one at a time, and grade my answers."

**Done when**

- [ ] I can build a new component from an empty folder without AI writing the code.
- [ ] `pnpm test` runs real tests and they pass.
- [ ] I can explain the difference between props and state, and between a type and an interface, without notes.

---

## Stage 2: AI in my everyday workflow

**Why it matters:** this is the fastest win. Good context and conventions make AI output much better, and it's the same skill (writing clear specs for a reader) I already use as a designer.

**Learn**

- [ ] How coding agents work: they read files, run commands, edit code, and only know what's in their context.
- [ ] Context engineering: `CLAUDE.md`, conventions docs, the Ubiquitous Language. Why short, precise rules beat long ones.
- [ ] Prompting for code: give the goal, the constraints, an example, and the "done when". Ask for a plan before code.
- [ ] Skills and slash commands: turning a repeated workflow into a reusable instruction.
- [ ] Design-to-code with AI: Figma MCP, Code Connect, design tokens as the shared language.
- [ ] Reviewing AI code: read the diff, run it, check edge cases, check it follows the conventions.

**Build in this repo**

- [ ] Turn `component-building-v2.md` into a **project skill** (`.claude/skills/build-component/`) so "build a Battery component" runs the whole checklist the same way every time.
- [ ] Set up **Code Connect** for 2–3 existing components, so Figma shows the real code for each component.
- [ ] Build one component end to end in **Phase 2 mode**: AI builds from a Figma frame, I only direct and review. Write a short note in `docs/retro/` comparing it to a Phase 1 component: time, quality, how much I understood.
- [ ] Add a GitHub Action that runs `typecheck`, `format:check` and `test` on every PR, so AI mistakes get caught automatically.

**AI practice (start building)**

- Always ask for a **plan first**, approve it, then let the agent build.
- Keep a `prompts.md` scratch file of prompts that worked well and why.
- When the agent gets something wrong, fix the **context** (CLAUDE.md, docs, skill), not just the code. That's how the workflow improves over time.

**Done when**

- [ ] A new component built with the skill passes review with only small fixes.
- [ ] CI is green on every PR.
- [ ] I've written a retro comparing Phase 1 and Phase 2.

---

## Stage 3: Data, APIs and live state

**Why it matters:** every AI feature is "UI + data + a model". Before adding the model, I need to be comfortable with the data part: fetching, loading, errors and live updates. This is also exactly the next step in the architecture.

**Learn**

- [ ] How the web talks: HTTP, REST, JSON, status codes, `fetch`, `async`/`await`.
- [ ] API contracts: what OpenAPI is and why the spec comes first.
- [ ] Live data: WebSockets, reconnecting, and how a connection becomes Stale or Disconnected.
- [ ] React data patterns: custom hooks (`useReadings`), loading and error states, a short intro to TanStack Query.
- [ ] Mock data: why mocks let the UI move ahead of the backend.

**Build in this repo**

- [ ] Create `kit/packages/api-spec` with a first `openapi.yaml`: list Sensors, get latest Reading, Connection Status.
- [ ] Create `kit/packages/mock` with realistic Readings, including Stale and Fault cases.
- [ ] Create `kit/packages/client` (fetch + WebSocket, no React) and `kit/packages/react` with one hook and one pre-bound `Live*` component.
- [ ] Show live mock Readings in `frontend/` (the start of Studio) using only design system components.

**AI practice**

- Ask AI to generate the OpenAPI spec from the domain model, then **review it against the Ubiquitous Language** term by term.
- Ask AI to generate mock data with edge cases you'd forget: very long Space names, negative temperatures, missing Readings.

**Done when**

- [ ] Studio shows live (mock) Readings, and unplugging the mock shows Stale, then Disconnected, correctly.
- [ ] I can explain the path of one Reading from the API to the screen.

---

## Stage 4: How LLMs work (for builders)

**Why it matters:** I don't need the maths, but I do need a correct mental model. It explains why AI features fail in the ways they do, and that's what lets me design for it.

**Learn**

- [ ] What a model does: predicts the next token from everything in its context. It has no memory between calls unless I send it.
- [ ] Tokens, context window, and why cost and speed depend on them.
- [ ] Messages: system prompt, user and assistant turns.
- [ ] Settings that matter: model choice (big and smart vs small and fast), max tokens, and thinking/effort.
- [ ] Structured output: getting JSON that matches a schema instead of free text.
- [ ] **Tool use** (function calling): the model asks to call a function, my code runs it, and I send the result back. This is the core of every agent.
- [ ] Streaming: showing the answer as it's generated.
- [ ] Hallucination: why models make things up, and why giving them real data (tools, retrieval) is the fix.

**Build in this repo**

- [ ] A small script in a scratch folder (outside `kit/`) that calls the Claude API with a hard-coded list of Readings and asks "Which Space is the warmest?".
- [ ] Extend it with **one tool**, `get_latest_readings`, that returns mock data, so the model gets the data itself instead of me pasting it in.
- [ ] Make it return structured JSON: `{ spaceName, temperatureC, explanation }`.

**AI practice**

- Use AI as a tutor: "Explain tool use with a smart home example, then show me the smallest working code."
- Read the official API docs alongside, and check what AI tells you against them.

**Done when**

- [ ] I can draw the tool-use loop on paper: user → model → tool call → my code → tool result → model → answer.
- [ ] My script answers correctly from tool data, not from guessing.

---

## Stage 5: Designing for AI

**Why it matters:** this is where my UX background is a superpower. AI output is uncertain, slow and sometimes wrong. Normal UI patterns assume the system is always right, so AI products need new patterns.

**Learn**

- [ ] Setting expectations: tell people what the assistant can and can't do, up front.
- [ ] Showing work and sources: link every claim to the Reading it came from.
- [ ] Uncertainty and errors: "I don't know" is a valid answer, and it needs its own design.
- [ ] Control: people can stop, edit, retry and undo. Human-in-the-loop for anything that changes the real world (for example toggling a Switch).
- [ ] New UI states: thinking, streaming, tool running ("Checking the kitchen Sensor…"), partial answer, failed tool, rate limited.
- [ ] Trust over time: when to show more detail and when to stay quiet.

**Build in this repo**

- [ ] Write a short UX spec for the Site Assistant in `docs/product-requirements/`: user stories, the questions it must answer, what it must refuse.
- [ ] Design the assistant UI in Figma using the existing tokens.
- [ ] Add assistant components to the design system (for example `AssistantMessage`, `ToolActivity`, `ReadingCitation`). Each one covers the AI states above, plus `LongText` and `Minimal` stories. Write an **ADR** first, because this adds a new component category.
- [ ] Rule to keep: `ui` stays presentational. Assistant components take text and states as props and never call the model.

**AI practice**

- Ask AI to **critique** your assistant designs against an AI design guideline (see Resources), then decide which feedback to keep.
- Ask AI to role-play a confused user and an adversarial user of the assistant, to find gaps in the spec.

**Done when**

- [ ] Every assistant state has a story in Storybook.
- [ ] The spec says clearly what the assistant does when it doesn't know, when a Sensor is Disconnected, and when a tool fails.

---

## Stage 6: Build the AI feature: Site Assistant

**Why it matters:** this is the first real AI product. It brings together everything from Stages 1–5.

**Learn**

- [ ] Why the API key must live on the server, never in the browser.
- [ ] Streaming from a backend to the browser (server-sent events).
- [ ] Writing a good system prompt: role, rules, domain terms, what to do when unsure.
- [ ] Designing tools: clear names, clear descriptions, small inputs, useful errors.
- [ ] Conversation state: what to keep, what to trim when the context gets long.

**Build in this repo**

- [ ] Add an `/assistant` endpoint to the FastAPI backend (or a small server in `platform/` if the backend doesn't exist yet). It calls the model with tools that wrap the real API: `list_sensors`, `get_latest_reading`, `get_connection_status`, `get_reading_history`.
- [ ] Stream answers to Studio and render them with the assistant components from Stage 5.
- [ ] Show tool activity live and link answers to the Readings they used.
- [ ] Start **read-only**. If you later add actions (like toggling a Switch), always ask the person to confirm first.

**AI practice**

- Let an agent build most of the plumbing (Phase 2), but write the **system prompt and tool descriptions yourself**. Those are product design decisions.

**Done when**

- [ ] I can ask "Which Sensors are Stale right now and since when?" and get a correct, sourced answer from live (or mock) data.
- [ ] Turning off the model's access to a tool makes it say it can't answer, instead of making something up.

---

## Stage 7: Evals, safety and cost

**Why it matters:** with normal code, a test passes or fails. AI answers vary, so you need **evals**: a set of test questions with expected behaviour that you run after every prompt change. This is what separates a demo from a product.

**Learn**

- [ ] Evals: a test set of questions, expected answers or rules, and a score.
- [ ] Grading: exact checks where possible (did it call the right tool?), and a model as a grader for open answers ("LLM as judge").
- [ ] Prompt injection: text inside data (for example a Sensor name like "ignore your rules") trying to take over the model. Basic defences.
- [ ] Privacy: what data leaves the Site and goes to the model provider.
- [ ] Cost and speed: tokens per answer, prompt caching, picking a smaller model where it's good enough.
- [ ] Observability: logging prompts, tool calls and answers so you can debug.

**Build in this repo**

- [ ] Create `evals/site-assistant/` with 20–30 questions, including edge cases: Disconnected Sensors, a Fault, an unknown Space, a question it should refuse.
- [ ] A script that runs all evals and prints a score. Run it before and after every prompt change.
- [ ] Log the token count and cost per conversation, and show it in a dev-only panel.

**AI practice**

- Ask AI to generate tricky eval questions, then review and keep the realistic ones.
- Treat the eval score like CI: no prompt change merges if the score drops.

**Done when**

- [ ] The eval suite runs with one command and the score is written in the PR for every prompt change.
- [ ] I know roughly what one conversation costs.

---

## Stage 8: Agents and MCP

**Why it matters:** an agent is a model in a loop with tools, deciding the next step itself. MCP (Model Context Protocol) is the standard way to give any AI app access to your tools and data. Knowing both lets me build AI features _and_ make my own products usable by other people's agents.

**Learn**

- [ ] The agent loop: plan, act with a tool, look at the result, repeat, stop.
- [ ] When an agent is the right answer and when a simple single call is better (most of the time).
- [ ] MCP basics: servers expose tools and resources; clients like Claude Code or Claude desktop use them.
- [ ] Multi-step safety: limits on steps, confirmation before actions, clear stop conditions.

**Build in this repo**

- [ ] An **MCP server for the design system** in `kit/`: tools like `list_components`, `get_component_docs` and `get_tokens`, read from the `.md` files and `tokens.json`. Then any coding agent can build Studio screens with the right components and tokens. This is a strong design engineer portfolio piece.
- [ ] An **MCP server for the Site** in `platform/`: the same tools as the Site Assistant, so I can ask about my Hub from Claude desktop.
- [ ] Optional: a "dashboard builder" agent that composes a Studio layout from design system components based on a request like "a page for the bedroom".

**AI practice**

- Use your own MCP server while building Studio. Notice where the agent still gets things wrong, and improve the docs it reads.

**Done when**

- [ ] A coding agent, using only my MCP server, builds a correct Studio screen with my components and tokens.

---

## Stage 9: Ship it and tell the story

**Why it matters:** a learning project only counts in a portfolio if people can see it and understand the decisions behind it.

**Build in this repo**

- [ ] Deploy Storybook and Studio (with mock data) publicly.
- [ ] Write a case study: the problem, the design system, the AI assistant, what evals taught me, Phase 1 vs Phase 2.
- [ ] Record a 2-minute demo of the Site Assistant.
- [ ] Make sure ADRs cover the big decisions (assistant category, where the model runs, MCP servers).

**Done when**

- [ ] Someone who has never seen the repo can understand what I built and why in 5 minutes.

---

## Weekly rhythm

A simple loop to stay consistent:

| When        | What                                                                                                                        | Time   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ------ |
| Session 1   | **Learn**: read or watch one concept from the current stage, take short notes in my own words                               | 1–2 h  |
| Session 2–3 | **Build**: one small task from the stage, one branch, one PR                                                                | 3–4 h  |
| End of week | **Reflect**: 5 lines in `docs/retro/`: what I learned, what AI did well, what it got wrong, what I'll change in the context | 30 min |

Tips:

- Keep PRs small: one component, one hook, one tool.
- When stuck for more than 30 minutes, ask AI to explain, not to fix.
- Every few weeks, rebuild something small **without** AI, to check what I really know.

---

## AI glossary for designers

| Term                    | Plain meaning                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| **LLM**                 | Large language model. Predicts text one token at a time.                                         |
| **Token**               | A piece of a word. Cost, speed and limits are counted in tokens.                                 |
| **Context window**      | Everything the model can "see" in one call: instructions, chat history, data.                    |
| **System prompt**       | Instructions that set the model's role and rules. Like a brief for a new teammate.               |
| **Tool use**            | The model asks my code to run a function (like "get Readings") and uses the result.              |
| **Agent**               | A model in a loop that picks tools and steps by itself until the task is done.                   |
| **MCP**                 | Model Context Protocol. A standard plug for connecting tools and data to AI apps.                |
| **RAG**                 | Retrieval-augmented generation. Find relevant documents first, then give them to the model.      |
| **Structured output**   | Model output that follows a fixed JSON shape, so code can use it safely.                         |
| **Streaming**           | Showing the answer while it's being written, instead of waiting for all of it.                   |
| **Hallucination**       | A confident answer that isn't true. Fixed with real data and good UX, not hope.                  |
| **Eval**                | A repeatable test set for AI behaviour, scored after every change.                               |
| **Prompt injection**    | Text inside data that tries to change the model's instructions.                                  |
| **Context engineering** | Deciding what the model sees: docs, rules, examples, data. The real skill behind good AI output. |

---

## Resources

Start with official docs. Use AI to explain them, not to replace them.

**Frontend**

- [react.dev](https://react.dev/learn): the official React tutorial.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html).
- [web.dev Learn](https://web.dev/learn): CSS, accessibility and HTML courses.
- [Testing Library docs](https://testing-library.com/docs/react-testing-library/intro/).

**AI building**

- [Claude docs](https://docs.claude.com): prompting, tool use, streaming, evals.
- [Anthropic courses on GitHub](https://github.com/anthropics/courses): prompt engineering and tool use, hands-on.
- [Model Context Protocol](https://modelcontextprotocol.io): concepts and how to build a server.
- [Claude Code docs](https://docs.claude.com/en/docs/claude-code/overview): CLAUDE.md, skills, subagents, MCP.

**Designing for AI**

- [Google PAIR: People + AI Guidebook](https://pair.withgoogle.com/guidebook/).
- [Microsoft HAX: Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/).
- [Shape of AI](https://www.shapeof.ai): a library of AI UX patterns.

---

## Progress tracker

| Stage                      | Status      | Started | Finished | Retro note |
| -------------------------- | ----------- | ------- | -------- | ---------- |
| 1. Frontend foundations    | In progress |         |          |            |
| 2. AI in my workflow       | In progress |         |          |            |
| 3. Data, APIs, live state  | Not started |         |          |            |
| 4. How LLMs work           | Not started |         |          |            |
| 5. Designing for AI        | Not started |         |          |            |
| 6. Site Assistant          | Not started |         |          |            |
| 7. Evals, safety, cost     | Not started |         |          |            |
| 8. Agents and MCP          | Not started |         |          |            |
| 9. Ship and tell the story | Not started |         |          |            |
