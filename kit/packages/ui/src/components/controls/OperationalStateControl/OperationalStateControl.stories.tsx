import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import type {
  OperationalCommand,
  OperationalState,
} from "../../../types/operationalState";
import { OperationalStateControl } from "./OperationalStateControl";
import type { OperationalStateControlCommand } from "./OperationalStateControl.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: a washing machine that allows all four commands, Running · Washing.
const meta = {
  title: "Controls/OperationalStateControl",
  component: OperationalStateControl,
  args: {
    name: "Washing machine",
    state: "running",
    phase: "Washing",
    allowedCommands: ["start", "pause", "resume", "stop"],
    onCommand: fn(),
    isPoweredOff: false,
    isDisconnected: false,
    isViewOnly: false,
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "280px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OperationalStateControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Stopped: Story = {
  args: { state: "stopped", phase: undefined },
};

export const Running: Story = {};

export const Paused: Story = {
  args: { state: "paused", phase: undefined },
};

export const ErrorReason: Story = {
  args: {
    state: "error",
    phase: undefined,
    errorReason: { code: "door-open", label: "Door open" },
  },
};

export const Pending: Story = {
  args: { command: { command: "stop", status: "pending" } },
};

export const ViewOnly: Story = {
  args: { isViewOnly: true },
};

export const PoweredOff: Story = {
  args: { state: "stopped", phase: undefined, isPoweredOff: true },
};

export const Failed: Story = {
  args: {
    state: "stopped",
    phase: undefined,
    command: { command: "start", status: "failed" },
  },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// A kettle that allows Start and Stop: while Running, Start is disabled.
export const KettleRunning: Story = {
  args: {
    name: "Kettle",
    phase: "Heating",
    allowedCommands: ["start", "stop"],
  },
};

// A kettle that can only be stopped, while Stopped: one disabled Stop.
export const KettleStopOnly: Story = {
  args: {
    name: "Kettle",
    state: "stopped",
    phase: undefined,
    allowedCommands: ["stop"],
  },
};

// Try it with the keyboard: Start, then Pause. When the pressed button gets disabled, focus moves to the first enabled one.
export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<OperationalState>("stopped");
    const [command, setCommand] = useState<OperationalStateControlCommand>();
    const send = (next: OperationalCommand) => {
      setCommand({ command: next, status: "pending" });
      setTimeout(() => {
        const after: Record<OperationalCommand, OperationalState> = {
          start: "running",
          resume: "running",
          pause: "paused",
          stop: "stopped",
        };
        setState(after[next]);
        setCommand({ command: next, status: "confirmed" });
      }, 1000);
    };
    return (
      <OperationalStateControl
        {...args}
        state={state}
        phase={state === "running" ? "Washing" : undefined}
        command={command}
        onCommand={send}
      />
    );
  },
};

// Stress story: a long name and a long Error Reason in a narrow container. The name is shortened with "…"; the reason wraps.
export const LongText: Story = {
  args: {
    name: "Kettle in the office kitchen on the second floor",
    state: "error",
    phase: undefined,
    errorReason: {
      code: "unable-to-start-or-resume",
      faultCode: "sensor_failure",
    },
    allowedCommands: ["start", "stop"],
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "200px" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: {
    name: "Kettle",
    state: "stopped",
    phase: undefined,
    allowedCommands: ["start", "stop"],
  },
};
