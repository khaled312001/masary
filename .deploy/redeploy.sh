#!/usr/bin/env bash
set -e

APP="$HOME/domains/masaary.com/nodejs"
NODE_BIN="/opt/alt/alt-nodejs22/root/bin"
export PATH="$NODE_BIN:$PATH"

echo ">>> Step 1: extract new bundle (preserve .env, node_modules, tmp, backend/dist if you want incremental)"
cd "$APP"
# Save preserved files
cp .env /tmp/masaary.env.bak 2>/dev/null || true

# Remove app files but keep large dirs that can be reused
find . -maxdepth 1 ! -name "." ! -name ".env" ! -name "node_modules" ! -name "tmp" ! -name ".builds" ! -name "backend" ! -name "frontend" -exec rm -rf {} + 2>/dev/null || true
# Remove inside backend/frontend except node_modules
find backend -maxdepth 1 ! -name "backend" ! -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
find frontend -maxdepth 1 ! -name "frontend" ! -name "node_modules" -exec rm -rf {} + 2>/dev/null || true

tar -xzf "$HOME/bundle.tar.gz" -C "$APP"

# Restore .env if it exists in backup
[ -f /tmp/masaary.env.bak ] && cp /tmp/masaary.env.bak "$APP/.env"

cd "$APP"
echo ">>> Step 2: install root deps (incremental, adds http-proxy)"
npm install --no-audit --no-fund --omit=dev --loglevel=error

echo ">>> Step 3: re-compile backend TS"
cd backend
npm install --no-audit --no-fund --loglevel=error
npx prisma generate
npx tsc

cd "$APP"
echo ">>> Step 4: restart Passenger"
mkdir -p tmp
touch tmp/restart.txt
echo "restart triggered at $(date)"

# wait for a request to spin up
echo ">>> Step 5: tail console.log for 8s while we curl"
( sleep 1; curl -s -o /dev/null -w "spin up curl: %{http_code}\n" "http://127.0.0.1:${PORT:-3000}/api/healthz" 2>/dev/null || true ) &

ls -la "$APP/console.log" 2>/dev/null
echo ">>> done"
