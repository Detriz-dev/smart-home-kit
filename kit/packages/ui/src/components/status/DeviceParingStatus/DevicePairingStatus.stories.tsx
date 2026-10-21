import type { Meta, StoryObj } from "@storybook/react-vite";
import { DevicePairingStatus } from "./DeviceParingStatus";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Status/DevicePairingStatus",
  component: DevicePairingStatus,
  args: { status: "unpaired" },
  // Show `status` as a dropdown of the three Pairing Statuses in the Controls panel.
  argTypes: {
    status: { control: "select", options: ["unpaired", "pairing", "paired"] },
  },
} satisfies Meta<typeof DevicePairingStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Pairing Status, from the device lifecycle.
export const Unpaired: Story = {};

export const Pairing: Story = {
  args: { status: "pairing" },
};

export const Paired: Story = {
  args: { status: "paired" },
};
