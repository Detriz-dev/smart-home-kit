/** Which Unit to show. One value per Unit in the fixed list. */
export type UnitLabelUnit =
  "celsius" | "fahrenheit" | "percent-rh" | "lux" | "ppm" | "ppb" | "ug-m3";

/** How big the Unit is drawn. Same names as ReadingValue's sizes. */
export type UnitLabelSize = "xs" | "sm" | "md" | "lg";

export interface UnitLabelProps {
  /** Which Unit to show, e.g. `celsius` for °C. */
  unit: UnitLabelUnit;
  /** How big the Unit is drawn. Use the same size as the ReadingValue next to it. Defaults to `lg`. */
  size?: UnitLabelSize;
}
