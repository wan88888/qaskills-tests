import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const collectionsDir = path.join(root, 'postman', 'collections');

const commonTests200 = [
  "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
  "pm.test('Content-Type is JSON', function () { pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json'); });",
  "pm.test('Response time is acceptable', function () { var threshold = parseInt(pm.environment.get('responseTimeThreshold') || '5000'); pm.expect(pm.response.responseTime).to.be.below(threshold); });",
];

function request(name, method, urlPath, body, tests, prerequest) {
  const item = {
    name,
    request: {
      method,
      header: [{ key: 'Content-Type', value: 'application/json' }],
      url: `{{baseUrl}}${urlPath}`,
    },
    event: [],
  };
  if (body) {
    item.request.body = { mode: 'raw', raw: JSON.stringify(body, null, 2) };
  }
  if (prerequest?.length) {
    item.event.push({ listen: 'prerequest', script: { type: 'text/javascript', exec: prerequest } });
  }
  if (tests?.length) {
    item.event.push({ listen: 'test', script: { type: 'text/javascript', exec: tests } });
  }
  return item;
}

function folder(name, items) {
  return { name, item: items };
}

const smoke = [
  request('GET /posts - collection smoke', 'GET', '/posts', null, [...commonTests200, "pm.test('Returns 100 posts', function () { pm.expect(pm.response.json()).to.have.lengthOf(100); });"]),
  request('GET /comments - collection smoke', 'GET', '/comments', null, [...commonTests200, "pm.test('Returns 500 comments', function () { pm.expect(pm.response.json()).to.have.lengthOf(500); });"]),
  request('GET /todos - collection smoke', 'GET', '/todos', null, [...commonTests200, "pm.test('Returns 200 todos', function () { pm.expect(pm.response.json()).to.have.lengthOf(200); });"]),
  request('GET /users - collection smoke', 'GET', '/users', null, [...commonTests200, "pm.test('Returns 10 users', function () { pm.expect(pm.response.json()).to.have.lengthOf(10); });"]),
  request('GET /albums - collection smoke', 'GET', '/albums', null, [...commonTests200, "pm.test('Returns 100 albums', function () { pm.expect(pm.response.json()).to.have.lengthOf(100); });"]),
  request('GET /photos - collection smoke', 'GET', '/photos', null, [...commonTests200, "pm.test('Returns 5000 photos', function () { pm.expect(pm.response.json()).to.have.lengthOf(5000); });"]),
];

const posts = [
  request('GET /posts/1', 'GET', '/posts/1', null, [...commonTests200, "const json = pm.response.json();", "pm.test('Post has required fields', function () { pm.expect(json).to.have.property('id', 1); pm.expect(json).to.have.property('title'); pm.expect(json).to.have.property('body'); });"]),
  request('GET /posts/1/comments', 'GET', '/posts/1/comments', null, [...commonTests200, "pm.test('Comments belong to post 1', function () { pm.response.json().forEach(function (c) { pm.expect(c.postId).to.eql(1); }); });"]),
  request('GET /posts/9999 - not found', 'GET', '/posts/9999', null, ["pm.test('Status code is 404', function () { pm.response.to.have.status(404); });"]),
  request('POST /posts - create', 'POST', '/posts', { title: 'Postman API test post', body: 'Created via Newman', userId: 1 }, ["pm.test('Status code is 201', function () { pm.response.to.have.status(201); });", "const json = pm.response.json();", "pm.test('Created post has id 101', function () { pm.expect(json.id).to.eql(101); pm.expect(json.title).to.eql('Postman API test post'); });", "pm.test('Save created post id', function () { pm.environment.set('createdPostId', json.id); pm.environment.set('createdPostTitle', json.title); });"], ["const timestamp = Date.now();", "pm.variables.set('requestId', pm.variables.replaceIn('{{$guid}}'));", "pm.variables.set('uniqueTitle', 'Postman post ' + timestamp);"]),
  request('PUT /posts/1 - replace', 'PUT', '/posts/1', { title: 'Replaced title', body: 'Replaced body', userId: 1 }, ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });", "pm.test('Post replaced', function () { const json = pm.response.json(); pm.expect(json.id).to.eql(1); pm.expect(json.title).to.eql('Replaced title'); });"]),
  request('PATCH /posts/1 - partial update', 'PATCH', '/posts/1', { title: 'Patched via Postman' }, ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });", "pm.test('Title patched', function () { pm.expect(pm.response.json().title).to.eql('Patched via Postman'); });"]),
  request('DELETE /posts/1', 'DELETE', '/posts/1', null, ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"]),
];

const dataDriven = [
  request('POST /posts - CSV data driven', 'POST', '/posts', null, [
    "pm.test('Status from CSV', function () { pm.response.to.have.status(parseInt(pm.iterationData.get('expectedStatus'), 10)); });",
    "pm.test('Created post matches CSV title', function () { pm.expect(pm.response.json().title).to.eql(pm.iterationData.get('postTitle')); });",
  ], [
    'const payload = {',
    "  title: pm.iterationData.get('postTitle'),",
    "  body: pm.iterationData.get('postBody'),",
    "  userId: parseInt(pm.iterationData.get('userId'), 10)",
    '};',
    'pm.request.body = { mode: "raw", raw: JSON.stringify(payload) };',
  ]),
];

