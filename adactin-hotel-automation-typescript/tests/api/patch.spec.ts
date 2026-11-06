import { test, expect } from '@playwright/test';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { createTestUser } from './test-user';
import data from '../../test_Data/api.json';

let api: ApiService;
let users: UserService;
let auth: AuthService;
test.beforeEach(async ({ request }) => {
  api = new ApiService(request);
  users = new UserService(api);
  auth = new AuthService(api);
});

async function loginTestUser() {
  const user = createTestUser();
  const registration = await users.register(user);
  expect(registration.status()).toBe(data.status.created);
  const login = await auth.login(user);
  expect(login.status()).toBe(data.status.ok);
}

test('Reject PATCH account with a new full name', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, { fullname: data.users.updatedFullname });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with a new email', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, {
    email: `${data.users.updatedEmailPrefix}${createTestUser().email}`
  });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with a new username', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, {
    username: `${data.users.updatedUsernamePrefix}${createTestUser().username}`
  });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with multiple fields', async () => {
  await loginTestUser();
  const user = createTestUser();
  const response = await api.patch(data.users.accountPath, {
    fullname: data.users.updatedFullname,
    email: user.email,
    username: user.username
  });
  expect(response.status()).toBe(data.status.notFound);
});

test('Require login to PATCH an account', async () => {
  const response = await api.patch(data.users.accountPath, { fullname: data.users.updatedFullname });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with an empty body', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, data.users.emptyBody);
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with an invalid email', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, { email: data.users.invalidEmailPatch });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with an email already in use', async () => {
  const user = createTestUser();
  const existingUser = createTestUser();
  const userRegistration = await users.register(user);
  expect(userRegistration.status()).toBe(data.status.created);
  const existingUserRegistration = await users.register(existingUser);
  expect(existingUserRegistration.status()).toBe(data.status.created);
  const login = await auth.login(user);
  expect(login.status()).toBe(data.status.ok);
  const response = await api.patch(data.users.accountPath, { email: existingUser.email });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH to an unknown account endpoint', async () => {
  const response = await api.patch(data.users.unknownPath, { fullname: data.users.updatedFullname });
  expect(response.status()).toBe(data.status.notFound);
});

test('Reject PATCH account with malformed JSON', async () => {
  await loginTestUser();
  const response = await api.patch(data.users.accountPath, data.users.malformedJson, {
    headers: { 'Content-Type': 'application/json' }
  });
  expect(response.status()).toBe(data.status.badRequest);
});
