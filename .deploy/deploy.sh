#!/usr/bin/env bash
# Server-side deploy script. Run after sources are uploaded.
set -euo pipefail

APP_ROOT="$HOME/domains/masaary.com/nodejs"
NODE_BIN="/opt/alt/alt-nodejs22/root/bin"
export PATH="$NODE_BIN:$PATH"

echo ">>> step 0: confirm Node version"
node -v
npm -v

cd "$APP_ROOT"

echo ">>> step 1: install unified deps (in $APP_ROOT)"
npm install --no-audit --no-fund --omit=dev

echo ">>> step 2: install frontend deps (Next.js standalone uses its own bundled node_modules,"
echo "    but we still need to install dev deps at build time — done locally before upload)"

echo ">>> step 3: generate Prisma client against actual MySQL"
cd "$APP_ROOT/backend"
"$NODE_BIN/npx" prisma generate
echo ">>> step 4: push schema (creates/updates tables non-destructively)"
"$NODE_BIN/npx" prisma db push --accept-data-loss
echo ">>> step 5: seed reference data if empty"
SEED_NEEDED=$("$NODE_BIN/node" -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.skill.count().then(c => { console.log(c); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });
")
echo "skills currently in DB: $SEED_NEEDED"
if [ "$SEED_NEEDED" -lt 50 ]; then
  echo "seeding..."
  "$NODE_BIN/npx" tsx prisma/seed.ts || echo "seed failed (continuing)"
else
  echo "skipping seed (DB already populated)"
fi

cd "$APP_ROOT"

echo ">>> step 6: restart Passenger"
mkdir -p tmp
touch tmp/restart.txt
echo "Passenger will restart on next request."

echo ">>> done"
