# Button

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/controls/button.mdx). Props are defined in [`Button.types.ts`](./Button.types.ts).

### Purpose

The kit's first general action. Apps use it around a generated screen (Generative UI): to send a prompt, retry, undo, and answer a clarifying question such as "Which Space?", where each option is its own `Button` (so no separate chip component is needed yet). Apps can use it for any other action too. (This used to say "Studio uses it"; Live Studio was dropped from the scope.)

It is presentational only. It shows a text and calls `onClick`. The parent decides what the click does.

The model can't place a `Button` in a View Spec, so generated screens stay free of actions.

Figma: `Button` component set in _DeTriz - Smart Home Kit_, page `Button` (node `410:24`), with the properties `variant`, `state` and the text property `label`. `label` in Figma is `children` in code: designers read "label" more easily than "children". Usage: frame `Button / usage` (node `410:25`).

Storybook: `Controls/Button`.

### Domain model context

A `Button` shows no domain data. It doesn't know about Sites, Spaces, Devices or Readings. Its text comes from the parent, and when it answers a clarifying question that text is a domain name, like a Space name ("Living room").

It is not a Device command.

### Visual idea

| Question           | Answer                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------- |
| What it looks like | A rounded rectangle (radius 8), 44px tall, with centred text and 16px padding at the sides. |
| Icons?             | No. Text only for now.                                                                      |
| Primary            | Blue fill, white text. The one main action, e.g. "Send prompt".                             |
| Secondary          | White fill, light grey outline, dark text. Every other action, and clarifying answers.      |
| Disabled           | Light grey fill, grey text, for both variants. Clicks are ignored.                          |
| Focus              | A 2px blue ring, 4px away from the button, when reached with the keyboard (like `Switch`).  |
| Text size          | Label text style (14px), but bold.                                                          |
| Width              | As wide as its text. Long text wraps onto a second line instead of being cut off.           |

### Variants and states

**Variants** (prop `variant`):

| `variant`   | Use for                                                  |
| ----------- | -------------------------------------------------------- |
| `primary`   | The single main action in a place: "Send prompt".        |
| `secondary` | Every other action: "Retry", "Undo", clarifying answers. |

**Sizes** (Figma property `size`, code prop `size`):

| `size` | Height                | Padding (top/bottom, sides) | Use for                                                           |
| ------ | --------------------- | --------------------------- | ----------------------------------------------------------------- |
| `md`   | 44px, `size/11` (min) | `space/2`, `space/4`        | Default. Every button on its own.                                 |
| `sm`   | 32px, `size/8` (min)  | `space/1`, `space/3`        | Inside compact components, e.g. the "View" action in AlertBanner. |

**Interaction states** (Figma property `state`):

| `state`    | How it's set in code | Primary                    | Secondary                                      |
| ---------- | -------------------- | -------------------------- | ---------------------------------------------- |
| `default`  | —                    | Blue fill                  | White fill, light grey outline                 |
| `hover`    | CSS `:hover`         | Darker blue fill           | Light blue fill                                |
| `pressed`  | CSS `:active`        | Darkest blue fill          | Blue fill                                      |
| `focus`    | CSS `:focus-visible` | Default look + blue ring   | Default look + blue ring                       |
| `disabled` | `isDisabled` prop    | Light grey fill, grey text | Light grey fill, light grey outline, grey text |

`state` is only a Figma property. In code, hover, pressed and focus come from the browser, and only `disabled` has a prop (`isDisabled`). A disabled button can't be hovered or pressed, so one `state` property covers all five without impossible pairs.

**Target states** don't apply: a `Button` doesn't show a Device or a Reading. The parent disables it when the action can't run, for example "Send prompt" while a screen builds.

### Anatomy

```
root (button)
└── label (text)
```

1. **root**: the `<button>`. Fill, outline, radius, padding, focus ring.
2. **label**: the text from `children`.

Figma also has a `focus-ring` layer in the `state=focus` variants. It is Figma-only: in code the ring is the CSS `outline` on `root`, not an element.

