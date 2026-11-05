# InlineMessage

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/feedback/inline-message.mdx). Props are defined in [`InlineMessage.types.ts`](./InlineMessage.types.ts).

Figma: `InlineMessage` component set in _DeTriz - Smart Home Kit_ (node `450:26`), page `InlineMessage`. Examples in the `InlineMessage / usage` frame (node `450:27`).

### Purpose

A short message in the page that tells the user what the interface just did or couldn't do: an icon, an optional title, one or two lines of text and, if needed, one action and a dismiss (×) button. For example "Couldn't load Readings" / "Check that the Hub is on the same network." with a **Retry** button, or "Settings saved".

It sits where the thing it talks about is: above a list of Spaces, at the top of a `SpaceCard`'s content, under a form. It stays until the parent removes it.

It takes props only. It doesn't fetch, retry or hide itself: the parent decides when to show it, what the action does and what happens when the user dismisses it.

### Component in domain model context

Category: **Feedback** ("What is the interface doing?"). Not Status: Status describes the hardware or the environment, and this describes the app. "Couldn't load Readings" is about the app's request, not about a Device.

It shows no domain field of its own. The message text comes from the parent and uses [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) words, like Reading, Space and Hub.

What it does **not** show, and why:

- **Connection Status or Fault.** "The Hub is Disconnected" or "CO₂ sensor failure" are hardware states. Use `DeviceConnectionStatus` and `DeviceFaultStatus`. A rule of thumb: if the message would still be true with the app closed, it's Status.
- **Several actions or links.** One action at most, so it stays inline and simple.
- **Closing on a timer.** It never disappears by itself, unlike a toast: a message that vanishes can be missed. The dismiss button only asks the parent to remove it.

### Visual idea

Based on a reference screenshot (`screens/toast.webp`): a white card with a coloured bar on the left.

| Question                        | Answer                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| What does it roughly look like? | A full-width white card with a subtle outline and a 4px tone-coloured bar on the left edge    |
| Icons?                          | Yes, one **filled** icon per tone, in the tone's bright colour                                |
| Text                            | Optional title (`label`, 14px medium, dark), then the message (`body-sm`, 14px regular, grey) |
| Separators?                     | No                                                                                            |
| More than one layout or size?   | One size. The action moves under the text when there isn't room beside it                     |
| Icon size                       | 24px tone icon (`md`), 20px × icon (`sm`)                                                     |

```
┃ ● Couldn't load Readings                         ┃
┃   Check that the Hub is on the …    [ Retry ]  × ┃
```

`┃` on the left is the coloured bar. The icon, text and action are centred vertically in the row, so a one-line message sits level with the 44px Retry button. The × stays on the right edge, even when the action moves under the text. The text is at least 96px wide (`--shk-size-24`); below that, the action moves to the next line. The text wraps instead of truncating: a cut-off error could hide what went wrong.

### Variants

InlineMessage is Feedback, so it has no Device states. It changes in four ways: the **tone**, **whether there is a title**, **whether there is an action** and **whether it can be dismissed**.

**Tone** (Figma variant property `tone`, prop `tone`):

| Value     | Means                                  | Colour role | Icon                | Example message                                                        |
| --------- | -------------------------------------- | ----------- | ------------------- | ---------------------------------------------------------------------- |
| `info`    | Something worth knowing, nothing wrong | `progress`  | `info-fill`         | Readings refresh automatically / New Readings appear every 30 seconds. |
| `success` | Something the user did worked          | `success`   | `check_circle-fill` | Settings saved / Your Spaces now use the new names.                    |
| `warning` | It worked, but not fully               | `warning`   | `warning-fill`      | Some Spaces didn't load / Showing 4 of 6 Spaces.                       |
| `error`   | Something failed and the user can act  | `danger`    | `error-fill`        | Couldn't load Readings / Check that the Hub is on the same network.    |

The prop is `tone`, not `variant`: `Button` already uses `variant` for how much weight an action has, and a different word avoids mixing the two up.

The tone is `error`, not `danger`: users read "error". The CSS still uses the `--shk-status-danger-*` tokens.

**Title** (Figma boolean property `hasTitle`, text property `title`). In code there is no boolean: the title is shown when `title` is given.

**Action** (Figma boolean property `hasAction`). In code there is no boolean: the action is shown when both `actionLabel` and `onAction` are given.

