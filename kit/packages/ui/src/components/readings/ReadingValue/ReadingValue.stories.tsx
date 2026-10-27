import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadingValue } from "./ReadingValue";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values come from the spec's Example values (Temperature 22.4, one decimal place).
const meta = {
  title: "Readings/ReadingValue",
  component: ReadingValue,
  args: {
    value: 22.4,
    isDisconnected: false,
    fractionDigits: 1,
    size: "lg",
  },
  // Show `size` as a dropdown of the four sizes in the Controls panel.
  argTypes: {
    size: { control: "select", options: ["lg", "md", "sm", "xs"] },
    value: { control: "number" },
    fractionDigits: { control: { type: "number", min: 0, max: 3 } },
  },
} satisfies Meta<typeof ReadingValue>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching the Figma variants.
export const Default: Story = {};

export const Loading: Story = {
  args: { value: null },
};

export const Disconnected: Story = {
  args: { isDisconnected: true },
};

// One story per size. lg is the default above.
export const Medium: Story = {
  args: { size: "md" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const ExtraSmall: Story = {
  args: { size: "xs" },
};

// More example values from the spec: a negative number and a whole number with a thousands separator.
export const BelowZero: Story = {
  args: { value: -3.5 },
};

export const AirQuality: Story = {
  args: { value: 1250, fractionDigits: 0 },
};

// Stress story: the longest realistic value (bright daylight in lux) in a narrow container.
export const LongText: Story = {
  args: { value: 100000, fractionDigits: 0 },
  decorators: [
    (Story) => (
      <div
        style={{
          inlineSize: "calc(var(--shk-size-20) * 3)",
          resize: "horizontal",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, a single digit at the smallest size.
export const Minimal: Story = {
  args: { value: 0, fractionDigits: 0, size: "xs" },
};
