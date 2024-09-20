#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

set -e

TIMEOUT=15
QUIET=0
HOST=$1
shift
PORT=$1
shift

while ! timeout 1 bash -c "echo > /dev/tcp/$HOST/$PORT"; do
  sleep 1
  echo "Waiting for $HOST:$PORT..."
done

exec "$@"