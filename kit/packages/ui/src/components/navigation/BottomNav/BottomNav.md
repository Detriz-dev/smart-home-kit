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
 ╭──────────────────────────────────────────────╮
 │  (🏠)      📡        📈        ⚙             │
 │  Home    Devices   History   Settings        │
 ╰──────────────────────────────────────────────╯
  floating bar; current item: light-blue pill behind the icon, blue icon, blue medium-weight label
```

| Question     | Answer                                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Icons?       | One per item, 24px, above its label.                                                                                                                                    |
| Surface?     | A floating bar: white (`surface/default`), 1px outline all round (`color-border/subtle`), 24px corners, the `elevation/raised` shadow (like Card). None between items.  |
| Layouts?     | One. 3 to 5 items share the width equally.                                                                                                                              |
| Current item | A 56 × 32px light-blue pill behind the icon (`action/current/bg`, blue-100), blue icon, blue medium-weight label (`action/current/fg`). Others grey (`text/secondary`). |
| Text size    | Label `caption` (12px). Medium weight on the current item.                                                                                                              |
| Height       | 72px: 1px outline + 4px padding + the item (4px + the 32px pill + 4px + the 18px label + 4px) + 4px + 1px. At least 64px (`size-16`), like `TopBar`.                    |
| Placement    | The app's layout: 16px from the screen's sides and above the home indicator, content scrolling behind it. On a 390px phone the bar is 358px wide.                       |

The current item is marked by the pill, the heavier label and the colour, not by colour alone. Hover shows a grey pill and darker text, focus darker text and the kit's dark-blue ring (`action/focus`, blue-800). Neither turns blue or adds the light-blue pill, so they can't be mistaken for current.

### Variants

**Item** (Figma `.BottomNavItem`, variants `isCurrent` and `state`):

| Variant                          | Looks                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `isCurrent=false, state=default` | Icon and label `text/secondary` (grey). No pill.                                                                |
| `isCurrent=false, state=hover`   | Grey pill (`surface/sunken`), icon and label `text/primary`. Regular-weight label, never blue.                  |
| `isCurrent=false, state=pressed` | Light-blue pill (`action/subtle/bg-pressed`, blue-200), icon and label `text/primary`.                          |
| `isCurrent=false, state=focus`   | Icon and label `text/primary`, plus the kit's 2px `action/focus` (blue-800) ring around the item, 16px corners. |
| `isCurrent=true, state=default`  | Light-blue pill (`action/current/bg`), blue icon and medium-weight blue label (`action/current/fg`).            |
| `isCurrent=true, state=focus`    | The current look plus the focus ring.                                                                           |

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
root (nav)                 the floating bar: background, outline, shadow, 4px padding
└── items (ul)             items side by side, equal width
    └── item (li)
        └── link (a)       through KitLink; aria-current="page" when current
            ├── indicator  the pill behind the icon, 56 × 32px
            │   └── icon   24px, decorative
            ├── label      one line, ends with "…"
            └── badge      optional Badge, drawn on the icon's top-right corner
```

1. **root**: fills its parent's width, at least 64px tall, 24px corners, 1px outline, `elevation/raised` shadow, 4px padding.
2. **item**: equal share of the width (`flex: 1`), so the bar looks balanced with 3, 4 or 5.
3. **link**: the whole item is the tap target: icon and label stacked, centred, 4px apart, 4px padding, 16px corners (for the focus ring).
4. **indicator**: 4px top and bottom, 16px left and right around the icon (56 × 32px), fully rounded. Filled on hover (grey), pressed and current (light blue); keeps every item's icon in the same place.
5. **label**: centred, one line. Medium weight on the current item.

### API

| Prop    | Type              | Required | Description                                            |
| ------- | ----------------- | -------- | ------------------------------------------------------ |
| `items` | `BottomNavItem[]` | yes      | The sections, left to right, 3 to 5.                   |
| `label` | `string`          | no       | The bar's name for screen readers. Defaults to "Main". |

`BottomNavItem`:

