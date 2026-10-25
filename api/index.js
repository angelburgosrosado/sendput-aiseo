// api/index.js — Vercel Serverless Function entrypoint for SendPut AI
const serverModule = require('../dist/server.cjs');
const app = serverModule.default || serverModule;

module.exports = (req, res) => {
  return app(req, res);
};
