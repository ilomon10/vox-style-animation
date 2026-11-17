#!/usr/bin/env bash
# Portable `flock <lockfile> <command…>`: run the command while holding an exclusive lock on <lockfile>.
# Linux uses flock(1); macOS (no flock) holds an fcntl lock from Python for the command's lifetime.
#   tools/lock.sh out/.render.lock npx remotion render …
#   tools/lock.sh out/.render.lock true          # just wait until whoever holds the lock is done
set -euo pipefail
[ $# -ge 2 ] || { echo "usage: $0 <lockfile> <command> [args…]" >&2; exit 2; }
lock="$1"; shift
mkdir -p "$(dirname "$lock")"
if command -v flock >/dev/null 2>&1; then exec flock "$lock" "$@"; fi
exec python3 -c 'import fcntl, os, subprocess, sys
fd = os.open(sys.argv[1], os.O_RDWR | os.O_CREAT, 0o644)
fcntl.flock(fd, fcntl.LOCK_EX)
sys.exit(subprocess.call(sys.argv[2:]))' "$lock" "$@"
