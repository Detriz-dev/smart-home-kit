# How to create a component

This guide explains, from zero, how the DeTriz Smart Home Kit design system is built. It uses the first (deliberately tiny) component, `Gauge`, as the example. It's written for someone who is learning to code, so it explains every folder and every file, including the ones tools create for you (`node_modules`, `.turbo`, `dist`…).

After reading it you should be able to:

- explain what each folder and file in the repo is for, and which ones you edit,
- understand what happens when you type `pnpm storybook` or `pnpm build`,
- add a new design token,
- create a new component from scratch,
- see it in your browser in Storybook,
- fix the most common problems yourself.

You don't have to read it in one go. Sections 1–4 explain how things work; sections 5–9 are step-by-step instructions you can come back to; the last sections are reference.

For the bigger picture (why the kit is split into packages, how they'll connect to the Raspberry Pi), see the [Architecture Overview](../architecture/architecture-overview.md) and its [beginner's guide to `kit/packages`](../architecture/architecture-overview.md#appendix-understanding-kitpackages-a-beginners-guide).

## Contents

1. [Words you need first](#1-words-you-need-first)
2. [The big picture: three parts](#2-the-big-picture-three-parts)
3. [The whole repo, folder by folder](#3-the-whole-repo-folder-by-folder)
   - [Map of the repo](#map-of-the-repo)
   - [Four kinds of files](#four-kinds-of-files)
   - [Files at the repo root](#files-at-the-repo-root)
   - [Folders that tools create for you](#folders-that-tools-create-for-you): [`node_modules`](#node_modules-the-installed-packages), [`.turbo`](#turbo-the-build-cache-and-logs), [`dist`](#dist-the-built-package), [`storybook-static`](#storybook-static-the-built-website)
   - [`kit/packages/tokens`](#kitpackagestokens-the-design-decisions), including the [`build/`](#build-the-recipe-for-style-dictionary) folder
   - [`kit/packages/ui`](#kitpackagesui-the-components)
   - [`kit/apps/storybook`](#kitappsstorybook-the-documentation-website)
4. [How it all works together](#4-how-it-all-works-together)
   - [How a token reaches the screen](#how-a-token-reaches-the-screen)
   - [What happens when you run `pnpm storybook`](#what-happens-when-you-run-pnpm-storybook)
   - [What happens when you run `pnpm build`](#what-happens-when-you-run-pnpm-build)
   - [How an app uses the kit](#how-an-app-uses-the-kit)
5. [See it in your browser](#5-see-it-in-your-browser)
6. [Add a design token](#6-add-a-design-token)
7. [Create a new component, step by step](#7-create-a-new-component-step-by-step)
8. [Checklist for every component](#8-checklist-for-every-component)
9. [Commands](#9-commands)
10. [When something goes wrong](#10-when-something-goes-wrong)
11. [Glossary](#11-glossary)

---

## 1. Words you need first

A few words come up everywhere. If one is new, read its line here first; the [Glossary](#11-glossary) at the end has more.

| Word | What it means here |
| --- | --- |
| **Terminal** | The window where you type commands (in your editor, or the macOS Terminal app). |
| **Repo root** | The top folder of the project: `smart-home-kit/`, the one that contains `package.json`, `kit/` and `docs/`. **Run every command in this guide from here.** |
| **Package** | A folder with a `package.json` file. It has a name (like `@detriz-sh-kit/ui`) so other code can use it by name. |
| **Dependency** | Another package that a package needs (for example, `ui` needs `react`). |
| **Install** | Download all dependencies into `node_modules` folders. Command: `pnpm install`. |
| **Build** | Turn the code you write (`src/`) into code other programs can use (`dist/`). Command: `pnpm build`. |
| **Generated** | Created by a tool, not by you. Never edit generated files: they're overwritten on the next run. |
| **Monorepo / workspace** | One repo that holds several packages that are installed and built together. |
| **pnpm** | The tool that installs packages and runs scripts. |
| **Turborepo (turbo)** | The tool that runs builds across packages in the right order and remembers results so it doesn't redo work. |
| **Token** | A named design decision, like `color.accent = #1f6feb`. |
| **Component** | A reusable piece of UI, like `Gauge`, written in React. |
| **Props** | The inputs of a component: `<Gauge label="Kitchen" value={22.4} unit="°C" />`. |
| **Story** | One example of a component with specific props, shown in Storybook. |

---

## 2. The big picture: three parts

The design system has three parts. Each lives in its own folder under `kit/`:

| Part | Folder | Package name | Its job | Figma equivalent |
| --- | --- | --- | --- | --- |
| **Tokens** | `kit/packages/tokens` | `@detriz-sh-kit/tokens` | Store design decisions (colour, font, spacing) as named values | Variables |
| **Components** | `kit/packages/ui` | `@detriz-sh-kit/ui` | Reusable React components built only from tokens | Components |
| **Documentation** | `kit/apps/storybook` | `storybook` (private) | Show every component, in every state, in the browser | Library / documentation page |

Why **packages** for tokens and components, but an **app** for Storybook?

- A **package** is something other code installs and uses: Live Studio, the landing page, and one day other people's projects will install `@detriz-sh-kit/ui`.
- An **app** is something you run or open: nobody installs Storybook into their project; you open it in the browser. That's why its `package.json` says `"private": true`: it must never be published.

Right now the system has exactly **three tokens** and **one component**, on purpose. That's the smallest setup that still shows the whole pipeline:

| Token | Value | CSS variable |
| --- | --- | --- |
| `color.accent` | `#1f6feb` (blue) | `--dtz-color-accent` |
| `font.family.base` | `system-ui, sans-serif` | `--dtz-font-family-base` |
| `space.md` | `16px` | `--dtz-space-md` |

`Gauge` shows one Reading: a label, a value and a unit, like **Kitchen 22.4 °C**, in a blue box.

---

## 3. The whole repo, folder by folder

### Map of the repo

Everything below is in the repo today. Hidden files and folders (names starting with a dot, like `.turbo`) don't show up in Finder by default; in Finder press `Cmd + Shift + .` to show them, in the terminal use `ls -a`.

```
smart-home-kit/                       ← the repo root: run commands here
│
├── package.json                      🔧 the root "project card": scripts and shared tools
├── pnpm-workspace.yaml               🔧 where pnpm finds the packages; shared versions
├── pnpm-lock.yaml                    ⚙️ exact installed versions (generated, but committed)
├── turbo.json                        🔧 how Turborepo runs build/dev tasks
├── tsconfig.base.json                🔧 TypeScript settings shared by all packages
├── .gitignore                        🔧 files git must never save
├── .prettierignore                   🔧 files the code formatter must skip
├── node_modules/                     📦 installed tools for the root (generated, not in git)
├── .turbo/                           📦 Turborepo's cache (generated, not in git)
│
├── kit/                              the design system and everything users will install
│   ├── packages/
│   │   ├── tokens/                   @detriz-sh-kit/tokens
│   │   │   ├── package.json          🔧 name, build script, what others can import
│   │   │   ├── src/                  ✏️ YOU EDIT: the token values
│   │   │   │   ├── color.json
│   │   │   │   ├── typography.json
│   │   │   │   └── space.json
│   │   │   ├── build/
│   │   │   │   └── config.json       🔧 the recipe: how Style Dictionary turns src/ into dist/
│   │   │   ├── dist/                 ⚙️ GENERATED by the build
│   │   │   │   └── tokens.css
│   │   │   ├── node_modules/         📦 links to this package's tools
│   │   │   └── .turbo/               📦 log of the last build
│   │   │
│   │   └── ui/                       @detriz-sh-kit/ui
│   │       ├── package.json          🔧 name, scripts, dependencies, what others can import
│   │       ├── vite.config.ts        🔧 how Vite builds src/ into dist/
│   │       ├── tsconfig.json         🔧 TypeScript settings for editing and type checking
│   │       ├── tsconfig.build.json   🔧 TypeScript settings for writing type files into dist/
│   │       ├── src/
│   │       │   ├── index.ts          ✏️ YOU EDIT: the "front door", lists every public component
│   │       │   └── sensor/           a group of related components
│   │       │       └── Gauge/        one folder per component
│   │       │           ├── Gauge.tsx           ✏️ the component (structure + props)
│   │       │           ├── Gauge.module.css    ✏️ its styles (tokens only)
│   │       │           └── Gauge.stories.tsx   ✏️ its examples for Storybook
│   │       ├── dist/                 ⚙️ GENERATED: index.js, styles.css, *.d.ts
│   │       ├── node_modules/         📦 links to React, Vite, tokens…
│   │       └── .turbo/               📦 log of the last build
│   │
│   └── apps/
│       └── storybook/                the documentation website
│           ├── package.json          🔧 dev and build scripts
│           ├── .storybook/
│           │   ├── main.ts           🔧 where to find stories
│           │   └── preview.ts        🔧 loads tokens.css for every story
│           ├── storybook-static/     ⚙️ GENERATED: the built website
│           ├── node_modules/         📦 links to Storybook, React, ui, tokens…
│           └── .turbo/               📦 log of the last build
│
├── docs/                             ✏️ product and architecture documentation (this file)
├── frontend/                         the original Vite app; will move to platform/apps/studio
├── .idea/                            settings of JetBrains editors (WebStorm, IntelliJ)
├── .git/                             git's own database of your history; never touch
├── CLAUDE.md                         instructions for AI coding assistants
└── README.md                         the front page of the repo on GitHub
```

### Four kinds of files

Every file in the map has one of four icons. Knowing which kind a file is tells you what to do with it:

| Icon | Kind | Do you edit it? | Saved in git? | If you delete it… |
| --- | --- | --- | --- | --- |
| ✏️ | **Source**: what you write (components, tokens, docs) | **Yes**, this is your work | Yes | It's gone (unless it's in git history). Be careful. |
| 🔧 | **Configuration**: settings for tools | Rarely, when you change how a tool works | Yes | Tools stop working. |
| ⚙️ | **Generated output**: made by a build | **Never** | No (except `pnpm-lock.yaml`) | No problem: run the build again. |
| 📦 | **Installed / cache**: downloaded or remembered by tools | **Never** | No | No problem: run `pnpm install` or the build again. |

The single most useful rule: **you write in `src/`; tools write in `dist/`, `node_modules/`, `.turbo/` and `storybook-static/`.** If you edit a generated file, your change silently disappears the next time the tool runs.

### Files at the repo root

These files apply to the whole repo. You'll rarely change them, but it helps to know what each one does.

#### `package.json` (root)

The "project card" of the whole repo. It's never published (`"private": true`); it only holds scripts and tools everyone shares.

```json
{
  "name": "smart-home-kit",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.28.2",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "storybook": "turbo run dev --filter=storybook",
    "format": "prettier --write ."
  },
  "devDependencies": { "prettier": "…", "turbo": "…", "typescript": "…" }
}
```

(Shortened. JSON files can't contain comments, so explanations are in the table.)

| Field | What it does |
| --- | --- |
| `"private": true` | Protects the root from ever being published to npm by mistake. |
| `"type": "module"` | `.js` files use modern `import`/`export` syntax. |
| `"packageManager": "pnpm@11.28.2"` | Pins the pnpm version. Corepack (built into Node) reads this and uses exactly this version, so everyone who clones the repo gets the same pnpm. |
| `"engines"` | Says which Node.js version is needed (22 or newer). |
| `"scripts"` | Shortcuts. `pnpm storybook` runs `turbo run dev --filter=storybook`. You can type the short name instead of the long command. |
| `"devDependencies"` | Tools for the whole repo: **Prettier** (formats code), **Turborepo** (runs tasks), **TypeScript** (checks types). |

#### `pnpm-workspace.yaml`

Tells pnpm "this repo contains several packages, and here's where they are".

```yaml
packages:
  - "kit/packages/*"
  - "kit/apps/*"

allowBuilds:
  esbuild: true

catalog:
  react: ^19.3.0
  react-dom: ^19.3.0
  "@types/react": ^19.3.0
  "@types/react-dom": ^19.3.0
```

- **`packages`**: every folder matching these patterns that has a `package.json` is a package in the workspace. `*` means "any folder". So `kit/packages/tokens`, `kit/packages/ui` and `kit/apps/storybook` are all found automatically. A new package in `kit/packages/` is picked up without editing this file.
- **`allowBuilds`**: some packages want to run a script when they're installed. pnpm 11 blocks that by default, because a malicious package could run anything on your computer. `esbuild` (a fast compiler that Vite and Storybook use) is approved here, because its script only checks that the right version for your Mac is in place.
- **`catalog`**: one shared list of versions. Instead of writing `"react": "^19.3.0"` in every package (and risking different versions), packages write `"react": "catalog:"` and get the version from here. Upgrade React in one place, and every package follows.

What does `^19.3.0` mean? It's a **version range**: "19.3.0 or any newer 19.x.x". The `^` allows new features and fixes, but not version 20, which might break things. `~6.0.3` is stricter: "6.0.3 or any newer 6.0.x", fixes only.

#### `pnpm-lock.yaml`

A long, generated file that records the **exact** version of every package that was installed, including the dependencies of dependencies (about 260 packages right now). `package.json` says "React 19.x is fine"; the lockfile says "we installed exactly 19.3.0".

- **Why it matters:** without it, two people running `pnpm install` a week apart could get different versions, and "it works on my machine" bugs begin. With it, everyone gets exactly the same.
- **Commit it** to git, even though it's generated. It's the one generated file that belongs in git.
- **Never edit it by hand.** pnpm updates it whenever you add, remove or upgrade a package.

#### `turbo.json`

Tells Turborepo how to run each task (`build`, `dev`, `test`…) across all packages.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "storybook-static/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    }
  }
}
```

- **`"dependsOn": ["^build"]`**: before running this task in a package, first run `build` in all the packages **it depends on**. The `^` means "my dependencies". So before `ui` builds, `tokens` builds, because `ui` lists `@detriz-sh-kit/tokens` in its `package.json`. You never have to remember the order.
- **`"outputs"`**: which folders the task creates. Turborepo saves these in its cache (see [`.turbo`](#turbo-the-build-cache-and-logs)) so it can restore them later instead of rebuilding.
- **`"cache": false`** for `dev`: a dev server runs live, so there's nothing to save.
- **`"persistent": true`** for `dev`: this task keeps running until you stop it (`Ctrl + C`). Turborepo needs to know so it doesn't wait for it to "finish".

#### `tsconfig.base.json`

TypeScript settings shared by every package. Each package's own `tsconfig.json` starts from this file (`"extends"`) and adds only what's different. The main settings:

| Setting | What it does |
| --- | --- |
| `"target": "ES2022"` | Which JavaScript version to aim for. ES2022 runs in all modern browsers. |
| `"lib": ["ES2022", "DOM", "DOM.Iterable"]` | Which built-in things TypeScript knows exist: modern JavaScript, plus browser things like `document`. |
| `"module": "ESNext"`, `"moduleResolution": "bundler"` | Use modern `import`/`export`, and find imported files the way Vite does. |
| `"jsx": "react-jsx"` | Understand JSX (the HTML-like syntax in `.tsx` files) and turn it into React calls. |
| `"strict": true` | Turn on all the strict checks. Catches more mistakes, like using a value that might be missing. |
| `"skipLibCheck": true` | Don't type-check code inside `node_modules`. Faster, and other people's code isn't our problem. |
| `"noUnusedLocals"`, `"noUnusedParameters"` | Complain about variables and parameters you created but never use. Keeps code clean. |
| `"isolatedModules"`, `"verbatimModuleSyntax"` | Rules that make each file understandable on its own, which fast tools like Vite need. In practice: import types with `import type { … }`. |

#### `.gitignore`

A list of files and folders git must **never** save. If something is listed here, it doesn't show up in `git status` and can't be committed by accident.

| Line | Why |
| --- | --- |
| `node_modules/` | Installed packages. Huge (hundreds of MB), and anyone can recreate them with `pnpm install`. |
| `dist/`, `storybook-static/`, `*.tsbuildinfo` | Build output. Anyone can recreate it with `pnpm build`. |
| `.turbo/` | Turborepo's cache. Personal to your computer. |
| `*.log` | Log files. |
| `.env`, `.env.*` (but not `.env.example`) | Secret settings (passwords, API keys). **Must never be on GitHub.** `.env.example` shows which settings exist, without real values. |
| `.vscode/*`, `.DS_Store` | Editor settings and macOS Finder files. |

A rule like `node_modules/` matches a folder with that name **anywhere** in the repo, so one line covers the root and every package.

#### `.prettierignore`

[Prettier](https://prettier.io/) formats code automatically (spaces, quotes, line breaks) when you run `pnpm format`. This file lists what it should skip: the lockfile and build output (generated), and `frontend/` (it still has its own setup until it moves).

### Folders that tools create for you

These folders appear after you run `pnpm install` or a build. They're not in git, you never edit them, and **you can always delete them safely**: the next install or build recreates them.

#### `node_modules`: the installed packages

**What it is.** When you run `pnpm install`, pnpm downloads every package listed in all the `package.json` files (React, Vite, Storybook, Style Dictionary…) plus everything *those* packages need. All of that code goes into `node_modules` folders. When your code says `import { useState } from "react"`, Node and Vite look for a folder called `react` inside `node_modules`.

Right now the root `node_modules` is about **235 MB** and holds around **260 packages**, even though you listed only about a dozen. The rest are dependencies of dependencies.

**Why there's one in every package.** You'll find `node_modules` at the root *and* inside `tokens`, `ui` and `storybook`. Each package only sees the packages it declared in its own `package.json`. That's strict on purpose: if `ui` tried to import something it didn't declare, it would fail here, instead of failing later for a customer.

**How pnpm avoids downloading things many times.** If each package had its own full copy of React, you'd have the same files over and over. pnpm stores each version **once** and uses **links** (shortcuts) everywhere else:

```
~/Library/pnpm/store/                              ← pnpm's global store: one copy of every
                                                     version, shared by ALL your projects
        │
        ▼  (files are cloned from here, so they take almost no extra disk space)
smart-home-kit/node_modules/.pnpm/                 ← the "virtual store": every package version
├── react@19.3.0/node_modules/react/                  this repo uses, in its own folder
├── vite@8.3.4_esbuild@0.28.2/node_modules/vite/
├── style-dictionary@5.6.1/node_modules/style-dictionary/
└── … about 260 more
        ▲
        │  symlinks (shortcuts) point here
        │
kit/packages/ui/node_modules/
├── react             → ../../../../node_modules/.pnpm/react@19.3.0/node_modules/react
├── vite              → ../../../../node_modules/.pnpm/vite@8.3.4…/node_modules/vite
├── @detriz-sh-kit/
│   └── tokens        → ../../../tokens            ← a link to the folder next door, not a download!
└── .bin/             ← small launchers for command-line tools: vite, tsc, storybook
```

That's real output from this repo. Things to notice:

- **`.pnpm/`** is where the real files are, one folder per package version.
- **The arrows (`→`) are symlinks**: shortcuts that point somewhere else. `ui/node_modules/react` isn't a copy of React, it points into `.pnpm/`.
- **`@detriz-sh-kit/tokens → ../../../tokens`**: this is what `"workspace:*"` does. Instead of downloading the tokens package from the internet, pnpm links straight to `kit/packages/tokens`. When the tokens change, `ui` sees the change immediately.
- **`.bin/`** contains launchers for tools. When a script in `package.json` says `vite build`, pnpm looks for `vite` in `node_modules/.bin/`. That's why you don't need to install Vite globally on your computer.
- Other files you might see: **`.modules.yaml`** and **`.pnpm-workspace-state-v1.json`** (pnpm's notes about the last install) and **`.vite-temp/`** (a temporary file Vite makes while reading `vite.config.ts`). All generated, all safe to ignore.

**Rules for `node_modules`:**

1. **Never edit anything inside it.** Your change would be lost on the next install, and nobody else would have it.
2. **Never commit it.** `.gitignore` already prevents this.
3. **Never run `pnpm install` inside a package folder.** Always from the repo root: pnpm installs everything for all packages at once.
4. **When in doubt, delete and reinstall.** Weird errors after switching branches or upgrading? From the repo root:

   ```bash
   rm -rf node_modules kit/*/*/node_modules
   pnpm install
   ```

#### `.turbo`: the build cache and logs

**What it is.** Turborepo's memory. It exists in two places, with two different jobs:

```
smart-home-kit/.turbo/cache/                  ← the CACHE: saved results of past builds
├── e6bba65f8d7729f2.tar.zst                     a zipped copy of tokens' dist/ from one build
├── e6bba65f8d7729f2-meta.json                   when it was made and how long it took
├── f796ad45e6a05488.tar.zst                     a zipped copy of ui's dist/
└── 0aecf4ff56fb3239.tar.zst                     a zipped copy of storybook-static/

kit/packages/ui/.turbo/turbo-build.log        ← the LOG: what the last build printed
kit/packages/tokens/.turbo/turbo-build.log
kit/apps/storybook/.turbo/turbo-build.log
```

**How the cache works.** Before Turborepo runs a task, it calculates a **hash**: a short code, like `f796ad45e6a05488`, that works like a fingerprint of everything that affects the result: the package's files, its `package.json`, the dependencies' results, the settings in `turbo.json`. Change one character anywhere in `ui/src`, and the fingerprint changes completely.

Then:

- **Cache miss**: there's no saved result with this fingerprint. Turborepo runs the build for real, then zips the `outputs` folders (`dist/`) into `.turbo/cache/<hash>.tar.zst`.
- **Cache hit**: a result with this fingerprint already exists. Nothing changed since then, so the result would be identical. Turborepo skips the build, unzips the saved `dist/`, and replays the saved log so you still see the output.

Real output from running `pnpm build` twice without changing anything:

```
@detriz-sh-kit/tokens:build: cache hit, replaying logs e6bba65f8d7729f2
@detriz-sh-kit/ui:build: cache hit, replaying logs f796ad45e6a05488
storybook:build: cache hit, replaying logs 0aecf4ff56fb3239
 Tasks:    3 successful, 3 total
Cached:    3 cached, 3 total
  Time:    144ms >>> FULL TURBO
```

The first build took about 6 seconds; the second took 0.14 seconds. **`FULL TURBO`** means every task came from the cache. In a bigger design system with 50 components, this saves minutes on every build.

**What the log files are for.** `turbo-build.log` contains exactly what the last build printed. If a build fails in a long run and the message scrolled away, open the package's `.turbo/turbo-build.log` to read it.

**Rules for `.turbo`:**

- Never edit it, never commit it (it's in `.gitignore`).
- **If a build gives a strange result you can't explain**, delete the cache and build from scratch:

  ```bash
  rm -rf .turbo kit/*/*/.turbo
  pnpm build
  ```

  Or skip the cache once: `pnpm build --force`.

#### `dist`: the built package

**What it is.** "dist" is short for **distribution**: the version of a package that's ready to be given to others. Each package's build script creates it from `src/`.

After `pnpm build`, they contain:

```
kit/packages/tokens/dist/
└── tokens.css                 the CSS variables, made by Style Dictionary from src/*.json

kit/packages/ui/dist/
├── index.js                   all components, as plain JavaScript (made by Vite)
├── styles.css                 all component CSS in one file (made by Vite)
├── index.d.ts                 type information: what each component accepts (made by tsc)
└── sensor/Gauge/Gauge.d.ts    type information for Gauge
```

**Why not just use `src/` directly?** The code in `src/` uses TypeScript, JSX and CSS modules. Browsers can't run those directly, and someone else's project might use different tools. `dist/` is plain JavaScript and plain CSS that **any** project can use. The `.d.ts` files ("declaration files") carry the type information separately, so editors can still show autocomplete and catch mistakes like a missing `label` prop.

Here's what Vite made from `Gauge.module.css` (real output, shortened):

```css
@layer detriz{._gauge_1bxtm_3{padding:var(--dtz-space-md);border:2px solid var(--dtz-color-accent);…}._value_1bxtm_11{…}}
```

It's squeezed onto one line ("minified") to be smaller, and `.gauge` became `._gauge_1bxtm_3`. That's the CSS module renaming explained [below](#gaugemodulecss-its-styles).

**Rules for `dist`:** never edit, never commit, delete any time (`pnpm build` recreates it). After the [split into two repos](../architecture/architecture-overview.md#preparing-for-the-split), `dist/` is exactly what gets published to npm (`"files": ["dist"]` in `package.json`).

#### `storybook-static`: the built website

Created by `pnpm build` inside `kit/apps/storybook`. It's the whole Storybook as a finished, static website: HTML, JavaScript, fonts and a list of stories (`index.json`). You can put this folder on any web host (for example GitHub Pages) to share the design system with others, without them running anything. You don't need it while working: `pnpm storybook` runs a live version instead.

### `kit/packages/tokens`: the design decisions

Every design decision lives here, as data. The folder has three parts, which follow a pattern you'll see in many tools: **input → recipe → output**.

```
tokens/
├── src/          INPUT:  the token values you write, in JSON
├── build/        RECIPE: instructions for turning the input into output
└── dist/         OUTPUT: tokens.css, generated from src/ by following build/
```

#### `src/`: the token values

One JSON file per kind of token: `color.json`, `typography.json`, `space.json`. Splitting by kind keeps files short and easy to find.

```json
{
  "color": {
    "accent": {
      "$type": "color",
      "$value": "#1f6feb",
      "$description": "The one brand colour: borders, highlights and the reading value"
    }
  }
}
```

- **The nesting becomes the name.** `color` → `accent` becomes `color.accent`, which becomes the CSS variable `--dtz-color-accent`. Deeper nesting works the same way: `color` → `status` → `stale` becomes `--dtz-color-status-stale`.
- **`$value`**: the actual value.
- **`$type`**: what kind of value it is (`color`, `dimension`, `fontFamily`…). Tools use it to convert values correctly, for example colour formats.
- **`$description`**: a note for humans. It ends up as a comment in `tokens.css`.

The `$` names come from the **DTCG format** (Design Tokens Community Group), a shared standard. Figma variables can be exported in this format, so later you can export from Figma straight into this folder.

#### `build/`: the recipe for Style Dictionary

[Style Dictionary](https://styledictionary.com/) is the tool that reads the tokens and writes them out in formats code can use. `build/config.json` is its recipe. It doesn't contain any tokens, only instructions:

```json
{
  "source": ["src/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "prefix": "dtz",
      "buildPath": "dist/",
      "files": [
        {
          "destination": "tokens.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
```

| Line | What it means |
| --- | --- |
| `"source": ["src/**/*.json"]` | Where to find the tokens: every `.json` file in `src/` and its subfolders (`**` means "any folders in between"). That's why a new file like `src/radius.json` is picked up automatically. |
| `"platforms"` | A list of outputs to make. Each platform is one target. Right now there's one, called `css`. |
| `"transformGroup": "css"` | A ready-made set of conversions for CSS: for example, turn the name `color.accent` into `color-accent`, and make sure colours are written the way CSS expects. |
| `"prefix": "dtz"` | Put `dtz-` in front of every name, so ours (`--dtz-color-accent`) can't clash with another library's `--color-accent`. |
| `"buildPath": "dist/"` | The folder to write into. |
| `"files"` | Which files to write. `"destination": "tokens.css"` is the file name; `"format": "css/variables"` means "write them as CSS variables inside `:root { … }`". |

Why keep this in its own `build/` folder instead of next to the tokens? Because **values and instructions change for different reasons**. A designer changes values in `src/` often; the recipe changes rarely, for example when you want a second output. Adding one is a small change here and no change at all to the tokens:

```json
"platforms": {
  "css": { … },
  "ts": {
    "transformGroup": "js",
    "buildPath": "dist/",
    "files": [{ "destination": "tokens.ts", "format": "javascript/es6" }]
  }
}
```

That would also produce `dist/tokens.ts`, with `export const ColorAccent = "#1f6feb";`, for code that needs token values in JavaScript (for example, to colour a chart).

#### `dist/`: the result

`dist/tokens.css` is what the build makes (real output):

```css
/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --dtz-color-accent: #1f6feb; /** The one brand colour: borders, highlights and the reading value */
  --dtz-space-md: 16px; /** The one spacing step, used for padding */
  --dtz-font-family-base: system-ui, sans-serif; /** The one typeface, used for all text */
}
```

- **`:root`** means "the whole page". Variables defined here can be used by any element on the page.
- **`--dtz-color-accent: #1f6feb;`** defines a **CSS variable** (also called a custom property). Its name always starts with `--`.
- Elsewhere, `var(--dtz-color-accent)` reads it. If the value here changes, every place that reads it changes too.

It's plain CSS, so any website can use it, React or not.

#### `package.json` (tokens)

```json
{
  "name": "@detriz-sh-kit/tokens",
  "version": "0.0.0",
  "description": "Design tokens for DeTriz Smart Home Kit: colour, typography and spacing as CSS variables",
  "type": "module",
  "files": ["dist"],
  "exports": {
    "./tokens.css": "./dist/tokens.css"
  },
  "sideEffects": ["*.css"],
  "scripts": {
    "build": "style-dictionary build --config build/config.json"
  },
  "devDependencies": {
    "style-dictionary": "^5.6.1"
  }
}
```

| Field | What it means |
| --- | --- |
| `"name"` | How others refer to this package. `@detriz-sh-kit/` is the **scope**: a family name that groups all kit packages. |
| `"version": "0.0.0"` | Not released yet. It goes up with each release (see [semver](#11-glossary)). |
| `"description"` | One line about the package, shown on npm. |
| `"files": ["dist"]` | When published to npm, include only `dist/`. Source and config stay out. |
| `"exports"` | The **front door**: the only files others may import. Here, just one: `import "@detriz-sh-kit/tokens/tokens.css"`. The left side is the name others use; the right side is the real file. |
| `"sideEffects": ["*.css"]` | Tells build tools "importing a CSS file does something, even though nothing is used from it". Without this, a tool might think `import "…/tokens.css"` is unused and remove it. |
| `"scripts"` → `"build"` | What runs when you build this package: Style Dictionary, with the recipe from `build/config.json`. |
| `"devDependencies"` | Style Dictionary is only needed to build, never by people who use the tokens. So it's a **dev** dependency. |

### `kit/packages/ui`: the components

#### One folder per component

Components are grouped by kind (`sensor/` now; later `device/` and `primitives/`), and each component has its own folder with everything about it inside:

```
src/sensor/Gauge/
├── Gauge.tsx            what it is (structure and props)
├── Gauge.module.css     what it looks like
└── Gauge.stories.tsx    examples of it
```

Why together? When you work on Gauge, everything is in one place. When you delete Gauge, you delete one folder and nothing is left behind.

#### `Gauge.tsx`: the component

A component is a **function** that takes **props** (inputs) and returns **JSX** (a description of what to show). Line by line:

```tsx
import styles from "./Gauge.module.css";
```

Load the CSS module. `styles` becomes an object like `{ gauge: "_gauge_1bxtm_3", value: "_value_1bxtm_11" }`: each class name from the CSS file, mapped to its unique renamed version.

```tsx
export interface GaugeProps {
  /** What is being measured, e.g. "Kitchen". */
  label: string;
  /** The Reading's value, e.g. 22.4. */
  value: number;
  /** The unit shown after the value, e.g. "°C". */
  unit: string;
}
```

The component's **API**: a TypeScript `interface` listing every prop, its type, and a description.

- `label: string` means the prop is called `label` and must be text. If someone writes `<Gauge label={42} />`, the editor underlines it in red before the code even runs.
- `/** … */` comments are special (**JSDoc**): your editor shows them when you hover over a prop, and Storybook shows them in its Controls table.
- `export` lets other files use this type. Apps that wrap Gauge can say "my props include `GaugeProps`".

```tsx
/** Shows one Reading: a label, a value and its unit. Takes props only, never fetches data. */
export function Gauge({ label, value, unit }: GaugeProps) {
```

- `export function Gauge` defines the component and makes it available to other files. Component names always start with a **capital letter**: that's how React tells `<Gauge>` (yours) apart from `<figure>` (a built-in HTML element).
- `{ label, value, unit }` takes the three props out of the props object (**destructuring**), so you can write `label` instead of `props.label`.
- `: GaugeProps` says the props must match the interface above.

```tsx
  return (
    <figure className={styles.gauge}>
      <figcaption>{label}</figcaption>
      <p className={styles.value}>
        {value.toFixed(1)} {unit}
      </p>
    </figure>
  );
}
```

- This is **JSX**: it looks like HTML, but it's turned into JavaScript when built.
- `className` instead of `class`, because `class` is a reserved word in JavaScript.
- `{ … }` inside JSX means "put the result of this JavaScript here". `{label}` shows the label text.
- `value.toFixed(1)` shows the number with exactly one decimal: `22.4`, `64.0`.
- **`<figure>` and `<figcaption>`** are the right HTML elements for "a piece of content with a caption". Using the right elements (**semantic HTML**) helps screen readers describe the component to blind users.

And notice what's **not** there: no `fetch`, no API address, no loading data. The component only shows what it's given. That's the most important rule of the design system: it makes the component reusable with any data (the live API, a mock, a test, a Storybook story).

#### `Gauge.module.css`: its styles

```css
/* Only tokens (var(--dtz-…)), never raw values like #1f6feb or 16px. */
@layer detriz {
  .gauge {
    display: inline-block;
    margin: 0;
    padding: var(--dtz-space-md);
    border: 2px solid var(--dtz-color-accent);
    font-family: var(--dtz-font-family-base);
  }

  .value {
    margin: 0;
    color: var(--dtz-color-accent);
    font-size: 2em;
  }
}
```

Three ideas are packed into this small file.

**1. Tokens, not raw values.** `var(--dtz-color-accent)`, never `#1f6feb`. The component doesn't know the colour is blue, only that it's "the accent". Change the token once, and every component that uses it follows. (`margin: 0`, `display: inline-block` and `2px` are layout details, not design decisions, so they don't need tokens. Colours, fonts and spacing always do.)

**2. CSS modules (the `.module.css` ending).** In normal CSS, class names are global: if your component has `.value` and the app using it also has a `.value` somewhere, they clash and one breaks the other. A CSS module fixes this. When built, every class name gets a unique ending:

```
.gauge   →  ._gauge_1bxtm_3
.value   →  ._value_1bxtm_11
```

In `Gauge.tsx`, `styles.gauge` holds the new name, so the right class is always used, and nobody else's `.gauge` can interfere. You write simple names; the tool makes them unique.

**3. `@layer detriz`.** CSS has a priority system: when two rules style the same thing, one wins. **Layers** add a level to that system: styles inside a layer always lose to styles outside any layer. Putting all our component CSS in `@layer detriz` means an app using the kit can override anything with a plain rule:

```css
/* in Live Studio's own CSS, outside any layer: this wins, no tricks needed */
figure {
  border-width: 4px;
}
```

Without the layer, the app would have to fight our rules with more specific selectors or `!important`. A design system should be easy to adjust, not a fight.

#### `Gauge.stories.tsx`: its examples

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gauge } from "./Gauge";

const meta = {
  title: "Sensor/Gauge",
  component: Gauge,
  args: { label: "Kitchen", value: 22.4, unit: "°C" },
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Temperature: Story = {};

export const Humidity: Story = {
  args: { label: "Bathroom", value: 64, unit: "%" },
};
```

| Part | What it means |
| --- | --- |
| `import type { Meta, StoryObj }` | Storybook's types, so the editor checks the stories. `import type` means "only for type checking", nothing ends up in the built code. |
| `const meta = { … }` | Settings shared by all stories in this file. |
| `title: "Sensor/Gauge"` | Where it appears in Storybook's sidebar: **Sensor → Gauge**. The `/` makes a folder. |
| `component: Gauge` | Which component these stories are about. Storybook reads its props and builds the Controls panel from them. |
| `args: { … }` | **Args** are the props passed to the component. These are the defaults for every story. |
| `satisfies Meta<typeof Gauge>` | Checks that the settings are valid for Gauge, for example that `args` contains only real Gauge props. |
| `export default meta` | Storybook looks for the default export to read the settings. |
| `export const Temperature: Story = {}` | One **story**: the default args, nothing changed. The name of the export becomes the name in the sidebar. |
| `export const Humidity` | Another story, which overrides some args. |

**Why stories live in `ui`, not in the Storybook app.** When you change a component, its examples are right next to it, and you're reminded to update them. The Storybook app only *collects* stories from `ui`.

`*.stories.tsx` files are only for Storybook. They're left out of the built package (see `tsconfig.build.json` below), so they never reach the people who install `@detriz-sh-kit/ui`.

#### `src/index.ts`: the front door

```ts
// The front door of @detriz-sh-kit/ui. Only what is exported here can be imported by apps.
export { Gauge } from "./sensor/Gauge/Gauge";
export type { GaugeProps } from "./sensor/Gauge/Gauge";
```

This file decides what the outside world can use. An app writes `import { Gauge } from "@detriz-sh-kit/ui"` and gets what's listed here, nothing else. It also means you can move `Gauge.tsx` to another folder later, change one line here, and no app notices.

**Forget to add a component here, and nobody outside the package can use it**, even though Storybook (which reads the stories directly) still shows it.

#### `package.json` (ui)

```json
{
  "name": "@detriz-sh-kit/ui",
  "version": "0.0.0",
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": ["*.css"],
  "scripts": {
    "build": "vite build && tsc -p tsconfig.build.json",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@detriz-sh-kit/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "vite": "^8.3.4",
    "@vitejs/plugin-react": "^6.1.2",
    "typescript": "~6.0.3",
    "storybook": "^10.6.2",
    "@storybook/react-vite": "^10.6.2"
  }
}
```

| Field | What it means |
| --- | --- |
| `"exports"` → `"."` | What you get from `import { Gauge } from "@detriz-sh-kit/ui"` (the `.` means "the package itself"): JavaScript from `dist/index.js`, types from `dist/index.d.ts`. |
| `"exports"` → `"./styles.css"` | `import "@detriz-sh-kit/ui/styles.css"` loads all component CSS. |
| `"scripts"` → `"build"` | Two steps joined by `&&` ("do the second only if the first worked"): **Vite** builds the JavaScript and CSS, then **tsc** (the TypeScript compiler) writes the `.d.ts` type files. |
| `"scripts"` → `"typecheck"` | Check all TypeScript for mistakes without writing any files (`--noEmit`). Fast way to find errors. |
| `"dependencies"` | What this package needs **at runtime**, installed together with it. The components use token variables, so they need `tokens`. `workspace:*` means "the copy in this repo" (a link, see [`node_modules`](#node_modules-the-installed-packages)). |
| `"peerDependencies"` | "I need React, but **the app that uses me** must provide it." React must exist only **once** on a page: two copies cause the error *Invalid hook call*. `^19.0.0` means "any React 19 works". |
| `"devDependencies"` | Only needed while you work on the package: React (so Storybook can render it here), type definitions (`@types/…`), Vite, TypeScript and Storybook's types for the stories. People who install the package never get these. |

React appears **twice**, in `peerDependencies` and in `devDependencies`. That's on purpose. The peer entry is a rule for apps ("bring your own React"); the dev entry gives this package a React to work with during development.

#### `vite.config.ts`

[Vite](https://vite.dev/) is a build tool. Normally it builds websites. Here it's set to **library mode**: build a package for others to import.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
```

| Line | What it means |
| --- | --- |
| `plugins: [react()]` | Teach Vite to understand JSX and React. |
| `lib.entry: "src/index.ts"` | Start from the front door and follow every `import` from there. Anything not reachable from `index.ts` isn't included. |
| `formats: ["es"]` | Output modern JavaScript modules (`import`/`export`). |
| `fileName: "index"` | Call the JavaScript output `dist/index.js`. |
| `cssFileName: "styles"` | Collect all CSS from all components into one `dist/styles.css`. |
| `external: [...]` | **Don't copy React into our package.** The app provides React (it's a peer dependency), so our code just says `import … from "react"` and uses the app's copy. |

#### `tsconfig.json` and `tsconfig.build.json`

Two TypeScript settings files, for two different jobs:

- **`tsconfig.json`**: used by your editor (red underlines, autocomplete) and by `pnpm typecheck`. It starts from the shared `tsconfig.base.json` and adds `"types": ["vite/client"]`, which teaches TypeScript that importing a `.module.css` file gives back an object of class names.
- **`tsconfig.build.json`**: used only by the build, to write `.d.ts` files into `dist/`. It turns on `declaration` + `emitDeclarationOnly` ("write only the type files; Vite already made the JavaScript"), sets `outDir: "dist"`, and **excludes `*.stories.tsx`** so stories don't end up in the package.

### `kit/apps/storybook`: the documentation website

[Storybook](https://storybook.js.org/) is a website for looking at components one by one, in every state, without building a whole app around them. It's the design system's living documentation.

#### `.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
};

export default config;
```

- **`stories`**: where to look for stories. The path starts from the `.storybook/` folder: each `../` goes up one level (`.storybook` → `storybook` → `apps` → `kit`), then down into `packages/ui/src`. `**` means "any folders", and `*.stories.@(ts|tsx)` means "any file ending in `.stories.ts` or `.stories.tsx`". So every new stories file in `ui` is found automatically.
- **`framework`**: we use React, built with Vite.

The `.storybook` folder starts with a dot because it's a configuration folder; by convention, tools hide their settings in dot-folders.

#### `.storybook/preview.ts`

```ts
import type { Preview } from "@storybook/react-vite";

// Load the design tokens (CSS variables) once, for every story, the same way an app would.
import "@detriz-sh-kit/tokens/tokens.css";

const preview: Preview = {};

export default preview;
```

`preview.ts` runs before every story. Its one job right now is to load `tokens.css`, so the `--dtz-…` variables exist on the page. **Without this line, every component would show with no colour, no font and no spacing**, because `var(--dtz-color-accent)` would point to nothing. Every app that uses the kit has to load `tokens.css` the same way.

Later, `preview.ts` is also where you'd add global settings, like a switch between light and dark themes.

#### `package.json` (storybook)

- `"private": true`: an app, never published.
- `"dev": "storybook dev --port 6006"`: start Storybook on <http://localhost:6006>. (6006 is Storybook's usual port. A **port** is like an apartment number on your computer: several programs can run at once, each on its own number.)
- `"build": "storybook build --output-dir storybook-static"`: make the static website.
- `devDependencies` include `@detriz-sh-kit/ui` and `@detriz-sh-kit/tokens` (`workspace:*`). That tells Turborepo "build these before starting Storybook", and lets `preview.ts` import `tokens.css`.

---

## 4. How it all works together

### How a token reaches the screen

```
 tokens/src/color.json                      ui/src/sensor/Gauge/Gauge.module.css
 "accent": "#1f6feb"                        border: 2px solid var(--dtz-color-accent)
        │                                                 │
        │ pnpm build (Style Dictionary,                   │ uses the variable by name
        │ following tokens/build/config.json)             │
        ▼                                                 │
 tokens/dist/tokens.css                                   │
 --dtz-color-accent: #1f6feb  ◄───────────────────────────┘
        │                                    the browser looks the value up at runtime
        │ imported by
        ▼
 storybook/.storybook/preview.ts  ──── shows ────►  Gauge.stories.tsx  ──── renders ────►  Gauge.tsx
```

1. You write a token in `tokens/src/*.json`.
2. Style Dictionary follows the recipe in `tokens/build/config.json` and writes a CSS variable into `tokens/dist/tokens.css`.
3. The component's CSS uses the variable **by name**, without knowing its value.
4. Storybook (or any app) loads `tokens.css` once. The browser fills in the values.

Because components only know token **names**, you can change a value, or swap a whole theme, without touching a single component.

### What happens when you run `pnpm storybook`

A lot happens behind one short command. Step by step:

1. **pnpm reads the root `package.json`** and finds the script `"storybook": "turbo run dev --filter=storybook"`. It runs that.
2. **Turborepo reads `turbo.json`.** The `dev` task has `"dependsOn": ["^build"]`: before starting Storybook, build everything Storybook depends on.
3. **Turborepo works out the order** from the `package.json` files. Storybook depends on `ui` and `tokens`; `ui` depends on `tokens`. So the order is: **`tokens` → `ui` → Storybook**.
4. **Build `tokens`**: calculate its fingerprint. Cache hit? Restore `dist/` from `.turbo/cache`. Cache miss? Run Style Dictionary, then save the result.
5. **Build `ui`**: the same, with Vite and tsc.
6. **Start Storybook**: run `storybook dev --port 6006` in `kit/apps/storybook`.
7. **Storybook reads `.storybook/main.ts`**, finds every `*.stories.tsx` in `ui/src`, and starts a Vite **dev server**: a small web server on your computer that sends the page to your browser and watches your files for changes.
8. **You open <http://localhost:6006>.** `preview.ts` loads `tokens.css`; Storybook renders the story you clicked.

One detail explains a lot of "why didn't it update?" moments: **Storybook reads components from `ui/src` directly** (the stories import `./Gauge`), but it reads **tokens from `tokens/dist`**. So:

- Change a component or its CSS → save → the browser updates instantly (**hot reload**).
- Change a token → you must **rebuild the tokens** (`pnpm --filter @detriz-sh-kit/tokens build`), then Storybook picks up the new `tokens.css`.

### What happens when you run `pnpm build`

1. pnpm runs `turbo run build`.
2. Turborepo finds every package that has a `build` script (`tokens`, `ui`, `storybook`) and orders them by their dependencies.
3. For each one, it calculates the fingerprint and either restores from cache or runs the build:
   - `tokens`: `style-dictionary build …` → `dist/tokens.css`
   - `ui`: `vite build` → `dist/index.js`, `dist/styles.css`; then `tsc …` → `dist/*.d.ts`
   - `storybook`: `storybook build` → `storybook-static/`
4. It prints a summary: how many tasks ran, how many came from the cache.

Use `pnpm build` to check that everything still works before committing; use `pnpm storybook` while you work.

### How an app uses the kit

Live Studio, and later other people's apps, use the kit like this:

```tsx
import "@detriz-sh-kit/tokens/tokens.css";  // 1. the variables
import "@detriz-sh-kit/ui/styles.css";      // 2. the component styles
import { Gauge } from "@detriz-sh-kit/ui";  // 3. the components

<Gauge label="Kitchen" value={22.4} unit="°C" />
```

Unlike Storybook, an app uses the **built** `dist/` of both packages, exactly what a customer would get. That's why `index.ts` and the `exports` field matter: they're what apps see.

---

## 5. See it in your browser

From the repo root:

```bash
pnpm install       # only the first time, or after dependencies changed
pnpm storybook
```

Wait until the terminal shows a box saying **Storybook … started**, with the address. Then open **<http://localhost:6006>**.

The Storybook screen has four areas:

| Area | Where | What it's for |
| --- | --- | --- |
| **Sidebar** | Left | All components, grouped by `title`. Open **Sensor → Gauge** and click **Temperature** or **Humidity**. Use the search box to find components quickly. |
| **Canvas** | Middle | The component itself, rendered alone. |
| **Toolbar** | Above the canvas | Zoom, background, viewport size (to see how a component looks on a phone), and more. |
| **Controls** | Bottom panel | Every prop, with an input to change it. Type another label, change the value to `-5` or `1000`, use a very long unit. The component updates as you type. **This is the quickest way to find cases that look wrong.** |

**Changing things while Storybook runs** (no restart needed):

| You change… | What to do | Why |
| --- | --- | --- |
| `Gauge.tsx`, `Gauge.module.css`, `Gauge.stories.tsx` | Just save | Storybook reads `ui/src` directly and reloads instantly |
| A new `*.stories.tsx` file | Just save | Storybook watches for new stories files |
| A token in `tokens/src/*.json` | In a **second terminal**: `pnpm --filter @detriz-sh-kit/tokens build` | Storybook reads the built `tokens.css`, which must be rebuilt |
| `.storybook/main.ts` or `preview.ts`, or a `package.json` | Stop (`Ctrl + C`) and run `pnpm storybook` again | Settings are read only at start |

**Stopping Storybook:** click into the terminal where it runs and press `Ctrl + C`.

---

## 6. Add a design token

Example: add a second colour for text.

**Step 1. Add the value** to `kit/packages/tokens/src/color.json`, next to `accent`:

```json
{
  "color": {
    "accent": {
      "$type": "color",
      "$value": "#1f6feb",
      "$description": "The one brand colour: borders, highlights and the reading value"
    },
    "text": {
      "$type": "color",
      "$value": "#1f2328",
      "$description": "Default text colour"
    }
  }
}
```

Watch the commas: in JSON, items in a list are separated by commas, and the **last** item has **no** comma after it. A missing or extra comma is the most common JSON mistake, and the build will fail with an error pointing at the line.

**Step 2. Build the tokens:**

```bash
pnpm --filter @detriz-sh-kit/tokens build
```

You should see `✔︎ dist/tokens.css`.

**Step 3. Check the result.** Open `kit/packages/tokens/dist/tokens.css`. It now contains:

```css
--dtz-color-text: #1f2328; /** Default text colour */
```

**Step 4. Use it** in a component's CSS:

```css
.gauge {
  color: var(--dtz-color-text);
}
```

**Step 5. Look at it** in Storybook. If it's already running, the change appears after step 2.

**Naming tips:**

- **Name by purpose, not by look**: `color.text`, `color.accent`, `color.status.stale`. Never `color.blue`. If the brand blue becomes green one day, `color.accent` still makes sense; `color.blue` becomes a lie.
- **Keep the same names and groups as in Figma**, so designers and developers talk about the same thing.
- **A new kind of token** (radius, shadow, motion) gets a new file in `src/`, for example `radius.json`. The recipe's `"source": ["src/**/*.json"]` picks it up automatically.

---

## 7. Create a new component, step by step

Example: a `Badge` that shows a short label, like **Live**, in a small coloured pill. Replace `Badge` with your component's name everywhere.

This walkthrough was tested in this repo: following it exactly produces a working Badge in Storybook.

### Step 1. Decide what it is

Before writing code, answer four questions, on paper or in Figma:

| Question | For Badge |
| --- | --- |
| **What does it show?** | A short text. |
| **What are its props?** | `children`: the text inside. Later maybe `tone` ("live" / "stale"). |
| **Which tokens does it need?** | Accent colour for the background, font, spacing. |
| **Which group does it belong to?** | It's a general building block, not specific to sensors, so `primitives/`. (Sensor-specific components go in `sensor/`; Hub and Module ones in `device/`.) |

Keep the first version as small as possible. Adding a prop later is easy; removing one breaks every app that already uses it.

### Step 2. Create the folder and three empty files

In your editor, or in the terminal from the repo root:

```bash
mkdir -p kit/packages/ui/src/primitives/Badge
touch kit/packages/ui/src/primitives/Badge/Badge.tsx \
      kit/packages/ui/src/primitives/Badge/Badge.module.css \
      kit/packages/ui/src/primitives/Badge/Badge.stories.tsx
```

(`mkdir -p` makes a folder, including any missing parent folders. `touch` creates an empty file. The `\` at the end of a line continues the command on the next line.)

Result:

```
kit/packages/ui/src/primitives/Badge/
├── Badge.tsx
├── Badge.module.css
└── Badge.stories.tsx
```

Naming rules:

- Component, folder and file names use **PascalCase**: every word starts with a capital, no spaces (`Badge`, `StatusTile`, `HistoryChart`).
- Group folders use **lowercase** (`primitives`, `sensor`, `device`).
- The three file endings are always the same: `.tsx`, `.module.css`, `.stories.tsx`.

### Step 3. Write the component: `Badge.tsx`

```tsx
import type { ReactNode } from "react";
import styles from "./Badge.module.css";

export interface BadgeProps {
  /** The short text inside the badge, e.g. "Live". */
  children: ReactNode;
}

/** A short label in a coloured pill. */
export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>;
}
```

What's new compared to Gauge:

- **`children`** is a special prop in React: whatever you put **between** the opening and closing tag. `<Badge>Live</Badge>` makes `children` equal to `"Live"`.
- **`ReactNode`** is the type for "anything React can show": text, numbers, other components. It's imported with `import type` because it's only used for type checking.
- **`<span>`** is used because a badge sits inside a line of text (an **inline** element), unlike Gauge's `<figure>`, which is a block on its own.

The pattern to copy for every component:

1. `import styles from "./<Name>.module.css";`
2. `export interface <Name>Props { … }` with a `/** comment */` on every prop.
3. `export function <Name>({ …props }: <Name>Props) { return …; }` with **no data fetching**.

### Step 4. Style it: `Badge.module.css`

```css
@layer detriz {
  .badge {
    display: inline-block;
    padding: 0 var(--dtz-space-md);
    border-radius: 999px;
    background: var(--dtz-color-accent);
    color: white;
    font-family: var(--dtz-font-family-base);
  }
}
```

- Everything goes inside **`@layer detriz { … }`**.
- The class name (`.badge`) matches what `Badge.tsx` uses (`styles.badge`). If they don't match, `styles.badge` is empty and the badge has no style.
- `padding: 0 var(--dtz-space-md)` means "no space above and below, one spacing step left and right".

Notice `border-radius: 999px` (a trick for "fully rounded ends") and `color: white` are **raw values**. That's fine for a first try, but each raw value is a sign that a token is missing. The proper next step: add `radius.full` and `color.on-accent` tokens ([section 6](#6-add-a-design-token)) and use those instead.

### Step 5. Write the stories: `Badge.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Live" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: { children: "Disconnected for 5 minutes" },
};
```

Copy the structure from Gauge's stories and change three things: the `import`, the `title`, and the `args`.

Which stories should you write? **One per state or interesting case**:

- the normal case (`Default`),
- edge cases: very long text, very short text, empty, unusual numbers (negative, huge, many decimals),
- later, every Connection Status from the [Ubiquitous Language](../architecture/domain-model/ubiquitous-language.md): Connected, Stale, Disconnected, Fault.

If a case isn't in Storybook, nobody checks that it looks right, and it'll break in Live Studio first.

### Step 6. Add it to the front door: `src/index.ts`

```ts
// The front door of @detriz-sh-kit/ui. Only what is exported here can be imported by apps.
export { Gauge } from "./sensor/Gauge/Gauge";
export type { GaugeProps } from "./sensor/Gauge/Gauge";
export { Badge } from "./primitives/Badge/Badge";
export type { BadgeProps } from "./primitives/Badge/Badge";
```

Two lines per component: one for the component, one for its props type. The path has no `.tsx` ending; TypeScript finds the file.

### Step 7. Look at it

```bash
pnpm storybook
```

Open <http://localhost:6006> → **Primitives → Badge**. Click **Default** and **LongText**, and try your own text in **Controls**. If Storybook was already running, the new component appears without a restart. If it doesn't, stop Storybook (`Ctrl + C`) and start it again.

### Step 8. Check it

```bash
pnpm --filter @detriz-sh-kit/ui typecheck
pnpm build
```

- **`typecheck`** finds TypeScript mistakes: a typo in a prop name, a wrong type, a missing import. It prints nothing but the command when everything is fine. If there's a mistake, it shows the file, line and a message, for example `Badge.tsx(9,40): error TS2339: Property 'badgee' does not exist`.
- **`build`** checks that everything still builds, including Storybook.

Both should end without errors. Then open `kit/packages/ui/dist/index.d.ts`: it should now list `Badge`. That means apps can import it.

### Step 9. Save your work in git

```bash
git status                          # see what changed
git add kit/packages/ui/src         # stage the new and changed files
git commit -m "feat(ui): add Badge component"
```

`git status` should show only files you wrote: the three Badge files and `index.ts`. If it shows `dist/`, `node_modules/` or `.turbo/`, something is wrong with `.gitignore`. Don't commit them.

The commit message follows **conventional commits**: `feat` (a new feature), then the area in brackets (`ui`), then a short description. See [Way of working](../architecture/architecture-overview.md#way-of-working).

---

## 8. Checklist for every component

- [ ] Lives in `kit/packages/ui/src/<group>/<Name>/` with `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`.
- [ ] Props are described in an exported `<Name>Props` interface, with a `/** comment */` on each prop.
- [ ] Takes props only. No `fetch`, no API addresses, no hooks that load data.
- [ ] Uses semantic HTML elements (`<figure>`, `<button>`, `<span>`…), not just `<div>`.
- [ ] CSS uses only `var(--dtz-…)` tokens for colour, font and spacing, all inside `@layer detriz`.
- [ ] Class names in the CSS match `styles.…` in the component.
- [ ] Has a story for every state and edge case.
- [ ] Exported from `src/index.ts` (component and props type).
- [ ] `pnpm --filter @detriz-sh-kit/ui typecheck` and `pnpm build` pass.
- [ ] Only source files are committed (no `dist/`, `node_modules/`, `.turbo/`).

Coming later, as the system grows: a test file (`<Name>.test.tsx`), automatic accessibility checks, visual tests that catch unintended changes, and the Connection Status states.

---

## 9. Commands

Run all of them from the **repo root**.

| What | Command |
| --- | --- |
| Install everything | `pnpm install` |
| View components in the browser | `pnpm storybook` → <http://localhost:6006> |
| Stop Storybook (or any running command) | `Ctrl + C` |
| Build everything (tokens → ui → Storybook) | `pnpm build` |
| Build everything, ignoring the cache | `pnpm build --force` |
| Build only the tokens | `pnpm --filter @detriz-sh-kit/tokens build` |
| Build only the components | `pnpm --filter @detriz-sh-kit/ui build` |
| Check the components for TypeScript errors | `pnpm --filter @detriz-sh-kit/ui typecheck` |
| Format all files | `pnpm format` |
| Check formatting without changing files | `pnpm format:check` |
| Add a dev tool to the components package | `pnpm add -D <tool> --filter @detriz-sh-kit/ui` |
| Add a tool for the whole repo | `pnpm add -D -w <tool>` |
| Start fresh (delete everything generated) | `rm -rf node_modules kit/*/*/node_modules kit/*/*/dist .turbo kit/*/*/.turbo && pnpm install` |

What the flags mean:

- **`--filter <name>`**: run only in that package. Without it, the command runs in every package that has that script.
- **`-D`**: add as a **dev** dependency (only needed while developing).
- **`-w`**: add to the **workspace root** `package.json`.
- **`--force`**: ignore Turborepo's cache and really run everything.

`kit/*/*/node_modules` is a **pattern**: `*` matches any folder name, so it means "the `node_modules` inside every package and app in `kit/`".

---

## 10. When something goes wrong

Read the **first** error message in the terminal, not the last: later errors are often caused by the first one.

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `command not found: pnpm` | pnpm isn't set up on this computer | Run `corepack enable` once. Corepack comes with Node and uses the pnpm version from `package.json`. |
| Component shows with no colour, font or padding | `tokens.css` isn't loaded or wasn't built | Run `pnpm --filter @detriz-sh-kit/tokens build`; check that `.storybook/preview.ts` imports `@detriz-sh-kit/tokens/tokens.css` |
| Changed a token, nothing changed | Tokens weren't rebuilt | `pnpm --filter @detriz-sh-kit/tokens build` |
| Token build fails with `Unexpected token` or `JSON` in the message | A typo in a `.json` file: a missing or extra comma, a missing quote | Open the file and line from the message; check commas and quotes |
| Component has no styles at all, but tokens work | Class name in the CSS doesn't match `styles.…` in the component | Make them identical (`.badge` ↔ `styles.badge`) |
| New component isn't in the Storybook sidebar | File isn't named `*.stories.tsx`, there's an error in it, or Storybook needs a restart | Check the name and the terminal for errors; stop and restart `pnpm storybook` |
| `Module '"@detriz-sh-kit/ui"' has no exported member 'Badge'` | Not in `src/index.ts`, or `ui` not rebuilt | Add the export; run `pnpm --filter @detriz-sh-kit/ui build` |
| `Port 6006 is already in use` | Storybook is already running in another terminal | Use that one, or find it and stop it with `Ctrl + C` |
| `Invalid hook call` | Two copies of React | React must be a `peerDependency` (and `devDependency`) in `ui`, never a normal `dependency` |
| `ERR_PNPM_IGNORED_BUILDS` after adding a package | pnpm 11 blocks install scripts of new packages, for security | Only if you trust the package: `pnpm approve-builds <package>`. The approval is saved under `allowBuilds` in `pnpm-workspace.yaml`. |
| A just-released package version won't install (`minimumReleaseAge`) | pnpm 11 won't install versions published in the last day, to protect against malicious releases | Use the previous version, or wait a day |
| Build result looks old or wrong, and nothing else explains it | Turborepo cache | `pnpm build --force`, or delete `.turbo` folders |
| Strange errors after switching git branches or upgrading | `node_modules` out of date | `pnpm install`; if that doesn't help, use the "start fresh" command from [Commands](#9-commands) |
| `git status` shows `dist/`, `node_modules/` or `.turbo/` | `.gitignore` is missing or was changed | Check the root `.gitignore`; never commit those folders |

---

## 11. Glossary

| Term | Meaning |
| --- | --- |
| **API (of a component)** | The props it accepts and what they do. Its "contract" with whoever uses it. |
| **App** | Something you run or open (Storybook, Live Studio). Never installed by others. Marked `"private": true`. |
| **Build** | Turning source code (`src/`) into code others can use (`dist/`). |
| **Cache** | Saved results, so work isn't repeated. Turborepo's lives in `.turbo/cache`. |
| **Cache hit / miss** | The result was already saved and reused / wasn't, so the work ran for real. |
| **Catalog (`catalog:`)** | pnpm's shared list of versions in `pnpm-workspace.yaml`. |
| **Component** | A reusable piece of UI (`Gauge`), written as a React function. |
| **Corepack** | A tool that comes with Node.js and makes sure everyone uses the pnpm version set in `package.json`. |
| **CSS module** | A CSS file ending in `.module.css`, whose class names are made unique when built. |
| **CSS variable (custom property)** | A named value in CSS: defined as `--name: value`, used as `var(--name)`. |
| **`@layer`** | A CSS feature that groups styles by priority. Styles in a layer lose to styles outside layers. |
| **`.d.ts` file** | A "declaration file": type information only, no code. Gives editors autocomplete for built packages. |
| **Dependency / dev dependency / peer dependency** | Needed at runtime and installed together / needed only while developing / needed, but the app must provide it. |
| **Dev server** | A small web server on your computer that serves a page and reloads it when files change. |
| **`dist/`** | "Distribution": the built output of a package. Generated. |
| **DTCG** | Design Tokens Community Group: the standard JSON format for tokens (`$value`, `$type`). |
| **Front door** | `src/index.ts` and the `exports` field: what others can import from a package. |
| **Hash** | A short code that acts as a fingerprint of some content. Any change gives a different hash. |
| **Hot reload** | The browser updating by itself when you save a file, without a full refresh. |
| **JSX** | HTML-like syntax inside JavaScript/TypeScript (`<figure>…</figure>`), used by React. |
| **JSDoc** | `/** … */` comments that editors and Storybook read and show. |
| **Library mode** | A Vite setting for building a package instead of a website. |
| **Lockfile** | `pnpm-lock.yaml`: the exact versions of everything installed. Committed to git. |
| **Monorepo / workspace** | One repo containing several packages that are installed and built together. |
| **`node_modules`** | Where installed packages live. Generated by `pnpm install`. |
| **Package** | A folder with a `package.json`, usable by name. |
| **PascalCase** | Writing names with every word capitalised and no spaces: `StatusTile`. |
| **Port** | A number that identifies one program on your computer, like `6006` in `localhost:6006`. |
| **Props / args** | A component's inputs. In Storybook, they're called args. |
| **Scope** | The `@detriz-sh-kit/` part of a package name: a family name for related packages. |
| **Script** | A named command in `package.json`, run with `pnpm <name>`. |
| **Semantic HTML** | Using the HTML element that matches the meaning (`<button>`, `<figure>`), which helps accessibility. |
| **Semver** | Version numbers as MAJOR.MINOR.PATCH: breaking change, new feature, fix. |
| **Source** | Files you write yourself, mostly in `src/`. |
| **Story** | One example of a component with specific props, shown in Storybook. |
| **Style Dictionary** | The tool that turns token JSON into CSS variables (and other formats). |
| **Symlink** | A shortcut to a file or folder somewhere else. pnpm uses them heavily in `node_modules`. |
| **Token** | A named design decision, like `color.accent`. |
| **Turborepo (turbo)** | Runs tasks across packages in the right order and caches results. |
| **Type check** | Letting TypeScript look for mistakes in types without running the code. |
| **Version range (`^`, `~`)** | `^19.3.0`: 19.3.0 or newer 19.x. `~6.0.3`: 6.0.3 or newer 6.0.x. |
| **Vite** | A fast build tool and dev server for web code. |
| **`workspace:*`** | "Use the copy of this package from this repo" (a link, not a download). |
