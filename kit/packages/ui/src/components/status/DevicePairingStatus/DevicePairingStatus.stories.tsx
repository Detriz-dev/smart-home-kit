import type { Meta, StoryObj } from "@storybook/react-vite";
import { DevicePairingStatus } from "./DevicePairingStatus";

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

// Stress story: the longest label ("Unpaired") in a 96px container.
// The dashed box is the container: the label stays on one line and the indicator keeps its size.
export const LongText: Story = {
  args: { status: "unpaired" },
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

// Stress story: the shortest label ("Paired").
export const Minimal: Story = {
  args: { status: "paired" },
};
