import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocationPath } from "../../navigation/LocationPath";
import { DeviceCard, type DeviceCardSensor } from "../../readings/DeviceCard";
import { StackLayout } from "./StackLayout";

const CLIMATE_SENSORS: DeviceCardSensor[] = [
  { metric: "temperature", value: 22.4, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
];

const AIR_QUALITY_SENSORS: DeviceCardSensor[] = [
  { metric: "co2", value: 1250, unit: "ppm", fractionDigits: 0 },
  { metric: "voc", value: 120, unit: "ppb", fractionDigits: 0 },
  { metric: "pm25", value: 12, unit: "ug-m3", fractionDigits: 0 },
];

const climateCard = (
  <DeviceCard
    name="Climate Module"
    sensors={CLIMATE_SENSORS}
    connectionStatus="connected"
  />
);

const airQualityCard = (
  <DeviceCard
    name="Air Quality Module"
    sensors={AIR_QUALITY_SENSORS}
    connectionStatus="connected"
  />
);

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Layout/StackLayout",
  component: StackLayout,
  args: {
    gap: "md",
    children: (
      <>
        <LocationPath
          siteName="My flat"
          floorName="Level 2"
          spaceName="Bedroom"
        />
        {climateCard}
        {airQualityCard}
      </>
    ),
  },
  // Show `gap` as a dropdown of the three options in the Controls panel.
  // `children` is real components, so it has no control.
  argTypes: {
    gap: { control: "select", options: ["sm", "md", "lg"] },
    children: { control: false },
  },
  // The stack fills its parent, so every story sits in a box. A story can set its width with
  // `parameters`. Drag the corner to try other widths.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "536px",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StackLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per gap, matching the Figma variants.
export const GapSm: Story = {
  args: { gap: "sm" },
};

export const GapMd: Story = {};

export const GapLg: Story = {
  args: { gap: "lg" },
};

// Stress story: long names in a narrow container. The stack stays as wide as its parent.
export const LongText: Story = {
  args: {
    children: (
      <>
        <LocationPath
          siteName="Grandparents' summer house by the lake"
          spaceName="Kitchen and dining area on the ground floor"
        />
        {climateCard}
      </>
    ),
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, one child and so no gap.
export const Minimal: Story = {
  args: { children: climateCard },
  parameters: { width: "364px" },
};
