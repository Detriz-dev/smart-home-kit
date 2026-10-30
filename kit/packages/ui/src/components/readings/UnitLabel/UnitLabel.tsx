import styles from "./UnitLabel.module.css";
import type { UnitLabelProps, UnitLabelUnit } from "./UnitLabel.types";

/** How each Unit is written on screen and how screen readers say it. The degree sign is U+00B0, µ is U+00B5 and ³ is U+00B3. */
const UNITS: Record<UnitLabelUnit, { symbol: string; spokenName: string }> = {
  celsius: { symbol: "°C", spokenName: "degrees Celsius" },
  fahrenheit: { symbol: "°F", spokenName: "degrees Fahrenheit" },
  "percent-rh": { symbol: "%RH", spokenName: "percent relative humidity" },
  lux: { symbol: "lx", spokenName: "lux" },
  ppm: { symbol: "ppm", spokenName: "parts per million" },
  ppb: { symbol: "ppb", spokenName: "parts per billion" },
  "ug-m3": { symbol: "µg/m³", spokenName: "micrograms per cubic metre" },
};

/** Shows the Unit of a Metric as a short symbol, e.g. °C. Looks the same in every Connection Status. Takes props only, never fetches data. */
export function UnitLabel({ unit, size = "lg" }: UnitLabelProps) {
  const { symbol, spokenName } = UNITS[unit];

  return (
    <span data-size={size} className={styles.root}>
      {/* Screen readers skip the symbol and read the spoken name instead, so "°C" is always "degrees Celsius". */}
      <span aria-hidden="true" className={styles.symbol}>
        {symbol}
      </span>
      <span className={styles.spokenName}>{spokenName}</span>
    </span>
  );
}
