# ContentSection

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/layout/content-section.mdx). Props are defined in [`ContentSection.types.ts`](./ContentSection.types.ts).

### Purpose

Gives a screen its title and splits it into named groups, such as "Air quality" and "Comfort". The heading helps people scan the page, and because it is a real heading, screen reader users can jump from group to group.

The heading is the only text on a generated screen that the model writes itself, so it stays short and plain.

Figma: `ContentSection` component set in _DeTriz - Smart Home Kit_ (node `393:253`), page `ContentSection`. The `ContentSection examples` frame below it shows each level with its example values, plus `LongText` at 240px.

### Component in domain model context

Category: **Layout** ("How is it arranged?").

ContentSection shows no domain terms of its own. The `title` is free text, such as "Bedroom" or "Air quality". It doesn't know what its children are, so a Module, a Space and a Reading all look the same to it.

What it does **not** do, and why:

- **Place children side by side.** Put a `ColumnLayout` inside it.
- **Offer a gap prop.** The spacing is fixed, so the model has one less choice to get wrong. For a different gap between children, put a `StackLayout` inside it.
- **Choose its heading level by itself.** The renderer sets `headingLevel` from how deep the section is nested, so the model can't break the heading order.
- **Add padding, a border or a surface.** The screen or the card around it owns those, so sections can sit inside each other without adding up extra space.
- **Render formatting in the title.** `title` is plain text: no links, bold or line breaks.
- **Limit the title length.** The View Spec schema does that. The component wraps a long title onto more lines.
- **Know about the View Spec or fetch data.** It takes props only. The renderer passes the children in.

### Visual idea

| Question                        | Answer                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------- |
| What does it roughly look like? | A heading, then the children one under the other.                                |
| Icons?                          | No.                                                                              |
| Separators between parts?       | No: the gap and the heading size do that job.                                    |
| More than one layout?           | No: always heading on top, children below in one column. Only the level changes. |
| Text and icon size              | The heading uses the text style that matches its level: H2, H3 or H4.            |

The heading, and each child, is 16px from the next. Every child fills the full width. There is no space above the heading or below the last child.

### Variants

**Heading level** (Figma variant property `headingLevel`, prop `headingLevel`):

| Value | HTML   | Text style | Use it when                                                      |
| ----- | ------ | ---------- | ---------------------------------------------------------------- |
| `2`   | `<h2>` | H2, 32px   | The title of the whole generated screen, such as "Bedroom".      |
| `3`   | `<h3>` | H3, 24px   | A group on that screen, such as "Air quality".                   |
| `4`   | `<h4>` | H4, 20px   | A group inside a group. Rare: most screens need only two levels. |

There is no `1`: the app's own page owns the one `<h1>`, and the screen sits inside it. (This used to say "Studio's page"; Live Studio was dropped from the scope.) The size always matches the level, so what people see matches what screen readers announce.

**Parts shown:** there are no optional parts. The heading is always shown, and every child is shown in the order it was given.

Target states:

| Target state | Applies? | Why                                                                      |
| ------------ | -------- | ------------------------------------------------------------------------ |
| loading      | no       | The title is known before any Reading arrives. Each child shows its own. |
| Connected    | no       | Connection Status belongs to the children, such as `ModuleCard`.         |
| Stale        | no       | Same as above.                                                           |
| Disconnected | no       | Same as above. The section keeps its heading whatever a child shows.     |
| Fault        | no       | Fault belongs to the children, shown with `DeviceFaultStatus`.           |

### Anatomy

```
root                      (headingLevel=2 | 3 | 4)
├── heading               the title, as <h2>, <h3> or <h4>
└── children              whatever is passed in
```

1. **root**: holds the heading and the children in one column, 16px apart, and fills the width of its parent. A long child can't push it wider than its parent.
2. **heading**: the `title` as plain text. A long title wraps onto more lines.

The children aren't wrapped in an extra element, so they sit straight in `root` after the heading.

In Figma, `title` is a text property linked to `heading`. It has one default ("Bedroom") for all three variants, so the other example titles are set on the instances in the examples frame.

In Figma, `children` is a slot, so designers can place any content in an instance. Figma needs the slot as its own layer, with its own 16px gap. In code, the slot doesn't exist: `root` sets the gap for everything.

### API

The props are defined in [`ContentSection.types.ts`](./ContentSection.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `title` is plain text, never HTML.
- `headingLevel` is `2 | 3 | 4`, default `2`. There is no `1`: the app's page owns the one `<h1>`. The level sets both the element and the text size, so they can't disagree.
- No gap prop: the spacing is fixed. Put a `StackLayout` inside for a different gap.

### Example values

Figma's sample content and the stories use these:

| Case               | Title                                                  | Children                                                                       |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `headingLevel=2`   | Bedroom                                                | `LocationPath` (My flat, Level 2, Bedroom) above `ModuleCard` (Climate Module) |
| `headingLevel=3`   | Air quality                                            | `ModuleCard` (Air Quality Module)                                              |
| `headingLevel=4`   | Comfort                                                | `ModuleCard` (Climate Module)                                                  |
| `LongText` (240px) | Air quality and comfort in the kitchen and dining area | `ModuleCard` (Air Quality Module)                                              |
| `Minimal`          | Bedroom                                                | One `ModuleCard` (Climate Module)                                              |

### Tokens

| Part          | Property   | Token                                                                                 |
| ------------- | ---------- | ------------------------------------------------------------------------------------- |
| root          | gap        | `--shk-space-4` (16px)                                                                |
| heading       | color      | `--shk-color-text-primary`                                                            |
| heading (`2`) | text style | `--shk-typography-h2-*` (font family, size 32px, weight, line height, letter spacing) |
| heading (`3`) | text style | `--shk-typography-h3-*` (24px)                                                        |
| heading (`4`) | text style | `--shk-typography-h4-*` (20px)                                                        |

All of these exist in `tokens.css`. The file has no text styles, so in Figma the `heading` layer binds each `typography/h2…h4` variable directly (font family, size, weight, line height, letter spacing).

### Accessibility

- Markup: a `<section>` labelled by its heading (`aria-labelledby`), so screen readers can list the groups and announce the name when entering one.
- The heading is a real `<h2>`, `<h3>` or `<h4>`, so people can jump between groups with the heading shortcut.
- The renderer sets the level from nesting, so levels are never skipped.
- `title` is rendered as text, never as HTML.
- Text contrast: `text/primary` (gray 900) on the page background.
- Reading order matches the order of `children`.

### Open questions

- Does each `<section>` landmark help screen reader users, or is it too many landmarks on one screen? If testing shows too many, `root` becomes a plain `<div>` and the headings alone do the job. This doesn't change any prop.
