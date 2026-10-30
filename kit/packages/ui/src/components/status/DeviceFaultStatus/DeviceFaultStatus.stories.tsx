import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeviceFaultStatus } from "./DeviceFaultStatus";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Status/DeviceFaultStatus",
  component: DeviceFaultStatus,
  args: { faultCode: "sensor_failure", metric: "co2" },
  // Show `faultCode` and `metric` as dropdowns in the Controls panel.
  argTypes: {
    faultCode: {
      control: "select",
      options: ["sensor_failure", "calibration_required"],
    },
    metric: {
      control: "select",
      options: ["temperature", "humidity", "illuminance", "co2", "voc", "pm25"],
    },
  },
} satisfies Meta<typeof DeviceFaultStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Fault Code, from the glossary.
export const SensorFailure: Story = {};

export const CalibrationRequired: Story = {
  args: { faultCode: "calibration_required" },
};

// Stress story: the longest message in a ModuleCard column.
// The dashed box is the container: the message wraps and the icon stays beside the first line.
export const LongText: Story = {
  args: { faultCode: "calibration_required", metric: "illuminance" },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "calc(var(--shk-size-20) * 2)",
          outline:
            "var(--shk-border-width-thin) dashed var(--shk-status-neutral-border)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, a Fault about the whole Device, with no Metric.
export const Minimal: Story = {
  args: { metric: undefined },
};
