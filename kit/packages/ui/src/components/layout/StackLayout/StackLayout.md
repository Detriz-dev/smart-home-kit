# StackLayout

### Purpose

Places children in one column with an even gap, for example a `LocationPath` above a `ModuleCard`. It is the root of most generated screens, and people building screens by hand can use it too.

It adds only spacing. It has no background, border or padding, so it stays invisible and works inside any other component.

Figma: `StackLayout` component set in _DeTriz - Smart Home Kit_ (node `381:490`).

### Component in domain model context

Category: **Layout** ("How is it arranged?").

StackLayout shows no domain terms of its own. It doesn't know what its children are, so a Module, a Space and a Reading all look the same to it.

What it does **not** do, and why:

- **Arrange children side by side.** That is `ColumnLayout`.
- **Add a heading.** That is `ContentSection`.
- **Add padding or a surface.** The screen or the card around it owns those, so stacks can sit inside each other without adding up extra space.
- **Know about the View Spec or fetch data.** It takes props only. The renderer passes the children in.

### Visual idea

| Question                        | Answer                                                   |
| ------------------------------- | -------------------------------------------------------- |
| What does it roughly look like? | Nothing on its own: only the space between its children. |
| Icons?                          | No.                                                      |
| Separators between parts?       | No: the gap does that job.                               |
| More than one layout?           | No: always one column. Only the gap changes.             |
| Text and icon size              | None: it has no text or icons of its own.                |

Every child fills the full width of the stack. There is no gap above the first child or below the last one.

### Variants

**Gap** (Figma variant property `gap`, prop `gap`):

| Value | Size | Use it when                                                                  |
| ----- | ---- | ---------------------------------------------------------------------------- |
| `sm`  | 8px  | The children belong closely together, such as a `LocationPath` and its card. |
| `md`  | 16px | Default. Most lists of cards.                                                |
| `lg`  | 32px | The children are separate groups, such as two `ContentSection`s.             |

The options are names, never pixels, so the model can only choose spacing that has been tested. Each step doubles, so nested stacks stay easy to tell apart.

**Parts shown:** there are no optional parts. Every child is shown, in the order it was given.

Target states:

| Target state | Applies? | Why                                                               |
| ------------ | -------- | ----------------------------------------------------------------- |
| loading      | no       | StackLayout has no data. Each child shows its own loading state.  |
| Connected    | no       | Connection Status belongs to the children, such as `ModuleCard`.  |
| Stale        | no       | Same as above.                                                    |
| Disconnected | no       | Same as above. The stack keeps its layout whatever a child shows. |
| Fault        | no       | Fault belongs to the children, shown with `DeviceFaultStatus`.    |

### Anatomy

```
root                      (gap=sm | md | lg)
└── children              whatever is passed in
```

1. **root**: holds the children, sets their gap and fills the width of its parent. A long child can't push it wider than its parent.

The children aren't wrapped in extra elements, so `root` is the only element StackLayout adds.

In Figma, `children` is a slot, so designers can place any content in an instance. Figma needs the slot as its own layer, so the gap is set there. In code, the slot doesn't exist: `root` sets the gap directly.

### API

```ts
/** The space between the children of a StackLayout. */
type StackLayoutGap = "sm" | "md" | "lg";

interface StackLayoutProps {
  /** The components to place in one column, top to bottom. */
  children: ReactNode;
  /** The space between the children. Defaults to `md`. */
  gap?: StackLayoutGap;
}
```

### Example values

Figma's sample content and the stories use these:

| Case               | Children                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Default            | `LocationPath` (My flat, Level 2, Bedroom) above two `ModuleCard`s (Climate Module, Air Quality Module)                     |
| `LongText` (240px) | `LocationPath` with Grandparents' summer house by the lake, Kitchen and dining area on the ground floor, above `ModuleCard` |
| `Minimal`          | One `ModuleCard` (Climate Module)                                                                                           |

### Tokens

| Part        | Property | Token                  |
| ----------- | -------- | ---------------------- |
| root (`sm`) | gap      | `--shk-space-2` (8px)  |
| root (`md`) | gap      | `--shk-space-4` (16px) |
| root (`lg`) | gap      | `--shk-space-8` (32px) |

### Accessibility

- Markup: a plain `<div>` with no role, because a stack has no meaning of its own. Screen readers go straight to the children.
- Reading order matches the order of `children`, so what people hear matches what they see.
- There is no colour, motion or text to check.

### Open questions

None.
