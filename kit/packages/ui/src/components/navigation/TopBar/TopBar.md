# TopBar

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/navigation/top-bar.mdx). Props are defined in [`TopBar.types.ts`](./TopBar.types.ts).

### Purpose

The bar at the top of an app screen: a back button, the screen's title (with an optional icon) and actions on the right. It tells people where they are and gives them the way back, like "← 🍳 Kitchen" on a room's screen or "Devices [Add Device]" on the Devices screen.

It takes props only and never fetches data. Its back button is a link through the kit's [`LinkProvider`](/docs/adr/0001-router-links.md), so it uses the app's router.

Figma: `TopBar` component set in _DeTriz - Smart Home Kit_ (node `532:2105`), page `TopBar`, variant property `hasBack`. `.TopBarBack` (node `532:2084`, private) holds the back button's interaction states. The `TopBar examples` frame (node `532:2108`) shows the example values below, plus the back button focused.

### Component in domain model context

Category: **Navigation** ("Where am I, and where can I go?"). The title names where the person is; the back button takes them up a level.

It shows no domain terms of its own. `title` is free text: often a Space's name ("Kitchen"), a Site's name ("My flat") or a screen name ("Devices"). For a Space, the parent passes the Space Type's icon from `SPACE_TYPE_ICONS`.

What it does **not** do, and why:

- **Show the full location** (My flat › Level 2 › Kitchen). That's `LocationPath` (read-only) or the planned `Breadcrumbs`, under the bar.
- **Stick to the top of the page.** Scrolling behaviour belongs to the app's layout (the planned `AppShell`).
- **Hold the main app sections.** That's the planned `BottomNav` or `SideNav`.
- **Send commands to Devices.** Actions are app actions (add a Device, refresh), never "turn on".

### Visual idea

```
┌────────────────────────────────────────────────────┐
│ [←]  🍳 Kitchen                          [Actions] │
└────────────────────────────────────────────────────┘
 back  icon title                          actions
```

| Question    | Answer                                                                               |
| ----------- | ------------------------------------------------------------------------------------ |
| Icons?      | The back arrow (`arrow_back`, 24px), and an optional title icon (24px), like `Card`. |
| Separators? | A 1px line under the bar (`color-border-subtle`).                                    |
| Layouts?    | One. Back button and icon are optional; actions too.                                 |
| Text size   | Title `h3` (24px), larger than card titles (`h4`), so the screen title leads.        |
| Height      | At least 64px (`size-16`), the same with or without a back button.                   |

The bar fills the width of its parent. The title stays on one line and ends with "…". The back button and the actions never shrink.

### Variants

TopBar is Navigation, so it describes its parts instead of target states (see below).

**Parts shown:**

| Part      | Shown when                      | Figma property                                                                |
| --------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `back`    | `backHref` or `onBack` is given | variant `hasBack` (a variant, not a switch, because the left padding changes) |
| `icon`    | `icon` is given                 | `hasIcon`, exposed `icon`                                                     |
| `title`   | always                          | `title` (text)                                                                |
| `actions` | `actions` is given              | `hasActions`, slot `actions`                                                  |

**Back button** (Figma `.TopBarBack`, variant `state`): `default`, `hover` (fill `action/secondary/bg-hover`), `pressed` (`action/secondary/bg-pressed`), `focus` (2px `action/focus` ring). 44 × 44px (`size-11`), 8px corners.

Target states:

| Target state                   | Applies? | Why                                                                   |
| ------------------------------ | -------- | --------------------------------------------------------------------- |
| loading                        | no       | The title is known before data loads. The screen below shows loading. |
| Connected, Stale, Disconnected | no       | A screen has no Connection Status. Devices on it show their own.      |
| Fault                          | no       | Faults belong to Devices.                                             |

### Anatomy

```
root (header)            the bar: padding, line under it
├── back                 link (backHref) or button (onBack), icon only, named "Back"
├── heading (h1)
│   ├── icon             optional, 24px, decorative
│   └── title            one line, ends with "…"
└── actions              slot: e.g. a Button
```

