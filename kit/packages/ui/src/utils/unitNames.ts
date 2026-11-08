import type { UnitLabelUnit } from "../components/readings/UnitLabel/UnitLabel.types";

/** How each Unit is written on screen and how screen readers say it. The degree sign is U+00B0, µ is U+00B5 and ³ is U+00B3. */
export const UNIT_NAMES: Record<
  UnitLabelUnit,
  { symbol: string; spokenName: string }
> = {
  celsius: { symbol: "°C", spokenName: "degrees Celsius" },
  fahrenheit: { symbol: "°F", spokenName: "degrees Fahrenheit" },
  "percent-rh": { symbol: "%RH", spokenName: "percent relative humidity" },
  percent: { symbol: "%", spokenName: "percent" },
  lux: { symbol: "lx", spokenName: "lux" },
  ppm: { symbol: "ppm", spokenName: "parts per million" },
  ppb: { symbol: "ppb", spokenName: "parts per billion" },
  "ug-m3": { symbol: "µg/m³", spokenName: "micrograms per cubic metre" },
};
