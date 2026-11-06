import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SpaceType } from "../../../types/spaceType";
import { SpaceLabel } from "./SpaceLabel";
import type { SpaceLabelSize } from "./SpaceLabel.types";

const SPACE_TYPES: SpaceType[] = [
  "bedroom",
  "bathroom",
  "kitchen",
  "living-room",
  "hallway",
  "garage",
  "office",
  "meeting",
  "outdoor",
  "other",
];
const SIZES: SpaceLabelSize[] = ["xs", "sm", "md", "lg"];

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec's Example values (Kitchen, the default size).
const meta = {
  title: "Context/SpaceLabel",
  component: SpaceLabel,
  args: {
    name: "Kitchen",
    spaceType: "kitchen",
    size: "xs",
  },
  // Show `spaceType` and `size` as dropdowns in the Controls panel. `name` gets a text box.
  argTypes: {
    spaceType: { control: "select", options: SPACE_TYPES },
    size: { control: "select", options: SIZES },
  },
} satisfies Meta<typeof SpaceLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default: a Kitchen, xs.
export const Default: Story = {};

// The user's own name for the Space. The icon still comes from the Space Type.
export const OwnName: Story = {
  args: { name: "Anna's bedroom", spaceType: "bedroom", size: "sm" },
};

// The main heading of a detail view.
export const Large: Story = {
  args: { name: "Living room", spaceType: "living-room", size: "lg" },
};

// One story per Figma size variant, side by side.
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      {SIZES.map((size) => (
        <SpaceLabel key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

// Every Space Type with its icon, at the size picked in Controls. Names from the spec's Example values.
const NAMES: Record<SpaceType, string> = {
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  "living-room": "Living room",
  hallway: "Hallway",
  garage: "Garage",
  office: "Office",
  meeting: "Meeting room A",
  outdoor: "Balcony",
  other: "Storage room",
};

export const AllSpaceTypes: Story = {
  args: { size: "sm" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      {SPACE_TYPES.map((spaceType) => (
        <SpaceLabel
          key={spaceType}
          size={args.size}
          spaceType={spaceType}
          name={NAMES[spaceType]}
        />
      ))}
    </div>
  ),
};

// Stress story: a long name in a 200px container. The name ends with "…"; the icon keeps its size.
export const LongText: Story = {
  args: {
    name: "Living room and dining area by the garden",
    spaceType: "living-room",
    size: "md",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "200px" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, a short name for an Other Space.
export const Minimal: Story = {
  args: { name: "Attic", spaceType: "other" },
};
