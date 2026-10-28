import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeviceConnectionStatus } from "./DeviceConnectionStatus";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Status/DeviceConnectionStatus",
  component: DeviceConnectionStatus,
  args: { status: "disconnected" },
  // Show `status` as a dropdown of the four Connection Statuses in the Controls panel.
  argTypes: {
    status: {
      control: "select",
      options: ["disconnected", "connecting", "connected", "stale"],
    },
  },
} satisfies Meta<typeof DeviceConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Connection Status, from the device lifecycle.
export const Disconnected: Story = {};

export const Connecting: Story = {
  args: { status: "connecting" },
};

export const Connected: Story = {
  args: { status: "connected" },
};

export const Stale: Story = {
  args: { status: "stale" },
};

// Stress story: the longest label ("Disconnected") in a 96px container.
// The dashed box is the container: the label stays on one line and the indicator keeps its size.
export const LongText: Story = {
  args: { status: "disconnected" },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "var(--shk-size-24)",
          outline:
            "var(--shk-border-width-thin) dashed var(--shk-status-neutral-border)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Stress story: the shortest label ("Stale").
export const Minimal: Story = {
  args: { status: "stale" },
};