The 1px outline doesn't change the size: in Figma the stroke sits inside and isn't counted in the layout. In CSS, both variants get a 1px border (primary's border has the same colour as its fill in every state, including disabled, so it never shows), so primary and secondary buttons with the same text are the same width.

### API

The props are defined in [`Button.types.ts`](./Button.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `children` is the text, not a `label` prop, so it reads like HTML. Figma calls it `label`, because designers read that more easily.
- `variant` defaults to `secondary`: most buttons in a place are not the main action.
- `size` defaults to `md` (44px, easy to tap). `sm` (32px) is for compact components only, where the row around it is already a large target.
- Only `disabled` has a prop. Hover, pressed and focus come from the browser.
- No `type` prop: always `type="button"` (see Open questions).

### Example values

| Use                 | Text                                 |
| ------------------- | ------------------------------------ |
| Send a prompt       | "Send prompt"                        |
| Retry after failure | "Retry"                              |
| Undo                | "Undo"                               |
| Clarifying answer   | "Living room", "Meeting room A"      |
| `LongText`          | "Open-plan desk zone" in a 120px box |
| `Minimal`           | "Undo"                               |

### Tokens

New semantic tokens (collection `action`, file `kit/packages/tokens/src/semantic/action.json`):

| Part                    | Token                                                                                    | Points to          |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------------------ |
| Primary fill            | `--shk-action-primary-bg`                                                                | `palette.blue.600` |
| Primary fill, hover     | `--shk-action-primary-bg-hover`                                                          | `palette.blue.700` |
| Primary fill, pressed   | `--shk-action-primary-bg-pressed`                                                        | `palette.blue.800` |
| Primary text            | `--shk-action-primary-fg`                                                                | `palette.white`    |
| Secondary fill          | `--shk-action-secondary-bg`                                                              | `palette.white`    |
| Secondary fill, hover   | `--shk-action-secondary-bg-hover`                                                        | `palette.blue.100` |
| Secondary fill, pressed | `--shk-action-secondary-bg-pressed`                                                      | `palette.blue.200` |
| Secondary outline       | `--shk-action-secondary-border`                                                          | `palette.gray.200` |
| Secondary text          | `--shk-action-secondary-fg`                                                              | `palette.gray.900` |
| Disabled fill           | `--shk-action-disabled-bg`                                                               | `palette.gray.100` |
| Disabled outline        | `--shk-action-disabled-border` (secondary only; primary uses `--shk-action-disabled-bg`) | `palette.gray.200` |
| Disabled text           | `--shk-action-disabled-fg`                                                               | `palette.gray.400` |
| Focus ring              | `--shk-action-focus`                                                                     | `palette.blue.600` |

Existing tokens: `--shk-size-11` (height), `--shk-space-4` (side padding), `--shk-space-2` (top and bottom padding when the text wraps), `--shk-radius-8`, `--shk-border-width-thin` (outline), `--shk-border-width-medium` (focus ring width), `--shk-space-1` (focus ring offset), `--shk-typography-label-*` (except the weight).

Component token (file `kit/packages/tokens/src/component/button.json`): `--shk-button-label-font-weight` → `font-weight.bold` (700). Grey is only for disabled; every other state uses the primary blue.

### Accessibility

- A real `<button type="button">`: Tab reaches it, Enter and Space activate it.
- Disabled uses the native `disabled` attribute, so it leaves the tab order and screen readers say "dimmed" or "unavailable".
- The focus ring shows only for keyboard focus (`:focus-visible`), and has at least 3:1 contrast against the page.
- White text on `blue.600` is about 4.7:1. Dark text on white, `blue.100` and `blue.200` is above 4.5:1. The light grey outline is decoration: the button is also marked by its text and 44px size.
- Primary and secondary differ by fill and outline, not by hue alone.
- At least 44px tall, so it's easy to hit on touch screens.

### Open questions

- `type="submit"`: "Send prompt" might sit in a `<form>` with the `TextArea`. For now the button is always `type="button"` and the parent calls submit from `onClick`. Add a `type` prop if an app needs a real form.
