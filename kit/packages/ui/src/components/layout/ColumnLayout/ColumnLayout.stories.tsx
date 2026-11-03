import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModuleCard, type ModuleCardSensor } from "../../readings/ModuleCard";
import { ColumnLayout } from "./ColumnLayout";

const CLIMATE_SENSORS: ModuleCardSensor[] = [
  { metric: "temperature", value: 22.4, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
];

const LIGHT_SENSORS: ModuleCardSensor[] = [
  { metric: "illuminance", value: 320, unit: "lux", fractionDigits: 0 },
];

const AIR_QUALITY_SENSORS: ModuleCardSensor[] = [
  { metric: "co2", value: 1250, unit: "ppm", fractionDigits: 0 },
  { metric: "voc", value: 120, unit: "ppb", fractionDigits: 0 },
  { metric: "pm25", value: 12, unit: "ug-m3", fractionDigits: 0 },
];

const climateCard = (
  <ModuleCard
    name="Climate Module"
    sensors={CLIMATE_SENSORS}
    connectionStatus="connected"
  />
);

const lightCard = (
  <ModuleCard
    name="Light Module"
    sensors={LIGHT_SENSORS}
    connectionStatus="connected"
  />
);

const airQualityCard = (
  <ModuleCard
    name="Air Quality Module"
    sensors={AIR_QUALITY_SENSORS}
    connectionStatus="connected"
  />
);

const longNameCard = (
  <ModuleCard
    name="Bedroom ceiling Air Quality Module near the window"
    sensors={AIR_QUALITY_SENSORS}
    connectionStatus="connected"
  />
);

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Layout/ColumnLayout",
  component: ColumnLayout,
  args: {
    ratio: "equal",
    children: (
      <>
        {climateCard}
        {lightCard}
        {airQualityCard}
      </>
    ),
  },
  // Show `ratio` as a dropdown of the three options in the Controls panel.
  // `children` is real components, so it has no control.
  argTypes: {
    ratio: { control: "select", options: ["equal", "2:1", "1:2"] },
    children: { control: false },
  },
  // The layout fills its parent, so every story sits in a box. A story can set its width with
  // `parameters`. Drag the corner to see the layout respond to its own width.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "1124px",
          maxInlineSize: "100%",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColumnLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per ratio, matching the Figma variants.
export const Equal: Story = {};

export const TwoToOne: Story = {
  name: "2:1",
  args: {
    ratio: "2:1",
    children: (
      <>
        {airQualityCard}
        {climateCard}
      </>
    ),
  },
  parameters: { width: "1108px" },
};

export const OneToTwo: Story = {
  name: "1:2",
  args: {
    ratio: "1:2",
    children: (
      <>
        {climateCard}
        {airQualityCard}
      </>
    ),
  },
  parameters: { width: "1108px" },
};

// Below 592px, 2:1 falls back to one column, in the same reading order.
export const NarrowContainer: Story = {
  args: TwoToOne.args,
  parameters: { width: "360px" },
};

// equal wraps onto new rows, so it also works as the Site grid.
export const EqualWraps: Story = {
  args: {
    children: (
      <>
        {climateCard}
        {lightCard}
        {airQualityCard}
        {climateCard}
        {lightCard}
      </>
    ),
  },
  parameters: { width: "760px" },
};

// Stress story: long names in a narrow container. The layout stays as wide as its parent.
export const LongText: Story = {
  args: {
    ratio: "2:1",
    children: (
      <>
        {longNameCard}
        {longNameCard}
      </>
    ),
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case. One child fills the width, even at 2:1.
export const Minimal: Story = {
  args: { ratio: "2:1", children: climateCard },
  parameters: { width: "760px" },
};
