# Missing components

The components to build for the generative UI MVP, in build order. Use this file as the task list when building them.

## Context

DeTriz Smart Home Kit is a design system, SDK and Live Studio for prototyping with live sensor data. The [generative UI concept](generative-ui-concept.md) adds a feature to Studio: a person describes a screen in plain language, and Studio builds it from real kit components using live Readings.

The model doesn't write code or CSS. It returns a View Spec, a JSON description of a screen, using only the components listed in a curated Component Catalog. A renderer turns that View Spec into real components, and live data reaches them through the usual hooks. The model never sees or writes Readings.

This means each component must work safely in any arrangement the model chooses. It has to handle its own states, fit a narrow container and make sense without extra explanation.

**MVP scope:** one Site with several Spaces, the Climate, Light and Air Quality Modules, the six existing Metrics, read-only screens and mock data. The [components review](design-system-components-review.md) explains the reasons behind this list and what's left out.

| Who uses it | Components |
| --- | --- |
| The model, through the Catalog | `StackLayout`, `ColumnLayout`, `ContentSection`, `ModuleCard`, `SpaceCard` |
| The renderer and Studio only | `Notice` |
| Studio only | `Button`, `TextArea` |

`LocationPath` already exists and is also in the Catalog.

## How to build

- **Workflow:** follow the [component workflow](../architecture/design-system/workflows/component-building-v2.md) and its checklist for each component. Follow the component conventions and domain language in `CLAUDE.md`.
- **Reference examples:** use `status/DeviceConnectionStatus` for states and `context/LocationPath` for variants.
- **Folders:** paths below are relative to `kit/packages/ui/src/`.
- **Scope:** these components are presentational. They take props and never fetch data, call a model or know about the View Spec. The renderer and the `Live*` components are separate work.
- **Branches:** build one component per branch, in the order below, and tick it off here once it's merged.
- **Older names:** `generative-ui-concept.md` still uses `Stack` and `Columns`. The names in this file are the final ones.

## Checklist

- [x] 1. `StackLayout`
- [x] 2. `ColumnLayout`
- [ ] 3. `ContentSection`
- [ ] 4. `ModuleCard` update
- [ ] 5. `SpaceCard`
- [ ] 6. `Notice`
- [ ] 7. `Button`
- [ ] 8. `TextArea`

## 1. `StackLayout`

The simplest layout component and the root of most generated screens. It puts things one under the other, such as a `LocationPath` above a row of cards. It adds only spacing, with no background or border, so it stays invisible and works inside any other component.

| | |
| --- | --- |
| Folder | `components/layout/StackLayout/` |
| Size | Small |
| Job | Places children in one column with an even gap. |
| Key props | `children`, `gap` (named options, never pixels) |
| Stories | One per `gap` option, `LongText`, `Minimal` |

## 2. `ColumnLayout`

The main way a screen shows what matters most. `2:1` makes one item the focus with a smaller one beside it, and `equal` treats all items the same, such as a row of `SpaceCard`s. The small set of ratios is deliberate: the model can only choose layouts you have tested.

| | |
| --- | --- |
| Folder | `components/layout/ColumnLayout/` |
| Size | Medium |
| Job | Places children side by side, which is how a screen shows importance. |
| Key props | `children`, `ratio`: `equal`, `2:1` or `1:2` |
| Stories | One per `ratio`, narrow container, `LongText`, `Minimal` |

Done when:

- `equal` wraps onto new rows, so it also works as the Site grid.
- It becomes one column based on its own width (a container query), like `ModuleCard`.
- Reading order matches the order of `children`.

## 3. `ContentSection`

Gives a screen its title and splits it into named groups, such as "Air quality" and "Comfort". This helps people scan the page, and real headings let screen reader users jump between groups. The heading is the only text on a generated screen that the model writes itself, so it stays short and plain.

| | |
| --- | --- |
| Folder | `components/layout/ContentSection/` |
| Size | Small |
| Job | A heading with a group of children. |
| Key props | `title`, `headingLevel`, `children` |
| Stories | One per heading level, `LongText`, `Minimal` |

Done when:

