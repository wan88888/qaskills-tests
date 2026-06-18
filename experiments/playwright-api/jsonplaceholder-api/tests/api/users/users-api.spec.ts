import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse } from '../../clients/base-api-client';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { Todo } from '../../models/todo.model';

test.describe('Users API', () => {
  test('GET /users - should return 10 users', async ({ usersApi }) => {
    const response = await usersApi.list();
    await assertJsonResponse(response, 200);

    const users: User[] = await response.json();
    expect(users).toHaveLength(10);
    expect(users[0].address.geo).toMatchObject({
      lat: expect.any(String),
      lng: expect.any(String),
    });
    expect(users[0].company.name).toBeTruthy();
  });

  test('GET /users/1 - should return user profile', async ({ usersApi }) => {
    const response = await usersApi.getById(1);
    await assertJsonResponse(response, 200);

    const user: User = await response.json();
    expect(user.id).toBe(1);
    expect(user.username).toBe('Bret');
    expect(user.email).toContain('@');
    expect(user.address.city).toBeTruthy();
  });

  test('GET /users/1/posts - should return posts for user', async ({ usersApi }) => {
    const response = await usersApi.getPosts(1);
    await assertJsonResponse(response, 200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.userId === 1)).toBe(true);
  });

  test('GET /users/1/todos - should return todos for user', async ({ usersApi }) => {
    const response = await usersApi.getTodos(1);
    await assertJsonResponse(response, 200);

    const todos: Todo[] = await response.json();
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.every((todo) => todo.userId === 1)).toBe(true);
  });

  test('GET /users/1/albums - should return albums for user', async ({ usersApi }) => {
    const response = await usersApi.getAlbums(1);
    await assertJsonResponse(response, 200);

    const albums = await response.json();
    expect(albums.length).toBeGreaterThan(0);
    expect(albums.every((album: { userId: number }) => album.userId === 1)).toBe(true);
  });
});
