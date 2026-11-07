import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../icons/Icon";
import { ALERT_ICONS } from "../../../icons/purposeIcons";
import { Badge } from "./Badge";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Feedback/Badge",
  component: Badge,
  args: { count: 3, label: "3 active Alerts", tone: "neutral", max: 99 },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["critical", "warning", "info", "neutral"],
    },
    count: { control: { type: "number", min: 0 } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per tone, matching the Figma variants.
export const Critical: Story = { args: { tone: "critical" } };
export const Warning: Story = { args: { tone: "warning" } };
export const Info: Story = { args: { tone: "info" } };
export const Neutral: Story = {};

// Two digits: the circle becomes a pill.
export const TwoDigits: Story = {
  args: { count: 12, label: "12 active Alerts", tone: "warning" },
};

// 0 shows nothing at all.
export const Zero: Story = { args: { count: 0, label: "No active Alerts" } };

// On the corner of an icon: the parent places it.
export const OnIcon: Story = {
  args: { count: 2, label: "2 active Alerts", tone: "critical" },
  render: (args) => (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        padding: "var(--shk-space-1)",
      }}
    >
      <Icon name={ALERT_ICONS.active} label="Alerts" />
      <span
        style={{
          position: "absolute",
          insetBlockStart: 0,
          insetInlineEnd: "calc(var(--shk-space-2) * -1)",
        }}
      >
        <Badge {...args} />
      </span>
    </span>
  ),
};

// Stress story: above max shows "99+".
export const LongText: Story = {
  args: { count: 1234, label: "1,234 active Alerts" },
};

// Stress story: the smallest case.
export const Minimal: Story = { args: { count: 1, label: "1 active Alert" } };
