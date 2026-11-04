# Landing page copy — ideas

Copy ideas for the Phase 1 (POC) landing page. Claims stick to what the POC ships (components, tokens, domain model, docs). The Raspberry Pi, API Simulator and AI features are framed as "coming next", so the page doesn't promise what isn't built yet.

## Chosen headline

> **Rapid prototyping for smart home apps.**
> Skip the groundwork. The domain model and components are ready. Start building on day one.
> See how it works

Why: "rapid prototyping" is a well-known UX and design method (build fast, test early, learn, repeat), so the audience recognises it. In maker culture it also means prototyping with hardware like a Raspberry Pi, so the headline stays true in Phase 2 without being rewritten.

### Subheadline options

The subheadline says you skip the groundwork (the domain model, building components) and go straight to building.

**"Skip the groundwork"**

- _Skip the groundwork. The domain model and components are ready, so you start building on day one._
- _The domain model is mapped and the components are built. You just start building._
- _No modelling, no component setup. Go straight to building your idea._

**"Already done for you"**

- _The smart home is already mapped and the components already built. Your idea is the only thing missing._
- _We've done the thinking: a ready-made domain model and components in Figma and React._
- _Devices, Sensors, Readings and states are already modelled and designed. Start with your idea, not the basics._

**Focus on the reader's idea**

- _Spend your time on the idea, not the setup. The domain model and components come ready to use._
- _Ready-made domain model and components, so every hour goes into your app._
- _Start where the interesting part begins: the domain model and components are ready._

**Short and punchy**

- _The model's mapped. The components are built. Start building._
- _Everything ready but your idea._
- _Skip the setup. Start with the idea._

### Subheadlines that name the domain model

"The model's mapped" was too vague and repeated "build". These variants say what the domain model actually contains, since it's the kit's biggest advantage:

- **Names:** Site, Space, Hub, Sensor, Reading (the Glossary)
- **How things relate:** the Data model
- **How Devices change status:** Connected, Stale, Disconnected, Fault (the Device lifecycle)
- **Events and commands**

Each ends with "Start prototyping." to echo the headline and avoid the double "build".

**Name the parts of the model**

- _Sites, Spaces, Sensors and Readings: mapped. Components: designed. Start prototyping._
- _Every Sensor, Reading and status already defined. Every component ready. Start prototyping._
- _Sensors, Readings and device states, already modelled. Components, ready to use. Go._

**Name what the model does for you**

- _The names, relationships and device states are worked out. The components are ready. Start prototyping._
- _How a smart home is structured, named and behaves: already defined. The components: ready. Your turn._
- _Names agreed. Relationships mapped. Device states defined. Start prototyping._

**Lead with the smart home domain**

- _The smart home domain, fully mapped. The components, ready to use. Start prototyping._
- _A complete smart home domain model and matching components. Start with your idea._
- _The smart home, already mapped, from Site to Sensor to Reading. Components ready. Start prototyping._

**Focus on device states (the hard part designers usually forget)**

- _Connected, Stale, Disconnected, Fault: every device state already defined and designed. Start prototyping._
- _Sensors that go quiet, Readings that go stale: already modelled, already designed. Start prototyping._

### Current favourites

> **Rapid prototyping for smart home apps.**
> _The smart home, already mapped, from Site to Sensor to Reading. Components ready. Start prototyping._

Shows how deep the model goes with real terms; "from … to …" suggests it covers everything.

Alternatives:

- _Names agreed. Relationships mapped. Device states defined. Start prototyping._ Says what the model does in plain words, for designers who don't know "domain model".
- _Connected, Stale, Disconnected, Fault: every device state already defined and designed. Start prototyping._ Most memorable: names a pain point designers know.
- _The smart home is already mapped and the components already built. Your idea is the only thing missing._ The earlier favourite; less specific about the model.

### Notes

- Avoid "domain model" in the subheadline if possible: designers may not know the term. "The smart home is already mapped" says the same in plain words; the value section can explain it in detail.
- Don't say "no hardware" or "skip the soldering" anywhere. Phase 2 adds a Raspberry Pi, so those lines would contradict the product.
- "Prototype" can sound like "throwaway". The React components are meant for production, so the copy should say the work carries through to the real app.
- Use Glossary terms (Space, not "room"), as CLAUDE.md asks for UI copy. "Rooms" would be friendlier for first-time visitors; decide whether the landing page should bend this rule.
- In Phase 2, keep the headline and extend the subheadline, for example: _"…and connect real Sensors when you're ready."_

