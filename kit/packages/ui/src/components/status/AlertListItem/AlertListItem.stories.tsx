import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../../layout/List";
import { AlertListItem } from "./AlertListItem";

// A fixed "now" (7 Nov 2026, 14:05), so the times always read the same.
const NOW = new Date(2026, 10, 7, 14, 5);
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

// Typed with Meta<typeof AlertListItem>, not `satisfies`: the props are a union (static / link / button).
const meta: Meta<typeof AlertListItem> = {
  title: "Status/AlertListItem",
  component: AlertListItem,
  args: {
    title: "Smoke detected",
    alertLevel: "critical",
    alertStatus: "active",
    raisedAt: minutesAgo(2),
    spaceName: "Kitchen",
    now: NOW,
  },
  argTypes: {
    alertLevel: {
      control: "inline-radio",
      options: ["critical", "warning", "info"],
    },
    alertStatus: {
      control: "inline-radio",
      options: ["active", "ended", "closed"],
    },
  },
  // An AlertListItem is an <li>, so every story sits in a List, in a 360px box.
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
type Story = StoryObj<typeof AlertListItem>;

// One story per Figma variant.
export const ActiveCritical: Story = {};

export const ActiveWarning: Story = {
  args: {
    title: "Kitchen above 28 °C",
    alertLevel: "warning",
    raisedAt: minutesAgo(15),
  },
};

export const ActiveInfo: Story = {
  args: {
    title: "Front door opened",
    alertLevel: "info",
    spaceName: "Hallway",
    raisedAt: minutesAgo(0.2),
  },
};

export const Ended: Story = {
  args: {
    alertStatus: "ended",
    raisedAt: minutesAgo(70),
    endedAt: minutesAgo(60),
  },
};

export const Closed: Story = {
  args: {
    title: "Kitchen above 28 °C",
    alertLevel: "warning",
    alertStatus: "closed",
    raisedAt: minutesAgo(26 * 60),
    endedAt: minutesAgo(25 * 60),
  },
};

// A clickable row: opens the Alert.
export const AsLink: Story = { args: { href: "#/alerts/42" } };

// Stress story: a long title and place in a narrow list. Both end with "…"; the status never shrinks.
export const LongText: Story = {
  args: {
    title: "Carbon monoxide detected next to the boiler in the basement",
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

// Stress story: the smallest case, no place.
export const Minimal: Story = {
  args: { title: "Motion", alertLevel: "info", spaceName: undefined },
};
