# LocationPath

### Purpose

Shows where a Device is: its Site, Floor, Space and the Device itself, each with an icon. It is used in card headers, detail views and lists, so the user knows which Device they are looking at without opening anything.

It is read-only. A clickable version (each part takes you to that place) belongs in **Controls**, not here.

Figma: `LocationPath` component set in _DeTriz - Smart Home Kit_ (node `171:38`).

### Component in domain model context

Category: **Context** ("Where is this / what is it?"). The path is a fixed fact and never changes on its own.

It shows the location hierarchy from [Where things are](/docs/architecture/domain-model/ubiquitous-language.md#where-things-are) and the Device it ends at from [How is tracked](/docs/architecture/domain-model/ubiquitous-language.md#how-is-tracked):

| Part      | Domain term           | Icon         | Example        | Rule                                                                                      |
| --------- | --------------------- | ------------ | -------------- | ----------------------------------------------------------------------------------------- |
| 1. Site   | **Site**              | `home`       | My flat        | The top of the hierarchy. Leave out when the Site is already clear from the screen.       |
| 2. Floor  | **Floor**             | `stairs_2`   | Level 2        | Only Sites that use Floors have one. A name, not a number.                                |
| 3. Space  | **Space**             | `door_front` | Bedroom        | A Hub has no Space until it is Paired.                                                    |
| 4. Device | **Hub** or **Module** | `tv_gen`     | Climate Module | The Device the path points to. A Module has no Space of its own: it uses its Hub's Space. |

Every part is optional. The order is always Site, Floor, Space, Device. Missing parts are skipped, never shown empty. With no names at all, the component renders nothing.

What it does **not** show, and why:

- **Connection Status, Pairing Status, Fault.** These change over time, so they are Status. Use `DeviceCommunicationStatus` and `DevicePairingStatus` next to the path.
- **Sensor or Metric.** A Sensor is not a Device and has no location of its own. Readings components show the Metric.
- **Space Type** (Bedroom, Kitchen…). It is a category, not a name. The path shows the Space's own name, which may be the same word.

### States

LocationPath is Context, so it has no states of its own. It changes in two ways: the **layout**, and **which parts are shown**.

**Layout** (Figma variant property `layout`, prop `layout`):

| Value    | Looks like                                         | Use it when                          |
| -------- | -------------------------------------------------- | ------------------------------------ |
| `inline` | All parts on one line. Default.                    | Card headers, list rows.             |
| `grid`   | Two parts per row. Parts move up to fill the gaps. | Narrow cards that still need it all. |
| `stack`  | One part per line.                                 | Side panels, detail views.           |

**Parts shown** (Figma boolean properties `site`, `floor`, `space`, `device`). In code there are no booleans: a part is shown when its name prop is given.

| Example          | Props given                | Inline result                                |
| ---------------- | -------------------------- | -------------------------------------------- |
| Full             | site, floor, space, device | My flat · Level 2 · Bedroom · Climate Module |
| No Floor         | site, space, device        | My flat · Bedroom · Climate Module           |
| Up to Space      | site, floor, space         | My flat · Level 2 · Bedroom                  |
| Site only        | site                       | My flat                                      |
| Space and Device | space, device              | Bedroom · Climate Module                     |
| Device only      | device                     | Climate Module                               |
| Long names       | any, with long names       | Truncated, see Anatomy                       |

(`·` stands for an icon here. There is no separator character: the icons and the gap between parts do that job.)

The parent decides how much of the path to show by passing only the names it needs. For example, a list already grouped by Site and Space only needs the Device name.

Target states:

| Target state | Applies? | Why                                                                                               |
| ------------ | -------- | ------------------------------------------------------------------------------------------------- |
| loading      | later    | Skipped for now. Later: a placeholder of the same height, so the layout doesn't jump.             |
| Connected    | no       | Connection Status is shown by `DeviceCommunicationStatus`.                                        |
| Stale        | no       | Same as above.                                                                                    |
| Disconnected | no       | The path doesn't change when a Device is unplugged. A parent card may dim it with the last value. |
| Fault        | no       | Fault is Status.                                                                                  |

### Anatomy

```
root                      (layout=inline | grid | stack)
├── row                   (grid only: two parts per row)
│   ├── site
│   │   ├── icon          home
│   │   └── label         "My flat"
│   └── floor
│       ├── icon          stairs_2
│       └── label         "Level 2"
└── row
    ├── space
    │   ├── icon          door_front
    │   └── label         "Bedroom"
    └── device
        ├── icon          tv_gen
        └── label         "Climate Module"
```

1. **root**: holds the parts. Its direction and gap come from `layout`.
2. **row**: only in Figma's `grid`. In code there is no row element: `grid` is a two-column CSS grid, so the parts fill the rows in order (a list may only have list items inside).
3. **item** (`site`, `floor`, `space`, `device`): one part of the path, an icon next to a label.
4. **icon**: tells which kind of part it is. Decorative for screen readers (see Accessibility).
5. **label**: the name.

Long names: the label shrinks and ends with `…`.

### API

```ts
/** How the parts of the path are arranged. */
type LocationPathLayout = "inline" | "grid" | "stack";

interface LocationPathProps {
  /** Name of the Site, the top of the path. Leave out if the screen already shows it. */
  siteName?: string;
  /** Name of the Floor. Leave out if the Site doesn't use Floors. */
  floorName?: string;
  /** Name of the Space. Leave out if the Device has no Space yet. */
  spaceName?: string;
  /** Name of the Device (Hub or Module) the path points to. */
  deviceName?: string;
  /** How the parts are arranged. Defaults to `inline`. */
  layout?: LocationPathLayout;
}
```

### Tokens

From the Figma review. Figma's 12px text uses the `label` line height; code uses the **caption** style instead, which is the same 12/18 regular.

| Part            | Property     | Token                                   |
| --------------- | ------------ | --------------------------------------- |
| label           | colour       | `--shk-color-text-primary`              |
| label           | font family  | `--shk-typography-caption-font-family`  |
| label           | font size    | `--shk-typography-caption-font-size`    |
| label           | font weight  | `--shk-typography-caption-font-weight`  |
| label           | line height  | `--shk-typography-caption-line-height`  |
| item            | icon ↔ label | `--shk-space-1` (4px)                   |
| root (`inline`) | gap          | `--shk-space-4` (16px)                  |
| row (`grid`)    | gap          | `--shk-space-4` (16px)                  |
| root (`grid`)   | row gap      | `--shk-space-4` (16px)                  |
| root (`stack`)  | gap          | `--shk-space-2` (8px)                   |
| icon            | colour       | `--shk-color-text-primary` (to confirm) |
| icon            | size         | `Icon size="xs"` (16px)                 |

### Accessibility

- Markup: an ordered list (`<ol>`) with `aria-label="Location"`, one `<li>` per part, because the order has meaning.
- The icon is the only thing that says what kind of part a label is (a lone "Level 2" in `stack` could be anything). So the icon is hidden from screen readers and each label gets a visually hidden prefix: "Site: My flat", "Floor: Level 2", "Space: Bedroom", "Device: Climate Module".
- When a name is truncated, the full name is still available (for example in a `title`).
- Contrast: `--shk-color-text-primary` (gray 900) on a light surface is well above 4.5:1.

### Open questions

- **Hub and Slot.** For a Module, should the path show its Hub too?
- **Device icon per Device Kind.** One icon (`tv_gen`) for both Hub and Module, or a different one for each?
