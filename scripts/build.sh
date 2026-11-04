#!/usr/bin/env bash
# Usage: HUGO=/path/to/hugo bash scripts/build.sh DESTINATION BASE_URL
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
python3 scripts/obsidian_to_hugo.py
"${HUGO:-hugo}" --minify --destination "$1" --baseURL "$2"
