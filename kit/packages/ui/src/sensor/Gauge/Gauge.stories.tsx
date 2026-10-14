import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gauge } from "./Gauge";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Sensor/Gauge",
  component: Gauge,
  args: { label: "Kitchen", value: 22.4, unit: "°C" },
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Each export is one story: the same component with different props.
export const Temperature: Story = {};

export const Humidity: Story = {
  args: { label: "Bathroom", value: 64, unit: "%" },
};
