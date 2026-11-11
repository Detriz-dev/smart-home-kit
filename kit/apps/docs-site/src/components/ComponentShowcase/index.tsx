import { useState, type ReactNode } from "react";
import {
  AlertBanner,
  AlertListItem,
  Badge,
  BottomNav,
  Button,
  Card,
  DeviceCard,
  DeviceListItem,
  EmptyState,
  IconButton,
  InlineMessage,
  List,
  LocationPath,
  OpenCloseControl,
  OperationalStateControl,
  PowerControl,
  SpaceCard,
  SpaceListItem,
  StateSelectControl,
  TopBar,
  ValueControl,
  type StateOf,
} from "@detriz-sh-kit/ui";

import styles from "./styles.module.css";

// A fixed "now", so the server and the browser print the same relative times
// ("5 min ago") and React doesn't warn about a mismatch.
const NOW = new Date("2026-01-15T18:00:00Z");
const minutesAgo = (minutes: number) =>
  new Date(NOW.getTime() - minutes * 60_000);

// The lamp, the thermostat and the blinds react to clicks, so the grid feels alive.
function LampsCard(): ReactNode {
  const [deskLamp, setDeskLamp] = useState<StateOf<"power">>("on");
  const [floorLamp, setFloorLamp] = useState<StateOf<"power">>("off");
  return (
    <DeviceCard
      name="Office lights"
      connectionStatus="connected"
      controls={
        <>
          <PowerControl
            name="Desk lamp"
            state={deskLamp}
            allowedCommands={["turn-on", "turn-off"]}
            onCommand={(c) => setDeskLamp(c === "turn-on" ? "on" : "off")}
          />
          <PowerControl
            name="Floor lamp"
            state={floorLamp}
            allowedCommands={["turn-on", "turn-off"]}
            onCommand={(c) => setFloorLamp(c === "turn-on" ? "on" : "off")}
          />
        </>
      }
    />
  );
}

function ThermostatCard(): ReactNode {
  const [setpoint, setSetpoint] = useState(21.5);
  const [mode, setMode] = useState<StateOf<"mode">>("heat");
  return (
    <DeviceCard
      name="Thermostat"
      connectionStatus="connected"
      sensors={[
        {
          metric: "temperature",
          value: 20.8,
          unit: "celsius",
          fractionDigits: 1,
        },
      ]}
      controls={
        <>
          <StateSelectControl
            name="Mode"
            metric="mode"
            state={mode}
            onSelect={setMode}
          />
          <ValueControl
            name="Target"
            value={setpoint}
            unit="celsius"
            min={10}
            max={30}
            step={0.5}
            fractionDigits={1}
            onCommit={setSetpoint}
          />
        </>
      }
    />
  );
}

function BlindsCard(): ReactNode {
  const [position, setPosition] = useState(60);
  return (
    <DeviceCard
      name="Living room blinds"
      connectionStatus="connected"
      controls={
        <ValueControl
          name="Position"
          value={position}
          unit="percent"
          min={0}
          max={100}
          step={5}
          input="slider"
          onCommit={setPosition}
        />
      }
    />
  );
}

const noop = () => {};

interface ComponentShowcaseProps {
  /** Extra class from the page, e.g. to set the grid's width. */
  className?: string;
}

