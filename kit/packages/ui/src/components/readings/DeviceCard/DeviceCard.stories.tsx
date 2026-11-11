import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { OpenCloseControl } from "../../controls/OpenCloseControl";
import { OperationalStateControl } from "../../controls/OperationalStateControl";
import { PowerControl } from "../../controls/PowerControl";
import { StateSelectControl } from "../../controls/StateSelectControl";
import { ValueControl } from "../../controls/ValueControl";
import { DeviceCard } from "./DeviceCard";
import type { DeviceCardSensor } from "./DeviceCard.types";

const CLIMATE_SENSORS: DeviceCardSensor[] = [
  { metric: "temperature", value: 22.4, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
];

const AIR_QUALITY_SENSORS: DeviceCardSensor[] = [
  { metric: "co2", value: 1250, unit: "ppm", fractionDigits: 0 },
  { metric: "voc", value: 120, unit: "ppb", fractionDigits: 0 },
  { metric: "pm25", value: 12, unit: "ug-m3", fractionDigits: 0 },
];

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Readings/DeviceCard",
  component: DeviceCard,
  args: {
    name: "Climate Module",
    sensors: CLIMATE_SENSORS,
    connectionStatus: "connected",
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
} satisfies Meta<typeof DeviceCard>;

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

// The Module can't be reached, for example it was unplugged: the values are hidden.
export const Disconnected: Story = {
  args: { connectionStatus: "disconnected" },
};

// A Fault sits on top of any state: the value still shows. A Fault about a Sensor on the card
// shows inside that Sensor's card, with the short message.
export const Fault: Story = {
  args: {
    name: "Air Quality Module",
    sensors: AIR_QUALITY_SENSORS.slice(0, 1),
    faults: [{ faultCode: "sensor_failure", metric: "co2" }],
  },
};

// A Fault about one of two Sensors: only that Sensor's card shows it. Both cards keep the same height.
export const FaultOnOneSensor: Story = {
  args: {
    faults: [{ faultCode: "sensor_failure", metric: "humidity" }],
  },
};

// A Fault with no Metric is about the whole Device: it shows above the Sensors, full width.
export const DeviceFault: Story = {
  args: {
    faults: [{ faultCode: "calibration_required" }],
  },
};

// A Module can report several Faults at once: one DeviceFaultStatus per Fault, each in its Sensor's card.
export const SeveralFaults: Story = {
  args: {
    name: "Air Quality Module",
    sensors: AIR_QUALITY_SENSORS,
    faults: [
      { faultCode: "sensor_failure", metric: "co2" },
      { faultCode: "calibration_required", metric: "voc" },
    ],
  },
  parameters: { width: "536px" },
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

// State Sensors: a Smoke and CO Module, each Sensor shown as a SensorState.
export const StateSensors: Story = {
  args: {
    name: "Kitchen safety",
    sensors: [
      { metric: "smoke", state: "clear" },
      { metric: "co", state: "detected", alertLevel: "critical" },
    ],
  },
};

// A Power Sensor named after the Appliance it watches.
export const PowerWithAsset: Story = {
  args: {
    name: "Laundry power",
    sensors: [
      {
        metric: "power",
        state: "on",
        asset: { name: "Washing machine", assetType: "appliance" },
      },
    ],
  },
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

// Devices with Controls (ADR 0002). Controls are a slot: the parent passes the Control components.

// A power strip: no Sensors, one PowerControl per socket.
export const PowerStrip: Story = {
  args: {
    name: "Power strip",
    sensors: undefined,
    controls: (
      <>
        <PowerControl
          name="Desk lamp"
          state="on"
          allowedCommands={["turn-on", "turn-off"]}
          onCommand={fn()}
        />
        <PowerControl
          name="Monitor"
          state="off"
          allowedCommands={["turn-on", "turn-off"]}
          onCommand={fn()}
        />
        <PowerControl
          name="Socket 3"
          state="off"
          allowedCommands={["turn-on", "turn-off"]}
          onCommand={fn()}
          command={{ command: "turn-on", status: "pending" }}
        />
        <PowerControl
          name="Socket 4"
          state="off"
          allowedCommands={["turn-on", "turn-off"]}
          onCommand={fn()}
          command={{ command: "turn-on", status: "failed" }}
        />
      </>
    ),
  },
};

// A kettle: Operational State only, Start and Stop allowed. While Running, only Stop.
export const Kettle: Story = {
  args: {
    name: "Kitchen kettle",
    sensors: undefined,
    controls: (
      <OperationalStateControl
        name="Kettle"
        state="running"
        phase="Heating"
        allowedCommands={["start", "stop"]}
        onCommand={fn()}
      />
    ),
  },
};

// Heating: a measured Temperature (Sensor), a Setpoint and a Mode (Controls).
export const Heating: Story = {
  args: {
    name: "Living room heating",
    sensors: [
      {
        metric: "temperature",
        value: 19.8,
        unit: "celsius",
        fractionDigits: 1,
      },
    ],
    controls: (
      <>
        <ValueControl
          name="Setpoint"
          value={22}
          unit="celsius"
          min={0}
          max={30}
          step={0.5}
          fractionDigits={1}
          onCommit={fn()}
        />
        <StateSelectControl
          name="Mode"
          metric="mode"
          state="heat"
          onSelect={fn()}
        />
      </>
    ),
  },
};

// Motorized blinds: Open / Close and a Position slider.
export const Blinds: Story = {
  args: {
    name: "Living room blinds",
    sensors: undefined,
    controls: (
      <>
        <OpenCloseControl
          name="Blinds"
          state="opening"
          allowedCommands={["open", "stop", "close"]}
          onCommand={fn()}
        />
        <ValueControl
          name="Position"
          value={40}
          unit="percent"
          min={0}
          max={100}
          step={1}
          input="slider"
          onCommit={fn()}
        />
      </>
    ),
  },
};

// Disconnected: the card hides the Sensors' values itself; the parent passes isDisconnected to each Control.
export const HeatingDisconnected: Story = {
  args: {
    name: "Living room heating",
    connectionStatus: "disconnected",
    sensors: [
      {
        metric: "temperature",
        value: 19.8,
        unit: "celsius",
        fractionDigits: 1,
      },
    ],
    controls: (
      <>
        <ValueControl
          name="Setpoint"
          value={22}
          unit="celsius"
          min={0}
          max={30}
          step={0.5}
          fractionDigits={1}
          onCommit={fn()}
          isDisconnected
        />
        <StateSelectControl
          name="Mode"
          metric="mode"
          state="heat"
          onSelect={fn()}
          isDisconnected
        />
      </>
    ),
  },
};

// A Fault that stops the task: one Fault row, and the Error Reason points to it.
export const KettleWithFault: Story = {
  args: {
    name: "Kitchen kettle",
    sensors: undefined,
    faults: [{ faultCode: "sensor_failure" }],
    controls: (
      <OperationalStateControl
        name="Kettle"
        state="error"
        errorReason={{
          code: "unable-to-start-or-resume",
          faultCode: "sensor_failure",
        }}
        allowedCommands={["start", "stop"]}
        onCommand={fn()}
      />
    ),
  },
};
