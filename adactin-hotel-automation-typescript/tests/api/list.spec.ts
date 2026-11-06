import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { UserService } from '../../services/user-service';
import { attachApiLog } from '../../services/apiLogger';
import data from '../../test_Data/api.json';

let users: UserService;
test.beforeEach(async ({ request }) => {
  users = new UserService(new ApiService(request));
});

test('Return users in API response', async ({}, testInfo) => {
  const response = await test.step('Get all users', () => users.getAllUsers());
  await attachApiLog(testInfo, 'Get all users response', response);
  const responseBody = await response.json();
  expect(response.status()).toBe(data.status.ok);
  expect(responseBody.data.length).toBeGreaterThan(data.users.minimumUserCount);
});

test('Reject unknown users endpoint', async ({}, testInfo) => {
  const response = await test.step('Request an unknown endpoint', () => users.getAlternateUnknownEndpoint());
  await attachApiLog(testInfo, 'Unknown users endpoint response', response);
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject unsupported users-list method', async ({}, testInfo) => {
  const response = await test.step('POST to the users list endpoint', () => users.postToUsersList(data.users.postBody));
  await attachApiLog(testInfo, 'Unsupported users-list method response', response);
  expect(data.users.unsupportedMethodStatuses).toContain(response.status());
});

test('Ignore malformed authorization header', async ({}, testInfo) => {
  const response = await test.step('Get all users with a malformed authorization header', () =>
    users.getAllUsers({ headers: { Authorization: data.users.malformedAuthorization } })
  );
  await attachApiLog(testInfo, 'Malformed authorization response', response);
  expect(response.status()).toBe(data.status.ok);
});
