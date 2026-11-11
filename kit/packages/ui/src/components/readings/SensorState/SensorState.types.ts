import type { AssetType } from "../../../types/assetType";
import type { AlertLevel } from "../../../types/alert";
import type { StateValueReading } from "../StateValue";
import type { FaultCode } from "../../status/DeviceFaultStatus";

/** How big the State is drawn. The same two sizes as SensorReading. */
export type SensorStateSize = "lg" | "md";

/** The Asset a Contact or Power Sensor watches, e.g. the Front door. */
export interface SensorStateAsset {
  /** The Asset's name, e.g. "Front door". */
  name: string;
  /** The Asset's Asset Type, e.g. `door`. Decides the icon. */
  assetType: AssetType;
}

/** The props of `SensorState`: the Metric and its State (checked to match), plus the card's options. */
export type SensorStateProps = StateValueReading & {
  /** The Asset the Sensor watches. When given, the card is named after it ("Front door") instead of the Metric ("Contact"). */
  asset?: SensorStateAsset;
  /** True when the Module's Connection Status is Disconnected. Hides the State and shows the disconnected icon. */
  isDisconnected?: boolean;
  /** The Alert Level of an Active Alert about this Reading. Colours the State. */
  alertLevel?: AlertLevel;
  /** How big the State is drawn. Defaults to `lg`. */
  size?: SensorStateSize;
  /** The Fault Codes of the Device's Faults about this Sensor. Each shows under the State, with the short message ("Sensor failure"), because the card already names the Sensor. Leave it out when there are none. */
  faults?: FaultCode[];
};
