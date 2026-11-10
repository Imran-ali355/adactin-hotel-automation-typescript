import { randomUUID } from 'node:crypto';
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

test('Log in with valid credentials', async ({}, testInfo) => {
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(data.status.created);

  const response = await test.step('Log in with the new user credentials', () => auth.login(user));
  await attachApiLog(testInfo, 'Valid login response', response);
  expect(response.status()).toBe(data.status.ok);
});

test('Reject incorrect password', async ({}, testInfo) => {
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

test('Reject login without password', async ({}, testInfo) => {
  const response = await test.step('Log in without a password', () =>
    auth.login({
      email: data.users.loginWithoutPasswordEmail,
      username: data.users.loginWithoutPasswordUsername
    })
  );
  await attachApiLog(testInfo, 'Login without password response', response);
  expect(response.status()).toBe(data.status.badRequest);
});

test('Reject login for unregistered email', async ({}, testInfo) => {
  const id = randomUUID().replaceAll('-', '');
  const response = await test.step('Log in with an unregistered account', () =>
    auth.login({
      email: `${data.users.unregisteredEmailPrefix}${id}${data.users.userEmailDomain}`,
      username: `${data.users.unregisteredUsernamePrefix}${id}`,
      password: data.users.password
    })
  );
  await attachApiLog(testInfo, 'Unregistered account login response', response);
  expect(response.status()).toBe(data.status.notFound);
});
