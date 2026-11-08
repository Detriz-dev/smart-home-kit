import { useId } from "react";
import { Icon } from "../../../icons/Icon";
import { READING_STATUS_ICONS } from "../../../icons/purposeIcons";
import { Switch } from "../Switch";
import styles from "./PowerControl.module.css";
import type { PowerControlProps } from "./PowerControl.types";

/** The message under the switch, if any: its text, colour and icon. */
interface Message {
  text: string;
  tone: "secondary" | "danger";
  icon?: "loading" | "fault";
}

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
  let message: Message | null = null;
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
    const what = command.command === "turn-on" ? "turn on" : "turn off";
    message = {
      text: `Couldn't ${what}. ${command.failureMessage ?? "The device didn't respond."}`,
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
    <div className={styles.root}>
      <div className={styles.row}>
        <span className={styles.name} title={name}>
          {name}
        </span>
        {status ? (
          <span data-status={status} className={styles.status}>
            <Icon
              name={READING_STATUS_ICONS[status]}
              label={status === "loading" ? "Loading" : "Disconnected"}
              size="sm"
            />
          </span>
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
      {/* Always rendered, so screen readers announce "Turning on…" and failures when they appear. */}
      <div
        id={messageId}
        role="status"
        data-tone={message?.tone}
        className={styles.message}
      >
        {message?.icon && (
          <span data-icon={message.icon} className={styles.messageIcon}>
            <Icon name={READING_STATUS_ICONS[message.icon]} size="xs" />
          </span>
        )}
        {message?.text}
      </div>
    </div>
  );
}
