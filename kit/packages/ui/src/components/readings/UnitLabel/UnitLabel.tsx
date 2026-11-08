import styles from "./UnitLabel.module.css";
import type { UnitLabelProps } from "./UnitLabel.types";
import { UNIT_NAMES } from "../../../utils/unitNames";

/** Shows the Unit of a Metric as a short symbol, e.g. °C. Looks the same in every Connection Status. Takes props only, never fetches data. */
export function UnitLabel({ unit, size = "lg" }: UnitLabelProps) {
  const { symbol, spokenName } = UNIT_NAMES[unit];

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
