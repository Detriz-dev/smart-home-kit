# @detriz-sh-kit/tokens

The design tokens of the [DeTriz Smart Home Kit](https://smart-home-kit.detriz.com): colors, typography, space, size, shape, elevation and motion, as CSS variables with the `--shk-` prefix.

The kit's React components ([`@detriz-sh-kit/ui`](https://www.npmjs.com/package/@detriz-sh-kit/ui)) are styled with these tokens. You can also use them in your own CSS, so your screens match the kit.

## Install

```sh
npm install @detriz-sh-kit/tokens
```

## Use

Import the tokens **once**, at the root of your app. If you also use `@detriz-sh-kit/ui`, import the tokens first:

```tsx
import "@detriz-sh-kit/tokens/tokens.css";
```

Then use the variables in your own CSS:

```css
.my-panel {
  background: var(--shk-surface-default);
  color: var(--shk-color-text-secondary);
  padding: var(--shk-space-4);
}
```

Prefer **semantic** tokens (named for their purpose, like `--shk-color-text-secondary`) over primitive ones (raw values, like a palette color). Semantic tokens keep your screens consistent when the kit's values change.

## Learn more

- [Design tokens](https://smart-home-kit.detriz.com/docs/ui-components/foundations/design-tokens): how the tokens are organized, and how they work with your own CSS
- [Colors](https://smart-home-kit.detriz.com/docs/ui-components/foundations/colors), [Typography](https://smart-home-kit.detriz.com/docs/ui-components/foundations/typography) and [Space and size](https://smart-home-kit.detriz.com/docs/ui-components/foundations/space-and-size): every token, with examples
- [Changelog](https://github.com/Detriz-dev/smart-home-kit/blob/main/kit/packages/tokens/CHANGELOG.md): what changed in each version

## Versions

The kit is in `0.x`, so a **minor** version (`0.1` → `0.2`) may include breaking changes, like a renamed or removed token. Read the changelog before you update. Keep `@detriz-sh-kit/tokens` and `@detriz-sh-kit/ui` on the same version.

## License

[MIT](./LICENSE)
