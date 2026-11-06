import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../icons/Icon";
import type { Metric } from "../../../types/metric";
import { SensorLabel } from "../../context/SensorLabel";
import { SPACE_TYPE_ICONS } from "../../context/SpaceLabel";
import { ReadingValue } from "../../readings/ReadingValue";
import { UnitLabel, type UnitLabelUnit } from "../../readings/UnitLabel";
import { Card } from "../Card";
import { ListItem } from "../ListItem";
import { List } from "./List";

// The example values from List.md, the same as Figma.
const ROOMS = [
  { spaceType: "kitchen", name: "Kitchen", floor: "Ground floor", value: 22.4 },
  { spaceType: "bedroom", name: "Bedroom", floor: "Level 2", value: 20.1 },
  { spaceType: "bathroom", name: "Bathroom", floor: "Level 2", value: 23.0 },
  {
    spaceType: "living-room",
    name: "Living room",
    floor: "Ground floor",
    value: 21.8,
  },
] as const;

const roomRows = ROOMS.map((room) => (
  <ListItem
    key={room.name}
    start={<Icon name={SPACE_TYPE_ICONS[room.spaceType]} />}
    title={room.name}
    description={room.floor}
    end={
      <>
        <ReadingValue value={room.value} size="sm" />
        <UnitLabel unit="celsius" size="sm" />
      </>
    }
    href={`#/spaces/${room.spaceType}`}
  />
));

const READINGS: {
  metric: Metric;
  value: number;
  unit: UnitLabelUnit;
  fractionDigits: number;
}[] = [
  { metric: "temperature", value: 20.1, unit: "celsius", fractionDigits: 1 },
  { metric: "humidity", value: 48, unit: "percent-rh", fractionDigits: 0 },
  { metric: "co2", value: 840, unit: "ppm", fractionDigits: 0 },
];

const readingRows = READINGS.map((reading) => (
  <ListItem
    key={reading.metric}
    start={<SensorLabel metric={reading.metric} size="sm" />}
    end={
      <>
        <ReadingValue
          value={reading.value}
          fractionDigits={reading.fractionDigits}
          size="sm"
        />
        <UnitLabel unit={reading.unit} size="sm" />
      </>
    }
  />
));

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Layout/List",
  component: List,
  args: {
    hasDividers: true,
    label: "Rooms",
    children: roomRows,
  },
  argTypes: {
    children: { control: false },
  },
  // The list fills its parent, so every story sits in a box. Drag the corner to try other widths.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "360px",
          resize: "horizontal",
          overflow: "auto",
          padding: "8px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per Figma variant.

// hasDividers=true: the rooms of a flat, each row clickable.
export const WithDividers: Story = {};

// hasDividers=false: the same rooms, separated by space only.
export const WithoutDividers: Story = {
  args: { hasDividers: false },
};

// A typical use: the Readings of a Space in a Card. The card's title names the list, so no label.
export const ReadingsInCard: Story = {
  args: { hasDividers: false, label: undefined, children: readingRows },
  render: (args) => (
    <Card icon="bed" title="Bedroom">
      <List {...args} />
    </Card>
  ),
};

// Stress story: rows with long names in a narrow container. Every row keeps its value whole.
export const LongText: Story = {
  args: {
    children: [
      <ListItem
        key="living-room"
        start={<Icon name="weekend" />}
        title="Living room and dining area by the garden"
        description="Ground floor, east wing"
        end={
          <>
            <ReadingValue value={21.8} size="sm" />
            <UnitLabel unit="celsius" size="sm" />
          </>
        }
        href="#/spaces/living-room"
      />,
      ...roomRows.slice(0, 2),
    ],
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, one row.
export const Minimal: Story = {
  args: { label: undefined, children: <ListItem title="Kitchen" /> },
};
