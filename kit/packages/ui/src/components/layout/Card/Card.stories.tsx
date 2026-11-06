import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorReading } from "../../readings/SensorReading";
import { DeviceConnectionStatus } from "../../status/DeviceConnectionStatus";
import { Card } from "./Card";

// The example values from Card.md, the same as Figma.
const temperature = (
  <SensorReading
    metric="temperature"
    value={22.4}
    unit="celsius"
    fractionDigits={1}
    size="md"
  />
);
const connected = <DeviceConnectionStatus status="connected" />;

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Typed with Meta<typeof Card>, not `satisfies`: Card's props are a union (static, link, button),
// and `satisfies` would narrow every story's args to the shape of these defaults.
const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  args: {
    title: "Climate Module",
    headerEnd: connected,
    children: temperature,
    footer: "Updated 2 min ago",
  },
  // headerEnd and children are real components, so they have no control. title and footer get text boxes.
  argTypes: {
    headerEnd: { control: false },
    children: { control: false },
  },
  // The card fills its parent, so every story sits in a box. A story can set its width with
  // `parameters`. Drag the corner to try other widths.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "320px",
          resize: "horizontal",
          overflow: "auto",
          padding: "8px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

// One story per Figma variant. Hover, pressed and focus come from the browser:
// point at a clickable card, click it, or press Tab.

// isInteractive=false: a card about one Module, with its Connection Status.
export const Default: Story = {};

// A Space: no status in the header, because a Space has no status.
export const Space: Story = {
  args: { title: "Kitchen", headerEnd: undefined, footer: undefined },
};

// isInteractive=true as a link. "#" keeps Storybook on the same page.
export const ClickableLink: Story = {
  args: {
    title: "Kitchen",
    href: "#/spaces/kitchen",
    headerEnd: undefined,
    footer: undefined,
  },
};

// isInteractive=true as a button.
export const ClickableButton: Story = {
  args: {
    title: "Kitchen",
    onClick: () => {},
    headerEnd: undefined,
    footer: undefined,
  },
};

// Stress story: a long title in a narrow container. The title ends with "…"; the status keeps its width.
export const LongText: Story = {
  args: { title: "Climate Module by the kitchen window" },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, content only. No header, no group role.
export const Minimal: Story = {
  args: { title: undefined, headerEnd: undefined, footer: undefined },
};
