/** 每种资源类型保留一个代表性接口（列表 GET），与 playwright-api smoke 对齐 */
export const CORE_RESOURCES = [
  { path: '/posts', count: 100 },
  { path: '/comments', count: 500 },
  { path: '/albums', count: 100 },
  { path: '/photos', count: 5000 },
  { path: '/todos', count: 200 },
  { path: '/users', count: 10 },
];
