#!/usr/bin/env bash
# Environment inventory
set +e
echo "=== HOME ==="
echo "$HOME"
ls -la "$HOME" | head -30

echo ""
echo "=== domains dir ==="
ls -la "$HOME/domains" 2>/dev/null | head -40

echo ""
echo "=== node versions ==="
which node || echo "no system node"
node -v 2>/dev/null || echo "no node default"
ls /opt/alt/ 2>/dev/null | grep -i node | head -20
ls /usr/local/bin/ 2>/dev/null | grep -i node | head -10
type alt-nodejs* 2>/dev/null

echo ""
echo "=== package managers ==="
which npm 2>/dev/null && npm -v
which yarn 2>/dev/null
which pnpm 2>/dev/null
which pm2 2>/dev/null
which git 2>/dev/null && git --version
which mysql 2>/dev/null && mysql --version

echo ""
echo "=== web server ==="
ps auxf 2>/dev/null | grep -iE "nginx|apache|lite|passenger|nodejs" | head -20

echo ""
echo "=== resource limits ==="
ulimit -a 2>/dev/null | head -10

echo ""
echo "=== current cron ==="
crontab -l 2>/dev/null || echo "no crontab"

echo ""
echo "=== existing public_html for masaary ==="
ls -la "$HOME/domains/masaary.com" 2>/dev/null | head -20
ls -la "$HOME/domains/masaary.com/public_html" 2>/dev/null | head -20

echo ""
echo "=== disk space ==="
df -h "$HOME" 2>/dev/null

echo ""
echo "=== node-selector (Hostinger) ==="
ls /opt/cpanel/ 2>/dev/null
which cloudlinux-selector 2>/dev/null
which selectorctl 2>/dev/null

echo ""
echo "=== port range usable (informational) ==="
echo "user can typically bind only to high ports via passenger"
