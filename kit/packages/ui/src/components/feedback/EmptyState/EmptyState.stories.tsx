import type { Meta, StoryObj } from "@storybook/react-vite";
import { ALERT_ICONS, NAV_ICONS } from "../../../icons/purposeIcons";
import { EmptyState } from "./EmptyState";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// The default matches the Figma component: a Site with no Spaces.
const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    title: "No Spaces yet",
    message: "Spaces you add to the Site in your app show up here.",
    icon: NAV_ICONS.spaces,
    actionLabel: "View setup guide",
    onAction: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 4)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// The three Figma examples.
export const NoSpaces: Story = {};

export const AllClear: Story = {
  args: {
    title: "All clear",
    message: "No Alerts are Active.",
    icon: ALERT_ICONS.default,
    actionLabel: undefined,
    onAction: undefined,
  },
};

// Stress story: a long title and message in a narrow container. Both wrap and stay centred.
export const LongText: Story = {
  args: {
    title: "This Space doesn't have any Paired Modules yet",
    message:
      "Once a Device in this Space is paired, its Readings show up here.",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 2.5)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, a title only.
export const Minimal: Story = {
  args: {
    title: "No Modules",
    message: undefined,
    icon: undefined,
    actionLabel: undefined,
    onAction: undefined,
  },
};
