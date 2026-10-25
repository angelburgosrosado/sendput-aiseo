// api/[...path].js — Catch-all Vercel Serverless Function for SendPut AI
const serverModule = require('../dist/server.cjs');
const app = serverModule.default || serverModule;

module.exports = (req, res) => {
  return app(req, res);
};
