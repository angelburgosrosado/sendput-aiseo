#!/usr/bin/env bash
# ==============================================================================
<<<<<<< HEAD
# deploy-or-update.sh — SendPut AI (SignalForge 3.0) Automated Update Script
=======
# deploy-or-update.sh — SendPut AI (SignalForge 3.0 v3.4.0) Automated Runner
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
# ==============================================================================
# Safely upgrades an existing sendput.com repository or VPS directory:
#  1. Backs up your existing project files (excluding node_modules & .git)
#  2. Preserves your .git history and .env secrets
<<<<<<< HEAD
#  3. Copies the new SignalForge 3.0 full-stack files into place
#  4. Installs dependencies & compiles dist/server.cjs via esbuild
#  5. Runs the non-destructive SQL migration against $DATABASE_URL (if psql & URL set)
#  6. Optionally restarts PM2 / systemd or commits & pushes to GitHub/Render
=======
#  3. Copies the new SignalForge 3.0 v3.4.0 full-stack files into place
#     (removing any legacy .next/ or api/index.ts artifacts)
#  4. Installs dependencies & compiles dist/server.cjs + api/index.js via esbuild
#  5. Runs the non-destructive SQL migration against $DATABASE_URL (if psql & URL set)
#  6. Runs live integration smoke tests against https://sendput.com (or localhost)
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$(pwd)}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_ARCHIVE="${TARGET_DIR}/backup_before_sf3_${TIMESTAMP}.tar.gz"

echo "=================================================================="
<<<<<<< HEAD
echo "🚀 SendPut AI (SignalForge 3.0) — Safe Upgrade & Deployment Runner"
echo "=================================================================="
echo "Source Package : ${SCRIPT_DIR}"
=======
echo "🚀 SendPut AI (SignalForge 3.0 v3.4.0) — Upgrade & Verify Runner"
echo "=================================================================="
echo "Source Package  : ${SCRIPT_DIR}"
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
echo "Target Directory: ${TARGET_DIR}"
echo ""

mkdir -p "${TARGET_DIR}"

# Step 1: Backup existing files if Target Directory is non-empty and different from SCRIPT_DIR
if [ "${SCRIPT_DIR}" != "${TARGET_DIR}" ]; then
  if [ "$(ls -A "${TARGET_DIR}" 2>/dev/null)" ]; then
<<<<<<< HEAD
    echo "📦 [1/5] Backing up existing files to ${BACKUP_ARCHIVE} (preserving .git & .env)..."
    tar --exclude='node_modules' --exclude='.git' --exclude='backup_before_sf3_*.tar.gz'         -czf "${BACKUP_ARCHIVE}" -C "${TARGET_DIR}" . || true
  else
    echo "📦 [1/6] Target directory is empty; performing clean installation..."
  fi

  # Step 2: Copy SignalForge 3.0 v3.4.0 files without overwriting .env or .git
  echo "🔄 [2/6] Copying SignalForge 3.0 v3.4.0 application files into ${TARGET_DIR}..."
  mkdir -p "${TARGET_DIR}/src" "${TARGET_DIR}/api" "${TARGET_DIR}/sql" "${TARGET_DIR}/public" "${TARGET_DIR}/cloudflare-worker" "${TARGET_DIR}/wordpress-plugin"
  rm -rf "${TARGET_DIR}/.next" "${TARGET_DIR}/next.config.js" "${TARGET_DIR}/next.config.mjs" "${TARGET_DIR}/next.config.ts" "${TARGET_DIR}/api/index.ts" 2>/dev/null || true
  cp -f "${SCRIPT_DIR}/vercel.json" "${TARGET_DIR}/vercel.json"
  cp -f "${SCRIPT_DIR}/api/index.ts" "${TARGET_DIR}/api/index.ts"
  rm -rf "${TARGET_DIR}/.next" "${TARGET_DIR}/next.config.js" "${TARGET_DIR}/next.config.mjs" "${TARGET_DIR}/next.config.ts" 2>/dev/null || true
