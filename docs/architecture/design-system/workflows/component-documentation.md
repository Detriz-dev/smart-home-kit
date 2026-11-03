# Component documentation workflow

How to write the page that people **using** the kit read on the docs site, one page per component. People and AI agents follow the same steps in the same order.

This is the last part of building a component. The [component building workflow](./component-building.md) ends with a component, its spec (`<Name>.md`) and its stories. This workflow turns them into a page for users.

Worked example: [`location-path.mdx`](/kit/apps/docs-site/docs/ui-components/context/location-path.mdx).

```
0. Ready? → 1. Create the page → 2. Write the sections → 3. Live examples → 4. Check in the browser → 5. Ship
```

## Contents

- [Spec or page: who reads what](#spec-or-page-who-reads-what)
- [How the live examples work](#how-the-live-examples-work)
- [Step 0. Check the component is ready](#step-0-check-the-component-is-ready)
- [Step 1. Create the page](#step-1-create-the-page)
- [Step 2. Write the sections](#step-2-write-the-sections)
- [Step 3. Add live examples](#step-3-add-live-examples)
- [Step 4. Check in the browser](#step-4-check-in-the-browser)
- [Step 5. Ship](#step-5-ship)
- [Checklist](#checklist)
- [When something goes wrong](#when-something-goes-wrong)

## Spec or page: who reads what

Each component has two documents. They don't replace each other.

|          | Spec: `<Name>.md`                                                 | User page: `<name>.mdx`                                 |
| -------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| Where    | Next to the code, in `kit/packages/ui/src/…`                      | `kit/apps/docs-site/docs/ui-components/<category>/`     |
| Read by  | The team building the kit                                         | Developers using the kit                                |
| Answers  | "What should this component do and why?"                          | "How do I use it, and what do I need to watch out for?" |
| Contains | Figma node IDs, target-states table, anatomy tree, open questions | Live examples, props, data mapping, accessibility       |

**Rule:** the spec is the source of truth for decisions. The page is written from it. If you find something on the page that the spec doesn't say, fix the spec first.

### One home for each fact

Writing the same fact in two places means one copy goes out of date. So each kind of information lives in one place, and the others link to it.

| Information                                                 | Lives in          | Others                                                                     |
| ----------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| Props: names, types, defaults, descriptions                 | `<Name>.types.ts` | The spec links to it. The page's props table copies its `/** */` comments. |
| Decisions and their reasons, domain rules                   | Spec              | The page says what to do, without the history.                             |
| Figma mapping, target-states table, anatomy, open questions | Spec only         | Not on the page.                                                           |
| How to use it: examples, data mapping, "what's up to you"   | Page              | The spec links to the page at the top.                                     |

After the page is written, update the spec (see [Step 5](#step-5-ship)):

- Add a line at the top linking to the user page and to `<Name>.types.ts`.
- Replace the spec's API block with a link to `<Name>.types.ts`, keeping only the decisions behind the props. The API block was needed before the code existed; now the types file is the source.
- Add anything the page says that the spec doesn't.

Worked example: [`LocationPath.md`](/kit/packages/ui/src/components/context/LocationPath/LocationPath.md).

## How the live examples work

This is already set up for the whole site. You only need to know how it works, not change it.

The examples on the page render the **real** components from `@detriz-sh-kit/ui`, not pictures or sketches. Each example is written once, in a code block, and Docusaurus shows both the result and the code. Readers can edit the code and see the result change.

| File                                                    | What it does                                                                                                                                       |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kit/apps/docs-site/package.json`                       | Lists `@detriz-sh-kit/ui`, `@detriz-sh-kit/tokens`, the fonts and `@docusaurus/theme-live-codeblock`.                                              |
| `kit/apps/docs-site/docusaurus.config.ts`               | Turns on live code blocks (result above the code) and loads `src/kit-styles.ts` on every page.                                                     |
| `kit/apps/docs-site/src/kit-styles.ts`                  | Loads the fonts, the tokens and the components' CSS once, the same way an app would.                                                               |
| `kit/apps/docs-site/src/theme/ReactLiveScope/index.tsx` | Lists what live examples can use: React and **every export of `@detriz-sh-kit/ui`**. A new component is available here as soon as `ui` exports it. |
| `kit/apps/docs-site/src/css/custom.css`                 | Gives the result area the kit's surface colour, so components look right in dark mode too.                                                         |

Two things make the kit's CSS look right inside Docusaurus:

- **CSS layers.** `future.v4: true` in the config puts Docusaurus's own CSS in layers. The kit's CSS is in `@layer detriz`, which comes after them, so the kit wins. Without this, Docusaurus's styles for every `<ol>` (indent, margins) would change `LocationPath`.
- **The built `ui`.** The site uses `ui`'s `dist/` folder, not its source. After you change a component, rebuild `ui` to see the change on the site.

## Step 0. Check the component is ready

Write the page only when:

- [ ] The component is merged or on your branch, with its spec, stories and types.
- [ ] It is exported from `kit/packages/ui/src/index.ts`. If it isn't, live examples can't use it.
- [ ] The spec has no open questions that change how people use it. Open questions that don't affect users can stay in the spec.

## Step 1. Create the page

1. Make the file `kit/apps/docs-site/docs/ui-components/<category>/<kebab-name>.mdx`, for example `context/location-path.mdx`. The category folder matches the component's folder in `ui`.
2. Add the front matter:

   ```md
   ---
   sidebar_position: 3
   sidebar_label: LocationPath
   description: One sentence about what it shows. Used by search engines and link previews.
   ---
   ```

3. Add the title: `# <ComponentName>`, the same name as in code.

## Step 2. Write the sections

Use these sections, in this order. Each one answers one question a developer has. Leave a section out only if it truly doesn't apply, and never leave a heading with nothing under it.

| #   | Section                      | The developer's question                       | What to write                                                                                                                                                                                                                                         | Take it from (spec)               |
| --- | ---------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | Intro (no heading)           | "What is this?"                                | One or two sentences, then one live example of the most common use.                                                                                                                                                                                   | Purpose                           |
| 2   | Import                       | "How do I get it?"                             | The `import` line, the CSS imports, and a link to Installation.                                                                                                                                                                                       | –                                 |
| 3   | Basic usage                  | "What's the smallest code that works?"         | A plain `tsx` block (not live) **with** the import line, and a note that the live examples below leave it out.                                                                                                                                        | Example values                    |
| 4   | When to use it               | "Is this the right component?"                 | "Use it for" and "Don't use it for", each "don't" naming the component to use instead.                                                                                                                                                                | Purpose, "What it does not show"  |
| 5   | Variants or States           | "Can it fit my screen / my data?"              | A short table, then one live example per variant or state. Context, Layout, Comparison and Feedback components have **variants**. Status, Readings, History and Controls components have **states** (loading, Connected, Stale, Disconnected, Fault). | States table                      |
| 6   | Component-specific behaviour | Depends on the component                       | For example "Showing only some parts" for LocationPath. One live example that shows several cases.                                                                                                                                                    | States, rules                     |
| 7   | Mapping your data            | "Which field from my data goes in which prop?" | A table: prop → Glossary term (linked) → example. Then the domain rules a developer can get wrong.                                                                                                                                                    | Component in domain model context |
| 8   | Props                        | "What exactly can I pass?"                     | A table: prop, type, default, description. Copy the descriptions from the `/** */` comments in `<Name>.types.ts`. Mention the exported types.                                                                                                         | API, `<Name>.types.ts`            |
| 9   | Long text                    | "Will it break my layout?"                     | What happens when names or values are long, and a live example in a narrow container.                                                                                                                                                                 | Anatomy, `LongText` story         |
| 10  | Accessibility                | "What do I get for free, and what's my job?"   | Two lists: "What you get without doing anything" and "What's up to you".                                                                                                                                                                              | Accessibility                     |
| 11  | Styling                      | "Can I change how it looks?"                   | The tokens it uses, and how to override a token on a parent element.                                                                                                                                                                                  | Tokens                            |
| 12  | Related components           | "What do I use next to it?"                    | A list of components with one line each. Link only to pages that exist.                                                                                                                                                                               | –                                 |

### Leave out of the page

These stay in the spec:

- Figma node IDs, Figma file names and Figma property names
- the target-states table ("Applies? / Why") – it is the team's checklist
- the anatomy tree
- open questions and anything marked "later"

### Writing rules

- **Use Glossary terms exactly**, with a capital letter: Site, Space, Hub, Module, Sensor, Reading, Connection Status… Link to the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) the first time a term matters.
- **Write for someone who has never seen the spec.** Say what to do ("Leave `floorName` out"), not how it was decided.
- **Short and plain.** One idea per sentence. Tables for things people compare, lists for things people check.
- **Promise only what the code does.** If you write "shows a tooltip", check the component really sets `title`. If a prop doesn't exist (for example `className`), don't suggest it.
- Admonitions use the bracket syntax: `:::tip[Try it]`, not `:::tip Try it` (v4 mode doesn't support the old one).

## Step 3. Add live examples

Write examples as **live** code blocks:

````md
```jsx live
<LocationPath
  siteName="My flat"
  spaceName="Bedroom"
  deviceName="Climate Module"
/>
```
````

Rules:

- **Use `jsx live`, not `tsx live`.** Live blocks can't read TypeScript types. Examples are plain JSX anyway.
- **No `import` lines.** Every `ui` export is already available. Only the Basic usage block (a normal `tsx` block) shows the import.
- **Use only exported components.** To show several cases in one example, wrap them in kit components such as `<StackLayout>`, and add a `{/* comment */}` above each one saying which case it is.
- **Use realistic example values**, the same ones as in the spec and the stories ("My flat", "Bedroom", "Climate Module").
- **Containers with a width.** Inline styles are fine only to give an example a width: a narrow container for the long-text example (`<div style={{ maxWidth: 320 }}>…</div>`), or a realistic width for a component that fills its parent, like a card. They belong to the reader's page, not the component. Say once on the page why the examples have a wrapper.
- **One live example per variant or state**, plus the intro, the behaviour section and long text. Don't repeat the same example twice.

## Step 4. Check in the browser

1. Build what the site needs and serve it:

   ```sh
   pnpm turbo run build --filter=docs-site...
   pnpm --filter docs-site serve
   ```

   While writing, `pnpm docs-site` reloads the page as you type. Remember to rebuild `ui` if you change the component itself.

2. Open the page and check:
   - [ ] Every live example shows a result, not an error in red.
   - [ ] The component looks the same as in Storybook (font, spacing, icons, no list bullets or extra indent).
   - [ ] Dark mode: the results still sit on a light surface and are readable.
   - [ ] The long-text example really shortens the text.
   - [ ] Admonitions show as coloured boxes, not as `:::` text.
   - [ ] Every link works. The build fails on broken links, so a passing build already checks most of them.

## Step 5. Ship

1. Format **only the files you changed**, for example:

   ```sh
   pnpm exec prettier --write kit/apps/docs-site/docs/ui-components/context/location-path.mdx
   ```

   Running Prettier on the whole docs folder also reformats pages you didn't touch.

2. Update the spec, as described in [One home for each fact](#one-home-for-each-fact): link to the page and the types file at the top, replace the API block with a link, and add anything the page says that the spec doesn't.
3. Link to the new page from older ones. Search the other component pages for the component's name in backticks (for example `` `SensorLabel` ``) and turn those mentions into links.
4. Typecheck the site: `pnpm --filter docs-site typecheck`.
5. Commit with a Conventional Commit scoped to the docs site, for example `docs(docs-site): add LocationPath page`.

## Checklist

- [ ] The component is exported from `ui`'s `src/index.ts`.
- [ ] The page is at `docs/ui-components/<category>/<kebab-name>.mdx`, with `sidebar_label` and `description`.
- [ ] The sections follow the order in Step 2. No empty headings.
- [ ] No Figma IDs, target-states table, anatomy tree or open questions.
- [ ] Glossary terms are used exactly and linked where they matter.
- [ ] The props table matches `<Name>.types.ts`.
- [ ] Examples are `jsx live`, with no imports, using realistic values.
- [ ] One live example per variant or state, plus long text.
- [ ] Checked in the browser, light and dark mode.
- [ ] Spec updated: links to the page and `<Name>.types.ts`, API block replaced by a link, nothing on the page missing from the spec.
- [ ] Older pages that mention the component now link to the new page.
- [ ] Only changed files formatted. The build and typecheck pass.

## When something goes wrong

| Problem                                                 | Why                                                                                                                             | Fix                                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Live examples show only code, with no Result box        | The dev server was started before live code blocks were set up. It reads `docusaurus.config.ts` and new packages only at start. | Stop `pnpm docs-site` (Ctrl+C) and start it again.                                                                                  |
| A live example shows "`<Name>` is not defined"          | The component isn't exported from `ui`, or `ui` wasn't rebuilt.                                                                 | Export it from `src/index.ts`, then `pnpm --filter @detriz-sh-kit/ui build`.                                                        |
| The page shows the old look of a component              | The site uses the built `ui`.                                                                                                   | Rebuild `ui`, then restart `pnpm docs-site`.                                                                                        |
| A live example shows a syntax error with a type in it   | The block uses TypeScript.                                                                                                      | Remove the types and use `jsx live`.                                                                                                |
| The component has a list indent, bullets or odd margins | Docusaurus's CSS is winning over the kit's.                                                                                     | Check `future.v4: true` is still in `docusaurus.config.ts`, and that the kit's CSS is in `@layer detriz`.                           |
| Text uses the wrong font                                | The fonts aren't loaded.                                                                                                        | Check the font imports in `src/kit-styles.ts` cover the weights the tokens use.                                                     |
| Sizes look the same height in an example                | `ColumnLayout` stretches its columns to the same height.                                                                        | Compare sizes in a `StackLayout` (inside a `maxWidth` wrapper for cards). Use `ColumnLayout` only when the items are the same size. |
| A token change doesn't show up                          | `tokens` wasn't rebuilt.                                                                                                        | `pnpm --filter @detriz-sh-kit/tokens build`, then rebuild `ui`.                                                                     |
| `:::tip Title` shows as text                            | The old admonition title syntax.                                                                                                | Use `:::tip[Title]`.                                                                                                                |
