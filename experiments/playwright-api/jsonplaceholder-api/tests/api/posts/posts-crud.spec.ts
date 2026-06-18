import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse } from '../../clients/base-api-client';
import { CreatePostRequest, Post } from '../../models/post.model';

test.describe('Posts API - CRUD', () => {
  const newPost: CreatePostRequest = {
    title: 'Playwright API test post',
    body: 'Created via APIRequestContext',
    userId: 1,
  };

  test('POST /posts - should create a post', async ({ postsApi }) => {
    const response = await postsApi.create(newPost);
    await assertJsonResponse(response, 201);

    const body: Post = await response.json();
    expect(body.id).toBe(101);
    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
    expect(body.userId).toBe(newPost.userId);
  });

  test('PUT /posts/1 - should replace a post', async ({ postsApi }) => {
    const response = await postsApi.replace(1, newPost);
    await assertJsonResponse(response, 200);

    const body: Post = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
  });

  test('PATCH /posts/1 - should partially update a post', async ({ postsApi }) => {
    const response = await postsApi.update(1, { title: 'Patched title only' });
    await assertJsonResponse(response, 200);

    const body: Post = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBe('Patched title only');
  });

  test('DELETE /posts/1 - should delete a post', async ({ postsApi }) => {
    const response = await postsApi.remove(1);
    expect(response.status()).toBe(200);
  });
});
