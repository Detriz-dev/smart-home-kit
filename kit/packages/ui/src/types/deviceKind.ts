/** How a Device connects. From the Glossary: a Hub (Modules connect through it), a Module (connects through a Hub) or a Standalone Device (connects directly). Not the same as Device Type, which says what it is. */
export type DeviceKind = "hub" | "module" | "standalone";
