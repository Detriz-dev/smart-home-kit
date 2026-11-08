import { useEffect, useId, useRef, useState } from "react";
import { formatReadingValue } from "../../../utils/formatReadingValue";
import { UNIT_NAMES } from "../../../utils/unitNames";
import { UnitLabel } from "../../readings/UnitLabel";
import {
  ControlMessage,
  type ControlMessageData,
  ControlStatusIcon,
  controlStyles,
  failedText,
} from "../ControlParts";
import { IconButton } from "../IconButton";
import styles from "./ValueControl.module.css";
import type { ValueControlProps } from "./ValueControl.types";

/** How long to wait after the last − / + press (or arrow key) before sending. */
const COMMIT_DELAY_MS = 1000;

/** Keeps a value inside the range and on the step (Data model rule 30). */
function snap(value: number, min: number, max: number, step: number) {
  const stepped = min + Math.round((value - min) / step) * step;
  // Round away floating-point noise (0.1 + 0.2), then keep it inside the range.
  const clean = Number(stepped.toFixed(10));
  return Math.min(max, Math.max(min, clean));
}

/** Sets a number in a range, like a heating Setpoint or a blinds Position. Keeps the user's choice as a draft and sends it once. Takes props only, never sends commands itself. */
export function ValueControl({
  name,
  value,
  unit,
  min,
  max,
  step,
  onCommit,
  input = "stepper",
  fractionDigits = 0,
  command,
  isDisconnected = false,
  isViewOnly = false,
}: ValueControlProps) {
  const nameId = useId();
  const messageId = useId();
  // The user's choice, not sent yet. `null` when there is none: then the reported value shows.
  const [draft, setDraft] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Never leave a timer running after the component is gone.
  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = (next: number | null) => {
    clearTimeout(timer.current);
    setDraft(null);
    // Nothing to send if the user came back to the reported value.
    if (next !== null && next !== value) onCommit(next);
  };
  const choose = (next: number, sendNow = false) => {
    const snapped = snap(next, min, max, step);
    setDraft(snapped);
    clearTimeout(timer.current);
    if (sendNow) commit(snapped);
    else timer.current = setTimeout(() => commit(snapped), COMMIT_DELAY_MS);
  };

  const isPending = command?.status === "pending";
  const status = isDisconnected
    ? "disconnected"
    : value === null
      ? "loading"
      : null;
  const symbol = UNIT_NAMES[unit].symbol;
  const format = (v: number) => formatReadingValue(v, fractionDigits);

  let message: ControlMessageData | null = null;
  if (status) {
    message = null;
  } else if (isPending) {
    message = {
      text: `Setting to ${format(command.value)} ${symbol}…`,
      tone: "secondary",
      icon: "loading",
    };
  } else if (isViewOnly) {
    message = { text: "View only", tone: "secondary" };
  } else if (command?.status === "failed") {
    message = {
      text: failedText(
        `set ${format(command.value)} ${symbol}`,
        command.failureMessage,
      ),
      tone: "danger",
      icon: "fault",
    };
  }

  const isDisabled = isPending || isViewOnly;
  const current = draft ?? value ?? min;
  const describedBy = message ? messageId : undefined;

  // The value and its Unit. A draft is marked as "not sent yet".
  const shownValue = (
    <output
      aria-live="polite"
      data-draft={draft !== null}
      className={styles.value}
    >
      <span className={styles.number}>{format(current)}</span>
      <UnitLabel unit={unit} size="sm" />
    </output>
  );

  return (
    <div
      data-gap={input === "stepper" ? "tight" : undefined}
      className={controlStyles.root}
    >
      <div className={controlStyles.row}>
        <span id={nameId} className={controlStyles.name} title={name}>
          {name}
        </span>
        {status ? (
          <ControlStatusIcon status={status} />
        ) : input === "stepper" ? (
          <div className={styles.stepper}>
            <IconButton
              icon="remove"
              label={`Decrease ${name}`}
              variant="secondary"
              isDisabled={isDisabled || current <= min}
              onClick={() => choose(current - step)}
            />
            {shownValue}
            <IconButton
              icon="add"
              label={`Increase ${name}`}
              variant="secondary"
              isDisabled={isDisabled || current >= max}
              onClick={() => choose(current + step)}
            />
          </div>
        ) : (
          shownValue
        )}
      </div>
      {!status && input === "slider" && (
        <input
          type="range"
          className={styles.slider}
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={isDisabled}
          aria-labelledby={nameId}
          aria-describedby={describedBy}
          aria-valuetext={`${format(current)} ${UNIT_NAMES[unit].spokenName}`}
          onChange={(e) => choose(Number(e.target.value))}
          // Releasing the slider, or Enter, sends at once; arrow keys wait for the user to stop.
          onPointerUp={(e) => choose(Number(e.currentTarget.value), true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") choose(current, true);
          }}
        />
      )}
      <ControlMessage id={messageId} message={message} />
    </div>
  );
}
