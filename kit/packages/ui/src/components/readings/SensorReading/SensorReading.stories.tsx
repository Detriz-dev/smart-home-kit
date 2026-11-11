import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorReading } from "./SensorReading";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec's Example values (Temperature 22.4 °C, the default size).
const meta = {
  title: "Readings/SensorReading",
  component: SensorReading,
  args: {
    metric: "temperature",
    value: 22.4,
    unit: "celsius",
    isDisconnected: false,
    fractionDigits: 1,
    size: "lg",
  },
  // Show the fixed lists as dropdowns in the Controls panel.
  argTypes: {
    metric: {
      control: "select",
      options: ["temperature", "humidity", "illuminance", "co2", "voc", "pm25"],
    },
    unit: {
      control: "select",
      options: ["celsius", "fahrenheit", "percent-rh", "lux", "ppm"],
    },
    size: { control: "select", options: ["lg", "md"] },
    value: { control: "number" },
    fractionDigits: { control: { type: "number", min: 0, max: 3 } },
  },
  // The card fills its parent, so every story sits in a box as wide as a DeviceCard column
  // (160px, the Figma width). Drag the corner to try other widths.
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "calc(var(--shk-size-20) * 2)",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SensorReading>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Default: Story = {};

export const Loading: Story = {
  args: { value: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// The second size. lg is the default above.
export const SizeMd: Story = {
  args: { size: "md" },
};

// A Fault about this Sensor: the short message under the value. The value still shows.
export const Fault: Story = {
  args: { size: "md", faults: ["sensor_failure"] },
};

// Both Fault Codes at once, one under the other.
export const SeveralFaults: Story = {
  args: { size: "md", faults: ["sensor_failure", "calibration_required"] },
};

// More example values from the spec.
export const Humidity: Story = {
  args: {
    metric: "humidity",
    value: 48,
    unit: "percent-rh",
    fractionDigits: 0,
  },
};

export const BelowZero: Story = {
  args: { value: -3.5 },
};

export const AirQuality: Story = {
  args: {
    metric: "co2",
    value: 1250,
    unit: "ppm",
    fractionDigits: 0,
    size: "md",
  },
};

// Stress story: the longest realistic value (bright daylight in lux) in a DeviceCard column.
export const LongText: Story = {
  args: {
    metric: "illuminance",
    value: 100000,
    unit: "lux",
    fractionDigits: 0,
    size: "md",
  },
};

// Stress story: the smallest case, a single digit.
export const Minimal: Story = {
  args: {
    metric: "illuminance",
    value: 0,
    unit: "lux",
    fractionDigits: 0,
    size: "md",
  },
};
