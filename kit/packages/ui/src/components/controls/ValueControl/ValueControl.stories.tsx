import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { ValueControl } from "./ValueControl";
import type { ValueControlCommand } from "./ValueControl.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: the heating Setpoint, 22 °C, 0–30 in steps of 0.5.
const meta = {
  title: "Controls/ValueControl",
  component: ValueControl,
  args: {
    name: "Setpoint",
    value: 22,
    unit: "celsius",
    min: 0,
    max: 30,
    step: 0.5,
    fractionDigits: 1,
    input: "stepper",
    onCommit: fn(),
    isDisconnected: false,
    isViewOnly: false,
  },
  argTypes: {
    input: { control: "inline-radio", options: ["stepper", "slider"] },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "280px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ValueControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Figma variant (input × state).
export const Setpoint: Story = {};

// The blinds Position: a slider, 0–100 %.
export const Position: Story = {
  args: {
    name: "Position",
    value: 40,
    unit: "percent",
    min: 0,
    max: 100,
    step: 1,
    fractionDigits: 0,
    input: "slider",
  },
};

// At the top of the range: + is disabled.
export const AtMax: Story = {
  args: { value: 30 },
};

export const Pending: Story = {
  args: { command: { value: 23, status: "pending" } },
};

export const ViewOnly: Story = {
  args: { isViewOnly: true },
};

export const Failed: Story = {
  args: { command: { value: 23, status: "failed" } },
};

export const Loading: Story = {
  args: { value: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// Try it: press + a few times. The value shows as a draft, then one command goes out after a second, and the "Device" confirms it.
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(22);
    const [command, setCommand] = useState<ValueControlCommand>();
    const commit = (next: number) => {
      setCommand({ value: next, status: "pending" });
      setTimeout(() => {
        setValue(next);
        setCommand({ value: next, status: "confirmed" });
      }, 1000);
    };
    return (
      <ValueControl
        {...args}
        value={value}
        command={command}
        onCommit={commit}
      />
    );
  },
};

// Stress story: a long name and a failure in a narrow container. The name is shortened with "…"; the value never is.
export const LongText: Story = {
  args: {
    name: "Bedroom heating setpoint for the night",
    command: { value: 23, status: "failed" },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "240px" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { value: 20 },
};