- `title` is rendered as plain text.
- `headingLevel` is a prop, so the renderer can set it from nesting.

## 4. `ModuleCard` update

`ModuleCard` already handles every target state, so it stays the main building block for one Space. It needs two additions. Read-only mode keeps generated screens from changing real Modules, and `emphasis` makes one card stand out, which supports requests like "make CO₂ bigger".

| | |
| --- | --- |
| Folder | `components/readings/ModuleCard/` (existing) |
| Size | Medium |
| Job | Adds a read-only mode and more visual weight. |
| Prop changes | `onToggle` becomes optional. New `emphasis`: `default` or `high`. |
| New stories | `ReadOnly`, `ReadOnlyOff`, `HighEmphasis` |

Done when:

- Without `onToggle`, no Switch is drawn.
- An Off Module in read-only mode shows a plain "Off" text, so it still differs from Disconnected.
- `high` draws Sensors at `lg`, and the longest values still fit. This needs a wider minimum Sensor width and new switching widths.
- `ModuleCard.md` and the Figma component are updated.

## 5. `SpaceCard`

A compact summary of one Space: its name, its Faults and one row per Metric. It keeps whole-home screens readable, because a Site overview shows one card per Space instead of a `ModuleCard` for every Module. Showing only some Metrics also answers prompts like "temperature in every room".

| | |
| --- | --- |
| Folder | `components/readings/SpaceCard/` |
| Size | Medium |
| Job | Shows one Space at a glance, the building block of whole-home screens. |
| Key props | `name`, `readings`, `faults` |
| Stories | Connected, loading, Stale, Disconnected, Fault, one Metric only, `LongText`, `Minimal` |

The prop types are sketched in the [components review](design-system-components-review.md#spacecard-readings-medium).

Done when:

- Each row uses the Connection Status of its own Module. The card has no overall status.
- A Disconnected row hides its value and shows the disconnected icon.
- A Stale row says Stale.
- Faults use `DeviceFaultStatus`.
- It has no Switch and calculates no averages.

## 6. `Notice`

One simple message component that covers several cases, such as "The Bedroom has no Paired Modules" or "Noise isn't a Metric the kit measures". It lets a screen say what it can't show, so nothing gets faked. Only the renderer and Studio use it. The model never places it, so it can't write claims about the Site.

| | |
| --- | --- |
| Folder | `components/feedback/Notice/` |
| Size | Small |
| Job | A short message for empty Spaces, removed Modules, limits, the rationale and failures. |
| Key props | `tone`: `info`, `warning` or `error`. `children`. |
| Stories | One per `tone`, `LongText`, `Minimal` |

Done when:

- `tone` isn't shown by colour alone.
- It uses the existing status tokens.
- The `.md` file says why the target states don't apply.

## 7. `Button`

The kit's first general action component, used in Studio around the generated screen. Clarifying questions such as "Which Space?" show each option as a `Button`, so no separate chip component is needed yet. The model can't place a `Button`, which keeps generated screens free of actions.

| | |
| --- | --- |
| Folder | `components/controls/Button/` |
| Size | Small |
| Job | Sends a prompt, retries, undoes and answers a clarifying question. |
| Key props | `children`, `onClick`, `variant`: `primary` or `secondary`, `isDisabled` |
| Stories | Each variant, disabled, `LongText`, `Minimal` |

Done when:

- It uses a real `<button>` and has a visible focus state.
- The `.md` file covers each state it needs, including disabled.

## 8. `TextArea`

Where a person types what they want to see. It takes several lines, because a prompt can be a full sentence or more. It's disabled while a screen builds, and the text stays in place after a failure so the person can retry without retyping. Like `Button`, it belongs to Studio and isn't something the model can place.

| | |
| --- | --- |
| Folder | `components/controls/TextArea/` |
| Size | Small |
| Job | The prompt box. |
| Key props | `label`, `value`, `onChange`, `placeholder`, `errorMessage`, `isDisabled` |
| Stories | Empty, filled, error, disabled, `LongText`, `Minimal` |

Done when:

- The label is visible and linked to the field.
- The error message is linked to the field, so screen readers read it.
