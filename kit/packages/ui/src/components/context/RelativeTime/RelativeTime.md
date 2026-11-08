# RelativeTime

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/context/relative-time.mdx). Props are defined in [`RelativeTime.types.ts`](./RelativeTime.types.ts).

### Purpose

Shows a moment in time the way people read it: **"2 min ago"**, **"14:02"** or a duration like **"3 min"**. It is a small piece of text, used next to values and in rows: when a Detection started, when the last one ended, when an Alert was raised.

It wraps the text in a `<time>` element with the exact moment in `dateTime`, so machines and screen readers get the precise time too.

Figma: `RelativeTime` component set in _DeTriz - Smart Home Kit_ (node `588:7`, page `RelativeTime` in the Context section).

### Component in domain model context

Category: **Context** ("Where is this / what is it?"). The moment itself is a fixed fact (a Reading's time, a Detection's start); only its wording changes as time passes.

| Part | Domain term                                       | Example   | Rule                                                         |
| ---- | ------------------------------------------------- | --------- | ------------------------------------------------------------ |
| text | time of a **Reading**, **Detection** or **Alert** | 2 min ago | Formatted from the moment and "now". Never changes the data. |

### Formats (prop `format`)

| `format`   | Example (now 14:05)                                       | Rules                                                                                                         |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `relative` | "just now", "3 min ago", "2 h ago", "3 days ago", "6 Nov" | Under 1 min: "just now". Under 1 h: minutes. Under 24 h: hours. Under 7 days: days. Older: the date. Default. |
| `clock`    | "14:02", "6 Nov, 14:02"                                   | 24-hour clock. The date is added when it isn't today.                                                         |
| `duration` | "3 min", "2 h 5 min", "3 days"                            | Time from the moment until now. Under 1 min: "under 1 min".                                                   |

Words are English for now. The formatting lives in `utils/formatTime.ts`, so a later locale option changes one file.

### Live updates

"2 min ago" goes out of date while the screen is open. The component re-renders itself every 30 seconds (a timer, no data fetching). Pass `now` to fix the time, e.g. in stories, tests and docs, and the timer is skipped.

### Visual idea and sizes

Plain text in `color-text/secondary`, no icon, no background. One line, never wraps.

| Size | Text style | Use                                            |
| ---- | ---------- | ---------------------------------------------- |
| `xs` | `caption`  | Next to `md` values and in list rows. Default. |
| `sm` | `body-sm`  | Next to `lg` values in cards.                  |

Figma: variant property `size` (xs, sm) and a text property `time` for the sample text. No `format` variant: the format only changes the words.

### States

Context, so no states of its own. Target states don't apply: the moment is a fixed fact. The parent hides it when it shouldn't show (e.g. Disconnected in `DetectionStatus`).

### Accessibility

- `<time dateTime="2026-11-07T14:02:00Z">` carries the exact moment.
- `title` shows the full date and time on hover, for "2 h ago" and durations.
- Not colour alone: it's text.

### Open questions

- Locales and 12-hour clocks: English and 24-hour only for now.
