// test/smoke_test.mjs — Automated Smoke Test Suite for SendPut EPO Engine
import http from 'http';
import { spawn } from 'child_process';

const PORT = 10005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log('--- [SMOKE TEST] Starting SendPut AI Server on port', PORT, '---');
const serverProcess = spawn('node', ['dist/server.cjs'], {
  env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe']
});

serverProcess.stdout.on('data', (d) => console.log(`[SERVER STDOUT] ${d.toString().trim()}`));
serverProcess.stderr.on('data', (d) => console.error(`[SERVER STDERR] ${d.toString().trim()}`));

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body ? JSON.stringify(options.body) : null;
  if (body) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body || undefined
  });

  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  return { status: res.status, headers: res.headers, contentType, text };
}

async function runTests() {
  await wait(1500); // Wait for server to boot

  const results = [];

  // Test 1: GET /api/health
  console.log('\n[TEST 1] GET /api/health');
  try {
    const res = await request('/api/health');
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.status === 'ok' && json.database;
    results.push({ name: 'GET /api/health', pass, details: `status=${json.status}, vpsPostgres=${json.database?.vpsPostgresTcp5432}` });
  } catch (err) {
    results.push({ name: 'GET /api/health', pass: false, error: err.message });
  }

  // Test 2: GET / (UI)
  console.log('\n[TEST 2] GET /');
  try {
    const res = await request('/');
    const pass = res.status === 200 && (res.text.includes('SendPut EPO Engine') || res.text.includes('SendPut AI (SignalForge 3.0)')) && res.text.includes('id="tab-grader"') && res.text.includes('id="tab-engine"');
    results.push({ name: 'GET / (SendPut EPO Engine 4-Tab UI)', pass, details: `HTML length=${res.text.length}` });
  } catch (err) {
    results.push({ name: 'GET /', pass: false, error: err.message });
  }

  // Test 3: POST /api/audit
  console.log('\n[TEST 3] POST /api/audit');
  try {
    const res = await request('/api/audit', {
      method: 'POST',
      body: {
        business_name: 'MyIAD InsuranceAI',
        website_url: 'https://saas.myiad.net',
        city_niche: 'San Juan, PR & Miami, FL'
      }
    });
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.sfai_score !== undefined && json.aics_score !== undefined && json.dvs_score !== undefined && json.thq_score !== undefined && json.remediation_projection;
    results.push({ name: 'POST /api/audit', pass, details: `sfai=${json.sfai_score}, aics=${json.aics_score}, dvs=${json.dvs_score}, thq=${json.thq_score}` });
  } catch (err) {
    results.push({ name: 'POST /api/audit', pass: false, error: err.message });
  }

  // Test 4: GET /sf-edge.js?tenant=myiad-insurance-ai
  console.log('\n[TEST 4] GET /sf-edge.js?tenant=myiad-insurance-ai');
  try {
    const res = await request('/sf-edge.js?tenant=myiad-insurance-ai');
    const pass = res.status === 200 && res.contentType.includes('javascript') && res.text.includes('sendput-signalforge-jsonld') && res.text.includes('SoftwareApplication');
    results.push({ name: 'GET /sf-edge.js', pass, details: `Content-Type=${res.contentType}, size=${res.text.length}` });
  } catch (err) {
    results.push({ name: 'GET /sf-edge.js', pass: false, error: err.message });
  }

  // Test 5: GET /v1/tenants/myiad-insurance-ai/llms.txt
  console.log('\n[TEST 5] GET /v1/tenants/myiad-insurance-ai/llms.txt');
  try {
    const res = await request('/v1/tenants/myiad-insurance-ai/llms.txt');
    const pass = res.status === 200 && res.contentType.includes('markdown') && res.text.includes('MyIAD InsuranceAI Ecosystem') && res.text.includes('[ES]');
    results.push({ name: 'GET /v1/tenants/.../llms.txt', pass, details: `Content-Type=${res.contentType}, size=${res.text.length}` });
  } catch (err) {
    results.push({ name: 'GET /v1/tenants/.../llms.txt', pass: false, error: err.message });
  }

  // Test 6: GET /v1/tenants/myiad-insurance-ai/openapi.json
  console.log('\n[TEST 6] GET /v1/tenants/myiad-insurance-ai/openapi.json');
  try {
    const res = await request('/v1/tenants/myiad-insurance-ai/openapi.json');
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.openapi === '3.1.0' && json.paths['/profile'];
    results.push({ name: 'GET /v1/tenants/.../openapi.json', pass, details: `openapi=${json.openapi}, title=${json.info?.title}` });
  } catch (err) {
    results.push({ name: 'GET /v1/tenants/.../openapi.json', pass: false, error: err.message });
  }

  // Test 7: GET /v1/tenants/myiad-insurance-ai/skill.md
  console.log('\n[TEST 7] GET /v1/tenants/myiad-insurance-ai/skill.md');
  try {
    const res = await request('/v1/tenants/myiad-insurance-ai/skill.md');
    const pass = res.status === 200 && res.contentType.includes('markdown') && res.text.includes('---') && res.text.includes('Autonomous Agent Skill');
    results.push({ name: 'GET /v1/tenants/.../skill.md', pass, details: `size=${res.text.length}` });
  } catch (err) {
    results.push({ name: 'GET /v1/tenants/.../skill.md', pass: false, error: err.message });
  }

  // Test 8: POST /mcp/myiad-insurance-ai/sse
  console.log('\n[TEST 8] POST /mcp/myiad-insurance-ai/sse');
  try {
    const res = await request('/mcp/myiad-insurance-ai/sse', {
      method: 'POST',
      body: { tool: 'get_verified_profile' }
    });
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.protocol === 'model-context-protocol/2026-07-28' && json.status === 'executed' && json.result?.verified_by;
    results.push({ name: 'POST /mcp/.../sse', pass, details: `protocol=${json.protocol}, tool=${json.tool_invoked}` });
  } catch (err) {
    results.push({ name: 'POST /mcp/.../sse', pass: false, error: err.message });
  }

  // Bonus Test: GET /downloads/sendput-ai-presence-plugin.zip
  console.log('\n[BONUS] GET /downloads/sendput-ai-presence-plugin.zip');
  try {
    const res = await request('/downloads/sendput-ai-presence-plugin.zip');
    const pass = res.status === 200 && res.text.length > 500;
    results.push({ name: 'GET /downloads/sendput-ai-presence-plugin.zip', pass, details: `size=${res.text.length} bytes` });
  } catch (err) {
    results.push({ name: 'GET /downloads/...zip', pass: false, error: err.message });
  }

  // Test 9: Agency Fleet Command & Seats (/api/agency/seats)
  console.log('\n[TEST 9] GET /api/agency/seats');
  try {
    const res = await request('/api/agency/seats');
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.agency && json.included_seats === 10 && json.reseller_margins;
    results.push({ name: 'GET /api/agency/seats', pass, details: `agency=${json.agency}, starterProfit=$${json.reseller_margins?.net_margin_starter}/mo, growthProfit=$${json.reseller_margins?.net_margin_growth}/mo` });
  } catch (err) {
    results.push({ name: 'GET /api/agency/seats', pass: false, error: err.message });
  }

  // Test 10: Agency CNAME Co-Branded Audit & Proposal Generation
  console.log('\n[TEST 10] POST /api/audit (CNAME Co-Branded Proposal)');
  try {
    const res = await request('/api/audit', {
      method: 'POST',
      headers: { 'x-forwarded-host': 'audit.signalforgepartners.com' },
      body: {
        business_name: 'Metro Dental Care',
        website_url: 'https://metrodental.example.com',
        city_niche: 'Orlando FL'
      }
    });
    const json = JSON.parse(res.text);
    const pass = res.status === 200 && json.agency?.agency_name === 'SignalForge Growth Partners' && json.proposal_markdown?.includes('SignalForge Growth Partners');
    results.push({ name: 'POST /api/audit (Agency CNAME)', pass, details: `proposalAgency=${json.agency?.agency_name}, markdownLen=${json.proposal_markdown?.length}` });
  } catch (err) {
    results.push({ name: 'POST /api/audit (Agency CNAME)', pass: false, error: err.message });
  }

  console.log('\n================ SMOKE TEST RESULTS ================');
  let allPass = true;
  for (const r of results) {
    const mark = r.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${r.name}] ${r.details || r.error}`);
    if (!r.pass) allPass = false;
  }
  console.log('====================================================\n');

  serverProcess.kill('SIGTERM');
  process.exit(allPass ? 0 : 1);
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  serverProcess.kill('SIGTERM');
  process.exit(1);
});
