# smartcity-website — working rules

Marketing site for SmartCity Contractors (Next.js on Vercel, project `smartcity-website`,
production domain smartcity.contractors). Pushing `main` to GitHub deploys production through
the Vercel Git integration; every other pushed branch gets a preview deploy.

## Build discipline — owner rule (2026-10-08)

> "I don't want to keep going to work and things are uncommitted for some weird reason.
> Making this part of the discipline." — Ingmar

Same rule as `~/dev/quotesmart/CLAUDE.md`.

1. **The repo lives at `~/dev/smartcity-website`.** Never inside iCloud Desktop/Documents,
   iCloud Drive, Dropbox, OneDrive or Google Drive. On 2026-10-08 the Mac's disk filled and
   iCloud offloaded repo files to placeholders; builds and git hung on them. Moved out of
   `~/Documents` the same day.
2. **GitHub (`origin`) is the backup, not iCloud.** Every session ends with its work
   **committed and pushed** — main, or the feature branch with `git push -u`. If something
   must stay uncommitted or unpushed, say so in the session report with the reason.
3. **Start and end every session with `npm run doctor`** (`scripts/repoDoctor.mjs`): location,
   offloaded files, uncommitted changes, unpushed commits. Not clean at the start → show the
   owner what it found before building on top. Not clean at the end → fix it or report it.
4. **Production ships from `main` on origin only.** Commit, push, let Vercel build — no
   `vercel --prod` from a local tree nobody can find on GitHub.
5. **Uncommitted files you did not make are not yours.** Show them and ask before committing,
   moving or deleting them.

## Open branches (2026-10-08)

- `feat/waitlist-notifications` — waitlist notifications (Resend, then SendGrid) plus a
  backfill script for pending leads. Written 2026-09-08, never merged; pushed to origin
  2026-10-08 as a backup only. Merging it turns on outbound notification email — owner decides.
- `feat/bolt-hq-widget` — Bolt HQ widget on the site; checked out as a worktree at
  `~/.qs_scratch/sc-site-bolt`, tracking origin.
