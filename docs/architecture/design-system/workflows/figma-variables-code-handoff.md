# Figma varaibles → code handoff

How design tokens and components move from Figma into this repo (`kit/packages/tokens`, `kit/packages/ui`), and how to name things so both sides match.

## 1. Figma is the source of truth

Tokens are **designed and edited in Figma**, as Figma variables. The JSON in the repo is **generated** from Figma and nobody edits it by hand.

Why:

- Editing nested JSON by hand is slow and easy to get wrong. Figma's variables panel shows colours, scales and modes visually.
- The designer owns the decisions, so the designer's tool should hold them.
- Git still gives history and review: every token change arrives as a pull request with a readable diff.

Editing in only one place is the important part. If both Figma and the JSON get edited, they slowly drift apart.

## 2. The flow

```
 Figma variables ──export──▶ figma/<layer>/*.json ──convert──▶ src/<layer>/*.json ──build──▶ tokens.css ──▶ ui / Storybook
   (you edit here)          (raw Figma export)             (DTCG, generated,        (Style Dictionary)
                                                          never edited by hand)
```

### Workflow: changing a token

Run the commands from the repo root.

1. **Be on a branch for the issue.** One branch per issue, not one per export: you can export, convert and commit many times on the same branch. Only make a new one when you start a new issue: `git switch -c <issue-number>-short-name`.
2. **Edit** the variables in Figma (section 6 covers the naming).
3. **Export** the collection from Figma and save the file in the folder for its layer, for example over `kit/packages/tokens/figma/primitive/palette.json`. Don't put it in `src/`. Only put real Figma exports in these folders, because every file in them gets imported.
4. **Convert** it to DTCG:

   ```bash
   pnpm --filter @detriz-sh-kit/tokens figma:import
   ```

   This converts **every** `figma/<layer>/<name>.json` into `src/<layer>/<name>.json`, overwriting it (see "The converter" below).

5. **Build** the CSS:

   ```bash
   pnpm --filter @detriz-sh-kit/tokens build
   ```

6. **Check** the result in Storybook: `pnpm storybook`.
7. **Commit** both the raw export and the converted file, then open a PR:

   ```bash
   git add kit/packages/tokens/figma kit/packages/tokens/src
   git commit -m "feat(tokens): update palette from Figma"
   ```

   The diff of `src/primitive/palette.json` shows exactly which values changed. Don't commit `dist/`.

8. **Publish the Figma library** once the PR is merged, so the design files and the code change together.

### What happens to the files in `src/`

Style Dictionary only reads `src/`, so the files there stay and stay committed. What changes is **who writes them**:

| File                                                                                                     | Written by                             | Today                                                       |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `src/primitive/*.json` (palette, space, size, radius, border-width, font-*, letter-spacing, line-height) | The converter, from `figma/primitive/` | Generated. Never edit by hand; overwritten on every import. |
| `src/semantic/color.json`                                                                                | You, by hand                           | Hand-written until a `semantic` collection exists in Figma. |
| `src/component/`                                                                                         | Nobody yet                             | Empty.                                                      |

So you **don't add or copy files into `src/` yourself**. You save exports into `figma/`, and the converter writes `src/`.

To move another group into Figma (for example spacing):

1. Create the variables in Figma (`space/xs`, `space/sm`, …) with the same names as the existing JSON, so the CSS names don't change.
2. Export the collection to `figma/primitive/space.json`. The folder and file name decide the output: `figma/primitive/space.json` → `src/primitive/space.json`.
3. Run `figma:import`. From then on, `src/primitive/space.json` is generated too. Nothing else needs changing.

If a hand-written file and a generated file define the same token, the one Style Dictionary reads last wins, and it prints a "token collision" warning. Keep every token in exactly one file.

### The converter

Figma's variable export is **not** DTCG. It is a flat list of variables, with colours as `r/g/b` numbers from 0 to 1:

```json
{
  "name": "color/gray/500",
  "type": "COLOR",
  "valuesByMode": { "104:1": { "r": 0.5176, "g": 0.5569, "b": 0.5804, "a": 1 } }
}
```

