This file defines user needs using the Jobs to Be Done (JTBD) framework, which describes the progress users are trying to make in a given situation rather than the features they ask for.

**Table of content**
[Customer profile](#customer-profile-)

[Main job](#main-job)

[Job story](#job-story)

[Job map](#job-map)

[Customer needs](#customer-needs-desired-outcomes)

[Emotional jobs](#emotional-and-social-jobs)

---

### Customer profile

Product designers, creative technologists, and frontend developers who need to test IoT ideas with real sensor data but don't have the electronics or embedded programming skills to build hardware prototypes themselves. They typically work in product teams or agencies that need to judge an idea's feasibility quickly before committing engineering resources.

### Main job

_The main job is the core goal the user is trying to achieve. It is written as a verb plus an object and doesn't mention any product or solution, so it stays true even as technology changes._

Validate IoT product ideas using real sensor data.

### Job story

_A job story describes the context behind the job. It explains when the need appears (situation), what the user wants to do (motivation), and why it matters to them (outcome). It focuses on the circumstances that trigger the need, not on who the user is._

- **Situation:** When my team needs to check whether an IoT product idea is feasible and worth investing in,
- **Motivation:** I want to quickly build a working prototype with live sensor data, without dealing with electronics (circuits, wiring, soldering) or low-level integration code (drivers, protocols, data pipelines),
- **Outcome:** so I can focus on what the data means for the user experience, build proofs of concept fast, and decide confidently which ideas to pursue.

### Job map

_A job map breaks the main job into the stages the user goes through from start to finish. It describes what the user is trying to accomplish at each stage, not how a particular tool does it. This helps reveal where users struggle and where a product can help._

1. **Define:** Decide which idea to test and what data it needs (e.g. temperature, light, air quality).
2. **Locate:** Find the sensors and tools that can provide that data.
3. **Prepare:** Set up the hardware and get the sensors working.
4. **Confirm:** Check that readings are accurate and that I understand what they mean.
5. **Execute:** Connect live data to my prototype or existing system and build the experience.
6. **Monitor:** Test the prototype with users or stakeholders in real conditions.
7. **Modify:** Adjust the idea, swap or combine sensors, and iterate.
8. **Conclude:** Evaluate the results, share the findings, and decide whether to go ahead.

### Customer needs (desired outcomes)

_Desired outcomes are the measurable criteria users apply to judge how well a job is getting done. Each one states a direction (minimize or maximize), a metric (time, likelihood, effort), and what it applies to. Together, they define what "better" means from the user's point of view and can be used to prioritize features._

- Minimize the time it takes to set up and configure sensor hardware.
- Minimize the time it takes to get live sensor data into my prototype or system.
- Minimize the amount of low-level code needed to connect sensors to an app.
- Minimize the time it takes to understand how a sensor works and what its readings mean.
- Minimize the likelihood of misinterpreting sensor data.
- Minimize the likelihood of hardware or connection errors during a test.
- Minimize the time it takes to add, swap, or combine sensors when iterating.
- Minimize the time it takes to build a UI that displays sensor data.
- Maximize the chance that prototype code and components can be reused in the real product.
- Minimize the time it takes to present prototype results to stakeholders.

### Emotional and social jobs

_Beyond the practical task, users also want to feel a certain way (emotional jobs) and be seen a certain way by others (social jobs). These often influence which solution people choose as much as the functional job does._

- **Emotional:** Feel confident presenting a working demo instead of a static mockup.
- **Social:** Be seen as someone who can validate ideas independently, without waiting for engineering support.
