#!/usr/bin/env bash
set -e

APP="$HOME/domains/masaary.com/nodejs"
NODE_BIN="/opt/alt/alt-nodejs22/root/bin"
export PATH="$NODE_BIN:$PATH"

echo ">>> step 1: full wipe (preserving .builds)"
mkdir -p "$APP"
cd "$APP"
shopt -s dotglob nullglob extglob
for f in *; do
  [ "$f" = ".builds" ] && continue
  rm -rf "$f"
done

echo ">>> step 2: extract bundle"
tar -xzf "$HOME/bundle.tar.gz" -C "$APP"
ls -la "$APP" | head -15

echo ">>> step 3: install root deps"
cd "$APP"
npm install --no-audit --no-fund --omit=dev --loglevel=error

echo ">>> step 4: install backend deps and build"
cd backend
npm install --no-audit --no-fund --loglevel=error
npx prisma generate
npx tsc

cd "$APP"
echo ">>> step 5: verify layout"
ls -la backend/dist/ | head -10
ls -la frontend/ | head -10
test -f .env && echo ".env present" || echo ".env MISSING — please re-upload"

echo ">>> step 6: restart Passenger"
mkdir -p tmp
touch tmp/restart.txt
echo "restart triggered at $(date)"
