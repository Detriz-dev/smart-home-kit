// The icon for each purpose: which base icon a Metric, a Space Type or an Asset Type uses.
// The one place the kit decides it, so a Metric or a room looks the same everywhere.
// Figma mirrors each map as a component set on the Icon page, e.g. METRIC_ICONS → MetricIcon (metric × size).
// Components and apps pick icons from these maps, never by base name, so one decision changes every screen.
import type { InlineMessageTone } from "../components/feedback/InlineMessage/InlineMessage.types";
import type { AlertLevel } from "../types/alert";
import type { AssetType } from "../types/assetType";
import type { DeviceKind } from "../types/deviceKind";
import type { Metric, TwoStateMetric } from "../types/metric";
import type { SpaceType } from "../types/spaceType";
import type { StateOf } from "../types/state";
import type { IconName } from "./generated/paths";

/** The icon for each Metric, e.g. `<Icon name={METRIC_ICONS.smoke} />`. Used by SensorLabel. */
export const METRIC_ICONS: Record<Metric, IconName> = {
  temperature: "thermostat",
  humidity: "humidity_mid",
  illuminance: "light_mode",
  co2: "co2",
  voc: "airwave",
  pm25: "grain",
  power: "power",
  contact: "sensor_door",
  motion: "motion_sensor_active",
  smoke: "detector_smoke",
  co: "detector_co",
};

/** The icon for each Space Type, e.g. `<Card icon={SPACE_TYPE_ICONS.kitchen} …>`. Used by SpaceLabel. */
export const SPACE_TYPE_ICONS: Record<SpaceType, IconName> = {
  bedroom: "bed",
  bathroom: "bathtub",
  kitchen: "countertops",
  "living-room": "weekend",
  hallway: "door_front",
  garage: "garage_home",
  office: "desk",
  meeting: "groups",
  outdoor: "yard",
  other: "home",
};

/** The icon for each Asset Type, e.g. `<Icon name={ASSET_TYPE_ICONS.window} />`. */
export const ASSET_TYPE_ICONS: Record<AssetType, IconName> = {
  plant: "potted_plant",
  tap: "faucet",
  door: "door_front",
  window: "window",
  appliance: "local_laundry_service",
};

/** The icon for each State of each Two-state Metric. Smoke and CO keep the same icon in both States: the State colour tells them apart. */
export const STATE_ICONS: {
  [M in TwoStateMetric]: Record<StateOf<M>, IconName>;
} = {
  power: { on: "power", off: "power_off" },
  contact: { open: "door_open", closed: "sensor_door" },
  motion: { detected: "motion_sensor_active", clear: "motion_sensor_idle" },
  smoke: { detected: "detector_smoke", clear: "detector_smoke" },
  co: { detected: "detector_co", clear: "detector_co" },
};

/** The icon for each Device Kind. Used by DeviceListItem and LocationPath. */
export const DEVICE_KIND_ICONS: Record<DeviceKind, IconName> = {
  hub: "router",
  module: "developer_board",
};

/** The icon for each level of a place above a Device. Used by LocationPath. */
export const PLACE_ICONS: Record<"site" | "floor" | "space", IconName> = {
  site: "home",
  floor: "stairs_2",
  space: "door_front",
};

/** The icon shown instead of a value when there is no value to show, and next to a Fault. Used by ReadingValue and DeviceFaultStatus. */
export const READING_STATUS_ICONS: Record<
  "loading" | "disconnected" | "fault",
  IconName
> = {
  loading: "refresh",
  disconnected: "link_off",
  fault: "error",
};

/** The filled icon for each message tone. Warning is the only triangle, so it can't be mixed up with error in greyscale. Used by InlineMessage. */
export const MESSAGE_TONE_ICONS: Record<InlineMessageTone, IconName> = {
  info: "info-fill",
  success: "check_circle-fill",
  warning: "warning-fill",
  error: "error-fill",
};

/** The icon for each Alert Level. Matches the message tones, so Critical looks like an error everywhere. */
export const ALERT_LEVEL_ICONS: Record<AlertLevel, IconName> = {
  critical: "error-fill",
  warning: "warning-fill",
  info: "info-fill",
};

/** The icons for Alerts as a whole, e.g. an Alerts tab: `active` when at least one Alert is Active. */
export const ALERT_ICONS: Record<"default" | "active", IconName> = {
  default: "notifications",
  active: "notifications_active",
};

/** The icons for the app's main sections, e.g. BottomNav tabs. */
export const NAV_ICONS: Record<
  "home" | "spaces" | "devices" | "history" | "settings",
  IconName
> = {
  home: "home",
  spaces: "door_front",
  devices: "sensors",
  history: "monitoring",
  settings: "settings",
};

/** The icons for common actions. Used by TopBar (back), InlineMessage (dismiss) and IconButton examples (retry). */
export const ACTION_ICONS: Record<"back" | "dismiss" | "retry", IconName> = {
  back: "arrow_back",
  dismiss: "close",
  retry: "refresh",
};
