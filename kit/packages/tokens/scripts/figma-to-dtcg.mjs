// Converts a Figma variables export (one collection) into DTCG JSON for Style Dictionary.
//
// Usage: node scripts/figma-to-dtcg.mjs <figma-export.json> <output.json> [--mode <name>]
//
// The input is the raw file Figma gives you: a collection with a flat list of
// variables, colours as r/g/b numbers from 0 to 1. The output is nested DTCG
// JSON ($type, $value, $description) that Style Dictionary can read.
// See docs/architecture/design-system/figma-code-handoff.md.

import { readFile, writeFile } from "node:fs/promises";

// Figma group names that we rename on the way in. Remove an entry once the
// group has the right name in Figma.
const RENAME_TOP_GROUP = { color: "palette" };

const [inputPath, outputPath, ...rest] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error(
    "Usage: node scripts/figma-to-dtcg.mjs <figma-export.json> <output.json> [--mode <name>]",
  );
  process.exit(1);
}
const modeFlag = rest.indexOf("--mode");
const modeName = modeFlag === -1 ? undefined : rest[modeFlag + 1];

const collection = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(collection.variables) || !collection.modes) {
  console.error(
    `${inputPath} doesn't look like a Figma variables export (no "variables" or "modes").`,
  );
  process.exit(1);
}

// Pick the mode: the one named with --mode, or the first one.
const modes = Object.entries(collection.modes); // [[modeId, modeName], ...]
const mode = modeName ? modes.find(([, name]) => name === modeName) : modes[0];
if (!mode) {
  console.error(
    `Mode "${modeName}" not found. Modes in this file: ${modes.map(([, n]) => n).join(", ")}`,
  );
  process.exit(1);
}
const [modeId] = mode;

// "color/gray/500" → ["palette", "gray", "500"]
function toPath(figmaName) {
  const parts = figmaName.split("/").map((part) => part.trim());
  parts[0] = RENAME_TOP_GROUP[parts[0]] ?? parts[0];
  return parts;
}

// { r: 0.5176, g: 0.5569, b: 0.5804, a: 1 } → "#848e94" (8 digits if see-through)
function toHex({ r, g, b, a = 1 }) {
  const channel = (value) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}${a < 1 ? channel(a) : ""}`;
}

const pathById = new Map(
  collection.variables.map((v) => [v.id, toPath(v.name)]),
);
const warnings = [];

function toToken(variable) {
  const raw = variable.valuesByMode[modeId];
  const scopes = variable.scopes ?? [];

  // An alias to another variable becomes "{palette.gray.500}".
  let value;
  if (raw?.type === "VARIABLE_ALIAS") {
    const target = pathById.get(raw.id);
    if (target) {
      value = `{${target.join(".")}}`;
    } else {
      // The alias points to another collection, which this file doesn't contain.
      warnings.push(
        `${variable.name}: alias to another collection, used the resolved value instead`,
      );
      value = variable.resolvedValuesByMode?.[modeId]?.resolvedValue;
    }
  }

  switch (variable.type) {
    case "COLOR":
      return { $type: "color", $value: value ?? toHex(raw) };
    case "FLOAT":
      if (scopes.includes("FONT_WEIGHT"))
        return { $type: "fontWeight", $value: value ?? raw };
      if (scopes.includes("OPACITY"))
        return { $type: "number", $value: value ?? raw };
      // Figma numbers have no unit; everything else is a size in px.
      return { $type: "dimension", $value: value ?? `${raw}px` };
    case "STRING":
      if (scopes.includes("FONT_FAMILY"))
        return { $type: "fontFamily", $value: value ?? raw };
      return { $value: value ?? raw };
    default:
      warnings.push(
        `${variable.name}: type ${variable.type} isn't supported, skipped`,
      );
      return undefined;
  }
}

// Build the nested tree.
const tree = {};
for (const variable of collection.variables) {
  const token = toToken(variable);
  if (!token) continue;
  if (variable.description) token.$description = variable.description;

  const path = pathById.get(variable.id);
  let group = tree;
  for (const part of path.slice(0, -1)) group = group[part] ??= {};
  group[path.at(-1)] = token;
}

await writeFile(outputPath, `${JSON.stringify(tree, null, 2)}\n`);
console.log(
  `Wrote ${collection.variables.length} variables from "${collection.name}" (mode "${mode[1]}") to ${outputPath}`,
);
for (const warning of warnings) console.warn(`  warning: ${warning}`);