`kit/packages/tokens/scripts/figma-to-dtcg.mjs` turns that into the DTCG JSON Style Dictionary reads:

```json
{ "palette": { "gray": { "500": { "$type": "color", "$value": "#848e94" } } } }
```

If a file in `figma/` is already DTCG (it has `$type` and `$value`), the converter copies it as it is, only applying the group renames below.

What it does with Figma's own format:

- **Names → nesting.** `color/gray/500` becomes `palette` → `gray` → `500`.
- **The file name is the group.** A variable whose name doesn't start with the file's name gets it in front: `100` in `font-size.json` becomes `font-size` → `100` (`--shk-font-size-100`). Without this, `100` from `font-size.json` and `100` from `radius.json` would be the same token, and Style Dictionary would warn about "token collisions".
- **Renames groups** listed in `RENAME_TOP_GROUP` at the top of the script. Today it turns `color/` into `palette/`. Once the group is called `palette` in Figma, remove that entry.
- **Colours → hex.** `r/g/b` becomes `#848e94` (8 digits if the colour is see-through).
- **Numbers get a unit.** Number variables become `px` dimensions, with these exceptions:
  - font weight and opacity stay plain numbers (`500`);
  - the **line-height primitives** (`line-height.json`) stay plain multipliers (`1.5`), because in CSS `1.5` means 1.5 × the font size. A line height typed straight into a semantic token (`70`) is px, because that's what Figma uses;
  - the **letter-spacing primitives** (`letter-spacing.json`) are a percent of the font size, so `-2` becomes `-0.02em`. Letter spacing typed straight into a semantic token (`-1.28`) is px.
- **Rounds decimals.** Figma stores `1.1` as `1.100000023841858`; the converter writes `1.1`.
- **Aliases → `{…}`.** A variable that points to another one becomes `"{font-size.1000}"`, also when it points to a different collection (a semantic token pointing to a primitive). The converter reads every file in `figma/` to find the target, so export all collections you point to. If the target isn't exported, it uses the raw value and prints a warning.
- **Descriptions → `$description`.**
- **Modes.** It uses the first mode. For a collection with several modes, pass the name: `node scripts/figma-to-dtcg.mjs figma/semantic/color.json src/semantic/color.dark.json --mode dark`.

Rules:

- `figma/` holds the **raw exports**, committed exactly as Figma wrote them. Prettier ignores the folder, and Style Dictionary doesn't read it.
- Generated files in `src/` are never edited by hand; change Figma, export and convert again.
- The converter is a separate step, not part of `build`. That way the PR shows the readable `src/` diff, and the build stays simple.

## 3. How DTCG JSON becomes CSS (Style Dictionary)

### What DTCG JSON is

**DTCG** stands for Design Tokens Community Group, a W3C group that agreed on one JSON format for design tokens. Figma, Tokens Studio and Style Dictionary all read and write it, so the tools can work together.

A token is a JSON object with a few keys that start with `$`:

| Key            | Meaning                                                     | Example                                          |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `$value`       | The value, or an alias to another token in `{curly.braces}` | `"#7a8291"`, `"{palette.gray.500}"`              |
| `$type`        | What kind of value it is                                    | `color`, `dimension`, `fontFamily`, `fontWeight` |
| `$description` | Optional note for people                                    | `"Labels and secondary text"`                    |

Everything else is **grouping**. The nesting of the JSON is the token's name:

```json
{
  "color": {
    "text": {
      "muted": {
        "$type": "color",
        "$value": "{palette.gray.500}",
        "$description": "Labels and secondary text"
      }
    }
  }
}
```

This is one token called `color.text.muted`. It points to the primitive `palette.gray.500`.

### What Style Dictionary does

Style Dictionary is a build tool that turns token JSON into code. Ours is set up in `kit/packages/tokens/build/config.json` and runs with `pnpm --filter @detriz-sh-kit/tokens build`. It does four things:

