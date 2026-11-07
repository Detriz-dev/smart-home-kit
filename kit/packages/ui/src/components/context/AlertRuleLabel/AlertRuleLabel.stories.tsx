import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorReading } from "../../readings/SensorReading";
import { SensorState } from "../../readings/SensorState";
import { AlertRuleLabel } from "./AlertRuleLabel";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec (Alert above 28 °C, xs), matching Figma.
// Meta is typed instead of `satisfies`, because the props are a union (threshold or State).
const meta: Meta<typeof AlertRuleLabel> = {
  title: "Context/AlertRuleLabel",
  component: AlertRuleLabel,
  args: {
    condition: { metric: "temperature", comparison: "above", value: 28 },
    unit: "celsius",
    size: "xs",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm"] },
  },
};

export default meta;
type Story = StoryObj<typeof AlertRuleLabel>;

// The default: a threshold on a Measured Metric.
export const Above: Story = {};

export const Below: Story = {
  args: {
    condition: { metric: "humidity", comparison: "below", value: 30 },
    unit: "percent-rh",
  },
};

// A rule on a Two-state Metric: no Unit.
export const WhenState: Story = {
  args: {
    condition: { metric: "contact", state: "open" },
    unit: undefined,
  },
};

// sm, for a Sensor's own screen. 1000 is shown as "1,000" in English.
export const Small: Story = {
  args: {
    condition: { metric: "co2", comparison: "above", value: 1000 },
    unit: "ppm",
    size: "sm",
  },
};

// Where it usually sits: under the Reading it watches.
export const UnderAReading: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--shk-space-2)", width: 200 }}>
      <SensorReading
        metric="temperature"
        value={22.4}
        unit="celsius"
        size="md"
      />
      <AlertRuleLabel {...args} />
    </div>
  ),
};

export const UnderAState: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--shk-space-2)", width: 200 }}>
      <SensorState
        metric="contact"
        state="closed"
        asset={{ name: "Front door", assetType: "door" }}
        size="md"
      />
      <AlertRuleLabel condition={{ metric: "contact", state: "open" }} />
    </div>
  ),
};

// Stress: the longest realistic rule in a narrow container. It wraps, never truncates.
export const LongText: Story = {
  args: {
    condition: { metric: "pm25", comparison: "above", value: 1000.5 },
    unit: "ug-m3",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 120 }}>
        <Story />
      </div>
    ),
  ],
};

// Stress: the smallest case, a short State rule.
export const Minimal: Story = {
  args: {
    condition: { metric: "power", state: "on" },
    unit: undefined,
  },
};
