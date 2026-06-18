import { test, expect } from '../../fixtures/api.fixture';
import { assertJsonResponse } from '../../clients/base-api-client';
import { Todo } from '../../models/todo.model';

test.describe('Todos API', () => {
  test('GET /todos - should return 200 todos', async ({ todosApi }) => {
    const response = await todosApi.list();
    await assertJsonResponse(response, 200);

    const todos: Todo[] = await response.json();
    expect(todos).toHaveLength(200);
    expect(typeof todos[0].completed).toBe('boolean');
  });

  test('GET /todos?userId=1 - should filter by user', async ({ todosApi }) => {
    const response = await todosApi.listByUserId(1);
    await assertJsonResponse(response, 200);

    const todos: Todo[] = await response.json();
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.every((todo) => todo.userId === 1)).toBe(true);
  });

  test('GET /todos/1 - should return a single todo', async ({ todosApi }) => {
    const response = await todosApi.getById(1);
    await assertJsonResponse(response, 200);

    const todo: Todo = await response.json();
    expect(todo.id).toBe(1);
    expect(todo.userId).toBe(1);
    expect(todo.title).toBeTruthy();
  });

  test('POST /todos - should create a todo', async ({ todosApi }) => {
    const response = await todosApi.create({
      userId: 1,
      title: 'Learn Playwright API testing',
      completed: false,
    });
    await assertJsonResponse(response, 201);

    const body: Todo = await response.json();
    expect(body.id).toBe(201);
    expect(body.completed).toBe(false);
  });

  test('PATCH /todos/1 - should mark todo completed', async ({ todosApi }) => {
    const response = await todosApi.update(1, { completed: true });
    await assertJsonResponse(response, 200);

    const body: Todo = await response.json();
    expect(body.id).toBe(1);
    expect(body.completed).toBe(true);
  });
});
