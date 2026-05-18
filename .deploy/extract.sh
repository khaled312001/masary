#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="$HOME/domains/masaary.com/nodejs"
echo ">>> clearing previous nodejs dir contents (keeping .builds)"
mkdir -p "$APP_ROOT"
cd "$APP_ROOT"
# Preserve Hostinger-managed .builds directory but remove our old files.
shopt -s extglob 2>/dev/null || true
find . -maxdepth 1 ! -name "." ! -name ".builds" ! -name "tmp" -exec rm -rf {} + 2>/dev/null || true

echo ">>> extracting bundle"
tar -xzf "$HOME/bundle.tar.gz" -C "$APP_ROOT"

echo ">>> top-level contents:"
ls -la "$APP_ROOT" | head -20

echo ">>> done extract"
