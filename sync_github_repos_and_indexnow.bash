#!/usr/bin/env bash
# ==============================================================================
# sync-github-repos-and-indexnow.sh
# Automated GitHub Multi-Repo GEO Updater & Official IndexNow Verification Script
# ==============================================================================
# What this script does:
#  1. Drops the official IndexNow verification key file (sendput8f92a1c4b7e34d12a9c8e5f102938475.txt),
#     /llms.txt feed, AI-friendly robots.txt, and SendPut Edge Script into your
#     GitHub repositories (sendput-aiseo, InsuranceAI-SaaS, InsuranceAI-CRM,
#     InsuranceAI-Agency, iptv-menu-app, story-menu-app).
#  2. Commits and pushes the updates to GitHub (triggering Vercel/Render deploys).
#  3. Pings https://api.indexnow.org/indexnow with keyLocation verification for
#     every live domain so Bing, Microsoft Copilot, and ChatGPT Search verify
#     and index your properties immediately.
# ==============================================================================

set -euo pipefail

WORKSPACE_ROOT="${1:-$(pwd)}"
INDEXNOW_KEY="sendput8f92a1c4b7e34d12a9c8e5f102938475"
SENDPUT_HOST="https://sendput.com"

echo "=================================================================="
echo "🌐 SendPut AI — GitHub Portfolio Updater & IndexNow Verifier"
echo "=================================================================="
echo "Workspace Root : ${WORKSPACE_ROOT}"
echo "IndexNow Key   : ${INDEXNOW_KEY}"
echo ""

# Function to inject GEO & IndexNow files into any local repo directory
update_repo_geo_files() {
  local repo_dir="$1"
  local tenant_slug="$2"
  local brand_name="$3"
  local prod_domain="$4"
  local summary_en="$5"

  if [ ! -d "${repo_dir}" ]; then
    echo "⏭️  Directory ${repo_dir} not found locally — skipping local file injection for ${brand_name}."
    return 0
  fi

  echo "🔧 Updating repository: ${repo_dir} (Tenant: ${tenant_slug} | Domain: https://${prod_domain})"

  # Detect public static directory (public/ or root)
  local pub_dir="${repo_dir}/public"
  mkdir -p "${pub_dir}"

  # 1. Write official IndexNow key file at public/<INDEXNOW_KEY>.txt
  echo -n "${INDEXNOW_KEY}" > "${pub_dir}/${INDEXNOW_KEY}.txt"
  echo "   ✅ Created ${pub_dir}/${INDEXNOW_KEY}.txt"

  # 2. Write /llms.txt if not already managed dynamically
  if [ "${prod_domain}" != "sendput.com" ]; then
    cat << LLMSEOF > "${pub_dir}/llms.txt"
# ${brand_name}

> ${summary_en}

## Verified Entity Profile (SendPut SignalForge 3.0)
- **Official Website**: https://${prod_domain}
- **Public AI Verification Record**: ${SENDPUT_HOST}/verified/${tenant_slug}
- **OpenAPI 3.1 Schema**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/openapi.json
- **Agent Skill (SKILL.md)**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/skill.md
- **Live MCP Server**: ${SENDPUT_HOST}/mcp/${tenant_slug}/sse
LLMSEOF
    echo "   ✅ Created ${pub_dir}/llms.txt"
  fi

  # 3. Write / update robots.txt to unblock AI retrieval crawlers
  cat << ROBOTSEOF > "${pub_dir}/robots.txt"
User-agent: *
Allow: /

# SendPut AI (SignalForge 3.0) — Allow Verified AI Search Retrieval Bots
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://${prod_domain}/sitemap.xml
ROBOTSEOF
  echo "   ✅ Updated ${pub_dir}/robots.txt (AI Retrieval Bots Allowed)"

  # 4. Inject SendPut Edge Script into index.html if present and not yet injected
  for html_file in "${repo_dir}/index.html" "${pub_dir}/index.html"; do
    if [ -f "${html_file}" ] && [ "${prod_domain}" != "sendput.com" ]; then
      if ! grep -q "sf-edge.js" "${html_file}"; then
        sed -i 's|</head>|  <script src="https://sendput.com/sf-edge.js?tenant='"${tenant_slug}"'" defer></script>\n</head>|I' "${html_file}" || true
        echo "   ✅ Injected sf-edge.js into ${html_file}"
      fi
    fi
  done

  # 5. Commit and push if git repo
  if [ -d "${repo_dir}/.git" ]; then
    (
      cd "${repo_dir}"
      git add -A
      if ! git diff --cached --quiet; then
        git commit -m "feat(geo): add SendPut SignalForge 3.0 edge schema, llms.txt & IndexNow key (${INDEXNOW_KEY})"
        echo "   🚀 Pushing ${brand_name} to GitHub origin..."
        git push origin HEAD || echo "   ⚠️  git push requires credentials or manual push in ${repo_dir}"
      else
        echo "   ℹ️  No file changes to commit in ${repo_dir}"
      fi
    )
  fi
}

