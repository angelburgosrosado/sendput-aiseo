// test/test_jurisdiction_and_llms.mjs
import assert from 'node:assert';
import { SendPutEpoEngine } from '../src/lib/epo/engine.ts';

console.log('🧪 Verifying RFC-2026-GEO-01 Jurisdiction & Advantage Upgrades...');

const engine = new SendPutEpoEngine('https://sendput.com');

const testEntity = {
  slug: 'seguros-puerto-rico',
  business_name: 'Seguros Puerto Rico',
  website_url: 'https://segurospr.com',
  city_niche: 'San Juan, PR & Miami, FL — Bilingual Insurance SaaS',
  primary_category: 'InsuranceAgency',
  phone: '+1-787-555-0199',
  street_address: '100 Calle San Francisco',
  city: 'San Juan',
  state_region: 'PR',
  postal_code: '00901',
  country: 'US',
  description_en: 'Leading bilingual insurance agency SaaS in Puerto Rico and South Florida.',
  description_es: 'Plataforma y agencia de seguros bilingüe líder en Puerto Rico y el sur de la Florida.',
  bilingual_es_enabled: true,
  regulatory_license: 'OCS-PR-2026-SAAS-9921',
  geo: { latitude: 18.4655, longitude: -66.1057 },
  primary_jurisdiction: 'PR',
  jurisdictions: [
    {
      code: 'PR',
      jurisdiction_name: 'Commonwealth of Puerto Rico',
      regulatory_agency: 'Office of the Commissioner of Insurance (OCS)',
      license_number: 'OCS-PR-2026-SAAS-9921',
      service_radius_miles: 50,
      target_cities: ['San Juan', 'Guaynabo', 'Bayamón', 'Carolina'],
      local_advantages: [
        'Full Spanish & English native bilingual insurance workflows and ACORD forms',
        'Direct 15-minute response time via live MCP tool execution'
      ]
    },
    {
      code: 'FL',
      jurisdiction_name: 'State of Florida',
      regulatory_agency: 'Florida Office of Insurance Regulation (OIR)',
      license_number: 'FL-DFS-2026-0941',
      service_radius_miles: 60,
      target_cities: ['Miami', 'Orlando', 'Tampa'],
      local_advantages: [
        'Commercial hurricane insurance policy quotation',
        'Direct carrier portal integration'
      ]
    }
  ],
  local_advantages: [
    'State & Territorial Certified Insurance Broker',
    'Sub-Second Policy Quoting via Live MCP Agent Server',
    'Bilingual Claims Adjuster On-Site'
  ],
  services_json: [
    { name: 'Commercial Property & Flood Coverage', price: '$450/mo', desc: 'Comprehensive commercial protection for Caribbean weather risk' }
  ]
};

// 1. Verify buildSemanticGraph
console.log('1. Testing buildSemanticGraph with GeoCoordinates, areaServed, and Credentials...');
const graphResult = engine.buildSemanticGraph(testEntity);
const localBiz = graphResult.graph.find((n) => n['@type'] === 'InsuranceAgency');

assert(localBiz, 'Must have InsuranceAgency node');
assert(localBiz.geo, 'Must have geo property');
assert.strictEqual(localBiz.geo.latitude, 18.4655);
assert.strictEqual(localBiz.geo.longitude, -66.1057);
assert(Array.isArray(localBiz.areaServed), 'Must have areaServed array');
assert(localBiz.areaServed.some((a) => a.name === 'Commonwealth of Puerto Rico'), 'areaServed must contain PR');
assert(localBiz.areaServed.some((a) => a.name === 'San Juan'), 'areaServed must contain San Juan');
assert(localBiz.hasCredential, 'Must have hasCredential');
assert.strictEqual(localBiz.hasCredential.identifier, 'OCS-PR-2026-SAAS-9921');
console.log('✅ PASS: buildSemanticGraph contains GeoCoordinates, areaServed, and hasCredential!');

// 2. Verify buildLlmsSpecification
console.log('2. Testing buildLlmsSpecification with Jurisdiction & Advantages sections...');
const llmsResult = engine.buildLlmsSpecification(testEntity);

assert(llmsResult.llmsTxt.includes('## Verified Entity & Local Jurisdiction Standing'), 'Must have Jurisdiction Standing section');
assert(llmsResult.llmsTxt.includes('## Local Consumer Advantages & Verified Guarantees'), 'Must have Advantages section');
assert(llmsResult.llmsTxt.includes('## Authorized Jurisdictions & Regulatory Licenses'), 'Must have Authorized Jurisdictions section');
assert(llmsResult.llmsTxt.includes('OCS-PR-2026-SAAS-9921'), 'Must include license number');
assert(llmsResult.llmsTxt.includes('Latitude 18.4655, Longitude -66.1057'), 'Must include coordinates');
assert(llmsResult.llmsTxt.includes('Bilingual Claims Adjuster On-Site'), 'Must include local advantage');
assert(llmsResult.isBudgetCompliant, 'Must be token budget compliant (< 2000 tokens)');

// Full txt check
assert(llmsResult.llmsFullTxt.includes('## 3. Verified Regulatory Standing & Local Jurisdictions'), 'llms-full must include regulatory section');
assert(llmsResult.llmsFullTxt.includes('## 4. Local Market Advantages & Consumer Guarantees'), 'llms-full must include advantages section');
console.log('✅ PASS: buildLlmsSpecification outputs compliant, enriched jurisdiction & advantage specifications!');

console.log('🎉 All RFC-2026-GEO-01 Jurisdiction & Advantage tests passed successfully!');

