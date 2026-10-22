#  Design system architecture 


### Component Categories

Components in the DeTriz Home design system are grouped by **the question they answer** for the person looking at the screen, not by sensor type. Components are sensor-agnostic: the sensor is passed in through props (e.g. `<ReadingCard sensor="temperature" />`).

| Category | Question it answers | What belongs here | Components |
|---|---|---|---|
| **Context** | "Where is this / what is it?" | Static, descriptive information about places, sensors, devices and time. Never changes on its own. | |
| **Readings** | "What is it right now?" | The current value of a single measurement. | |
| **History** | "How has it changed?" | Data over time: trends, past values, summaries. | |
| **Comparison** | "How do sensors relate to each other?" | Several sensors or metrics shown together. | |
| **Status** | "Is everything OK?" | Changing state of the physical world or hardware: health, connection, alerts. | |
| **Feedback** | "What is the interface doing?" | State of the UI and data flow: loading, empty, errors, confirmations. | |
| **Controls** | "How do I change what I see?" | Inputs that change the view or settings. | |
| **Layout** | "How is it arranged?" | Structure and spacing for placing other components. | |

## Rules for placing a component

- **One component, one category.** If a component fits two categories, it's probably doing two jobs and should be split or treated as a composition.
- **Composites keep the category of their main job.** A `ReadingCard` that uses `SensorLabel` inside stays in **Readings**.
- **Context vs Status:** Context is a fixed fact ("Floor 2", "Updated 5 s ago"). Status is a changing state ("Offline", "Battery low", "Air quality: poor").
- **Status vs Feedback:** Status describes the hardware or environment. Feedback describes the interface ("Loading…", "Couldn't fetch data").
- **Clickable means Controls.** If a descriptive component becomes interactive (e.g. a clickable location path), the interactive version belongs in **Controls**.
- **Sensor support is metadata, not a category.** Label each component with the sensors it works with (e.g. "works with: temperature · light · air quality").

## Variant naming

Variants describe **shape, not device**, so they can be chosen based on available space:

| Prop | Values | Meaning |
|---|---|---|
| `layout` | `inline` | All items in one row |
| | `grid` | Items in a 2×2 arrangement |
| | `stack` | One item per row |

Use the same property name and values in Figma and in code.