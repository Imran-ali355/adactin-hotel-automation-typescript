import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';

test('Update logged-in user account', async ({ request }, testInfo) => {
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

  const updateResponse = await test.step('Update the account', () =>
    users.replaceAccount({
      fullname: 'Updated User',
      email: `updated-${user.email}`,
      username: `updated_${user.username}`
    })
  );
  await attachApiLog(testInfo, 'Account update response', updateResponse);

  expect(updateResponse.status()).toBe(200);
});

test('Require login to update account', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Update the account without logging in', () =>
    users.replaceAccount({
      fullname: 'Updated User',
      email: 'updateduser@example.com',
      username: 'updatedUser'
    })
  );
  await attachApiLog(testInfo, 'Unauthenticated account update response', response);

  expect(response.status()).toBe(401);
});

test('Reject account update without full name', async ({ request }, testInfo) => {
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

  const response = await test.step('Update the account without a full name', () =>
    users.replaceAccount({
      email: 'incomplete@example.com',
      username: 'incompleteUser'
    })
  );
  await attachApiLog(testInfo, 'Incomplete account update response', response);

  expect(response.status()).toBe(400);
});

test('Reject unknown account update endpoint', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Update an unknown endpoint', () =>
    users.replaceUnknownAccount({
      fullname: 'Updated User',
      email: 'updateduser@example.com',
      username: 'updatedUser'
    })
  );
  await attachApiLog(testInfo, 'Unknown account update response', response);

  expect(response.status()).toBe(404);
});
