# LocationPath

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/navigation/location-path.mdx). Props are defined in [`LocationPath.types.ts`](./LocationPath.types.ts).

### Purpose

Shows where a Device is: its Site, Floor, Space and the Device itself, each with an icon. It is used in card headers, detail views and lists, so the user knows which Device they are looking at without opening anything.

It is read-only. A clickable version (each part takes you to that place) belongs in **Controls**, not here.

Figma: `LocationPath` component set in _DeTriz - Smart Home Kit_ (node `171:38`).

### Component in domain model context

Category: **Context** ("Where is this / what is it?"). The path is a fixed fact and never changes on its own.

It shows the location hierarchy from [Places](/kit/apps/docs-site/docs/domain-model/glossary.mdx#places) and the Device it ends at from [Capabilities](/kit/apps/docs-site/docs/domain-model/glossary.mdx#capabilities):

| Part      | Domain term           | Icon                                                     | Example        | Rule                                                                                                          |
| --------- | --------------------- | -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| 1. Site   | **Site**              | `home`                                                   | My flat        | The top of the hierarchy. Leave out when the Site is already clear from the screen.                           |
| 2. Floor  | **Floor**             | `stairs_2`                                               | Level 2        | Only Sites that use Floors have one. A name, not a number.                                                    |
| 3. Space  | **Space**             | `door_front`                                             | Bedroom        | A Hub has no Space until it is Paired.                                                                        |
| 4. Device | **Hub** or **Module** | `router` or `developer_board` (from `DEVICE_KIND_ICONS`) | Climate Module | The Device the path points to. Needs `deviceKind`. A Module has no Space of its own: it uses its Hub's Space. |

Every part is optional. The order is always Site, Floor, Space, Device. Missing parts are skipped, never shown empty. With no names at all, the component renders nothing.

What it does **not** show, and why:

- **Connection Status, Pairing Status, Fault.** These change over time, so they are Status. Use `DeviceConnectionStatus` and `DevicePairingStatus` next to the path.
- **Sensor or Metric.** A Sensor is not a Device and has no location of its own. Readings components show the Metric.
- **Space Type** (Bedroom, Kitchen…). It is a category, not a name. The path shows the Space's own name, which may be the same word.

### States

LocationPath is Navigation: it shows where you are, and it is a fixed fact, so it has no states of its own. It changes in two ways: the **layout**, and **which parts are shown**.

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
| Connected    | no       | Connection Status is shown by `DeviceConnectionStatus`.                                           |
| Stale        | no       | Same as above.                                                                                    |
| Disconnected | no       | The path doesn't change when a Device is unplugged. A parent card may dim it with the last value. |
| Fault        | no       | Fault is Status.                                                                                  |

### Anatomy

```
root                      (layout=inline | grid | stack)
├── site
│   ├── icon              home
│   └── label             "My flat"
├── floor
│   ├── icon              stairs_2
│   └── label             "Level 2"
├── space
│   ├── icon              door_front
│   └── label             "Bedroom"
└── device
    ├── icon              DeviceKindIcon (router / developer_board)
    └── label             "Climate Module"
```

1. **root**: holds the parts. Its direction and gap come from `layout`. In `grid` it is a two-column grid in both Figma and code, so the parts fill the rows in order and each column is as wide as its longest name.
2. **item** (`site`, `floor`, `space`, `device`): one part of the path, an icon next to a label.
3. **icon**: tells which kind of part it is. Decorative for screen readers (see Accessibility).
4. **label**: the name.

Long names: the label shrinks and ends with `…`.

### API

The props are defined in [`LocationPath.types.ts`](./LocationPath.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- One optional `…Name` string per part (`siteName`, `floorName`, `spaceName`, `deviceName`), not booleans like in Figma: a part is shown when its name is given.
- `deviceKind` (`hub` or `module`) comes with `deviceName`; TypeScript requires both or neither. It picks the icon from `DEVICE_KIND_ICONS`, the same one `DeviceListItem` uses, and the screen reader prefix ("Hub:" or "Module:"). Decided 2026-11-07: one icon per Device Kind instead of the generic `tv_gen`.
- `layout` is `"inline" | "grid" | "stack"`, default `inline`, matching the Figma `layout` variant values.

### Tokens

The same tokens are bound in Figma.

| Part            | Property       | Token                                                |
| --------------- | -------------- | ---------------------------------------------------- |
| label           | colour         | `--shk-color-text-primary`                           |
| label           | text           | `--shk-typography-caption-*` (12px / regular / 18px) |
| item            | icon ↔ label   | `--shk-space-1` (4px)                                |
| root (`inline`) | gap            | `--shk-space-4` (16px)                               |
| root (`grid`)   | column and row | `--shk-space-4` (16px)                               |
| root (`stack`)  | gap            | `--shk-space-2` (8px)                                |
| icon            | colour         | `--shk-color-text-primary` (inherited from the text) |
| icon            | size           | `Icon size="xs"` (16px)                              |

### Accessibility

- Markup: an ordered list (`<ol>`) with `aria-label="Location"`, one `<li>` per part, because the order has meaning.
- The icon is the only thing that says what kind of part a label is (a lone "Level 2" in `stack` could be anything). So the icon is hidden from screen readers and each label gets a visually hidden prefix: "Site: My flat", "Floor: Level 2", "Space: Bedroom", "Device: Climate Module".
- When a name is truncated, the full name is still available in a `title`, so it shows on hover.
- The list already has the accessible name "Location", so apps shouldn't add their own "Location" label right next to it: screen readers would announce it twice. The user docs page tells developers this.
- Contrast: `--shk-color-text-primary` (gray 900) on a light surface is well above 4.5:1.

### Open questions

- **Hub.** For a Module, should the path show its Hub too?
