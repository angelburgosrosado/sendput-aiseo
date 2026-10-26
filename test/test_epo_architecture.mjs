// test/test_epo_architecture.mjs — Comprehensive Verification Suite for SendPut EPO Architecture (RFC-2026-GEO-01)
import assert from 'assert';
import { spawn } from 'child_process';

const PORT = 10006;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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

  const res = await fetch(url, { method, headers, body: body || undefined });
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, contentType, text, json };
}

async function main() {
  console.log('================================================================');
  console.log('🚀 Running SendPut EPO Architecture (RFC-2026-GEO-01) Test Suite');
  console.log('================================================================\n');

  // Boot test server
  const serverProcess = spawn('node', ['dist/server.cjs'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (d) => console.log(`[SERVER STDOUT] ${d.toString().trim()}`));
  serverProcess.stderr.on('data', (d) => console.error(`[SERVER STDERR] ${d.toString().trim()}`));

  await wait(1600);

  const tests = [];

  // TEST 1: Health endpoint reports RFC-2026-GEO-01 & EPO Architecture
  try {
    const res = await request('/api/health');
    assert.strictEqual(res.status, 200, 'Health endpoint should return 200');
    assert.strictEqual(res.json.specification, 'RFC-2026-GEO-01');
    assert(res.json.epoArchitecture, 'Missing epoArchitecture in health response');
    assert.strictEqual(res.json.epoArchitecture.specification, 'RFC-2026-GEO-01');
    assert(Array.isArray(res.json.epoArchitecture.pipelineFunctions));
    assert(res.json.epoArchitecture.pipelineFunctions.includes('computeEpoScore'));
    assert(res.json.epoArchitecture.pipelineFunctions.includes('dispatchIndexNowBatch'));
    tests.push({ name: '1. /api/health RFC-2026-GEO-01 specification metadata', pass: true });
  } catch (e) {
    tests.push({ name: '1. /api/health RFC-2026-GEO-01 specification metadata', pass: false, error: e.message });
  }

  // TEST 2: Dashboard Status Endpoint (/api/epo/status)
  try {
    const res = await request('/api/epo/status');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.status, 'active');
    assert.strictEqual(res.json.specification, 'RFC-2026-GEO-01');
    assert(Array.isArray(res.json.pipeline_functions));
    assert(res.json.mcp_tools.includes('verify_business_status'));
    assert(res.json.mcp_tools.includes('get_service_catalog'));
    assert(res.json.mcp_tools.includes('initiate_inquiry'));
    assert(res.json.queue, 'Missing queue status');
    tests.push({ name: '2. /api/epo/status dashboard telemetry & MCP tool listing', pass: true });
  } catch (e) {
    tests.push({ name: '2. /api/epo/status dashboard telemetry & MCP tool listing', pass: false, error: e.message });
  }

  // TEST 3: Background Synchronization Queue Enqueue (/api/epo/sync) & Status (/api/epo/queue)
  try {
    const syncRes = await request('/api/epo/sync', {
      method: 'POST',
      body: { slug: 'myiad-insurance-ai', task_type: 'full_sync' }
    });
    assert.strictEqual(syncRes.status, 200);
    assert.strictEqual(syncRes.json.status, 'enqueued');
    assert(syncRes.json.task.id);
    assert.strictEqual(syncRes.json.task.entitySlug, 'myiad-insurance-ai');

    await wait(300); // Allow queue worker cycle

    const queueRes = await request('/api/epo/queue');
    assert.strictEqual(queueRes.status, 200);
    assert(queueRes.json.recentTasks.length > 0);
    tests.push({ name: '3. /api/epo/sync & /api/epo/queue background job processing', pass: true });
  } catch (e) {
    tests.push({ name: '3. /api/epo/sync & /api/epo/queue background job processing', pass: false, error: e.message });
  }

  // TEST 4: MCP Tool Declarations Manifest Endpoint (/mcp/tools)
  try {
    const res = await request('/mcp/tools');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.protocolVersion, '2026-07-28');
    assert.strictEqual(res.json.serverInfo.specification, 'RFC-2026-GEO-01');
    const toolNames = res.json.tools.map((t) => t.name);
    assert(toolNames.includes('verify_business_status'));
    assert(toolNames.includes('get_service_catalog'));
    assert(toolNames.includes('initiate_inquiry'));
    tests.push({ name: '4. /mcp/tools standardized manifest exports required tools', pass: true });
  } catch (e) {
    tests.push({ name: '4. /mcp/tools standardized manifest exports required tools', pass: false, error: e.message });
  }

  // TEST 5: MCP Tool Execution with RFC-2026-GEO-01 tool names
  try {
    const res = await request('/mcp/myiad-insurance-ai/sse', {
      method: 'POST',
      body: { tool: 'verify_business_status' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.tool_invoked, 'verify_business_status');
    assert.strictEqual(res.json.status, 'executed');
    assert.strictEqual(res.json.result.business_name, 'MyIAD InsuranceAI Ecosystem');
    assert.strictEqual(res.json.result.verified_by, 'SendPut EPO Engine');
    tests.push({ name: '5. /mcp/:slug/sse execution of verify_business_status', pass: true });
  } catch (e) {
    tests.push({ name: '5. /mcp/:slug/sse execution of verify_business_status', pass: false, error: e.message });
  }

  // TEST 6: Token-Budgeted /llms.txt (<2,000 tokens) & Extended /llms-full.txt
  try {
    const res = await request('/v1/tenants/myiad-insurance-ai/llms.txt');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('x-budget-compliant'), 'true');
    const tokenEst = Number(res.headers.get('x-token-estimate') || 0);
    assert(tokenEst > 50 && tokenEst < 2000, `Token estimate ${tokenEst} must be strictly < 2,000 tokens`);

    const fullRes = await request('/v1/tenants/myiad-insurance-ai/llms-full.txt');
    assert.strictEqual(fullRes.status, 200);
    assert(fullRes.text.includes('Extended AI Knowledge Graph & Agent Execution Specification'));
    tests.push({ name: '6. /llms.txt token-budgeted (<2,000 tokens) & /llms-full.txt extended specs', pass: true });
  } catch (e) {
    tests.push({ name: '6. /llms.txt token-budgeted (<2,000 tokens) & /llms-full.txt extended specs', pass: false, error: e.message });
  }

  // TEST 7: Evaluates /api/audit deterministic scoring formula
  // Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)
  try {
    const res = await request('/api/audit', {
      method: 'POST',
      body: {
        business_name: 'Alpha Dental Care',
        website_url: 'https://alphadental.example.com',
        city_niche: 'Miami FL'
      }
    });
    assert.strictEqual(res.status, 200);
    assert(res.json.epo_evaluation, 'Missing epo_evaluation');
    assert(res.json.epo_score !== undefined, 'Missing epo_score');
    assert.strictEqual(
      res.json.epo_evaluation.formula,
      'Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)'
    );
    assert.strictEqual(res.json.epo_evaluation.weights.entityAccuracy, 0.35);
    assert.strictEqual(res.json.epo_evaluation.weights.indexLatency, 0.25);
    assert.strictEqual(res.json.epo_evaluation.weights.citationShare, 0.25);
    assert.strictEqual(res.json.epo_evaluation.weights.agentReadiness, 0.15);
    tests.push({ name: '7. /api/audit deterministic EPO formula evaluation verified', pass: true });
  } catch (e) {
    tests.push({ name: '7. /api/audit deterministic EPO formula evaluation verified', pass: false, error: e.message });
  }

  // TEST 8: IndexNow batch dispatching via engine
  try {
    const res = await request('/api/indexnow/push', {
      method: 'POST',
      body: {
        slug: 'myiad-insurance-ai',
        urls: ['https://saas.myiad.net', 'https://sendput.com/verified/myiad-insurance-ai']
      }
    });
    assert.strictEqual(res.status, 200);
    assert(res.json.dispatch_result, 'Missing dispatch_result from engine');
    assert.strictEqual(res.json.dispatch_result.urlsSubmitted.length, 2);
    tests.push({ name: '8. /api/indexnow/push dispatches batch payloads via SendPutEpoEngine', pass: true });
  } catch (e) {
    tests.push({ name: '8. /api/indexnow/push dispatches batch payloads via SendPutEpoEngine', pass: false, error: e.message });
  }

  console.log('\n================ TEST SUMMARY ================');
  let allPass = true;
  for (const t of tests) {
    const mark = t.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${t.name}] ${t.error ? `-> Error: ${t.error}` : ''}`);
    if (!t.pass) allPass = false;
  }
  console.log('==============================================\n');

  serverProcess.kill('SIGTERM');
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
