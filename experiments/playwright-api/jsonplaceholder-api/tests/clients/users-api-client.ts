import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '/users');
  }

  list(): Promise<APIResponse> {
    return this.get('');
  }

  getById(id: number): Promise<APIResponse> {
    return this.get(`/${id}`);
  }

  getPosts(userId: number): Promise<APIResponse> {
    return this.get(`/${userId}/posts`);
  }

  getTodos(userId: number): Promise<APIResponse> {
    return this.get(`/${userId}/todos`);
  }

  getAlbums(userId: number): Promise<APIResponse> {
    return this.get(`/${userId}/albums`);
  }
}
