import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocationPath } from "../../navigation/LocationPath";
import { ModuleCard, type ModuleCardSensor } from "../../readings/ModuleCard";
import { ContentSection } from "./ContentSection";

const CLIMATE_SENSORS: ModuleCardSensor[] = [
  { metric: "temperature", value: 22.4, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
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

const airQualityCard = (
  <ModuleCard
    name="Air Quality Module"
    sensors={AIR_QUALITY_SENSORS}
    connectionStatus="connected"
  />
);

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Layout/ContentSection",
  component: ContentSection,
  args: {
    title: "Bedroom",
    headingLevel: 2,
    children: (
      <>
        <LocationPath
          siteName="My flat"
          floorName="Level 2"
          spaceName="Bedroom"
        />
        {climateCard}
      </>
    ),
  },
  // Show `headingLevel` as a dropdown of the three levels in the Controls panel.
  // `title` gets a text box, so you can try long titles. `children` is real components, so it has no control.
  argTypes: {
    headingLevel: { control: "select", options: [2, 3, 4] },
    children: { control: false },
  },
  // The section fills its parent, so every story sits in a box. A story can set its width with
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
} satisfies Meta<typeof ContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per heading level, matching the Figma variants.

// The title of the whole generated screen.
export const HeadingLevel2: Story = {};

// A group on that screen.
export const HeadingLevel3: Story = {
  args: { title: "Air quality", headingLevel: 3, children: airQualityCard },
};

// A group inside a group.
export const HeadingLevel4: Story = {
  args: { title: "Comfort", headingLevel: 4, children: climateCard },
};

// Stress story: a long title in a narrow container. The title wraps onto more lines.
export const LongText: Story = {
  args: {
    title: "Air quality and comfort in the kitchen and dining area",
    headingLevel: 3,
    children: airQualityCard,
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, a short title above one child.
export const Minimal: Story = {
  args: { children: climateCard },
  parameters: { width: "364px" },
};
