import { useId } from "react";
import { SensorLabel } from "../../context/SensorLabel";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { ReadingValue } from "../ReadingValue";
import { UnitLabel } from "../UnitLabel";
import styles from "./SensorReading.module.css";
import type { SensorReadingProps } from "./SensorReading.types";

/** The latest Reading of one Sensor as a small card: the Metric on top, the value and its Unit below. Takes props only, never fetches data. */
export function SensorReading({
  metric,
  value,
  unit,
  isDisconnected = false,
  fractionDigits = 1,
  size = "lg",
  faults = [],
}: SensorReadingProps) {
  const labelId = useId();
  // Same rule as ReadingValue: no number is shown while loading or Disconnected.
  const hasValue = !isDisconnected && value !== null;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-size={size}
      className={styles.root}
    >
      {/* SensorLabel has no id prop, so this wrapper names the group: "Temperature". */}
      <span id={labelId} className={styles.label}>
        <SensorLabel metric={metric} size="xs" />
      </span>
      <span className={styles.reading}>
        <ReadingValue
          value={value}
          isDisconnected={isDisconnected}
          fractionDigits={fractionDigits}
          size={size}
        />
        {/* Without a value, screen readers skip the Unit: "Disconnected degrees Celsius" would sound like a value. */}
        <span
          aria-hidden={hasValue ? undefined : "true"}
          className={styles.unit}
        >
          <UnitLabel unit={unit} size={size} />
        </span>
      </span>
      {/* The Faults about this Sensor, under its value. No Metric: the label above already names it. */}
      {faults.length > 0 && (
        <span className={styles.faults}>
          {faults.map((faultCode) => (
            <DeviceFaultStatus key={faultCode} faultCode={faultCode} />
          ))}
        </span>
      )}
    </div>
  );
}
