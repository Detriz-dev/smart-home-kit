import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ConnectionStatus } from "../../status/DeviceConnectionStatus";
import { SpaceCard } from "./SpaceCard";
import type {
  SpaceCardMeasuredReading,
  SpaceCardReading,
} from "./SpaceCard.types";

// The four rows of the Figma variants: one per Metric, all from Connected Modules.
const BEDROOM_READINGS: SpaceCardMeasuredReading[] = [
  {
    metric: "temperature",
    value: 21.5,
    unit: "celsius",
    fractionDigits: 1,
    connectionStatus: "connected",
  },
  {
    metric: "humidity",
    value: 48,
    unit: "percent-rh",
    fractionDigits: 0,
    connectionStatus: "connected",
  },
  {
    metric: "co2",
    value: 840,
    unit: "ppm",
    fractionDigits: 0,
    connectionStatus: "connected",
  },
  {
    metric: "illuminance",
    value: 120,
    unit: "lux",
    fractionDigits: 0,
    connectionStatus: "connected",
  },
];

/** Puts every row in the same Connection Status, like the Figma `state` variants. */
const withStatus = (
  connectionStatus: ConnectionStatus,
  readings: SpaceCardReading[] = BEDROOM_READINGS,
): SpaceCardReading[] =>
  readings.map((reading) => ({ ...reading, connectionStatus }));

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Readings/SpaceCard",
  component: SpaceCard,
  args: {
    name: "Bedroom",
    readings: BEDROOM_READINGS,
  },
  // The card has no state prop: each row follows its own Module. Edit `readings` in the
  // Controls panel to change one row's `connectionStatus` or set a `value` to null.
  // The card fills its parent, so every story sits in a box. A story can set its width with
  // `parameters`. Drag the corner to watch the rows wrap.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "320px",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SpaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per row state, matching the Figma variants.
export const Connected: Story = {};

// The first Readings are on their way: a spinning icon instead of each value.
export const Loading: Story = {
  args: {
    readings: withStatus("connecting").map((reading) => ({
      ...reading,
      value: null,
    })),
  },
};

// The last values stay, and each row says Stale.
export const Stale: Story = {
  args: { readings: withStatus("stale") },
};

// Values hidden, disconnected icon shown.
export const Disconnected: Story = {
  args: { readings: withStatus("disconnected") },
};

// A Fault sits on top of any state: the value still shows.
export const Fault: Story = {
  args: {
    name: "Living room",
    readings: [{ ...BEDROOM_READINGS[2], value: 1250 }],
    faults: [{ faultCode: "sensor_failure", metric: "co2" }],
  },
};

// "Temperature in every room": the renderer passes only the asked-for Metric.
export const OneMetric: Story = {
  args: { readings: BEDROOM_READINGS.slice(0, 1) },
};

// Stress story: a long Space name, a Stale row with the longest value, and a long Fault
// message, in a narrow container. The name ends with "…" and the reading wraps under its label.
export const LongText: Story = {
  args: {
    activeAlertCount: 120,
    name: "Living room by the garden window",
    readings: [
      {
        metric: "illuminance",
        value: 100000,
        unit: "lux",
        fractionDigits: 0,
        connectionStatus: "stale",
      },
      {
        metric: "pm25",
        value: 12,
        unit: "ug-m3",
        fractionDigits: 0,
        connectionStatus: "connected",
      },
    ],
    faults: [{ faultCode: "calibration_required", metric: "co2" }],
  },
  parameters: { width: "240px" },
};

// Numbers and States together: a door, a window, Motion with since-when, and Smoke.
const NOW = new Date(2026, 10, 7, 14, 5);
const HALLWAY_READINGS: SpaceCardReading[] = [
  {
    metric: "temperature",
    value: 19.5,
    unit: "celsius",
    fractionDigits: 1,
    connectionStatus: "connected",
  },
  {
    metric: "contact",
    state: "open",
    asset: { name: "Front door", assetType: "door" },
    alertLevel: "info",
    connectionStatus: "connected",
  },
  {
    metric: "contact",
    state: "closed",
    asset: { name: "Hall window", assetType: "window" },
    connectionStatus: "connected",
  },
  {
    metric: "motion",
    state: "detected",
    detectedSince: new Date(NOW.getTime() - 3 * 60_000),
    connectionStatus: "connected",
  },
  { metric: "smoke", state: "clear", connectionStatus: "connected" },
];

export const WithStates: Story = {
  args: { name: "Hallway", readings: HALLWAY_READINGS },
};

// A Critical Alert: Smoke Detected in the Kitchen. The Badge next to the name counts it.
export const SmokeAlert: Story = {
  args: {
    name: "Kitchen",
    activeAlertCount: 1,
    highestAlertLevel: "critical",
    readings: [
      BEDROOM_READINGS[0],
      {
        metric: "smoke",
        state: "detected",
        alertLevel: "critical",
        detectedSince: new Date(NOW.getTime() - 60_000),
        connectionStatus: "connected",
      },
    ],
  },
};

// Active Alerts on Readings the card shows normally, e.g. two Warning rules (too warm, too humid).
export const ActiveAlerts: Story = {
  args: { activeAlertCount: 2, highestAlertLevel: "warning" },
};

// Stress story: the smallest case, one row and a zero value.
export const Minimal: Story = {
  args: {
    name: "Hall",
    readings: [{ ...BEDROOM_READINGS[3], value: 0 }],
  },
  parameters: { width: "240px" },
};
