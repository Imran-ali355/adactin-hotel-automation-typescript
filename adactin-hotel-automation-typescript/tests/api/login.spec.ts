import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import { attachApiLog } from '../../services/apiLogger';

test('Log in with valid credentials', async ({ request }, testInfo) => {
  const api = new ApiService(request);
  const users = new UserService(api);
  const auth = new AuthService(api);
  const user = createTestUser();
  const registration = await test.step('Register a test user', () => users.register(user));
  await attachApiLog(testInfo, 'Test user registration response', registration);
  expect(registration.status()).toBe(201);

  const response = await test.step('Log in with the new user credentials', () =>
    auth.login(user)
  );
  await attachApiLog(testInfo, 'Valid login response', response);

  expect(response.status()).toBe(200);
});

test('Reject incorrect password', async ({ request }, testInfo) => {
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

test('Reject login without password', async ({ request }, testInfo) => {
  const auth = new AuthService(new ApiService(request));
  const response = await test.step('Log in without a password', () =>
    auth.login({
      email: 'haristester@example.com',
      username: 'haristester'
    })
  );
  await attachApiLog(testInfo, 'Login without password response', response);

  expect(response.status()).toBe(400);
});

test('Reject login for unregistered email', async ({ request }, testInfo) => {
  const auth = new AuthService(new ApiService(request));
  const id = randomUUID().replaceAll('-', '');
  const response = await test.step('Log in with an unregistered account', () =>
    auth.login({
      email: `unregistered-${id}@example.com`,
      username: `unregistered_${id}`,
      password: 'Password123!'
    })
  );
  await attachApiLog(testInfo, 'Unregistered account login response', response);

  expect(response.status()).toBe(404);
});
