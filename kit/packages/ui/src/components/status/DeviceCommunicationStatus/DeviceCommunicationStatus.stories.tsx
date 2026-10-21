import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeviceCommunicationStatus } from "./DeviceCommunicationStatus";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Status/DeviceCommunicationStatus",
  component: DeviceCommunicationStatus,
  args: { status: "disconnected" },
  // Show `status` as a dropdown of the four Connection Statuses in the Controls panel.
  argTypes: {
    status: {
      control: "select",
      options: ["disconnected", "connecting", "connected", "stale"],
    },
  },
} satisfies Meta<typeof DeviceCommunicationStatus>;

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
