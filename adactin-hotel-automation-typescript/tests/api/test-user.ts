import { randomUUID } from 'node:crypto';
import data from '../../test_Data/api.json';

export function createTestUser() {
  const id = randomUUID().replaceAll('-', '');
  return {
    fullname: `${data.users.userFullnamePrefix}${id}`,
    email: `${data.users.userEmailPrefix}${id}${data.users.userEmailDomain}`,
    username: `${data.users.userNamePrefix}${id}`,
    password: data.users.password
  };
}
