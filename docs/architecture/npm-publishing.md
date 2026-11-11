# Publishing the kit to npm

How to publish `@detriz-sh-kit/tokens` and `@detriz-sh-kit/ui` on npm so other people can install them, and how to keep releasing new versions afterwards.

**Status: done.** Both packages are on npm (first `0.1.0` on 2026-11-11, then `0.1.1` through the Release workflow). Part 1 below is the record of how it was set up; Part 2 is the everyday guide.

This is a Phase 1 deliverable on the roadmap ("UI packages … published on npm"). It also answers the "Publishing" and "Licence" open questions in [project-architecture.md](project-architecture.md).

---

## Where we started (checked 2026-11-11, before publishing)

| Check                                         | Status | Notes                                                                                                                                      |
| --------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `@detriz-sh-kit` scope free on npm            | ✅     | No org or user with that name, and `@detriz-sh-kit/ui` isn't taken. Nothing stops someone else from taking it, so claim it soon (step 1).  |
| Packages build into `dist/` with `exports`    | ✅     | Already "built as if published".                                                                                                           |
| `pnpm pack` produces clean tarballs           | ✅     | `ui` is about 77 kB (163 files), `tokens` about 4 kB. Only `dist/` and `package.json` are inside, with no stories or specs.                |
| `workspace:*` is replaced with a real version | ✅     | `pnpm pack` / `pnpm publish` turn `"@detriz-sh-kit/tokens": "workspace:*"` into `"0.0.0"`. **`npm publish` does not**, so always use pnpm. |
| `ui` bundle only imports React                | ✅     | `dist/index.js` imports only `react` and `react/jsx-runtime`, which are peer dependencies. Icons are already inlined.                      |
| Apps can't be published by mistake            | ✅     | `docs-site` and `storybook` have `"private": true`.                                                                                        |
| Licence                                       | ❌     | No `LICENSE` file. Without one, nobody is legally allowed to use the code.                                                                 |
| Package metadata                              | ❌     | No `license`, `repository`, `homepage`, `bugs`, `keywords` or `author` in either `package.json`.                                           |
| Public access setting                         | ❌     | Scoped packages (`@something/…`) publish as **private** by default, which needs a paid plan. They need `publishConfig.access: "public"`.   |
| README per package                            | ❌     | npm shows the package's `README.md` on its page. Right now the page would be empty.                                                        |
| Versions                                      | ❌     | Both are `0.0.0`.                                                                                                                          |
| Release tooling and CI                        | ❌     | No changelog tooling and no `.github/workflows/`.                                                                                          |
| npm account on this machine                   | ❌     | `npm whoami` says you aren't logged in.                                                                                                    |

So the code is ready. What's missing is the **paperwork** (licence, metadata, README), an **npm account and org**, and a **release process**.

---

## Key ideas in plain words

- **npm registry**: the public library of JavaScript packages. `npm install x` downloads from it.
- **Scope and org**: `@detriz-sh-kit/` is a scope. To publish under it, you need an npm **organization** with the same name, `detriz-sh-kit`. Orgs are free when every package in them is public.
- **Version numbers (semver)**: `MAJOR.MINOR.PATCH`. While we're on `0.x`, the rule is shifted down one level: `0.2.0 → 0.3.0` may break things, `0.2.0 → 0.2.1` is a fix or a small addition. Going to `1.0.0` means "the API is stable now".
- **A published version is permanent.** You can never publish `0.1.0` twice, even after deleting it. Mistakes are fixed by publishing the next version.
- **Changesets**: a tool that records "what changed and how big the change is" in a small file with each PR, then raises versions and writes `CHANGELOG.md` for you.
- **Trusted publishing**: GitHub Actions proves to npm who it is, so no password or token is stored anywhere. It's the safest way to publish from CI, and npm adds a **provenance** badge ("built from this commit in this repo") automatically.

---

## Decisions (with recommendations)

