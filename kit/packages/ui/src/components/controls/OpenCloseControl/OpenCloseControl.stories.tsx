import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import type { CommandOf } from "../../../types/command";
import type { StateOf } from "../../../types/state";
import { OpenCloseControl } from "./OpenCloseControl";
import type { OpenCloseControlCommand } from "./OpenCloseControl.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: the Living room blinds, Closed, all three commands.
const meta = {
  title: "Controls/OpenCloseControl",
  component: OpenCloseControl,
  args: {
    name: "Living room blinds",
    state: "closed",
    allowedCommands: ["open", "stop", "close"],
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
} satisfies Meta<typeof OpenCloseControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Closed: Story = {};

export const Opening: Story = {
  args: { state: "opening" },
};

export const Open: Story = {
  args: { state: "open" },
};

export const Closing: Story = {
  args: { state: "closing" },
};

export const Pending: Story = {
  args: { command: { command: "open", status: "pending" } },
};

export const ViewOnly: Story = {
  args: { state: "open", isViewOnly: true },
};

export const Failed: Story = {
  args: { command: { command: "open", status: "failed" } },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// A Device without Stop: the button isn't shown at all.
export const NoStop: Story = {
  args: { name: "Bedroom blinds", allowedCommands: ["open", "close"] },
};

// Try it: Open → Pending → Opening → Open, as a real blind would report it.
export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<StateOf<"open-close">>("closed");
    const [command, setCommand] = useState<OpenCloseControlCommand>();
    const send = (next: CommandOf<"open-close">) => {
      setCommand({ command: next, status: "pending" });
      setTimeout(() => {
        setCommand({ command: next, status: "confirmed" });
        if (next === "stop") return;
        setState(next === "open" ? "opening" : "closing");
        setTimeout(() => setState(next === "open" ? "open" : "closed"), 2000);
      }, 800);
    };
    return (
      <OpenCloseControl
        {...args}
        state={state}
        command={command}
        onCommand={send}
      />
    );
  },
};

// Stress story: a long name and a failure in a narrow container. The name is shortened with "…"; the buttons and message wrap.
export const LongText: Story = {
  args: {
    name: "Bedroom blackout blinds by the balcony door",
    command: { command: "open", status: "failed" },
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
  args: { name: "Blinds", state: "open", allowedCommands: ["close"] },
};
