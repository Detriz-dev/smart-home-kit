# AlertListItem

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/alert-list-item.mdx). Props are defined in [`AlertListItem.types.ts`](./AlertListItem.types.ts).

### Purpose

One [Alert](/kit/apps/docs-site/docs/domain-model/glossary.mdx#alerts) as a List row: its level, what happened, where, whether it is still Active, and when. It is the row of an Alerts screen or an Alerts section of a Space page. It is built on [`ListItem`](../../layout/ListItem/ListItem.md), like [`DeviceListItem`](../DeviceListItem/DeviceListItem.md).

Figma: `AlertListItem` component set in _DeTriz - Smart Home Kit_ (node `599:214`, page `AlertListItem` in the Status section after DeviceListItem). A wrapper around a `ListItem` instance, the same as DeviceListItem.

### Component in domain model context

Category: **Status** ("Is something wrong?"). An Alert has a life (Active → Ended or Closed), and this row shows where it is in it.

| Part        | Domain term                           | Example        | Rule                                                                                   |
| ----------- | ------------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| start icon  | **Alert Level**                       | `error-fill`   | From `ALERT_LEVEL_ICONS`. Level colour while Active, grey once Ended or Closed.        |
| title       | what the **Alert Rule** caught        | Smoke detected | Written by the app (it knows its rules), e.g. "Smoke detected", "Kitchen above 28 °C". |
| description | the **Space** (or Asset) of the Alert | Kitchen        | Optional. Leave it out on a screen that is already about one Space.                    |
| end: status | **Alert Status**                      | Active         | Active, Ended or Closed. In the level colour while Active.                             |
| end: time   | raised at / ended at                  | 2 min ago      | Active: when it was raised. Ended or Closed: when it ended (falls back to raised).     |

### States

Figma variant property `state` (5). Status category, but the target states (loading, Connected, Stale…) belong to Devices, not Alerts: an Alert has its own life, so these are its variants instead.

| Figma `state`     | Code                                            | Icon colour            | Status word          |
| ----------------- | ----------------------------------------------- | ---------------------- | -------------------- |
| `active-critical` | `alertStatus="active"`, `alertLevel="critical"` | `status/danger/fg`     | Active (danger fg)   |
| `active-warning`  | `alertStatus="active"`, `alertLevel="warning"`  | `status/warning/fg`    | Active (warning fg)  |
| `active-info`     | `alertStatus="active"`, `alertLevel="info"`     | `status/progress/fg`   | Active (progress fg) |
| `ended`           | `alertStatus="ended"`                           | `color-text/secondary` | Ended (secondary)    |
| `closed`          | `alertStatus="closed"`                          | `color-text/secondary` | Closed (secondary)   |

Ended and Closed keep the level's icon shape, so people still see what kind of Alert it was. Icons use the `fg` (800) step, not `solid`: on white, `solid` amber and blue are below 3:1, and the icon carries the level.

### Anatomy

```
AlertListItem
└── ListItem
    ├── start        AlertLevelIcon (md)
    ├── title        "Smoke detected"
    ├── description  "Kitchen"
    └── end          status (column, right-aligned)
                     ├── word  "Active"        (caption, medium)
                     └── time  RelativeTime xs "2 min ago"
```

### API

Props are in [`AlertListItem.types.ts`](./AlertListItem.types.ts). Decisions:

- `title` is text from the app. The kit can't word every Alert Rule well ("Contact Open" vs "Front door opened"), so the app writes it.
- `raisedAt` is required; `endedAt` is optional and only used for Ended and Closed.
- Clickable rows (`href` or `onClick`) like DeviceListItem, to open the Alert. No close button in the row: a button inside a clickable row is hard to hit and confusing for screen readers. Closing happens on the Alert's own screen or in `AlertBanner`.

### Decisions

- **The title stays primary text in every state** (2026-11-07). ListItem renders the `<li>` itself, so AlertListItem can't restyle its title without a wrapper that would break the list. The grey icon and the status word already say an Alert is over.

### Accessibility

- The level icon has a label ("Critical", "Warning", "Info"), because nothing else on the row says the level.
- The status is a word, not only a colour.
- Times are `<time>` elements (RelativeTime).

### Open questions

- A "Close" action per row for the Site's owner? Left out for now (see API).
