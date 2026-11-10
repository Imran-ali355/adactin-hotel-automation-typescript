import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';
import data from '../../test_Data/api.json';

let users: UserService;
test.beforeEach(async ({ request }) => {
  users = new UserService(new ApiService(request));
});

test('Register a user', async ({}, testInfo) => {
  const response = await test.step('Register the user', () => users.register(createTestUser()));
  await attachApiLog(testInfo, 'User registration response', response);
  expect(response.status()).toBe(data.status.created);
});

test('Reject registration without password', async ({}, testInfo) => {
  const response = await test.step('Register without a password', () =>
    users.register({
      fullname: data.users.invalidFullname,
      email: data.users.missingPasswordEmail,
      username: data.users.missingPasswordUsername
    })
  );
  await attachApiLog(testInfo, 'Registration without password response', response);
  expect(response.status()).toBe(data.status.badRequest);
});

test('Reject invalid registration email', async ({}, testInfo) => {
  const response = await test.step('Register with an invalid email', () =>
    users.register({
      fullname: data.users.invalidFullname,
      email: data.users.invalidEmail,
      username: data.users.invalidEmailUsername,
      password: data.users.password
    })
  );
  await attachApiLog(testInfo, 'Invalid email registration response', response);
  expect(response.status()).toBe(data.status.conflict);
});

test('Reject duplicate user registration', async ({}, testInfo) => {
  const user = createTestUser();
  const initialResponse = await test.step('Register a new user', () => users.register(user));
  await attachApiLog(testInfo, 'Initial user registration response', initialResponse);
  expect(initialResponse.status()).toBe(data.status.created);

  const duplicateResponse = await test.step('Register the same user again', () => users.register(user));
  await attachApiLog(testInfo, 'Duplicate registration response', duplicateResponse);
  expect(duplicateResponse.status()).toBe(data.status.conflict);
});
