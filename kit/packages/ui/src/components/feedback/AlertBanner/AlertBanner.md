# AlertBanner

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/feedback/alert-banner.mdx). Props are defined in [`AlertBanner.types.ts`](./AlertBanner.types.ts).

### Purpose

A strong message at the top of a screen for one **Active** [Alert](/kit/apps/docs-site/docs/domain-model/glossary.mdx#alerts) that needs attention now: 🔴 **Smoke detected** · Kitchen · 2 min ago [View] [×]. It is the loudest Alert component: use it for the most urgent Active Alert, and list the rest with [`AlertListItem`](../../status/AlertListItem/AlertListItem.md).

It looks like [`InlineMessage`](../InlineMessage/InlineMessage.md) (icon, text, action, ×), but it is about an Alert, not about what the app did, and it is tinted with the Alert Level's colour.

Figma: `AlertBanner` component set in _DeTriz - Smart Home Kit_ (node `603:56`, page `AlertBanner` in the Feedback section after Badge). Text properties `title`, `place`; booleans `hasPlace`, `hasAction`, `isClosable`.

### Component in domain model context

Category: **Feedback** ("Does this need my attention?").

| Part   | Domain term                    | Example             | Rule                                                                                          |
| ------ | ------------------------------ | ------------------- | --------------------------------------------------------------------------------------------- |
| icon   | **Alert Level**                | `error`             | Outline icon from `TILE_ICONS` (in the component), white on a tile in the level colour.       |
| title  | what the **Alert Rule** caught | Smoke detected      | Written by the app, the same text as in AlertListItem.                                        |
| meta   | **Space** + when it was raised | Kitchen · 2 min ago | `spaceName` (optional) and `raisedAt` (RelativeTime).                                         |
| action | open the Alert                 | View                | Optional (`actionLabel` + `onAction`).                                                        |
| ×      | the **Close Alert** command    | ×                   | Optional (`onClose`). Only the Site's owner may close an Alert: the app shows × only to them. |

Only Active Alerts get a banner. When the Alert Ends or is Closed, the parent removes it.

### Variants

Figma variant property `alertLevel` (3), plus booleans `hasPlace`, `hasAction` and `isClosable`, and text properties `title`, `place`. Feedback, so the target states don't apply.

| `alertLevel` | Fill                        | Border                          | Icon tile               | Icon                 | Screen reader   |
| ------------ | --------------------------- | ------------------------------- | ----------------------- | -------------------- | --------------- |
| `critical`   | `status/danger/bg-subtle`   | `status/danger/border-subtle`   | `status/danger/solid`   | `color-text/inverse` | `role="alert"`  |
| `warning`    | `status/warning/bg-subtle`  | `status/warning/border-subtle`  | `status/warning/solid`  | `color-text/inverse` | `role="alert"`  |
| `info`       | `status/progress/bg-subtle` | `status/progress/border-subtle` | `status/progress/solid` | `color-text/inverse` | `role="status"` |

Title `color-text/primary`, meta `color-text/secondary` on every level.

All three levels share one look: a very light fill (palette 50) with a light border (palette 200), and the outline Alert Level icon in white on a 40px tile in the level colour (palette 400). The red colour, the icon and `role="alert"` mark Critical Alerts. Contrast: text on the light fills is well above 4.5:1. The white icon on the tile is about 3.2:1 on red but only about 2:1 on amber and 2.4:1 on blue; that is accepted because the icon is decorative (the title says what happened).

### Layout and anatomy

Like InlineMessage: one row that wraps; the action moves under the text when the text would get narrower than 96px; × stays on the right.

```
AlertBanner
├── content
│   ├── icon     40px tile (size/10, radius/8) with an outline icon (md, 24px)
│   ├── text
│   │   ├── title  "Smoke detected"          (body size, bold: alert-banner/title/font-weight)
│   │   └── meta   "Kitchen · " + RelativeTime(sm)  (body-sm)
│   └── action   Button secondary sm "View"
└── close        × (ActionIcon dismiss, sm)
```

Padding `space/3` top and bottom, `space/4` at the sides (so the banner is about 69px tall), gap `space/3`, no gap between title and meta (`space/0`), radius `radius/8`, border `border-width/thin`.

### Accessibility

- Critical and Warning use `role="alert"` (announced straight away), Info `role="status"`.
- The icon is decorative: the title says what happened, and the colour adds urgency on top.
- The "View" action is the small Button (32px). The banner around it is still a large, clear area; × is 32px as before.
- × has a label (`closeLabel`, default "Close alert").

### Open questions

- Several Active Critical Alerts at once: one banner per Alert, or one banner with "and 2 more"? Today: the app shows one banner (the most urgent) and lists the rest.
