import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse } from '../../clients/base-api-client';
import { Post } from '../../models/post.model';

test.describe('Posts API', () => {
  test('GET /posts - should return 100 posts', async ({ postsApi }) => {
    const response = await postsApi.list();
    await assertJsonResponse(response, 200);

    const posts: Post[] = await response.json();
    expect(posts).toHaveLength(100);
    expect(posts[0]).toMatchObject({
      id: expect.any(Number),
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /posts/1 - should return a single post', async ({ postsApi }) => {
    const response = await postsApi.getById(1);
    await assertJsonResponse(response, 200);

    const post: Post = await response.json();
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title).toBeTruthy();
    expect(post.body).toBeTruthy();
  });

  test('GET /posts/1/comments - should return nested comments', async ({ postsApi }) => {
    const response = await postsApi.getComments(1);
    await assertJsonResponse(response, 200);

    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    expect(comments.every((c: { postId: number }) => c.postId === 1)).toBe(true);
  });

  test('GET /posts/9999 - should return 404 for non-existent post', async ({ postsApi }) => {
    const response = await postsApi.getById(9999);
    expect(response.status()).toBe(404);
  });
});
