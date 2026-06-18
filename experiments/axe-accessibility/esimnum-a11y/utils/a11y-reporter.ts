import { AxeResults, Result } from 'axe-core';
import * as fs from 'fs';
import * as path from 'path';

export function formatViolations(violations: Result[]): string {
  if (violations.length === 0) return 'No accessibility violations found.';

  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => {
          return `  - Element: ${node.html}\n    Target: ${node.target.join(', ')}\n    Fix: ${node.failureSummary}`;
        })
        .join('\n');

      return `
Rule: ${violation.id}
Impact: ${violation.impact}
Description: ${violation.description}
Help: ${violation.helpUrl}
Affected elements (${violation.nodes.length}):
${nodes}`;
    })
    .join('\n---\n');
}

export function summarizeResults(results: AxeResults) {
  const byImpact = {
    critical: results.violations.filter((v) => v.impact === 'critical'),
    serious: results.violations.filter((v) => v.impact === 'serious'),
    moderate: results.violations.filter((v) => v.impact === 'moderate'),
    minor: results.violations.filter((v) => v.impact === 'minor'),
  };

  return {
    url: results.url,
    timestamp: results.timestamp,
    totalViolations: results.violations.length,
    totalIncomplete: results.incomplete.length,
    totalPasses: results.passes.length,
    byImpact: {
      critical: byImpact.critical.length,
      serious: byImpact.serious.length,
      moderate: byImpact.moderate.length,
      minor: byImpact.minor.length,
    },
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
      nodes: v.nodes.slice(0, 5).map((n) => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    })),
    incomplete: results.incomplete.map((i) => ({
      id: i.id,
      impact: i.impact,
      description: i.description,
      help: i.help,
      nodeCount: i.nodes.length,
    })),
  };
}

export function writeReport(results: AxeResults, outputPath: string) {
  const summary = summarizeResults(results);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  return summary;
}
