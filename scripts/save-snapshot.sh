#!/usr/bin/env bash
set -euo pipefail
OUTPUT="arc-athena-snapshot.tar.gz"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
# Create archive with top-level files and directories relevant to the app
# Exclude node_modules and git metadata for a clean snapshot
FILES_TO_INCLUDE=(
  "index.html"
  "README.md"
  "SAVING.md"
  "server.js"
  "patterns.json"
  "render.yaml"
  "package.json"
  "package-lock.json"
)
# Include any other top-level directories except node_modules and .git
for item in *; do
  if [[ -d "$item" && "$item" != "node_modules" && "$item" != ".git" && "$item" != "scripts" ]]; then
    FILES_TO_INCLUDE+=("$item")
  fi
done
# Create the archive
rm -f "$OUTPUT"
tar -czf "$OUTPUT" "${FILES_TO_INCLUDE[@]}"
printf "Saved snapshot to %s\n" "$OUTPUT"
