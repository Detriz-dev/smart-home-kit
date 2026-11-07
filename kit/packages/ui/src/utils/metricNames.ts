import type { Metric } from "../types/metric";

/**
 * The name shown for each Metric and (only where it reads oddly) the name screen readers say.
 * "CO₂" uses the subscript ₂ (U+2082), the same character as the glossary.
 */
export const METRIC_NAMES: Record<
  Metric,
  { label: string; spokenName?: string }
> = {
  temperature: { label: "Temperature" },
  humidity: { label: "Humidity" },
  illuminance: { label: "Illuminance" },
  co2: { label: "CO₂", spokenName: "carbon dioxide" },
  voc: { label: "VOC" },
  pm25: { label: "PM2.5", spokenName: "PM 2.5" },
  power: { label: "Power" },
  contact: { label: "Contact" },
  motion: { label: "Motion" },
  smoke: { label: "Smoke" },
  co: { label: "CO", spokenName: "carbon monoxide" },
};