1. **Read.** It loads every file matching `"source": ["src/**/*.json"]` and merges them into one big tree. That's why a semantic file can point to a token in a primitive file.
2. **Resolve aliases.** `{palette.gray.500}` is replaced with that token's value, `#7a8291`.
3. **Transform.** The `"transformGroup": "css"` setting turns each token's path into a CSS name: `color.text.muted` becomes `color-text-muted`, and `"prefix": "shk"` adds `shk-` in front.
4. **Format and write.** `"format": "css/variables"` writes every token as a CSS variable inside `:root { }`, into `dist/tokens.css`. `$description` becomes a comment.

The result for the token above:

```css
:root {
  --shk-palette-gray-500: #7a8291;
  --shk-color-text-muted: #7a8291; /** Labels and secondary text */
}
```

Components then use the semantic variable in their CSS Modules: `color: var(--shk-color-text-muted);`.

### Keeping aliases in the CSS

By default the alias is resolved, so `--shk-color-text-muted` gets the raw colour. Adding `"options": { "outputReferences": true }` to the file entry in `config.json` keeps the link instead:

```css
--shk-color-text-muted: var(--shk-palette-gray-500);
```

This makes the CSS easier to read and debug, and dark mode needs it: the dark theme only has to swap the semantic variables, and the primitives stay as they are.

### Adding more outputs

Each entry under `"platforms"` is one output. Today there is only `css`. Later you could add, for example, a `js` platform (`"transformGroup": "js"`, `"format": "javascript/es6"`) to export the tokens as JavaScript constants for charts, or a second CSS file for the dark theme (section 7). One JSON source can feed all of them.

## 4. Export tools

Pick one. They are listed from simplest to most automated.

| Tool                                                                                  | How it works                                                                                                     | Good                                                                                           | Watch out                                                                                                               |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Figma native export**                                                               | Variables panel → export the collection as JSON. Figma's own format, not DTCG, so it goes through our converter. | Built in, no plugin.                                                                           | New feature: check your plan has it. You copy the files into the repo yourself.                                         |
| **Export plugin** (for example "Variables Import/Export" or "Design Tokens Exporter") | Run the plugin and download the JSON.                                                                            | Free, works on any plan.                                                                       | Check that it outputs DTCG (`$value`, `$type`) and keeps aliases (`{palette.gray.900}`).                                |
| **Tokens Studio**                                                                     | The plugin pushes the JSON straight to a GitHub branch and you open a PR.                                        | No copying files, and it handles modes and themes well.                                        | It stores tokens in its own format next to Figma variables. Some features (multi-file sync, themes) need the paid plan. |
| **Figma MCP + a fixed export script**                                                 | Claude reads the variables through the MCP, saves them into `figma/` and runs the converter (section 5).         | One sentence to Claude ("export the tokens from Figma") and the files land in the right place. | Needs the Figma MCP connected.                                                                                          |
| **Figma Variables REST API**                                                          | A CI job pulls the variables on a schedule.                                                                      | Fully automatic.                                                                               | Variable read/write needs an **Enterprise** plan.                                                                       |

**What we use today:** Figma's own variable export, saved into `figma/`, then our converter (section 2). It works on any plan and needs no plugin. Move to the **MCP script** or **Tokens Studio** once copying files gets tedious.

## 5. Where MCP fits

An LLM can give slightly different output each run, but a token pipeline must give the same result every time. So Claude **never writes the token JSON itself**. It runs a **fixed script** that does.

- **Exporting tokens (planned).** Claude reads the variables through the Figma MCP and saves them into `figma/` in the same raw format as Figma's export, then runs the converter (section 2). This skips the manual export and file copying. The conversion is still done by the script, so the output is the same every time.
- **Drift audits.** "Compare the Figma variables with `src/` and list what's different." Useful before a release.
- **Design-to-code for components.** Read a frame, get the variables it uses (`get_variable_defs`), and write the component with the right `var(--shk-…)` names.
- **Code Connect.** Link the Figma `Gauge` to `kit/packages/ui/src/sensor/Gauge`, so Dev Mode shows the real React snippet instead of generated CSS.

## 6. Naming variables in Figma

