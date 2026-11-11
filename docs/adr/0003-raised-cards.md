# 0003. Cards are raised: a header strip, a white body and a soft shadow

- Status: accepted (2026-11-10)
- Date: 2026-11-10
- Affects: `Card`, `DeviceCard`, `SpaceCard`, the new `IconTile`, `DeviceListItem`, `SpaceListItem`, `AlertListItem`, the `elevation` tokens, the Elevation foundation page and the Figma library

## Context

Until now the kit was **flat**: a card was a white surface with a 1px outline on the light grey page, and the Elevation page said "don't add a `box-shadow`". The design direction for the app changed (Figma draft "Card Power strip"): cards should lift off the page, their header should share the app's background, and list icons should sit in a small box. `DeviceCard` and `SpaceCard` also drew their own surface instead of using `Card`, so a change of look had to be made three times.

## Decision

1. **One raised card.** `Card` gets a header strip in the app background (`surface/page`), a white body (`surface/default`) with a thin line on top, and a soft shadow. The 1px outline stays, so the card keeps its edge in Windows High Contrast mode, where shadows are removed.
2. **A shadow token.** `--shk-elevation-raised` (`semantic/elevation.json`): `0 1px 4px` gray 950 at 12%. In Figma, the effect style `elevation/raised`. Only cards use it; banners, messages and empty states stay flat.
3. **The card title is body size, semibold** (16px, weight 600, token `--shk-card-title-font-weight`) instead of `h4` (20px semibold), so it reads as a header while the Readings stand out more.
4. **`DeviceCard` and `SpaceCard` are built on `Card`**, so all cards share one look from one place.
5. **`IconTile`**: a 32px box (`size/8`, `surface/page`, `color-border/subtle`, `radius/8`) around the icon at the start of a list row. The kit's list rows use it.
6. **`Card` gets a `padding` prop**: `md` (16px, default) for content, `sm` (8px) for a `List`, whose rows bring their own padding.

## Consequences

- Every app screen built from the kit's cards changes look at once. Apps that drew their own cards with the old recipe stay flat until they switch to `Card`.
- A narrow `DeviceCard` no longer puts the Connection Status under the name: `Card`'s header is always one row, so a long name ends with "…".
- Floating components (toast, dialog, menu) still need their own, stronger shadow and layer-order tokens when they arrive.