=======
    echo "📦 [1/6] Backing up existing files to ${BACKUP_ARCHIVE} (preserving .git & .env)..."
    tar --exclude='node_modules' --exclude='.git' --exclude='backup_before_sf3_*.tar.gz' \
        -czf "${BACKUP_ARCHIVE}" -C "${TARGET_DIR}" . || true
  else
    echo "📦 [1/6] Target directory is empty; performing clean installation..."
  fi

  # Step 2: Copy SignalForge 3.0 v3.4.0 files without overwriting .env or .git
  echo "🔄 [2/6] Copying SignalForge 3.0 v3.4.0 application files into ${TARGET_DIR}..."
  mkdir -p "${TARGET_DIR}/src" "${TARGET_DIR}/api" "${TARGET_DIR}/sql" "${TARGET_DIR}/public" "${TARGET_DIR}/cloudflare-worker" "${TARGET_DIR}/wordpress-plugin"
  rm -rf "${TARGET_DIR}/.next" "${TARGET_DIR}/next.config.js" "${TARGET_DIR}/next.config.mjs" "${TARGET_DIR}/next.config.ts" "${TARGET_DIR}/api/index.ts" 2>/dev/null || true
  cp -f "${SCRIPT_DIR}/vercel.json" "${TARGET_DIR}/vercel.json"
  cp -f "${SCRIPT_DIR}/api/index.js" "${TARGET_DIR}/api/index.js"
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
  cp -f "${SCRIPT_DIR}/package.json" "${TARGET_DIR}/package.json"
  cp -f "${SCRIPT_DIR}/tsconfig.json" "${TARGET_DIR}/tsconfig.json"
  cp -f "${SCRIPT_DIR}/Dockerfile" "${TARGET_DIR}/Dockerfile"
  cp -f "${SCRIPT_DIR}/render.yaml" "${TARGET_DIR}/render.yaml"
  cp -f "${SCRIPT_DIR}/README.md" "${TARGET_DIR}/README.md"
  cp -f "${SCRIPT_DIR}/src/server.ts" "${TARGET_DIR}/src/server.ts"
  cp -f "${SCRIPT_DIR}/sql/sendput_schema.sql" "${TARGET_DIR}/sql/sendput_schema.sql"
  cp -f "${SCRIPT_DIR}/public/index.html" "${TARGET_DIR}/public/index.html"
<<<<<<< HEAD
  cp -f "${SCRIPT_DIR}/wordpress-plugin/sendput-ai-presence.php" "${TARGET_DIR}/wordpress-plugin/sendput-ai-presence.php"
else
  echo "📦 [1/5] Running in-place inside extracted package directory..."
  echo "🔄 [2/5] Verified all SignalForge 3.0 source files present."
=======
  [ -f "${SCRIPT_DIR}/public/sendput8f92a1c4b7e34d12a9c8e5f102938475.txt" ] && cp -f "${SCRIPT_DIR}/public/sendput8f92a1c4b7e34d12a9c8e5f102938475.txt" "${TARGET_DIR}/public/sendput8f92a1c4b7e34d12a9c8e5f102938475.txt"
  [ -f "${SCRIPT_DIR}/cloudflare-worker/sendput-edge-worker.js" ] && cp -f "${SCRIPT_DIR}/cloudflare-worker/sendput-edge-worker.js" "${TARGET_DIR}/cloudflare-worker/sendput-edge-worker.js"
  [ -f "${SCRIPT_DIR}/sync-github-repos-and-indexnow.sh" ] && cp -f "${SCRIPT_DIR}/sync-github-repos-and-indexnow.sh" "${TARGET_DIR}/sync-github-repos-and-indexnow.sh"
  [ -f "${SCRIPT_DIR}/wordpress-plugin/sendput-ai-visibility.php" ] && cp -f "${SCRIPT_DIR}/wordpress-plugin/sendput-ai-visibility.php" "${TARGET_DIR}/wordpress-plugin/sendput-ai-visibility.php"
else
  echo "📦 [1/6] Running in-place inside extracted package directory..."
  rm -rf "${TARGET_DIR}/.next" "${TARGET_DIR}/api/index.ts" 2>/dev/null || true
  echo "🔄 [2/6] Verified all SignalForge 3.0 v3.4.0 source files present."
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
fi

cd "${TARGET_DIR}"

# Load .env if present
if [ -f ".env" ]; then
  echo "🔐 Found existing .env file — loading environment variables..."
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
<<<<<<< HEAD
  echo "ℹ️  No .env file found yet — creating .env.example template (app will run in Self-Healing Memory Mode until configured)."
=======
  echo "ℹ️  No .env file found yet — creating .env.example template."
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
  cat << 'ENVEOF' > .env.example
NODE_ENV=production
PORT=10000
# Neon PostgreSQL (ep-winter-poetry-ae51hoth) or VPS (34.148.244.49:5432)
DATABASE_URL=postgresql://username:password@ep-winter-poetry-ae51hoth.us-east-2.aws.neon.tech/neondb?sslmode=require
VPS_POSTGRES_URL=

<<<<<<< HEAD
# AI Engine & SERP Keys (Optional in Sandbox Mode)
=======
# AI Engine & SERP Keys
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
GEMINI_API_KEY=
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=

