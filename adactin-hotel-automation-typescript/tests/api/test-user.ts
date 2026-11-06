import { randomUUID } from 'node:crypto';

export function createTestUser() {
  const id = randomUUID().replaceAll('-', '');
  return {
    fullname: `Playwright ${id}`,
    email: `playwright-${id}@example.com`,
    username: `pw_${id}`,
    password: 'Password123!'
  };
}
