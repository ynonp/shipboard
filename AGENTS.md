# Issue Resolution Checklist
- Create relevant tests
- Verify new and previous tests pass
- Add screenshots after the fix

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
