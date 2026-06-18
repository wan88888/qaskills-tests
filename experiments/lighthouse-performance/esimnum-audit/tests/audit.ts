import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import type { Result } from 'lighthouse';
import { TARGET_URL, THRESHOLDS } from '../config/lighthouse-config';
import { printSummary, summarizeLighthouseReport } from '../utils/lighthouse-reporter';

const OUTPUT_DIR = path.join(process.cwd(), 'reports');

function runLighthouseCli(url: string, formFactor: 'desktop' | 'mobile') {
  const baseName = `esimnum-${formFactor}`;
  const outputPath = path.join(OUTPUT_DIR, baseName);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const preset = formFactor === 'desktop' ? '--preset=desktop' : '--preset=perf';
  const extraFlags =
    formFactor === 'mobile'
      ? '--form-factor=mobile --screenEmulation.mobile=true'
      : '--form-factor=desktop --screenEmulation.mobile=false';

  const cmd = [
    'npx lighthouse',
    `"${url}"`,
    preset,
    extraFlags,
    '--output=json',
    '--output=html',
    `--output-path="${outputPath}"`,
    '--quiet',
    '--chrome-flags="--headless --no-sandbox --disable-gpu"',
    '--only-categories=performance,accessibility,best-practices,seo',
  ].join(' ');

  console.log(`\nRunning ${formFactor} audit...`);
  execSync(cmd, { stdio: 'inherit', timeout: 180_000 });

  const jsonPath = `${outputPath}.report.json`;
  const htmlPath = `${outputPath}.report.html`;

  if (fs.existsSync(jsonPath)) {
    fs.renameSync(jsonPath, path.join(OUTPUT_DIR, `${baseName}.json`));
  }
  if (fs.existsSync(htmlPath)) {
    fs.renameSync(htmlPath, path.join(OUTPUT_DIR, `${baseName}.html`));
  }

  const reportJson = path.join(OUTPUT_DIR, `${baseName}.json`);
  const lhr = JSON.parse(fs.readFileSync(reportJson, 'utf-8')) as Result;
  const summary = summarizeLighthouseReport(lhr, formFactor);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${baseName}-summary.json`),
    JSON.stringify(summary, null, 2)
  );

  printSummary(summary);
  return summary;
}

async function main() {
  const args = process.argv.slice(2);
  const formFactorArg = args.find((a) => a.startsWith('--form-factor='));
  const formFactor = formFactorArg?.split('=')[1] as 'desktop' | 'mobile' | undefined;

  const targets: ('desktop' | 'mobile')[] =
    formFactor === 'desktop' || formFactor === 'mobile' ? [formFactor] : ['desktop', 'mobile'];

  console.log(`\nAuditing ${TARGET_URL} with Lighthouse CLI...`);
  const summaries = targets.map((factor) => runLighthouseCli(TARGET_URL, factor));

  const allPassed = summaries.every((s) => s.categories.every((c) => c.passed));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'combined-summary.json'),
    JSON.stringify({ url: TARGET_URL, thresholds: THRESHOLDS, results: summaries, allPassed }, null, 2)
  );

  console.log(`\nReports saved to: ${OUTPUT_DIR}`);
  console.log(allPassed ? '\nAll thresholds PASSED.' : '\nSome thresholds FAILED.');

  if (!allPassed) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Lighthouse audit failed:', err);
  process.exit(1);
});
