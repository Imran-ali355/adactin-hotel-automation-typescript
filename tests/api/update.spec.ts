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

test('Update logged-in user account', async ({}, testInfo) => {
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(data.status.created);

  const loginResponse = await test.step('Log in as the test user', () => auth.login(user));
  await attachApiLog(testInfo, 'Test user login response', loginResponse);
  expect(loginResponse.status()).toBe(data.status.ok);

  const updateResponse = await test.step('Update the account', () =>
    users.replaceAccount({
      fullname: data.users.updatedAccountFullname,
      email: `${data.users.updatedEmailPrefix}${user.email}`,
      username: `${data.users.updatedUsernamePrefix}${user.username}`
    })
  );
  await attachApiLog(testInfo, 'Account update response', updateResponse);
  expect(updateResponse.status()).toBe(data.status.ok);
});

test('Require login to update account', async ({}, testInfo) => {
  const response = await test.step('Update the account without logging in', () =>
    users.replaceAccount({
      fullname: data.users.updatedAccountFullname,
      email: data.users.unauthenticatedUpdateEmail,
      username: data.users.unauthenticatedUpdateUsername
    })
  );
  await attachApiLog(testInfo, 'Unauthenticated account update response', response);
  expect(response.status()).toBe(data.status.unauthorized);
});

test('Reject account update without full name', async ({}, testInfo) => {
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(data.status.created);
  const loginResponse = await test.step('Log in as the test user', () => auth.login(user));
  await attachApiLog(testInfo, 'Test user login response', loginResponse);
  expect(loginResponse.status()).toBe(data.status.ok);

  const response = await test.step('Update the account without a full name', () =>
    users.replaceAccount({
      email: data.users.incompleteEmail,
      username: data.users.incompleteUsername
    })
  );
  await attachApiLog(testInfo, 'Incomplete account update response', response);
  expect(response.status()).toBe(data.status.badRequest);
});

test('Reject unknown account update endpoint', async ({}, testInfo) => {
  const response = await test.step('Update an unknown endpoint', () =>
    users.replaceUnknownAccount({
      fullname: data.users.updatedAccountFullname,
      email: data.users.unknownUpdateEmail,
      username: data.users.unknownUpdateUsername
    })
  );
  await attachApiLog(testInfo, 'Unknown account update response', response);
  expect(response.status()).toBe(data.status.notFound);
});
