import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "../../layout/List";
import { DeviceListItem } from "./DeviceListItem";

// Where the component appears in Storybook's sidebar, and the props every story starts with.
// Values from DeviceListItem.md (the default: a connected Climate Module in the Bedroom).
// Typed with Meta<typeof DeviceListItem>, not `satisfies`: the props are a union (not Paired / Paired).
const meta: Meta<typeof DeviceListItem> = {
  title: "Status/DeviceListItem",
  component: DeviceListItem,
  args: {
    name: "Climate Module",
    deviceKind: "module",
    spaceName: "Bedroom",
    pairingStatus: "paired",
    connectionStatus: "connected",
  },
  argTypes: {
    deviceKind: { control: "select", options: ["hub", "module"] },
    pairingStatus: {
      control: "select",
      options: ["unpaired", "pairing", "paired"],
    },
    connectionStatus: {
      control: "select",
      options: ["connecting", "connected", "stale", "disconnected"],
    },
  },
  // A DeviceListItem is an <li>, so every story sits in a List, in a box. A story can set its width
  // with `parameters`. Drag the corner to try other widths.
  decorators: [
    (Story, { parameters }) => (
      <div
        style={{
          inlineSize: parameters.width ?? "360px",
          resize: "horizontal",
          overflow: "auto",
          padding: "8px",
        }}
      >
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DeviceListItem>;

// One story per Figma `state`, then the Fault variant.

export const Unpaired: Story = {
  args: {
    spaceName: "Garage",
    pairingStatus: "unpaired",
    connectionStatus: undefined,
  },
};

export const Pairing: Story = {
  args: {
    spaceName: "Garage",
    pairingStatus: "pairing",
    connectionStatus: undefined,
  },
};

export const Connecting: Story = {
  args: { connectionStatus: "connecting" },
};

export const Connected: Story = {};

export const Stale: Story = {
  args: { connectionStatus: "stale" },
};

export const Disconnected: Story = {
  args: {
    name: "Light Module",
    spaceName: "Living room",
    connectionStatus: "disconnected",
  },
};

// hasFault=true: Connected and a Fault at the same time. The Fault shows under the Space.
export const Fault: Story = {
  args: {
    name: "Air Quality Module",
    spaceName: "Office",
    faults: [{ faultCode: "calibration_required", metric: "co2" }],
  },
};

// A Hub: the router icon. A Hub without Capabilities is never Stale.
export const Hub: Story = {
  args: { name: "Kitchen Hub", deviceKind: "hub", spaceName: "Kitchen" },
};

// A Standalone Device: connects directly, without a Hub. The devices icon.
export const Standalone: Story = {
  args: { name: "Kettle", deviceKind: "standalone", spaceName: "Kitchen" },
};

// Clickable: opens the Device's own screen. "#" keeps Storybook on the same page.
export const Clickable: Story = {
  args: { href: "#/devices/climate-module" },
};

// A Devices screen: a List with dividers, every state in one place.
export const DeviceList: Story = {
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "360px", padding: "8px" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <List hasDividers label="Devices">
      <DeviceListItem
        name="Kitchen Hub"
        deviceKind="hub"
        spaceName="Kitchen"
        pairingStatus="paired"
        connectionStatus="connected"
        href="#/devices/kitchen-hub"
      />
      <DeviceListItem
        name="Climate Module"
        deviceKind="module"
        spaceName="Bedroom"
        pairingStatus="paired"
        connectionStatus="stale"
        href="#/devices/climate-module"
      />
      <DeviceListItem
        name="Light Module"
        deviceKind="module"
        spaceName="Living room"
        pairingStatus="paired"
        connectionStatus="disconnected"
        href="#/devices/light-module"
      />
      <DeviceListItem
        name="Air Quality Module"
        deviceKind="module"
        spaceName="Office"
        pairingStatus="paired"
        connectionStatus="connected"
        faults={[{ faultCode: "calibration_required", metric: "co2" }]}
        href="#/devices/air-quality-module"
      />
      <DeviceListItem
        name="Climate Module"
        deviceKind="module"
        spaceName="Garage"
        pairingStatus="unpaired"
      />
    </List>
  ),
};

// Stress story: a renamed Module with a long name, a long Space and a Fault, in 240px.
// Name and Space end with "…"; the status keeps its width; the Fault message wraps.
export const LongText: Story = {
  args: {
    name: "Kitchen climate by the window",
    spaceName: "Living room and dining area",
    connectionStatus: "disconnected",
    faults: [{ faultCode: "sensor_failure", metric: "co2" }],
  },
  parameters: { width: "240px" },
};

// Stress story: the smallest case, a Hub with no Space.
export const Minimal: Story = {
  args: { name: "Kitchen Hub", deviceKind: "hub", spaceName: undefined },
};
