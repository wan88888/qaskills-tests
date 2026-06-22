#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 scripts/generate-test-plan.py

rm -rf reports/smoke-html results/smoke.jtl

echo "=== JMeter Smoke Test ==="
jmeter -n \
  -t test-plans/smoke-test.jmx \
  -l results/smoke.jtl \
  -j results/smoke.log \
  -e -o reports/smoke-html

echo "Smoke complete. Report: reports/smoke-html/index.html"
