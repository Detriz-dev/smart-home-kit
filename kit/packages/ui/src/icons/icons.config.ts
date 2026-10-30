// The icon set of the kit: the single source of truth for which icons exist.
// After changing this file, run `pnpm --filter @detriz-sh-kit/ui icons` to regenerate `generated/paths.ts`.
// Find names at https://fonts.google.com/icons (Material Symbols, Rounded). Use the name with
// underscores (`wifi_off`) and add `-fill` for the filled version (`lightbulb-fill`).
export const iconConfig = {
  /** One style for the whole kit. Weight is 400, fixed by the `@material-symbols/svg-400` package. */
  style: "rounded",
  /** Keep this list in alphabetical order, so it's easy to scan in reviews. */
  icons: [
    "airwave",
    "battery_full",
    "bolt",
    "co2",
    "door_front",
    "error",
    "grain",
    "home",
    "humidity_percentage",
    "humidity_mid",
    "light_mode",
    "lightbulb",
    "lightbulb-fill",
    "link_off",
    "refresh",
    "sensors",
    "stairs_2",
    "thermometer",
    "thermostat",
    "tv_gen",
    "wifi",
    "wifi_off",
  ],
} as const;
