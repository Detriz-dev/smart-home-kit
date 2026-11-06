import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { LinkProvider } from "../../../link";
import { Button } from "../../controls/Button";
import { TopBar } from "./TopBar";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values from TopBar.md (a room's screen). Typed with Meta<typeof TopBar>: the props are a union.
const meta: Meta<typeof TopBar> = {
  title: "Navigation/TopBar",
  component: TopBar,
  args: {
    title: "Kitchen",
    icon: "countertops",
    backHref: "#/",
  },
  argTypes: {
    actions: { control: false },
  },
  // The bar fills its parent. Stories show it at a phone width; a story can change it with `parameters`.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "390px",
          resize: "horizontal",
          overflow: "auto",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopBar>;

// hasBack=true: a room's screen, back to the home screen. Hover, pressed and focus come from the
// browser: point at the arrow, click it, or press Tab.
export const Room: Story = {};

// The back button as a button, e.g. router.back().
export const BackButton: Story = {
  args: { backHref: undefined, onBack: () => {} },
};

// hasBack=false: a top-level screen with an action on the right.
export const Devices: Story = {
  args: {
    title: "Devices",
    icon: undefined,
    backHref: undefined,
    actions: (
      <Button variant="primary" onClick={() => {}}>
        Add Device
      </Button>
    ),
  },
};

// The home screen: the Site's name.
export const Home: Story = {
  args: { title: "My flat", icon: "home", backHref: undefined },
};

// With LinkProvider: the back link renders with the app's link component (here a stand-in that
// marks itself), the same way it would with next/link.
function DemoRouterLink(props: ComponentProps<"a">) {
  return <a {...props} data-router-link="true" />;
}

export const WithLinkProvider: Story = {
  decorators: [
    (Story) => (
      <LinkProvider component={DemoRouterLink}>
        <Story />
      </LinkProvider>
    ),
  ],
};

// Stress story: a long title with a back button and an action in 320px. The title ends with "…";
// the back button and the action keep their size.
export const LongText: Story = {
  args: {
    title: "Living room and dining area by the garden",
    icon: "weekend",
    actions: (
      <Button variant="primary" onClick={() => {}}>
        Add Device
      </Button>
    ),
  },
  parameters: { width: "320px" },
};

// Stress story: the smallest case, a title only.
export const Minimal: Story = {
  args: { title: "Devices", icon: undefined, backHref: undefined },
};
