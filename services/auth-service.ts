import { ApiService } from './api-service';
import { type UserData } from './user-service';
export class AuthService {
  constructor(readonly api: ApiService) {}
  login(credentials: UserData) { return this.api.post('/users/login', credentials); }
}
