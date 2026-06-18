export const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '"><svg/onload=alert(1)>',
  "javascript:alert('XSS')",
];

export const SQLI_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "1' UNION SELECT null--",
];

export const PATH_TRAVERSAL_PAYLOADS = [
  '../../../etc/passwd',
  '%2e%2e%2fetc%2fpasswd',
  '....//....//etc/passwd',
];

export const SQL_ERROR_PATTERNS = [
  'SQL syntax',
  'mysql_',
  'ORA-',
  'PostgreSQL',
  'sqlite3',
  'Unclosed quotation mark',
];
