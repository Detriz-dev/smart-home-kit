# Icons

How icons work in `@detriz-sh-kit/ui`, and how to add new ones.

The kit uses a **curated set** of [Material Symbols](https://fonts.google.com/icons) from Google. A script copies only the icons we list into `ui`, and apps draw them with one typed component: `<Icon name="thermostat" />`. Apps never install or load Material Symbols themselves, and icons work offline.

One limit: style, weight and fill can't change at runtime. If you need a filled version (e.g. for an "active" state), add the `-fill` variant to the config as a separate icon.

## Decisions

| Decision            | Choice                                     | Why                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Style               | **Rounded**                                | Soft corners suit a friendly home product.                                                                                                                                                                                                                                                                               |
| Weight              | **400**                                    | The default; pairs with regular body text. Fixed by the `@material-symbols/svg-400` package.                                                                                                                                                                                                                             |
| Sizes               | `xs` 16px, `sm` 20px, `md` 24px, `lg` 32px | `--shk-size-4`, `--shk-size-5`, `--shk-size-6`, `--shk-size-8`. Icons are drawn on a 24px grid, so 20, 24 and 32px look sharpest; 16px is for caption-size text.                                                                                                                                                         |
| Colour              | The surrounding text colour                | The SVG uses `fill: currentColor`. Set `color` with a token on the parent, never on the icon.                                                                                                                                                                                                                            |
| Naming              | **Two layers**                             | Base icons keep their Material Symbols name (`thermostat`, `door_front`): one drawing, one name. Purpose maps on top say which icon each domain value uses (see "Icons by purpose" below). One drawing can serve several purposes (`door_front` is the Hallway Space Type and the Door Asset Type) without being copied. |
| Purpose → icon maps | **`src/icons/purposeIcons.ts`**            | `METRIC_ICONS`, `SPACE_TYPE_ICONS` and `ASSET_TYPE_ICONS`, all exported. Figma mirrors them as the `MetricIcon`, `SpaceTypeIcon` and `AssetTypeIcon` component sets (`purpose × size`) on the Icon page. State and Alert maps come with the `StateValue` and Alert components.                                           |

**Space Type → icon** (all in `icons.config.ts`):

| Space Type  | Icon          | Space Type | Icon          |
| ----------- | ------------- | ---------- | ------------- |
| Bedroom     | `bed`         | Garage     | `garage_home` |
| Bathroom    | `bathtub`     | Office     | `desk`        |
| Kitchen     | `countertops` | Meeting    | `groups`      |
| Living room | `weekend`     | Outdoor    | `yard`        |
| Hallway     | `door_front`  | Other      | `home`        |

## Icons by purpose

Two layers keep icons consistent:

1. **Base icons** (`Icon`, `name × size`): every drawing once, with its Material Symbols name.
2. **Purpose sets**, one per kind of domain value. Each value points to one base icon:

| Purpose    | Code map           | Figma component set                  | Example                               |
| ---------- | ------------------ | ------------------------------------ | ------------------------------------- |
| Metric     | `METRIC_ICONS`     | `MetricIcon` (`metric × size`)       | `smoke` → `detector_smoke`            |
| Space Type | `SPACE_TYPE_ICONS` | `SpaceTypeIcon` (`spaceType × size`) | `hallway` → `door_front`              |
| Asset Type | `ASSET_TYPE_ICONS` | `AssetTypeIcon` (`assetType × size`) | `appliance` → `local_laundry_service` |

The same pattern covers every other purpose: `STATE_ICONS` (`StateIcon`, `state × size`, with values like `power-on`), `DEVICE_KIND_ICONS`, `PLACE_ICONS`, `READING_STATUS_ICONS`, `MESSAGE_TONE_ICONS`, `ALERT_LEVEL_ICONS`, `ALERT_ICONS`, `NAV_ICONS` and `ACTION_ICONS`, each with a Figma set of the same name without `_ICONS` (`DeviceKindIcon`, `AlertLevelIcon`…). The full list with values is on the docs site's Icons page. **Components never use a base icon name directly**: they read it from a map.

In code: `<Icon name={METRIC_ICONS.smoke} />`. In Figma: place a `MetricIcon` and pick `metric` and `size`. `SensorLabel` uses `MetricIcon` inside, so its Metric is a dropdown on the instance.

**Changing which icon a purpose uses** means changing both: the map in `purposeIcons.ts`, and the nested icon in each size of that variant in Figma.

## How it works

### The files

```
kit/packages/ui/
├── package.json             ← "icons" script; @material-symbols/svg-400 as a devDependency
├── scripts/
│   └── generate-icons.mjs   ← the generator script
└── src/icons/
    ├── icons.config.ts      ← the list of icons we use (the single source of truth)
    ├── generated/           ← written by the script. Committed, but never edited by hand
    │   ├── paths.ts         ← { thermostat: "M553-580q…", link_off: "M…", … } + the IconName type
    │   └── LICENSE          ← Apache 2.0 notice for Material Symbols
    └── Icon/
        ├── Icon.tsx         ← the component
        ├── Icon.types.ts    ← IconProps, IconSize
        ├── Icon.module.css  ← sizes from tokens, colour from currentColor
        ├── Icon.stories.tsx ← states + an "All icons" gallery
        └── index.ts
```

### The pipeline, step by step

It works like the token pipeline: a raw source goes in, a small curated file comes out.

```
@material-symbols/svg-400        icons.config.ts
(~3,000 SVG files, in             (our list: "thermostat",
 node_modules, dev only)           "link_off", …)
            │                            │
            └──────────┬─────────────────┘
                       ▼
           scripts/generate-icons.mjs
           pnpm --filter @detriz-sh-kit/ui icons
                       │
                       ▼
          src/icons/generated/paths.ts
          { name: "shape data", … }  +  type IconName
                       │
                       ▼
              <Icon name="…" />  →  <svg><path d="…"/></svg>
```

1. **The source.** `@material-symbols/svg-400` holds every Material Symbol as an `.svg` file. It's a devDependency: only this script reads it, so apps never download it.
2. **The config.** `icons.config.ts` lists the style (`rounded`) and the names we use. Nothing else gets into the kit.
3. **The script.** For each name, it opens `rounded/<name>.svg`, checks the file exists and uses the expected `viewBox`, and keeps only the shape data (the `d="…"` text of the `<path>`). An SVG file is mostly wrapping; the `d` text is the drawing itself. If a name is wrong or listed twice, the script stops and tells you which one, and writes nothing.
4. **The generated file.** `paths.ts` is one object: icon name → shape. `IconName` is made from its keys (`keyof typeof iconPaths`), so TypeScript knows every allowed name, and your editor autocompletes them.
5. **The component.** `<Icon name="link_off" />` looks up the shape and draws an `<svg>` with one `<path>`. Size comes from a `--shk-size-*` token, colour from the text around it.

Why commit `generated/`? So building, Storybook and CI never need to run the script. You only run it when the config changes, and the diff shows exactly which icons were added.

### Using an icon

```tsx
import { Icon } from "@detriz-sh-kit/ui";

<Icon name="thermostat" />                     // decorative: hidden from screen readers
<Icon name="link_off" label="Disconnected" />  // meaningful: role="img" + aria-label
<Icon name="power" size="sm" />                // sm | md (default) | lg
<Icon name="termostat" />                      // ❌ type error: not in the icon set
```

**Decorative or meaningful?** If text next to the icon already says the same thing ("Disconnected" + a Wi-Fi-off icon), leave `label` out. If the icon is the only thing saying it, give it a `label`.

**Colour:** set it on the parent with a token, e.g. `color: var(--shk-status-warning-solid)`. The icon follows.

## Adding a new icon

1. **Find it.** Go to [fonts.google.com/icons](https://fonts.google.com/icons), set the style to **Rounded**, and click the icon. Copy its name, e.g. `water_drop`. (Names use underscores. If the page shows "Water Drop", the name is `water_drop`.)
2. **Add it to the config.** In `src/icons/icons.config.ts`, add the name to the `icons` list, in alphabetical order. For the filled version, add `-fill`: `water_drop-fill`.
3. **Generate.** From the repo root:

   ```sh
   pnpm --filter @detriz-sh-kit/ui icons
   ```

   You should see `Generated 12 icons (rounded) in src/icons/generated/paths.ts`.

4. **Check it.** Run `pnpm storybook` and open **Icons → Icon → All Icons**. Your icon should be in the grid.
5. **Use it.** `<Icon name="water_drop" />`. Your editor now autocompletes the name.
6. **Commit** `icons.config.ts` and the changed files in `generated/` together, e.g. `feat(ui): add water_drop icon`.

**Removing an icon** is the same in reverse: delete the line, run the script. TypeScript will then point at every place that still uses the removed name, so nothing breaks silently. Run `pnpm --filter @detriz-sh-kit/ui typecheck` to see them.

### When something goes wrong

| Problem                                                                   | Likely cause                                               | Fix                                                                                                        |
| ------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `"water-drop" doesn't exist in rounded`                                   | Typo, or hyphens instead of underscores                    | Copy the exact name from Google Fonts. Only the `-fill` ending uses a hyphen.                              |
| `"x" is listed twice`                                                     | The same name is in the config twice                       | Delete one.                                                                                                |
| `Type '"water_drop"' is not assignable to type 'IconName'`                | Name is in the config, but the script wasn't run           | Run `pnpm --filter @detriz-sh-kit/ui icons`.                                                               |
| `Cannot find module '@material-symbols/svg-400/package.json'`             | Dependencies not installed                                 | Run `pnpm install`.                                                                                        |
| `Unknown file extension ".ts"` / `--experimental-strip-types` not allowed | Node is older than 22.6, so it can't read the `.ts` config | Update Node to the latest 22 or newer.                                                                     |
| Icon looks like a black square or has the wrong colour                    | A parent sets an unexpected `color`                        | Set `color` with a token on the parent.                                                                    |
| Someone edited `generated/paths.ts` and their change disappeared          | The script overwrites the file every run                   | Change `icons.config.ts` instead. Changes that need more than that belong in `scripts/generate-icons.mjs`. |

## Still to do

1. Write an ADR (`docs/adr/0001-icon-system.md`) recording why we use a curated SVG set and the decisions above.
2. Licence: `generated/LICENSE` keeps the Apache 2.0 notice in the repo. When `ui` is published to npm, also add the notice to the published package (e.g. a `THIRD_PARTY_NOTICES` file listed in `files` in `package.json`).
