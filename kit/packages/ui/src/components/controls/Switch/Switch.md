# Switch

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/controls/switch.mdx). Props are defined in [`Switch.types.ts`](./Switch.types.ts).

### Purpose

An on/off control with "On" or "Off" next to it: for a **setting in the app** ("Show temperature in °F") or, inside [`PowerControl`](../PowerControl/PowerControl.md), for a Device's Power (decision 25, 2026-11-08). It is the simplest control in the kit: one value, two positions.

It is presentational only. The parent keeps the value (`isOn`) and decides what happens in `onChange`.

It doesn't show what it switches. The parent shows the setting's name with its own text, and passes the same name as `ariaLabel` for screen readers.

Figma: `Switch` component set in _DeTriz - Smart Home Kit_ (node `241:18`), with the properties `isOn` and `isDisabled`, named like the props. Usage: frame `Switch / usage` (node `241:19`).

Storybook: `Controls/Switch`.

### Component in domain model context

Category: **Controls** ("How do I change what I see?"): inputs that change the view or settings, as the [conventions](/docs/architecture/design-system/ds-conventions-and-structure.md) define it.

Switch shows no domain terms of its own. Since [ADR 0002](/docs/adr/0002-devices-and-capabilities.md) the kit can control Devices, but **don't use Switch on its own for a Device**: use `PowerControl`, which wraps it and adds what a Device needs (the reported value, Pending, Failed, Allowed Commands, view-only). On its own, Switch is for app settings.

A setting that fits the domain: the display Unit. The Glossary calls showing °C or °F "a formatting choice", and `UnitLabel` expects a setting for it later.

What it does **not** do, and why:

- **Control a Device on its own.** `PowerControl` does that, with Switch inside it.
- **Show the setting's name.** The parent owns the visible text, so the Switch fits in any layout (a settings list, a card).
- **Save the setting.** It takes props only. The parent stores the value and passes it back in.
- **Show a third state** ("mixed"). A setting is on or off.

### Visual idea

| Question                        | Answer                                                                    |
| ------------------------------- | ------------------------------------------------------------------------- |
| What does it roughly look like? | A 40 × 24px pill (track) with a white circle (thumb), then "On" or "Off". |
| Icons?                          | No.                                                                       |
| Separators?                     | No. The gap between the track and the text is enough.                     |
| More than one layout or size?   | One layout, one size.                                                     |
| Text size                       | "On" / "Off" in the label text style (14px, medium).                      |

Off: grey track, circle on the left. On: blue track, circle on the right. Disabled: light grey track and grey text. Focus: a blue ring around the track when reached with the keyboard.

### States

Figma properties `isOn` and `isDisabled`, props `isOn` and `isDisabled`.

| State        | Props                        | Track       | Thumb | Text      |
| ------------ | ---------------------------- | ----------- | ----- | --------- |
| Off          | `isOn={false}`               | gray 600    | left  | Off       |
| On           | `isOn={true}`                | blue 600    | right | On        |
| Disabled off | `isOn={false}`, `isDisabled` | gray 400    | left  | Off, grey |
| Disabled on  | `isOn={true}`, `isDisabled`  | gray 400    | right | On, grey  |
| Focus        | reached with the keyboard    | + blue ring | –     | –         |

Target states:

| Target state | Applies? | Why                                                                                                     |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| loading      | partly   | No loading state of its own. While the setting's value isn't known yet, the parent passes `isDisabled`. |
| Connected    | no       | A Switch controls an app setting, not a Device, so Connection Status doesn't apply.                     |
| Stale        | no       | Same as above.                                                                                          |
| Disconnected | no       | Same as above.                                                                                          |
| Fault        | no       | Same as above.                                                                                          |

### Anatomy

```
root            <label>                 makes the "On" / "Off" text clickable too
├── track       <button role="switch">  the pill; aria-checked, aria-label
│   └── thumb   <span>                  the white circle
└── state       <span aria-hidden>      "On" or "Off"
```

