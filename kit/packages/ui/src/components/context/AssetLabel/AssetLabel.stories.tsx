import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AssetType } from "../../../types/assetType";
import { AssetLabel } from "./AssetLabel";
import type { AssetLabelSize } from "./AssetLabel.types";

const ASSET_TYPES: AssetType[] = [
  "plant",
  "tap",
  "door",
  "window",
  "appliance",
];
const SIZES: AssetLabelSize[] = ["xs", "sm", "md", "lg"];

/** A realistic name for each Asset Type. */
const NAMES: Record<AssetType, string> = {
  plant: "Office plant",
  tap: "Kitchen tap",
  door: "Front door",
  window: "Bedroom window",
  appliance: "Washing machine",
};

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec (Front door, the default size), matching Figma.
const meta = {
  title: "Context/AssetLabel",
  component: AssetLabel,
  args: {
    name: "Front door",
    assetType: "door",
    size: "xs",
  },
  argTypes: {
    assetType: { control: "select", options: ASSET_TYPES },
    size: { control: "select", options: SIZES },
  },
} satisfies Meta<typeof AssetLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default: a Front door, xs.
export const Default: Story = {};

// A Power Sensor watches an Appliance.
export const Appliance: Story = {
  args: { name: "Washing machine", assetType: "appliance", size: "sm" },
};

export const Large: Story = {
  args: { name: "Bedroom window", assetType: "window", size: "lg" },
};

// Every size, matching the Figma variants.
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        justifyItems: "start",
        gap: "var(--shk-space-2)",
      }}
    >
      {SIZES.map((size) => (
        <AssetLabel key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

// Every Asset Type with its icon, matching the Figma examples frame.
export const AllAssetTypes: Story = {
  args: { size: "sm" },
  render: (args) => (
    <div
      style={{
        display: "grid",
        justifyItems: "start",
        gap: "var(--shk-space-2)",
      }}
    >
      {ASSET_TYPES.map((assetType) => (
        <AssetLabel
          key={assetType}
          size={args.size}
          assetType={assetType}
          name={NAMES[assetType]}
        />
      ))}
    </div>
  ),
};

// Stress story: a long name in a narrow container. The name ends with "…"; the icon keeps its size.
export const LongText: Story = {
  args: {
    name: "Grandma's old washing machine in the cellar",
    assetType: "appliance",
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 2)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { name: "Tap", assetType: "tap" },
};