| Example        | Props given                           | Result                          |
| -------------- | ------------------------------------- | ------------------------------- |
| With action    | tone, children, actionLabel, onAction | Couldn't load Readings. [Retry] |
| Without action | tone, children                        | Settings saved.                 |

**Dismiss** (Figma boolean property `isDismissible`). In code there is no boolean: the × is shown when `onDismiss` is given.

| Example         | Props given               | Result            |
| --------------- | ------------------------- | ----------------- |
| Dismissible     | tone, children, onDismiss | Settings saved. × |
| Not dismissible | tone, children            | Settings saved.   |

Target states:

| Target state | Applies? | Why                                                                                           |
| ------------ | -------- | --------------------------------------------------------------------------------------------- |
| loading      | no       | Loading is the parent's job (each Readings component has its own loading state).              |
| Connected    | no       | Connection Status belongs to `DeviceConnectionStatus`.                                        |
| Stale        | no       | Same reason.                                                                                  |
| Disconnected | no       | Same reason.                                                                                  |
| Fault        | no       | A Fault is a hardware problem, shown by `DeviceFaultStatus`. The `error` tone is for the app. |

### Anatomy

```
root           <div role="status" | role="alert">   the card, carries data-tone
├── accent     (CSS border-inline-start)            the coloured bar, no element in code
├── icon       Icon name="<tone>-fill" size="md"    decorative
├── title      <p>                                  optional, from the title prop
├── message    <p>                                  the text from children
├── action     Button variant="secondary"           optional
└── dismiss    <button aria-label={dismissLabel}>   optional, holds Icon name="close" size="sm"
```

In Figma, `icon`, `text` (title and message) and `action` sit in a `content` frame, so the action can wrap under the text while `dismiss` stays on the right. `accent` is an absolutely positioned 4px rectangle. In code this can be a plain wrapper `<div>` or CSS grid on `root`.

1. **root**: white background, subtle outline, padding.
2. **accent**: the 4px bar in the tone's bright colour.
3. **icon**: filled, in the tone's bright colour. Decorative, because the text says the same thing.
4. **title**: short and bold, e.g. "Couldn't load Readings". Optional.
5. **message**: the text, grey. Wraps.
6. **action**: the existing `Button`. Only rendered when `actionLabel` and `onAction` are given.
7. **dismiss**: a 32px square button with the `close` icon. Only rendered when `onDismiss` is given.

### API

