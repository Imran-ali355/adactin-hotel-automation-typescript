import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { UserService } from '../../services/user-service';
import { attachApiLog } from '../../services/apiLogger';

test('Return users in API response', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Get all users', () => users.getAllUsers());
  await attachApiLog(testInfo, 'Get all users response', response);
  const responseBody = await response.json();

  expect(response.status()).toBe(200);
  expect(responseBody.data.length).toBeGreaterThan(0);
});

test('Reject unknown users endpoint', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Request an unknown endpoint', () =>
    users.getAlternateUnknownEndpoint()
  );
  await attachApiLog(testInfo, 'Unknown users endpoint response', response);

  expect(response.status()).toBe(404);
});

test('Reject unsupported users-list method', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('POST to the users list endpoint', () =>
    users.postToUsersList({ name: 'test' })
  );
  await attachApiLog(testInfo, 'Unsupported users-list method response', response);

  expect([404, 405]).toContain(response.status());
});

test('Ignore malformed authorization header', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Get all users with a malformed authorization header', () =>
    users.getAllUsers({ headers: { Authorization: '******' } })
  );
  await attachApiLog(testInfo, 'Malformed authorization response', response);

  expect(response.status()).toBe(200);
});
