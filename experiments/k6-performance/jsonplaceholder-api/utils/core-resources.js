import { check } from 'k6';
import { CORE_RESOURCES } from '../config/resources.js';
import { BASE_URL, DEFAULT_HEADERS } from '../config/environments.js';

export function hitCoreResources(http, onResult = () => {}) {
  let allOk = true;

  for (const resource of CORE_RESOURCES) {
    const response = http.get(`${BASE_URL}${resource.path}`, {
      headers: DEFAULT_HEADERS,
      tags: { name: `GET ${resource.path}` },
    });

    const ok = check(response, {
      [`GET ${resource.path} status 200`]: (r) => r.status === 200,
      [`GET ${resource.path} count`]: (r) => {
        try {
          return Array.isArray(r.json()) && r.json().length === resource.count;
        } catch {
          return false;
        }
      },
    });

    onResult(resource.path, ok, response);
    if (!ok) allOk = false;
  }

  return allOk;
}
