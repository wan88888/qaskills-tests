export const BASE_URL = process.env.BASE_URL || 'https://esimnum.com';

export const SECURITY_HEADERS = {
  required: ['strict-transport-security', 'x-content-type-options', 'x-frame-options'],
  recommended: [
    'content-security-policy',
    'referrer-policy',
    'permissions-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
  ],
};

export const SENSITIVE_PATHS = [
  '/.env',
  '/.git/config',
  '/debug',
  '/actuator',
  '/actuator/env',
  '/api/debug',
  '/phpinfo.php',
  '/wp-admin',
  '/server-status',
  '/.well-known/security.txt',
  '/admin',
  '/api/admin',
];

export const PUBLIC_PAGES = ['/', '/destinations', '/help', '/sign-in', '/privacy-policy'];
