import type { Meta, StoryObj } from "@storybook/react-vite";
import { StateValue } from "./StateValue";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec: Power On, size md.
const meta = {
  title: "Readings/StateValue",
  component: StateValue,
  args: {
    metric: "power",
    state: "on",
    isDisconnected: false,
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    alertLevel: {
      control: "select",
      options: [undefined, "critical", "warning", "info"],
    },
  },
} satisfies Meta<typeof StateValue>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Inactive: Story = {
  args: { metric: "power", state: "off" },
};

export const Active: Story = {};

export const AlertCritical: Story = {
  args: { metric: "smoke", state: "detected", alertLevel: "critical" },
};

export const AlertWarning: Story = {
  args: { metric: "contact", state: "open", alertLevel: "warning" },
};

export const AlertInfo: Story = {
  args: { metric: "motion", state: "detected", alertLevel: "info" },
};

export const Loading: Story = {
  args: { state: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// The other size. md is the default above.
export const Large: Story = {
  args: { size: "lg" },
};

// Operational State Error: red, like a Fault, with the error icon.
export const OperationalError: Story = {
  args: { metric: "operational-state", state: "error" },
};

// Every Metric in each of its States, so the icons and words can be checked together.
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--shk-space-2)" }}>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="power" state="on" />
        <StateValue {...args} metric="power" state="off" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="contact" state="open" />
        <StateValue {...args} metric="contact" state="closed" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="motion" state="detected" />
        <StateValue {...args} metric="motion" state="clear" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="smoke" state="detected" />
        <StateValue {...args} metric="smoke" state="clear" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="co" state="detected" />
        <StateValue {...args} metric="co" state="clear" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="open-close" state="open" />
        <StateValue {...args} metric="open-close" state="opening" />
        <StateValue {...args} metric="open-close" state="closing" />
        <StateValue {...args} metric="open-close" state="closed" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="mode" state="heat" />
        <StateValue {...args} metric="mode" state="off" />
      </div>
      <div style={{ display: "flex", gap: "var(--shk-space-2)" }}>
        <StateValue {...args} metric="operational-state" state="running" />
        <StateValue {...args} metric="operational-state" state="paused" />
        <StateValue {...args} metric="operational-state" state="stopped" />
        <StateValue {...args} metric="operational-state" state="error" />
      </div>
    </div>
  ),
};

// Stress story: the longest word, large, in a narrow container. The pill never wraps or truncates.
export const LongText: Story = {
  args: {
    metric: "smoke",
    state: "detected",
    alertLevel: "critical",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "var(--shk-size-24)", overflow: "visible" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case.
export const Minimal: Story = {
  args: { metric: "power", state: "on", size: "md" },
};
