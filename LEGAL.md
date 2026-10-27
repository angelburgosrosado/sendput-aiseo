# SendPut AI Technologies Inc. — Legal Terms & Acceptable Use Policy

**Last Updated:** October 2026  
**Official Entity:** SendPut AI Technologies Inc. ("SendPut", "we", "us", "our")  
**Product:** SendPut EPO Engine™ (Entity Presence Optimization)  
**Website:** [https://sendput.com](https://sendput.com)  

---

## 1. Proprietary Rights & Trademark Notices
- **SendPut™**, **SendPut EPO Engine™**, **Entity Presence Optimization (EPO)™**, and **SFAI™ (SendPut AI Authority Index)** are proprietary trademarks and service marks of SendPut AI Technologies Inc.
- All proprietary backend ingestion routines, database architectures, serverless edge workers, and autonomous multi-LLM geo-anchoring algorithms are confidential, trade-secret, and patent-pending.
- Any unauthorized commercial reproduction, branding spoofing, interface mirroring, or deceptive marketing is strictly prohibited under the Lanham Act (15 U.S.C. § 1125(a)) and international treaty laws.

---

## 2. Server-Side Entitlement & Anti-Bypass Enforcement
- Access to SendPut Enterprise, White-Label Agency Command, Knowledge Graph Write-Back, and Model Context Protocol (MCP) server nodes requires active subscription validation through server-side middleware.
- Client-side manipulation of browser memory, local storage flags, or request headers to bypass paywalls or access gates constitutes unauthorized access under the Computer Fraud and Abuse Act (18 U.S.C. § 1030).
- SendPut AI continuously monitors API telemetry, bot scraping patterns, and key authentications. Accounts or IP addresses engaging in credential sharing, scraping, or load exhaustion will be terminated immediately.

---

## 3. Acceptable Use Policy (AUP)
Users and subscribers agree not to:
1. Siphon, bulk-scrape, or programmatically query SendPut public audit endpoints without prior written authorization or an authorized Pro/Agency API key.
2. Reverse-engineer, decompile, or extract proprietary ingestion algorithms from compiled backend artifacts (`dist/server.cjs`, `api/index.js`).
3. Deploy counterfeit or pixel-for-pixel replica services misrepresenting affiliation with SendPut AI.
4. Exploit the free Live AI Search Grader (`/api/audit`) via automated bot farms or DDoS attacks.

---

## 4. Rate Limiting & Resource Protection
- Public audit requests are subject to strict per-IP rate limits (default: 10 audits per 10 minutes) enforced at the network and server middleware layers.
- Requests exceeding these thresholds will receive `HTTP 429 Too Many Requests` with a designated `Retry-After` header.
- Automated API integrations must provide an authenticated `x-access-key` / `Authorization: Bearer` header or solve Cloudflare Turnstile verification challenges.

---

## 5. Contact Information
**SendPut AI Technologies Inc.**  
Legal & IP Department: `legal@sendput.com`  
DMCA Takedown Agent: `dmca@sendput.com`  
Corporate Headquarters: Orlando, FL / San Juan, PR  
