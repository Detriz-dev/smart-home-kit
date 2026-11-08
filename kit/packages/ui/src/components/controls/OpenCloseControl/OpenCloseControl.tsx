import { useId } from "react";
import type { CommandOf } from "../../../types/command";
import type { StateOf } from "../../../types/state";
import { StateValue } from "../../readings/StateValue";
import { Button } from "../Button";
import {
  ControlMessage,
  type ControlMessageData,
  controlStyles as styles,
  failedText,
} from "../ControlParts";
import type { OpenCloseControlProps } from "./OpenCloseControl.types";

type OpenCloseCommand = CommandOf<"open-close">;

/** The buttons, in this order: Stop sits between the two directions. */
const COMMANDS: {
  command: OpenCloseCommand;
  label: string;
  pending: string;
}[] = [
  { command: "open", label: "Open", pending: "Opening…" },
  { command: "stop", label: "Stop", pending: "Stopping…" },
  { command: "close", label: "Close", pending: "Closing…" },
];

/** Whether a command fits the reported State: Open when Closed or Closing, Close when Open or Opening, Stop while moving. */
function fits(command: OpenCloseCommand, state: StateOf<"open-close">) {
  if (command === "open") return state === "closed" || state === "closing";
  if (command === "close") return state === "open" || state === "opening";
  return state === "opening" || state === "closing";
}

/** Opens, closes or stops something that moves, like motorized blinds. Shows the reported State and the Device's Allowed Commands as buttons. Takes props only, never sends commands itself. */
export function OpenCloseControl({
  name,
  state,
  allowedCommands,
  onCommand,
  command,
  isDisconnected = false,
  isViewOnly = false,
}: OpenCloseControlProps) {
  const messageId = useId();
  const isPending = command?.status === "pending";
  const showsButtons = !isDisconnected && state !== null;

  // First match wins, as in the spec's States table.
  let message: ControlMessageData | null = null;
  if (!showsButtons) {
    message = null;
  } else if (isPending) {
    const pending = COMMANDS.find((c) => c.command === command.command);
    message = {
      text: pending?.pending ?? "",
      tone: "secondary",
      icon: "loading",
    };
  } else if (isViewOnly) {
    message = { text: "View only", tone: "secondary" };
  } else if (command?.status === "failed") {
    message = {
      text: failedText(command.command, command.failureMessage),
      tone: "danger",
      icon: "fault",
    };
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <span className={styles.name} title={name}>
          {name}
        </span>
        <StateValue
          metric="open-close"
          state={state}
          isDisconnected={isDisconnected}
        />
      </div>
      {showsButtons && (
        // A command the Device never allows isn't offered; one that doesn't fit the State is disabled.
        <div
          role="group"
          aria-label={name}
          aria-describedby={message ? messageId : undefined}
          className={`${styles.actions} ${styles.actionsFill}`}
        >
          {COMMANDS.filter((c) => allowedCommands.includes(c.command)).map(
            (c) => (
              <Button
                key={c.command}
                onClick={() => onCommand(c.command)}
                isDisabled={isPending || isViewOnly || !fits(c.command, state)}
              >
                {c.label}
              </Button>
            ),
          )}
        </div>
      )}
      <ControlMessage id={messageId} message={message} />
    </div>
  );
}
