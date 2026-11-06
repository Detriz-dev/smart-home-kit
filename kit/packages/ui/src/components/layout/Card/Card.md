# Card

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/layout/card.mdx). Props are defined in [`Card.types.ts`](./Card.types.ts).

### Purpose

The plain card surface (background, border, rounded corners, padding) with an optional header and footer. Anything can go inside it. Apps use it to make their own cards that match the kit, for example one card per room in a flat, and the kit's own cards (`SpaceCard`, `ModuleCard`) will be rebuilt on it so they all share one look.

It adds no data of its own. It takes props only and never fetches anything.

A card can be **clickable**: tapping a room card opens that room's screen.

Figma: `Card` component set in _DeTriz - Smart Home Kit_ (node `515:122`), page `Card`. Variant properties `isInteractive` and `state`. The `Card examples` frame below it (node `512:28`) shows each example from [Example values](#example-values).

### Component in domain model context

Category: **Layout** ("How is it arranged?"). It groups other components; it doesn't answer a question about the home by itself.

It shows no domain terms of its own. The `title` is free text: usually the name of a Space ("Kitchen"), a Module ("Climate Module") or an Asset ("Monstera"), but the card doesn't know which. The content decides what the card is about.

What it does **not** do, and why:

- **Show a status for the whole card.** A Space has no status (only Devices do), so the card can't invent one. When the card is about one Device, the parent puts a `DeviceConnectionStatus` in `headerEnd`.
- **Lay out its content.** The content stacks with a fixed gap. For columns, put a `ColumnLayout` inside; for a list, a list.
- **Know the app's routes.** A clickable card gets a plain `href` or an `onClick`. Working with an app's router (Next.js, React Router) comes later, see [Open questions](#open-questions).
- **Offer padding, colour or size props.** One look only, so a generated screen can't make cards that don't match.
- **Format the title.** `title` is plain text: no links or bold. An icon goes in `icon`, not in the title.

### Visual idea

| Question                        | Answer                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| What does it roughly look like? | The white card that `SpaceCard` and `ModuleCard` already use: subtle border, 16px corners, 16px padding. |
| Icons?                          | Optional, 24px (`md`), before the title, e.g. the Space Type icon on a room card.                        |
| Separators?                     | No. The gap separates header, content and footer.                                                        |
| More than one layout?           | One layout. Header, content and footer are each optional parts. A clickable card adds interaction looks. |
| Clickable look                  | Same as static at rest. Grey fill on hover and press, blue focus ring from the keyboard, like `Button`.  |
| Text size                       | Title `h4`, same as `SpaceCard` and `ModuleCard`. Everything else belongs to the content.                |

```
┌───────────────────────────────────┐
│ Climate Module        ● Connected │   header: title + headerEnd
│                                   │
│ 🌡 Temperature                    │   content (children)
│ 22.4 °C                           │
│                                   │
│ Updated 2 min ago                 │   footer
└───────────────────────────────────┘
```

The card fills the width its parent gives it and grows in height with its content. The title stays on one line and ends with "…"; the full title shows on hover (same as `SpaceCard`). `headerEnd` never shrinks or truncates.

### Variants

**Interaction** (Figma variant properties `isInteractive` and `state`). In code there is no `state` prop: the card is interactive when `href` or `onClick` is given, and the browser sets hover, pressed and focus.

| Figma variant                        | Code                                 | Looks                                                         |
| ------------------------------------ | ------------------------------------ | ------------------------------------------------------------- |
| `isInteractive=false, state=default` | no `href`, no `onClick`              | The plain card.                                               |
| `isInteractive=true, state=default`  | `href` or `onClick`                  | Same as the plain card, plus a pointer cursor.                |
| `isInteractive=true, state=hover`    | `:hover`                             | Fill `action/secondary/bg-hover` (gray 100).                  |
| `isInteractive=true, state=pressed`  | `:active`                            | Fill `action/secondary/bg-pressed` (gray 200).                |
| `isInteractive=true, state=focus`    | `:focus-visible` on the title's link | 2px `action/focus` ring, 4px outside the card, like `Button`. |

There is no disabled state: a card that leads nowhere is simply not clickable. These are the same tokens `Button` secondary uses, so everything clickable in the kit reacts the same way.

**Parts shown:**

| Part        | Shown when                      | Figma property  |
| ----------- | ------------------------------- | --------------- |
| `header`    | `title` or `headerEnd` is given | `hasHeader`     |
| `icon`      | `icon` and `title` are given    | `hasIcon`       |
| `title`     | `title` is given                | `title` (text)  |
| `headerEnd` | `headerEnd` is given            | `hasHeaderEnd`  |
| `children`  | always                          | slot `children` |
| `footer`    | `footer` is given               | `hasFooter`     |

Target states:

| Target state | Applies? | Why                                                                           |
| ------------ | -------- | ----------------------------------------------------------------------------- |
| loading      | no       | The card shows no value. Each component inside shows its own loading state.   |
| Connected    | no       | Connection Status belongs to a Device. The parent can put one in `headerEnd`. |
| Stale        | no       | Same as above.                                                                |
| Disconnected | no       | Same as above. The card keeps its look whatever the content shows.            |
| Fault        | no       | Faults belong to Devices, shown with `DeviceFaultStatus` inside the content.  |

### Anatomy

```
root                     the surface: background, border, radius, padding
├── header               one row, only when title or headerEnd is given
│   ├── icon             optional, 24px, decorative
│   ├── title            the card name, one line, ends with "…"
│   └── headerEnd        slot: e.g. DeviceConnectionStatus
├── children             slot: whatever is passed in
├── footer               slot: e.g. "Updated 2 min ago"
└── focus-ring           Figma only, in state=focus (code uses an outline)
```

1. **root**: stacks header, children and footer 12px apart, with 16px padding (minus the 1px border, as in `SpaceCard`).
2. **header**: icon and title on the left, `headerEnd` on the right, 8px apart, centred vertically.
3. **title**: fills the space left by `headerEnd` and truncates. In a clickable card it is the `<a>` or `<button>`.
4. **headerEnd**: holds whatever is passed in and never shrinks.
5. **children**: no element in code. The children sit straight in `root`, which already sets the 12px gap (same as `ContentSection`).
6. **footer**: sets the caption text style and `text/secondary`, so plain text passed in looks like Figma. Components passed in keep their own styles.

In Figma, `children`, `headerEnd` and `footer` are slots, so designers can drop any content into an instance. Figma needs the `children` slot as its own layer with its own 12px gap; in code it doesn't exist. `title` is a text property linked to the `title` layer. `hasHeader`, `hasHeaderEnd` and `hasFooter` are booleans linked to those layers.

### API

The props are defined in [`Card.types.ts`](./Card.types.ts), with a `/** */` comment on each one. That file is the source of truth now that the code exists, so the props are not repeated here. `CardProps` is a union of three shapes: `CardStaticProps`, `CardLinkProps` and `CardButtonProps`.

Decisions behind them:

- Props for the slots, not sub-components like `Card.Header`. It's one import, and an AI tool has fewer ways to get the structure wrong.
- **How a clickable card works:** the title becomes the real `<a href>` or `<button>`, and an invisible layer stretches it over the whole card (the "stretched link" pattern). So the whole card can be tapped, but screen readers hear one short link, "Kitchen, link", instead of everything inside the card. That's why a clickable card needs a `title`. The types enforce it: `href` or `onClick` without `title` is a type error, and so is passing both `href` and `onClick`.
- Buttons or links inside a clickable card's content still work: they sit above the stretched layer. Use this sparingly, because two tap targets in one card are easy to miss.
- No padding, colour or size props.
- **Apps with a router**, until the kit supports router links: the user docs tell them to pass `onClick` and navigate with their router. The card is then a button, so it can't be opened in a new tab (see Open questions, Routing).

### Example values

Figma's sample content and the stories use these:

| Case               | title                                | headerEnd                          | children                            | footer            |
| ------------------ | ------------------------------------ | ---------------------------------- | ----------------------------------- | ----------------- |
| Default (Module)   | Climate Module                       | `DeviceConnectionStatus` connected | `SensorReading` Temperature 22.4 °C | Updated 2 min ago |
| Space              | `countertops` + Kitchen              | none (a Space has no status)       | `SensorReading` Temperature 22.4 °C | none              |
| Space, clickable   | `countertops` + Kitchen, `href`      | none                               |
| Bedroom, clickable | `bed` + Bedroom, `href`              | none                               | `SensorReading` Temperature 22.4 °C | none              |
| `LongText` (240px) | Climate Module by the kitchen window | `DeviceConnectionStatus` connected | `SensorReading` Temperature 22.4 °C | Updated 2 min ago |
| `Minimal`          | none                                 | none                               | `SensorReading` Temperature 22.4 °C | none              |

### Tokens

| Part           | Property          | Token                                                                          |
| -------------- | ----------------- | ------------------------------------------------------------------------------ |
| root           | background        | `--shk-surface-default`                                                        |
| root           | border            | `--shk-border-width-thin` solid `--shk-color-border-subtle`                    |
| root           | radius            | `--shk-radius-16`                                                              |
| root           | padding           | `calc(var(--shk-space-4) - var(--shk-border-width-thin))`                      |
| root           | gap               | `--shk-space-3`                                                                |
| header         | gap               | `--shk-space-2`                                                                |
| title, icon    | color             | `--shk-color-text-primary`                                                     |
| icon           | size              | `--shk-size-6` (24px, `Icon` size `md`)                                        |
| title          | text style        | `--shk-typography-h4-*`                                                        |
| footer         | color, text style | `--shk-color-text-secondary`, `--shk-typography-caption-*`                     |
| root (hover)   | background        | `--shk-action-secondary-bg-hover`                                              |
| root (pressed) | background        | `--shk-action-secondary-bg-pressed`                                            |
| root (focus)   | outline           | `--shk-border-width-medium` solid `--shk-action-focus`, offset `--shk-space-1` |

All of these exist in `tokens.css`; nothing new is needed. In Figma, padding binds `space/4` (Figma draws the stroke inside, so it looks the same as the code's `calc`). The Figma `focus-ring` layer uses `radius/24` so its curve follows the card's 16px corners at that distance (`Button` does the same with 12 for its 8px corners); in code the browser rounds the outline itself.

### Accessibility

- Static card with a `title`: `root` is `role="group"` labelled by the title (`aria-labelledby`), the same as `SpaceCard` and `ModuleCard`, so screen readers announce "Climate Module, group" when entering it.
- Without a `title`: `root` is a plain `<div>` with no role. A group with no name only adds noise.
- Clickable card: `root` is a plain `<div>` too. The link or button already carries the name, and a group with the same name would make screen readers say "Kitchen" twice.
- The title isn't a heading, so it doesn't break the heading order of the page. Put cards inside a `ContentSection` for headings.
- `title` is rendered as text, never as HTML. The full title is in the `title` attribute when it truncates.
- The icon is decorative (`aria-hidden`): the title next to it already says the name. It never replaces the title, so it's shown only when there is one.
- Text contrast: `text/primary` on `surface/default`. The border is decoration only; the card doesn't rely on it to be understood.
- Reading order: title, `headerEnd`, content, footer.
- Clickable card: the title is the one focusable element, so Tab stops once per card. The link or button is named by the title ("Kitchen, link"). The focus ring is drawn around the whole card, not just the title: `root` gets the outline when its link has keyboard focus (`.root:has(:focus-visible)`).
- Hover and pressed fills are extra feedback only. The focus ring and the pointer cursor don't rely on colour.

### Decisions

- **Icon:** `icon` takes an `IconName`, so `Card` stays generic: it doesn't know Space Types. Which icon goes with which Space Type is decided once, in `SPACE_TYPE_ICONS` in [`SpaceLabel`](../../context/SpaceLabel/SpaceLabel.md); apps pass `icon={SPACE_TYPE_ICONS[spaceType]}`. `title` stays plain text, because on a clickable card it is the link's text. Size 24px (`md`), chosen by the designer over 20px. In Figma the `icon` layer is an exposed `Icon` instance, so designers pick the icon on each card instance.
- **Narrow header:** `Card` keeps the header in one row at every width and truncates the title. `ModuleCard` stacks its status under the name below 332px; that stays `ModuleCard`'s own behaviour for now.

### Open questions

- **Routing.** `href` gives a plain `<a>`, which reloads the page in apps with a client-side router. Apps will need to pass in their own link component (Next.js `Link`, React Router `Link`). Decide this once for the whole kit, with navigation (`TopBar`, `BottomNav`, `Breadcrumbs`), not per component. It adds a prop; `href` and `onClick` stay as they are.
