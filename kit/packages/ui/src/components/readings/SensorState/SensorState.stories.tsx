import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorState } from "./SensorState";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Power On, size lg, matching the Figma default variant.
const meta: Meta<typeof SensorState> = {
  title: "Readings/SensorState",
  component: SensorState,
  args: { metric: "power", state: "on", isDisconnected: false, size: "lg" },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "md"] },
    alertLevel: {
      control: "select",
      options: [undefined, "critical", "warning", "info"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 2)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
// Typed against the component: its props are a union (Metric + State pairs), which `satisfies` can't infer.
type Story = StoryObj<typeof SensorState>;

// One story per state, matching the Figma variants.
export const Default: Story = {};

export const Loading: Story = { args: { state: null } };

export const Disconnected: Story = { args: { isDisconnected: true } };

export const SizeMd: Story = { args: { size: "md" } };

// A Fault about this Sensor: the short message under the State. The State still shows.
export const Fault: Story = {
  args: {
    size: "md",
    metric: "smoke",
    state: "clear",
    faults: ["sensor_failure"],
  },
};

// Named after the Asset it watches, instead of the Metric.
export const WithAsset: Story = {
  args: {
    metric: "contact",
    state: "open",
    asset: { name: "Front door", assetType: "door" },
  },
};

// Smoke Detected with its Built-in Alert Rule: a Critical Alert colours the State.
export const SmokeAlert: Story = {
  args: { metric: "smoke", state: "detected", alertLevel: "critical" },
};

// Stress story: a long Asset name in the narrow card ends with "…"; the State keeps its size.
export const LongText: Story = {
  args: {
    metric: "power",
    state: "off",
    asset: {
      name: "Grandma's old washing machine in the cellar",
      assetType: "appliance",
    },
  },
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { size: "md", metric: "motion", state: "clear" },
};
