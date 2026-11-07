# IconButton

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/controls/icon-button.mdx). Props are defined in [`IconButton.types.ts`](./IconButton.types.ts).

### Purpose

A button with only an icon, for small, well-known actions where a word would take too much room: refresh the Readings, close a panel, open settings. Its name is never visible, so it always has a `label` that screen readers read and that shows as a tooltip on hover.

It's the icon-only sibling of [`Button`](../Button/Button.md): same height, corners, outline and focus ring. On hover and press it reacts like a [`BottomNav`](../../navigation/BottomNav/BottomNav.md) item: a blue icon, then a light-blue fill. It takes props only; the parent decides what `onClick` does.

Figma: `IconButton` component set in _DeTriz - Smart Home Kit_ (node `552:34`, 10 variants), page `IconButton`. Variant properties `variant` and `state`; the `icon` instance is exposed, so designers pick the icon on each instance. The `IconButton examples` frame (node `552:35`) shows it in a `TopBar` and on its own.

### Component in domain model context

Category: **Controls** ("How do I change what I see?"). Like every Control in the kit, it changes the screen or the app, never a Device: there is no "turn on" button.

It shows no domain terms. The `label` names the action ("Refresh Readings"), using Glossary words where they fit.

What it does **not** do, and why:

- **Navigate.** It's a `<button>`. A link to another screen belongs in `TopBar`'s back button, `BottomNav`, or a clickable `Card` / `ListItem`.
- **Show text next to the icon.** That's `Button`. If people might not recognise the icon, use `Button` with words.
- **Toggle on and off.** A setting that stays on is a `Switch`.

### Visual idea

```
 ghost        secondary
  ⟳          ┌────┐
             │ ⟳  │
             └────┘
```

| Question | Answer                                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Icons?   | One, 24px (`Icon size="md"`), centred. Any icon from the kit.                                                                                                     |
| Size     | 44 × 44px (`size-11`), the kit's touch target, the same height as `Button`.                                                                                       |
| Corners  | 8px (`radius-8`), like `Button`.                                                                                                                                  |
| Variants | `ghost` (default): no fill or border. `secondary`: `Button` secondary's outline. Both: blue icon on hover, light-blue fill while pressed, like `BottomNav` items. |

### Variants

**Variant** (Figma and prop `variant`):

| Value       | Looks                                                    | Use it                                                             |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| `ghost`     | Icon only. A fill appears under the pointer.             | In a bar or on a card: `TopBar` actions, a card's corner. Default. |
| `secondary` | White fill with a grey outline, like `Button` secondary. | On its own on a page, next to `Button`s.                           |

There is no `primary`: the one main action has words (`Button` primary). Hover and pressed follow `BottomNav` items, so every subtle, icon-led control in the kit reacts the same way.

**State** (Figma `state`; in code the browser sets hover, pressed and focus, and `isDisabled` sets disabled):

| State      | ghost                                                                           | secondary                                                                                  |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `default`  | No fill, no border. Icon `action/secondary/fg`.                                 | Fill `action/secondary/bg`, outline `action/secondary/border`.                             |
| `hover`    | Icon `action/subtle/fg-hover` (blue-600). No fill.                              | Icon `action/subtle/fg-hover` (blue-600). Fill and outline unchanged.                      |
| `pressed`  | Fill `action/subtle/bg-pressed` (blue-200), icon back to `action/secondary/fg`. | Fill `action/subtle/bg-pressed` (blue-200), outline unchanged, icon `action/secondary/fg`. |
| `focus`    | 2px `action/focus` ring, 4px outside, 12px corners (like `Button`).             | The same ring.                                                                             |
| `disabled` | Icon `action/disabled/fg`, no fill.                                             | Fill `action/disabled/bg`, outline `action/disabled/border`, icon `action/disabled/fg`.    |

Target states:

