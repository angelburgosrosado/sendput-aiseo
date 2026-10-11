import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MCP_TOOLS, executeMcpToolCall } from '../src/mcp/tools.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET provides human and agent readable documentation of available MCP tools
  if (req.method === 'GET') {
    return res.status(200).json({
      name: 'sendput-mcp-server',
      version: '1.0.0',
      description: 'Model Context Protocol (MCP) server for Sendput: Brand Radar, Site Audit, Site Explorer, and Telemetry',
      endpoint: '/api/mcp',
      protocol: 'JSON-RPC 2.0',
      tools_count: MCP_TOOLS.length,
      tools: MCP_TOOLS
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method Not Allowed' }, id: null });
  }

  const { jsonrpc = '2.0', method, params = {}, id = null } = req.body || {};

  try {
    switch (method) {
      case 'initialize': {
        return res.status(200).json({
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
        });
      }

      case 'notifications/initialized': {
        return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
      }

      case 'tools/list': {
        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS
          }
        });
      }

      case 'tools/call': {
        const { name, arguments: toolArgs = {} } = params;
        if (!name) {
          return res.status(400).json({
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Missing tool name in params' }
          });
        }

        const outputText = await executeMcpToolCall(name, toolArgs);
        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: outputText
              }
            ],
            isError: false
          }
        });
      }

      default:
        return res.status(400).json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unsupported method: ${method}` }
        });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message }
    });
  }
}
