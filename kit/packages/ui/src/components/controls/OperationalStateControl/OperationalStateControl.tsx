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

/** The buttons, always in this order. The first one is Resume while Paused and Start otherwise, so the buttons never move. */
function commandsFor(state: OperationalState): OperationalCommand[] {
  return [state === "paused" ? "resume" : "start", "pause", "stop"];
}

/** Whether a command fits the State: Start when Stopped, Pause when Running, Resume when Paused, Stop unless already Stopped. */
function fits(command: OperationalCommand, state: OperationalState) {
  if (command === "start") return state === "stopped";
  if (command === "pause") return state === "running";
  if (command === "resume") return state === "paused";
  return state !== "stopped";
}

/** The button label and the Pending message of each command. */
const WORDS: Record<OperationalCommand, { label: string; pending: string }> = {
  start: { label: "Start", pending: "Starting…" },
  pause: { label: "Pause", pending: "Pausing…" },
  resume: { label: "Resume", pending: "Resuming…" },
  stop: { label: "Stop", pending: "Stopping…" },
};

/** Starts, pauses, resumes and stops the task of a Device that runs one, like a kettle or a washing machine. Shows its Operational State and every Allowed Command; the ones that don't fit the State are disabled. Takes props only, never sends commands itself. */
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
  // True while keyboard focus is inside the buttons, so it can be put back when the focused one gets disabled.
  const hadFocus = useRef(false);
  const isPending = command?.status === "pending";
  const showsButtons = !isDisconnected && state !== null;

  // Every Allowed Command is shown; a command the Device never allows isn't offered.
  const commands = showsButtons
    ? commandsFor(state).filter((c) => allowedCommands.includes(c))
    : [];
  // A command is usable only when it fits the State; no Start while the Power is Off.
  const isUsable = (c: OperationalCommand) =>
    state !== null &&
    fits(c, state) &&
    !(c === "start" && isPoweredOff) &&
    !isPending &&
    !isViewOnly;

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

  // After Start, the Start button gets disabled and loses focus. Put focus on the first usable button, so keyboard users don't lose their place.
  useEffect(() => {
    const active = document.activeElement;
    if (hadFocus.current && (!active || active === document.body)) {
      actionsRef.current
        ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus();
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
          className={`${styles.actions} ${styles.actionsFill}`}
          onFocus={() => {
            hadFocus.current = true;
          }}
          onBlur={(e) => {
            // Leaving to another element outside the buttons: stop tracking. A button that gets disabled blurs with no new target: keep tracking.
            if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
              hadFocus.current = false;
            }
          }}
        >
          {commands.map((c) => (
            <Button
              key={c}
              onClick={() => onCommand(c)}
              isDisabled={!isUsable(c)}
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
