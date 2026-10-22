// The icon set of the kit: the single source of truth for which icons exist.
// After changing this file, run `pnpm --filter @detriz-sh-kit/ui icons` to regenerate `generated/paths.ts`.
// Find names at https://fonts.google.com/icons (Material Symbols, Rounded). Use the name with
// underscores (`wifi_off`) and add `-fill` for the filled version (`lightbulb-fill`).
export const iconConfig = {
  /** One style for the whole kit. Weight is 400, fixed by the `@material-symbols/svg-400` package. */
  style: "rounded",
  /** Keep this list in alphabetical order, so it's easy to scan in reviews. */
  icons: [
    "battery_full",
    "bolt",
    "door_front",
    "error",
    "home",
    "humidity_percentage",
    "lightbulb",
    "lightbulb-fill",
    "sensors",
    "stairs_2" ,
    "thermostat",
    "wifi",
    "wifi_off",
  ],
} as const;
