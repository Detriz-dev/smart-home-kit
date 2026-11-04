# Docs site styling guide

How to change the look of the docs site (`kit/apps/docs-site`): colours, fonts, navbar, sidebar, landing page. It covers **where** each kind of style lives and **how** to change it safely.

This guide is about the site around the content. To change how a kit component looks, change the component in `kit/packages/ui` instead (see the [component building workflow](./component-building.md)). The docs site only shows it.

## Contents

- [How the site gets its styles](#how-the-site-gets-its-styles)
- [Where to edit: the five places](#where-to-edit-the-five-places)
- [1. Global look: `custom.css`](#1-global-look-customcss)
- [2. Settings: `docusaurus.config.ts`](#2-settings-docusaurusconfigts)
- [3. The landing page: `src/pages/`](#3-the-landing-page-srcpages)
- [4. One Docusaurus part: target its class](#4-one-docusaurus-part-target-its-class)
- [5. Changing structure, not just style: swizzling](#5-changing-structure-not-just-style-swizzling)
- [The workflow](#the-workflow)
- [Rules](#rules)
- [When something goes wrong](#when-something-goes-wrong)

## How the site gets its styles

Three layers of CSS stack on every page. Think of them as Figma styles applied on top of each other: the later one wins.

| Order | What                                | Where it comes from                                        | You edit it?                     |
| ----- | ----------------------------------- | ---------------------------------------------------------- | -------------------------------- |
| 1     | **Infima** and Docusaurus's theme   | `node_modules` (Docusaurus's built-in CSS framework)       | No. You override it.             |
| 2     | **The kit**: tokens + component CSS | `src/kit-styles.ts` loads `tokens.css` and `ui/styles.css` | No. Change it in the packages.   |
| 3     | **The site's own CSS**              | `src/css/custom.css` and `*.module.css` files in `src/`    | **Yes. This is where you work.** |

Two things make this work:

- **Infima variables.** Docusaurus styles everything through CSS variables that start with `--ifm-` (Infima) or `--docusaurus-`. Change a variable and every part that uses it changes. This is the main tool you have, like changing a Figma variable instead of each layer.
- **Cascade layers.** `future.v4: true` in `docusaurus.config.ts` puts Docusaurus's CSS in cascade layers. Layered CSS always loses to CSS that isn't in a layer. So your `custom.css` (not in a layer) beats Docusaurus without `!important`. Don't remove that flag.

The kit's tokens (`--shk-…`) are available on every page, so the site can use the same colours, fonts and spacing as the components.

## Where to edit: the five places

| I want to change…                                                 | Edit                                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| Colours, fonts, spacing of the whole site                         | `src/css/custom.css` (Infima variables)              |
| Navbar items, footer text, dark mode switch, code highlight theme | `docusaurus.config.ts` → `themeConfig`               |
| The landing page at `/`                                           | `src/pages/index.tsx` + `src/pages/index.module.css` |
| One part, for example the sidebar links or admonitions            | `src/css/custom.css`, targeting its class            |
| The HTML of a part, for example a new footer layout               | Swizzle the component into `src/theme/`              |

All paths below are inside `kit/apps/docs-site/`.

## 1. Global look: `custom.css`

`src/css/custom.css` is loaded on every page. Today it still holds the Docusaurus starter colours (green `#2e8555`). This is where you connect the site to the kit's tokens.

Point the Infima variables at `--shk-` tokens:

```css
:root {
  /* Brand colour: links, active sidebar item, primary buttons */
  --ifm-color-primary: var(--shk-action-primary-bg);
  --ifm-color-primary-dark: var(--shk-action-primary-bg-hover);
  --ifm-color-primary-darker: var(--shk-action-primary-bg-pressed);
  --ifm-color-primary-darkest: var(--shk-action-primary-bg-pressed);
  --ifm-color-primary-light: var(--shk-action-primary-bg);
  --ifm-color-primary-lighter: var(--shk-action-primary-bg);
  --ifm-color-primary-lightest: var(--shk-action-primary-bg);

  /* Fonts */
  --ifm-font-family-base: var(--shk-font-family-sans);
  --ifm-heading-font-family: var(--shk-font-family-sans);
  --ifm-font-family-monospace: var(--shk-font-family-mono);

  /* Page and text */
  --ifm-background-color: var(--shk-surface-page);
  --ifm-font-color-base: var(--shk-color-text-primary);
  --ifm-toc-border-color: var(--shk-color-border-subtle);
  --ifm-global-radius: var(--shk-radius-8);
}
```

Useful Infima variables:

| Variable                                               | Changes                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `--ifm-color-primary` (+ `-dark`, `-light` … shades)   | Links, active menu item, primary buttons. Docusaurus uses the shades for hover and pressed. |
| `--ifm-font-family-base`, `--ifm-heading-font-family`  | Body and heading fonts                                                                      |
| `--ifm-font-family-monospace`, `--ifm-code-font-size`  | Code font and size                                                                          |
| `--ifm-background-color`, `--ifm-font-color-base`      | Page background and text colour                                                             |
| `--ifm-navbar-background-color`, `--ifm-navbar-height` | Navbar                                                                                      |
| `--ifm-menu-color`, `--ifm-menu-color-active`          | Sidebar links                                                                               |
| `--ifm-footer-background-color`                        | Footer                                                                                      |
| `--ifm-global-radius`, `--ifm-spacing-horizontal`      | Corner radius and base spacing used everywhere                                              |
| `--ifm-container-width-xl`                             | Maximum content width                                                                       |

To find more: open the site, right-click → **Inspect**, select an element and look in the **Styles** panel for `var(--ifm-…)`. The full list is in the [Infima docs](https://infima.dev/docs/getting-started/introduction) and in `node_modules/infima/dist/css/default/default.css`.

### Dark mode

The site has a light/dark switch (`[data-theme="dark"]` in `custom.css`), but **the kit has only a light theme**. So you have a decision to make before styling dark mode:

- **Keep dark mode:** write the dark values under `[data-theme="dark"]` with palette tokens (`--shk-palette-…`), knowing components inside live examples stay light (that's the existing `playgroundPreview` rule at the bottom of `custom.css`).
- **Turn it off for now:** in `docusaurus.config.ts`, set `colorMode: { defaultMode: "light", disableSwitch: true, respectPrefersColorScheme: false }` and delete the `[data-theme="dark"]` block.

## 2. Settings: `docusaurus.config.ts`

Some looks are settings, not CSS. They live in `themeConfig`:

| Setting                                       | What it does                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `navbar.title`, `navbar.logo`, `navbar.items` | The top bar: title, logo image, links. A logo file goes in `static/img/`. |
| `footer`                                      | Footer text and link columns. `style: "dark"` or `"light"`.               |
| `colorMode`                                   | Dark mode default and switch (see above).                                 |
| `prism.theme`, `prism.darkTheme`              | Colours of code blocks (`prismThemes.github`, `dracula`, …).              |
| `docs.sidebar.hideable`                       | Lets readers collapse the sidebar.                                        |

Remember: this file runs in Node, not the browser. No JSX, no `window`, no CSS imports here.

## 3. The landing page: `src/pages/`

The landing page has its own CSS Module, `src/pages/index.module.css`. Class names in it (`.hero`, `.title`) only apply to that page, so you can't break other pages from here.

It still uses `--ifm-` variables. The plan ([documentation implementation plan](../documentation-implementation-plan.md), "Landing page") is to switch it to `--shk-` tokens and to use real kit components, for example:

```css
.hero {
  gap: var(--shk-space-16);
  padding: var(--shk-space-24) var(--shk-space-4);
}

.visual {
  border: var(--shk-border-width-thin) dashed var(--shk-color-border-subtle);
  border-radius: var(--shk-radius-16);
  color: var(--shk-color-text-secondary);
}
```

For a new page, add `src/pages/<name>.tsx` (it becomes `/<name>`) and a `<name>.module.css` next to it.

## 4. One Docusaurus part: target its class

When a variable isn't enough, style the part directly in `custom.css`. Docusaurus gives its parts stable class names. Find them with **Inspect** in the browser.

| Part              | Class                                         |
| ----------------- | --------------------------------------------- |
| Navbar            | `.navbar`, `.navbar__title`, `.navbar__link`  |
| Sidebar           | `.menu`, `.menu__link`, `.menu__link--active` |
| Page content      | `.theme-doc-markdown`                         |
| Table of contents | `.table-of-contents`                          |
| Admonitions       | `.theme-admonition`, `.alert--info` …         |
| Prev / next links | `.pagination-nav`                             |
| Footer            | `.footer`                                     |

```css
.menu__link--active {
  font-weight: var(--shk-font-weight-semibold);
}
```

Prefer the classes above. Some classes have random endings, like `playgroundPreview_a1b2`. Those come from CSS Modules and the ending can change, so match the start with `[class*="playgroundPreview"]` (as `custom.css` already does) and only when there's no stable class.

**Careful:** `custom.css` also wins over the kit's component CSS. Never target kit component classes from here; it would make the docs show something different from what users get.

## 5. Changing structure, not just style: swizzling

If you need different HTML (a footer with your own layout, a custom sidebar item), CSS can't do it. Docusaurus lets you copy one of its components into `src/theme/` and change it. This is called **swizzling**.

```bash
# See which components are safe to swizzle
pnpm --filter docs-site docusaurus swizzle @docusaurus/theme-classic --list

# Wrap: keep the original and add around it (safer, survives upgrades)
pnpm --filter docs-site docusaurus swizzle @docusaurus/theme-classic Footer --wrap

# Eject: copy the full source to edit freely (you then maintain it)
pnpm --filter docs-site docusaurus swizzle @docusaurus/theme-classic Footer --eject
```

Try CSS first; swizzle only when you must. Already swizzled:

- `src/theme/ReactLiveScope`: lists the kit components the live examples can use.
- `src/theme/Playground/` (`Container`, `Preview`, `Editor`): the live code block card, ejected to match the Figma design (no "Result" header, a "Live editor" bar with a Reset button). After a Docusaurus upgrade, compare them with the originals in `@docusaurus/theme-live-codeblock`.

The dark background of every code block comes from the code theme in `docusaurus.config.ts` (`codeTheme`), which reads `--site-code-background` from `custom.css`.

## The workflow

1. **Branch:** `<issue-number>-short-name` (you are on `71-edit-docs-site-styling`).
2. **Run the site:** `pnpm docs-site` from the repo root, open <http://localhost:3000>. CSS changes show up right away. If a `docusaurus.config.ts` change doesn't, stop and restart.
3. **Inspect first:** find the element in browser DevTools and try the change live in the Styles panel. Then copy it into the file.
4. **Check both modes and widths:** light and dark (if kept), and a phone width (DevTools → device toolbar). The sidebar turns into a menu below 997px.
5. **Check a component page** (for example UI Components → Context → LocationPath): the live examples must still look exactly like Storybook.
6. **Check it builds:**
   ```bash
   pnpm --filter docs-site typecheck
   pnpm turbo run build --filter=docs-site...
   pnpm format
   ```
7. **Commit:** `style(docs-site): use kit tokens for site colours`.

## Rules

- Use `--shk-` tokens for values, not raw colours or sizes. If a token you need doesn't exist, add it to `kit/packages/tokens` rather than hard-coding it.
- Exception: values that belong to the docs site only, not the kit (for example the site font, Lexend), go in a `--site-…` variable at the top of `custom.css`. Then the raw value is written in one place.
- Change Infima variables before writing new selectors.
- Don't use `!important`. If you think you need it, the cascade layers are probably off.
- Don't style kit components from the site.
- Keep `future.v4: true`.

## When something goes wrong

| Problem                                 | Likely cause and fix                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A `var(--shk-…)` does nothing           | Typo in the name, or the token doesn't exist. Search `kit/packages/tokens/dist/tokens.css`.                                          |
| A token change doesn't show             | Tokens aren't rebuilt: `pnpm --filter @detriz-sh-kit/tokens build`, then restart `pnpm docs-site`.                                   |
| A component change doesn't show         | The site uses the built `ui`: `pnpm --filter @detriz-sh-kit/ui build`.                                                               |
| My rule loses to Docusaurus             | Your selector is in a `@layer`, or Docusaurus uses a more specific selector. Check in Inspect which rule wins.                       |
| Live example components look wrong      | A `custom.css` rule is too broad (for example `p { … }` or `button { … }`). Scope it to `.theme-doc-markdown` or a Docusaurus class. |
| Change works in dev but not after build | Clear the cache: `pnpm --filter docs-site clear`, then build again.                                                                  |
