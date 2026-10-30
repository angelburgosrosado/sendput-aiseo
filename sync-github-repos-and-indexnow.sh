#!/usr/bin/env bash
# ==============================================================================
# sync-github-repos-and-indexnow.sh
# Automated GitHub Multi-Repo GEO Updater & Official IndexNow Verification Script
# ==============================================================================
# What this script does:
#  1. Drops the official IndexNow verification key file (sendput8f92a1c4b7e34d12a9c8e5f102938475.txt),
#     /llms.txt + /llms-full.txt feeds, AI-friendly robots.txt, and SendPut Edge Script into your
#     GitHub repositories (sendput-aiseo, insuranceai-saas, insuranceai-crm,
#     insuranceai-agent, myiad-insuranceai.web, iptv-menu-app, Story-Menu-App).
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

  # 1. Write official IndexNow key file at public/<INDEXNOW_KEY>.txt and root
  echo -n "${INDEXNOW_KEY}" > "${pub_dir}/${INDEXNOW_KEY}.txt"
  echo "   ✅ Created ${pub_dir}/${INDEXNOW_KEY}.txt"

  # 2. Write /llms.txt and /llms-full.txt if not already managed dynamically
  if [ "${prod_domain}" != "sendput.com" ]; then
    cat << LLMSEOF > "${pub_dir}/llms.txt"
# ${brand_name}

> ${summary_en}

## Verified Entity Profile (SendPut EPO Engine)
- **Official Website**: https://${prod_domain}
- **Public AI Verification Record**: ${SENDPUT_HOST}/verified/${tenant_slug}
- **Full AI Knowledge Graph Feed**: https://${prod_domain}/llms-full.txt
- **OpenAPI 3.1 Schema**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/openapi.json
- **Agent Skill (SKILL.md)**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/skill.md
- **Live MCP Server**: ${SENDPUT_HOST}/mcp/${tenant_slug}/sse
LLMSEOF
    echo "   ✅ Created ${pub_dir}/llms.txt"

    cat << LLMSFULLEOF > "${pub_dir}/llms-full.txt"
# ${brand_name} — Full AI Knowledge Graph & Agentic Specification

> ${summary_en}

## Canonical Entity Metadata
- **Entity Name**: ${brand_name}
- **Tenant Slug**: ${tenant_slug}
- **Primary Domain**: https://${prod_domain}
- **Verification Authority**: SendPut EPO Engine (${SENDPUT_HOST})
- **IndexNow Verification Key**: https://${prod_domain}/${INDEXNOW_KEY}.txt

## Agentic Discovery & Machine Endpoints
- **Public Entity Verification Badge**: ${SENDPUT_HOST}/verified/${tenant_slug}
- **Entity Profile JSON**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/profile
- **OpenAPI 3.1 Specification**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/openapi.json
- **Agent Skill Definition**: ${SENDPUT_HOST}/v1/tenants/${tenant_slug}/skill.md
- **Model Context Protocol (MCP) JSON-RPC 2.0 / SSE**: ${SENDPUT_HOST}/mcp/${tenant_slug}/sse
LLMSFULLEOF
    echo "   ✅ Created ${pub_dir}/llms-full.txt"
  fi

  # 3. Write / update robots.txt to unblock AI retrieval crawlers
  cat << ROBOTSEOF > "${pub_dir}/robots.txt"
User-agent: *
Allow: /

# SendPut EPO Engine — Allow Verified AI Search Retrieval Bots
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
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

  # 4. Inject SendPut Edge Script into index.html if present and not yet injected (cross-platform via python3)
  for html_file in "${repo_dir}/index.html" "${pub_dir}/index.html"; do
    if [ -f "${html_file}" ] && [ "${prod_domain}" != "sendput.com" ]; then
      if ! grep -qE "sf-edge\.js|epo-edge\.js" "${html_file}"; then
        python3 -c '
import sys, re
file_path, slug = sys.argv[1], sys.argv[2]
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()
tag = f"  <script src=\"https://sendput.com/epo-edge.js?tenant={slug}\" defer></script>\n</head>"
if re.search(r"</head>", html, re.IGNORECASE):
    html = re.sub(r"</head>", tag, html, count=1, flags=re.IGNORECASE)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"   ✅ Injected epo-edge.js into {file_path}")
