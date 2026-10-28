# Switch

### Purpose

An on/off control that shows **On** or **Off** next to it, e.g. for turning Heating on or off. It is the simplest control in the kit: one value, two positions.

It is presentational only. The parent keeps the value (`isOn`) and decides what happens in `onChange`. The Switch never sends commands to a Device by itself.

It doesn't show what it switches (no "Heating" text). The parent shows that with its own component, like a card title, and passes the same name as `ariaLabel` for screen readers.

Figma: `Switch` component set in _DeTriz - Smart Home Kit_ (node `241:18`), with the properties `isOn` and `isDisabled`, named like the props. Usage: frame `Switch / usage` (node `241:19`).

Storybook: `Controls/Switch`.

### Visual idea

| Question           | Answer                                                                    |
| ------------------ | ------------------------------------------------------------------------- |
| What it looks like | A 40 × 24px pill (track) with a white circle (thumb), then "On" or "Off". |
| Off                | Grey track, circle on the left.                                           |
| On                 | Blue track, circle on the right.                                          |
| Disabled           | Light grey track and grey text. Clicks are ignored.                       |
| Focus              | A blue ring around the track when reached with the keyboard.              |

Tokens: `--shk-status-neutral-border` (off), `--shk-status-progress-border` (on, focus), `--shk-color-text-disabled` (disabled), `--shk-surface-default` (thumb), label text style for "On"/"Off".

### States

| State    | Props                             |
| -------- | --------------------------------- |
| Off      | `isOn={false}`                    |
| On       | `isOn={true}`                     |
| Disabled | `isDisabled` (with `isOn` on/off) |

Target states: the Switch is a basic control and doesn't know about Devices. The parent maps them:

| Target state | How the parent handles it                                  |
| ------------ | ---------------------------------------------------------- |
| loading      | Disable the Switch until the current value is known.       |
| Connected    | Normal Switch.                                             |
| Stale        | Normal Switch; the parent shows Stale next to it.          |
| Disconnected | Disable the Switch: a command can't reach the Device.      |
| Fault        | Disable the Switch; the parent shows the Fault next to it. |

### Props

| Prop         | Type                      | Default | Description                                    |
| ------------ | ------------------------- | ------- | ---------------------------------------------- |
| `ariaLabel`  | `string`                  | —       | Screen-reader name, e.g. "Heating". Not shown. |
| `isOn`       | `boolean`                 | —       | Whether the switch is on.                      |
| `onChange`   | `(isOn: boolean) => void` | —       | Called with the new value when flipped.        |
| `isDisabled` | `boolean`                 | `false` | Greys it out and ignores clicks.               |

### Accessibility

- A `<button role="switch" aria-checked>`: screen readers say "Heating, switch, on".
- Space or Enter flips it. Tab reaches it; the focus ring shows.
- The "On"/"Off" text is clickable (a `<label>`), but hidden from screen readers: `aria-checked` already says it.
