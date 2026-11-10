# Validation status — 5 November 2026

| Check | Result |
| --- | --- |
| Dependency installation / lockfile | Completed with pinned versions |
| TypeScript strict type-check | Passed (`npm run typecheck`) |
| Playwright test discovery | Passed: 102 UI, 30 API, 11 requirement-probe cases |
| Docker runner shell syntax | Passed (`bash -n scripts/run-docker.sh`) |
| Docker runner failure handling | Simulated success/failure preserved exit status, copied all three report directories and removed container |
| Adactin credentials | HTTP login redirected to SearchHotel.php successfully during inspection |
| Live form/validation inspection | Search, registration, recovery, itinerary and change-password forms inspected; search/register/book/select validation JS inspected |
| Browser end-to-end execution | NOT VERIFIED — initial network/proxy errors, then browser launch blocked by the execution environment (`socket() failed: Operation not permitted`); a headless-shell attempt did not complete and was stopped |
| API execution | NOT VERIFIED — request-based validation did not complete in this environment and was stopped |
| Firefox / WebKit execution | NOT VERIFIED |
| Docker build / Jenkins execution | NOT VERIFIED — no Docker daemon or connected Jenkins execution here |

Discovery/type-check are not passing functional test results. No claim is made that all 143 cases pass. Run the smoke suite first on your machine or Jenkins, then the full UI suite. Failures may require locator/expectation adjustment against the selected Adactin build, or may expose application defects. Do not weaken assertions only to obtain a green result.

The temporary validation config used for the execution environment is not included. The delivered config keeps normal HTTPS certificate validation and has no environment-specific proxy/browser executable path.

## Recommended first run

```bash
npm ci
npx playwright install --with-deps
npm run typecheck
npm run test:smoke
npm run test:ui
npm run test:api
npm run test:all-browsers
npm run test:requirements
```

API tests target a separate practice API. Requirement probes are based on explicit stricter assumptions in COVERAGE.md and may fail on this intentionally imperfect demo application.
