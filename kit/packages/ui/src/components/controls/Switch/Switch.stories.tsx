import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Controls/Switch",
  component: Switch,
  args: {
    ariaLabel: "Heating",
    isOn: false,
    isDisabled: false,
    onChange: () => {},
  },
  // Storybook doesn't keep the value, so this wrapper does: clicking the switch really flips it.
  render: function Render(args) {
    const [isOn, setIsOn] = useState(args.isOn);
    return <Switch {...args} isOn={isOn} onChange={setIsOn} />;
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state.
export const Off: Story = {};

export const On: Story = {
  args: { isOn: true },
};

export const DisabledOff: Story = {
  args: { isDisabled: true },
};

export const DisabledOn: Story = {
  args: { isOn: true, isDisabled: true },
};

// The longer text ("Off") in a narrow frame: the text stays on one line. The screen-reader name is long on purpose.
export const LongText: Story = {
  args: { ariaLabel: "Underfloor heating in the kitchen and dining area" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "var(--shk-size-20)" }}>
        <Story />
      </div>
    ),
  ],
};

// The smallest case: only the required props.
export const Minimal: Story = {
  args: { isOn: true, ariaLabel: "Light" },
};
