// test/verify_proactive_defenses.mjs — Comprehensive Test Suite for the 5 Proactive Defenses
import assert from 'assert';
import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 10009;
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
  console.log('🛡️  Running SendPut 5 Proactive Defenses Test Suite');
  console.log('================================================================\n');

  // Boot production server
  const serverProcess = spawn('node', ['dist/server.cjs'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (d) => console.log(`[SERVER STDOUT] ${d.toString().trim()}`));
  serverProcess.stderr.on('data', (d) => console.error(`[SERVER STDERR] ${d.toString().trim()}`));

  await wait(1600);

  const tests = [];

  // --------------------------------------------------------------------------
  // DEFENSE 1: Stripe & Webhook Isolation / Server-Side Entitlements
  // --------------------------------------------------------------------------
  console.log('\n--- DEFENSE 1: Server-Side Entitlement & Webhook Isolation ---');
  try {
    // 1A: Unauthenticated call to protected management endpoint (/api/agency) should be rejected
    const unauthAgency = await request('/api/agency', {
      method: 'POST',
      body: { agency_name: 'Hacker Agency', slug: 'hacked' }
    });
    assert.strictEqual(unauthAgency.status, 403, 'Unauthenticated agency write must be rejected with 403');
    assert.strictEqual(unauthAgency.json.code, 'UNAUTHORIZED_ENTITLEMENT');

    // 1B: Fake frontend flag (e.g. isUnlocked: true) in body must be ignored
    const bypassAttempt = await request('/api/agency', {
      method: 'POST',
      body: { agency_name: 'Hacker Agency', isUnlocked: true, founderUnlocked: true }
    });
    assert.strictEqual(bypassAttempt.status, 403, 'Client-side flags must never bypass server entitlement');

    // 1C: Authenticated call with server-verified Founder Key succeeds
    const authAgency = await request('/api/agency', {
      method: 'POST',
      headers: { 'x-founder-key': 'SP-FOUNDER-2026' },
      body: { agency_name: 'SendPut EPO Growth Partners', slug: 'epo-partners' }
    });
    assert.strictEqual(authAgency.status, 200, 'Authenticated founder key must succeed');

    tests.push({ name: 'Defense 1: Server-side entitlement middleware blocks client-side bypasses', pass: true });
  } catch (e) {
    tests.push({ name: 'Defense 1: Server-side entitlement middleware blocks client-side bypasses', pass: false, error: e.message });
  }

  // --------------------------------------------------------------------------
  // DEFENSE 2: Rate-Limit Public Audits
  // --------------------------------------------------------------------------
  console.log('\n--- DEFENSE 2: Rate-Limit Public Audits ---');
  try {
    const testIp = '198.51.100.42'; // Simulated client IP
    let lastRemaining = 10;
    let hitRateLimit = false;

    // Send 10 free audit requests
    for (let i = 1; i <= 10; i++) {
      const res = await request('/api/audit', {
        method: 'POST',
        headers: { 'x-forwarded-for': testIp },
        body: { business_name: 'Test SMB', website_url: 'https://example.com' }
      });
      assert.strictEqual(res.status, 200, `Request ${i} should succeed`);
      const rem = Number(res.headers.get('x-ratelimit-remaining'));
      lastRemaining = rem;
    }

    assert.strictEqual(lastRemaining, 0, 'Remaining quota after 10 requests should be 0');

    // 11th request should trigger HTTP 429 Too Many Requests
    const rateLimitedRes = await request('/api/audit', {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: { business_name: 'Scraper Bot', website_url: 'https://example.com' }
    });

    assert.strictEqual(rateLimitedRes.status, 429, '11th request must return HTTP 429');
    assert.strictEqual(rateLimitedRes.json.code, 'RATE_LIMIT_EXCEEDED');
    assert(rateLimitedRes.headers.get('retry-after'), 'Must include Retry-After header');

    // Authenticated key bypasses rate limit
    const authAudit = await request('/api/audit', {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp, 'x-founder-key': 'SP-FOUNDER-2026' },
      body: { business_name: 'Pro Client', website_url: 'https://example.com' }
    });
    assert.strictEqual(authAudit.status, 200, 'Authenticated key must bypass public audit rate limit');
    assert.strictEqual(authAudit.headers.get('x-ratelimit-limit'), 'unlimited');

    tests.push({ name: 'Defense 2: Sliding-window rate limit enforces 10 audits/10min per IP with 429 & Retry-After', pass: true });
  } catch (e) {
    tests.push({ name: 'Defense 2: Sliding-window rate limit enforces 10 audits/10min per IP with 429 & Retry-After', pass: false, error: e.message });
  }

  // --------------------------------------------------------------------------
  // DEFENSE 3: Obfuscate Production Builds & Strip Source Maps
  // --------------------------------------------------------------------------
  console.log('\n--- DEFENSE 3: Obfuscate Production Builds & Strip Source Maps ---');
  try {
    // 3A: Requesting any .map file returns HTTP 404 with SOURCEMAP_PROTECTION
    const mapRes = await request('/server.cjs.map');
    assert.strictEqual(mapRes.status, 404);
    assert.strictEqual(mapRes.json.code, 'SOURCEMAP_PROTECTION');

    const deepMapRes = await request('/dist/assets/app.js.map');
    assert.strictEqual(deepMapRes.status, 404);

    // 3B: Verify dist/server.cjs does not contain sourceMappingURL
    const bundleContent = fs.readFileSync('dist/server.cjs', 'utf8');
    assert(!bundleContent.includes('sourceMappingURL='), 'Production bundle must not contain sourceMappingURL');

    // 3C: Security headers present
    const healthRes = await request('/api/health');
    assert.strictEqual(healthRes.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(healthRes.headers.get('x-frame-options'), 'SAMEORIGIN');

    tests.push({ name: 'Defense 3: Source maps stripped, obfuscated bundles, security headers enforced', pass: true });
  } catch (e) {
    tests.push({ name: 'Defense 3: Source maps stripped, obfuscated bundles, security headers enforced', pass: false, error: e.message });
  }

  // --------------------------------------------------------------------------
  // DEFENSE 4: Copyright & Trademark Formalities
  // --------------------------------------------------------------------------
  console.log('\n--- DEFENSE 4: Copyright & Trademark Formalities ---');
  try {
    // 4A: Terms endpoint
    const termsRes = await request('/terms');
    assert.strictEqual(termsRes.status, 200);
    assert(termsRes.json.trademarks.includes('SendPut™'));
    assert(termsRes.json.trademarks.includes('Entity Presence Optimization (EPO)™'));

    // 4B: Dual license endpoint
    const licenseRes = await request('/license');
    assert.strictEqual(licenseRes.status, 200);
    assert.strictEqual(licenseRes.json.proprietary_backend.license, 'Proprietary Closed-Source Commercial License');
    assert.strictEqual(licenseRes.json.open_source_sdk.license, 'MIT License');

    // 4C: LICENSE and LEGAL.md files exist
    assert(fs.existsSync('LICENSE'), 'LICENSE file must exist');
    assert(fs.existsSync('LEGAL.md'), 'LEGAL.md file must exist');
    const licenseFile = fs.readFileSync('LICENSE', 'utf8');
    assert(licenseFile.includes('Proprietary Commercial License'));
    assert(licenseFile.includes('MIT Open-Source License'));

    // 4D: UI Footer verification
    const uiRes = await request('/');
    assert(uiRes.text.includes('© 2026 SendPut AI Technologies Inc.'));
    assert(uiRes.text.includes('SendPut EPO Engine™'));
    assert(uiRes.text.includes('id="btn-footer-terms"'));
    assert(uiRes.text.includes('id="btn-footer-dmca"'));

    tests.push({ name: 'Defense 4: Copyright & trademark notices, terms of service, and dual licensing', pass: true });
  } catch (e) {
    tests.push({ name: 'Defense 4: Copyright & trademark notices, terms of service, and dual licensing', pass: false, error: e.message });
  }

  // --------------------------------------------------------------------------
  // DEFENSE 5: DMCA Fast-Track Protocol
  // --------------------------------------------------------------------------
  console.log('\n--- DEFENSE 5: DMCA Fast-Track Protocol ---');
  try {
    // 5A: /dmca endpoint
    const dmcaRes = await request('/dmca');
    assert.strictEqual(dmcaRes.status, 200);
    assert.strictEqual(dmcaRes.json.designated_agent.email, 'dmca@sendput.com');
    assert.strictEqual(dmcaRes.json.fast_track_sla, '24-48 Hours to Host/Registrar Abuse Teams');

    // 5B: DMCA.md file exists and has statutory template
    assert(fs.existsSync('DMCA.md'), 'DMCA.md file must exist');
    const dmcaFile = fs.readFileSync('DMCA.md', 'utf8');
    assert(dmcaFile.includes('17 U.S.C. § 512(c)(3)'));
    assert(dmcaFile.includes('Lanham Act'));
    assert(dmcaFile.includes('dmca@vercel.com'));
    assert(dmcaFile.includes('abuse@cloudflare.com'));

    tests.push({ name: 'Defense 5: DMCA fast-track policy, designated agent, and statutory takedown templates', pass: true });
  } catch (e) {
    tests.push({ name: 'Defense 5: DMCA fast-track policy, designated agent, and statutory takedown templates', pass: false, error: e.message });
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
