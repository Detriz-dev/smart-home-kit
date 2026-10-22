import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconPaths, type IconName } from "../generated/paths";
import { Icon } from "./Icon";

const iconNames = Object.keys(iconPaths) as IconName[];

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Icons/Icon",
  component: Icon,
  args: { name: "thermostat", size: "md" },
  // Show `name` and `size` as dropdowns in the Controls panel.
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Decorative: hidden from screen readers.
export const Default: Story = {};

// Meaningful: screen readers announce "Disconnected".
export const WithLabel: Story = {
  args: { name: "wifi_off", label: "Disconnected" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

// Colour comes from the surrounding text colour, so set `color` on a parent.
export const InheritsColour: Story = {
  args: { name: "error", label: "Fault" },
  decorators: [
    (Story) => (
      <span style={{ color: "var(--shk-status-warning-solid)" }}>
        <Story />
      </span>
    ),
  ],
};

// Every icon in icons.config.ts, with its name. Use it to check the set at a glance.
export const AllIcons: Story = {
  render: (args) => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(var(--shk-size-24), 1fr))",
        gap: "var(--shk-space-4)",
        padding: 0,
        listStyle: "none",
        fontFamily: "var(--shk-typography-caption-font-family)",
        fontSize: "var(--shk-typography-caption-font-size)",
      }}
    >
      {iconNames.map((name) => (
        <li
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--shk-space-1)",
          }}
        >
          <Icon name={name} size={args.size} />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};
