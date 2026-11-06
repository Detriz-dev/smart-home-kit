import { useEffect, useState } from "react";

import styles from "./styles.module.css";

// Scales for the Space and size page (docs/ui-components/foundations/space-and-size.mdx).
// Each bar or square is drawn with the real CSS variable, and its value is read from
// tokens.css in the browser, so the page always shows what the package ships.
// Token names mirror the Figma "space" and "size" collections (checked 2026-11-06).

const SPACE = [
  { step: "0", use: "No space. Resets padding on buttons and lists." },
  { step: "1", use: "Between an icon and its text; inside SensorReading." },
  {
    step: "2",
    use: "StackLayout sm; Button top and bottom padding; SensorReading padding.",
  },
  {
    step: "3",
    use: "Between rows inside ModuleCard and SpaceCard; InlineMessage icon and text.",
  },
  {
    step: "4",
    use: "The default. StackLayout md, ColumnLayout, ContentSection; card padding; Button side padding.",
  },
  { step: "5", use: "Not used by the components yet." },
  {
    step: "6",
    use: "Not used by the components. Larger gaps in your own screens.",
  },
  { step: "8", use: "StackLayout lg: between groups on a screen." },
  { step: "10", use: "Page-level spacing in your app." },
  { step: "12", use: "Page-level spacing in your app." },
  { step: "16", use: "Page-level spacing in your app." },
  { step: "20", use: "Page-level spacing in your app." },
  { step: "24", use: "Page-level spacing in your app." },
] as const;

const SIZE = [
  { step: "3", use: "Status dots in the Status components." },
  { step: "4", use: "Icon xs; the Switch thumb." },
  { step: "5", use: "Icon sm." },
  { step: "6", use: "Icon md (the default); Switch height." },
  { step: "8", use: "Icon lg; the InlineMessage dismiss button." },
  { step: "10", use: "Switch width." },
  { step: "11", use: "Button height. The smallest touch target." },
  { step: "12", use: "Not used by the components yet." },
  { step: "16", use: "Not used by the components yet." },
  {
    step: "20",
    use: "Not used inside the components. Handy for minimum widths in your layouts.",
  },
  {
    step: "24",
    use: "InlineMessage text minimum width; ColumnLayout columns are at least 2 × this (192px).",
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
  kind: "space" | "size";
  rows: ReadonlyArray<{ step: string; use: string }>;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <span className={styles.visuallyHidden}>Scale</span>
          </th>
          <th>Figma variable</th>
          <th>CSS variable</th>
          <th>Value</th>
          <th>Used for</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ step, use }) => {
          const variable = `--shk-${kind}-${step}`;
          return (
            <tr key={step}>
              <td className={styles.visualCell}>
                {kind === "space" ? (
                  <span
                    className={styles.bar}
                    style={{ inlineSize: `var(${variable})` }}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={styles.square}
                    style={{
                      inlineSize: `var(${variable})`,
                      blockSize: `var(${variable})`,
                    }}
                    aria-hidden="true"
                  />
                )}
              </td>
              <td>
                <code>
                  {kind}/{step}
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

/** The 13 space tokens, each drawn as a bar of that length. */
export function SpaceScale() {
  return <Table kind="space" rows={SPACE} />;
}

/** The 11 size tokens, each drawn as a square of that size. */
export function SizeScale() {
  return <Table kind="size" rows={SIZE} />;
}
