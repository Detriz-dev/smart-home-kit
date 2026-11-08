import { useId } from "react";
import { Icon } from "../../../icons/Icon";
import { STATE_ICONS } from "../../../icons/purposeIcons";
import type { StateOf } from "../../../types/state";
import { ACTIVE_STATES, STATE_NAMES } from "../../../utils/stateNames";
import {
  ControlMessage,
  type ControlMessageData,
  ControlStatusIcon,
  controlStyles,
  failedText,
} from "../ControlParts";
import styles from "./StateSelectControl.module.css";
import type {
  StateSelectControlProps,
  StateSelectMetric,
} from "./StateSelectControl.types";

/** The options of each Metric, in the order they're shown. */
const OPTIONS: { [M in StateSelectMetric]: StateOf<M>[] } = {
  mode: ["off", "heat"],
};

/** Picks one of a few States of a State Control, like the heating Mode (Off, Heat). The selected option is the reported State. Takes props only, never sends commands itself. */
export function StateSelectControl({
  name,
  metric,
  state,
  onSelect,
  command,
  isDisconnected = false,
  isViewOnly = false,
}: StateSelectControlProps) {
  const nameId = useId();
  const messageId = useId();
  const isPending = command?.status === "pending";
  const status = isDisconnected
    ? "disconnected"
    : state === null
      ? "loading"
      : null;

  let message: ControlMessageData | null = null;
  if (status) {
    message = null;
  } else if (isPending) {
    message = {
      text: `Switching to ${STATE_NAMES[command.state]}…`,
      tone: "secondary",
      icon: "loading",
    };
  } else if (isViewOnly) {
    message = { text: "View only", tone: "secondary" };
  } else if (command?.status === "failed") {
    message = {
      text: failedText(
        `switch to ${STATE_NAMES[command.state]}`,
        command.failureMessage,
      ),
      tone: "danger",
      icon: "fault",
    };
  }

  const isDisabled = isPending || isViewOnly;
  const icons = STATE_ICONS[metric];

  return (
    <div data-gap="tight" className={controlStyles.root}>
      <div className={controlStyles.row}>
        <span id={nameId} className={controlStyles.name} title={name}>
          {name}
        </span>
        {status ? (
          <ControlStatusIcon status={status} />
        ) : (
          // Toggle buttons in a group: Tab moves between them, Enter or Space picks one. Picking sends a command, so arrows don't change it.
          <div
            role="group"
            aria-labelledby={nameId}
            aria-describedby={message ? messageId : undefined}
            className={styles.options}
          >
            {OPTIONS[metric].map((option) => {
              const isSelected = option === state;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={isDisabled}
                  data-active={ACTIVE_STATES.has(option)}
                  className={styles.option}
                  onClick={() => {
                    if (!isSelected) onSelect(option);
                  }}
                >
                  <Icon name={icons[option]} size="xs" />
                  {STATE_NAMES[option]}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <ControlMessage id={messageId} message={message} />
    </div>
  );
}
