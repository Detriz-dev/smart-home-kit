# IconTile

> Spec for the team: decisions, Figma mapping and open questions. Props are defined in [`IconTile.types.ts`](./IconTile.types.ts).

### Purpose

A small box around an icon at the start of a list row: 32px, the app background colour (`surface/page`) and a light outline. It gives every row a steady start and matches the raised Card look (see [ADR 0003](/docs/adr/0003-raised-cards.md)).

Figma: `IconTile` component on the `List` page.

### Category and variants

Category: **Layout**. One variant (neutral). It only frames an icon, so the target states don't apply: the icon inside keeps its own colour, e.g. the Alert Level colour in AlertListItem.

Used by `DeviceListItem`, `SpaceListItem` and `AlertListItem` (their `start`). Pass it to `ListItem`'s `start` yourself for your own rows.

### Anatomy

```
IconTile   <span>, 32px (size/8), radius/8
└── icon   any 24px Icon (children)
```

### Tokens

| Part    | Token                                                  |
| ------- | ------------------------------------------------------ |
| Size    | `--shk-size-8` (32px)                                  |
| Fill    | `--shk-surface-page`                                   |
| Outline | `--shk-border-width-thin`, `--shk-color-border-subtle` |
| Corners | `--shk-radius-8`                                       |

### Accessibility

- A plain `<span>`: screen readers hear the icon inside, or nothing when the icon is decorative.
- The outline is decoration (gray 100 on white); the icon and the row's text carry the meaning.
