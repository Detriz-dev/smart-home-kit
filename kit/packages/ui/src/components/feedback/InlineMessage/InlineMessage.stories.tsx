import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineMessage } from "./InlineMessage";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Every story sits in a 400px box, the width of the Figma variants.
const meta = {
  title: "Feedback/InlineMessage",
  component: InlineMessage,
  args: {
    tone: "info",
    title: "Readings refresh automatically",
    children: "New Readings appear every 30 seconds.",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "400px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per tone, with the spec's example values.
export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    title: "Settings saved",
    children: "Your Spaces now use the new names.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Some Spaces didn't load",
    children: "Showing 4 of 6 Spaces.",
  },
};

export const Error: Story = {
  args: {
    tone: "error",
    title: "Couldn't load Readings",
    children: "Check that the Hub is on the same network.",
  },
};

// With the optional action: the Retry button sits to the right of the text.
export const WithAction: Story = {
  args: {
    tone: "error",
    title: "Couldn't load Readings",
    children: "Check that the Hub is on the same network.",
    actionLabel: "Retry",
    onAction: () => {},
  },
};

// Without a title: only the message, for short confirmations.
export const WithoutTitle: Story = {
  args: {
    tone: "success",
    title: undefined,
    children: "Settings saved.",
  },
};

// With the × button. Tab to it to see the focus ring.
export const Dismissible: Story = {
  args: {
    tone: "warning",
    title: "Some Spaces didn't load",
    children: "Showing 4 of 6 Spaces.",
    actionLabel: "Retry",
    onAction: () => {},
    onDismiss: () => {},
  },
};

// The longest realistic message with every part, in a 240px box:
// the text wraps, Retry moves to the next line and the × stays on the right.
export const LongText: Story = {
  args: {
    tone: "error",
    title: "Couldn't load Readings",
    children:
      "Check that the Hub is on the same network as your phone or computer, then try again.",
    actionLabel: "Try again",
    onAction: () => {},
    onDismiss: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "240px" }}>
        <Story />
      </div>
    ),
  ],
};

// The smallest case: only the required props.
export const Minimal: Story = {
  args: {
    tone: "success",
    title: undefined,
    children: "Saved.",
  },
};
