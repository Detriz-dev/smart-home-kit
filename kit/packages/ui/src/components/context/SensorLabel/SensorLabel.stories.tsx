import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorLabel } from "./SensorLabel";
import type { SensorLabelMetric, SensorLabelSize } from "./SensorLabel.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec's Example values (Temperature, the default size).
const meta = {
  title: "Context/SensorLabel",
  component: SensorLabel,
  args: {
    metric: "temperature",
    size: "xs",
  },
  // Show `metric` and `size` as dropdowns in the Controls panel.
  argTypes: {
    metric: {
      control: "select",
      options: [
        "temperature",
        "humidity",
        "illuminance",
        "co2",
        "voc",
        "pm25",
        "power",
        "contact",
        "motion",
        "smoke",
        "co",
      ],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof SensorLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: SensorLabelSize[] = ["xs", "sm", "md", "lg"];
const METRICS: SensorLabelMetric[] = [
  "temperature",
  "humidity",
  "illuminance",
  "co2",
  "voc",
  "pm25",
  "power",
  "contact",
  "motion",
  "smoke",
  "co",
];

// One story per Metric, at the size from the spec's stories table.
export const Temperature: Story = {};

export const Humidity: Story = {
  args: { metric: "humidity", size: "sm" },
};

export const Illuminance: Story = {
  args: { metric: "illuminance", size: "md" },
};

// Checks that the subscript ₂ renders.
export const Co2: Story = {
  args: { metric: "co2", size: "md" },
};

export const Voc: Story = {
  args: { metric: "voc", size: "sm" },
};

export const Pm25: Story = {
  args: { metric: "pm25", size: "lg" },
};

// All four sizes side by side, like the Figma component set. md and lg share the 24px icon.
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--shk-space-6)",
      }}
    >
      {SIZES.map((size) => (
        <SensorLabel key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

// Every Metric at the chosen size, stacked, to compare icons and names.
export const AllMetrics: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--shk-space-2)",
      }}
    >
      {METRICS.map((metric) => (
        <SensorLabel key={metric} {...args} metric={metric} />
      ))}
    </div>
  ),
};

// Stress story: the longest name at the biggest size in a 96px container, like the Figma usage frame.
// The dashed box is the container: the label ends with "…" and the icon keeps its size.
export const LongText: Story = {
  args: { metric: "illuminance", size: "lg" },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "var(--shk-size-24)",
          outline:
            "var(--shk-border-width-thin) dashed var(--shk-status-neutral-border)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, the shortest name at the smallest size, on its own.
export const Minimal: Story = {
  args: { metric: "voc", size: "xs" },
};
