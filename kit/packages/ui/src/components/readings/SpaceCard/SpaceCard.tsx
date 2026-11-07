import { useId } from "react";
import { AssetLabel } from "../../context/AssetLabel";
import { SensorLabel } from "../../context/SensorLabel";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { DeviceFaultStatus } from "../../status/DeviceFaultStatus";
import { DetectionStatus } from "../DetectionStatus";
import { ReadingValue } from "../ReadingValue";
import { StateValue } from "../StateValue";
import { UnitLabel } from "../UnitLabel";
import styles from "./SpaceCard.module.css";
import type {
  SpaceCardProps,
  SpaceCardReading,
  SpaceCardStateReading,
} from "./SpaceCard.types";
import type { DetectionMetric } from "../../../types/metric";

/** Which version of a row to draw. Only used inside this file, for the data attribute. */
type RowState = "connected" | "loading" | "stale" | "disconnected";

/** Works out a row's state from its own Module, first match wins (see SpaceCard.md, States). */
function getRowState(reading: SpaceCardReading): RowState {
  const { connectionStatus } = reading;
  const latest = "state" in reading ? reading.state : reading.value;
  if (connectionStatus === "disconnected") return "disconnected";
  if (latest === null) return "loading";
  if (connectionStatus === "stale") return "stale";
  return "connected";
}

const DETECTION_METRICS: ReadonlySet<string> = new Set<DetectionMetric>([
  "motion",
  "smoke",
  "co",
]);

/** A unique key for a row: the Metric, plus the Asset's name, so two Contact rows (front door, back window) differ. */
function rowKey(reading: SpaceCardReading): string {
  return "state" in reading && reading.asset
    ? `${reading.metric}-${reading.asset.name}`
    : reading.metric;
}

/** The right-hand side of a State row: DetectionStatus when there's a Detection time to show, StateValue otherwise. */
function StateRowValue({
  reading,
  isDisconnected,
}: {
  reading: SpaceCardStateReading;
  isDisconnected: boolean;
}) {
  const { connectionStatus, asset, detectedSince, lastDetectedAt, ...value } =
    reading;
  if (
    DETECTION_METRICS.has(reading.metric) &&
    (detectedSince || lastDetectedAt)
  ) {
    return (
      <DetectionStatus
        metric={reading.metric as DetectionMetric}
        state={reading.state as "detected" | "clear" | null}
        detectedSince={detectedSince}
        lastDetectedAt={lastDetectedAt}
        alertLevel={reading.alertLevel}
        isDisconnected={isDisconnected}
      />
    );
  }
  return <StateValue {...value} isDisconnected={isDisconnected} />;
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
          if ("state" in reading) {
            return (
              <li
                key={rowKey(reading)}
                data-state={state}
                className={styles.row}
              >
                {reading.asset ? (
                  <AssetLabel
                    name={reading.asset.name}
                    assetType={reading.asset.assetType}
                    size="xs"
                  />
                ) : (
                  <SensorLabel metric={reading.metric} size="xs" />
                )}
                <span className={styles.reading}>
                  {state === "stale" && (
                    <DeviceConnectionStatus status="stale" />
                  )}
                  <StateRowValue
                    reading={reading}
                    isDisconnected={state === "disconnected"}
                  />
                </span>
              </li>
            );
          }
          return (
            <li key={rowKey(reading)} data-state={state} className={styles.row}>
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
