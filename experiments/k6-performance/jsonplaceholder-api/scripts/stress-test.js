import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { BASE_URL, DEFAULT_HEADERS } from '../config/environments.js';
import { CORE_RESOURCES } from '../config/resources.js';
import { stressThresholds } from '../config/thresholds.js';
import { thinkTime } from '../utils/helpers.js';
import { check } from 'k6';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: stressThresholds,
};

export default function () {
  const batch = CORE_RESOURCES.map((resource) => [
    'GET',
    `${BASE_URL}${resource.path}`,
    null,
    { headers: DEFAULT_HEADERS, tags: { name: `GET ${resource.path}` } },
  ]);

  const responses = http.batch(batch);

  let allOk = true;
  responses.forEach((response, i) => {
    const resource = CORE_RESOURCES[i];
    const ok = check(response, {
      [`stress ${resource.path} status 200`]: (r) => r.status === 200,
      [`stress ${resource.path} count`]: (r) => r.json().length === resource.count,
    });
    if (!ok) allOk = false;
  });
  errorRate.add(!allOk);

  sleep(thinkTime(0.3, 1));
}
