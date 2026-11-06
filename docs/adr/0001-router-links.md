# 0001. Links use the app's router through one LinkProvider

- Status: accepted
- Date: 2026-11-06
- Affects: `@detriz-sh-kit/ui` (`Card`, `ListItem`, `DeviceListItem`, `TopBar` and every later component with a link)

## Context

Several `ui` components can be links: a clickable `Card`, a clickable `ListItem` or `DeviceListItem`, and `TopBar`'s back button. They take an `href` and rendered a plain `<a href>`.

Most React apps use a client-side router (Next.js, React Router, TanStack Router). A plain `<a>` makes the browser load the whole page again: the app restarts, its state is lost, and it's slow. Each router has its own link component (`next/link`'s `Link`, React Router's `Link`) that changes the screen without a reload.

`ui` is presentational and can't depend on any router. It needs a way to render the app's link component without knowing which one it is. Until now, the docs told apps to use `onClick` and navigate by hand, which turns links into buttons (no "open in new tab", no link preview).

## Options

1. **A prop on every component** (`linkComponent={NextLink}`). Simple, but every clickable component in every screen needs it. Easy to forget one, and generated screens would have to pass it everywhere.
2. **One provider for the whole app** (`<LinkProvider component={NextLink}>`). Set once at the root; every `ui` link uses it. Without it, components render a plain `<a>`, so nothing breaks.
3. **Keep plain `<a>` and `onClick`.** No work, but every app either reloads the page or loses real links.

## Decision

Option 2: **`LinkProvider`**, exported from `@detriz-sh-kit/ui`.

```tsx
import NextLink from "next/link";
import { LinkProvider } from "@detriz-sh-kit/ui";

<LinkProvider component={NextLink}>
  <App />
</LinkProvider>;
```

- Every `ui` component that has an `href` renders its links through an internal `KitLink`, which uses the provider's component, or a plain `<a>` when there is no provider.
- The link component gets `href`, `className`, `children`, and when needed `id`, `title`, `aria-label` and `aria-current`. That matches `next/link` directly. Routers whose link takes `to` instead of `href` (React Router) need a two-line adapter, shown in the docs.
- `onClick` stays for actions that aren't navigation.
- The code lives in `kit/packages/ui/src/link/`. It's a React context, so it sits next to hooks in the import chain: components may import it; it imports no components.

## Consequences

- `Card`, `ListItem` and `DeviceListItem` switch from `<a>` to `KitLink`. Their props don't change; apps without a provider see no difference.
- The "Apps with a router" workaround (`onClick` + `navigate`) is removed from the docs and replaced by `LinkProvider`.
- New components with links (`TopBar`, later `BottomNav`, `Breadcrumbs`, `Tabs`) use `KitLink` from the start.
- `ui` still has no router dependency.
