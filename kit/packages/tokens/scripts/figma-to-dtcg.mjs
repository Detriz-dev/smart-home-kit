// Converts Figma variable exports into DTCG JSON for Style Dictionary.
//
// Usage:
//   node scripts/figma-to-dtcg.mjs
//     Converts every figma/<layer>/<name>.json into src/<layer>/<name>.json,
//     where <layer> is primitive, semantic or component.
//   node scripts/figma-to-dtcg.mjs <figma-export.json> <output.json> [--mode <name>]
//     Converts one file, for example one mode of a collection.
//
// Figma can export in two formats, and both are accepted:
// - Figma's own format: a collection with a flat list of variables, colours as
//   r/g/b numbers from 0 to 1. This script converts it to DTCG.
// - DTCG ($type, $value): already what Style Dictionary reads, so it's copied.
// See docs/architecture/design-system/figma-code-handoff.md.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

// Figma group names that we rename on the way in. Remove an entry once the
// group has the right name in Figma.
const RENAME_TOP_GROUP = { color: "palette" };

// figma/<layer>/ mirrors src/<layer>/, one folder per token layer.
const FIGMA_DIR = "figma";
const SRC_DIR = "src";
const LAYERS = ["primitive", "semantic", "component"];

const [inputPath, outputPath, ...rest] = process.argv.slice(2);
const modeFlag = rest.indexOf("--mode");
const modeName = modeFlag === -1 ? undefined : rest[modeFlag + 1];

if (inputPath && !outputPath) {
  console.error(
    "Usage: node scripts/figma-to-dtcg.mjs [<figma-export.json> <output.json> [--mode <name>]]",
  );
  process.exit(1);
}

const jobs = inputPath ? [[inputPath, outputPath]] : await findExports();

if (jobs.length === 0) {
  console.error(
    `No .json files found in ${LAYERS.map((layer) => `${FIGMA_DIR}/${layer}/`).join(", ")}.`,
  );
  process.exit(1);
}

// Every variable in every Figma export, by id. A semantic variable that points
// to a primitive in another collection is resolved through this map.
const pathById = new Map();
const allExports = inputPath
  ? [...(await findExports({ quiet: true })), [inputPath, outputPath]]
  : jobs;
for (const [input] of allExports) {
  const exported = JSON.parse(await readFile(input, "utf8"));
  for (const variable of exported.variables ?? []) {
    pathById.set(variable.id, toPath(variable.name, basename(input, ".json")));
  }
}

for (const [input, output] of jobs) {
  await mkdir(dirname(output), { recursive: true });
  const exported = JSON.parse(await readFile(input, "utf8"));
  // The file name is the group: figma/primitive/font-size.json → "font-size".
  const fileGroup = basename(input, ".json");
  const isFigmaFormat = Array.isArray(exported.variables);
  const { tree, summary, warnings } = isFigmaFormat
    ? fromFigmaFormat(exported, input)
    : fromDtcg(exported, fileGroup);

  await writeFile(output, `${JSON.stringify(tree, null, 2)}\n`);
  console.log(`${input} → ${output}: ${summary}`);
  for (const warning of warnings) console.warn(`  warning: ${warning}`);
}

// [["figma/primitive/palette.json", "src/primitive/palette.json"], ...]
async function findExports({ quiet = false } = {}) {
  const entries = await readdir(FIGMA_DIR, { withFileTypes: true });

  // A file directly in figma/ has no layer, so we don't know where it belongs.
  for (const entry of quiet ? [] : entries) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      console.warn(
        `Skipped ${FIGMA_DIR}/${entry.name}: move it into ${LAYERS.map((layer) => `${FIGMA_DIR}/${layer}/`).join(", ")}.`,
      );
    }
  }

  const jobs = [];
  for (const layer of LAYERS) {
    const files = await readdir(join(FIGMA_DIR, layer)).catch(() => []);
    for (const file of files.filter((f) => f.endsWith(".json")).sort()) {
      jobs.push([join(FIGMA_DIR, layer, file), join(SRC_DIR, layer, file)]);
    }
  }
  return jobs;
}

