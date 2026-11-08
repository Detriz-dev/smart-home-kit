import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import {
  ALERT_ICONS,
  NAV_ICONS,
  PLACE_ICONS,
  SPACE_TYPE_ICONS,
} from "../icons/purposeIcons";
import { AlertRuleLabel } from "../components/context/AlertRuleLabel";
import { SpaceListItem } from "../components/context/SpaceListItem";
import { AlertBanner } from "../components/feedback/AlertBanner";
import { ContentSection } from "../components/layout/ContentSection";
import { FloorSection } from "../components/layout/FloorSection";
import { List } from "../components/layout/List";
import { StackLayout } from "../components/layout/StackLayout";
import { BottomNav } from "../components/navigation/BottomNav";
import type { BottomNavItem } from "../components/navigation/BottomNav";
import { TopBar } from "../components/navigation/TopBar";
import { SensorReading } from "../components/readings/SensorReading";
import { SensorState } from "../components/readings/SensorState";
import { AlertListItem } from "../components/status/AlertListItem";
import { DeviceListItem } from "../components/status/DeviceListItem";

/*
 * Example screens: whole phone screens built only from kit components, to show they work together.
 * Not part of the kit's API (not exported). One sample Site, "My flat", shared by both screens, so
 * the numbers match: 2 Active Alerts in the Site (Smoke in the Kitchen, Critical; too warm in the
 * Living room, Warning). The Figma "Example Screens" page shows the same screens with the same data.
 */

// A fixed "now" (7 Nov 2026, 14:05), so times always read the same.
const NOW = new Date(2026, 10, 7, 14, 5);
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

// The app's main sections. Alerts gets a Badge: 2 Active Alerts, the highest Critical.
const nav = (current: "home" | "spaces"): BottomNavItem[] => [
  {
    label: "Home",
    icon: NAV_ICONS.home,
    href: "#/",
    isCurrent: current === "home",
  },
  {
    label: "Spaces",
    icon: NAV_ICONS.spaces,
    href: "#/spaces",
    isCurrent: current === "spaces",
  },
  {
    label: "Alerts",
    icon: ALERT_ICONS.active,
    href: "#/alerts",
    badge: { count: 2, label: "2 active Alerts", tone: "critical" },
  },
  { label: "Settings", icon: NAV_ICONS.settings, href: "#/settings" },
];

// A phone screen: top bar, scrolling content, bottom bar. Layout only, no kit component does this.
const screen: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  inlineSize: 390,
  blockSize: 844,
  overflow: "hidden",
  border: "var(--shk-border-width-thin) solid var(--shk-color-border-subtle)",
  background: "var(--shk-surface-page)",
};
const content: CSSProperties = {
  flex: "1 1 auto",
  overflowY: "auto",
  padding: "var(--shk-space-4)",
};

function PhoneScreen({
  top,
  bottom,
  children,
}: {
  top: ReactNode;
  bottom: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={screen}>
      {top}
      <main style={content}>{children}</main>
      {bottom}
    </div>
  );
}