1. **root**: one row, centred vertically, 8px between parts. Padding 8px top and bottom, 16px on the sides (8px on the left when there's a back button, so the arrow lines up with the content's edge).
2. **back**: 44 × 44px, the arrow centred.
3. **heading**: the screen's `<h1>`. Icon and title 8px apart. Fills the space left.
4. **actions**: right side, 8px between items, never shrinks.

### API

| Prop        | Type         | Required | Description                                                                     |
| ----------- | ------------ | -------- | ------------------------------------------------------------------------------- |
| `title`     | `string`     | yes      | The screen's title, plain text, e.g. "Kitchen". Shown as the screen's `<h1>`.   |
| `icon`      | `IconName`   | no       | An icon before the title, e.g. the Space Type's icon. Decorative.               |
| `backHref`  | `string`     | no       | Shows a back button that links here, e.g. `/`. Uses `LinkProvider`.             |
| `onBack`    | `() => void` | no       | Shows a back button that calls this, e.g. `router.back()`. Not with `backHref`. |
| `backLabel` | `string`     | no       | The back button's name for screen readers. Defaults to "Back".                  |
| `actions`   | `ReactNode`  | no       | Shown on the right, e.g. `IconButton`s (ghost) or a `Button`.                   |

Decisions behind them:

- **`backHref` or `onBack`**, never both (TypeScript checks it). A link is better: it can be opened in a new tab and works without JavaScript history. `onBack` is for "go back where I came from" (`router.back()`).
- **The title is the `<h1>`.** A screen has one main heading, and the bar's title is it. `ContentSection`s below start at `<h2>`.
- **`backLabel`** exists for translation and for a specific name ("Back to My flat").

### Example values

| Case               | back           | icon          | title                                     | actions                       |
| ------------------ | -------------- | ------------- | ----------------------------------------- | ----------------------------- |
| Room (default)     | `backHref="/"` | `countertops` | Kitchen                                   | –                             |
| Devices            | –              | –             | Devices                                   | `Button` primary "Add Device" |
| Home               | –              | `home`        | My flat                                   | –                             |
| `LongText` (320px) | `backHref="/"` | `weekend`     | Living room and dining area by the garden | `Button` "Add Device"         |
| `Minimal`          | –              | –             | Devices                                   | –                             |

### Tokens

| Part              | Property   | Token                                                                         |
| ----------------- | ---------- | ----------------------------------------------------------------------------- |
| root              | background | `--shk-surface-default`                                                       |
| root              | line under | `--shk-border-width-thin` solid `--shk-color-border-subtle`                   |
| root              | padding    | `--shk-space-2` (block, and inline-start with back), `--shk-space-4` (inline) |
| root              | gap        | `--shk-space-2`                                                               |
| root              | min height | `--shk-size-16` (64px)                                                        |
| back              | size       | `--shk-size-11` (44px)                                                        |
| back              | radius     | `--shk-radius-8`                                                              |
| back (hover)      | background | `--shk-action-secondary-bg-hover`                                             |
| back (pressed)    | background | `--shk-action-secondary-bg-pressed`                                           |
| back (focus)      | outline    | `--shk-border-width-medium` solid `--shk-action-focus`                        |
| heading           | gap        | `--shk-space-2`                                                               |
| title, icon, back | colour     | `--shk-color-text-primary`                                                    |
| title             | text style | `--shk-typography-h3-*`                                                       |
| actions           | gap        | `--shk-space-2`                                                               |

### Accessibility

- `root` is a `<header>`. The title is the screen's `<h1>`, so screen reader users land on it with the heading shortcut.
- The back button has no visible text: its name comes from `backLabel` ("Back"). The arrow icon is decorative.
- Back is a real link (`backHref`) or button (`onBack`), reachable with Tab, at least 44 × 44px.
- The title icon is decorative: the title says it.
- Reading order: back, title, actions.
- The focus ring doesn't rely on colour alone (it's a 2px outline).

### Open questions

- **A larger title** on top-level screens (like iOS large titles). Not in v1.
