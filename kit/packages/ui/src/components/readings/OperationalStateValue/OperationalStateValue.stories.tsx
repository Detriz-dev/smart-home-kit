import type { Meta, StoryObj } from "@storybook/react-vite";
import { OperationalStateValue } from "./OperationalStateValue";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: a kettle, Running · Heating, size md.
const meta = {
  title: "Readings/OperationalStateValue",
  component: OperationalStateValue,
  args: {
    state: "running",
    phase: "Heating",
    isDisconnected: false,
    size: "md",
  },
  argTypes: {
    state: {
      control: "select",
      options: [null, "stopped", "running", "paused", "error"],
    },
    size: { control: "inline-radio", options: ["md", "lg"] },
    alertLevel: {
      control: "select",
      options: [undefined, "critical", "warning", "info"],
    },
  },
} satisfies Meta<typeof OperationalStateValue>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Stopped: Story = {
  args: { state: "stopped", phase: undefined },
};

export const Running: Story = {
  args: { phase: undefined },
};

// Running with a Phase, as the kettle reports it.
export const RunningWithPhase: Story = {};

export const KeepingWarm: Story = {
  args: { phase: "Keeping warm" },
};

// A washing machine paused mid-programme. The Phase is only shown while Running.
export const Paused: Story = {
  args: { state: "paused", phase: "Rinsing" },
};

// The Device's own Error Reason, with its label.
export const ErrorOwnReason: Story = {
  args: {
    state: "error",
    phase: undefined,
    errorReason: { code: "no-water", label: "No water" },
  },
};

// A general Error Reason caused by a Fault: one message names both.
export const ErrorFromFault: Story = {
  args: {
    state: "error",
    phase: undefined,
    errorReason: {
      code: "unable-to-start-or-resume",
      faultCode: "sensor_failure",
    },
  },
};

export const ErrorAlone: Story = {
  args: { state: "error", phase: undefined },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

export const Large: Story = {
  args: { size: "lg" },
};

// Stress story: a long Error Reason, large, in a narrow container. The reason moves under the pill and wraps.
export const LongText: Story = {
  args: {
    state: "error",
    phase: undefined,
    errorReason: {
      code: "water-low",
      label: "Water level too low to start heating",
    },
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "200px" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { state: "stopped", phase: undefined, size: "md" },
};