1. **root**: a `<label>` around the button, so clicking the text flips the switch too.
2. **track**: the real control. A `<button type="button" role="switch">` with `aria-checked` and `aria-label`.
3. **thumb**: decoration. Moves right by its own width when on.
4. **state**: the visible "On" / "Off". Hidden from screen readers, because `aria-checked` already says it. Never wraps.

### API

The props are defined in [`Switch.types.ts`](./Switch.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

The decisions behind them:

- `isOn` and `onChange` are required: the parent owns the value. `onChange` gets the **new** value, so the parent can just store it.
- `ariaLabel` is required: a switch without a name is unusable for screen reader users. It is not shown, because the parent shows its own text.
- `isDisabled` defaults to `false`.
- No `label` prop: the visible name belongs to the parent's layout.
- `ariaDescribedBy` (optional, added 2026-11-08): links the switch to text that explains it, e.g. why it is disabled. `PowerControl` uses it for its message line.

### Example values

| Use              | ariaLabel                                               | isOn         | isDisabled | Shows                                     |
| ---------------- | ------------------------------------------------------- | ------------ | ---------- | ----------------------------------------- |
| Default story    | Show temperature in °F                                  | false        | false      | Off                                       |
| On               | Show temperature in °F                                  | true         | false      | On                                        |
| Disabled         | Show temperature in °F                                  | false / true | true       | Off / On, greyed out                      |
| `LongText` story | Show temperatures in degrees Fahrenheit on every screen | false        | false      | "Off" in an 80px frame: stays on one line |
| `Minimal` story  | Notifications                                           | true         | false      | On                                        |

Stories: `Off`, `On`, `DisabledOff`, `DisabledOn`, `LongText`, `Minimal`.

### Tokens

| Part  | State    | Property    | Code token                                                                          |
| ----- | -------- | ----------- | ----------------------------------------------------------------------------------- |
| root  | all      | gap         | `--shk-space-2` (8px)                                                               |
| root  | all      | text colour | `--shk-color-text-primary`                                                          |
| root  | disabled | text colour | `--shk-color-text-disabled`                                                         |
| track | all      | size        | `--shk-size-10` × `--shk-size-6` (40 × 24px)                                        |
| track | all      | padding     | `--shk-space-1` (4px)                                                               |
| track | all      | shape       | `--shk-radius-full`                                                                 |
| track | off      | background  | `--shk-status-neutral-border`                                                       |
| track | on       | background  | `--shk-status-progress-border`                                                      |
| track | disabled | background  | `--shk-color-text-disabled`                                                         |
| track | focus    | ring        | `--shk-border-width-medium`, `--shk-status-progress-border`, offset `--shk-space-1` |
| thumb | all      | size        | `--shk-size-4` (16px)                                                               |
| thumb | all      | colour      | `--shk-surface-default`                                                             |
| state | all      | text style  | `--shk-typography-label-*` (14px, medium)                                           |

The Figma variable names still need to be checked against the component in Figma (see Open questions).

### Accessibility

- A `<button role="switch" aria-checked>`: screen readers say "Show temperature in °F, switch, off".
- Space or Enter flips it. Tab reaches it, and the focus ring shows.
- The "On" / "Off" text is clickable (the `<label>`), but hidden from screen readers: `aria-checked` already says it.
- Not colour alone: the thumb's position and the "On" / "Off" text both carry the value.
- Contrast: the off track (gray 600) and on track (blue 600) on white are above 3:1, as non-text parts of a control need. Disabled controls are exempt from contrast rules.
- No motion: the thumb jumps, it doesn't slide.

### Open questions

- **Figma example and variables.** The Figma usage frame (node `241:19`) may still show the Heating example. Update it to a setting, and add a Figma variable column to the Tokens table.
- **Visible name and `ariaLabel`.** The parent shows the name and passes it again as `ariaLabel`. If the two drift apart, what people see and hear differ. A later option: an `aria-labelledby` prop pointing at the parent's text.
