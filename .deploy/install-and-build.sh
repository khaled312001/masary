#!/usr/bin/env bash
set -e

APP="$HOME/domains/masaary.com/nodejs"
NODE_BIN="/opt/alt/alt-nodejs22/root/bin"
export PATH="$NODE_BIN:$PATH"

cd "$APP"

echo ">>> node/npm version"
node -v; npm -v

echo ""
echo ">>> Step 1: install root deps (express, dotenv, prisma client, etc.)"
npm install --no-audit --no-fund --omit=dev --loglevel=error

echo ""
echo ">>> Step 2: install backend deps (so tsc + prisma have everything)"
cd "$APP/backend"
npm install --no-audit --no-fund --loglevel=error

echo ""
echo ">>> Step 3: generate Prisma client (Linux binary)"
npx prisma generate

echo ""
echo ">>> Step 4: compile backend TypeScript"
npx tsc

echo ""
echo ">>> Step 5: push schema to MySQL (pull DATABASE_URL safely without sourcing)"
DATABASE_URL="$(awk -F= '/^DATABASE_URL=/{ sub(/^DATABASE_URL=/,""); print; exit }' "$APP/.env")"
export DATABASE_URL
npx prisma db push --accept-data-loss

cd "$APP"
echo ""
echo ">>> Step 6: dist sanity check"
ls -la backend/dist/ | head -10

echo ""
echo ">>> Step 7: restart Passenger"
mkdir -p tmp
touch tmp/restart.txt
echo "restart.txt touched at $(date)"

echo ""
echo ">>> done"
