import { RelativeTime } from "../../context/RelativeTime";
import { StateValue, type StateValueReading } from "../StateValue";
import styles from "./DetectionStatus.module.css";
import type { DetectionStatusProps } from "./DetectionStatus.types";

/** Motion, Smoke or CO: the latest State and when, e.g. "Detected · since 14:02 · 3 min". Takes props only, never fetches data. */
export function DetectionStatus({
  metric,
  state,
  detectedSince,
  lastDetectedAt,
  isDisconnected = false,
  alertLevel,
  now,
  size = "md",
}: DetectionStatusProps) {
  // Detection Metrics all have the States detected/clear, so the pair always matches.
  const reading = { metric, state } as StateValueReading;
  const timeSize = size === "lg" ? "sm" : "xs";
  const showTime = !isDisconnected && state !== null;

  return (
    <span data-size={size} className={styles.root}>
      <StateValue
        {...reading}
        isDisconnected={isDisconnected}
        alertLevel={alertLevel}
        size={size}
      />
      {showTime && state === "detected" && detectedSince && (
        <span data-size={size} className={styles.time}>
          since{" "}
          <RelativeTime
            time={detectedSince}
            format="clock"
            now={now}
            size={timeSize}
          />
          <span aria-hidden="true"> · </span>
          <RelativeTime
            time={detectedSince}
            format="duration"
            now={now}
            size={timeSize}
          />
        </span>
      )}
      {showTime && state === "clear" && (
        <span data-size={size} className={styles.time}>
          {lastDetectedAt ? (
            <>
              Last:{" "}
              <RelativeTime time={lastDetectedAt} now={now} size={timeSize} />
            </>
          ) : (
            "None yet"
          )}
        </span>
      )}
    </span>
  );
}
