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
| icon   | **Alert Level**                | `error-fill`        | From `ALERT_LEVEL_ICONS`.                                                                     |
| title  | what the **Alert Rule** caught | Smoke detected      | Written by the app, the same text as in AlertListItem.                                        |
| meta   | **Space** + when it was raised | Kitchen · 2 min ago | `spaceName` (optional) and `raisedAt` (RelativeTime).                                         |
| action | open the Alert                 | View                | Optional (`actionLabel` + `onAction`).                                                        |
| ×      | the **Close Alert** command    | ×                   | Optional (`onClose`). Only the Site's owner may close an Alert: the app shows × only to them. |

Only Active Alerts get a banner. When the Alert Ends or is Closed, the parent removes it.

### Variants

Figma variant property `alertLevel` (3), plus booleans `hasPlace`, `hasAction` and `isClosable`, and text properties `title`, `place`. Feedback, so the target states don't apply.

| `alertLevel` | Fill                 | Border                   | Icon                 | Title                | Meta                   | Screen reader   |
| ------------ | -------------------- | ------------------------ | -------------------- | -------------------- | ---------------------- | --------------- |
| `critical`   | `status/danger/bg`   | `status/danger/border`   | `status/danger/fg`   | `color-text/primary` | `color-text/secondary` | `role="alert"`  |
| `warning`    | `status/warning/bg`  | `status/warning/border`  | `status/warning/fg`  | `color-text/primary` | `color-text/secondary` | `role="alert"`  |
| `info`       | `status/progress/bg` | `status/progress/border` | `status/progress/fg` | `color-text/primary` | `color-text/secondary` | `role="status"` |

All three levels share one look: a light fill with a thin border in the level colour. The red colour, the icon and `role="alert"` mark Critical Alerts. Contrast: text on the light fills is 5.9:1 or more.

### Layout and anatomy

Like InlineMessage: one row that wraps; the action moves under the text when the text would get narrower than 96px; × stays on the right.

```
AlertBanner
├── content
│   ├── icon     AlertLevelIcon (md)
│   ├── text
│   │   ├── title  "Smoke detected"          (label)
│   │   └── meta   "Kitchen · " + RelativeTime(sm)  (body-sm)
│   └── action   Button secondary "View"
└── close        × (ActionIcon dismiss, sm)
```

Padding `space/4`, gap `space/3`, radius `radius/8`, border `border-width/thin` (warning, info).

### Accessibility

- Critical and Warning use `role="alert"` (announced straight away), Info `role="status"`.
- The icon is decorative: the title says what happened, and the colour adds urgency on top.
- × has a label (`closeLabel`, default "Close alert").

### Open questions

- Several Active Critical Alerts at once: one banner per Alert, or one banner with "and 2 more"? Today: the app shows one banner (the most urgent) and lists the rest.