| Decision             | Recommendation                                                                                                  | Why                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licence              | **MIT**                                                                                                         | The usual choice for design systems and component libraries. Short and permissive, and companies can use it without asking.                          |
| First version        | **`0.1.0`**                                                                                                     | Says "usable, but the API may still change". Save `1.0.0` for when the MVP components are stable.                                                    |
| Version together?    | **Yes, keep `tokens` and `ui` on the same version** (Changesets `fixed` group)                                  | Users just install matching numbers, and the docs never have to explain which `tokens` goes with which `ui`. They also depend on each other closely. |
| Release tool         | **Changesets**                                                                                                  | The standard for pnpm monorepos. It handles `workspace:*`, changelogs and the order packages publish in.                                             |
| How to publish       | **First release by hand from your laptop, then GitHub Actions with trusted publishing for every release after** | npm only lets you set up trusted publishing for a package that already exists, so the first version has to go up by hand.                            |
| Who owns the npm org | **Your personal npm account as owner**, plus a second owner later if anyone joins                               | If you're the only owner and lose access, the packages are stuck.                                                                                    |

---

## Part 1: One-time setup

### Step 1. npm account and organization (on npmjs.com, about 10 minutes)

1. Sign up or log in at https://www.npmjs.com.
2. **Turn on two-factor authentication** (Account → Two-Factor Authentication). Use an authenticator app or a security key. npm requires 2FA to publish.
3. Create the organization: avatar → **Add Organization** → name `detriz-sh-kit` → **Unlimited public packages (free)**.
4. In the terminal: `npm login` (it opens the browser), then `npm whoami` to check.

### Step 2. Licence

Add a `LICENSE` file at the repo root with the MIT text (GitHub: Add file → Create new file → name it `LICENSE` → "Choose a license template" → MIT). Then copy it into `kit/packages/tokens/` and `kit/packages/ui/`, because npm only includes files from the package's own folder. npm adds a `LICENSE` file to the package by itself, even when `files` doesn't list it.

### Step 3. Package metadata

Add these fields to **both** `package.json` files (shown for `ui`; for `tokens`, change `directory` and the description):

```json
{
  "version": "0.0.0",
  "license": "MIT",
  "author": "Dawid Kowalczyk",
  "homepage": "https://smart-home-kit.detriz.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Detriz-dev/smart-home-kit.git",
    "directory": "kit/packages/ui"
  },
  "bugs": "https://github.com/Detriz-dev/smart-home-kit/issues",
  "keywords": [
    "smart home",
    "react",
    "components",
    "design system",
    "iot",
    "design tokens"
  ],
  "publishConfig": {
    "access": "public"
  },
  "files": ["dist"]
}
```

- `publishConfig.access: "public"` is the important one. Without it, the first publish fails with "payment required".
- `repository.directory` lets npm link to the right folder, and trusted publishing checks that `repository` matches the GitHub repo.
- `files` stays `["dist"]`. npm always adds `README.md` and `LICENSE` by itself.
- No `provenance` setting: npm adds provenance by itself when GitHub Actions publishes with trusted publishing (step 9). Setting it here would make the manual first publish fail.
- Keep `"version": "0.0.0"` for now. Changesets raises it in step 6.

### Step 4. A README for each package

`kit/packages/ui/README.md` and `kit/packages/tokens/README.md`. Keep them short and point to the docs site, so there's only one full copy of the docs:

