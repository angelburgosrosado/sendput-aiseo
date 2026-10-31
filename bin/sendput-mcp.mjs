#!/usr/bin/env node
/**
 * bin/sendput-mcp.mjs — SendPut Model Context Protocol (MCP) stdio Connector
 * Standard MCP JSON-RPC 2.0 stdio server for Claude Desktop, Cursor, and developer tools.
 * 
 * Usage:
 *   node bin/sendput-mcp.mjs --slug=apex-roofing-orlando
 *   npx sendput-mcp --slug=myiad-insurance-ai --host=https://sendput.com
 * 
 * Claude Desktop Configuration (~/Library/Application Support/Claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "sendput-apex": {
 *       "command": "node",
 *       "args": ["/path/to/sendput-ai-signalforge-3/bin/sendput-mcp.mjs", "--slug=apex-roofing-orlando"]
 *     }
 *   }
 * }
 */

import readline from 'node:readline';

const args = process.argv.slice(2);
let slug = 'apex-roofing-orlando';
let host = process.env.SENDPUT_HOST || 'http://localhost:3000';

for (const arg of args) {
  if (arg.startsWith('--slug=')) {
    slug = arg.split('=')[1];
  } else if (arg.startsWith('--host=')) {
    host = arg.split('=')[1];
  } else if (arg === '--help' || arg === '-h') {
    console.error(`SendPut MCP stdio Gateway
Usage:
  sendput-mcp [--slug=<tenant-slug>] [--host=<sendput-url>]

Options:
  --slug  Tenant identifier (default: apex-roofing-orlando)
  --host  SendPut host URL (default: http://localhost:3000 or $SENDPUT_HOST)
`);
    process.exit(0);
  }
}

// Fallback to sendput.com if local server is unreachable
async function sendRpc(payload) {
  const targetUrl = `${host.replace(/\/$/, '')}/mcp/${slug}`;
  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // If local host failed and wasn't explicitly forced, attempt public cloud fallback
    if (!host.includes('sendput.com')) {
      try {
        const fallbackRes = await fetch(`https://sendput.com/mcp/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      } catch {}
    }
  }

  // Graceful fallback for offline / disconnected development
  return {
    jsonrpc: '2.0',
    id: payload?.id ?? '1',
    error: {
      code: -32603,
      message: `Failed to connect to SendPut MCP node at ${targetUrl}. Ensure the server is online.`
    }
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const message = JSON.parse(trimmed);

    // Initialized notification has no response in JSON-RPC
    if (message.method === 'notifications/initialized') {
      return;
    }

    const rpcResponse = await sendRpc(message);
    process.stdout.write(JSON.stringify(rpcResponse) + '\n');
  } catch (parseErr) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${parseErr.message}`
      }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

