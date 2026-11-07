# AssetLabel

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/context/asset-label.mdx). Props are defined in [`AssetLabel.types.ts`](./AssetLabel.types.ts).

### Purpose

Names an Asset: the icon of its Asset Type and the Asset's name, like 🚪 Front door or 🧺 Washing machine. It goes above a `StateValue` or a Reading whose Subject is an Asset, so people know what the value is about.

It is the Asset twin of [`SpaceLabel`](../SpaceLabel/SpaceLabel.md): same look, same sizes, same behaviour. Display-only.

Figma: `AssetLabel` component set in _DeTriz - Smart Home Kit_ (node `591:57`), page `AssetLabel` (Context section, after SpaceLabel). Variant property `size`, text property `name`, exposed `icon` instance (an `AssetTypeIcon`: pick `assetType`). The `AssetLabel examples` frame (node `591:86`) shows every Asset Type plus `LongText`.

Storybook: `Context/AssetLabel`.

### Component in domain model context

Category: **Context** ("What is it?"). An Asset's name and type are fixed facts.

| Part  | Domain term          | Example      | Rule                                                    |
| ----- | -------------------- | ------------ | ------------------------------------------------------- |
| icon  | **Asset Type**       | `door_front` | One fixed icon per Asset Type, from `ASSET_TYPE_ICONS`. |
| label | **Asset** (its name) | Front door   | The name the user gave the Asset.                       |

Asset Types (Glossary): Plant, Tap, Door, Window, Appliance. Contact Sensors watch a Door or Window; Power Sensors watch an Appliance (Data model rule 19).

What it does **not** show: the State or value (`StateValue`, `ReadingValue`), the Space (`SpaceLabel`, `LocationPath`), any status (an Asset has no Device Status).

### Visual idea, sizes, anatomy

Identical to `SpaceLabel`: icon + name, no background. Sizes `xs` (caption, 16px icon), `sm` (body-sm, 20px), `md` (body, 24px), `lg` (body-lg, 24px). Gap `space/1` (xs, sm) or `space/2` (md, lg). Text and icon `color-text/primary`.

```
AssetLabel
├── icon    AssetTypeIcon (exposed)
└── label   "Front door"
```

### Variants

Context, so no states. Target states don't apply: an Asset can't be paired, disconnected or faulty.

| `assetType` | Icon                    |
| ----------- | ----------------------- |
| `plant`     | `potted_plant`          |
| `tap`       | `faucet`                |
| `door`      | `door_front`            |
| `window`    | `window`                |
| `appliance` | `local_laundry_service` |

### Accessibility

Same as SpaceLabel: the icon is `aria-hidden`; long names end with "…" and show in full in a `title` tooltip.

### Open questions

- `door` and the Hallway Space Type share `door_front`. Fine while they never appear side by side; revisit if a screen shows both.
