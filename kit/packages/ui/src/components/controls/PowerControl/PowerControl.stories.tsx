import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import type { CommandOf } from "../../../types/command";
import { PowerControl } from "./PowerControl";
import type { PowerControlCommand } from "./PowerControl.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: socket 1 of a power strip, the Desk lamp, On.
const meta = {
  title: "Controls/PowerControl",
  component: PowerControl,
  args: {
    name: "Desk lamp",
    state: "on",
    allowedCommands: ["turn-on", "turn-off"],
    onCommand: fn(),
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
} satisfies Meta<typeof PowerControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const On: Story = {};

export const Off: Story = {
  args: { name: "Monitor", state: "off" },
};

// The command is on its way: the switch keeps the reported value and is disabled.
export const PendingOn: Story = {
  args: { state: "off", command: { command: "turn-on", status: "pending" } },
};

export const ViewOnly: Story = {
  args: { isViewOnly: true },
};

// Only Turn off is allowed, and it's Off: nothing to do from the app.
export const TurnOffOnly: Story = {
  args: { name: "Power", state: "off", allowedCommands: ["turn-off"] },
};

export const Failed: Story = {
  args: { state: "off", command: { command: "turn-on", status: "failed" } },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// Try it: flips go Pending, then the "Device" reports the new value after a second.
export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<"on" | "off">("off");
    const [command, setCommand] = useState<PowerControlCommand>();
    const send = (next: CommandOf<"power">) => {
      setCommand({ command: next, status: "pending" });
      setTimeout(() => {
        setState(next === "turn-on" ? "on" : "off");
        setCommand({ command: next, status: "confirmed" });
      }, 1000);
    };
    return (
      <PowerControl
        {...args}
        state={state}
        command={command}
        onCommand={send}
      />
    );
  },
};

// A power strip: one PowerControl per socket, as in a DeviceCard.
export const PowerStrip: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--shk-space-3)" }}>
      <PowerControl {...args} name="Desk lamp" state="on" />
      <PowerControl {...args} name="Monitor" state="off" />
      <PowerControl
        {...args}
        name="Socket 3"
        state="off"
        command={{ command: "turn-on", status: "pending" }}
      />
      <PowerControl
        {...args}
        name="Socket 4"
        state="off"
        command={{ command: "turn-on", status: "failed" }}
      />
    </div>
  ),
};

// Stress story: a long name and a long failure message in a narrow container. The name is shortened with "…"; the message wraps.
export const LongText: Story = {
  args: {
    name: "Socket 4 · Bedside lamp on the left",
    state: "off",
    command: {
      command: "turn-on",
      status: "failed",
      failureMessage: "The power strip refused the command.",
    },
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
  args: { name: "Power" },
};