The rule: **one name, three spellings, no translation table.**

```
Figma variable     color/text/muted
JSON path          color.text.muted          ← alias: {color.text.muted}
CSS variable       --shk-color-text-muted
```

Figma uses `/` to make groups. On export those groups become JSON nesting, and Style Dictionary joins the parts with `-`. If you name things well in Figma, the code names come out right without extra work.

### Collections (one per token layer)

| Collection  | Modes                       | Published to designers?                                                           | Exported to      |
| ----------- | --------------------------- | --------------------------------------------------------------------------------- | ---------------- |
| `primitive` | one (`default`)             | **Hidden from publishing.** Designers shouldn't pick `palette/blue/500` directly. | `src/primitive/` |
| `semantic`  | `light`, `dark`             | Yes. This is what designers use.                                                  | `src/semantic/`  |
| `component` | `light`, `dark` (if needed) | Yes, used inside components.                                                      | `src/component/` |

### Rules for names

- Lowercase, one word per segment where possible, kebab-case if not (`color/surface-raised`, not `Surface Raised`). No spaces or emoji, because those break the CSS name.
- Number scales stay numbers (`palette/gray/900`) and t-shirt sizes stay words (`space/md`).
- Semantic tokens follow the order **category / property / variant / state**: `color/text/muted`, `color/border/focus`, `color/surface/hover`. Decide the order once, before creating many variables, because renaming later breaks every component that uses them.
- **Write a description** on every variable you can. It is exported as `$description` and ends up in the code docs.
- **Set "Code syntax → Web"** on every variable to `var(--shk-color-text-muted)`. Dev Mode then shows the real CSS variable to whoever builds it.
- **Set scopes.** Text colours get "Text fill" only, spacing gets "Gap / Padding" only. Designers then can't put a spacing token on a corner radius.

### Status colours use the domain language

Connection Status is Connected / Stale / Disconnected, plus a separate Fault (see `kit/apps/docs-site/docs/domain-model/glossary.mdx`). Use two layers in the `semantic` collection:

```
color/feedback/success | warning | danger | info       ← generic, reusable
color/connection/connected    → color/feedback/success
color/connection/stale        → color/feedback/warning
color/connection/disconnected → color/text/muted
color/fault                   → color/feedback/danger
```

Components then say what they mean (`connection-stale`), and the palette can change underneath.

## 7. What Figma can't hold, and how to handle it

- **Units.** Figma number variables have no unit (`16`). The export (plugin, script or a Style Dictionary transform) adds `px`.
- **Font stacks.** Make the font family a string variable holding the full stack (`system-ui, sans-serif`). Figma only uses the first font for rendering, but the code gets the whole stack.
- **Typography and elevation.** Full text styles and shadows (Elevation) are Figma **Styles**, not variables, and most exporters skip them. Build them from variables in Figma (font size, weight, colour). If code needs composite tokens later, keep a small hand-written file such as `src/manual/elevation.json` and note it in its `$description`. That's the only JSON anyone edits by hand.
- **Dark mode.** Figma keeps both modes in one variable. The export gives one file per mode (`semantic.light.json`, `semantic.dark.json`). Style Dictionary builds them into `:root { }` and `[data-theme="dark"] { }`. This needs a change to `build/config.json`. Decide on it before the first export and record it in an ADR.

## 8. Guard rails

- Add a short `kit/packages/tokens/src/README.md` listing which files are generated from Figma and which are hand-written (the table in section 2).
- Token PRs only contain token changes. Commit with `feat(tokens): …` or `fix(tokens): …`.
- In the PR, look at the diff: a renamed variable shows up as one name removed and another added. That breaks components, so search `kit/packages/ui/src` for the old `--shk-…` name before merging.

## 9. Component handoff checklist

- [ ] The Figma component uses only `semantic` or `component` variables, never primitives or raw values.
- [ ] It has all five states: loading, Connected, Stale, Disconnected (last value dimmed) and Fault.
- [ ] It has a Code Connect link to the React component.
- [ ] Each state has a Storybook story.
