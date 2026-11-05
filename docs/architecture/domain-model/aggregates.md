# Aggregates

Internal design notes, moved from the public [Data model](../../../kit/apps/docs-site/docs/domain-model/data-model.mdx) page: app builders don't need them, the backend does.

In Domain-Driven Design an **aggregate** is a group of things that are always changed together, through one "root" entity. Other parts of the system point at the root by its ID and never reach inside.

| Aggregate   | Root    | Contains                        | Points to (by ID)                          |
| ----------- | ------- | ------------------------------- | ------------------------------------------ |
| **Site**    | Site    | Floors, Spaces, Assets          | Account, Space Type, Asset Type            |
| **Hub**     | Hub     | Modules, Sensors, Device Status | Account, Space, Module Type, Metric, Asset |
| **Reading** | Reading | (nothing; it's a single fact)   | Sensor, Metric, Subject                    |

**Reference data** never changes during normal use and is shared by everyone: Space Type, Asset Type, Module Type, Metric, Unit, Device Kind, Fault Code.

Why Readings are their own aggregate: there are millions of them and they never change, so they shouldn't be loaded every time someone renames a Hub.
