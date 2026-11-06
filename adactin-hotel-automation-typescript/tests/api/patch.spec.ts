import { test, expect, type APIRequestContext } from '@playwright/test';
import { ApiService, API_BASE_URL } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';

async function loginTestUser(request: APIRequestContext) {
  const api = new ApiService(request);
  const users = new UserService(api);
  const auth = new AuthService(api);
  const user = createTestUser();

  const registration = await users.register(user);
  expect(registration.status()).toBe(201);

  const login = await auth.login(user);
  expect(login.status()).toBe(200);

  return api;
}

test('Reject PATCH account with a new full name', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { fullname: 'Updated Playwright User' }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with a new email', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { email: `updated-${createTestUser().email}` }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with a new username', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { username: `updated_${createTestUser().username}` }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with multiple fields', async ({ request }) => {
  const api = await loginTestUser(request);
  const user = createTestUser();
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: {
      fullname: 'Updated Playwright User',
      email: user.email,
      username: user.username
    }
  });

  expect(response.status()).toBe(404);
});

test('Require login to PATCH an account', async ({ request }) => {
  const api = new ApiService(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { fullname: 'Updated Playwright User' }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with an empty body', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: {}
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with an invalid email', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { email: 'invalid-email' }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with an email already in use', async ({ request }) => {
  const api = new ApiService(request);
  const users = new UserService(api);
  const auth = new AuthService(api);
  const user = createTestUser();
  const existingUser = createTestUser();

  const userRegistration = await users.register(user);
  expect(userRegistration.status()).toBe(201);
  const existingUserRegistration = await users.register(existingUser);
  expect(existingUserRegistration.status()).toBe(201);

  const login = await auth.login(user);
  expect(login.status()).toBe(200);

  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: { email: existingUser.email }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH to an unknown account endpoint', async ({ request }) => {
  const api = new ApiService(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/invalid-patch-endpoint`, {
    data: { fullname: 'Updated Playwright User' }
  });

  expect(response.status()).toBe(404);
});

test('Reject PATCH account with malformed JSON', async ({ request }) => {
  const api = await loginTestUser(request);
  const response = await api.request.patch(`${API_BASE_URL}/users/replace-account`, {
    data: 'not-json',
    headers: { 'Content-Type': 'application/json' }
  });

  expect(response.status()).toBe(400);
});
