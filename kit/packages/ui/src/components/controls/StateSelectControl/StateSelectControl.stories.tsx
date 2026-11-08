import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import type { StateOf } from "../../../types/state";
import { StateSelectControl } from "./StateSelectControl";
import type { StateSelectControlCommand } from "./StateSelectControl.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: the heating Mode, Heat.
const meta = {
  title: "Controls/StateSelectControl",
  component: StateSelectControl,
  args: {
    name: "Mode",
    metric: "mode",
    state: "heat",
    onSelect: fn(),
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
} satisfies Meta<typeof StateSelectControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Heat: Story = {};

export const Off: Story = {
  args: { state: "off" },
};

export const Pending: Story = {
  args: { state: "off", command: { state: "heat", status: "pending" } },
};

export const ViewOnly: Story = {
  args: { isViewOnly: true },
};

export const Failed: Story = {
  args: { state: "off", command: { state: "heat", status: "failed" } },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// Try it: picking an option goes Pending, then the "Device" reports it.
export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<StateOf<"mode">>("off");
    const [command, setCommand] = useState<StateSelectControlCommand>();
    const select = (next: StateOf<"mode">) => {
      setCommand({ state: next, status: "pending" });
      setTimeout(() => {
        setState(next);
        setCommand({ state: next, status: "confirmed" });
      }, 1000);
    };
    return (
      <StateSelectControl
        {...args}
        state={state}
        command={command}
        onSelect={select}
      />
    );
  },
};

// Stress story: a long name in a narrow container. The options move under the name.
export const LongText: Story = {
  args: {
    name: "Heating mode in the children's bedroom",
    state: "off",
    command: { state: "heat", status: "pending" },
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
  args: { state: "off" },
};
