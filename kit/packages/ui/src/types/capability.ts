/** Which kind of Capability it is. From the Glossary: a Sensor only reports; a State Control picks one of its Metric's States; a Value Control sets a number in a range. Operational State is a `state-control`. */
export type CapabilityKind = "sensor" | "state-control" | "value-control";
