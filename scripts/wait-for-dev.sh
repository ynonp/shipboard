#!/usr/bin/env bash
set -u

url=${1:-http://127.0.0.1:3000/}
timeout=${2:-60}
deadline=$((SECONDS + timeout))
consecutive=0

while :; do
  if response=$(curl --silent --show-error --max-time 3 --output /dev/null --write-out '%{http_code}' "$url" 2>&1) && [[ $response == 200 ]]; then
    consecutive=$((consecutive + 1))
    if (( consecutive == 2 )); then
      printf 'Shipboard is ready at %s\n' "$url"
      exit 0
    fi
  else
    consecutive=0
  fi

  if (( SECONDS >= deadline )); then
    printf 'Timed out waiting for consecutive HTTP 200 responses from %s. Last curl result: %s\n' "$url" "$response" >&2
    exit 1
  fi

  sleep 1
done
