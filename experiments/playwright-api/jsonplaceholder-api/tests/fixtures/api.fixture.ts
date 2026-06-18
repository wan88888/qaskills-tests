import { test as base } from '@playwright/test';
import { PostsApiClient } from '../clients/posts-api-client';
import { UsersApiClient } from '../clients/users-api-client';
import { CommentsApiClient } from '../clients/comments-api-client';
import { TodosApiClient } from '../clients/todos-api-client';

type ApiFixtures = {
  postsApi: PostsApiClient;
  usersApi: UsersApiClient;
  commentsApi: CommentsApiClient;
  todosApi: TodosApiClient;
};

export const test = base.extend<ApiFixtures>({
  postsApi: async ({ request }, use) => {
    await use(new PostsApiClient(request));
  },

  usersApi: async ({ request }, use) => {
    await use(new UsersApiClient(request));
  },

  commentsApi: async ({ request }, use) => {
    await use(new CommentsApiClient(request));
  },

  todosApi: async ({ request }, use) => {
    await use(new TodosApiClient(request));
  },
});

export { expect } from '@playwright/test';
