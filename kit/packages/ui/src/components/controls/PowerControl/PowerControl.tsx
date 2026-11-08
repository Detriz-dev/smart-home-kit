import { useId } from "react";
import {
  ControlMessage,
  type ControlMessageData,
  ControlStatusIcon,
  controlStyles as styles,
  failedText,
} from "../ControlParts";
import { Switch } from "../Switch";
import type { PowerControlProps } from "./PowerControl.types";

/** Turns one Power Control of a Device on or off. Always shows the reported value; says when a command is on its way or failed. Wraps Switch. Takes props only, never sends commands itself. */
export function PowerControl({
  name,
  state,
  allowedCommands,
  onCommand,
  command,
  isDisconnected = false,
  isViewOnly = false,
}: PowerControlProps) {
  const messageId = useId();
  const isOn = state === "on";
  // The command flipping the switch would send. It must be an Allowed Command (Data model rule 29).
  const flip = isOn ? "turn-off" : "turn-on";
  const isPending = command?.status === "pending";
  const isAllowed = allowedCommands.includes(flip);

  // First match wins, as in the spec's States table.
  let message: ControlMessageData | null = null;
  if (isDisconnected || state === null) {
    message = null;
  } else if (isPending) {
    message = {
      text: command.command === "turn-on" ? "Turning on…" : "Turning off…",
      tone: "secondary",
      icon: "loading",
    };
  } else if (isViewOnly) {
    message = { text: "View only", tone: "secondary" };
  } else if (!isAllowed) {
    message = {
      text:
        flip === "turn-on"
          ? "Can't be turned on from the app"
          : "Can't be turned off from the app",
      tone: "secondary",
    };
  } else if (command?.status === "failed") {
    const verb = command.command === "turn-on" ? "turn on" : "turn off";
    message = {
      text: failedText(verb, command.failureMessage),
      tone: "danger",
      icon: "fault",
    };
  }

  const isDisabled = isPending || isViewOnly || !isAllowed;
  const status = isDisconnected
    ? "disconnected"
    : state === null
      ? "loading"
      : null;

  return (
    <div data-gap="tight" className={styles.root}>
      <div className={styles.row}>
        <span className={styles.name} title={name}>
          {name}
        </span>
        {status ? (
          <ControlStatusIcon status={status} />
        ) : (
          <Switch
            isOn={isOn}
            onChange={(next) => onCommand(next ? "turn-on" : "turn-off")}
            ariaLabel={name}
            ariaDescribedBy={message ? messageId : undefined}
            isDisabled={isDisabled}
          />
        )}
      </div>
      <ControlMessage id={messageId} message={message} />
    </div>
  );
}
