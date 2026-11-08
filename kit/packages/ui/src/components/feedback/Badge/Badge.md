# Badge

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/feedback/badge.mdx). Props are defined in [`Badge.types.ts`](./Badge.types.ts).

### Purpose

A small count in a pill, like **3**, that tells people how many things need their attention: Active Alerts on an Alerts tab, on a `SpaceCard` or next to a Module. It sits on or next to something else; it never stands alone.

Figma: `Badge` component set in _DeTriz - Smart Home Kit_ (node `593:10`, page `Badge` in the Feedback section). Variant `tone`, text property `count`. The `Badge examples` frame (node `593:11`) shows 1, 12, 99+ and a Badge on the bell icon.

### Component in domain model context

Category: **Feedback** ("Does this need my attention?"). It says how many, not what.

| Part  | Domain term                             | Example  | Rule                                                                        |
| ----- | --------------------------------------- | -------- | --------------------------------------------------------------------------- |
| count | usually the number of **Active Alerts** | 3        | The parent counts. Over `max` it shows "99+". 0 shows nothing.              |
| tone  | the highest **Alert Level** among them  | critical | Critical beats Warning beats Info. `neutral` for counts that aren't Alerts. |

### Visual idea

A rounded pill with a number: filled with the tone's `solid` colour, text in `on-solid`. At least as wide as it is tall, so a single digit is a circle.

| Question          | Answer                                                                    |
| ----------------- | ------------------------------------------------------------------------- |
| Size              | One: 18px high (caption line height), min 18px wide.                      |
| Icons?            | No. The thing it sits on has the icon (e.g. the bell from `ALERT_ICONS`). |
| Where does it go? | The parent places it: next to a label, or over an icon's corner.          |

### Variants

Figma variant property `tone` (4) and a text property `count`. Feedback, so the target states don't apply: a Badge is a summary the parent works out; if the data is loading or Disconnected, the parent shows no Badge.

| `tone`     | Fill                    | Text                       | Use                                   |
| ---------- | ----------------------- | -------------------------- | ------------------------------------- |
| `critical` | `status/danger/solid`   | `status/danger/on-solid`   | At least one Critical Alert is Active |
| `warning`  | `status/warning/solid`  | `status/warning/on-solid`  | Highest Active Alert is Warning       |
| `info`     | `status/progress/solid` | `status/progress/on-solid` | Highest Active Alert is Info          |
| `neutral`  | `status/neutral/solid`  | `status/neutral/on-solid`  | Counts that aren't Alerts. Default.   |

Code: `count` 0 (or less) renders nothing. `count` above `max` (default 99) shows `"{max}+"`.

### Anatomy

```
Badge
└── count   "3"
```

Padding inline `space/1`, radius `radius/full`, text `typography/caption` with tabular figures.

### Accessibility

- A bare "3" means nothing to a screen reader, so `label` is required: "3 active Alerts". The visible number is hidden from screen readers and the label is read instead.
- Text contrast: `on-solid` (gray/950) on the `solid` fills is 5.5:1 (red) to 8.4:1 (amber), so AA passes.
- Shape against white: only red reaches 3:1. Fine, because the number (which passes) carries the meaning, not the shape.
- Not colour alone: the tone adds urgency; the label says what it counts.

### Open questions

- A dot-only Badge (no number) for "something new"? Not needed in the MVP.

### Used by (2026-11-07)

`SpaceListItem` (end of the row), `SpaceCard` (next to the name) and `BottomNav` (`badge` on an item, on the icon's corner). The "N active Alert(s)" wording is shared in `utils/alertCountLabel.ts`.
