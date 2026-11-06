import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../icons/Icon";
import { SensorLabel } from "../../context/SensorLabel";
import { ReadingValue } from "../../readings/ReadingValue";
import { UnitLabel } from "../../readings/UnitLabel";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { List } from "../List";
import { ListItem } from "./ListItem";

// The example values from ListItem.md, the same as Figma.
const kitchenIcon = <Icon name="countertops" />;
const temperature = (
  <>
    <ReadingValue value={22.4} size="sm" />
    <UnitLabel unit="celsius" size="sm" />
  </>
);

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Typed with Meta<typeof ListItem>, not `satisfies`: the props are a union (static, link, button), like Card.
const meta: Meta<typeof ListItem> = {
  title: "Layout/ListItem",
  component: ListItem,
  args: {
    start: kitchenIcon,
    title: "Kitchen",
    description: "Ground floor",
    end: temperature,
  },
  argTypes: {
    start: { control: false },
    end: { control: false },
  },
  // A ListItem is an <li>, so every story sits in a List, in a box. A story can set its width
  // with `parameters`. Drag the corner to try other widths.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "360px",
          resize: "horizontal",
          overflow: "auto",
          padding: "8px",
        }}
      >
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListItem>;

// One story per Figma variant. Hover, pressed and focus come from the browser:
// point at a clickable row, click it, or press Tab.

// isInteractive=false: a plain row.
export const Default: Story = {};

// isInteractive=true as a link. "#" keeps Storybook on the same page.
export const ClickableLink: Story = {
  args: { href: "#/spaces/kitchen" },
};

// isInteractive=true as a button.
export const ClickableButton: Story = {
  args: { onClick: () => {} },
};

// A Reading row: SensorLabel on the left, the value on the right, no title.
export const Reading: Story = {
  args: {
    start: <SensorLabel metric="temperature" size="sm" />,
    title: undefined,
    description: undefined,
  },
};

// A row about one Module: its Connection Status on the right, no icon.
export const Module: Story = {
  args: {
    start: undefined,
    title: "Climate Module",
    description: "Bedroom",
    end: <DeviceConnectionStatus status="connected" />,
    href: "#/devices/climate-module",
  },
};

// Stress story: long title and description in a narrow container. Both end with "…"; start and end keep their width.
export const LongText: Story = {
  args: {
    start: <Icon name="weekend" />,
    title: "Living room and dining area by the garden",
    description: "Ground floor, east wing",
    end: (
      <>
        <ReadingValue value={21.8} size="sm" />
        <UnitLabel unit="celsius" size="sm" />
      </>
    ),
    href: "#/spaces/living-room",
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, a title only.
export const Minimal: Story = {
  args: { start: undefined, description: undefined, end: undefined },
};
