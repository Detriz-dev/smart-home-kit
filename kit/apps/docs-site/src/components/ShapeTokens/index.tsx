import { useEffect, useState } from "react";

import styles from "./styles.module.css";

// Tables for the Shape page (docs/ui-components/foundations/shape.mdx).
// Each preview is drawn with the real CSS variable, and its value is read from tokens.css
// in the browser, so the page always shows what the package ships.
// Token names mirror the Figma "radius" and "border-width" collections (checked 2026-11-06).

const RADIUS = [
  { name: "0", use: "Square corners. Not used by the components yet." },
  { name: "4", use: "Small things: InlineMessage and its dismiss button." },
  { name: "8", use: "Controls: Button." },
  { name: "12", use: "Small cards: SensorReading." },
  { name: "16", use: "Large cards: ModuleCard, SpaceCard." },
  {
    name: "24",
    use: "Not used by the components yet. Very large panels in your own screens.",
  },
  {
    name: "full",
    use: "Pills and circles: status dots, the Switch track and thumb.",
  },
] as const;

const BORDER = [
  { name: "0", use: "No border, like the Switch track." },
  {
    name: "thin",
    use: "Outlines: cards, SensorReading, InlineMessage, Button secondary.",
  },
  {
    name: "medium",
    use: "Keyboard focus rings: Button, Switch, the InlineMessage dismiss button.",
  },
  {
    name: "thick",
    use: "Accents: the colored bar on the left of InlineMessage.",
  },
] as const;

function useTokenValue(variable: string): string {
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(
      getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim(),
    );
  }, [variable]);
  return value;
}

function Value({ variable }: { variable: string }) {
  const value = useTokenValue(variable);
  return <span className={styles.value}>{value || " "}</span>;
}

function Table({
  kind,
  rows,
}: {
  kind: "radius" | "border-width";
  rows: ReadonlyArray<{ name: string; use: string }>;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <span className={styles.visuallyHidden}>Preview</span>
          </th>
          <th>Figma variable</th>
          <th>CSS variable</th>
          <th>Value</th>
          <th>Used for</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ name, use }) => {
          const variable = `--shk-${kind}-${name}`;
          return (
            <tr key={name}>
              <td>
                <span
                  className={kind === "radius" ? styles.corner : styles.line}
                  style={
                    kind === "radius"
                      ? { borderRadius: `var(${variable})` }
                      : { borderBlockStartWidth: `var(${variable})` }
                  }
                  aria-hidden="true"
                />
              </td>
              <td>
                <code>
                  {kind}/{name}
                </code>
              </td>
              <td>
                <code>{variable}</code>
              </td>
              <td>
                <Value variable={variable} />
              </td>
              <td>{use}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** The 7 corner radius tokens, each drawn on a box. */
export function RadiusScale() {
  return <Table kind="radius" rows={RADIUS} />;
}

/** The 4 border width tokens, each drawn as a line of that thickness. */
export function BorderWidthScale() {
  return <Table kind="border-width" rows={BORDER} />;
}
