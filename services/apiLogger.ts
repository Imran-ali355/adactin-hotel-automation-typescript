import { type APIResponse, type TestInfo } from '@playwright/test';
export async function attachApiLog(testInfo: TestInfo, title: string, response: APIResponse) {
  // Bodies may contain access tokens and other users' data. Log only metadata.
  await testInfo.attach(title, {
    body: JSON.stringify({ status: response.status(), url: response.url() }, null, 2),
    contentType: 'application/json',
  });
}