' "${html_file}" "${tenant_slug}" || true
      fi
    fi
  done

  # 5. Commit and push if git repo
  if [ -d "${repo_dir}/.git" ]; then
    (
      cd "${repo_dir}"
      git add "${pub_dir}/${INDEXNOW_KEY}.txt" "${pub_dir}/robots.txt" 2>/dev/null || true
      [ -f "${pub_dir}/llms.txt" ] && git add "${pub_dir}/llms.txt" 2>/dev/null || true
      [ -f "${pub_dir}/llms-full.txt" ] && git add "${pub_dir}/llms-full.txt" 2>/dev/null || true
      [ -f "${repo_dir}/index.html" ] && git add "${repo_dir}/index.html" 2>/dev/null || true
      [ -f "${pub_dir}/index.html" ] && git add "${pub_dir}/index.html" 2>/dev/null || true
      if ! git diff --cached --quiet; then
        git commit -m "feat(epo): add SendPut EPO Engine edge schema, llms.txt, llms-full.txt & IndexNow key (${INDEXNOW_KEY})"
        echo "   🚀 Pushing ${brand_name} to GitHub origin..."
        git push origin HEAD || echo "   ⚠️  git push requires credentials or manual push in ${repo_dir}"
      else
        echo "   ℹ️  No staged GEO file changes to commit in ${repo_dir}"
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
        \"https://${prod_domain}/llms-full.txt\"
      ]
    }" || echo "000")

  echo "   -> IndexNow API Response for ${prod_domain}: HTTP ${http_code} (200/202 = Verified & Queued)"
}

# 1. Update Current Repository (if run inside sendput-aiseo)
if [ -f "${WORKSPACE_ROOT}/package.json" ]; then
  update_repo_geo_files "${WORKSPACE_ROOT}" "sendput-ai" "SendPut EPO Engine" "sendput.com" "Active Entity Propagation, Real-Time IndexNow Relay, and Agentic MCP Readiness."
fi

# 2. Update Sibling Portfolio Repositories (if cloned in parent directory)
PARENT_DIR="$(dirname "${WORKSPACE_ROOT}")"
update_repo_geo_files "${PARENT_DIR}/insuranceai-saas" "myiad-insurance-ai" "MyIAD InsuranceAI SaaS" "saas.myiad.net" "AI-powered bilingual (EN/ES) insurance agency management platform integrated with Microsoft 365."
update_repo_geo_files "${PARENT_DIR}/insuranceai-crm" "myiad-insurance-ai" "MyIAD US Insurance CRM" "crm.myiad.net" "Automated insurance lead routing, WhatsApp templates, and policy renewal CRM."
update_repo_geo_files "${PARENT_DIR}/insuranceai-agent" "myiad-insurance-ai" "MyIAD Solo Agent Portal" "agent.myiad.net" "Rapid insurance quoting and AI policy explanation assistant for independent agents."
update_repo_geo_files "${PARENT_DIR}/myiad-insuranceai.web" "myiad-insurance-ai" "MyIAD InsuranceAI Web" "myiad.net" "Bilingual (EN/ES) AI-powered insurance portal, automated carrier quoting, and policyholder hub."
update_repo_geo_files "${PARENT_DIR}/iptv-menu-app" "iptv-menu-pro" "IPTV.Menu Pro" "iptv.menu" "Store-compliant Bring-Your-Own-Playlist (BYO) M3U and Xtream media player utility."
update_repo_geo_files "${PARENT_DIR}/Story-Menu-App" "story-menu-app" "Story.Menu" "story.menu" "Interactive AI reading, Vocabulary Word Vault, and Lexile incentive platform."

echo ""
echo "=================================================================="
echo "📡 Firing Official IndexNow Verification Pings..."
echo "=================================================================="
verify_domain_indexnow "sendput.com" "myiad-insurance-ai"
verify_domain_indexnow "saas.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "crm.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "agent.myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "myiad.net" "myiad-insurance-ai"
verify_domain_indexnow "iptv.menu" "iptv-menu-pro"
verify_domain_indexnow "story.menu" "story-menu-app"

echo ""
echo "✅ All GitHub repository GEO files and IndexNow verifications complete!"
