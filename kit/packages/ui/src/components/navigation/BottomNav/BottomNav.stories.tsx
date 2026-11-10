import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNav } from "./BottomNav";
import type { BottomNavItem } from "./BottomNav.types";

// The example values from BottomNav.md, the same as Figma. "#" hrefs keep Storybook on the same page.
const HOME: BottomNavItem = { label: "Home", icon: "home", href: "#/" };
const SPACES: BottomNavItem = {
  label: "Spaces",
  icon: "door_front",
  href: "#/spaces",
};
const DEVICES: BottomNavItem = {
  label: "Devices",
  icon: "sensors",
  href: "#/devices",
};
const HISTORY: BottomNavItem = {
  label: "History",
  icon: "monitoring",
  href: "#/history",
};
const SETTINGS: BottomNavItem = {
  label: "Settings",
  icon: "settings",
  href: "#/settings",
};
const ALERTS: BottomNavItem = {
  label: "Alerts",
  icon: "notifications_active",
  href: "#/alerts",
};
const current = (item: BottomNavItem) => ({ ...item, isCurrent: true });

// Where the component appears in Storybook's sidebar, and the props every story starts with.
const meta = {
  title: "Navigation/BottomNav",
  component: BottomNav,
  args: {
    items: [current(HOME), DEVICES, HISTORY, SETTINGS],
    label: "Main",
  },
  argTypes: {
    items: { control: "object" },
  },
  // The bar fills its parent. Stories show it at a phone's width (390px; the app floats it 16px from the
  // edges, so 358px wide); a story can change it with `parameters`.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "358px",
          resize: "horizontal",
          overflow: "auto",
          // Room for the bar's shadow, which overflow would otherwise cut off.
          padding: "var(--shk-space-2)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// Four sections, Home current. Hover, pressed and focus come from the browser:
// point at an item, click it, or press Tab.
export const Default: Story = {};

// Three sections, Devices current.
export const ThreeItems: Story = {
  args: { items: [HOME, current(DEVICES), SETTINGS] },
};

// Five sections, the most a phone has room for. History current.
export const FiveItems: Story = {
  args: { items: [HOME, SPACES, DEVICES, current(HISTORY), SETTINGS] },
};

// A Badge on the Alerts tab: 3 Active Alerts, the highest Critical. A count of 0 shows nothing.
export const WithBadge: Story = {
  args: {
    items: [
      current(HOME),
      SPACES,
      {
        ...ALERTS,
        badge: { count: 3, label: "3 active Alerts", tone: "critical" },
      },
      SETTINGS,
    ],
  },
};

// Stress story: five items with long labels in 288px (a 320px phone minus 16px each side). Labels end with "…"; icons stay whole.
export const LongText: Story = {
  args: {
    items: [
      current(HOME),
      DEVICES,
      { label: "Air quality history", icon: "monitoring", href: "#/history" },
      {
        label: "Notifications and alerts",
        icon: "settings",
        href: "#/alerts",
      },
      SETTINGS,
    ],
  },
  parameters: { width: "288px" },
};

// Stress story: the smallest case, three items in 288px.
export const Minimal: Story = {
  args: { items: [current(HOME), DEVICES, SETTINGS] },
  parameters: { width: "288px" },
};
