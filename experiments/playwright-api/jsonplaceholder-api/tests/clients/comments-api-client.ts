import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { CreateCommentRequest } from '../models/comment.model';

export class CommentsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '/comments');
  }

  list(): Promise<APIResponse> {
    return this.get('');
  }

  getById(id: number): Promise<APIResponse> {
    return this.get(`/${id}`);
  }

  listByPostId(postId: number): Promise<APIResponse> {
    return this.get('', { postId: String(postId) });
  }

  create(comment: CreateCommentRequest): Promise<APIResponse> {
    return this.post('', comment);
  }
}
