import { useId } from "react";
import { Switch } from "../../controls/Switch";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { SensorReading } from "../SensorReading";
import styles from "./ModuleCard.module.css";
import type { ModuleCardProps } from "./ModuleCard.types";

/** One Module as a card: its name, Connection Status, Fault, Sensors and Switch. Takes props only, never fetches data. */
export function ModuleCard({
  name,
  sensors,
  connectionStatus,
  fault,
  isOn,
  onToggle,
}: ModuleCardProps) {
  const nameId = useId();
  // Off is a setting, not a status: an Off Module always shows as Disconnected.
  const shownStatus = isOn ? connectionStatus : "disconnected";
  // Greyed out only when the Module is lost. An Off Module must stay usable, so the user can turn it back on.
  const isSwitchDisabled = isOn && connectionStatus === "disconnected";

  return (
    <div role="group" aria-labelledby={nameId} className={styles.root}>
      <div className={styles.header}>
        <span id={nameId} className={styles.name} title={name}>
          {name}
        </span>
        <DeviceConnectionStatus status={shownStatus} />
      </div>
      {fault && <DeviceFaultStatus {...fault} />}
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
              isDisconnected={shownStatus === "disconnected"}
              size="md"
            />
          </li>
        ))}
      </ul>
      <Switch
        isOn={isOn}
        onChange={onToggle}
        ariaLabel={name}
        isDisabled={isSwitchDisabled}
      />
    </div>
  );
}
