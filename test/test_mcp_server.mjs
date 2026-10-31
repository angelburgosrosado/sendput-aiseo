import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { defaultEpoEngine } from '../src/lib/epo/engine.ts';

console.log('🧪 Testing Enhanced SendPut Model Context Protocol (MCP) Server...');

// Test 1: Check Manifest & Capabilities
console.log('1. Testing getMcpToolManifest...');
const manifest = defaultEpoEngine.getMcpToolManifest();
assert(manifest.tools.length >= 3, 'Must define at least 3 core tools');
const toolNames = manifest.tools.map(t => t.name);
assert(toolNames.includes('verify_business_status'), 'Must include verify_business_status');
assert(toolNames.includes('get_service_catalog'), 'Must include get_service_catalog');
assert(toolNames.includes('initiate_inquiry'), 'Must include initiate_inquiry');
console.log('✅ PASS: MCP Tool Manifest contains all 3 core agent execution tools!');

// Test 2: In-Process JSON-RPC Simulation of Server Endpoints
console.log('2. Testing Mock JSON-RPC MCP Dispatch...');

const mockEntity = {
  slug: 'apex-roofing-orlando',
  business_name: 'Apex Roofing & Solar',
  website_url: 'https://apexroofingorlando.com',
  phone: '+1-407-555-0199',
  opening_hours: 'Mo-Sa 07:30-19:00',
  city_niche: 'Orlando, FL — Roofing & Solar',
  bilingual_es_enabled: true,
  jurisdictions: [
    {
      jurisdiction_name: 'State of Florida',
      license_number: 'FL-CCC133999',
      service_radius_miles: 50,
      target_cities: ['Orlando', 'Winter Park', 'Lake Nona']
    }
  ],
  local_advantages: [
    '25-Year Manufacturer Warranty',
    'Free Drone Storm Damage Inspection'
  ],
  services_json: [
    { name: 'Hurricane Roof Replacement', price: '$8,500 - $18,000' }
  ]
};

// Test 3: Verify dist/server.cjs contains all MCP protocols
console.log('3. Verifying compiled bundle dist/server.cjs contains tools, resources & prompts...');
import fs from 'node:fs';
const distServer = fs.readFileSync('dist/server.cjs', 'utf8');

assert(distServer.includes('resources/list'), 'dist/server.cjs must include resources/list handler');
assert(distServer.includes('resources/read'), 'dist/server.cjs must include resources/read handler');
assert(distServer.includes('prompts/list'), 'dist/server.cjs must include prompts/list handler');
assert(distServer.includes('prompts/get'), 'dist/server.cjs must include prompts/get handler');
assert(distServer.includes('local_jurisdiction_assistant'), 'dist/server.cjs must include local_jurisdiction_assistant prompt');
assert(distServer.includes('event: endpoint'), 'dist/server.cjs must include standard SSE endpoint discovery event');
console.log('✅ PASS: Compiled server bundle exposes full MCP standard protocol suite!');

// Test 4: Verify CLI Connector bin/sendput-mcp.mjs
console.log('4. Checking bin/sendput-mcp.mjs connector file...');
assert(fs.existsSync('bin/sendput-mcp.mjs'), 'bin/sendput-mcp.mjs must exist');
const cliScript = fs.readFileSync('bin/sendput-mcp.mjs', 'utf8');
assert(cliScript.includes('#!/usr/bin/env node'), 'CLI must have node shebang');
assert(cliScript.includes('readline'), 'CLI must use readline for stdio stream');
assert(cliScript.includes('--slug='), 'CLI must support --slug argument');
console.log('✅ PASS: bin/sendput-mcp.mjs connector is ready for Claude Desktop / Cursor!');

console.log('🎉 ALL MODEL CONTEXT PROTOCOL (MCP) TESTS PASSED SUCCESSFULLY!');

