#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/noemdeulida-snow-war.zip
python3 tools/build_zip.py
echo "Created dist/noemdeulida-snow-war.zip"
