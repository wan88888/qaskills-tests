import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse, assertResponseWithin } from '../../clients/base-api-client';

const CORE_RESOURCES = [
  { path: '/posts', expectedCount: 100 },
  { path: '/comments', expectedCount: 500 },
  { path: '/albums', expectedCount: 100 },
  { path: '/photos', expectedCount: 5000 },
  { path: '/todos', expectedCount: 200 },
  { path: '/users', expectedCount: 10 },
] as const;

test.describe('JSONPlaceholder - Core resources smoke', () => {
  for (const resource of CORE_RESOURCES) {
    test(`GET ${resource.path} - should be available`, async ({ request }) => {
      const response = await assertResponseWithin(request.get(resource.path), 5_000);
      await assertJsonResponse(response, 200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(resource.expectedCount);
    });
  }

  test('should respond with JSON content-type on all core resources', async ({ request }) => {
    for (const resource of CORE_RESOURCES) {
      const response = await request.get(resource.path);
      expect(response.headers()['content-type']).toContain('application/json');
    }
  });
});
