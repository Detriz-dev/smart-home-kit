/** What a Device is: one fixed list for every Device, from the Glossary. Used for the icon and the default Device Name. Use `other` when nothing fits. `co` is carbon monoxide. Replaces Module Type. */
export type DeviceType =
  | "hub"
  | "climate"
  | "light"
  | "air-quality"
  | "motion"
  | "contact"
  | "power"
  | "smoke"
  | "co"
  | "kettle"
  | "power-strip"
  | "blinds"
  | "thermostat"
  | "washing-machine"
  | "other";
