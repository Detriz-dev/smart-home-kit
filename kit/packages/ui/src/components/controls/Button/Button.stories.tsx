import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Controls/Button",
  component: Button,
  args: {
    children: "Send prompt",
    variant: "secondary",
    isDisabled: false,
    onClick: () => {},
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant. Hover, pressed and focus come from the browser: point at a button, click it, or press Tab.
export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Retry" },
};

// Disabled, e.g. "Send prompt" while a screen builds.
export const Disabled: Story = {
  args: { variant: "primary", isDisabled: true },
};

export const DisabledSecondary: Story = {
  args: { children: "Retry", isDisabled: true },
};

// The longest realistic clarifying answer (a Space name) in a 120px box: the text wraps onto a second line.
export const LongText: Story = {
  args: { children: "Open-plan desk zone" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "120px" }}>
        <Story />
      </div>
    ),
  ],
};

// The smallest case: a one-word action with only the required props.
export const Minimal: Story = {
  args: { children: "Undo" },
};