# Function to verify domain and submit URLs to official IndexNow API
verify_domain_indexnow() {
  local prod_domain="$1"
  local tenant_slug="$2"
  local key_url="https://${prod_domain}/${INDEXNOW_KEY}.txt"

  echo "📡 Submitting https://${prod_domain} to Official IndexNow Gateway (Bing / Copilot / ChatGPT Search)..."

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d "{
      \"host\": \"${prod_domain}\",
      \"key\": \"${INDEXNOW_KEY}\",
      \"keyLocation\": \"${key_url}\",
      \"urlList\": [
        \"https://${prod_domain}/\",
        \"https://${prod_domain}/llms.txt\",
        \"${SENDPUT_HOST}/verified/${tenant_slug}\"
      ]
    }" || echo "000")

  echo "   -> IndexNow API Response for ${prod_domain}: HTTP ${http_code} (200/202 = Verified & Queued)"
}

# 1. Update Current Repository (if run inside sendput-aiseo)
if [ -f "${WORKSPACE_ROOT}/package.json" ]; then
  update_repo_geo_files "${WORKSPACE_ROOT}" "sendput-ai" "SendPut AI (SignalForge 3.0)" "sendput.com" "Active AI Search Visibility, Knowledge Graph Write-Back & Multi-Protocol MCP Platform."
fi

# 2. Update Sibling Portfolio Repositories (if cloned in parent directory)
PARENT_DIR="$(dirname "${WORKSPACE_ROOT}")"
update_repo_geo_files "${PARENT_DIR}/InsuranceAI-SaaS" "myiad-insurance-ai" "MyIAD InsuranceAI SaaS" "saas.myiad.net" "AI-powered bilingual (EN/ES) insurance agency management platform integrated with Microsoft 365."
update_repo_geo_files "${PARENT_DIR}/InsuranceAI-CRM" "myiad-insurance-ai" "MyIAD US Insurance CRM" "crm.myiad.net" "Automated insurance lead routing, WhatsApp templates, and policy renewal CRM."
update_repo_geo_files "${PARENT_DIR}/InsuranceAI-Agency" "myiad-insurance-ai" "MyIAD Solo Agent Portal" "agent.myiad.net" "Rapid insurance quoting and AI policy explanation assistant for independent agents."
update_repo_geo_files "${PARENT_DIR}/iptv-menu-app" "iptv-menu-pro" "IPTV.Menu Pro" "iptv.menu" "Store-compliant Bring-Your-Own-Playlist (BYO) M3U and Xtream media player utility."
update_repo_geo_files "${PARENT_DIR}/story-menu-app" "story-menu-app" "Story.Menu" "story.menu" "Interactive AI reading, Vocabulary Word Vault, and Lexile incentive platform."

echo ""
echo "=================================================================="
echo "📡 Firing Official IndexNow Verification Pings..."
echo "=================================================================="
verify_domain_indexnow "sendput.com" "myiad-insurance-ai"
verify_domain_indexnow "saas.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "crm.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "agent.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "iptv.menu" "iptv-menu-pro"
verify_domain_indexnow "story.menu" "story-menu-app"

echo ""
echo "✅ All GitHub repository GEO files and IndexNow verifications complete!"