## 1. Earlier headline ideas

These came before the headline was chosen. Lines that say "no hardware" or "skip the soldering" no longer fit (see Notes above).

### Direction A — Speed (the core promise)

- **Smart home UIs, minus the groundwork.**
  _Components, design tokens and a ready-made domain model, so you can start on the screens that matter._
- **From idea to smart home app in an afternoon.**
  _A design and code kit for interfaces that show live Sensor data._

### Direction B — "Skip the hard part" (for designers afraid of hardware)

- **Design for the smart home. Skip the soldering.**
  _Build real smart home interfaces without learning electronics or firmware._
- **No wires. No firmware. Just the interface.**

### Direction C — Designer and developer in sync

- **One kit. Figma to React, same language.**
  _The same components in Figma and in code, built on one shared model of the smart home._
- **Designers and developers, finally talking about the same "Sensor".**

### Direction D — Bold or playful

- **Your thermostat deserves better UX.**
- **Smart homes have dumb interfaces. Let's fix that.**
- **Stop drawing fake temperature cards.**
  _Use components that already know what Stale, Disconnected and Fault look like._

### Around "Prototype, design and build your smart home app ideas"

- **Design, prototype and build smart home apps.** _Components, tokens and a ready-made domain model, from first sketch to shipped code._
- **Sketch it. Prototype it. Ship it.** _A smart home UI kit for designers and developers._
- **From smart home idea to working app.** _Design, prototype and build with one kit._
- **Your smart home idea, designed, prototyped and built.**

### Headlines that grow into Phase 2

| Headline                                  | Phase 1                                                       | Phase 2                                                               |
| ----------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| **From smart home idea to working app.**  | _Design, prototype and build with one kit._                   | _Design, prototype and build, then connect real Sensors._             |
| **Design. Prototype. Build.**             | _Smart home apps, from Figma to production._                  | **Design. Prototype. Build. Connect.** _From Figma to a real Sensor._ |
| **Build smart home apps that feel real.** | _Components that already handle lost connections and Faults._ | **Build smart home apps that are real.**                              |

### Rapid prototyping variations

- **The rapid prototyping kit for smart home apps.**
- **Prototype fast. Test early. Build what works.**
- **Prototype fast. Ship for real.**
- **Start as a prototype. End as a product.**
- **Idea in the morning. Prototype by lunch.**

## 2. Value points (three columns under the hero)

1. **The model is already mapped.** Site, Space, Hub, Sensor, Reading: named, connected and documented, so you don't start from a blank whiteboard.
2. **Every state is designed.** Loading, Connected, Stale, Disconnected, Fault. Real devices go offline, and your UI will already handle it.
3. **Figma and React, in sync.** Design in Figma, then build with the same components from npm.

Short alternatives: _"Mapped. Designed. Coded."_ or _"Model. Components. Docs."_

## 3. "Who it's for" section

> **Built for people who make interfaces, not circuit boards.**
>
> - **Product designers:** design smart home screens with components that cover the messy real-world states.
> - **Creative technologists:** prototype fast and connect real data later.
> - **Frontend developers:** typed React components, themed with tokens, installable from npm.

## 4. The problem (a short "why" paragraph)

> Smart home apps look simple: a number, an icon, a room name. Then reality shows up. Sensors go quiet, connections drop, readings go stale, and suddenly nobody agrees what a "device" even is. DeTriz gives you that thinking already done, so you can spend your time on the experience.

## 5. "Coming next" teaser (roadmap)

> **Today:** components, tokens and the domain model.
> **Next:** a real Sensor on a Raspberry Pi, a typed API and a client SDK. Same components, real data.
> **Later:** an API Simulator, plus AI tools that build screens with the kit.

Headline ideas:

- _"Today it's pixels. Next it's a real Sensor."_
- _"Start with the screens. The hardware is coming."_

## 6. Calls to action

- **Primary:** Get started / Install the kit / Start building
- **Secondary:** Browse components / Open the Figma library / See the domain model
- **Validation** (the POC's job is to test whether the idea resonates): Join the waitlist for hardware / Tell us what you'd build

A waitlist or feedback CTA gives a way to measure the Phase 1 goal.

## 7. Footer tagline

- _Smart home UI, done right from the first Reading._
- _Built for the moments your Sensor goes quiet._
- _Made by a designer learning to code, for people like you._ (honest and personal, fits a learning project)
