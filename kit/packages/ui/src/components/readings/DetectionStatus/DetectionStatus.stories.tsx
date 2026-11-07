import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetectionStatus } from "./DetectionStatus";

// A fixed "now" (7 Nov 2026, 14:05), so the stories always show the same text.
const NOW = new Date(2026, 10, 7, 14, 5);
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

const meta = {
  title: "Readings/DetectionStatus",
  component: DetectionStatus,
  args: {
    metric: "motion",
    state: "detected",
    detectedSince: minutesAgo(3),
    now: NOW,
    size: "md",
  },
  argTypes: {
    metric: { control: "inline-radio", options: ["motion", "smoke", "co"] },
    state: { control: "inline-radio", options: ["detected", "clear", null] },
    size: { control: "inline-radio", options: ["md", "lg"] },
    alertLevel: {
      control: "select",
      options: [undefined, "critical", "warning", "info"],
    },
  },
} satisfies Meta<typeof DetectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Detected: Story = {};

export const Clear: Story = {
  args: {
    state: "clear",
    detectedSince: undefined,
    lastDetectedAt: minutesAgo(125),
  },
};

export const ClearNever: Story = {
  args: { state: "clear", detectedSince: undefined },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// Smoke with its Built-in Alert Rule: a Critical Alert colours the pill.
export const SmokeAlert: Story = {
  args: {
    metric: "smoke",
    alertLevel: "critical",
    detectedSince: minutesAgo(1),
  },
};

export const Large: Story = {
  args: { size: "lg" },
};

// Stress story: the longest time text (another day, hours and minutes), in a narrow card.
// The time wraps under the pill instead of being shortened.
export const LongText: Story = {
  args: {
    metric: "co",
    alertLevel: "critical",
    detectedSince: minutesAgo(60 * 26 + 17),
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-24) * 2.5)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { state: "clear", detectedSince: undefined },
};
