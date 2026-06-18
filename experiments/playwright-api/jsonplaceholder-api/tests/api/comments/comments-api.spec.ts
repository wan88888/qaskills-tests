import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse } from '../../clients/base-api-client';
import { Comment } from '../../models/comment.model';

test.describe('Comments API', () => {
  test('GET /comments - should return 500 comments', async ({ commentsApi }) => {
    const response = await commentsApi.list();
    await assertJsonResponse(response, 200);

    const comments: Comment[] = await response.json();
    expect(comments).toHaveLength(500);
    expect(comments[0]).toMatchObject({
      id: expect.any(Number),
      postId: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /comments?postId=1 - should filter by post', async ({ commentsApi }) => {
    const response = await commentsApi.listByPostId(1);
    await assertJsonResponse(response, 200);

    const comments: Comment[] = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    expect(comments.every((comment) => comment.postId === 1)).toBe(true);
  });

  test('GET /comments/1 - should return a single comment', async ({ commentsApi }) => {
    const response = await commentsApi.getById(1);
    await assertJsonResponse(response, 200);

    const comment: Comment = await response.json();
    expect(comment.id).toBe(1);
    expect(comment.postId).toBe(1);
  });

  test('POST /comments - should create a comment', async ({ commentsApi }) => {
    const response = await commentsApi.create({
      postId: 1,
      name: 'API Tester',
      email: 'tester@example.com',
      body: 'Comment from Playwright API test',
    });
    await assertJsonResponse(response, 201);

    const body: Comment = await response.json();
    expect(body.id).toBe(501);
    expect(body.postId).toBe(1);
    expect(body.email).toBe('tester@example.com');
  });
});
