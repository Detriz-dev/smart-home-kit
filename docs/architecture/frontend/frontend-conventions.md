# Frontend conventions:

## Naming Convention
| Thing | Pattern                                     | Example                                                    |
|---|---------------------------------------------|------------------------------------------------------------|
| Component | PascalCase noun, file name = component name | `ModuleCard.tsx`                                           |
| Page | `<Name>Page.tsx`                            | `DashboardPage.tsx`                                        |
| Hook | `use<Thing>.ts`                             | `useTelemetry.ts`, `useModules.ts`                         |
| Helper function | camelCase verb                              | `formatUnit.ts`                                            |
| Test | next to the file, same name                 | `ModuleCard.test.tsx`, `useTelemetry.test.ts`              |
| Folder | kebab-case                                  | `design-system/`, `features/live-studio/`                  |
| Type / interface | PascalCase noun, no `I` prefix              | `SensorReading`, `ModuleStatus`                            |
| Props type | `<Component>Props`                          | `ModuleCardProps`                                          |
| Union / enum values | lowercase string literals                   | `'temperature' \| 'light' \| 'air-quality'`                |
| Constant | SCREAMING_SNAKE_CASE                        | `MAX_RECONNECT_ATTEMPTS`                                   |
| Boolean | `is/has/can/should` prefix                  | `isOnline`, `hasAlert`                                     |
| Event prop / handler | `on<Event>` prop, `handle<Event>` inside    | `onThresholdChange`, `handleThresholdChange`               |
| Values with units | unit suffix                                 | `temperatureC`, `humidityPct`, `timestampMs`               |
| API function | verb + resource                             | `getModules`, `subscribeToReadings`                        |
| Context / provider | `<Thing>Context`, `<Thing>Provider`         | `TelemetryProvider`                                        |
| CSS token | `--<prefix>-<category>-<role>-<variant>`    | `--shk-color-status-warning`, `--space-4`                  |
| CSS module | same name as component                      | `ModuleCard.module.css`                                    |
| Component states | fixed vocabulary                            | `default`, `loading`, `empty`, `error`, `offline`, `stale` |
| Mock / fixture data | `<name>.mock.ts`                            | `readings.mock.ts`                                         |
| Asset | kebab-case, type prefix                     | `icon-air-quality.svg`                                     |
| Route | kebab-case                                  | `/design-system`, `/live-studio`                           |
| Env variable | build-tool prefix + SCREAMING_SNAKE         | `VITE_WS_URL`                                              |
| Barrel file | `index.ts` per exported folder              | `design-system/index.ts`                                   |