// DTCG is already the right format. Top group names are renamed, and tokens
// that sit at the top without a group are put under the file's group.
function fromDtcg(exported, fileGroup) {
  const tree = {};
  for (const [name, value] of Object.entries(exported)) {
    if (value && typeof value === "object" && "$value" in value) {
      (tree[fileGroup] ??= {})[name] = value;
    } else {
      tree[RENAME_TOP_GROUP[name] ?? name] = value;
    }
  }
  return { tree, summary: "DTCG, copied", warnings: [] };
}

function fromFigmaFormat(collection, input) {
  // Pick the mode: the one named with --mode, or the first one.
  const modes = Object.entries(collection.modes ?? {}); // [[modeId, modeName], ...]
  const mode = modeName
    ? modes.find(([, name]) => name === modeName)
    : modes[0];
  if (!mode) {
    console.error(
      `${input}: mode "${modeName}" not found. Modes in this file: ${modes.map(([, n]) => n).join(", ")}`,
    );
    process.exit(1);
  }
  const [modeId] = mode;

  const warnings = [];

  function toToken(variable) {
    let raw = roundFloat(variable.valuesByMode[modeId]);
    const scopes = variable.scopes ?? [];
    const [group] = pathById.get(variable.id);

    // An alias to another variable becomes "{palette.gray.500}".
    let value;
    if (raw?.type === "VARIABLE_ALIAS") {
      const target = pathById.get(raw.id);
      if (target) {
        value = `{${target.join(".")}}`;
      } else {
        // The alias points to a collection that isn't exported into figma/.
        warnings.push(
          `${variable.name}: points to "${variable.resolvedValuesByMode?.[modeId]?.aliasName}", which isn't in any figma/ export, so the raw value is used instead. Export that collection too.`,
        );
        raw = roundFloat(
          variable.resolvedValuesByMode?.[modeId]?.resolvedValue,
        );
      }
    }

    switch (variable.type) {
      case "COLOR":
        return { $type: "color", $value: value ?? toHex(raw) };
      case "FLOAT":
        if (scopes.includes("FONT_WEIGHT"))
          return { $type: "fontWeight", $value: value ?? raw };
        // The line-height primitives are multipliers (1.5), so they get no unit.
        // A line height typed straight into a text style (70) is in px.
        if (scopes.includes("OPACITY") || group === "line-height")
          return { $type: "number", $value: value ?? raw };
        // The letter-spacing primitives are a percent of the font size: -2 → -0.02em.
        // Letter spacing typed straight into a text style (-1.28) is in px.
        if (group === "letter-spacing")
          return {
            $type: "dimension",
            $value: value ?? `${roundFloat(raw / 100)}em`,
          };
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

  const summary = `Figma format, converted ${collection.variables.length} variables from "${collection.name}" (mode "${mode[1]}")`;
  return { tree, summary, warnings };
}

// "color/gray/500" in palette.json → ["palette", "gray", "500"]
// "100" in font-size.json → ["font-size", "100"]: a variable without the
// file's group in front gets it, so tokens from different files can't collide.
function toPath(figmaName, fileGroup) {
  const parts = figmaName.split("/").map((part) => part.trim());
  parts[0] = RENAME_TOP_GROUP[parts[0]] ?? parts[0];
  if (parts[0] !== fileGroup) parts.unshift(fileGroup);
  return parts;
}

// Figma stores decimals imprecisely: 1.100000023841858 → 1.1
function roundFloat(value) {
  return typeof value === "number" ? Math.round(value * 1000) / 1000 : value;
}

// { r: 0.5176, g: 0.5569, b: 0.5804, a: 1 } → "#848e94" (8 digits if see-through)
function toHex({ r, g, b, a = 1 }) {
  const channel = (value) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}${a < 1 ? channel(a) : ""}`;
}
