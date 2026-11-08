import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadingValue } from "../ReadingValue";
import type { ReadingValueProps } from "../ReadingValue";
import { UnitLabel } from "./UnitLabel";
import type { UnitLabelProps, UnitLabelSize } from "./UnitLabel.types";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec's Example values (Temperature in °C, the default size).
const meta = {
  title: "Readings/UnitLabel",
  component: UnitLabel,
  args: {
    unit: "celsius",
    size: "lg",
  },
  // Show `unit` and `size` as dropdowns in the Controls panel.
  argTypes: {
    unit: {
      control: "select",
      options: [
        "celsius",
        "fahrenheit",
        "percent-rh",
        "percent",
        "lux",
        "ppm",
        "ppb",
        "ug-m3",
      ],
    },
    size: { control: "select", options: ["lg", "md", "sm", "xs"] },
  },
} satisfies Meta<typeof UnitLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: UnitLabelSize[] = ["lg", "md", "sm", "xs"];

// One story per Unit, matching the Figma variants, at the size from the spec's Example values.
export const Celsius: Story = {};

export const Fahrenheit: Story = {
  args: { unit: "fahrenheit" },
};

export const PercentRh: Story = {
  args: { unit: "percent-rh", size: "md" },
};

export const Lux: Story = {
  args: { unit: "lux", size: "xs" },
};

export const Ppm: Story = {
  args: { unit: "ppm", size: "sm" },
};

// All four sizes side by side, on one baseline. sm and xs look the same on purpose.
export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "var(--shk-space-6)",
      }}
    >
      {SIZES.map((size) => (
        <UnitLabel key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** One ReadingValue + UnitLabel pair, laid out the way the spec's "Pairing with ReadingValue" says. */
function Pair({
  unit,
  size,
  ...reading
}: UnitLabelProps & Omit<ReadingValueProps, "size">) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "var(--shk-space-1)",
      }}
    >
      <ReadingValue {...reading} size={size} />
      <UnitLabel unit={unit} size={size} />
    </span>
  );
}

// The pairs from the spec's Example values at every size, plus loading and Disconnected.
// Checks that the Unit sits on the number's baseline in code, like in the Figma usage frame.
export const WithReadingValue: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--shk-space-6)",
      }}
    >
      <Pair unit="celsius" size="lg" value={22.4} />
      <Pair unit="percent-rh" size="md" value={48} fractionDigits={0} />
      <Pair unit="ppm" size="sm" value={1250} fractionDigits={0} />
      <Pair unit="lux" size="xs" value={320} fractionDigits={0} />
      <Pair unit="fahrenheit" size="lg" value={72.3} />
      <Pair unit="celsius" size="md" value={null} />
      <Pair unit="celsius" size="md" value={22.4} isDisconnected />
    </div>
  ),
};

// Stress story: the widest symbol at the biggest size in a container that is too narrow.
// The dashed box is the container: "%RH" sticks out of it instead of wrapping or becoming "%R…".
export const LongText: Story = {
  args: { unit: "percent-rh", size: "lg" },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "var(--shk-size-10)",
          outline:
            "var(--shk-border-width-thin) dashed var(--shk-status-neutral-border)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, the shortest symbol at the smallest size, on its own.
export const Minimal: Story = {
  args: { unit: "lux", size: "xs" },
};

// Battery and Position. The shortest symbol in the list.
export const Percent: Story = {
  args: { unit: "percent", size: "md" },
};

// VOC, provisional until the Air Quality Module's sensor is chosen.
export const Ppb: Story = {
  args: { unit: "ppb", size: "md" },
};

// PM2.5. The longest symbol in the list.
export const MicrogramsPerCubicMetre: Story = {
  args: { unit: "ug-m3", size: "md" },
};
