import { type APIRequestContext } from '@playwright/test';
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api-testing-postman.vercel.app/api/v1';
export type RequestOptions = Parameters<APIRequestContext['get']>[1];
export class ApiService {
  constructor(readonly request: APIRequestContext) {}
  get(path: string, options: RequestOptions = {}) { return this.request.get(`${API_BASE_URL}${path}`, options); }
  post(path: string, data: unknown, options: RequestOptions = {}) { return this.request.post(`${API_BASE_URL}${path}`, { ...options, data }); }
  put(path: string, data: unknown, options: RequestOptions = {}) { return this.request.put(`${API_BASE_URL}${path}`, { ...options, data }); }
  patch(path: string, data: unknown, options: RequestOptions = {}) { return this.request.patch(`${API_BASE_URL}${path}`, { ...options, data }); }
  delete(path: string, options: RequestOptions = {}) { return this.request.delete(`${API_BASE_URL}${path}`, options); }
}
