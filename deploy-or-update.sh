#!/usr/bin/env bash
# ==============================================================================
# deploy-or-update.sh — SendPut AI (SignalForge 3.0) Deploy & Automation Script
# Connects to sendput.com routing, Render/VPS, and vault_app_angelburgosrosado
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=== [1/5] Checking Workspace Files ==="
if [ -f "sendput-ai-signalforge3-fullstack.zip" ] && [ ! -f "src/server.ts" ]; then
    echo "Unpacking fullstack archive..."
    unzip -q -o sendput-ai-signalforge3-fullstack.zip
    if [ -d "sendput-ai-signalforge-3" ]; then
        cp -R sendput-ai-signalforge-3/* .
        rm -rf sendput-ai-signalforge-3
    fi
fi

echo "=== [2/5] Packaging WordPress / Elementor Plugin ==="
mkdir -p public/downloads
if [ -f "wordpress-plugin/sendput-ai-presence.php" ]; then
    (cd wordpress-plugin && zip -q -r ../public/downloads/sendput-ai-presence-plugin.zip sendput-ai-presence.php)
    echo "Generated public/downloads/sendput-ai-presence-plugin.zip successfully."
fi

echo "=== [3/5] Installing Dependencies ==="
npm install

echo "=== [4/5] Building CommonJS Production Bundle (dist/server.cjs) ==="
npm run build

echo "=== [5/5] Database Migration Check ==="
if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "placeholder" ] && command -v psql >/dev/null 2>&1; then
    echo "Executing PostgreSQL schema migration (sql/sendput_schema.sql)..."
    psql "$DATABASE_URL" -f sql/sendput_schema.sql || echo "Warning: Migration returned non-zero code, server self-healing shield will manage fallback."
else
    echo "No direct psql / active DATABASE_URL provided. Self-healing stateful memory shield will handle database operations."
fi

echo "=== SendPut AI (SignalForge 3.0) Build Ready ==="
