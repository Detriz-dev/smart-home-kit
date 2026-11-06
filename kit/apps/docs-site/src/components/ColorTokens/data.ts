// The kit's color tokens, as the Colors page shows them.
// Names and aliases mirror the Figma variables in "DeTriz - Smart Home Kit" and
// kit/packages/tokens/src (primitive/palette.json and semantic/*.json). They were
// checked against each other on 2026-11-06. The hex values are not copied here:
// the components read them from tokens.css in the browser, so they can't drift.

/** The hues of the palette, in the order Figma lists them. */
export const PALETTE_HUES = ["gray", "blue", "green", "amber", "red"] as const;

/** The 11 steps of every hue, light to dark. */
export const PALETTE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/** One semantic color token. */
export interface ColorToken {
  /** The Figma variable's name inside its collection, e.g. "danger/bg". */
  figmaName: string;
  /** The palette color it points to, as Figma writes it, e.g. "red/100" or "white". */
  palette: string;
  /** What the token is for, in one short line. */
  usage: string;
}

/** A Figma variable collection of semantic colors. */
export interface ColorGroup {
  /** The Figma collection name, which is also the start of the CSS name. */
  collection: string;
  /** What the swatch shows: text in the color, or a filled box. */
  preview: "text" | "fill" | "border";
  tokens: ColorToken[];
}

export const COLOR_GROUPS = {
  text: {
    collection: "color-text",
    preview: "text",
    tokens: [
      {
        figmaName: "primary",
        palette: "gray/900",
        usage: "Main text, values and names.",
      },
      {
        figmaName: "secondary",
        palette: "gray/700",
        usage: "Quieter text, like Units and icons in Readings.",
      },
      {
        figmaName: "disabled",
        palette: "gray/400",
        usage: "Text of something that can't be used right now.",
      },
      { figmaName: "inverse", palette: "white", usage: "Text on a dark fill." },
    ],
  },
  surface: {
    collection: "surface",
    preview: "fill",
    tokens: [
      {
        figmaName: "page",
        palette: "gray/50",
        usage: "The page behind the cards.",
      },
      {
        figmaName: "default",
        palette: "white",
        usage: "Cards and components.",
      },
      {
        figmaName: "sunken",
        palette: "gray/100",
        usage: "An area set into a surface.",
      },
    ],
  },
  border: {
    collection: "color-border",
    preview: "border",
    tokens: [
      {
        figmaName: "subtle",
        palette: "gray/100",
        usage: "The quiet outline of a card on a surface, like SensorReading.",
      },
    ],
  },
  action: {
    collection: "action",
    preview: "fill",
    tokens: [
      {
        figmaName: "primary/bg",
        palette: "blue/600",
        usage: "Fill of the main action, like Button primary.",
      },
      {
        figmaName: "primary/bg-hover",
        palette: "blue/700",
        usage: "That fill under the pointer.",
      },
      {
        figmaName: "primary/bg-pressed",
        palette: "blue/800",
        usage: "That fill while pressed.",
      },
      {
        figmaName: "primary/fg",
        palette: "white",
        usage: "Text on the main action's fill.",
      },
      {
        figmaName: "secondary/bg",
        palette: "white",
        usage: "Fill of every other action, like Button secondary.",
      },
      {
        figmaName: "secondary/bg-hover",
        palette: "gray/100",
        usage: "That fill under the pointer.",
      },
      {
        figmaName: "secondary/bg-pressed",
        palette: "gray/200",
        usage: "That fill while pressed.",
      },
      {
        figmaName: "secondary/border",
        palette: "gray/600",
        usage: "Outline of a secondary action.",
      },
      {
        figmaName: "secondary/fg",
        palette: "gray/900",
        usage: "Text of a secondary action.",
      },
      {
        figmaName: "disabled/bg",
        palette: "gray/100",
        usage: "Fill of an action that can't be used right now.",
      },
      {
        figmaName: "disabled/border",
        palette: "gray/200",
        usage: "Outline of a disabled secondary action.",
      },
      {
        figmaName: "disabled/fg",
        palette: "gray/400",
        usage: "Text of a disabled action.",
      },
      {
        figmaName: "focus",
        palette: "blue/600",
        usage: "Keyboard focus ring around an action.",
      },
    ],
  },
} satisfies Record<string, ColorGroup>;

/** The five status roles, each built from one palette hue. */
export const STATUS_ROLES = [
  { role: "neutral", hue: "gray", sample: "Disconnected" },
  { role: "progress", hue: "blue", sample: "Connecting" },
  { role: "success", hue: "green", sample: "Connected" },
  { role: "warning", hue: "amber", sample: "Stale" },
  { role: "danger", hue: "red", sample: "Fault" },
] as const;

/** The five parts of every status role, and the palette step each one uses. */
export const STATUS_PARTS = [
  { part: "solid", step: "400", usage: "A strong fill, like the status dot." },
  {
    part: "on-solid",
    step: null,
    usage: "Text on the solid fill. Always gray/950.",
  },
  { part: "bg", step: "100", usage: "A light fill behind a message." },
  { part: "border", step: "600", usage: "The outline of a message." },
  {
    part: "fg",
    step: "800",
    usage: "Text and icons on the light fill or on white.",
  },
] as const;

/** "gray/900" → "--shk-palette-gray-900"; "white" → "--shk-palette-white". */
export function paletteVar(palette: string): string {
  return `--shk-palette-${palette.replace("/", "-")}`;
}

/** Figma collection + variable name → CSS variable, e.g. "status" + "danger/bg" → "--shk-status-danger-bg". */
export function cssVar(collection: string, figmaName: string): string {
  return `--shk-${collection}-${figmaName.replace(/\//g, "-")}`;
}
