# BottomNav

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/navigation/bottom-nav.mdx). Props are defined in [`BottomNav.types.ts`](./BottomNav.types.ts).

### Purpose

The main sections of an app, as a bar at the bottom of the screen on phones and wall tablets: Home, Devices, History, Settings. One tap takes people to a section, and the current one is marked, so they always know where they are.

Each item is a link through the kit's [`LinkProvider`](/docs/adr/0001-router-links.md), so it uses the app's router. It takes props only and never fetches data.

Figma: `BottomNav` component in _DeTriz - Smart Home Kit_ (node `534:2170`), page `BottomNav`, with an `items` slot. `.BottomNavItem` (node `534:2169`, private) holds one item's looks, with a `label` text property and an exposed `icon`. The `BottomNav examples` frame (node `534:2195`) shows the example values below.

### Component in domain model context

Category: **Navigation** ("Where can I go?"). It shows no domain terms: the sections and their labels are the app's. Typical sections name Glossary things in the plural ("Devices", "Spaces").

What it does **not** do, and why:

- **Show a screen's title or a back button.** That's `TopBar`.
- **Sit at the bottom by itself.** Fixing it to the bottom of the screen belongs to the app's layout (the planned `AppShell`).
- **Show the sections on wide screens.** On tablets and desktops a side column fits better (the planned `SideNav`). The app chooses which to render.
- **Show counts** ("2 Faults"). That needs the planned `FaultCount` badge.

### Visual idea

```
┌──────▔▔▔▔──────────────────────────────────────┐
│   🏠       📡        📈        ⚙               │
│  Home    Devices   History   Settings          │
└────────────────────────────────────────────────┘
  current item: a bar on top, blue icon, blue medium-weight label
```

| Question     | Answer                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Icons?       | One per item, 24px, above its label.                                                                                                                                |
| Separators?  | A 1px line above the bar (`color-border-subtle`). None between items.                                                                                               |
| Layouts?     | One. 3 to 5 items share the width equally.                                                                                                                          |
| Current item | A 56 × 4px blue bar on the item's top edge (`action/current/indicator`), blue icon, blue medium-weight label (`action/current/fg`). Others grey (`text/secondary`). |
| Text size    | Label `caption` (12px). Medium weight on the current item.                                                                                                          |
| Height       | 70px: 8px + the 32px icon area + 4px + the 18px label + 8px. At least 64px (`size-16`), like `TopBar`.                                                              |

The current item is marked by the bar, the heavier label and the colour, not by colour alone. Hover and focus turn an item blue too, but never add the bar or the heavier label, so they can't be mistaken for current. Keyboard focus also gets the kit's dark-blue ring (`action/focus`, blue-800).

### Variants

**Item** (Figma `.BottomNavItem`, variants `isCurrent` and `state`):

| Variant                          | Looks                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `isCurrent=false, state=default` | Icon and label `text/secondary` (grey).                                                                    |
| `isCurrent=false, state=hover`   | Blue icon and label (`action/current/fg`). No bar, regular-weight label, no background.                    |
| `isCurrent=false, state=pressed` | Light-blue background behind the whole item (`action/subtle/bg-pressed`, blue-200), icon and label grey.   |
| `isCurrent=false, state=focus`   | Blue icon and label, plus the kit's 2px `action/focus` (blue-800) ring around the item, 12px corners.      |
| `isCurrent=true, state=default`  | Blue icon, medium-weight blue label, and a 56 × 4px `action/current/indicator` bar on the item's top edge. |
| `isCurrent=true, state=focus`    | The current look plus the focus ring.                                                                      |

In code, `isCurrent` is a prop on each item and the browser sets hover, pressed and focus.

**Number of items:** 3, 4 or 5 (Figma: the `items` slot holds 4; add or remove instances). Fewer than 3 doesn't need a bar; more than 5 makes the labels too narrow on phones.

Target states:

| Target state                   | Applies? | Why                                                                  |
| ------------------------------ | -------- | -------------------------------------------------------------------- |
| loading                        | no       | The sections are known before any data loads.                        |
| Connected, Stale, Disconnected | no       | Sections have no Connection Status.                                  |
| Fault                          | no       | Faults belong to Devices. A count on an item waits for `FaultCount`. |

### Anatomy

```
root (nav)                 the bar: background, line above
└── items (ul)             items side by side, equal width
    └── item (li)
        └── link (a)       through KitLink; aria-current="page" when current
            ├── bar        current only: on the item's top edge (code: ::before)
            ├── indicator  the icon's area, 56 × 32px
            │   └── icon   24px, decorative
            └── label      one line, ends with "…"
```

