// Stages every package version that isn't released yet, for a maintainer to
// approve on npmjs.com (Staged Packages, with 2FA). Used instead of
// `changeset publish`, which can only publish directly.
//
// Runs in the Release workflow (`pnpm release`), after the packages are built.
// Needs npm 11.15 or later for `npm stage publish`.
//
// For each package:
// 1. Skip it if its git tag (for example `@detriz-sh-kit/ui@0.1.1`) is already
//    on GitHub: that version was staged or published before. npm refuses to
//    stage the same version twice, so without this every push to `main`
//    would fail until you approve.
// 2. Skip it if npm already has that version (published by hand).
// 3. `pnpm pack` it (this turns `workspace:*` into real version numbers),
//    then `npm stage publish` the tarball.
// 4. Create the git tag and push it to GitHub right away, so the next run
//    skips this version even if it isn't approved yet. (changesets/action
//    doesn't push tags for a custom publish script.)
//
// `node scripts/stage-release.mjs --dry-run` does everything except the
// upload and the git tag.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// In dependency order: `ui` depends on `tokens`, so approve `tokens` first.
const PACKAGE_DIRS = ["kit/packages/tokens", "kit/packages/ui"];

const dryRun = process.argv.includes("--dry-run");

const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", ...options });

const remoteTags = new Set(
  run("git", ["ls-remote", "--tags", "origin"])
    .split("\n")
    .map((line) => line.split("\t")[1])
    .filter(Boolean)
    .map((ref) => ref.replace(/^refs\/tags\//, "").replace(/\^\{\}$/, "")),
);

function isOnNpm(name, version) {
  try {
    return (
      run("npm", ["view", `${name}@${version}`, "version"], {
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() !== ""
    );
  } catch {
    return false; // E404: the package or version doesn't exist yet
  }
}

let staged = 0;

for (const dir of PACKAGE_DIRS) {
  const {
    name,
    version,
    private: isPrivate,
  } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const tag = `${name}@${version}`;

  if (isPrivate) continue;
  if (remoteTags.has(tag)) {
    console.log(
      `${tag}: already staged or published (git tag exists), skipping`,
    );
    continue;
  }
  if (isOnNpm(name, version)) {
    console.log(`${tag}: already on npm, skipping`);
    continue;
  }

  const outDir = mkdtempSync(join(tmpdir(), "stage-"));
  run("pnpm", ["pack", "--pack-destination", outDir], {
    cwd: dir,
    stdio: "ignore",
  });
  const tarball = join(
    outDir,
    readdirSync(outDir).find((f) => f.endsWith(".tgz")),
  );

  console.log(`${tag}: staging ${tarball}`);
  run("npm", ["stage", "publish", tarball, ...(dryRun ? ["--dry-run"] : [])], {
    stdio: "inherit",
  });
  staged++;
  if (dryRun) continue;

  run("git", ["tag", "-a", tag, "-m", tag]);
  run("git", ["push", "origin", `refs/tags/${tag}`], { stdio: "inherit" });
  console.log(`New tag: ${tag}`);
}

console.log(
  staged === 0
    ? "Nothing to stage."
    : `Staged ${staged} package(s). Approve them on npmjs.com → Staged Packages (tokens first).`,
);
