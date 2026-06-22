export const smokeThresholds = {
  http_req_duration: ['p(95)<3000', 'p(99)<5000'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.99'],
};

export const loadThresholds = {
  http_req_duration: ['p(95)<800', 'p(99)<2500'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.99'],
  errors: ['rate<0.01'],
};

export const stressThresholds = {
  http_req_duration: ['p(95)<1500', 'p(99)<3000'],
  http_req_failed: ['rate<0.05'],
  checks: ['rate>0.95'],
  errors: ['rate<0.05'],
};
