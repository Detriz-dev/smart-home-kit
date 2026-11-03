import { useId } from "react";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { SensorReading } from "../SensorReading";
import styles from "./ModuleCard.module.css";
import type { ModuleCardProps } from "./ModuleCard.types";

/** One Module as a card: its name, Connection Status, Faults and Sensors. Takes props only, never fetches data. */
export function ModuleCard({
  name,
  sensors,
  connectionStatus,
  faults = [],
}: ModuleCardProps) {
  const nameId = useId();

  return (
    <div role="group" aria-labelledby={nameId} className={styles.root}>
      <div className={styles.header}>
        <span id={nameId} className={styles.name} title={name}>
          {name}
        </span>
        <DeviceConnectionStatus status={connectionStatus} />
      </div>
      {/* One DeviceFaultStatus per Fault. Each Fault Code appears once, so it works as the key. */}
      {faults.map((fault) => (
        <DeviceFaultStatus key={fault.faultCode} {...fault} />
      ))}
      {/* role="list": Safari stops treating a list as a list once its bullets are removed. */}
      <ul
        role="list"
        data-sensor-count={sensors.length}
        className={styles.sensors}
      >
        {sensors.map(({ metric, value, unit, fractionDigits }) => (
          <li key={metric} className={styles.sensor}>
            <SensorReading
              metric={metric}
              value={value}
              unit={unit}
              fractionDigits={fractionDigits}
              isDisconnected={connectionStatus === "disconnected"}
              size="md"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
