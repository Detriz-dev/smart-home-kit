# SpaceListItem

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/context/space-list-item.mdx). Props are defined in [`SpaceListItem.types.ts`](./SpaceListItem.types.ts).

### Purpose

One [Space](/kit/apps/docs-site/docs/domain-model/glossary.mdx#places) as a List row: its Space Type icon, its name, where it is and how much is in it, and how many Alerts are Active there: 🍳 **Kitchen** · Ground floor · 3 Devices [2]. It is the row of a Site overview ("all rooms") and a Floor section. Tapping it opens the Space.

It is built on [`ListItem`](../../layout/ListItem/ListItem.md), like `DeviceListItem` and `AlertListItem`. The icon comes from `SPACE_TYPE_ICONS`, like [`SpaceLabel`](../SpaceLabel/SpaceLabel.md).

Figma: `SpaceListItem` component set in _DeTriz - Smart Home Kit_ (node `606:92`, page `SpaceListItem` in the Context section after AssetLabel).

### Component in domain model context

Category: **Context** ("What is it?"): it names a place. The Alert count is a summary the parent works out; the row has no status of its own (a Space has no Device Status).

| Part        | Domain term                              | Example                  | Rule                                                                                              |
| ----------- | ---------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| icon        | **Space Type**                           | `countertops`            | From `SPACE_TYPE_ICONS`.                                                                          |
| title       | **Space** (its name)                     | Kitchen                  | The name the user gave it.                                                                        |
| description | **Floor** and number of **Devices**      | Ground floor · 3 Devices | Both optional. Floors are optional in the Data model; leave the Floor out inside a Floor section. |
| end         | number of Active **Alerts** in the Space | 2 (Badge)                | `Badge`, tone = highest Alert Level. Nothing when 0.                                              |

The parent counts every Device in the Space: the Hubs and Standalone Devices placed there, and each Module through its Hub (a Module's Space is its Hub's Space, Data model rule 2). Changed from a Module count on 2026-11-08 (ADR 0002): a Space can hold a kettle or a power strip, which aren't Modules.

### Variants

Figma variant property `alerts` (none, active). The `ListItem` inside is exposed: edit its `title` (the Space name), `description` and `hasDescription` there, pick the Space Type icon in its `start` slot, and the Badge's tone and count in its `end` slot. Context, so the target states don't apply.

| Figma `alerts` | Code                          | End     |
| -------------- | ----------------------------- | ------- |
| `none`         | `activeAlertCount` 0 or unset | nothing |
| `active`       | `activeAlertCount` > 0        | `Badge` |

Device count wording: "No Devices", "1 Device", "3 Devices".

### Anatomy

```
SpaceListItem
└── ListItem
    ├── start        SpaceTypeIcon (md)
    ├── title        "Kitchen"
    ├── description  "Ground floor · 3 Devices"
    └── end          Badge (tone = highest Alert Level)
```

### Accessibility

- The icon is decorative: the name says which Space it is.
- The Badge's label says what it counts: "2 active Alerts".
- A clickable row is one link or button; screen readers hear "Kitchen, link".

### Open questions

- Show a short Reading summary (e.g. temperature) in the row? Left out: that's `SpaceCard`'s job.
