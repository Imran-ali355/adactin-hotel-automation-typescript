import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';
import data from '../../test_Data/api.json';

let users: UserService;
let auth: AuthService;
test.beforeEach(async ({ request }) => {
  const api = new ApiService(request);
  users = new UserService(api);
  auth = new AuthService(api);
});

test('Delete logged-in user account', async ({}, testInfo) => {
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(data.status.created);

  const loginResponse = await test.step('Log in as the test user', () => auth.login(user));
  await attachApiLog(testInfo, 'Test user login response', loginResponse);
  expect(loginResponse.status()).toBe(data.status.ok);

  const response = await test.step('Delete the account', () => users.deleteAccount());
  await attachApiLog(testInfo, 'Account deletion response', response);
  expect(response.status()).toBe(data.status.ok);
});

test('Require login to delete account', async ({}, testInfo) => {
  const response = await test.step('Delete the account without logging in', () => users.deleteAccount());
  await attachApiLog(testInfo, 'Unauthenticated account deletion response', response);
  expect(response.status()).toBe(data.status.unauthorized);
});

test('Reject login with wrong password before deletion', async ({}, testInfo) => {
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(data.status.created);

  const response = await test.step('Log in with an incorrect password', () =>
    auth.login({ ...user, password: data.users.wrongPassword })
  );
  await attachApiLog(testInfo, 'Incorrect password login response', response);
  expect(response.status()).toBe(data.status.unauthorized);
});

test('Reject unknown account deletion endpoint', async ({}, testInfo) => {
  const response = await test.step('Delete an unknown endpoint', () => users.deleteUnknownAccount());
  await attachApiLog(testInfo, 'Unknown account deletion response', response);
  expect(response.status()).toBe(data.status.notFound);
});
