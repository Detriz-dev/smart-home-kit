import type { FaultCode } from "../components/status/DeviceFaultStatus/DeviceFaultStatus.types";

/** What a Device that runs a task is doing. From the Glossary, following Matter's Operational State. The user can't choose `error`: the Device reports it. */
export type OperationalState = "stopped" | "running" | "paused" | "error";

/** The commands of an Operational State. Each Device allows only some of them (its Allowed Commands). */
export type OperationalCommand = "start" | "pause" | "resume" | "stop";

/** The kit's general Error Reasons, from Matter. The UI has its own message for each. */
export type GeneralErrorReason =
  | "unable-to-start-or-resume"
  | "unable-to-complete"
  | "command-invalid-in-state";

/**
 * Why the Operational State is `error`. Either one of the kit's general reasons, or a reason the Device defines
 * with its own label (e.g. `{ code: "no-water", label: "No water" }`). If a Fault caused the Error, `faultCode` points to it,
 * so the UI shows one message instead of two.
 */
export type ErrorReason =
  | {
      /** One of the kit's general reasons. */
      code: GeneralErrorReason;
      /** Optional text to show instead of the kit's own message. */
      label?: string;
      /** The Fault that caused the Error, if any. */
      faultCode?: FaultCode;
    }
  | {
      /** The Device's own reason, e.g. `no-water`. */
      code: string;
      /** The text to show, e.g. "No water". Required, because the kit doesn't know this reason. */
      label: string;
      /** The Fault that caused the Error, if any. */
      faultCode?: FaultCode;
    };
