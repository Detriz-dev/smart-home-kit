import { useId } from "react";
import { SensorLabel } from "../../context/SensorLabel";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { ReadingValue } from "../ReadingValue";
import { UnitLabel } from "../UnitLabel";
import styles from "./SpaceCard.module.css";
import type { SpaceCardProps, SpaceCardReading } from "./SpaceCard.types";

/** Which version of a row to draw. Only used inside this file, for the data attribute. */
type RowState = "connected" | "loading" | "stale" | "disconnected";

/** Works out a row's state from its own Module, first match wins (see SpaceCard.md, States). */
function getRowState({ connectionStatus, value }: SpaceCardReading): RowState {
  if (connectionStatus === "disconnected") return "disconnected";
  if (value === null) return "loading";
  if (connectionStatus === "stale") return "stale";
  return "connected";
}

/** One Space at a glance: its name, its Faults and one row per Metric. Takes props only, never fetches data. */
export function SpaceCard({ name, readings, faults }: SpaceCardProps) {
  const nameId = useId();

  return (
    <div role="group" aria-labelledby={nameId} className={styles.root}>
      <span id={nameId} className={styles.name} title={name}>
        {name}
      </span>
      {faults && faults.length > 0 && (
        // role="list": Safari stops treating a list as a list once its bullets are removed.
        <ul role="list" className={styles.faults}>
          {faults.map((fault, index) => (
            <li key={`${fault.faultCode}-${fault.metric ?? "module"}-${index}`}>
              <DeviceFaultStatus {...fault} />
            </li>
          ))}
        </ul>
      )}
      <ul role="list" className={styles.readings}>
        {readings.map((reading) => {
          const state = getRowState(reading);
          const hasValue = state === "connected" || state === "stale";
          return (
            <li key={reading.metric} data-state={state} className={styles.row}>
              <SensorLabel metric={reading.metric} size="xs" />
              <span className={styles.reading}>
                {state === "stale" && <DeviceConnectionStatus status="stale" />}
                <ReadingValue
                  value={reading.value}
                  isDisconnected={state === "disconnected"}
                  fractionDigits={reading.fractionDigits ?? 1}
                  size="sm"
                />
                {/* Without a value, screen readers skip the Unit: "Disconnected degrees Celsius" would sound like a value. */}
                <span
                  aria-hidden={hasValue ? undefined : "true"}
                  className={styles.unit}
                >
                  <UnitLabel unit={reading.unit} size="sm" />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
