# FloorSection

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/layout/floor-section.mdx). Props are defined in [`FloorSection.types.ts`](./FloorSection.types.ts).

### Purpose

Groups the Spaces of one [Floor](/kit/apps/docs-site/docs/domain-model/glossary.mdx#places) under a heading: 🪜 **Ground floor** · 4 Spaces, then the Spaces (usually a `List` of [`SpaceListItem`](../../context/SpaceListItem/SpaceListItem.md)). It is the building block of a Site overview for Sites that use Floors.

It works like [`ContentSection`](../ContentSection/ContentSection.md) with the Floor's icon and a Space count (same `<section>` with its heading as its name, same heading levels), but it looks like a [`Card`](../Card/Card.md): a tinted header strip, then the Spaces on white.

Figma: `FloorSection` component set in _DeTriz - Smart Home Kit_ (node `609:134`, page `FloorSection` in the Layout section after ContentSection). The `children` slot is a frame linked to a SLOT property shared by the three variants.

### Component in domain model context

Category: **Layout**: it places other components and shows no Readings or status. It names one domain thing, the Floor.

| Part    | Domain term          | Example      | Rule                                                                                    |
| ------- | -------------------- | ------------ | --------------------------------------------------------------------------------------- |
| icon    | **Floor**            | `stairs_2`   | `PLACE_ICONS.floor`, the same icon as in `LocationPath`.                                |
| heading | **Floor** (its name) | Ground floor | A name, not a number (Glossary).                                                        |
| count   | number of **Spaces** | 4 Spaces     | Optional. "No Spaces", "1 Space", "4 Spaces".                                           |
| content | the Floor's Spaces   | –            | `children`, usually a List of SpaceListItem (without `floorName`: the heading says it). |

Floors are optional (Glossary): a Site without Floors lists its Spaces without FloorSection.

### Variants

Figma variant property `headingLevel` (2, 3, 4), text properties `title` and `spaceCount`, boolean `hasSpaceCount`, slot `children`. Layout, so the target states don't apply.

| `headingLevel` | Element | Text style | Icon      | Use                                   |
| -------------- | ------- | ---------- | --------- | ------------------------------------- |
| `2`            | `<h2>`  | h2         | `lg` 32px | A screen that is only about one Floor |
| `3`            | `<h3>`  | h3         | `md` 24px | Floors on a Site overview. Default.   |
| `4`            | `<h4>`  | h4         | `md` 24px | Floors inside another section         |

### Anatomy

```
FloorSection            <section aria-labelledby>
├── header
│   ├── icon            PlaceIcon floor (decorative)
│   ├── heading         "Ground floor"   <h3>
│   └── count           "4 Spaces"       (body-sm, secondary, right)
└── body                white, top divider
    └── children        slot
```

Card styling: `surface/page` fill, 1px `color-border-subtle` outline drawn inside, `radius/16` corners and `elevation/raised` shadow. The header has `space/2` between its parts, `space/1` padding above and below, `space/4` at the sides, and is at least `size/11` (44px) tall. The body is `surface/default` with a 1px `color-border-subtle` line on top and `space/1` padding, because the List rows bring their own.

### Accessibility

- A `<section>` named by its heading: screen readers can jump between Floors.
- The icon is decorative; the count is plain text after the heading.

### Open questions

- Collapsible Floors (show/hide their Spaces) for large Sites? Not in the MVP.
