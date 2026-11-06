# List

> Spec for the team: decisions, Figma mapping and open questions. The user docs page is [`list.mdx`](/kit/apps/docs-site/docs/ui-components/layout/list.mdx) (one page for `List` and `ListItem`). Props are defined in [`List.types.ts`](./List.types.ts).

### Purpose

Holds a group of [`ListItem`](../ListItem/ListItem.md) rows, one under the other: the rooms of a flat, the Readings of a Space, the Modules of a Site. It gives screen readers a real list ("list, 4 items") and, if asked, draws a line between the rows.

It takes props only and never fetches anything.

Figma: `List` component set in _DeTriz - Smart Home Kit_ (node `526:214`), page `List`, above `ListItem`. Variant property `hasDividers`, slot `children` with four room rows.

### Component in domain model context

Category: **Layout**. It shows no domain terms and doesn't know what its rows are about.

What it does **not** do, and why:

- **Add a surface, padding or a heading.** Put it in a `Card` for a surface, and in a `ContentSection` for a heading.
- **Sort, filter or load more.** It shows the rows it's given, in that order.
- **Show an empty state.** With no rows, render an `EmptyState` (planned) instead of the List.

### Visual idea

Rows stacked with no gap. With `hasDividers`, a 1px `color-border-subtle` line between rows (not above the first or below the last). No background or border of its own.

### Variants

**Dividers** (Figma variant property `hasDividers`, prop `hasDividers`, default `false`).

| Value   | Looks                         | Use it when                                                                 |
| ------- | ----------------------------- | --------------------------------------------------------------------------- |
| `false` | Rows separated by space only. | Short lists inside a card, where each row is clearly separate.              |
| `true`  | A thin line between rows.     | Long lists, or rows with a description, where the eye needs help to follow. |

In Figma, the line is each `ListItem`'s `hasDivider` boolean, turned on for every row but the first. In code, `List` draws it, so apps can't forget a row.

Target states: none apply, for the same reasons as `ListItem` (no value, no Device of its own).

### Anatomy

```
root (ul)        rows stacked, no gap
└── children     slot: ListItem rows
```

### API

The props are defined in [`List.types.ts`](./List.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

- `label` becomes `aria-label`. Leave it out when a visible heading right above names the list (a `Card` title, a `ContentSection`).

### Example values

| Case               | hasDividers | Rows                                                |
| ------------------ | ----------- | --------------------------------------------------- |
| Rooms (default)    | `true`      | Kitchen, Bedroom, Bathroom, Living room (clickable) |
| Readings in a card | `false`     | Temperature, Humidity, CO₂                          |
| `Minimal`          | `false`     | One row: Kitchen                                    |

### Tokens

| Part    | Property | Token                                                       |
| ------- | -------- | ----------------------------------------------------------- |
| root    | gap      | `--shk-space-0`                                             |
| divider | border   | `--shk-border-width-thin` solid `--shk-color-border-subtle` |

### Accessibility

- `root` is a `<ul role="list">`. `role="list"` is needed because Safari stops announcing a list once its bullets are removed (the same fix as `SpaceCard`).
- Its children must be `ListItem`s (`<li>`). Anything else inside a `<ul>` is invalid HTML.
- `label` names the list when nothing visible does.
