# SpaceLabel

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/context/space-label.mdx). Props are defined in [`SpaceLabel.types.ts`](./SpaceLabel.types.ts).

### Purpose

Names a Space: the icon of its Space Type and the Space's name, like 🛏 Bedroom or 🍳 Anna's kitchen. It goes in lists of rooms, Space pickers and screen headers, so people recognise a room at a glance.

It is also where the kit keeps **which icon goes with which Space Type** (`SPACE_TYPE_ICONS`). Apps use the same map for a room card's icon (`<Card icon={SPACE_TYPE_ICONS[spaceType]} …>`), so a kitchen has the same icon everywhere.

It is display-only and never changes on its own.

Figma: `SpaceLabel` component set in _DeTriz - Smart Home Kit_ (node `522:6`), page `SpaceLabel`. Variant property `size`, text property `name`, exposed `icon` instance. The `SpaceLabel examples` frame below it (node `522:27`) shows every Space Type, plus `LongText`.

Storybook: `Context/SpaceLabel`.

### Component in domain model context

Category: **Context** ("What is it?"). A Space's name and type are fixed facts: they change only when the user renames the Space or changes its type.

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx#places):

| Part  | Domain term          | Example        | Rule                                                                               |
| ----- | -------------------- | -------------- | ---------------------------------------------------------------------------------- |
| icon  | **Space Type**       | `bed`          | One fixed icon per Space Type. The parent can't change it.                         |
| label | **Space** (its name) | Anna's bedroom | The name the user gave the Space. Not the Space Type: two bedrooms have two names. |

The Space Type list is fixed in the Glossary: Bedroom, Bathroom, Kitchen, Living room, Hallway, Garage, Office, Meeting, Outdoor, Other.

What it does **not** show, and why:

- **Site, Floor.** Where the Space is in the home is `LocationPath`.
- **The Space Type's name** ("Bedroom") next to the Space's own name. The icon already says the type. A name like "Room 2" with a `bed` icon reads fine.
- **Any status.** A Space has no status; only Devices do.
- **Readings.** That's `SpaceCard`.

### Visual idea

| Question                        | Answer                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------- |
| What does it roughly look like? | Like `SensorLabel`: an icon followed by a name, 🛏 Bedroom.                   |
| Icons?                          | Yes, one, before the name. Fixed per Space Type.                             |
| Separators?                     | No. The gap between the icon and the name is enough.                         |
| More than one layout or size?   | One layout. Four sizes, the same as `SensorLabel`: `xs`, `sm`, `md`, `lg`.   |
| Text and icon size              | Same as `SensorLabel`: caption (12px) to body-lg (18px), icons 16px to 24px. |

Plain text and an icon: no chip or background. Sizes match `SensorLabel` exactly, so the two can sit side by side ("🛏 Bedroom · 🌡 Temperature").

### Variants

SpaceLabel is Context, so it has no states of its own.

**Space Type** (prop `spaceType`). In Figma it is not a variant property: pick the icon on the exposed `icon` instance and type the name.

| Value         | Space Type  | Icon          |
| ------------- | ----------- | ------------- |
| `bedroom`     | Bedroom     | `bed`         |
| `bathroom`    | Bathroom    | `bathtub`     |
| `kitchen`     | Kitchen     | `countertops` |
| `living-room` | Living room | `weekend`     |
| `hallway`     | Hallway     | `door_front`  |
| `garage`      | Garage      | `garage_home` |
| `office`      | Office      | `desk`        |
| `meeting`     | Meeting     | `groups`      |
| `outdoor`     | Outdoor     | `yard`        |
| `other`       | Other       | `home`        |

**Size** (Figma variant property `size`, prop `size`). Default `xs`. The same table as `SensorLabel`:

| Size | Icon                  | Text style | Icon ↔ name gap |
| ---- | --------------------- | ---------- | --------------- |
| `xs` | `Icon size="xs"` 16px | caption    | `space-1` (4px) |
| `sm` | `Icon size="sm"` 20px | body-sm    | `space-1` (4px) |
| `md` | `Icon size="md"` 24px | body       | `space-2` (8px) |
| `lg` | `Icon size="md"` 24px | body-lg    | `space-2` (8px) |

Target states:

| Target state | Applies? | Why                                                     |
| ------------ | -------- | ------------------------------------------------------- |
| loading      | no       | The Space's name and type are known before any Reading. |
| Connected    | no       | A Space has no Connection Status. Only Devices do.      |
| Stale        | no       | Same as above.                                          |
| Disconnected | no       | Same as above.                                          |
| Fault        | no       | Faults belong to Devices.                               |

### Anatomy

```
root            (size=xs | sm | md | lg)
├── icon        the Space Type's icon
└── label       the Space's name
```

1. **root**: icon and name in one row, centred vertically. No padding or background.
2. **icon**: decorative for screen readers: the name says which Space it is.
3. **label**: the Space's name. Long names end with "…"; the icon never shrinks.

In Figma, `name` is a text property linked to `label`, and `icon` is an exposed `Icon` instance, so designers pick the Space Type's icon on each instance.

### API

The props are defined in [`SpaceLabel.types.ts`](./SpaceLabel.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here.

Also exported:

- `SpaceType`: the shared type in `src/types/spaceType.ts`, like `Metric`.
- `SPACE_TYPE_ICONS`: `Record<SpaceType, IconName>`. It lives in the `SpaceLabel` folder, not in `utils/`, because utils can't import icons.

Decisions behind them:

- `name` and `spaceType` are separate and both required. The Space Type only decides the icon; the text is always the user's name for the Space.
- Union values are lowercase, with a hyphen for two words (`living-room`), like the naming rules say.

### Example values

| Case            | spaceType     | name                                                                                                    | size        |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------- | ----------- |
| Default         | `kitchen`     | Kitchen                                                                                                 | `xs`        |
| User's own name | `bedroom`     | Anna's bedroom                                                                                          | `sm`        |
| Detail heading  | `living-room` | Living room                                                                                             | `lg`        |
| Every type      | each          | Bedroom, Bathroom, Kitchen, Living room, Hallway, Garage, Office, Meeting room A, Balcony, Storage room | `xs`        |
| `LongText`      | `living-room` | Living room and dining area by the garden                                                               | `md`, 200px |
| `Minimal`       | `other`       | Attic                                                                                                   | `xs`        |

### Tokens

The same as `SensorLabel`; all exist in `tokens.css`.

| Part        | Property    | Token                                                                      |
| ----------- | ----------- | -------------------------------------------------------------------------- |
| label, icon | colour      | `--shk-color-text-primary`                                                 |
| label       | text style  | `xs` caption, `sm` body-sm, `md` body, `lg` body-lg (`--shk-typography-*`) |
| root        | icon ↔ name | `xs` `sm` `--shk-space-1`, `md` `lg` `--shk-space-2`                       |

### Accessibility

- Markup: a `<span>`, not a heading. The parent wraps it in a heading when it is one.
- The icon is hidden from screen readers (`aria-hidden`): the name says which Space it is.
- The name is plain text, never HTML. When it's truncated, the full name is in the `title` attribute.
- Not colour alone: the type is told apart by the icon's shape, and the name is text.
- Contrast: `text/primary` on a light surface, well above 4.5:1.

### Open questions

- **One label component or several?** `SensorLabel` and `SpaceLabel` look the same (icon + name). For now they are separate components with the same sizes and tokens, because they take different data (a Metric gives its own name; a Space has a name from the user). If `DeviceLabel` and `AssetLabel` follow the same pattern, consider one Figma component set with a `kind` variant and a shared internal base in code.
