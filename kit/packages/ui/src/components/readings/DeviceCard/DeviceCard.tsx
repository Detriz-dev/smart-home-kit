import { Card } from "../../layout/Card";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { SensorReading } from "../SensorReading";
import { SensorState } from "../SensorState";
import styles from "./DeviceCard.module.css";
import type { DeviceCardProps } from "./DeviceCard.types";

/** One Device as a raised Card: its name, Connection Status, Faults, Sensors and Controls. Works for any Device Kind. Takes props only, never fetches data. */
export function DeviceCard({
  name,
  sensors = [],
  controls,
  connectionStatus,
  faults = [],
}: DeviceCardProps) {
  return (
    // Card draws the surface and the header strip (name + Connection Status) and names the group.
    <Card
      title={name}
      headerEnd={<DeviceConnectionStatus status={connectionStatus} />}
    >
      {/* A container, so the Sensors can switch to a row when the body is wide enough. */}
      <div className={styles.content}>
        {/* One DeviceFaultStatus per Fault. Each Fault Code appears once, so it works as the key. */}
        {faults.map((fault) => (
          <DeviceFaultStatus key={fault.faultCode} {...fault} />
        ))}
        {/* role="list": Safari stops treating a list as a list once its bullets are removed. */}
        {sensors.length > 0 && (
          <ul
            role="list"
            data-sensor-count={sensors.length}
            className={styles.sensors}
          >
            {sensors.map((sensor) => (
              // A Device has one Sensor per Metric, so the Metric is a unique key.
              <li key={sensor.metric} className={styles.sensor}>
                {"state" in sensor ? (
                  <SensorState
                    {...sensor}
                    isDisconnected={connectionStatus === "disconnected"}
                    size="md"
                  />
                ) : (
                  <SensorReading
                    metric={sensor.metric}
                    value={sensor.value}
                    unit={sensor.unit}
                    fractionDigits={sensor.fractionDigits}
                    isDisconnected={connectionStatus === "disconnected"}
                    size="md"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
        {/* The Controls, placed by the parent: one per row, full width. */}
        {controls && <div className={styles.controls}>{controls}</div>}
      </div>
    </Card>
  );
}
