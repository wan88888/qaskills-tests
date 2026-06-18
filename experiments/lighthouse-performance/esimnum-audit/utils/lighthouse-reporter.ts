import type { Result } from 'lighthouse';
import { THRESHOLDS, type LighthouseCategory } from '../config/lighthouse-config';

export type CategoryScore = {
  id: LighthouseCategory;
  score: number;
  passed: boolean;
  threshold: number;
};

export type AuditSummary = {
  url: string;
  formFactor: 'desktop' | 'mobile';
  fetchTime: string;
  categories: CategoryScore[];
  coreWebVitals: {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    si: string;
    tti: string;
  };
  opportunities: Array<{ id: string; title: string; savings: string }>;
  diagnostics: Array<{ id: string; title: string; displayValue?: string }>;
  accessibilityIssues: Array<{ id: string; title: string; score: number | null }>;
  seoIssues: Array<{ id: string; title: string; score: number | null }>;
};

function formatMs(audit?: { displayValue?: string; numericValue?: number }) {
  if (audit?.displayValue) return audit.displayValue;
  if (audit?.numericValue != null) return `${Math.round(audit.numericValue)} ms`;
  return 'N/A';
}

function formatAuditSavings(audit?: { displayValue?: string; numericValue?: number }) {
  if (audit?.displayValue) return audit.displayValue;
  if (audit?.numericValue != null) return `${(audit.numericValue / 1000).toFixed(1)} s`;
  return 'N/A';
}

export function summarizeLighthouseReport(
  lhr: Result,
  formFactor: 'desktop' | 'mobile'
): AuditSummary {
  const categories = (Object.keys(THRESHOLDS) as LighthouseCategory[]).map((id) => {
    const score = Math.round((lhr.categories[id]?.score ?? 0) * 100);
    return {
      id,
      score,
      passed: score >= THRESHOLDS[id],
      threshold: THRESHOLDS[id],
    };
  });

  const audits = lhr.audits;

  const opportunities = Object.values(audits)
    .filter((a) => a.details?.type === 'opportunity' && (a.numericValue ?? 0) > 0)
    .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
    .slice(0, 8)
    .map((a) => ({
      id: a.id,
      title: a.title,
      savings: formatAuditSavings(a),
    }));

  const diagnostics = Object.values(audits)
    .filter((a) => a.details?.type === 'table' && a.score !== null && a.score < 1)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      title: a.title,
      displayValue: a.displayValue,
    }));

  const accessibilityIssues = Object.values(audits)
    .filter((a) => lhr.categories.accessibility?.auditRefs.some((r) => r.id === a.id))
    .filter((a) => a.score !== null && a.score < 1)
    .slice(0, 8)
    .map((a) => ({ id: a.id, title: a.title, score: a.score }));

  const seoIssues = Object.values(audits)
    .filter((a) => lhr.categories.seo?.auditRefs.some((r) => r.id === a.id))
    .filter((a) => a.score !== null && a.score < 1)
    .slice(0, 8)
    .map((a) => ({ id: a.id, title: a.title, score: a.score }));

  return {
    url: lhr.finalDisplayedUrl || lhr.requestedUrl,
    formFactor,
    fetchTime: lhr.fetchTime,
    categories,
    coreWebVitals: {
      fcp: formatMs(audits['first-contentful-paint']),
      lcp: formatMs(audits['largest-contentful-paint']),
      tbt: formatMs(audits['total-blocking-time']),
      cls: audits['cumulative-layout-shift']?.displayValue ?? 'N/A',
      si: formatMs(audits['speed-index']),
      tti: formatMs(audits['interactive']),
    },
    opportunities,
    diagnostics,
    accessibilityIssues,
    seoIssues,
  };
}

export function printSummary(summary: AuditSummary) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Lighthouse Audit — ${summary.formFactor.toUpperCase()}`);
  console.log(`URL: ${summary.url}`);
  console.log(`Time: ${summary.fetchTime}`);
  console.log('='.repeat(60));

  console.log('\nCategory Scores:');
  for (const cat of summary.categories) {
    const status = cat.passed ? 'PASS' : 'FAIL';
    console.log(`  ${cat.id.padEnd(18)} ${cat.score}/100 (threshold: ${cat.threshold}) [${status}]`);
  }

  console.log('\nCore Web Vitals:');
  console.log(`  FCP: ${summary.coreWebVitals.fcp}`);
  console.log(`  LCP: ${summary.coreWebVitals.lcp}`);
  console.log(`  TBT: ${summary.coreWebVitals.tbt}`);
  console.log(`  CLS: ${summary.coreWebVitals.cls}`);
  console.log(`  Speed Index: ${summary.coreWebVitals.si}`);
  console.log(`  TTI: ${summary.coreWebVitals.tti}`);

  if (summary.opportunities.length > 0) {
    console.log('\nTop Performance Opportunities:');
    summary.opportunities.forEach((o, i) => {
      console.log(`  ${i + 1}. ${o.title} — potential savings: ${o.savings}`);
    });
  }

  if (summary.accessibilityIssues.length > 0) {
    console.log('\nAccessibility Issues:');
    summary.accessibilityIssues.forEach((a) => {
      console.log(`  - ${a.title}`);
    });
  }

  if (summary.seoIssues.length > 0) {
    console.log('\nSEO Issues:');
    summary.seoIssues.forEach((s) => {
      console.log(`  - ${s.title}`);
    });
  }
}