const meta: Meta = {
  title: "Examples/Screens",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

// The Site's home: the most urgent Alert on top, then every Space by Floor.
export const SiteOverview: Story = {
  render: () => (
    <PhoneScreen
      top={<TopBar title="My flat" icon={PLACE_ICONS.site} />}
      bottom={<BottomNav items={nav("home")} />}
    >
      <StackLayout gap="lg">
        <AlertBanner
          title="Smoke detected"
          alertLevel="critical"
          spaceName="Kitchen"
          raisedAt={minutesAgo(2)}
          now={NOW}
          actionLabel="View"
          onAction={() => {}}
          onClose={() => {}}
        />
        <FloorSection name="Ground floor" spaceCount={3}>
          <List label="Spaces on the Ground floor">
            <SpaceListItem
              name="Kitchen"
              spaceType="kitchen"
              moduleCount={4}
              activeAlertCount={1}
              highestAlertLevel="critical"
              href="#/spaces/kitchen"
            />
            <SpaceListItem
              name="Living room"
              spaceType="living-room"
              moduleCount={3}
              activeAlertCount={1}
              highestAlertLevel="warning"
              href="#/spaces/living-room"
            />
            <SpaceListItem
              name="Hallway"
              spaceType="hallway"
              moduleCount={2}
              href="#/spaces/hallway"
            />
          </List>
        </FloorSection>
        <FloorSection name="First floor" spaceCount={3}>
          <List label="Spaces on the First floor">
            <SpaceListItem
              name="Bedroom"
              spaceType="bedroom"
              moduleCount={2}
              href="#/spaces/bedroom"
            />
            <SpaceListItem
              name="Bathroom"
              spaceType="bathroom"
              moduleCount={1}
              href="#/spaces/bathroom"
            />
            <SpaceListItem
              name="Office"
              spaceType="office"
              moduleCount={2}
              href="#/spaces/office"
            />
          </List>
        </FloorSection>
      </StackLayout>
    </PhoneScreen>
  ),
};

// One Space: its Readings (with the Alert Rules worth showing), its Alerts and its Modules.
export const SpaceDetail: Story = {
  render: () => (
    <PhoneScreen
      top={
        <TopBar
          title="Kitchen"
          icon={SPACE_TYPE_ICONS.kitchen}
          backHref="#/"
          backLabel="Back to My flat"
        />
      }
      bottom={<BottomNav items={nav("spaces")} />}
    >
      <StackLayout gap="lg">
        <AlertBanner
          title="Smoke detected"
          alertLevel="critical"
          raisedAt={minutesAgo(2)}
          now={NOW}
          onClose={() => {}}
        />
        <ContentSection title="Readings" headingLevel={2}>
          <StackLayout gap="sm">
            <SensorState
              metric="smoke"
              state="detected"
              alertLevel="critical"
            />
            <SensorReading
              metric="temperature"
              value={23.1}
              unit="celsius"
              size="md"
            />
            <AlertRuleLabel
              condition={{
                metric: "temperature",
                comparison: "above",
                value: 28,
              }}
              unit="celsius"
            />
            <SensorReading
              metric="humidity"
              value={52}
              unit="percent-rh"
              fractionDigits={0}
              size="md"
            />
            <SensorState
              metric="contact"
              state="closed"
              asset={{ name: "Kitchen window", assetType: "window" }}
              size="md"
            />
            <AlertRuleLabel condition={{ metric: "contact", state: "open" }} />
            <SensorState
              metric="power"
              state="on"
              asset={{ name: "Dishwasher", assetType: "appliance" }}
              size="md"
            />
          </StackLayout>
        </ContentSection>
        <ContentSection title="Alerts" headingLevel={2}>
          <List label="Alerts in the Kitchen">
            <AlertListItem
              title="Smoke detected"
              alertLevel="critical"
              alertStatus="active"
              raisedAt={minutesAgo(2)}
              now={NOW}
              href="#/alerts/smoke"
            />
            <AlertListItem
              title="Kitchen window open"
              alertLevel="warning"
              alertStatus="ended"
              raisedAt={minutesAgo(190)}
              endedAt={minutesAgo(170)}
              now={NOW}
              href="#/alerts/window"
            />
          </List>
        </ContentSection>
        <ContentSection title="Modules" headingLevel={2}>
          <List label="Modules in the Kitchen">
            <DeviceListItem
              name="Smoke Module"
              deviceKind="module"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/smoke"
            />
            <DeviceListItem
              name="Climate Module"
              deviceKind="module"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/climate"
            />
            <DeviceListItem
              name="Contact Module"
              deviceKind="module"
              pairingStatus="paired"
              connectionStatus="stale"
              href="#/devices/contact"
            />
            <DeviceListItem
              name="Power Module"
              deviceKind="module"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/power"
            />
          </List>
        </ContentSection>
      </StackLayout>
    </PhoneScreen>
  ),
};