The props are defined in [`InlineMessage.types.ts`](./InlineMessage.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `tone`, not `variant`, and `error`, not `danger`: see Variants.
- No booleans for the optional parts: the title shows when `title` is given, the action when both `actionLabel` and `onAction` are given, the × when `onDismiss` is given. Figma's `hasTitle`, `hasAction` and `isDismissible` map to these.
- `dismissLabel` defaults to `"Dismiss"`, so apps in other languages can change what screen readers say.
- The component never hides itself. `onDismiss` only tells the parent, which removes it.

### Example values

| Use              | tone      | title                          | children                                                                             | actionLabel           | onDismiss |
| ---------------- | --------- | ------------------------------ | ------------------------------------------------------------------------------------ | --------------------- | --------- |
| Info             | `info`    | Readings refresh automatically | New Readings appear every 30 seconds.                                                | —                     | —         |
| Success          | `success` | Settings saved                 | Your Spaces now use the new names.                                                   | —                     | yes       |
| Warning          | `warning` | Some Spaces didn't load        | Showing 4 of 6 Spaces.                                                               | Retry                 | yes       |
| Error            | `error`   | Couldn't load Readings         | Check that the Hub is on the same network.                                           | Retry                 | —         |
| `LongText` story | `error`   | Couldn't load Readings         | Check that the Hub is on the same network as your phone or computer, then try again. | Try again, 240px wide | yes       |
| `Minimal` story  | `success` | —                              | Saved.                                                                               | —                     | —         |

Stories: `Info`, `Success`, `Warning`, `Error`, `WithAction`, `WithoutTitle`, `Dismissible`, `LongText`, `Minimal`.

### Tokens

From the Figma draft. To confirm in the review (step 3).

| Part    | Property    | Code token                                             | In `tokens.css`? |
| ------- | ----------- | ------------------------------------------------------ | ---------------- |
| root    | background  | `--shk-surface-default`                                | yes              |
| root    | border      | `--shk-color-border-subtle`, `--shk-border-width-thin` | yes              |
| root    | radius      | `--shk-radius-4`                                       | yes              |
| root    | padding     | `--shk-space-4`                                        | yes              |
| root    | gap         | `--shk-space-2` (content to ×)                         | yes              |
| accent  | colour      | `--shk-status-<role>-solid`                            | yes, all roles   |
| accent  | width       | `--shk-border-width-thick` (4px)                       | yes              |
| content | gap         | `--shk-space-3` (icon to text, text to action)         | yes              |
| content | row gap     | `--shk-space-2` (when the action wraps under the text) | yes              |
| icon    | colour      | `--shk-status-<role>-solid`                            | yes, all roles   |
| title   | colour      | `--shk-color-text-primary`                             | yes              |
| title   | text        | `--shk-typography-label-*`                             | yes              |
| text    | gap         | `--shk-space-1` (title to message)                     | yes              |
| text    | min width   | `--shk-size-24` (96px)                                 | yes              |
| message | colour      | `--shk-color-text-secondary`                           | yes              |
| message | text        | `--shk-typography-body-sm-*`                           | yes              |
| dismiss | size        | `--shk-size-8` (32px)                                  | yes              |
| dismiss | radius      | `--shk-radius-4`                                       | yes              |
| dismiss | icon colour | `--shk-color-text-secondary`                           | yes              |

`<role>` is `progress` (info), `success`, `warning` or `danger` (error).

### Accessibility

- `info` and `success` use `role="status"`: read out politely, without interrupting.
- `warning` and `error` use `role="alert"`: read out straight away.
- The live region only announces changes, so the parent should keep `root` on the page and change its content, or add it after the page has loaded. The user docs page will explain this.
- Not colour alone: each tone has its own icon shape (circle with i, circle with tick, triangle, circle with !), and the title and message say what happened.
- The action is a real `<button>` (from `Button`), so it works with the keyboard.
- The dismiss button is a real `<button>` with `aria-label` from `dismissLabel` ("Dismiss" by default), because the × icon has no text. It needs a visible focus ring, like `Button`. At 32px it is above the 24px minimum target size.
- After dismissing, the parent should move focus somewhere sensible (for example the list the message was about), so keyboard users aren't left on nothing.
- Contrast: the title is gray 900 and the message gray 700 (`#535c62`) on white, both above 4.5:1. The bright `solid` colours of the icon and bar are **below 3:1** on white for blue (2.3:1), green (2.1:1) and amber (2.1:1); only red passes (3.1:1). That's acceptable only because the text carries the meaning and the icon is decorative. See Open questions.

### Decisions

- **Look follows the reference** (`screens/toast.webp`): white card, 4px tone bar on the left, filled tone icon, bold title, grey message, ×. This replaces the first draft's tinted background and tone-coloured border.
- **Info is blue (`progress`), not grey (`neutral`).** Blue is what people expect for info, and grey looks like a disabled box.
- **Icons:** `info-fill`, `check_circle-fill`, `warning-fill` and `error-fill`, plus `close` for dismiss. Warning stays a triangle (the reference uses a circle), so it can't be mixed up with error even in greyscale.
- **Text is 14px:** `label` for the title and `body-sm` for the message, the same size as the `Button` label.

- **Row is centred, not top-aligned.** Most messages are one or two lines, and centred lines up with Retry. With a long message the icon sits beside the middle line, which is acceptable.
- **No shadow, a subtle outline instead.** It is a message inside the page, not a toast floating above it, and there is no shadow token. If a floating toast is needed later, it's a separate component with its own elevation token.
- **Bright icon colours stay** (`status/*/solid`), although blue, green and amber are below 3:1 on white. The title and message carry the meaning, so the icon and bar are decorative. Revisit if darker `status` tokens are added.
- **One gap for the content row** (`space/3`): between icon and text, and between text and action. Simpler, and it looks right.
- **Text keeps at least 96px** (`size/24`) before the action wraps. An existing token, so nothing new is needed. Without a minimum, Figma squeezes the text to a few letters.
- **`dismissLabel` prop** with the default `"Dismiss"`, so apps in other languages can change what screen readers say.

### Open questions

None that block building.
