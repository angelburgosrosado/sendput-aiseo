# SendPut EPO Engine — Full-Stack Deployment Package

The first **Entity Presence Optimization (EPO) Platform — Active Entity Propagation, Real-Time IndexNow Relay, and Agentic MCP Readiness** built for Main Street SMBs and White-Label Marketing Agencies.

## Quickstart (Local, Render, or VPS)

1. Install dependencies & build:
   ```bash
   npm install
   npm run build
   ```
2. Apply the multi-tenant PostgreSQL schema to Neon (`ep-winter-poetry-ae51hoth`) or VPS (`34.148.244.49:5432`):
   ```bash
   psql "$DATABASE_URL" -f sql/sendput_schema.sql
   ```
3. Start the production server (includes Self-Healing Database Shield):
   ```bash
   npm start
   ```

## Included 5-Layer SendPut EPO Engine Endpoints
- `GET /` — Interactive SendPut EPO Engine PLG Grader, 5-Layer Active Engine, White-Label Agency Command & Pricing Portal
- `GET /api/health` — Live PostgreSQL & TCP 5432 self-healing telemetry
- `POST /api/audit` — Live AI Search Grader & Proposal Generator
- `GET /epo-edge.js?tenant=:slug` (alias: `/sf-edge.js`) — 1-Line Edge Script injecting `LocalBusiness` + `FAQPage` JSON-LD & AI Bot Telemetry
- `GET /v1/tenants/:slug/llms.txt` — Dynamic spec-compliant `/llms.txt` markdown feed
- `GET /v1/tenants/:slug/openapi.json` — Dynamic OpenAPI 3.1 specification
- `GET /v1/tenants/:slug/skill.md` — Dynamic `agentskills.io` `SKILL.md` package
- `ALL /mcp/:slug/sse` — Live Model Context Protocol (MCP) tool execution endpoint
- `wordpress-plugin/sendput-ai-presence.php` — 1-Click WordPress & Elementor plugin
