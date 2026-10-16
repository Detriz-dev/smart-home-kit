


### Component directory structure

#### `components/`: the building blocks users see
Holds every UI component the package offers: cards, gauges, charts, status indicators. This is the main thing kit users install @detriz/ui for.
One folder per component, named after the component in PascalCase. All of its files live inside:
```
packages/ui/src/components/ModuleCard/
├── ModuleCard.tsx          ← component
├── ModuleCard.module.css   ← styles (tokens only)
├── ModuleCard.types.ts     ← ModuleCardProps and related types
├── ModuleCard.stories.tsx  ← Storybook stories, one per state/variant
├── ModuleCard.test.tsx     ← tests
├── ModuleCard.mock.ts      ← example props shared by stories and tests
└── index.ts                ← public exports: component + types
```

### UI Source directory structure
```
├── src/
│   ├── components/
│   ├── hooks/
│   ├── icons/
│   ├── types/
│   ├── utils/
│   ├── styles.css          ← re-exports token CSS + base styles
│   └── index.ts
```


#### `types/`: shared vocabulary
Holds types used by more than one component. Each component's own props stay in its `<Component>.types.ts`.
- Components import types to build their props: `status?: Status`.
- If a type is used by only one component, it stays in that component's folder. Move it to `types/` when a second component needs it.
- `types/` contains types only, no runtime code, so any other folder can import it safely.



#### `utils/`: pure functions
Formatting, conversion and calculations with no React and no side effects: `formatTemperature`, `convertTemperature`, `formatTimeAgo`, `getStatusFromThresholds`.
- Components never format values inline. They call a util, so every component shows 21.4 °C the same way.
- Utils take plain values and return plain values, which makes them easy to test and safe to export to users who don't use React.
- Utils may import from `types/` only.



#### `hooks/`: UI behavior, never data
React hooks that several components share: `useTimeAgo(updatedAtMs)`, `useReducedMotion()`, `useId()` wrappers.
- Hooks handle UI logic such as timers, media queries and focus. They never fetch, open sockets or read app state. That belongs in the future client package.
- A hook may use utils and types, for example `useTimeAgo` uses `formatTimeAgo` and re-renders every few seconds.
- If logic is used by only one component, keep it inside that component's folder.



#### `icons/`: visual symbols
React components for icons: status icons (`IconWarning`, `IconOffline`) and module types (`IconTemperature`, `IconAirQuality`).
- Icons are components, so they follow component rules: they accept `size` and `className`, use `currentColor`, and are `aria-hidden` by default.
- Components pair status icons with status colors, so status is never shown by color alone.
- Icons import nothing except types.



### How components use other direcctories 
```
types  ←  utils  ←  hooks  ←  components
                   icons  ←   components
@detriz-sh-kit/tokens  ←  components (via CSS)
```
**The rule:** imports only point down this chain. A util never imports a hook, a hook never imports a component, and nothing imports from components/ except other components.