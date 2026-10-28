import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocationPath } from "./LocationPath";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Context/LocationPath",
  component: LocationPath,
  args: {
    siteName: "My flat",
    floorName: "Level 2",
    spaceName: "Bedroom",
    deviceName: "Climate Module",
    layout: "inline",
  },
  // Show `layout` as a dropdown of the three layouts in the Controls panel.
  argTypes: {
    layout: { control: "select", options: ["inline", "grid", "stack"] },
  },
} satisfies Meta<typeof LocationPath>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per layout, matching the Figma variants.
export const Inline: Story = {};

export const Grid: Story = {
  args: { layout: "grid" },
};

export const Stack: Story = {
  args: { layout: "stack" },
};

// Which parts are shown: the parent passes only the names it needs.
export const NoFloor: Story = {
  args: { floorName: undefined },
};

export const UpToSpace: Story = {
  args: { deviceName: undefined },
};

export const SiteOnly: Story = {
  args: { floorName: undefined, spaceName: undefined, deviceName: undefined },
};

export const SpaceAndDevice: Story = {
  args: { siteName: undefined, floorName: undefined },
};

export const DeviceOnly: Story = {
  args: { siteName: undefined, floorName: undefined, spaceName: undefined },
};

// Grid with a part missing: the rest move up to fill the rows.
export const GridNoFloor: Story = {
  args: { layout: "grid", floorName: undefined },
};

// Stress story: the smallest case, one short part.
export const Minimal: Story = {
  args: {
    siteName: undefined,
    floorName: undefined,
    spaceName: undefined,
    deviceName: "Hub",
  },
};

// Stress story: long names end with "…" when there isn't enough room. The frame is narrow on purpose.
export const LongText: Story = {
  args: {
    siteName: "Grandparents' summer house by the lake",
    spaceName: "Kitchen and dining area on the ground floor",
    deviceName: "Air Quality Module next to the window",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "calc(var(--shk-size-24) * 4)",
          resize: "horizontal",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
