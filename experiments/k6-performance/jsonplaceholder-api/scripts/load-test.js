import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { loadThresholds } from '../config/thresholds.js';
import { hitCoreResources } from '../utils/core-resources.js';
import { thinkTime } from '../utils/helpers.js';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: loadThresholds,
};

export default function () {
  hitCoreResources(http, (_path, resourceOk) => {
    errorRate.add(!resourceOk);
  });
  sleep(thinkTime(0.5, 1.5));
}
