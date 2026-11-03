# Button

### Purpose

The kit's first general action. Studio uses it around the generated screen: to send a prompt, retry, undo, and answer a clarifying question such as "Which Space?", where each option is its own `Button` (so no separate chip component is needed yet).

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
| Secondary          | White fill, grey outline, dark text. Every other action, and clarifying answers.            |
| Disabled           | Light grey fill, grey text, for both variants. Clicks are ignored.                          |
| Focus              | A 2px blue ring, 4px away from the button, when reached with the keyboard (like `Switch`).  |
| Text size          | Label text style (14px, medium).                                                            |
| Width              | As wide as its text. Long text wraps onto a second line instead of being cut off.           |

### Variants and states

**Variants** (prop `variant`):

| `variant`   | Use for                                                  |
| ----------- | -------------------------------------------------------- |
| `primary`   | The single main action in a place: "Send prompt".        |
| `secondary` | Every other action: "Retry", "Undo", clarifying answers. |

**Interaction states** (Figma property `state`):

| `state`    | How it's set in code | Primary                    | Secondary                                      |
| ---------- | -------------------- | -------------------------- | ---------------------------------------------- |
| `default`  | —                    | Blue fill                  | White fill, grey outline                       |
| `hover`    | CSS `:hover`         | Darker blue fill           | Light grey fill                                |
| `pressed`  | CSS `:active`        | Darkest blue fill          | Grey fill                                      |
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

```ts
type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  /** The text on the button, e.g. "Send prompt" or a Space name. */
  children: ReactNode;
  /** Called when the button is clicked or activated with the keyboard. */
  onClick: () => void;
  /** How much weight the action has. Defaults to "secondary". */
  variant?: ButtonVariant;
  /** Greys the button out and ignores clicks. Defaults to false. */
  isDisabled?: boolean;
}
```

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
| Secondary fill, hover   | `--shk-action-secondary-bg-hover`                                                        | `palette.gray.100` |
| Secondary fill, pressed | `--shk-action-secondary-bg-pressed`                                                      | `palette.gray.200` |
| Secondary outline       | `--shk-action-secondary-border`                                                          | `palette.gray.600` |
| Secondary text          | `--shk-action-secondary-fg`                                                              | `palette.gray.900` |
| Disabled fill           | `--shk-action-disabled-bg`                                                               | `palette.gray.100` |
| Disabled outline        | `--shk-action-disabled-border` (secondary only; primary uses `--shk-action-disabled-bg`) | `palette.gray.200` |
| Disabled text           | `--shk-action-disabled-fg`                                                               | `palette.gray.400` |
| Focus ring              | `--shk-action-focus`                                                                     | `palette.blue.600` |

Existing tokens: `--shk-size-11` (height), `--shk-space-4` (side padding), `--shk-space-2` (top and bottom padding when the text wraps), `--shk-radius-8`, `--shk-border-width-thin` (outline), `--shk-border-width-medium` (focus ring width), `--shk-space-1` (focus ring offset), `--shk-typography-label-*`.

### Accessibility

- A real `<button type="button">`: Tab reaches it, Enter and Space activate it.
- Disabled uses the native `disabled` attribute, so it leaves the tab order and screen readers say "dimmed" or "unavailable".
- The focus ring shows only for keyboard focus (`:focus-visible`), and has at least 3:1 contrast against the page.
- White text on `blue.600` is about 4.7:1. Dark text on white and on `gray.200` is above 4.5:1.
- Primary and secondary differ by fill and outline, not by hue alone.
- At least 44px tall, so it's easy to hit on touch screens.

### Open questions

- `type="submit"`: "Send prompt" might sit in a `<form>` with the `TextArea`. For now the button is always `type="button"` and the parent calls submit from `onClick`. Add a `type` prop if Studio needs a real form.
