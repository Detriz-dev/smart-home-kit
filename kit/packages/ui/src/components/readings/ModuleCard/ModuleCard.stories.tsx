import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ModuleCard } from "./ModuleCard";
import type { ModuleCardSensor } from "./ModuleCard.types";

const CLIMATE_SENSORS: ModuleCardSensor[] = [
  { metric: "temperature", value: 22.4, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
];

const AIR_QUALITY_SENSORS: ModuleCardSensor[] = [
  { metric: "co2", value: 1250, unit: "ppm", fractionDigits: 0 },
  { metric: "voc", value: 120, unit: "ppb", fractionDigits: 0 },
  { metric: "pm25", value: 12, unit: "ug-m3", fractionDigits: 0 },
];

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Readings/ModuleCard",
  component: ModuleCard,
  args: {
    name: "Climate Module",
    sensors: CLIMATE_SENSORS,
    connectionStatus: "connected",
    isOn: true,
    onToggle: () => {},
  },
  // Show `connectionStatus` as a dropdown of the four Connection Statuses in the Controls panel.
  argTypes: {
    connectionStatus: {
      control: "select",
      options: ["connecting", "connected", "stale", "disconnected"],
    },
  },
  // The card fills its parent, so every story sits in a box. A story can set its width with
  // `parameters`. Drag the corner to watch the layout change.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "364px",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
  // Storybook doesn't keep the value, so this wrapper does: clicking the Switch really flips it.
  render: function Render(args) {
    const [isOn, setIsOn] = useState(args.isOn);
    // A Module turned back on in the Off story reconnects, like the real thing.
    const connectionStatus =
      isOn && !args.isOn ? "connected" : args.connectionStatus;
    return (
      <ModuleCard
        {...args}
        isOn={isOn}
        connectionStatus={connectionStatus}
        onToggle={setIsOn}
      />
    );
  },
} satisfies Meta<typeof ModuleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state.
export const Connected: Story = {};

export const Loading: Story = {
  args: {
    connectionStatus: "connecting",
    sensors: CLIMATE_SENSORS.map((sensor) => ({ ...sensor, value: null })),
  },
};

export const Stale: Story = {
  args: {
    name: "Light Module",
    connectionStatus: "stale",
    sensors: [
      { metric: "illuminance", value: 320, unit: "lux", fractionDigits: 0 },
    ],
  },
};

// The Module is On but lost, so the Switch is greyed out.
export const Disconnected: Story = {
  args: { connectionStatus: "disconnected" },
};

// The user turned the Module off, so the Switch stays usable. Flip it to turn the Module back on.
export const Off: Story = {
  args: { connectionStatus: "disconnected", isOn: false },
};

// A Fault sits on top of any state: the value still shows.
export const Fault: Story = {
  args: {
    name: "Air Quality Module",
    sensors: AIR_QUALITY_SENSORS.slice(0, 1),
    fault: { faultCode: "sensor_failure", metric: "co2" },
  },
};

// Three Sensors need a wider card to sit in one row.
export const ThreeSensors: Story = {
  args: { name: "Air Quality Module", sensors: AIR_QUALITY_SENSORS },
  parameters: { width: "536px" },
};

// The narrow layout: the status under the name, and one Sensor under the other.
export const Stacked: Story = {
  parameters: { width: "192px" },
};

// Stress story: a long name the user chose, and the longest value, in a narrow container.
// The name ends with "…", and the value and its Unit are never cut off.
export const LongText: Story = {
  args: {
    name: "Living room air quality by the window",
    sensors: [
      CLIMATE_SENSORS[0],
      { metric: "illuminance", value: 100000, unit: "lux", fractionDigits: 0 },
    ],
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, one Sensor and no Fault.
export const Minimal: Story = {
  args: {
    name: "Light Module",
    sensors: [
      { metric: "illuminance", value: 0, unit: "lux", fractionDigits: 0 },
    ],
  },
};
