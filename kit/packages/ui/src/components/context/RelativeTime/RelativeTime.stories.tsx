import type { Meta, StoryObj } from "@storybook/react-vite";
import { RelativeTime } from "./RelativeTime";

// A fixed "now" (7 Nov 2026, 14:05), so the stories always show the same text.
const NOW = new Date(2026, 10, 7, 14, 5);
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

const meta = {
  title: "Context/RelativeTime",
  component: RelativeTime,
  args: { time: minutesAgo(2), now: NOW, format: "relative", size: "xs" },
  argTypes: {
    format: {
      control: "inline-radio",
      options: ["relative", "clock", "duration"],
    },
    size: { control: "inline-radio", options: ["xs", "sm"] },
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per format, and the other size.
export const Relative: Story = {};

export const Clock: Story = {
  args: { time: minutesAgo(3), format: "clock" },
};

export const ClockOtherDay: Story = {
  args: { time: minutesAgo(26 * 60), format: "clock" },
};

export const Duration: Story = {
  args: { time: minutesAgo(125), format: "duration" },
};

export const Small: Story = {
  args: { size: "sm" },
};

// Every step of the relative format.
export const RelativeSteps: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--shk-space-1)" }}>
      {[0.5, 3, 59, 120, 60 * 30, 60 * 24 * 3, 60 * 24 * 10].map((m) => (
        <RelativeTime key={m} {...args} time={minutesAgo(m)} />
      ))}
    </div>
  ),
};

// Live: no `now`, so the text follows the real clock and updates every 30 seconds.
export const Live: Story = {
  args: { now: undefined, time: new Date(Date.now() - 90_000) },
};

// Stress story: the longest text, in a narrow container. It never wraps.
export const LongText: Story = {
  args: { time: minutesAgo(60 * 26 + 5), format: "clock", size: "sm" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "var(--shk-size-16)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { time: NOW },
};