- one line about what the package is
- the install command
- the three CSS imports from the Installation page
- a tiny usage example
- links to the docs site, Storybook (once it's deployed), the Figma library and the changelog

### Step 5. Quality checks before publishing

Add two checkers that catch "works in the repo, broken for users" problems:

```sh
pnpm add -Dw publint @arethetypeswrong/cli
```

Then add a `check:package` script to each package:

```json
// kit/packages/tokens/package.json
"check:package": "publint"

// kit/packages/ui/package.json
"check:package": "publint && attw --pack . --profile esm-only --entrypoints . --ignore-rules internal-resolution-error"
```

- **publint** checks that `exports`, `files` and the other fields point to files that really exist.
- **attw** ("are the types wrong") checks that TypeScript users get the types. `--profile esm-only` is needed because the kit is ES modules only (no `require`).
- `--entrypoints .` checks only the JavaScript entry. `styles.css` and `fonts.css` have no types, so attw would always report them as "failed".
- `--ignore-rules internal-resolution-error`: the `.d.ts` files import each other without file extensions (`from "./components/…"`). That works with a bundler, which the kit requires, but not with TypeScript's `node16` / `nodenext` setting, which is for Node-only projects. The kit can't run in those anyway, because they can't import CSS. To support them later, the type files would have to be bundled into one file or use `.js` extensions.

Run it with `pnpm -r check:package` after a build.

### Step 6. Changesets

We use **Changesets 3**. Its `changeset init` only works as a question-and-answer prompt, so the files were written by hand:

```sh
pnpm add -Dw @changesets/cli
```

`.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@4.0.1/schema.json",
  "baseBranch": "main",
  "access": "public",
  "format": "auto",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "ignore": [],
  "fixed": [["@detriz-sh-kit/tokens", "@detriz-sh-kit/ui"]],
  "linked": [],
  "updateInternalDependencies": "patch"
}
```

- `fixed` keeps `tokens` and `ui` on the same version.
- `ignore` is empty: Changesets already skips packages with `"private": true` (`docs-site`, `storybook-app`).
- `format: "auto"` runs Prettier on the changelogs.

Root scripts in `package.json`:

```json
"changeset": "changeset",
"version-packages": "changeset version && pnpm install --lockfile-only",
"release": "turbo run build --filter=./kit/packages/* && node scripts/stage-release.mjs"
```

> **Package names must be unique.** The Storybook app used to be called `storybook`, the same name as the real `storybook` npm package that `ui` depends on. Changesets mixed them up and crashed, so the app is now `storybook-app` (`pnpm storybook` still works). Don't give an app in `kit/apps/` the name of an npm package.

### Step 7. Test the packages like a real user would (before the first publish)

This catches missing files, wrong paths and CSS that doesn't load.

```sh
pnpm build
pnpm --filter "./kit/packages/*" pack --pack-destination ~/shk-test
cd ~ && pnpm create vite shk-try --template react-ts && cd shk-try
pnpm add ~/shk-test/detriz-sh-kit-tokens-0.1.0.tgz ~/shk-test/detriz-sh-kit-ui-0.1.0.tgz
```

Then follow the docs site's Installation page **word for word** in that fresh app: three CSS imports, render one component, `pnpm dev`, then `pnpm build`. If the guide is wrong anywhere, fix the guide.

### Step 8. First publish, by hand

The version bump happens on the branch, before the PR (task 6), so `main` already says `0.1.0` when you publish:

```sh
# on the branch (task 6)
pnpm changeset          # pick both packages, "minor", summary: "First public release"
pnpm version-packages   # 0.0.0 → 0.1.0 and writes CHANGELOG.md

# after the PR is merged (task 10)
git switch main && git pull
pnpm install
pnpm build
pnpm -r check:package
pnpm -r publish --dry-run --no-git-checks   # shows exactly what would upload
pnpm changeset publish                      # asks for your 2FA code
git push --follow-tags                      # changeset publish created the git tags
```

Check it on https://www.npmjs.com/package/@detriz-sh-kit/ui, and run `npm view @detriz-sh-kit/ui`.

**What happened on 2026-11-11 (staged publishing).** The first time a package name is published, npm puts it through **staged publishing**: it shows a `0.0.0-stage` placeholder, and the real version stays hidden until a maintainer approves it with 2FA under **Staged Packages** on npmjs.com (in the menu on the left of your account page). `tokens@0.1.0` went live by itself after about a minute; `ui@0.1.0` waited for approval. Leave the `0.0.0-stage` versions alone: they are npm's record of the name. `npm install` picks the real version (`latest`) once it's approved.

In zsh (the macOS terminal), quote filters with a `*` in them: `--filter="./kit/packages/*"`. Without quotes, zsh tries to expand the `*` itself and stops with "no matches found". Inside `package.json` scripts it works without quotes.

### Step 9. Turn on trusted publishing (CI releases from now on)

1. On npmjs.com, open each package's settings page: https://www.npmjs.com/package/@detriz-sh-kit/tokens/access and https://www.npmjs.com/package/@detriz-sh-kit/ui/access (the **Settings** tab on the package page). Your account's **Packages** page doesn't list them, because they belong to the org.
2. **Trusted Publisher** → GitHub Actions → organization `Detriz-dev`, repository `smart-home-kit`, workflow file `release.yml`, environment empty. Leave **"npm publish"** under Allowed actions **unticked** (npm's default since 2026-09-03): the workflow may only _stage_ a release, and a person approves it. With it unticked, a direct publish from CI fails with `E403 … OIDC permission denied for this action`.
3. **Publishing access** → "Require two-factor authentication and disallow tokens". From now on only that workflow (or you, with 2FA) can publish.
4. On GitHub: **Settings → Actions → General → Workflow permissions** → tick **"Allow GitHub Actions to create and approve pull requests"** and save. Without it, the workflow can't open the "Version Packages" PR.
5. The workflow is `.github/workflows/release.yml`. It runs on every push to `main`:
   - Changesets waiting in `.changeset/` → it opens or updates the **"Version Packages"** PR (versions raised, changelogs written).
   - No changesets left (you just merged that PR) → it builds the packages and runs `scripts/stage-release.mjs`, which **stages** each version that has no git tag yet (`npm stage publish`), then creates its git tag and pushes it to GitHub.
6. **Approve** on npmjs.com → your account → **Staged Packages**, with 2FA: `tokens` first, then `ui` (it depends on `tokens`). Only then can people install the new version. From the terminal: `npm stage list` and `npm stage approve <id>` (needs npm 11.15 or later).

**Why our own script instead of `changeset publish`?** Changesets can only publish directly, and npm doesn't let our workflow do that. The script does the same job but stages: it packs each package with `pnpm pack` (so `workspace:*` becomes a real version), runs `npm stage publish` on the tarball, then creates the git tag and pushes it (the Changesets action doesn't push tags for a custom script; we learned that from the `0.1.1` release). The tag also marks the version as done: npm refuses to stage the same version twice, so the next run skips it. Try it safely with `node scripts/stage-release.mjs --dry-run` (needs npm 11.15 or later on your laptop). It doesn't handle pre-release tags (`next`) yet.

There are **no npm secrets** anywhere: `id-token: write` lets GitHub prove to npm which workflow is publishing, and npm adds provenance (the "Built and signed on GitHub Actions" badge) by itself. Three things in the file are on purpose:

- It installs **npm 11** first: Node 22 comes with npm 10, which has no `npm stage`.

- `actions/setup-node` has **no `registry-url`**: that option writes an `.npmrc` that expects an npm token.
- **Don't rename `release.yml`**: npm trusts that exact file name.

On the "Version Packages" PR, the CI check waits with **"action required"**, because a bot opened the PR. Click **"Approve and run workflows"** to run it, or merge without it: the same code already passed CI in the PR that added the changeset.

GitHub releases are turned off (`createGithubReleases: false`), because a staged version isn't public until you approve it. The CHANGELOGs and git tags cover the same ground.

### Step 10. A CI check on every pull request

`.github/workflows/ci.yml` runs on every `pull_request`: `pnpm install --frozen-lockfile`, `pnpm format:check`, `pnpm build`, `pnpm typecheck` and `pnpm -r check:package`. Then a broken package can't reach `main`, so it can't reach npm. It gets pnpm from `packageManager` in the root `package.json`, so CI and your laptop use the same version.

To make the check **required** (the merge button stays grey until it passes): on GitHub, Settings → Branches → add a rule for `main` → "Require status checks to pass" → pick `check`. The check appears in that list only after it has run once, so do this after the first PR.

### Step 11. Update the docs

- `AGENTS.md` and `project-architecture.md`: remove "Packages aren't published to npm yet", close the "Publishing" and "Licence" open questions, and add a short "Releasing" section that links here.
- `docs/architecture/tech-stack.md`: add Changesets, publint, attw and GitHub Actions.
- Docs site, Get Started: remove the note that the packages aren't on npm yet. Add a "Changelog" or "Releases" link (to the GitHub releases page or the `CHANGELOG.md` files).
- `roadmap.md`: tick off the "UI packages" item.
- Optional: npm version badges in the root `README.md`.

---

## Part 2: Everyday release workflow (maintenance)

### Publish a new version, step by step

Releasing never means typing a version number or running `npm publish`. You describe each change in a small note (a **changeset**), the Release workflow turns the notes into a new version, and you approve it on npmjs.com.

**1. On your branch: make the change and describe it**

1. Make the change in `kit/packages/tokens` or `kit/packages/ui` as usual.
2. From the repo root, run:

   ```sh
   pnpm changeset
   ```

3. Answer the questions:
   - **Which packages?** Pick the ones you changed (space to select, enter to confirm). `tokens` and `ui` always get the same version anyway.
   - **Which bump?** See the table below. Changesets asks about `major` first, then `minor`; press enter to skip a level. Whatever isn't major or minor is a patch.
   - **Summary:** one sentence **for the people who use the kit**, not for us. Good: "Adds the `size` prop to `DeviceCard`." Not good: "Refactor DeviceCard styles." For a breaking change, also say how to update: "Renames `status` to `connectionStatus`."

4. This creates a small file in `.changeset/` (for example `.changeset/brave-lions-sing.md`). Commit it together with your change.

PRs that only touch the docs site, Storybook, `docs/` or other internal files don't need a changeset. If you forget one, add it in a later PR before releasing.

Which bump?

| You changed…                                                             | While on `0.x` | After `1.0.0` |
| ------------------------------------------------------------------------ | -------------- | ------------- |
| Bug fix, visual fix, internal refactor                                   | patch          | patch         |
| New component, new prop, new token                                       | patch          | minor         |
| Renamed or removed a prop, component, export or token; changed a default | **minor**      | **major**     |
| Raised the minimum React version                                         | **minor**      | **major**     |

Removing or renaming a `--shk-` token is a breaking change too: users may use tokens in their own CSS.

**2. On GitHub: merge your PR**

5. Push the branch and open a PR. Wait for the green **CI / check**, then merge.
6. You can merge several PRs with changesets before releasing. They all go into the same next version.

**3. On GitHub: merge the "Version Packages" PR (this is "release now")**

7. After each merge, the **Release** workflow (Actions tab) opens or updates a PR called **"chore(release): version packages"**. It:
   - raises the version in both `package.json` files (for example `0.1.1` → `0.1.2`),
   - adds your summaries to both `CHANGELOG.md` files,
   - deletes the used changeset files.
8. Open that PR and check the **Files changed** tab: is the new version right (patch, minor)? Do the changelog lines read well? To fix a line, edit the changeset file on `main` in a new PR; the bot updates its PR.
9. Its CI check shows **"action required"**, because a bot opened the PR. Click **"Approve and run workflows"** if you want it to run (optional: the same code already passed CI).
10. **Merge it** when you want to release.

**4. On GitHub: wait for the Release workflow**

11. Merging starts the **Release** workflow again (Actions tab, about 1 minute). It builds both packages, **stages** the new versions on npm and pushes the git tags (`@detriz-sh-kit/tokens@0.1.2`, `@detriz-sh-kit/ui@0.1.2`).
12. Wait for the green ✅. Nobody can install the new version yet.

**5. On npmjs.com: approve the release**

13. Sign in as `detriz` → avatar → your account page → **Staged Packages** in the menu on the left.
14. Both new versions are listed. If the status says **validating**, wait a minute or two.
15. Approve **`@detriz-sh-kit/tokens` first**, then **`@detriz-sh-kit/ui`** (it depends on `tokens`). Each approval asks for your 2FA code.

**6. Check it**

16. Open https://www.npmjs.com/package/@detriz-sh-kit/ui: the new version is shown, with the provenance badge ("Built and signed on GitHub Actions"). Or in the terminal:

    ```sh
    npm view @detriz-sh-kit/ui version
    npm view @detriz-sh-kit/tokens version
    ```

17. Optional: in a test app, `npm install @detriz-sh-kit/ui@latest @detriz-sh-kit/tokens@latest` and check that it builds.

Done. You decide when to release (step 10), and you approve every version yourself (step 15).

### Pre-releases (to try big changes safely)

```sh
pnpm changeset pre enter next   # versions become 0.3.0-next.0, 0.3.0-next.1, …
# merge changes and release as usual; they go out under the "next" tag
pnpm changeset pre exit         # back to normal releases
```

Users get them only if they ask: `npm install @detriz-sh-kit/ui@next`. A normal `npm install` keeps the stable version (`latest` tag).

> **Not ready yet:** `scripts/stage-release.mjs` always stages with the `latest` tag, and npm refuses a pre-release version without an explicit tag. Before the first pre-release, make the script pass `--tag next` for versions with a `-` in them.

### When something goes wrong

| Problem                                      | What to do                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Published a broken version                   | Fix it and publish a patch right away. Then `npm deprecate @detriz-sh-kit/ui@0.2.1 "Broken CSS, use 0.2.2"`.                                           |
| Published something secret or very broken    | `npm unpublish` works only within 72 hours and only if nothing depends on it. The version number can never be reused. Prefer deprecating.              |
| The `latest` tag points to the wrong version | `npm dist-tag add @detriz-sh-kit/ui@0.2.0 latest`                                                                                                      |
| CI publish failed halfway                    | Re-run the workflow. The stage script skips versions that already have a git tag or are on npm.                                                        |
| No "Version Packages" PR appears             | Check that the merged PR had a file in `.changeset/`, and that GitHub → Settings → Actions → General still allows Actions to create PRs.               |
| A staged version is wrong                    | Don't approve it. On npmjs.com → Staged Packages, **Reject** it, fix the problem and release a new patch. The rejected version number can't be reused. |
| The Release workflow fails with `E403`       | The trusted publisher on npmjs.com must allow staging (`release.yml`, org `Detriz-dev`, repo `smart-home-kit`). See step 9 in Part 1.                  |

### Regular upkeep

- **Dependencies:** turn on Dependabot or Renovate for version updates. Look at `@fontsource/*` (a real dependency users download) and the React peer range in particular.
- **Security:** keep 2FA on, never put an npm token in the repo, and keep "disallow tokens" switched on for the packages.
- **Supported versions:** say in the README that only the latest version gets fixes. That's normal for a small project.
- **Breaking changes:** write in the changeset how to update ("Rename `status` to `connectionStatus`."). It ends up in the changelog, which is the migration guide.
- **Going to 1.0.0:** when the MVP components are stable and you're ready to promise "no breaking changes without a major version".

---

## Tasks

Done one by one, in this order. Tasks 2 to 8 happen on branch `104-publish-library-in-npm` and go to `main` in one PR (task 9). Only then is anything published.

| #   | Task                                                                                                                | Who    | Plan step | Done |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------ | --------- | ---- |
| 1   | npm: turn on 2FA, create the free org `detriz-sh-kit`, run `npm login` and `npm whoami` in the terminal             | You    | 1         | [x]  |
| 2   | Add the MIT `LICENSE` at the root and in both packages                                                              | Claude | 2         | [x]  |
| 3   | Add metadata and `publishConfig.access: "public"` to both `package.json` files                                      | Claude | 3         | [x]  |
| 4   | Write a `README.md` for each package                                                                                | Claude | 4         | [x]  |
| 5   | Add publint and attw, run them, fix what they find                                                                  | Claude | 5         | [x]  |
| 6   | Set up Changesets, add the "First public release" changeset, raise versions to `0.1.0` (`pnpm version-packages`)    | Claude | 6, 8      | [x]  |
| 7   | Test the `0.1.0` tarballs in a fresh Vite app by following the Installation page                                    | Both   | 7         | [x]  |
| 8   | Add `.github/workflows/ci.yml` (checks on every PR)                                                                 | Claude | 10        | [x]  |
| 9   | Review, commit, open the PR, merge it into `main`                                                                   | You    | n/a       | [x]  |
| 10  | First publish by hand from `main` (`pnpm changeset publish`, you type the 2FA code), push the tags, check npmjs.com | Both   | 8         | [x]  |
| 11  | Set the trusted publisher and "disallow tokens" on both packages on npmjs.com                                       | You    | 9         | [x]  |
| 12  | Add `.github/workflows/release.yml`, then test it with a small patch release                                        | Claude | 9         | [x]  |
| 13  | Update the docs: AGENTS.md, project-architecture, tech-stack, docs site, roadmap                                    | Claude | 11        | [x]  |

**Every release**

- [ ] Each user-facing PR has a changeset with the right bump
- [ ] Read the "Version Packages" PR: the versions and changelog entries are right
- [ ] Merge it and wait for the Release workflow to go green
- [ ] Approve on npmjs.com → Staged Packages with 2FA, `tokens` first, then `ui`
- [ ] Check the new version on npmjs.com