| Target state                   | Applies? | Why                                                          |
| ------------------------------ | -------- | ------------------------------------------------------------ |
| loading                        | no       | It starts an action; the result shows its own loading state. |
| Connected, Stale, Disconnected | no       | A Control has no Connection Status.                          |
| Fault                          | no       | Faults belong to Devices.                                    |

### Anatomy

```
root (button)     44 × 44px, the fill, the outline (secondary)
└── icon          24px, decorative: the button is named by its label
```

In Figma, `state=focus` also has a `focus-ring` layer (absolute, 6px outside the button, like `Button`); in code it's an `outline`.

### API

| Prop         | Type                     | Required | Description                                                                                |
| ------------ | ------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| `icon`       | `IconName`               | yes      | The icon, e.g. `refresh`.                                                                  |
| `label`      | `string`                 | yes      | What the button does, e.g. "Refresh Readings". Read by screen readers, shown as a tooltip. |
| `onClick`    | `() => void`             | yes      | Called when the button is clicked or activated with Enter or Space. Not while disabled.    |
| `variant`    | `"ghost" \| "secondary"` | no       | The look. Defaults to `ghost`.                                                             |
| `isDisabled` | `boolean`                | no       | Greys the button out and ignores clicks. Defaults to `false`.                              |

Decisions behind them:

- **`label` is required.** An icon-only button with no name is unusable with a screen reader. TypeScript makes it impossible to forget.
- **The label is also the tooltip** (`title`), so mouse users can check what an icon means.
- **The same disabled behaviour as `Button`:** the native `disabled` attribute, so it's skipped by Tab and announced as unavailable.

### Example values

| Case                  | icon       | label            | variant     |
| --------------------- | ---------- | ---------------- | ----------- |
| Default (in a TopBar) | `refresh`  | Refresh Readings | `ghost`     |
| Secondary             | `settings` | Settings         | `secondary` |
| Close                 | `close`    | Close            | `ghost`     |
| Disabled              | `refresh`  | Refresh Readings | `ghost`     |
| `Minimal`             | `close`    | Close            | `ghost`     |

There's no `LongText` stress case for the button itself: its size is fixed. The long label only matters as a tooltip and for screen readers ("Refresh Readings for every Space on Level 2").

### Tokens

| Part             | Property            | Token                                                                                                 |
| ---------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| root             | size                | `--shk-size-11` (44px)                                                                                |
| root             | radius              | `--shk-radius-8`                                                                                      |
| root             | icon colour         | `--shk-action-secondary-fg`                                                                           |
| root (secondary) | fill, outline       | `--shk-action-secondary-bg`, `--shk-border-width-thin` `--shk-action-secondary-border`                |
| root (hover)     | icon                | `--shk-action-subtle-fg-hover` (new, blue-600)                                                        |
| root (pressed)   | fill                | `--shk-action-subtle-bg-pressed` (blue-200)                                                           |
| root (focus)     | outline             | `--shk-border-width-medium` solid `--shk-action-focus`, offset `--shk-space-1`                        |
| root (disabled)  | icon, fill, outline | `--shk-action-disabled-fg`; secondary also `--shk-action-disabled-bg`, `--shk-action-disabled-border` |

All exist in `tokens.css`. `action/subtle/fg-hover` is new; it shares its value with `action/current/fg` but is named for what it does here (a hover colour), not for "current".

### Accessibility

- A real `<button type="button">`, named by `aria-label` (the `label`). The icon is hidden from screen readers.
- `title` shows the label as a tooltip on hover.
- 44 × 44px: the kit's touch target.
- Focus: the same 2px dark-blue ring as `Button`, 4px outside the button.
- Disabled: the native `disabled` attribute.
- Contrast: the gray-900 icon on white is well above 3:1 (the minimum for icons); the blue-600 hover icon on white is 4.75:1; the gray-900 icon on the blue-200 pressed fill is above 10:1.

### Open questions

- **A link version** (`href`) for icon-only links, e.g. a settings icon in a `TopBar` that opens the Settings screen. Not in v1; `TopBar`'s back button already covers the most common case.
