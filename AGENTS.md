# Issue Resolution Checklist
- Create relevant tests
- Verify new and previous tests pass
- For visible changes, include screenshots in the pull request description

## Browser verification

Copilot's GitHub Actions setup starts Shipboard at `http://127.0.0.1:3000/`.
Before opening Playwright, run `bash scripts/wait-for-dev.sh` and wait for it to
report HTTP readiness. If setup did not start the server, run
`npm run dev -- --hostname 127.0.0.1 --port 3000` in a separate terminal and
then run the readiness check. If the check fails, inspect the server output
(`$RUNNER_TEMP/shipboard-dev.log` for the Actions setup), resolve the startup
error, and rerun the check. If verification is still blocked, report the
failure in the PR. After Playwright opens the page, wait for the content you
are verifying to appear before taking screenshots.

## Screenshot delivery

Add a **Screenshots** section to the pull request description and embed the PNGs
with descriptive alt text. Use GitHub's attachment URL when available. If an
attachment cannot be published, save the PNGs under `docs/screenshots/`, commit
them to the PR branch, and embed links to the images at that commit. Check the
final PR description for the image links. If capture or publication is blocked,
record the specific failure in the PR description.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
