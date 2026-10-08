// repoDoctor — the start-of-session (and end-of-session) check behind the build
// discipline in CLAUDE.md. Owner rule, 2026-10-08: "I don't want to keep going
// to work and things are uncommitted for some weird reason."
//
//   npm run doctor
//
// FAILS (exit 1) when:
//   location  the repo sits in a synced folder (iCloud Desktop/Documents, iCloud
//             Drive, Dropbox, OneDrive, Google Drive). On 2026-10-08 iCloud
//             offloaded ~31k repo files when the Mac's disk filled, and builds,
//             eslint and tar hung on the placeholders.
//   offloaded files the OS removed and left as placeholders (macOS "dataless").
//   uncommitted   tracked files changed but not committed.
//   unpushed  commits on this branch that are not on origin (or a branch that
//             is not on origin at all) — GitHub is the backup.
// WARNS (exit 0) on untracked files, naming Finder/iCloud "file 2.ts" copies.
//
// Read-only: it runs `git fetch` to compare with origin and changes nothing else.

import { execSync } from "node:child_process";
import { realpathSync } from "node:fs";
import process from "node:process";
import path from "node:path";

const sh = (cmd) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const problems = [];
const warnings = [];
const ok = [];

// ---- where the repo lives ----------------------------------------------------
const root = realpathSync(sh("git rev-parse --show-toplevel"));
const SYNCED = [
  [/\/Library\/Mobile Documents\//, "iCloud Drive"],
  [/^\/Users\/[^/]+\/(?:Desktop|Documents)(?:\/|$)/, "iCloud Desktop & Documents"],
  [/\/Library\/CloudStorage\//, "a cloud-storage provider (Dropbox, OneDrive, Google Drive)"],
  [/\/(?:Dropbox|OneDrive|Google Drive)(?:\/|$)/, "a synced folder"],
];
const synced = SYNCED.find(([re]) => re.test(root));
if (synced) problems.push(`location: ${root} is inside ${synced[1]}. Move it to ~/dev/${path.basename(root)} (CLAUDE.md, "Build discipline").`);
else ok.push(`location: ${root}`);

// ---- files the OS offloaded (macOS) ----------------------------------------------
if (process.platform === "darwin") {
  const n = Number(sh(`find "${root}" -type f -flags +dataless 2>/dev/null | wc -l`) || 0);
  if (n > 0) problems.push(`offloaded: ${n} file(s) are placeholders, not on this disk (find . -flags +dataless). Download them (brctl download <file>) or reinstall node_modules (npm ci).`);
  else ok.push("offloaded: none");
}

// ---- uncommitted / untracked ------------------------------------------------------
// Not trimmed: the first line's leading status column is a space (" M file").
const status = execSync("git status --porcelain=v1", { encoding: "utf8" }).split("\n").filter(Boolean);
const tracked = status.filter((l) => !l.startsWith("??"));
const untracked = status.filter((l) => l.startsWith("??")).map((l) => l.slice(3).replace(/^"|"$/g, ""));
if (tracked.length) problems.push(`uncommitted: ${tracked.length} tracked file(s) changed:\n    ${tracked.slice(0, 12).join("\n    ")}${tracked.length > 12 ? "\n    …" : ""}`);
else ok.push("uncommitted: none");
if (untracked.length) {
  const copies = untracked.filter((f) => / 2(?:\.[^/]+)?$/.test(f));
  warnings.push(
    `untracked: ${untracked.length} file(s)` +
      (copies.length ? ` — ${copies.length} look like Finder/iCloud conflict copies ("name 2.ext")` : "") +
      ". Commit what belongs, gitignore what is local, ask before deleting anything."
  );
}

// ---- unpushed -----------------------------------------------------------------------
const branch = sh("git branch --show-current") || "(detached)";
try {
  sh("git fetch --quiet origin");
} catch {
  warnings.push("fetch: could not reach origin — the push check below uses the last fetch.");
}
let upstream = "";
try {
  upstream = sh("git rev-parse --abbrev-ref --symbolic-full-name @{u}");
} catch {
  /* no upstream */
}
if (!upstream) {
  problems.push(`unpushed: branch ${branch} is not on origin. Push it: git push -u origin ${branch}`);
} else {
  const [behind, ahead] = sh(`git rev-list --left-right --count ${upstream}...HEAD`).split(/\s+/).map(Number);
  if (ahead > 0) problems.push(`unpushed: ${ahead} commit(s) on ${branch} are not on ${upstream}. Push them: git push`);
  if (behind > 0) warnings.push(`behind: ${upstream} has ${behind} commit(s) this branch does not. Pull before building.`);
  if (!ahead && !behind) ok.push(`pushed: ${branch} = ${upstream}`);
}

// ---- report -----------------------------------------------------------------------------
for (const line of ok) console.log(`  ok    ${line}`);
for (const line of warnings) console.log(`  warn  ${line}`);
for (const line of problems) console.log(`  FAIL  ${line}`);
console.log(problems.length ? `\nrepoDoctor: ${problems.length} problem(s) — fix or report them before building.` : "\nrepoDoctor: clean.");
process.exit(problems.length ? 1 : 0);
