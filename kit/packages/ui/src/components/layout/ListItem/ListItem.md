# ListItem

> Spec for the team: decisions, Figma mapping and open questions. The user docs page is [`list.mdx`](/kit/apps/docs-site/docs/ui-components/layout/list.mdx) (one page for `List` and `ListItem`). Props are defined in [`ListItem.types.ts`](./ListItem.types.ts).

### Purpose

One row in a [`List`](../List/List.md): something on the left, a title and a description in the middle, something on the right. Like `Card`, anything can go in it, and it can be clickable. Typical rows:

- a room in a list of the flat: Kitchen icon · "Kitchen" / "Ground floor" · 22.4 °C, opens the room
- a Metric in a list of Readings: `SensorLabel` Temperature · 22.4 °C
- a Module in a list of Devices: "Climate Module" / "Bedroom" · Connected

It adds no data of its own. It takes props only and never fetches anything. It always sits inside a `List`, because it renders an `<li>`.

Figma: `ListItem` component set in _DeTriz - Smart Home Kit_ (node `526:57`), page `List`. Variant properties `isInteractive` and `state`. The `List examples` frame (node `526:215`) shows a Readings list in a `Card`, a Module row, `LongText` and `Minimal`.

### Component in domain model context

Category: **Layout** ("How is it arranged?"), like `Card`. It shows no domain terms of its own: `title` and `description` are free text, and the parent puts domain components in `start` and `end`.

What it does **not** do, and why:

- **Know what it lists.** A Space, a Module and a Metric look the same to it. [`DeviceListItem`](../../status/DeviceListItem/DeviceListItem.md) (Status) is a ListItem made for Devices, with typed props.
- **Show a status for a Space.** A Space has no status. Put a `DeviceConnectionStatus` in `end` only for a row about one Device.
- **Select rows** (checkboxes, a chosen row). That's a picker or a Control, not a list row. Not in v1.
- **Know the app's routes.** Same as `Card`: a plain `href` or an `onClick`.

### Visual idea

| Question                        | Answer                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A row: `start` on the left, title (and description under it) next to it, `end` on the right. |
| Icons?                          | None of its own. `start` usually holds an `Icon`, a `SpaceLabel` or a `SensorLabel`.         |
| Separators?                     | Not in ListItem. `List` adds a line between rows when asked (`hasDividers`).                 |
| More than one layout?           | One. Parts are optional. A clickable row adds interaction looks, the same as `Card`.         |
| Text size                       | Title `body` (16px), description `body-sm` (14px) in secondary grey.                         |

```
┌──────────────────────────────────────────────┐
│ [🍳]  Kitchen                       22.4 °C  │
│       Ground floor                           │
└──────────────────────────────────────────────┘
  start  title / description            end
```

