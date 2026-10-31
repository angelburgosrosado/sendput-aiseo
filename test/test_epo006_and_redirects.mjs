/**
 * test/test_epo006_and_redirects.mjs
 * Verification for EPO-006 (Hero & Comparison), EPO-002 (301 Redirect), and EPO-008 (Validator)
 */
import assert from 'assert';
import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 10014;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- VERIFYING EPO-006, EPO-002 & EPO-008 ---');

  // 1. Verify index.html contains Prompt 4 copy & Comparison Table
  const html = fs.readFileSync('public/index.html', 'utf8');
  assert(html.includes('THE NEW STANDARD: ENTITY PRESENCE OPTIMIZATION (EPO)'), 'Must include eyebrow badge');
  assert(html.includes('Make Your Business the'), 'Must include headline');
  assert(html.includes('Irrefutable Answer'), 'Must include Irrefutable Answer gradient text');
  assert(html.includes('Why Entity Presence Optimization (EPO) Supersedes Legacy Search'), 'Must include comparison table');
  assert(html.includes('Why the Link Graph is Dead'), 'Must include manifesto callout');
  assert(html.includes('hero-btn-launch-engine'), 'Must include hero launch CTA');
  assert(html.includes('hero-btn-run-audit'), 'Must include hero audit CTA');
  console.log('✅ PASS [EPO-006: Hero copy, 3-column comparison table, and manifesto callout]');

  // 2. Verify standalone validator.html exists
  const valHtml = fs.readFileSync('public/validator.html', 'utf8');
  assert(valHtml.includes('GetEPO'), 'Must include GetEPO branding');
  assert(valHtml.includes('val-biz-name'), 'Must include validator input');
  assert(valHtml.includes('RFC-2026-GEO-01'), 'Must include RFC reference');
  console.log('✅ PASS [EPO-008: Standalone validator in public/validator.html]');

  // 3. Start server to test HTTP routing and 301 redirect
  const server = spawn('node', ['dist/server.cjs'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await wait(1500);

  try {
    // Test 3A: GET /validator returns HTML
    const valRes = await fetch(`${BASE_URL}/validator`);
    assert.strictEqual(valRes.status, 200);
    const valText = await valRes.text();
    assert(valText.includes('GetEPO'));
    console.log('✅ PASS [EPO-008: GET /validator serves standalone validator]');

    // Test 3B: Request with host: getepo.com serves GetEPO Validator directly (Option A: Standalone Benchmark Hub)
    // and www.getepo.com 301 redirects to https://getepo.com/
    const getEpoRootRes = await fetch(`${BASE_URL}/`, {
      headers: { host: 'getepo.com' }
    });
    assert.strictEqual(getEpoRootRes.status, 200, 'getepo.com root must serve validator with HTTP 200');
    const getEpoRootHtml = await getEpoRootRes.text();
    assert(getEpoRootHtml.includes('GetEPO'), 'getepo.com root must serve GetEPO validator UI');

    const wwwRedirectRes = await fetch(`${BASE_URL}/`, {
      headers: { host: 'www.getepo.com' },
      redirect: 'manual'
    });
    assert.strictEqual(wwwRedirectRes.status, 301, 'www.getepo.com requests must 301 redirect');
    assert.strictEqual(wwwRedirectRes.headers.get('location'), 'https://getepo.com/', 'Must redirect to https://getepo.com/');
    console.log('✅ PASS [EPO-002: Standalone GetEPO.com Benchmark Hub + www.getepo.com 301 canonicalization]');

    console.log('\n================ ALL CHECKS PASSED ================');
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((e) => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
