import readline from 'node:readline';
import { MCP_TOOLS, executeMcpToolCall } from './tools.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const req = JSON.parse(line);
    const { id = null, method, params = {} } = req;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'sendput-mcp-server',
            version: '1.0.0'
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'notifications/initialized') {
      // No response needed for notification
    } else if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      const { name, arguments: toolArgs = {} } = params;
      try {
        const text = await executeMcpToolCall(name, toolArgs);
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text }],
            isError: false
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (callErr: unknown) {
        const errMsg = callErr instanceof Error ? callErr.message : String(callErr);
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Tool error: ${errMsg}` }],
            isError: true
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } else {
      const response = {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (parseErr: unknown) {
    const response = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' }
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }
});