const comments = [
  request('GET /comments?postId=1', 'GET', '/comments?postId=1', null, [...commonTests200, "pm.test('Filtered comments for post 1', function () { pm.response.json().forEach(function (c) { pm.expect(c.postId).to.eql(1); }); });"]),
  request('GET /comments/1', 'GET', '/comments/1', null, [...commonTests200, "pm.test('Comment id is 1', function () { pm.expect(pm.response.json().id).to.eql(1); });"]),
  request('POST /comments - create', 'POST', '/comments', { postId: 1, name: 'API Tester', email: 'tester@example.com', body: 'Comment from Postman' }, ["pm.test('Status code is 201', function () { pm.response.to.have.status(201); });", "pm.test('Comment created', function () { const json = pm.response.json(); pm.expect(json.id).to.eql(501); pm.expect(json.email).to.eql('tester@example.com'); });"]),
];

const todos = [
  request('GET /todos?userId=1', 'GET', '/todos?userId=1', null, [...commonTests200, "pm.test('Todos belong to user 1', function () { pm.response.json().forEach(function (t) { pm.expect(t.userId).to.eql(1); }); });"]),
  request('GET /todos/1', 'GET', '/todos/1', null, [...commonTests200, "pm.test('Todo id is 1', function () { pm.expect(pm.response.json().id).to.eql(1); });"]),
  request('POST /todos - create', 'POST', '/todos', { userId: 1, title: 'Learn Postman API testing', completed: false }, ["pm.test('Status code is 201', function () { pm.response.to.have.status(201); });", "pm.test('Todo created', function () { const json = pm.response.json(); pm.expect(json.id).to.eql(201); pm.expect(json.completed).to.eql(false); });"]),
  request('PATCH /todos/1 - complete', 'PATCH', '/todos/1', { completed: true }, ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });", "pm.test('Todo marked completed', function () { pm.expect(pm.response.json().completed).to.eql(true); });"]),
];

const users = [
  request('GET /users/1', 'GET', '/users/1', null, [...commonTests200, "pm.test('User profile fields', function () { const u = pm.response.json(); pm.expect(u.username).to.eql('Bret'); pm.expect(u.address.city).to.be.a('string'); pm.expect(u.company.name).to.be.a('string'); });"]),
  request('GET /users/1/posts', 'GET', '/users/1/posts', null, [...commonTests200, "pm.test('User posts relation', function () { pm.response.json().forEach(function (p) { pm.expect(p.userId).to.eql(1); }); });"]),
  request('GET /users/1/todos', 'GET', '/users/1/todos', null, [...commonTests200, "pm.test('User todos relation', function () { pm.response.json().forEach(function (t) { pm.expect(t.userId).to.eql(1); }); });"]),
  request('GET /users/1/albums', 'GET', '/users/1/albums', null, [...commonTests200, "pm.test('User albums relation', function () { pm.response.json().forEach(function (a) { pm.expect(a.userId).to.eql(1); }); });"]),
];

const mainCollection = {
  info: {
    _postman_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'JSONPlaceholder API',
    description: 'Core REST API tests for JSONPlaceholder using Postman test scripts and Newman.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  event: [{
    listen: 'prerequest',
    script: {
      type: 'text/javascript',
      exec: [
        "if (!pm.variables.get('requestId')) {",
        "  pm.variables.set('requestId', pm.variables.replaceIn('{{$guid}}'));",
        '}',
      ],
    },
  }],
  item: [folder('Smoke', smoke), folder('Posts', posts), folder('Comments', comments), folder('Todos', todos), folder('Users', users), folder('Data Driven', dataDriven)],
  variable: [{ key: 'baseUrl', value: 'https://jsonplaceholder.typicode.com' }],
};

const workflowCollection = {
  info: {
    name: 'JSONPlaceholder Workflows',
    description: 'E2E workflow with variable chaining across requests.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [{
    name: 'Post CRUD Workflow',
    item: [
      request('Step 1 - Create Post', 'POST', '/posts', { title: 'Workflow post', body: 'Chained via pm.environment.set', userId: 1 }, ["pm.test('Created', function () { pm.response.to.have.status(201); });", "const json = pm.response.json();", "pm.environment.set('createdPostId', json.id);", "pm.environment.set('createdPostTitle', json.title);"]),
      request('Step 2 - Read Post 1', 'GET', '/posts/1', null, ["pm.test('Readable post', function () { pm.response.to.have.status(200); pm.expect(pm.response.json().id).to.eql(1); });"]),
      request('Step 3 - Patch Post', 'PATCH', '/posts/1', { title: '{{updatedPostTitle}}' }, ["pm.test('Patched', function () { pm.response.to.have.status(200); });", "pm.environment.set('updatedTitle', pm.response.json().title);"]),
      request('Step 4 - Verify chained title', 'GET', '/posts/1', null, ["pm.test('Stored title from workflow', function () { pm.expect(pm.environment.get('updatedTitle')).to.eql(pm.environment.get('updatedPostTitle')); });"]),
      request('Step 5 - Delete Post', 'DELETE', '/posts/1', null, ["pm.test('Deleted', function () { pm.response.to.have.status(200); });"]),
    ],
  }],
};

fs.mkdirSync(collectionsDir, { recursive: true });
fs.writeFileSync(path.join(collectionsDir, 'jsonplaceholder-api.postman_collection.json'), JSON.stringify(mainCollection, null, 2));
fs.writeFileSync(path.join(collectionsDir, 'jsonplaceholder-workflows.postman_collection.json'), JSON.stringify(workflowCollection, null, 2));
console.log('Generated collections in', collectionsDir);
