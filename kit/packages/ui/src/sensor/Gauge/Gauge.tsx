import styles from "./Gauge.module.css";

export interface GaugeProps {
  /** What is being measured, e.g. "Kitchen". */
  label: string;
  /** The Reading's value, e.g. 22.4. */
  value: number;
  /** The unit shown after the value, e.g. "°C". */
  unit: string;
}

/** Shows one Reading: a label, a value and its unit. Takes props only, never fetches data. */
export function Gauge({ label, value, unit }: GaugeProps) {
  return (
    <figure className={styles.gauge}>
      <figcaption>{label}</figcaption>
      <p className={styles.value}>
        {value.toFixed(1)} {unit}
      </p>
    </figure>
  );
}
