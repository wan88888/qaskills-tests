#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

ENV="postman/environments/jsonplaceholder.postman_environment.json"
COLLECTION="postman/collections/jsonplaceholder-api.postman_collection.json"
WORKFLOW="postman/collections/jsonplaceholder-workflows.postman_collection.json"

mkdir -p test-results

echo "==> Running JSONPlaceholder API collection"
newman run "$COLLECTION" \
  -e "$ENV" \
  --folder "Smoke" \
  --folder "Posts" \
  --folder "Comments" \
  --folder "Todos" \
  --folder "Users" \
  -r cli,json \
  --reporter-json-export test-results/api-results.json \
  --timeout-request 15000

echo "==> Running workflow collection"
newman run "$WORKFLOW" \
  -e "$ENV" \
  -r cli,json \
  --reporter-json-export test-results/workflow-results.json \
  --timeout-request 15000

echo "==> Running CSV data-driven POST /posts"
newman run "$COLLECTION" \
  -e "$ENV" \
  --folder "Data Driven" \
  -d postman/data/posts-create.csv \
  -r cli \
  --timeout-request 15000

echo "All Postman/Newman runs completed."
