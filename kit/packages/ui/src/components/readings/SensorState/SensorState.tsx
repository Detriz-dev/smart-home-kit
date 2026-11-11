import { useId } from "react";
import { AssetLabel } from "../../context/AssetLabel";
import { SensorLabel } from "../../context/SensorLabel";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { StateValue } from "../StateValue";
import styles from "./SensorState.module.css";
import type { SensorStateProps } from "./SensorState.types";

/** The latest State of one State Sensor as a small card: what it is about on top, the State below. The twin of SensorReading. Takes props only, never fetches data. */
export function SensorState({
  asset,
  isDisconnected = false,
  alertLevel,
  size = "lg",
  faults = [],
  ...reading
}: SensorStateProps) {
  const labelId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-size={size}
      className={styles.root}
    >
      {/* The label names the group: the Asset ("Front door") when there is one, otherwise the Metric ("Power"). */}
      <span id={labelId} className={styles.label}>
        {asset ? (
          <AssetLabel name={asset.name} assetType={asset.assetType} size="xs" />
        ) : (
          <SensorLabel metric={reading.metric} size="xs" />
        )}
      </span>
      <span className={styles.state}>
        <StateValue
          {...reading}
          isDisconnected={isDisconnected}
          alertLevel={alertLevel}
          size={size}
        />
      </span>
      {/* The Faults about this Sensor, under its State. No Metric: the label above already names it. */}
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