| Field       | Type         | Required | Description                                                                |
| ----------- | ------------ | -------- | -------------------------------------------------------------------------- |
| `label`     | `string`     | yes      | The section's name, e.g. "Devices". Short: one word if you can.            |
| `icon`      | `IconName`   | yes      | The section's icon, e.g. `sensors`.                                        |
| `href`      | `string`     | yes      | Where the section is, e.g. `/devices`. Uses `LinkProvider`.                |
| `isCurrent` | `boolean`    | no       | True for the section the person is in. Exactly one item should be current. |
| `badge`     | `BadgeProps` | no       | A count on the icon's corner, e.g. Active Alerts on the Alerts tab.        |

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

| Part                | Property   | Token                                                                              |
| ------------------- | ---------- | ---------------------------------------------------------------------------------- |
| root                | background | `--shk-surface-default`                                                            |
| root                | outline    | `--shk-border-width-thin` solid `--shk-color-border-subtle`                        |
| root                | radius     | `--shk-radius-24`                                                                  |
| root                | shadow     | `--shk-elevation-raised`                                                           |
| root                | padding    | `--shk-space-1`                                                                    |
| root                | min height | `--shk-size-16` (64px)                                                             |
| link                | padding    | `--shk-space-1`                                                                    |
| link                | gap        | `--shk-space-1`                                                                    |
| link                | radius     | `--shk-radius-16`                                                                  |
| link                | colour     | `--shk-color-text-secondary`                                                       |
| link (hover, focus) | colour     | `--shk-color-text-primary`                                                         |
| link (current)      | colour     | `--shk-action-current-fg` (blue-600)                                               |
| indicator           | padding    | `--shk-space-1` (block), `--shk-space-4` (inline); radius `--shk-radius-full`      |
| indicator (hover)   | background | `--shk-surface-sunken`                                                             |
| indicator (current) | background | `--shk-action-current-bg` (new, blue-100)                                          |
| indicator (pressed) | background | `--shk-action-subtle-bg-pressed` (blue-200)                                        |
| label (current)     | weight     | `--shk-font-weight-medium`                                                         |
| link (focus)        | outline    | `--shk-border-width-medium` solid `--shk-action-focus` (blue-800 kit-wide), inside |
| label               | text style | `--shk-typography-caption-*`                                                       |

### Accessibility

- `root` is a `<nav>` named by `label` ("Main"), so screen readers list it as a landmark.
- The items are a list ("list, 4 items").
- Each item is a link named by its label. The icon is decorative.
- The current item has `aria-current="page"`, so screen readers say "current page".
- The current item is marked three ways: the light-blue pill, the medium-weight label and the blue colour. Not colour alone.
- Hover and focus darken the item's icon and label but never turn it blue or add the light-blue pill, so they never look current. Focus adds the kit's dark-blue ring.
- Contrast: the blue-600 label on white is 4.75:1; the blue-600 icon on the blue-100 pill is 4.2:1 (icons need 3:1).
- Each item is 62px tall and a quarter of the bar wide: a comfortable touch target.
- The focus ring is drawn inside the item, so it isn't cut off at the screen's edge.

### Open questions

- **Counts on items** (Faults on Devices) need the planned `FaultCount`.

### Badge (Phase 2, 2026-11-07)

- `badge` on an item takes `BadgeProps` as they are, so the app sets the count, label and tone; a count of 0 shows nothing.
- In code the Badge comes **after** the label, so screen readers hear "Alerts, 3 active Alerts"; CSS places it on the icon's corner (absolute, at the item's top, 4px left of the icon's right edge).
- Figma: `.BottomNavItem` has a boolean `hasBadge` (default off) and an exposed `Badge` instance (absolute, inside `indicator`) to set its tone and count. The `With Badge` example in the `in a bar` frame shows an Alerts tab with 3 Critical.
- **Hiding labels** on very small screens: not in v1. Labels make the icons clear.

### v2: floating bar and current pill (2026-11-10)

- The full-width bar with a line above became a floating, rounded bar (24px corners, outline, `elevation/raised`), like the raised Cards on the example screens.
- The 56 × 4px bar on the current item's top edge became a light-blue pill behind its icon (new token `action/current/bg`). `action/current/indicator` is no longer used by BottomNav.
- Hover and focus no longer turn items blue: hover shows a grey pill, both darken the icon and label. Only the current item is blue.
- Pressed fills the pill (blue-200) instead of the whole item.
- Figma: `BottomNav` and `.BottomNavItem` were upgraded in place, so every example screen picked up the new look.
