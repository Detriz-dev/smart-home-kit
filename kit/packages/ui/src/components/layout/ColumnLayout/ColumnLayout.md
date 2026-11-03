# ColumnLayout

### Purpose

Places children side by side, which is how a screen shows what matters most. `2:1` makes one item the focus with a smaller one beside it, and `equal` treats all items the same, such as a row of `SpaceCard`s.

It adds only spacing. It has no background, border or padding, so it stays invisible and works inside any other component.

Figma: `ColumnLayout` component set in _DeTriz - Smart Home Kit_ (node `387:377`), page `ColumnLayout`.

### Component in domain model context

Category: **Layout** ("How is it arranged?").

ColumnLayout shows no domain terms of its own. It doesn't know what its children are, so a Module, a Space and a Reading all look the same to it.

What it does **not** do, and why:

- **Place children one under the other on purpose.** That is `StackLayout`. ColumnLayout only falls back to one column when it runs out of width.
- **Add a heading.** That is `ContentSection`.
- **Add padding or a surface.** The screen or the card around it owns those, so layouts can sit inside each other without adding up extra space.
- **Offer other ratios or a gap prop.** The set is small on purpose: the model can only choose layouts that have been tested.
- **Change the order of its children.** Reading order always matches the order of `children`.
- **Know about the View Spec or fetch data.** It takes props only. The renderer passes the children in.

### Visual idea

| Question                        | Answer                                                                    |
| ------------------------------- | ------------------------------------------------------------------------- |
| What does it roughly look like? | Nothing on its own: only the columns and the space between them.          |
| Icons?                          | No.                                                                       |
| Separators between parts?       | No: the gap does that job.                                                |
| More than one layout?           | Yes: `equal`, `2:1` and `1:2`. Each falls back to one column when narrow. |
| Text and icon size              | None: it has no text or icons of its own.                                 |

The gap is always 16px, between columns and between rows. There is no gap around the outside.

Children in the same row get the same height, so the tops and bottoms of a row of cards line up.

### Variants

**Ratio** (Figma variant property `ratio`, prop `ratio`):

| Value   | Columns                    | Use it when                                                                 |
| ------- | -------------------------- | --------------------------------------------------------------------------- |
| `equal` | As many as fit, same width | Default. Items of the same importance. Also the Site grid.                  |
| `2:1`   | Wide, then narrow          | The first child is the focus, with a supporting item beside it.             |
| `1:2`   | Narrow, then wide          | The second child is the focus. The first child still comes first when read. |

**How each ratio responds to its own width:**

| Ratio           | Narrow                                                                 | Wide                                     |
| --------------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| `equal`         | Below 400px: one column                                                | One more column for every 208px of width |
| `2:1` and `1:2` | Below 592px: one column, because the small column would be below 192px | From 592px: two columns                  |

192px is the narrowest column, and the narrowest width `ModuleCard` is designed for (one 160px Sensor plus padding). The switching widths come from it: 400px = two 192px columns + a 16px gap, and 592px = three 192px shares + a 16px gap.

ColumnLayout measures its own width, not the screen's, so it works the same in a full page and inside another column.

**Unusual numbers of children** can't be ruled out by types, and the model chooses the layout, so each case has a safe result:

| Children             | `equal`                                            | `2:1` and `1:2`                                        |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| One                  | Fills the full width                               | Fills the full width, with no empty column beside it   |
| Fewer than fit a row | They share the full width                          | Not applicable: these ratios are made for two children |
| More than fit a row  | Wrap onto new rows, keeping the same column widths | Wrap onto new rows, and each row uses the same ratio   |

**Parts shown:** there are no optional parts. Every child is shown, in the order it was given.

Target states:

| Target state | Applies? | Why                                                                  |
| ------------ | -------- | -------------------------------------------------------------------- |
| loading      | no       | ColumnLayout has no data. Each child shows its own loading state.    |
| Connected    | no       | Connection Status belongs to the children, such as `ModuleCard`.     |
| Stale        | no       | Same as above.                                                       |
| Disconnected | no       | Same as above. The columns keep their layout whatever a child shows. |
| Fault        | no       | Fault belongs to the children, shown with `DeviceFaultStatus`.       |

### Anatomy

```
root                      (measures its own width, fills its parent)
└── columns               (ratio=equal | 2:1 | 1:2)
    └── children          whatever is passed in
```

1. **root**: fills the width of its parent and is what the container query measures.
2. **columns**: the grid. It places the children and sets their gap. A long child can't push it wider than its parent.

ColumnLayout needs two elements where `StackLayout` needs one, because a container query can't change the element it measures. `root` is measured and `columns` changes.

The children aren't wrapped in extra elements.

In Figma, `children` is a slot, so designers can place any content in an instance. In code, the slot doesn't exist: `columns` sets the gap directly.

Figma can't do three things the code does, so its variants are snapshots at one width:

- **Ratios.** A Figma slot can't use a grid, so `2:1` is a 728px child beside a child that fills the remaining 364px. Code uses real `2fr` and `1fr` columns.
- **Responding to width.** Figma has no container query, so the one-column fallback appears only in the stories.
- **The Air Quality card in `equal`.** Figma uses its `layout=stacked` variant, so the status sits under the name. In code at this width the status stays beside the name and only the Sensors stack.

### API

```ts
/** How a ColumnLayout divides its width. */
type ColumnLayoutRatio = "equal" | "2:1" | "1:2";

interface ColumnLayoutProps {
  /** The components to place side by side, in reading order. */
  children: ReactNode;
  /** How the width is divided. Defaults to `equal`. */
  ratio?: ColumnLayoutRatio;
}
```

### Example values

Figma's sample content and the stories use these:

| Case                     | Children                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `equal`                  | Three `ModuleCard`s: Climate Module, Light Module, Air Quality Module               |
| `2:1`                    | Air Quality Module, then Climate Module                                             |
| `1:2`                    | Climate Module, then Air Quality Module                                             |
| Narrow container (360px) | `2:1` with the same two cards, now in one column                                    |
| `EqualWraps` (760px)     | Five `ModuleCard`s, which wrap onto a second row                                    |
| `LongText` (240px)       | `ModuleCard`s with the long name Bedroom ceiling Air Quality Module near the window |
| `Minimal`                | One `ModuleCard` (Climate Module)                                                   |

### Tokens

| Part              | Property         | Token                                  |
| ----------------- | ---------------- | -------------------------------------- |
| columns           | gap              | `--shk-space-4` (16px)                 |
| columns (`equal`) | narrowest column | `calc(var(--shk-size-24) * 2)` (192px) |

The 592px switching width is a raw value because CSS doesn't allow variables in a container query, the same as in `ModuleCard`.

### Accessibility

- Markup: plain `<div>`s with no role, because columns have no meaning of their own. Screen readers go straight to the children.
- Reading order matches the order of `children` at every width, so what people hear matches what they see. The CSS never reorders children. In `1:2` the narrow child is read first, because it comes first.
- There is no colour, motion or text to check.

### Open questions

None.
