#!/usr/bin/env bash
# Wrapper that delegates to sync-github-repos-and-indexnow.sh
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/sync-github-repos-and-indexnow.sh" "$@"
