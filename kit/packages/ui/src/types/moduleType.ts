/** The category of a Module, decided by what its board measures. The fixed list from the Glossary. `co` is carbon monoxide. */
export type ModuleType =
  | "climate"
  | "light"
  | "air-quality"
  | "motion"
  | "contact"
  | "power"
  | "smoke"
  | "co";
