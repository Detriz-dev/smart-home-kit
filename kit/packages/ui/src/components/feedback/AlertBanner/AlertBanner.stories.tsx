import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertBanner } from "./AlertBanner";

// A fixed "now" (7 Nov 2026, 14:05), so the time always reads the same.
const NOW = new Date(2026, 10, 7, 14, 5);
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Feedback/AlertBanner",
  component: AlertBanner,
  args: {
    title: "Smoke detected",
    alertLevel: "critical",
    raisedAt: minutesAgo(2),
    spaceName: "Kitchen",
    actionLabel: "View",
    onAction: () => {},
    onClose: () => {},
    now: NOW,
  },
  argTypes: {
    alertLevel: {
      control: "inline-radio",
      options: ["critical", "warning", "info"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 5)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Figma variant.
export const Critical: Story = {};

export const Warning: Story = {
  args: {
    title: "Kitchen above 28 °C",
    alertLevel: "warning",
    raisedAt: minutesAgo(15),
  },
};

export const Info: Story = {
  args: {
    title: "Front door opened",
    alertLevel: "info",
    spaceName: "Hallway",
    raisedAt: minutesAgo(0.2),
  },
};

// Someone the Site is shared with: no ×, because only the owner may close an Alert.
export const NotClosable: Story = { args: { onClose: undefined } };

// Stress story: a long title in a narrow container. The text wraps; the action moves under it.
export const LongText: Story = {
  args: {
    title:
      "Carbon monoxide detected next to the boiler in the basement utility room",
    spaceName: "Basement utility room by the garden stairs",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 3)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, no place, no action, no ×.
export const Minimal: Story = {
  args: {
    spaceName: undefined,
    actionLabel: undefined,
    onAction: undefined,
    onClose: undefined,
  },
};
