/**
 * Formats a Reading's value in the browser's language, with a fixed number of decimal places.
 * For example 1250 → "1,250" in English and "1250" in Polish; 22.4 → "22.4" or "22,4".
 */
export function formatReadingValue(value: number, fractionDigits: number) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
