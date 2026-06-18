import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base-api-client';
import { CreateTodoRequest } from '../models/todo.model';

export class TodosApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, '/todos');
  }

  list(): Promise<APIResponse> {
    return this.get('');
  }

  getById(id: number): Promise<APIResponse> {
    return this.get(`/${id}`);
  }

  listByUserId(userId: number): Promise<APIResponse> {
    return this.get('', { userId: String(userId) });
  }

  create(todo: CreateTodoRequest): Promise<APIResponse> {
    return this.post('', todo);
  }

  update(id: number, todo: Partial<CreateTodoRequest>): Promise<APIResponse> {
    return this.patch(`/${id}`, todo);
  }

  remove(id: number): Promise<APIResponse> {
    return this.delete(`/${id}`);
  }
}
