import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../../icons/Icon";
import { IconTile } from "./IconTile";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Layout/IconTile",
  component: IconTile,
  args: {
    children: <Icon name="countertops" />,
  },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

// One variant: a neutral box around a 24px icon, as at the start of a list row.
export const Default: Story = {};

// An icon that carries its own colour and label keeps both, e.g. an Alert Level in AlertListItem.
export const ColouredIcon: Story = {
  args: {
    children: (
      <span
        style={{ color: "var(--shk-status-danger-fg)", display: "inline-flex" }}
      >
        <Icon name="error-fill" label="Critical" />
      </span>
    ),
  },
};

// Stress story: the tile never shrinks, even in a very narrow box.
export const LongText: Story = {
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "40px", display: "flex", gap: 8 }}>
        <Story />
        <span>Open-plan desk zone</span>
      </div>
    ),
  ],
};

// The smallest case: only the required icon.
export const Minimal: Story = {
  args: { children: <Icon name="home" /> },
};
