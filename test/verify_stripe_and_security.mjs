// test/verify_stripe_and_security.mjs
import { spawn } from 'child_process';

const PORT = 10008;
const BASE = `http://127.0.0.1:${PORT}`;

const p = spawn('node', ['dist/server.cjs'], {
  env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' }
});

async function run() {
  await new Promise(r => setTimeout(r, 1200));

  const checks = [];

  // 1. IndexNow Key File
  const txt = await (await fetch(BASE + '/sendput8f92a1c4b7e34d12a9c8e5f102938475.txt')).text();
  checks.push({ name: 'IndexNow TXT file', pass: txt.trim() === 'sendput8f92a1c4b7e34d12a9c8e5f102938475' });

  // 2. Auth verify-key endpoint
  const k1 = await (await fetch(BASE + '/api/auth/verify-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'SP-FOUNDER-2026' })
  })).json();
  checks.push({ name: 'Founder Key Verified (SP-FOUNDER-2026)', pass: k1.valid && k1.role === 'founder' });

  const k2 = await (await fetch(BASE + '/api/auth/verify-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'SP-GROWTH-2026-LIVE' })
  })).json();
  checks.push({ name: 'Subscriber Key Pattern Verified', pass: k2.valid && k2.role === 'subscriber' });

  const k3 = await fetch(BASE + '/api/auth/verify-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'random-bad-key' })
  });
  checks.push({ name: 'Reject Unauthorized Key (401)', pass: k3.status === 401 });

  // 3. Checkout Products
  const ch1 = await (await fetch(BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'oneshot_29' })
  })).json();
  checks.push({
    name: 'Checkout prod_VVZcNbGZHG46T1 ($29)',
    pass: ch1.stripe_product_id === 'prod_VVZcNbGZHG46T1' && ch1.amount_usd === 29
  });

  const ch2 = await (await fetch(BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'starter_39' })
  })).json();
  checks.push({
    name: 'Checkout prod_VVZfdwEubbbA2G ($39)',
    pass: ch2.stripe_product_id === 'prod_VVZfdwEubbbA2G' && ch2.amount_usd === 39
  });

  const ch3 = await (await fetch(BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'growth_79' })
  })).json();
  checks.push({
    name: 'Checkout prod_VVZgJ0BGZz8r51 ($79)',
    pass: ch3.stripe_product_id === 'prod_VVZgJ0BGZz8r51' && ch3.amount_usd === 79
  });

  const ch4 = await (await fetch(BASE + '/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'agency_299' })
  })).json();
  checks.push({
    name: 'Checkout prod_VVZhif3ZHILKAZ ($299)',
    pass: ch4.stripe_product_id === 'prod_VVZhif3ZHILKAZ' && ch4.amount_usd === 299
  });

  // 4. Verify checkout endpoint
  const v1 = await (await fetch(BASE + '/api/checkout/verify?key=SP-GROWTH-2026-LIVE')).json();
  checks.push({ name: 'Checkout Verify Return Endpoint', pass: v1.verified === true });

  // 5. Portfolio Seeder Authorization
  const s1 = await (await fetch(BASE + '/api/seed-portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-founder-key': 'SP-FOUNDER-2026' }
  })).json();
  checks.push({
    name: 'Portfolio Seeder (4 Brands Seeded)',
    pass: s1.status === 'portfolio_seeded' && s1.seeded_count === 4
  });

  const s2 = await fetch(BASE + '/api/seed-portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-founder-key': 'invalid' }
  });
  checks.push({ name: 'Portfolio Seeder Rejects Bad Key (403)', pass: s2.status === 403 });

  // 6. Public Verified Profile & Trust Badge
  const prof = await (await fetch(BASE + '/verified/myiad-insurance-ai')).text();
  checks.push({ name: 'Public Directory Profile (/verified/:slug)', pass: prof.includes('MyIAD InsuranceAI Ecosystem') });

  const badge = await (await fetch(BASE + '/badge/myiad-insurance-ai.svg')).text();
  checks.push({ name: 'Embeddable SVG Badge (/badge/:slug.svg)', pass: badge.includes('<svg') && badge.includes('AI-VERIFIED ENTITY') });

  p.kill('SIGTERM');

  console.log('--- VERIFICATION SUITE RESULTS ---');
  let allPass = true;
  for (const c of checks) {
    console.log(`${c.pass ? '✅ PASS' : '❌ FAIL'}: ${c.name}`);
    if (!c.pass) allPass = false;
  }
  process.exit(allPass ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  p.kill('SIGTERM');
  process.exit(1);
});
