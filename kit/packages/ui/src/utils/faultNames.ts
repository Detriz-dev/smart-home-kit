import type { FaultCode } from "../components/status/DeviceFaultStatus/DeviceFaultStatus.types";

/** The words for each Fault Code: on its own ("Sensor failure"), and after a Metric's name or a colon ("sensor failure"). Shared, so a Fault reads the same everywhere. */
export const FAULT_NAMES: Record<
  FaultCode,
  { alone: string; afterMetric: string }
> = {
  sensor_failure: {
    alone: "Sensor failure",
    afterMetric: "sensor failure",
  },
  calibration_required: {
    alone: "Calibration required",
    afterMetric: "sensor calibration required",
  },
};