The row fills the width of its `List`. Title and description each stay on one line and end with "…"; `start` and `end` never shrink. A clickable row is at least 44px tall (the kit's touch target, `size-11`).

### Variants

**Interaction** (Figma variant properties `isInteractive` and `state`). The same as `Card`: in code, the row is interactive when `href` or `onClick` is given, and the browser sets hover, pressed and focus.

| Figma variant                        | Code                    | Looks                                                                |
| ------------------------------------ | ----------------------- | -------------------------------------------------------------------- |
| `isInteractive=false, state=default` | no `href`, no `onClick` | The plain row.                                                       |
| `isInteractive=true, state=default`  | `href` or `onClick`     | Same as the plain row, plus a pointer cursor.                        |
| `isInteractive=true, state=hover`    | `:hover`                | Fill `action/secondary/bg-hover`, 8px corners.                       |
| `isInteractive=true, state=pressed`  | `:active`               | Fill `action/secondary/bg-pressed`, 8px corners.                     |
| `isInteractive=true, state=focus`    | `:focus-visible`        | 2px `action/focus` ring drawn inside the row, so rows don't overlap. |

**Parts shown:**

| Part          | Shown when                                                | Figma property                                          |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `start`       | `start` is given                                          | `hasStart`                                              |
| `title`       | `title` is given                                          | `hasTitle` (hides the whole text block), `title` (text) |
| `description` | `description` is given                                    | `hasDescription`, `description` (text)                  |
| `details`     | `details` is given                                        | `hasDetails`, slot `details`                            |
| `end`         | `end` is given                                            | `hasEnd`                                                |
| `divider`     | the `List` has `hasDividers` and this isn't the first row | `hasDivider`                                            |

Target states:

| Target state | Applies? | Why                                                                             |
| ------------ | -------- | ------------------------------------------------------------------------------- |
| loading      | no       | The row shows no value. Components in `end` show their own loading state.       |
| Connected    | no       | Connection Status belongs to a Device. Put a `DeviceConnectionStatus` in `end`. |
| Stale        | no       | Same as above.                                                                  |
| Disconnected | no       | Same as above.                                                                  |
| Fault        | no       | Faults belong to Devices, shown with `DeviceFaultStatus`.                       |

### Anatomy

```
root (li)                the row: padding, hover fill, divider line on top
├── lead                 Figma only: start + text, fills the row so end stays on the right
│   ├── start            slot: e.g. Icon, SpaceLabel, SensorLabel
│   └── text
│       ├── title        one line, ends with "…". In a clickable row: the <a> or <button>
│       ├── description  one line, ends with "…"
│       └── details      slot: e.g. a list of DeviceFaultStatus, 4px below
├── end                  slot: e.g. a SensorReading, a DeviceConnectionStatus
└── focus-ring           Figma only, in state=focus (code uses an outline)
```

1. **root**: one row, items centred vertically, 12px between parts. Padding 8px top and bottom, 12px left and right. 8px corners, so the hover fill looks like a soft block.
2. **start**: never shrinks.
3. **text**: takes the space left. Title above description, no gap.
4. **end**: never shrinks, always on the right, even when there's no text (code: `margin-inline-start: auto`).

Figma needs `lead` so that hiding the text (a Reading row: `SensorLabel` + value) doesn't move `end` to the left. In code there's no `lead` element: CSS does the same with `margin-inline-start: auto` on `end`. 5. **divider** (Figma: `hasDivider`, a top stroke): a 1px `color-border-subtle` line above the row. In code it comes from the `List` (`hasDividers`), not from each row.

### API

The props are defined in [`ListItem.types.ts`](./ListItem.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

Decisions behind them:

- **`details`** was added for [`DeviceListItem`](../../status/DeviceListItem/DeviceListItem.md): a Fault message is too long for the right side, and `description` is plain text. It sits under the description, 4px below it (`--shk-space-1`).
- **The same clickable pattern as `Card`.** The title becomes the real `<a>` or `<button>`, and an invisible layer stretches it over the row. Screen readers hear "Kitchen, link". The types enforce it the same way: three shapes (static, link, button), `title` required when clickable, never `href` and `onClick` together.
- **`start` is a slot, not an `icon` prop** (unlike `Card`). Rows often start with a whole label (`SensorLabel`, `SpaceLabel`), not just an icon. For a room row, pass `<Icon name={SPACE_TYPE_ICONS.kitchen} />`.
- **`title` and `description` are plain strings.** On a clickable row the title is the link's text, so it can't hold components.

### Example values

| Case               | start                          | title                                     | description             | end                                | clickable |
| ------------------ | ------------------------------ | ----------------------------------------- | ----------------------- | ---------------------------------- | --------- |
| Room (default)     | `Icon` `countertops` (md)      | Kitchen                                   | Ground floor            | `ReadingValue` 22.4 + °C           | `href`    |
| Reading            | `SensorLabel` Temperature (sm) | –                                         | –                       | `ReadingValue` 22.4 + °C           | no        |
| Module             | –                              | Climate Module                            | Bedroom                 | `DeviceConnectionStatus` connected | `href`    |
| `LongText` (240px) | `Icon` `weekend`               | Living room and dining area by the garden | Ground floor, east wing | `ReadingValue` 21.8 + °C           | `href`    |
| `Minimal`          | –                              | Kitchen                                   | –                       | –                                  | no        |

### Tokens

| Part             | Property      | Token                                                                  |
| ---------------- | ------------- | ---------------------------------------------------------------------- |
| root             | padding       | `--shk-space-2` (block), `--shk-space-3` (inline)                      |
| root             | gap           | `--shk-space-3`                                                        |
| root             | radius        | `--shk-radius-8`                                                       |
| root (clickable) | min height    | `--shk-size-11` (44px)                                                 |
| root (hover)     | background    | `--shk-action-secondary-bg-hover`                                      |
| root (pressed)   | background    | `--shk-action-secondary-bg-pressed`                                    |
| root (focus)     | outline       | `--shk-border-width-medium` solid `--shk-action-focus`, inside the row |
| divider          | border-top    | `--shk-border-width-thin` solid `--shk-color-border-subtle`            |
| title            | colour, style | `--shk-color-text-primary`, `--shk-typography-body-*`                  |
| description      | colour, style | `--shk-color-text-secondary`, `--shk-typography-body-sm-*`             |

All exist in `tokens.css`. The focus ring sits inside the row (`outline-offset` of minus the ring width) because rows touch: an outside ring would be hidden under the next row.

### Accessibility

- `root` is an `<li>`, so screen readers say "list, 3 items" and "1 of 3".
- Clickable row: the title is the one link or button, named by the title. Tab stops once per row. The focus ring goes around the whole row (`li:has(:focus-visible)`).
- Static row: no role beyond `listitem`. Its text is read in order: start, title, description, end.
- Title and description are plain text, never HTML. When truncated, the full text is in the `title` attribute.
- Hover and pressed fills are extra feedback only. The focus ring and pointer cursor don't rely on colour.
- Clickable rows are at least 44px tall.

### Open questions

- **A chevron (›) at the end of clickable rows**, to show they lead somewhere, like iOS lists. It needs a `chevron_right` icon and a decision about rows that also have an `end`. Not in v1: the hover fill and pointer show it on desktop, but on touch screens nothing shows it until tapped.
- **Routing.** The same as `Card`: `href` is a plain link, to be decided kit-wide with navigation.
