import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../../layout/List";
import { SpaceListItem } from "./SpaceListItem";

// Typed with Meta<typeof SpaceListItem>, not `satisfies`: the props are a union (static / link / button).
const meta: Meta<typeof SpaceListItem> = {
  title: "Context/SpaceListItem",
  component: SpaceListItem,
  args: {
    name: "Kitchen",
    spaceType: "kitchen",
    floorName: "Ground floor",
    moduleCount: 3,
    href: "#/spaces/kitchen",
  },
  argTypes: {
    highestAlertLevel: {
      control: "inline-radio",
      options: ["critical", "warning", "info"],
    },
  },
  // A SpaceListItem is an <li>, so every story sits in a List, in a 360px box.
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 4.5)" }}>
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SpaceListItem>;

// The two Figma variants: no Alerts, and Active Alerts.
export const NoAlerts: Story = {};

export const WithAlerts: Story = {
  args: { activeAlertCount: 2, highestAlertLevel: "critical" },
};

export const WarningAlert: Story = {
  args: {
    name: "Bedroom",
    spaceType: "bedroom",
    floorName: "First floor",
    moduleCount: 1,
    activeAlertCount: 1,
    highestAlertLevel: "warning",
  },
};

// A Site without Floors, or a row inside a Floor section: no Floor.
export const NoFloor: Story = { args: { floorName: undefined } };

// A new Space with nothing in it yet.
export const Empty: Story = {
  args: {
    name: "Garage",
    spaceType: "garage",
    floorName: undefined,
    moduleCount: 0,
  },
};

// Stress story: long name and Floor in a narrow list. Both end with "…"; the Badge never shrinks.
export const LongText: Story = {
  args: {
    name: "Living room and dining area by the garden",
    spaceType: "living-room",
    floorName: "Ground floor, east wing",
    moduleCount: 12,
    activeAlertCount: 120,
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 3)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, just a name.
export const Minimal: Story = {
  args: {
    name: "Attic",
    spaceType: "other",
    floorName: undefined,
    moduleCount: undefined,
    href: undefined,
  },
};