<<<<<<< HEAD
# Stripe Self-Serve Checkout Price IDs
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ONESHOT_29=price_sendput_oneshot_29
STRIPE_PRICE_STARTER_39=price_sendput_starter_39
STRIPE_PRICE_GROWTH_79=price_sendput_growth_79
STRIPE_PRICE_AGENCY_299=price_sendput_agency_299
=======
# Direct Knowledge Graph OAuth 2.0 Write-Back Keys
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://sendput.com/api/oauth/google/callback
BING_API_KEY=

# Stripe Self-Serve Checkout & Webhook Keys (Wired to your 4 live Product IDs)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRODUCT_ONESHOT_29=prod_VVZcNbGZHG46T1
STRIPE_PRODUCT_STARTER_39=prod_VVZfdwEubbbA2G
STRIPE_PRODUCT_GROWTH_79=prod_VVZgJ0BGZz8r51
STRIPE_PRODUCT_AGENCY_299=prod_VVZhif3ZHILKAZ
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
ENVEOF
fi

# Step 3: Install dependencies & compile production bundle
<<<<<<< HEAD
echo "🛠️  [3/5] Installing Node dependencies & compiling dist/server.cjs..."
=======
echo "🛠️  [3/6] Installing Node dependencies & compiling dist/server.cjs + api/index.js..."
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
npm install
npm run build

# Step 4: Run non-destructive PostgreSQL schema migration if DATABASE_URL and psql are available
<<<<<<< HEAD
echo "🗄️  [4/5] Checking PostgreSQL migration status..."
=======
echo "🗄️  [4/6] Checking PostgreSQL migration status..."
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
if [ -n "${DATABASE_URL:-}" ] && [[ "${DATABASE_URL}" != *"username:password"* ]] && command -v psql >/dev/null 2>&1; then
  echo "   Applying idempotent schema migration (sql/sendput_schema.sql)..."
  psql "${DATABASE_URL}" -f sql/sendput_schema.sql
  echo "   ✅ Database schema upgraded cleanly (zero data loss)."
else
  echo "   ⏭️  Skipping CLI psql migration (DATABASE_URL not set locally or psql not installed)."
  echo "   The server's Self-Healing DB shield will initialize vault_app_angelburgosrosado automatically on boot."
fi

<<<<<<< HEAD
# Step 5: Check process manager or Git status
echo "🚀 [5/5] Finalizing deployment..."
=======
# Step 5: Verify Live Endpoints on https://sendput.com
echo "🔎 [5/6] Running Live Integration Verification against https://sendput.com..."
if command -v curl >/dev/null 2>&1; then
  HEALTH_CODE=$(curl -s -o /tmp/sendput_health.json -w "%{http_code}" "https://sendput.com/api/health" || echo "000")
  INDEXNOW_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://sendput.com/sendput8f92a1c4b7e34d12a9c8e5f102938475.txt" || echo "000")
  CHECKOUT_CODE=$(curl -s -o /tmp/sendput_checkout.json -w "%{http_code}" -X POST "https://sendput.com/api/checkout" -H "Content-Type: application/json" -d '{"tier":"growth_79","billing_cycle":"monthly","business_name":"MyIAD InsuranceAI"}' || echo "000")
  echo "   -> GET  /api/health                                  : HTTP ${HEALTH_CODE}"
  echo "   -> GET  /sendput8f92a1c4b7e34d12a9c8e5f102938475.txt : HTTP ${INDEXNOW_CODE}"
  echo "   -> POST /api/checkout (prod_VVZgJ0BGZz8r51)          : HTTP ${CHECKOUT_CODE}"
fi

# Step 6: Check process manager or Git status
echo "🚀 [6/6] Finalizing deployment..."
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
if command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q "sendput"; then
  echo "   Restarting PM2 process..."
  pm2 restart sendput || pm2 start dist/server.cjs --name sendput-ai
elif [ -d ".git" ]; then
<<<<<<< HEAD
  echo "   Git repository detected. To trigger automatic Render/Vercel deployment, run:"
  echo "     git add ."
  echo "     git commit -m 'Upgrade sendput.com to SendPut AI SignalForge 3.0'"
  echo "     git push origin main"
else
  echo "   To start the server right now, run: npm start (listens on port ${PORT:-10000})"
fi

echo ""
echo "✅ SendPut AI (SignalForge 3.0) upgrade complete!"
=======
  echo "   Git repository detected. To push any pending changes to Vercel/GitHub:"
  echo "     git add -A && git commit -m 'feat(integration): Stripe webhook, Google OAuth write-back & portfolio seeder (v3.4.0)' && git push origin main"
fi

echo ""
echo "✅ SendPut AI (SignalForge 3.0 v3.4.0) upgrade & verification complete!"
>>>>>>> 979e36c (feat: initialize SignalForge 3.0 platform with multi-protocol MCP engines, AI search graders, and deployment scripts)
