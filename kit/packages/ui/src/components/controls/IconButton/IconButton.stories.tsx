import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "../../navigation/TopBar";
import { IconButton } from "./IconButton";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values from IconButton.md (Refresh Readings, ghost).
const meta = {
  title: "Controls/IconButton",
  component: IconButton,
  args: {
    icon: "refresh",
    label: "Refresh Readings",
    variant: "ghost",
    isDisabled: false,
    onClick: () => {},
  },
  argTypes: {
    variant: { control: "select", options: ["ghost", "secondary"] },
    icon: { control: "select", options: ["refresh", "close", "settings"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant. Hover (blue icon), pressed (light-blue fill) and focus come from the browser:
// point at the button, click it, or press Tab. Point at it to see the label as a tooltip.
export const Ghost: Story = {};

export const Secondary: Story = {
  args: { icon: "settings", label: "Settings", variant: "secondary" },
};

// Disabled, e.g. Refresh while Readings are loading.
export const Disabled: Story = {
  args: { isDisabled: true },
};

export const DisabledSecondary: Story = {
  args: { isDisabled: true, variant: "secondary" },
};

// The main use: actions in a TopBar.
export const InTopBar: Story = {
  render: () => (
    <div style={{ inlineSize: "390px" }}>
      <TopBar
        title="Kitchen"
        icon="countertops"
        backHref="#/"
        actions={
          <>
            <IconButton
              icon="refresh"
              label="Refresh Readings"
              onClick={() => {}}
            />
            <IconButton icon="settings" label="Settings" onClick={() => {}} />
          </>
        }
      />
    </div>
  ),
};

// Stress story: a long label. The button keeps its size; the label only shows as the tooltip
// and is read by screen readers.
export const LongText: Story = {
  args: { label: "Refresh Readings for every Space on Level 2" },
};

// Stress story: the smallest case, Close.
export const Minimal: Story = {
  args: { icon: "close", label: "Close" },
};
