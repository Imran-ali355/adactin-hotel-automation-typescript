#!/usr/bin/env bash
set -euo pipefail

# Jenkins can itself run in Docker: docker cp avoids host/workspace path mismatches.
build_dir=$(mktemp -d)
container=""
cleanup() {
    status=$?
    trap - EXIT
    if [ -n "$container" ]; then
        for report in allure-results playwright-report test-results; do
            mkdir -p "$report"
            docker cp "$container:/app/$report/." "$report/" >/dev/null 2>&1 || true
        done
        docker rm -f "$container" >/dev/null 2>&1 || true
    fi
    rm -rf -- "$build_dir"
    exit "$status"
}
trap cleanup EXIT

rm -rf -- allure-results playwright-report test-results
docker build --iidfile "$build_dir/image-id" .
image=$(cat "$build_dir/image-id")

container=$(docker create --ipc=host \
    -e CI=true -e BASE_URL -e ADACTIN_USERNAME -e ADACTIN_PASSWORD \
    -e BROWSER="${BROWSER:-chromium}" -e RUN_API="${RUN_API:-false}" \
    "$image" sh -c '
      npm run typecheck &&
      if [ "$RUN_API" = "true" ]; then
        npx playwright test --project="$BROWSER" --project=api
      else
        npx playwright test --project="$BROWSER"
      fi
    ')
docker start -a "$container"
exit "$(docker inspect -f '{{.State.ExitCode}}' "$container")"
