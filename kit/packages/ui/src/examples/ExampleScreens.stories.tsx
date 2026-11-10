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
import { OpenCloseControl } from "../components/controls/OpenCloseControl";
import { OperationalStateControl } from "../components/controls/OperationalStateControl";
import { PowerControl } from "../components/controls/PowerControl";
import { StateSelectControl } from "../components/controls/StateSelectControl";
import { ValueControl } from "../components/controls/ValueControl";
import { DeviceCard } from "../components/readings/DeviceCard";
import { AlertListItem } from "../components/status/AlertListItem";
import { DeviceListItem } from "../components/status/DeviceListItem";

/*
 * Example screens: whole phone screens built only from kit components, to show they work together.
 * Not part of the kit's API (not exported). One sample Site, "My flat", shared by every screen, so
 * the numbers match: 2 Active Alerts in the Site (Smoke in the Kitchen, Critical; too warm in the
 * Living room, Warning). Each Space with Sensors has a Raspberry Pi Hub; Device counts include it.
 * The Kitchen also has a kettle, and the Living room heating, blinds, a power strip and a wireless
 * Motion Module (ADR 0002). The Figma "Example Screens" page shows the same screens with the same data.
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

// A phone screen: top bar, scrolling content, a bottom bar floating over it. Layout only, no kit component does this.
const screen: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  inlineSize: 390,
  blockSize: 844,
  overflow: "hidden",
  border: "var(--shk-border-width-thin) solid var(--shk-color-border-subtle)",
  background: "var(--shk-surface-page)",
};
// The content scrolls behind the bar, with room at the end so its last item can scroll above it.
const content: CSSProperties = {
  flex: "1 1 auto",
  overflowY: "auto",
  padding: "var(--shk-space-4)",
  paddingBlockEnd: "calc(var(--shk-size-16) + 3 * var(--shk-space-4))",
};
// The bar floats 16px from the screen's sides and bottom.
const bottomBar: CSSProperties = {
  position: "absolute",
  insetInline: "var(--shk-space-4)",
  insetBlockEnd: "var(--shk-space-4)",
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
      <div style={bottomBar}>{bottom}</div>
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
              deviceCount={6}
              activeAlertCount={1}
              highestAlertLevel="critical"
              href="#/spaces/kitchen"
            />
            <SpaceListItem
              name="Living room"
              spaceType="living-room"
              deviceCount={5}
              activeAlertCount={1}
              highestAlertLevel="warning"
              href="#/spaces/living-room"
            />
            <SpaceListItem
              name="Hallway"
              spaceType="hallway"
              deviceCount={3}
              href="#/spaces/hallway"
            />
          </List>
        </FloorSection>
        <FloorSection name="First floor" spaceCount={3}>
          <List label="Spaces on the First floor">
            <SpaceListItem
              name="Bedroom"
              spaceType="bedroom"
              deviceCount={3}
              href="#/spaces/bedroom"
            />
            <SpaceListItem
              name="Bathroom"
              spaceType="bathroom"
              deviceCount={2}
              href="#/spaces/bathroom"
            />
            <SpaceListItem
              name="Office"
              spaceType="office"
              deviceCount={3}
              href="#/spaces/office"
            />
          </List>
        </FloorSection>
      </StackLayout>
    </PhoneScreen>
  ),
};

// One Space: its Readings (with the Alert Rules worth showing), its Alerts, the kettle and its Devices.
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
        <ContentSection title="Controls" headingLevel={2}>
          <DeviceCard
            name="Kitchen kettle"
            connectionStatus="connected"
            controls={
              <OperationalStateControl
                name="Kettle"
                state="running"
                phase="Heating"
                allowedCommands={["start", "stop"]}
                onCommand={() => {}}
              />
            }
          />
        </ContentSection>
        <ContentSection title="Devices" headingLevel={2}>
          <List label="Devices in the Kitchen">
            <DeviceListItem
              name="Kitchen Hub"
              deviceKind="hub"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/kitchen-hub"
            />
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
            <DeviceListItem
              name="Kitchen kettle"
              deviceKind="standalone"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/kettle"
            />
          </List>
        </ContentSection>
      </StackLayout>
    </PhoneScreen>
  ),
};

// The Living room: too warm in the afternoon sun. The heating is Off, the blinds are closing,
// and the comfort range is two Alert Rules (below 18 °C, above 26 °C). Devices connected directly
// (heating, blinds, power strip) and a wireless Motion Module through the Living room Hub.
export const LivingRoomDetail: Story = {
  render: () => (
    <PhoneScreen
      top={
        <TopBar
          title="Living room"
          icon={SPACE_TYPE_ICONS["living-room"]}
          backHref="#/"
          backLabel="Back to My flat"
        />
      }
      bottom={<BottomNav items={nav("spaces")} />}
    >
      <StackLayout gap="lg">
        <AlertBanner
          title="Too warm"
          alertLevel="warning"
          raisedAt={minutesAgo(25)}
          now={NOW}
          onClose={() => {}}
        />
        <ContentSection title="Readings" headingLevel={2}>
          <StackLayout gap="sm">
            <SensorReading
              metric="temperature"
              value={26.8}
              unit="celsius"
              size="md"
            />
            <AlertRuleLabel
              condition={{
                metric: "temperature",
                comparison: "below",
                value: 18,
              }}
              unit="celsius"
            />
            <AlertRuleLabel
              condition={{
                metric: "temperature",
                comparison: "above",
                value: 26,
              }}
              unit="celsius"
            />
          </StackLayout>
        </ContentSection>
        <ContentSection title="Controls" headingLevel={2}>
          <StackLayout gap="md">
            <DeviceCard
              name="Living room heating"
              connectionStatus="connected"
              controls={
                <>
                  <ValueControl
                    name="Setpoint"
                    value={21}
                    unit="celsius"
                    min={0}
                    max={30}
                    step={0.5}
                    fractionDigits={1}
                    onCommit={() => {}}
                  />
                  <StateSelectControl
                    name="Mode"
                    metric="mode"
                    state="off"
                    onSelect={() => {}}
                  />
                </>
              }
            />
            <DeviceCard
              name="Living room blinds"
              connectionStatus="connected"
              controls={
                <>
                  <OpenCloseControl
                    name="Blinds"
                    state="closing"
                    allowedCommands={["open", "stop", "close"]}
                    onCommand={() => {}}
                  />
                  <ValueControl
                    name="Position"
                    value={40}
                    unit="percent"
                    min={0}
                    max={100}
                    step={1}
                    input="slider"
                    onCommit={() => {}}
                  />
                </>
              }
            />
            <DeviceCard
              name="Power strip"
              connectionStatus="connected"
              controls={
                <>
                  <PowerControl
                    name="TV"
                    state="on"
                    allowedCommands={["turn-on", "turn-off"]}
                    onCommand={() => {}}
                  />
                  <PowerControl
                    name="Floor lamp"
                    state="off"
                    allowedCommands={["turn-on", "turn-off"]}
                    onCommand={() => {}}
                  />
                  <PowerControl
                    name="Router"
                    state="on"
                    allowedCommands={["turn-on", "turn-off"]}
                    onCommand={() => {}}
                  />
                </>
              }
            />
          </StackLayout>
        </ContentSection>
        <ContentSection title="Devices" headingLevel={2}>
          <List label="Devices in the Living room">
            <DeviceListItem
              name="Living room Hub"
              deviceKind="hub"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/living-room-hub"
            />
            <DeviceListItem
              name="Motion Module"
              deviceKind="module"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/motion"
            />
            <DeviceListItem
              name="Living room heating"
              deviceKind="standalone"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/heating"
            />
            <DeviceListItem
              name="Living room blinds"
              deviceKind="standalone"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/blinds"
            />
            <DeviceListItem
              name="Power strip"
              deviceKind="standalone"
              pairingStatus="paired"
              connectionStatus="connected"
              href="#/devices/power-strip"
            />
          </List>
        </ContentSection>
      </StackLayout>
    </PhoneScreen>
  ),
};
