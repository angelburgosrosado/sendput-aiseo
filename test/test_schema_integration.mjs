/**
 * test/test_schema_integration.mjs
 * Verification test suite for SendPut AI Schema.org JSON-LD graph integration
 */
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 10012;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const EXPECTED_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://sendput.com/#organization',
      name: 'SendPut AI',
      url: 'https://sendput.com',
      sameAs: [
        'https://getepo.com',
        'https://www.wikidata.org/wiki/Q_SENDPUT_ID',
        'https://www.crunchbase.com/organization/sendput'
      ],
      knowsAbout: [
        'Entity Presence Optimization',
        'EPO',
        'Generative Engine Optimization',
        'Answer Engine Optimization',
        'Model Context Protocol'
      ]
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://sendput.com/#engine',
      name: 'SendPut EPO Engine',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cloud',
      publisher: {
        '@id': 'https://sendput.com/#organization'
      }
    }
  ]
};

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, text, json };
}

async function run() {
  console.log('--- TESTING SCHEMA.ORG JSON-LD & LLMS.TXT INTEGRATION ---');

  // Test 1: Verify public/index.html contains the exact structured data in <head>
  const indexHtml = fs.readFileSync('public/index.html', 'utf8');
  assert(indexHtml.includes('<script type="application/ld+json">'), 'index.html must contain ld+json script tag');
  assert(indexHtml.includes('"@id": "https://sendput.com/#organization"'), 'index.html must include organization @id');
  assert(indexHtml.includes('"@id": "https://sendput.com/#engine"'), 'index.html must include software engine @id');
  assert(indexHtml.includes('"https://getepo.com"'), 'index.html must include getepo.com in sameAs');
  assert(indexHtml.includes('<link rel="llms-txt"'), 'index.html must include link rel="llms-txt"');
  console.log('✅ PASS [Test 1: public/index.html <head> Schema.org JSON-LD & <link rel="llms-txt">]');

  // Test 2: Verify public/llms.txt and public/llms-full.txt
  const llmsTxt = fs.readFileSync('public/llms.txt', 'utf8');
  assert(llmsTxt.includes('https://sendput.com/#organization'), 'llms.txt must declare organization @id');
  assert(llmsTxt.includes('https://getepo.com'), 'llms.txt must declare getepo.com');
  assert(llmsTxt.includes('Entity Presence Optimization'), 'llms.txt must include EPO');

  const llmsFullTxt = fs.readFileSync('public/llms-full.txt', 'utf8');
  assert(llmsFullTxt.includes('https://sendput.com/#engine'), 'llms-full.txt must declare engine @id');
  assert(llmsFullTxt.includes('RFC-2026-GEO-01'), 'llms-full.txt must reference RFC-2026-GEO-01');
  console.log('✅ PASS [Test 2: public/llms.txt & public/llms-full.txt spec files]');

  // Start compiled server on test port
  const server = spawn('node', ['dist/server.cjs'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stdout.on('data', (d) => console.log(`[SERVER STDOUT] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[SERVER STDERR] ${d.toString().trim()}`));

  await wait(1500);

  try {
    // Test 3: GET /api/schema returns exact schema graph
    const schemaRes = await request('/api/schema');
    assert.strictEqual(schemaRes.status, 200, 'GET /api/schema must return 200');
    assert.strictEqual(schemaRes.headers.get('content-type'), 'application/ld+json; charset=utf-8');
    assert.deepStrictEqual(schemaRes.json, EXPECTED_GRAPH, 'Schema graph must exactly match user specification');
    console.log('✅ PASS [Test 3: GET /api/schema returns exact Schema.org JSON-LD @graph]');

    // Test 4: GET /schema.json returns exact schema graph
    const schemaJsonRes = await request('/schema.json');
    assert.strictEqual(schemaJsonRes.status, 200, 'GET /schema.json must return 200');
    assert.deepStrictEqual(schemaJsonRes.json, EXPECTED_GRAPH);
    console.log('✅ PASS [Test 4: GET /schema.json returns exact Schema.org JSON-LD @graph]');

    // Test 5: GET /llms.txt returns valid Markdown
    const llmsRes = await request('/llms.txt');
    assert.strictEqual(llmsRes.status, 200, 'GET /llms.txt must return 200');
    assert(llmsRes.headers.get('content-type').includes('text/markdown'));
    assert(llmsRes.text.includes('SendPut AI — SendPut EPO Engine'));
    console.log('✅ PASS [Test 5: GET /llms.txt serves text/markdown]');

    // Test 6: GET /v1/tenants/sendput/llms.txt dynamic tenant route
    const tenantLlmsRes = await request('/v1/tenants/sendput/llms.txt');
    assert.strictEqual(tenantLlmsRes.status, 200);
    assert(tenantLlmsRes.text.includes('SendPut AI'));
    console.log('✅ PASS [Test 6: GET /v1/tenants/sendput/llms.txt dynamic tenant route]');

    console.log('\n================ ALL SCHEMA TESTS PASSED ================');
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
