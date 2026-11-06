import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';

test('Register a user', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const user = createTestUser();
  const response = await test.step('Register the user', () => users.register(user));
  await attachApiLog(testInfo, 'User registration response', response);

  expect(response.status()).toBe(201);
});

test('Reject registration without password', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Register without a password', () =>
    users.register({
      fullname: 'imran112',
      email: 'imran_missing@example.com',
      username: 'imran_missing'
    })
  );
  await attachApiLog(testInfo, 'Registration without password response', response);

  expect(response.status()).toBe(400);
});

test('Reject invalid registration email', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const response = await test.step('Register with an invalid email', () =>
    users.register({
      fullname: 'imran112',
      email: 'invalid-email-format',
      username: 'imran_email_test',
      password: 'Password123!'
    })
  );
  await attachApiLog(testInfo, 'Invalid email registration response', response);

  expect(response.status()).toBe(409);
});

test('Reject duplicate user registration', async ({ request }, testInfo) => {
  const users = new UserService(new ApiService(request));
  const user = createTestUser();
  const initialResponse = await test.step('Register a new user', () => users.register(user));
  await attachApiLog(testInfo, 'Initial user registration response', initialResponse);
  expect(initialResponse.status()).toBe(201);

  const duplicateResponse = await test.step('Register the same user again', () =>
    users.register(user)
  );
  await attachApiLog(testInfo, 'Duplicate registration response', duplicateResponse);

  expect(duplicateResponse.status()).toBe(409);
});
