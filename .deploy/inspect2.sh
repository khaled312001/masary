#!/usr/bin/env bash
set +e

echo "=== Node Selector status ==="
selectorctl --interpreter=nodejs --list-domains 2>&1 | head -40

echo ""
echo "=== current ~/.bashrc + paths ==="
cat "$HOME/.bashrc" 2>/dev/null
echo "---"
echo "PATH=$PATH"

echo ""
echo "=== nodejs/.builds dir ==="
ls -la "$HOME/domains/masaary.com/nodejs/.builds" 2>/dev/null
ls -la "$HOME/domains/masaary.com/nodejs/.builds"/* 2>/dev/null | head -50

echo ""
echo "=== public_html/.htaccess (existing) ==="
cat "$HOME/domains/masaary.com/public_html/.htaccess" 2>/dev/null

echo ""
echo "=== try alt-nodejs22 ==="
/opt/alt/alt-nodejs22/root/bin/node -v 2>&1
/opt/alt/alt-nodejs22/root/bin/npm -v 2>&1

echo ""
echo "=== test DB connection ==="
/usr/bin/mysql -h 127.0.0.1 -u u352429374_masaary -p"2D9Ut3+RPo|d" u352429374_masaary -e "SELECT VERSION();" 2>&1 | head -5

echo ""
echo "=== try external DB host ==="
/usr/bin/mysql -h srv1421.hstgr.io -u u352429374_masaary -p"2D9Ut3+RPo|d" u352429374_masaary -e "SELECT VERSION();" 2>&1 | head -5
