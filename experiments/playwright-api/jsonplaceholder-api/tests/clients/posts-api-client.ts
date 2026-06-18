import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { CreatePostRequest, UpdatePostRequest } from '../models/post.model';

export class PostsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '/posts');
  }

  list(): Promise<APIResponse> {
    return this.get('');
  }

  getById(id: number): Promise<APIResponse> {
    return this.get(`/${id}`);
  }

  getComments(postId: number): Promise<APIResponse> {
    return this.get(`/${postId}/comments`);
  }

  create(post: CreatePostRequest): Promise<APIResponse> {
    return this.post('', post);
  }

  replace(id: number, post: CreatePostRequest): Promise<APIResponse> {
    return this.put(`/${id}`, post);
  }

  update(id: number, post: UpdatePostRequest): Promise<APIResponse> {
    return this.patch(`/${id}`, post);
  }

  remove(id: number): Promise<APIResponse> {
    return this.delete(`/${id}`);
  }
}
