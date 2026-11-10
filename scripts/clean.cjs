const { rmSync } = require('node:fs');
for (const path of ['allure-results', 'allure-report', 'playwright-report', 'test-results']) rmSync(path, { recursive: true, force: true });
