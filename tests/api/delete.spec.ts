import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';

test('Delete logged-in user account', async ({ request }, testInfo) => {
  const api = new ApiService(request);
  const users = new UserService(api);
  const auth = new AuthService(api);
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(201);

  const loginResponse = await test.step('Log in as the test user', () => auth.login(user));
  await attachApiLog(testInfo, 'Test user login response', loginResponse);
  expect(loginResponse.status()).toBe(200);

  const response = await test.step('Delete the account', () => users.deleteAccount());
  await attachApiLog(testInfo, 'Account deletion response', response);

  expect(response.status()).toBe(200);
});

test('Require login to delete account', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Delete the account without logging in', () =>
    users.deleteAccount()
  );
  await attachApiLog(testInfo, 'Unauthenticated account deletion response', response);

  expect(response.status()).toBe(401);
});

test('Reject login with wrong password before deletion', async ({ request }, testInfo) => {
  const api = new ApiService(request);
  const users = new UserService(api);
  const auth = new AuthService(api);
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(201);

  const response = await test.step('Log in with an incorrect password', () =>
    auth.login({ ...user, password: 'WrongPassword999!' })
  );
  await attachApiLog(testInfo, 'Incorrect password login response', response);

  expect(response.status()).toBe(401);
});

test('Reject unknown account deletion endpoint', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Delete an unknown endpoint', () =>
    users.deleteUnknownAccount()
  );
  await attachApiLog(testInfo, 'Unknown account deletion response', response);

  expect(response.status()).toBe(404);
});
