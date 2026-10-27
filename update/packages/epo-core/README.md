# @sendput/epo-core

> Official TypeScript SDK for **Entity Presence Optimization (EPO)** and Model Context Protocol (MCP) injection, implementing the **RFC-2026-GEO-01** standard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Standard: RFC-2026-GEO-01](https://img.shields.io/badge/Standard-RFC--2026--GEO--01-blue.svg)](https://sendput.com)
[![GetEPO](https://img.shields.io/badge/Validator-GetEPO.com-emerald.svg)](https://getepo.com)

---

## What is Entity Presence Optimization (EPO)?

Modern AI answer engines (**ChatGPT Search, Perplexity Pro, Google Gemini, Anthropic Claude**) do not discover web relevance by clicking hyperlinks or counting PageRank. They query high-dimensional embeddings and authoritative knowledge graphs to synthesize direct conversational answers.

`@sendput/epo-core` provides the 5 deterministic programmatic capabilities required to anchor any business or digital entity into AI engine memory:

1. **`buildSemanticGraph(config)`**: Emits valid, nested Schema.org `@graph` JSON-LD linking `Organization`, `LocalBusiness`, `OfferCatalog`, and verified `sameAs` authorities.
2. **`buildLlmsSpecification(config)`**: Generates token-budgeted (<2,000 tokens) `/llms.txt` and extended `/llms-full.txt` files compliant with the llmstxt.org specification.
3. **`dispatchIndexNowBatch(urls, key)`**: Dispatches high-velocity instant crawler indexation payloads directly to the IndexNow gateway.
4. **`getMcpToolManifest()`**: Generates standardized Model Context Protocol (MCP) tool declarations (`verify_business_status`, `get_service_catalog`, `initiate_inquiry`).
5. **`computeEpoScore(checks)`**: Evaluates target domains deterministically using the official formula:
   $$\text{Score} = (0.30 \times \text{Schema}) + (0.25 \times \text{Citation}) + (0.25 \times \text{Crawl}) + (0.20 \times \text{MCP})$$

---

## Installation

```bash
npm install @sendput/epo-core
```

---

## Quickstart

```typescript
import { SendPutEpoEngine } from '@sendput/epo-core';

const engine = new SendPutEpoEngine('https://sendput.com');

// 1. Build nested Schema.org @graph JSON-LD
const schema = engine.buildSemanticGraph({
  slug: 'apex-roofing',
  business_name: 'Apex Roofing Orlando',
  website_url: 'https://apexroofingorlando.com',
  city_niche: 'Orlando, FL — Roofing Contractor',
  description_en: 'Licensed and insured roofing contractor in Orlando, FL.',
  phone: '+1-407-555-0199',
  same_as: ['https://getepo.com', 'https://wikidata.org/wiki/...']
});

console.log(schema.jsonLdString);

// 2. Generate token-budgeted /llms.txt
const llms = engine.buildLlmsSpecification({
  slug: 'apex-roofing',
  business_name: 'Apex Roofing Orlando',
  website_url: 'https://apexroofingorlando.com',
  city_niche: 'Orlando, FL — Roofing Contractor',
  description_en: 'Licensed and insured roofing contractor in Orlando, FL.'
});

console.log(llms.llmsTxt);

// 3. Export MCP Server Tool Declarations
const mcp = engine.getMcpToolManifest();
console.log(mcp.tools);
```

---

## License

MIT © SendPut AI Technologies Inc.
Backend ingestion engine and multi-LLM telemetry are protected under SendPut proprietary commercial license.
