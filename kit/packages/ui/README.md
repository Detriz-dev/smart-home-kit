# @detriz-sh-kit/ui

React components for building smart home apps: Readings, Device status, controls, alerts, navigation and layout. Part of the [DeTriz Smart Home Kit](https://smart-home-kit.detriz.com).

The components are presentational: you pass the data in as props, and they never fetch anything themselves.

## Install

```sh
npm install @detriz-sh-kit/ui @detriz-sh-kit/tokens
```

You need **React 19** and a bundler that handles ES modules and CSS imports, like Vite or Next.js. The types are included.

## Load the styles and fonts

Import these **once**, at the root of your app (for example `src/main.tsx` in Vite or `app/layout.tsx` in Next.js). Load the tokens first:

```tsx
import "@detriz-sh-kit/tokens/tokens.css";
import "@detriz-sh-kit/ui/styles.css";
import "@detriz-sh-kit/ui/fonts.css"; // optional: skip it if you load Space Grotesk and Space Mono yourself
```

The kit's styles live in a CSS cascade layer called `detriz`. If your app has global styles (like a reset), put them in a layer that comes first, so they don't override the components:

```css
@layer reset, detriz;
```

## Use a component

```tsx
import { SensorReading } from "@detriz-sh-kit/ui";

export function App() {
  return <SensorReading metric="temperature" value={22.4} unit="celsius" />;
}
```

In the Next.js App Router, put `"use client";` at the top of files that render the kit's components.

## Learn more

- [Installation](https://smart-home-kit.detriz.com/docs/get-started/installation): the full setup, with troubleshooting
- [UI Components](https://smart-home-kit.detriz.com/docs/ui-components): every component, with live examples
- [Glossary](https://smart-home-kit.detriz.com/docs/domain-model/glossary): the words the components use, like Site, Space, Sensor and Reading
- [Figma library](https://www.figma.com/community/file/1700179982740576850/detriz-smart-home-kit): the same components for design
- [Changelog](https://github.com/Detriz-dev/smart-home-kit/blob/main/kit/packages/ui/CHANGELOG.md): what changed in each version

## Versions

The kit is in `0.x`, so a **minor** version (`0.1` → `0.2`) may include breaking changes. Read the changelog before you update. Keep `@detriz-sh-kit/ui` and `@detriz-sh-kit/tokens` on the same version. Only the latest version gets fixes.

## License

[MIT](./LICENSE)