1. **root**: fills its parent's width, at least 64px tall.
2. **item**: equal share of the width (`flex: 1`), so the bar looks balanced with 3, 4 or 5.
3. **link**: the whole item is the tap target: icon and label stacked, centred, 4px apart, 8px padding top and bottom, 12px corners (for the pressed background and the focus ring).
4. **bar**: 56 × 4px, centred on the item's top edge, 4px corners. Only on the current item.
5. **indicator**: 4px top and bottom, 16px left and right around the icon (56 × 32px). No fill: it keeps every item's icon in the same place.
6. **label**: centred, one line. Medium weight on the current item.

### API

| Prop    | Type              | Required | Description                                            |
| ------- | ----------------- | -------- | ------------------------------------------------------ |
| `items` | `BottomNavItem[]` | yes      | The sections, left to right, 3 to 5.                   |
| `label` | `string`          | no       | The bar's name for screen readers. Defaults to "Main". |

`BottomNavItem`:

| Field       | Type       | Required | Description                                                                |
| ----------- | ---------- | -------- | -------------------------------------------------------------------------- |
| `label`     | `string`   | yes      | The section's name, e.g. "Devices". Short: one word if you can.            |
| `icon`      | `IconName` | yes      | The section's icon, e.g. `sensors`.                                        |
| `href`      | `string`   | yes      | Where the section is, e.g. `/devices`. Uses `LinkProvider`.                |
| `isCurrent` | `boolean`  | no       | True for the section the person is in. Exactly one item should be current. |

Decisions behind them:

- **An `items` array, not children.** The bar controls the markup (`ul`, `li`, links), so apps can't break the list, and an AI tool gets one clear shape.
- **`isCurrent` on the item**, not a `currentHref` on the bar. Apps decide what "current" means (a section stays current on its sub-screens: `/devices/climate-module` is still Devices).
- **Links only.** Sections are places, so every item is an `href`. No `onClick`.

### Example values

| Case               | Items (current in bold)                                                                            | Width |
| ------------------ | -------------------------------------------------------------------------------------------------- | ----- |
| Default (4 items)  | **Home** `home`, Devices `sensors`, History `monitoring`, Settings `settings`                      | 390px |
| 3 items            | Home, **Devices**, Settings                                                                        | 390px |
| 5 items            | Home, Spaces `door_front`, Devices, **History**, Settings                                          | 390px |
| `LongText` (320px) | **Home**, Devices, Air quality history `monitoring`, Notifications and alerts `settings`, Settings | 320px |
| `Minimal`          | **Home**, Devices, Settings                                                                        | 320px |

### Tokens

| Part                         | Property     | Token                                                                                                                                  |
| ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| root                         | background   | `--shk-surface-default`                                                                                                                |
| root                         | line above   | `--shk-border-width-thin` solid `--shk-color-border-subtle`                                                                            |
| root                         | min height   | `--shk-size-16` (64px)                                                                                                                 |
| link                         | padding      | `--shk-space-2` (block), `--shk-space-1` (inline)                                                                                      |
| link                         | gap          | `--shk-space-1`                                                                                                                        |
| link                         | radius       | `--shk-radius-12`                                                                                                                      |
| link                         | colour       | `--shk-color-text-secondary`                                                                                                           |
| link (hover, focus, current) | colour       | `--shk-action-current-fg` (new, blue-600)                                                                                              |
| link (pressed)               | background   | `--shk-action-subtle-bg-pressed` (new, blue-200); colour `--shk-color-text-secondary`                                                  |
| bar (current)                | colour, size | `--shk-action-current-indicator` (new); `2 × --shk-space-4 + --shk-size-6` (56px) × `--shk-border-width-thick` (4px); `--shk-radius-4` |
| label (current)              | weight       | `--shk-font-weight-medium`                                                                                                             |
| link (focus)                 | outline      | `--shk-border-width-medium` solid `--shk-action-focus` (blue-800 kit-wide), inside the item                                            |
| indicator                    | padding      | `--shk-space-1` (block), `--shk-space-4` (inline)                                                                                      |
| label                        | text style   | `--shk-typography-caption-*`                                                                                                           |

### Accessibility

- `root` is a `<nav>` named by `label` ("Main"), so screen readers list it as a landmark.
- The items are a list ("list, 4 items").
- Each item is a link named by its label. The icon is decorative.
- The current item has `aria-current="page"`, so screen readers say "current page".
- The current item is marked three ways: the bar on top, the medium-weight label and the blue colour. Not colour alone.
- Hover and focus turn the item blue. Neither adds the bar or the heavier label, so they never look current. Focus adds the kit's dark-blue ring.
- Contrast: the blue-600 icon and label on white are 4.75:1; the grey icon and label on the blue-200 pressed background are 5.3:1.
- Each item is 70px tall and a quarter of the bar wide: a comfortable touch target.
- The focus ring is drawn inside the item, so it isn't cut off at the screen's edge.

### Open questions

- **Counts on items** (Faults on Devices) need the planned `FaultCount`.
- **Hiding labels** on very small screens: not in v1. Labels make the icons clear.
