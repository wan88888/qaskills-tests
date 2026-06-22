import http from 'k6/http';
import { sleep } from 'k6';
import { smokeThresholds } from '../config/thresholds.js';
import { hitCoreResources } from '../utils/core-resources.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: smokeThresholds,
};

export default function () {
  hitCoreResources(http);
  sleep(1);
}
