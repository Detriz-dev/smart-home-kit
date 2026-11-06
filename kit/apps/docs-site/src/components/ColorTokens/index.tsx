import { useEffect, useState, type CSSProperties } from "react";

import {
  COLOR_GROUPS,
  PALETTE_HUES,
  PALETTE_STEPS,
  STATUS_PARTS,
  STATUS_ROLES,
  cssVar,
  paletteVar,
} from "./data";
import styles from "./styles.module.css";

// Swatches and tables for the Colors page (docs/ui-components/foundations/colors.mdx).
// Every swatch is painted with the real CSS variable, and every hex value is read from
// tokens.css in the browser, so the page always shows what the package ships.

/** Reads a palette token's hex value from tokens.css once the page is in the browser. */
function useHex(variable: string): string {
  const [hex, setHex] = useState("");
  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    setHex(value);
  }, [variable]);
  return hex;
}

function Hex({ variable }: { variable: string }) {
  const hex = useHex(variable);
  return <span className={styles.hex}>{hex || " "}</span>;
}

/** A square of color with its name and hex value underneath. */
function Swatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className={styles.swatch}>
      <span
        className={styles.chip}
        style={{ background: `var(${variable})` }}
        aria-hidden="true"
      />
      <span className={styles.swatchName}>{name}</span>
      <Hex variable={variable} />
    </div>
  );
}

/** Every palette color: one row of 11 steps per hue, plus white and black. */
export function Palette() {
  return (
    <div className={styles.palette}>
      {PALETTE_HUES.map((hue) => (
        <section key={hue} aria-label={`${hue} palette`}>
          <p className={styles.hue}>{hue}</p>
          <div className={styles.steps}>
            {PALETTE_STEPS.map((step) => (
              <Swatch
                key={step}
                name={`${hue}/${step}`}
                variable={paletteVar(`${hue}/${step}`)}
              />
            ))}
          </div>
        </section>
      ))}
      <section aria-label="white and black">
        <p className={styles.hue}>white and black</p>
        <div className={styles.steps}>
          <Swatch name="white" variable={paletteVar("white")} />
          <Swatch name="black" variable={paletteVar("black")} />
        </div>
      </section>
    </div>
  );
}

function Preview({
  kind,
  variable,
}: {
  kind: "text" | "fill" | "border";
  variable: string;
}) {
  if (kind === "text") {
    const isInverse = variable.endsWith("inverse");
    return (
      <span
        className={styles.textPreview}
        style={{
          color: `var(${variable})`,
          background: isInverse
            ? "var(--shk-palette-gray-900)"
            : "var(--shk-surface-default)",
        }}
        aria-hidden="true"
      >
        Aa
      </span>
    );
  }
  const style: CSSProperties =
    kind === "border"
      ? {
          background: "var(--shk-surface-default)",
          border: `var(--shk-border-width-medium) solid var(${variable})`,
        }
      : { background: `var(${variable})` };
  return <span className={styles.chip} style={style} aria-hidden="true" />;
}

/** One semantic collection as a table: swatch, Figma name, CSS name, palette color, use. */
export function ColorTokenTable({
  group,
}: {
  group: keyof typeof COLOR_GROUPS;
}) {
  const { collection, preview, tokens } = COLOR_GROUPS[group];
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <span className={styles.visuallyHidden}>Swatch</span>
          </th>
          <th>Figma variable</th>
          <th>CSS variable</th>
          <th>Palette</th>
          <th>Use it for</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => {
          const variable = cssVar(collection, token.figmaName);
          return (
            <tr key={token.figmaName}>
              <td>
                <Preview kind={preview} variable={variable} />
              </td>
              <td>
                <code>
                  {collection}/{token.figmaName}
                </code>
              </td>
              <td>
                <code>{variable}</code>
              </td>
              <td className={styles.nowrap}>
                {token.palette}
                <br />
                <Hex variable={paletteVar(token.palette)} />
              </td>
              <td>{token.usage}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** The status colors: five roles × five parts, with a sample of each role in use. */
export function StatusColors() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Role</th>
          {STATUS_PARTS.map(({ part }) => (
            <th key={part}>
              <code>{part}</code>
            </th>
          ))}
          <th>Together</th>
        </tr>
      </thead>
      <tbody>
        {STATUS_ROLES.map(({ role, hue, sample }) => (
          <tr key={role}>
            <th scope="row">
              <code>{role}</code>
            </th>
            {STATUS_PARTS.map(({ part, step }) => (
              <td key={part}>
                <Swatch
                  name={step ? `${hue}/${step}` : "gray/950"}
                  variable={cssVar("status", `${role}/${part}`)}
                />
              </td>
            ))}
            <td>
              <span
                className={styles.sample}
                style={{
                  background: `var(--shk-status-${role}-bg)`,
                  borderColor: `var(--shk-status-${role}-border)`,
                  color: `var(--shk-status-${role}-fg)`,
                }}
              >
                <span
                  className={styles.dot}
                  style={{ background: `var(--shk-status-${role}-solid)` }}
                  aria-hidden="true"
                />
                {sample}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
