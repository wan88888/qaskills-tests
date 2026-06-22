#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 scripts/generate-test-plan.py

rm -rf reports/load-html results/load.jtl

echo "=== JMeter Load Test ==="
jmeter -n \
  -t test-plans/load-test.jmx \
  -l results/load.jtl \
  -j results/load.log \
  -e -o reports/load-html

echo "Load complete. Report: reports/load-html/index.html"
