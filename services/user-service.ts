import { ApiService, type RequestOptions } from './api-service';
export interface UserData { fullname?: string; email?: string; username?: string; password?: string }
export class UserService {
  constructor(readonly api: ApiService) {}
  getAllUsers(options?: RequestOptions) { return this.api.get('/users/all-users', options); }
  getUnknownEndpoint() { return this.api.get('/users/invalid-endpoint'); }
  getAlternateUnknownEndpoint() { return this.api.get('/users/invalid-endpoint-999'); }
  postToUsersList(user: Record<string, string>) { return this.api.post('/users/all-users', user); }
  register(user: UserData) { return this.api.post('/users/register', user); }
  replaceAccount(user: UserData) { return this.api.put('/users/replace-account', user); }
  replaceUnknownAccount(user: UserData) { return this.api.put('/users/invalid-replace-endpoint', user); }
  deleteAccount() { return this.api.delete('/users/delete-account'); }
  deleteUnknownAccount() { return this.api.delete('/users/invalid-delete-endpoint'); }
}
