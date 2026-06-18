import * as fs from 'fs';
import * as path from 'path';

export type Finding = {
  owasp: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  detail: string;
  evidence?: string;
  passed?: boolean;
};

const findings: Finding[] = [];

export function recordFinding(finding: Finding) {
  findings.push(finding);
}

export function writeSecurityReport(outputDir = 'test-results') {
  fs.mkdirSync(outputDir, { recursive: true });

  const failed = findings.filter((f) => f.passed === false);
  const passed = findings.filter((f) => f.passed === true);

  const summary = {
    target: process.env.BASE_URL || 'https://esimnum.com',
    timestamp: new Date().toISOString(),
    totalFindings: findings.length,
    issues: failed.length,
    passedChecks: passed.length,
    bySeverity: {
      critical: failed.filter((f) => f.severity === 'critical').length,
      high: failed.filter((f) => f.severity === 'high').length,
      medium: failed.filter((f) => f.severity === 'medium').length,
      low: failed.filter((f) => f.severity === 'low').length,
      info: failed.filter((f) => f.severity === 'info').length,
    },
    findings,
  };

  fs.writeFileSync(path.join(outputDir, 'security-report.json'), JSON.stringify(summary, null, 2));

  const md = [
    '# eSIMNum Security Scan Report',
    '',
    `**Target:** ${summary.target}`,
    `**Time:** ${summary.timestamp}`,
    `**Issues:** ${summary.issues} | **Passed:** ${summary.passedChecks}`,
    '',
    '## Findings',
    '',
    ...failed.map(
      (f) =>
        `### [${f.severity.toUpperCase()}] ${f.title}\n- **OWASP:** ${f.owasp}\n- ${f.detail}${f.evidence ? `\n- **Evidence:** ${f.evidence}` : ''}\n`
    ),
    '',
    '## Passed Checks',
    '',
    ...passed.map((f) => `- ${f.title}`),
  ].join('\n');

  fs.writeFileSync(path.join(outputDir, 'security-report.md'), md);
  return summary;
}

export function resetFindings() {
  findings.length = 0;
}
