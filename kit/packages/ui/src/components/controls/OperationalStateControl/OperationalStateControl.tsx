import { useEffect, useId, useRef } from "react";
import type {
  OperationalCommand,
  OperationalState,
} from "../../../types/operationalState";
import { OperationalStateValue } from "../../readings/OperationalStateValue";
import { Button } from "../Button";
import {
  ControlMessage,
  type ControlMessageData,
  controlStyles as styles,
  failedText,
} from "../ControlParts";
import type { OperationalStateControlProps } from "./OperationalStateControl.types";

/** The commands that make sense in each Operational State, in the order they're shown. */
const COMMANDS_FOR: Record<OperationalState, OperationalCommand[]> = {
  stopped: ["start"],
  running: ["pause", "stop"],
  paused: ["resume", "stop"],
  error: ["stop"],
};

/** The button label and the Pending message of each command. */
const WORDS: Record<OperationalCommand, { label: string; pending: string }> = {
  start: { label: "Start", pending: "Starting…" },
  pause: { label: "Pause", pending: "Pausing…" },
  resume: { label: "Resume", pending: "Resuming…" },
  stop: { label: "Stop", pending: "Stopping…" },
};

/** Starts, pauses, resumes and stops the task of a Device that runs one, like a kettle or a washing machine. Shows its Operational State and the Allowed Commands that fit it. Takes props only, never sends commands itself. */
export function OperationalStateControl({
  name,
  state,
  phase,
  errorReason,
  allowedCommands,
  onCommand,
  command,
  isPoweredOff = false,
  isDisconnected = false,
  isViewOnly = false,
}: OperationalStateControlProps) {
  const messageId = useId();
  const actionsRef = useRef<HTMLDivElement>(null);
  // True while keyboard focus is inside the buttons, so it can be put back when they swap.
  const hadFocus = useRef(false);
  const isPending = command?.status === "pending";
  const showsButtons = !isDisconnected && state !== null;

  // Only Allowed Commands that fit the State; no Start while the Power is Off.
  const commands = showsButtons
    ? COMMANDS_FOR[state].filter(
        (c) => allowedCommands.includes(c) && !(c === "start" && isPoweredOff),
      )
    : [];

  let message: ControlMessageData | null = null;
  if (!showsButtons) {
    message = null;
  } else if (isPending) {
    message = {
      text: WORDS[command.command].pending,
      tone: "secondary",
      icon: "loading",
    };
  } else if (isViewOnly) {
    message = { text: "View only", tone: "secondary" };
  } else if (isPoweredOff && state === "stopped") {
    message = { text: "Turn the power on to start", tone: "secondary" };
  } else if (command?.status === "failed") {
    message = {
      text: failedText(command.command, command.failureMessage),
      tone: "danger",
      icon: "fault",
    };
  }

  // When the buttons swap (Start → Pause, Stop), the focused button disappears. Put focus on the first new button, so keyboard users don't lose their place.
  useEffect(() => {
    const active = document.activeElement;
    if (hadFocus.current && (!active || active === document.body)) {
      actionsRef.current?.querySelector("button")?.focus();
    }
  }, [state]);

  return (
    <div className={styles.root}>
      <span className={styles.name} title={name}>
        {name}
      </span>
      <OperationalStateValue
        state={state}
        phase={phase}
        errorReason={errorReason}
        isDisconnected={isDisconnected}
      />
      {commands.length > 0 && (
        <div
          ref={actionsRef}
          role="group"
          aria-label={name}
          aria-describedby={message ? messageId : undefined}
          className={styles.actions}
          onFocus={() => {
            hadFocus.current = true;
          }}
          onBlur={(e) => {
            // Leaving to another element outside the buttons: stop tracking. A button that disappears blurs with no new target: keep tracking.
            if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
              hadFocus.current = false;
            }
          }}
        >
          {commands.map((c) => (
            <Button
              key={c}
              onClick={() => onCommand(c)}
              isDisabled={isPending || isViewOnly}
            >
              {WORDS[c].label}
            </Button>
          ))}
        </div>
      )}
      <ControlMessage id={messageId} message={message} />
    </div>
  );
}
