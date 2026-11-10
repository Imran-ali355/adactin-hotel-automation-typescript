# Adactin Hotel Automation — TypeScript

Simple Playwright framework with Page Object Model, typed test data, UI and API tests, HTML/Allure reports and Jenkins + Docker.
Converted from Imran-ali355/adactin-hotel-automation-playwright (source commit `5e0e68b8678247a56d210fdb48f0cb58e14f5404`).

## Start locally

Use Node.js 22 LTS.

```bash
npm ci
npx playwright install --with-deps
```

Copy `.env.example` to `.env` (Windows: `Copy-Item .env.example .env`). Fill in your Adactin username and password locally. Never commit `.env`.

```bash
npm run typecheck
npm run test:smoke
npm run test:ui
npm run report
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run test:ui` | Adactin UI tests in Chromium |
| `npm run test:all-browsers` | UI tests in Chromium, Firefox and WebKit |
| `npm run test:smoke` | Short core UI flow |
| `npm run test:api` | Existing separate practice API tests, once (no hotel login needed) |
| `npm run test:requirements` | Proposed stricter validation checks; demo-app defects may fail |
| `npx playwright test --project=chromium --grep @bva` | Boundary-value tests |
| `npx playwright test --project=chromium --grep @ep` | Equivalence-partition tests |
| `npm run clean` | Delete old generated reports |
| `npm run allure:generate` | Build Allure HTML (requires Java) |
| `npm run allure:open` | Open Allure locally |

`npm test` runs the Chromium UI suite. Run `npx playwright test` to include all projects and the stricter requirement probes. Run `npm run clean` before a new local report cycle; Jenkins starts with clean results automatically.

## Structure

| Folder/file | Purpose |
| --- | --- |
| `pages/` | Small classes with page actions and locators |
| `fixtures/hotel.ts` | Login/setup and cleanup of bookings made by the current test |
| `test_Data/*.json` | Data-driven UI and API scenarios and expected values |
| `test-data/hotel.ts` | Typed search and booking data built from JSON; dates relative to today |
| `tests/ui/` | Login, registration, account forms, search, selection, booking, itinerary |
| `tests/api/`, `services/` | API scenarios with per-test `beforeEach` setup and typed request wrappers |
| `tests/requirements/` | Stricter business rules that need product-owner agreement |
| `playwright.config.ts` | Browsers, timeouts, retries and reports |
| `Jenkinsfile`, `scripts/run-docker.sh` | CI pipeline and fresh test-container execution |
| `docs/COVERAGE.md` | Exact automated coverage and manual limitations |
| `docs/VALIDATION.md` | Actual validation results, not a promise that every test passes |

Each test starts with a new browser context. Tests that require login log in explicitly; there are no committed session files or fragile setup-project dependencies. API tests have a separate project and do not repeat for each browser.

Booking cleanup targets **only order IDs created by that test**. Never use this suite to cancel pre-existing bookings. The API suite creates unique synthetic users on a separate practice API; not every API scenario deletes its generated user.

Screenshots and traces can contain account/session information. Reports are ignored by Git; keep Jenkins report access restricted to your team.

## Jenkins setup

1. Jenkins needs Git, Bash, Docker CLI and access to a running Docker daemon. If Jenkins itself runs in Docker, its Docker socket/daemon access must already work (`docker version`).
2. Install Pipeline, Git, Credentials Binding, JUnit, HTML Publisher and Allure Jenkins plugins.
3. Configure Java and an Allure Commandline installation in Jenkins Tools. This project uses the Allure 2 report format/CLI.
4. Create **Secret text** credentials with IDs `ADACTIN_USERNAME` and `ADACTIN_PASSWORD`.
5. Create a Pipeline job → Pipeline script from SCM → Git → new repository URL → branch `*/main` → Script Path `Jenkinsfile`.
6. Run the job. Choose the browser in subsequent **Build with Parameters** runs. `RUN_API` is optional and defaults to false.

The script builds a cached image, creates a fresh container, passes credentials as environment variables, runs type-check/tests, copies reports back and removes the container. Test failures keep the build failed. No host workspace bind mount is required, so it also supports Jenkins running inside Docker.

A GitHub webhook is optional. Configure it only after Jenkins has a reachable webhook URL. No webhook or live Jenkins job is created by this source code alone.

Playwright npm version and Docker image are pinned together. If upgrading, update both and regenerate the lockfile.

## Coverage limits

This is a broad functional suite, **not exhaustive proof of all possible inputs**. CAPTCHA registration, real recovery email delivery, real password changes and destructive bulk actions need an isolated account/manual testing. See the coverage document. No real payment is made; the demo card data is test data.

References: [Playwright Docker](https://playwright.dev/docs/docker), [Jenkins Allure step](https://www.jenkins.io/doc/pipeline/steps/allure-jenkins-plugin/).