// A grid of real kit components in different states, laid out in columns of uneven
// heights (a masonry layout), so visitors can see the kit before they read the docs.
// The columns fill top to bottom, so the TopBar opens the first column and the BottomNav
// closes the last one, like the top and bottom of an app screen.
export default function ComponentShowcase({
  className,
}: ComponentShowcaseProps): ReactNode {
  return (
    <div className={`${styles.grid} ${className ?? ""}`}>
      <div className={`${styles.item} ${styles.bar}`}>
        <TopBar
          title="Living room"
          icon="weekend"
          backHref="#"
          backLabel="Back to Home"
        />
      </div>

      <div className={styles.item}>
        <SpaceCard
          name="Living room"
          activeAlertCount={0}
          readings={[
            {
              metric: "temperature",
              value: 22.4,
              unit: "celsius",
              fractionDigits: 1,
              connectionStatus: "connected",
            },
            {
              metric: "humidity",
              value: 48,
              unit: "percent-rh",
              fractionDigits: 0,
              connectionStatus: "connected",
            },
            {
              metric: "motion",
              state: "detected",
              connectionStatus: "connected",
            },
          ]}
        />
      </div>

      <div className={styles.item}>
        <AlertBanner
          title="Smoke detected"
          alertLevel="critical"
          spaceName="Kitchen"
          raisedAt={minutesAgo(2)}
          now={NOW}
        />
      </div>

      <div className={styles.item}>
        <ThermostatCard />
      </div>

      <div className={styles.item}>
        <Card title="Spaces" icon="door_front">
          <List label="Spaces" hasDividers>
            <SpaceListItem
              name="Kitchen"
              spaceType="kitchen"
              floorName="Ground floor"
              deviceCount={3}
              activeAlertCount={1}
              highestAlertLevel="critical"
            />
            <SpaceListItem
              name="Bedroom"
              spaceType="bedroom"
              floorName="First floor"
              deviceCount={2}
              activeAlertCount={1}
              highestAlertLevel="warning"
            />
            <SpaceListItem
              name="Office"
              spaceType="office"
              floorName="First floor"
              deviceCount={4}
            />
          </List>
        </Card>
      </div>

      <div className={styles.item}>
        <DeviceCard
          name="Climate Module"
          connectionStatus="disconnected"
          sensors={[
            {
              metric: "temperature",
              value: null,
              unit: "celsius",
              fractionDigits: 1,
            },
            {
              metric: "humidity",
              value: null,
              unit: "percent-rh",
              fractionDigits: 0,
            },
          ]}
        />
      </div>

      <div className={styles.item}>
        <InlineMessage tone="success" title="Device paired">
          The Door sensor is paired and sending Readings.
        </InlineMessage>
      </div>

      <div className={styles.item}>
        <InlineMessage tone="warning" title="Readings are stale">
          The Climate Module hasn't sent a Reading for 10 min.
        </InlineMessage>
      </div>

      <div className={styles.item}>
        <Card title="Devices" icon="sensors">
          <List label="Devices" hasDividers>
            <DeviceListItem
              name="Hub"
              deviceKind="hub"
              spaceName="Hallway"
              pairingStatus="paired"
              connectionStatus="connected"
            />
            <DeviceListItem
              name="Climate Module"
              deviceKind="module"
              spaceName="Bedroom"
              pairingStatus="paired"
              connectionStatus="stale"
            />
            <DeviceListItem
              name="Door sensor"
              deviceKind="standalone"
              spaceName="Front door"
              pairingStatus="pairing"
            />
            <DeviceListItem
              name="Plant Module"
              deviceKind="module"
              spaceName="Balcony"
              pairingStatus="paired"
              connectionStatus="disconnected"
            />
          </List>
        </Card>
      </div>

      <div className={styles.item}>
        <LampsCard />
      </div>

      <div className={`${styles.item} ${styles.bar}`}>
        <TopBar
          title="Devices"
          actions={
            <Button variant="primary" icon="add" onClick={noop}>
              Add Device
            </Button>
          }
        />
      </div>

      <div className={styles.item}>
        <DeviceCard
          name="Air Quality Module"
          connectionStatus="connected"
          sensors={[
            { metric: "co2", value: 1250, unit: "ppm", fractionDigits: 0 },
            { metric: "voc", value: 120, unit: "ppb", fractionDigits: 0 },
            { metric: "pm25", value: 12, unit: "ug-m3", fractionDigits: 0 },
          ]}
        />
      </div>

      <div className={styles.item}>
        <DeviceCard
          name="Garage door"
          connectionStatus="connected"
          controls={
            <OpenCloseControl
              name="Garage door"
              state="opening"
              allowedCommands={["open", "close", "stop"]}
              onCommand={noop}
              command={{ command: "open", status: "pending" }}
            />
          }
        />
      </div>

      <div className={styles.item}>
        <Card title="Alerts" icon="notifications">
          <List label="Alerts" hasDividers>
            <AlertListItem
              title="Smoke detected"
              alertLevel="critical"
              alertStatus="active"
              spaceName="Kitchen"
              raisedAt={minutesAgo(2)}
              now={NOW}
            />
            <AlertListItem
              title="Window open"
              alertLevel="warning"
              alertStatus="active"
              spaceName="Bedroom"
              raisedAt={minutesAgo(25)}
              now={NOW}
            />
            <AlertListItem
              title="High CO₂"
              alertLevel="info"
              alertStatus="ended"
              spaceName="Office"
              raisedAt={minutesAgo(180)}
              endedAt={minutesAgo(140)}
              now={NOW}
            />
          </List>
        </Card>
      </div>

      <div className={styles.item}>
        <Card padding="sm">
          <LocationPath
            layout="grid"
            siteName="My flat"
            floorName="First floor"
            spaceName="Bedroom"
            deviceName="Climate Module"
            deviceKind="module"
          />
        </Card>
      </div>

      <div className={styles.item}>
        <DeviceCard
          name="Kettle"
          connectionStatus="connected"
          controls={
            <OperationalStateControl
              name="Kettle"
              state="running"
              phase="Heating"
              allowedCommands={["pause", "stop"]}
              onCommand={noop}
            />
          }
        />
      </div>

      <div className={styles.item}>
        <AlertBanner
          title="Humidity above 70 %"
          alertLevel="warning"
          spaceName="Bathroom"
          raisedAt={minutesAgo(12)}
          now={NOW}
        />
      </div>

      <div className={styles.item}>
        <BlindsCard />
      </div>

      <div className={styles.item}>
        <Card padding="sm">
          <div className={styles.row}>
            <Badge count={3} label="3 critical Alerts" tone="critical" />
            <Badge count={5} label="5 warnings" tone="warning" />
            <Badge count={12} label="12 info Alerts" tone="info" />
            <Badge count={120} label="120 Readings" tone="neutral" max={99} />
          </div>
        </Card>
      </div>

      <div className={styles.item}>
        <Card padding="sm">
          <div className={styles.row}>
            <Button variant="primary" onClick={noop}>
              Save
            </Button>
            <Button variant="secondary" onClick={noop}>
              Cancel
            </Button>
            <Button variant="danger" onClick={noop}>
              Remove
            </Button>
            <IconButton icon="settings" label="Settings" onClick={noop} />
            <IconButton
              icon="add"
              label="Add"
              variant="secondary"
              onClick={noop}
            />
          </div>
        </Card>
      </div>

      <div className={styles.item}>
        <DeviceCard
          name="Plant Module"
          connectionStatus="connected"
          faults={[{ faultCode: "calibration_required", metric: "humidity" }]}
          sensors={[
            {
              metric: "humidity",
              value: 31,
              unit: "percent-rh",
              fractionDigits: 0,
            },
            {
              metric: "illuminance",
              value: 840,
              unit: "lux",
              fractionDigits: 0,
            },
          ]}
        />
      </div>

      <div className={styles.item}>
        <SpaceCard
          name="Bedroom"
          activeAlertCount={1}
          highestAlertLevel="warning"
          readings={[
            {
              metric: "temperature",
              value: 19.2,
              unit: "celsius",
              fractionDigits: 1,
              connectionStatus: "stale",
            },
            {
              metric: "contact",
              state: "open",
              asset: { name: "Window", assetType: "window" },
              alertLevel: "warning",
              connectionStatus: "connected",
            },
          ]}
        />
      </div>

      <div className={styles.item}>
        <Card title="History" icon="monitoring">
          <EmptyState
            icon="monitoring"
            title="No Readings yet"
            message="Readings show up here once a Sensor sends its first one."
          />
        </Card>
      </div>

      <div className={`${styles.item} ${styles.bar}`}>
        <BottomNav
          label="Main"
          items={[
            { label: "Home", icon: "home", href: "#", isCurrent: true },
            { label: "Spaces", icon: "door_front", href: "#" },
            {
              label: "Alerts",
              icon: "notifications",
              href: "#",
              badge: { count: 3, label: "3 active Alerts", tone: "critical" },
            },
            { label: "Settings", icon: "settings", href: "#" },
          ]}
        />
      </div>
    </div>
  );
}
