import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Controls/Button",
  component: Button,
  args: {
    children: "Send prompt",
    variant: "secondary",
    size: "md",
    isDisabled: false,
    onClick: () => {},
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger"] },
    size: { control: "select", options: ["md", "sm"] },
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

// Small (32px), for compact places such as the "View" action in AlertBanner.
export const Small: Story = {
  args: { children: "View", size: "sm" },
};

export const SmallPrimary: Story = {
  args: { children: "View", size: "sm", variant: "primary" },
};

// Danger: a destructive action, e.g. unpairing a Module.
export const Danger: Story = {
  args: { children: "Unpair Module", variant: "danger" },
};

export const DangerSmall: Story = {
  args: { children: "Unpair", variant: "danger", size: "sm" },
};

// An icon on the left of the text: 20px on md, 16px on sm, in the text's colour.
export const WithIcon: Story = {
  args: { children: "Add Alert Rule", icon: "add" },
};

export const PrimaryWithIcon: Story = {
  args: { children: "Add Alert Rule", icon: "add", variant: "primary" },
};

export const DangerWithIcon: Story = {
  args: { children: "Unpair Module", icon: "link_off", variant: "danger" },
};

export const SmallWithIcon: Story = {
  args: { children: "Add", icon: "add", size: "sm" },
};

export const DangerDisabled: Story = {
  args: {
    children: "Unpair Module",
    icon: "link_off",
    variant: "danger",
    isDisabled: true,
  },
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
